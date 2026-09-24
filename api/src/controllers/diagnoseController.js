/**
 * diagnoseController.js
 *
 * Implements two modes:
 *
 * 1. POST /api/diagnose/question
 *    Decision-tree walk: given the current node ID and the user's answer value,
 *    returns the next node (Question | Genus | Outcome) from the Neo4j graph.
 *    This drives the step-by-step guided identification.
 *
 * 2. POST /api/diagnose/score
 *    Scoring engine: given a complete set of CHR observations, scores all genera
 *    in the relevant module (M=+3, D=+5, S=+1, C=-5) and returns a ranked list
 *    with confidence status (CONFIRMED / PROBABLE / CANDIDATE / INDETERMINATE /
 *    NO_MATCH_WITHIN_CORE_TAXA).
 *
 * 3. POST /api/diagnose (legacy kept for compat)
 *    Simple text-search pass-through (returns genus list from graph).
 */

const { getSession } = require("../db/neo4j");
const { scoreGenera } = require("../services/scoring");

const NEUTRAL_STATES = new Set(["NOT_OBSERVABLE", "UNCERTAIN"]);

// ─── ENDPOINT 1: decision-tree question walk ───────────────────────────────

/**
 * POST /api/diagnose/question
 * Body: { nodeId: "AGG_Q1" | null, answerValue: "AGGLUTINATED" | null, module: "AGGLUTINATED" | null }
 *
 * - If nodeId is null/missing, returns the module entry question for CHR_01 (composition selector).
 * - Otherwise walks the ANSWER edge matching answerValue from nodeId.
 * - Returns: { nodeType, node, evidence }
 *   nodeType: "question" | "genus" | "outcome" | "module_select"
 */
exports.question = async (req, res) => {
  const { nodeId, answerValue, module: moduleName } = req.body || {};
  const session = getSession();

  try {
    // ── Case 1: Start — return composition entry question info
    if (!nodeId) {
      const result = await session.run(
        `MATCH (c:Character {id: 'CHR_01'})-[:ALLOWS]->(v:Value)
         RETURN c.nameEn AS nameEn, c.nameTr AS nameTr,
                c.id AS chrId,
                collect({code: v.code, labelTr: v.labelTr, labelEn: v.labelEn}) AS values`
      );
      const rec = result.records[0];
      return res.json({
        nodeType: "module_select",
        node: {
          id: "START",
          textEn: "What is the test composition?",
          textTr: "Kavkı bileşimi nedir?",
          chrId: "CHR_01",
          values: rec.get("values").filter((v) => v.code !== "UNCERTAIN"),
        },
      });
    }

    // ── Case 2: Walk ANSWER edge from current Question node
    if (!answerValue) {
      return res.status(400).json({ success: false, error: "answerValue required" });
    }

    // ── NOT_OBSERVABLE: user can't determine this character ─────────────────
    // Collect all genera reachable from all branches of this question node
    // and return an informative outcome so the wizard doesn't crash.
    if (answerValue === "NOT_OBSERVABLE") {
      const reachableResult = await session.run(
        `MATCH (q:Question {id: $nodeId})-[:ANSWER*1..10]->(g:Genus)
         RETURN DISTINCT g.name AS name, g.module AS module
         ORDER BY g.name`,
        { nodeId }
      );
      const reachableGenera = reachableResult.records.map((r) => ({
        name: r.get("name"),
        module: r.get("module"),
      }));

      // Also check how many remaining questions there are on the branches
      const branchResult = await session.run(
        `MATCH (q:Question {id: $nodeId})-[a:ANSWER]->(next)
         RETURN a.value AS value, a.labelTr AS labelTr,
                CASE WHEN next:Genus THEN 'genus' WHEN next:Outcome THEN 'outcome' ELSE 'question' END AS nextType
         ORDER BY a.value`,
        { nodeId }
      );
      const branches = branchResult.records.map((r) => ({
        value: r.get("value"),
        labelTr: r.get("labelTr"),
        nextType: r.get("nextType"),
      }));

      return res.json({
        nodeType: "outcome",
        node: {
          id: `${nodeId}_NOT_OBSERVABLE`,
          kind: "NOT_OBSERVABLE",
          message: `Bu karakter gözlenemediğinden karar ağacında ilerlenemiyor. Bu noktadan itibaren ${reachableGenera.length} olası cins bulunuyor.`,
          reachableGenera,
          skippedQuestion: nodeId,
          availableBranches: branches,
        },
      });
    }

    const result = await session.run(
      `MATCH (q:Question {id: $nodeId})-[a:ANSWER]->(next)
       WHERE a.value = $answerValue OR a.value = '*'
       RETURN labels(next) AS labels, next, a.value AS val
       ORDER BY a.value = $answerValue DESC
       LIMIT 1`,
      { nodeId, answerValue }
    );

    if (result.records.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No edge from ${nodeId} with value ${answerValue}`,
      });
    }

    const rec = result.records[0];
    const nodeLabels = rec.get("labels");
    const nextNode = rec.get("next").properties;

    if (nodeLabels.includes("Genus")) {
      // Leaf: reached a genus — fetch its rules
      const rulesResult = await session.run(
        `MATCH (g:Genus {name: $name})-[r:HAS_RULE]->(ri:RuleItem)
         RETURN r.level AS level, ri.text AS text, ri.code AS code
         ORDER BY CASE r.level WHEN 'MANDATORY' THEN 0 WHEN 'DIAGNOSTIC' THEN 1 WHEN 'SUPPORTING' THEN 2 ELSE 3 END`,
        { name: nextNode.name }
      );

      const compResult = await session.run(
        `MATCH (g:Genus {name: $name})-[:CLOSEST_COMPARISON]->(g2:Genus)
         RETURN collect(g2.name) AS comparisons`,
        { name: nextNode.name }
      );

      const rules = { MANDATORY: [], DIAGNOSTIC: [], SUPPORTING: [], CONTRADICTORY: [] };
      for (const r of rulesResult.records) {
        rules[r.get("level")]?.push({ text: r.get("text"), code: r.get("code") });
      }
      const comparisons = compResult.records[0]?.get("comparisons") || [];

      return res.json({
        nodeType: "genus",
        node: {
          name: nextNode.name,
          module: nextNode.module,
          flag: nextNode.flag || null,
          taxonomicReviewRequired: nextNode.taxonomicReviewRequired || false,
          rules,
          closestComparisons: comparisons,
        },
      });
    }

    if (nodeLabels.includes("Outcome")) {
      return res.json({
        nodeType: "outcome",
        node: {
          id: nextNode.id,
          kind: nextNode.kind,
        },
      });
    }

    // Question node: return question data + its possible answers
    const answersResult = await session.run(
      `MATCH (q:Question {id: $qId})-[a:ANSWER]->(next)
       RETURN a.value AS value, a.labelTr AS labelTr, a.labelEn AS labelEn,
              CASE WHEN next:Genus THEN 'genus' WHEN next:Outcome THEN 'outcome' ELSE 'question' END AS nextType
       ORDER BY a.value`,
      { qId: nextNode.id }
    );

    const answers = answersResult.records.map((r) => ({
      value: r.get("value"),
      labelEn: r.get("labelEn"),
      labelTr: r.get("labelTr"),
      nextType: r.get("nextType"),
    }));

    // Get character info if available
    let charInfo = null;
    if (nextNode.chrId) {
      const charResult = await session.run(
        `MATCH (c:Character {id: $chrId})-[:ALLOWS]->(v:Value)
         RETURN c.nameEn AS nameEn, c.nameTr AS nameTr,
                collect({code: v.code, labelTr: v.labelTr, labelEn: v.labelEn}) AS values`,
        { chrId: nextNode.chrId }
      );
      if (charResult.records.length > 0) {
        const cr = charResult.records[0];
        charInfo = {
          id: nextNode.chrId,
          nameEn: cr.get("nameEn"),
          nameTr: cr.get("nameTr"),
          values: cr.get("values"),
        };
      }
    }

    return res.json({
      nodeType: "question",
      node: {
        id: nextNode.id,
        code: nextNode.code,
        textEn: nextNode.textEn,
        textTr: nextNode.textTr,
        module: nextNode.module,
        chrId: nextNode.chrId || null,
        sectionSensitive: nextNode.sectionSensitive || false,
        observationHint: nextNode.observationHint || null,
        answers,
        character: charInfo,
      },
    });
  } catch (error) {
    console.error("Question error:", error);
    res.status(500).json({ success: false, error: "Graf sorgusu başarısız." });
  } finally {
    await session.close();
  }
};

// ─── ENDPOINT 2: scoring engine ───────────────────────────────────────────

/**
 * POST /api/diagnose/score
 * Body: {
 *   observations: { CHR_01: {value:'AGGLUTINATED', state:'PRESENT'}, ... },
 *   module: 'AGGLUTINATED' | 'PORCELANEOUS' | 'HYALINE'  (optional, derived from CHR_01)
 * }
 *
 * Returns full scoring results ranked by score, with confidence status.
 */
exports.score = async (req, res) => {
  const { observations = {}, module: moduleParam } = req.body || {};
  const session = getSession();

  try {
    // Determine module from CHR_01 or param
    const CHR01_TO_MODULE = {
      AGGLUTINATED: "AGGLUTINATED",
      PORCELANEOUS: "PORCELANEOUS",
      HYALINE: "HYALINE",
    };
    const chr01 = observations["CHR_01"];
    const moduleName =
      moduleParam ||
      (chr01 && !NEUTRAL_STATES.has(chr01.state) && CHR01_TO_MODULE[chr01.value]) ||
      null;

    // Fetch all genera + their rules (with REFERS_TO character mappings)
    const cypher = moduleName
      ? `MATCH (g:Genus)-[:BELONGS_TO]->(m:Module {name: $module})
         MATCH (g)-[hr:HAS_RULE]->(r:RuleItem)
         OPTIONAL MATCH (r)-[ref:REFERS_TO]->(c:Character)
         RETURN g.name AS genus, g.module AS module,
                g.flag AS flag, g.taxonomicReviewRequired AS taxFlag,
                hr.level AS level,
                r.key AS ruleKey, r.text AS ruleText,
                collect({chrId: c.id, value: ref.suggestedValue, confidence: ref.confidence}) AS mappings`
      : `MATCH (g:Genus)-[hr:HAS_RULE]->(r:RuleItem)
         OPTIONAL MATCH (r)-[ref:REFERS_TO]->(c:Character)
         RETURN g.name AS genus, g.module AS module,
                g.flag AS flag, g.taxonomicReviewRequired AS taxFlag,
                hr.level AS level,
                r.key AS ruleKey, r.text AS ruleText,
                collect({chrId: c.id, value: ref.suggestedValue, confidence: ref.confidence}) AS mappings`;

    const result = await session.run(cypher, moduleName ? { module: moduleName } : {});

    // Group rules by genus
    const generaMap = {};
    for (const rec of result.records) {
      const gname = rec.get("genus");
      if (!generaMap[gname]) {
        generaMap[gname] = {
          genus: gname,
          module: rec.get("module"),
          flag: rec.get("flag"),
          taxonomicReviewRequired: rec.get("taxFlag"),
          rules: [],
        };
      }
      const mappings = (rec.get("mappings") || []).filter(
        (m) => m.chrId !== null && m.value !== null
      );
      generaMap[gname].rules.push({
        level: rec.get("level"),
        text: rec.get("ruleText"),
        mappings,
      });
    }

    const scoredResults = scoreGenera(observations, generaMap);

    res.json({
      success: true,
      observedCharacterCount: Object.values(observations).filter(o => o && o.state !== "NOT_OBSERVABLE" && o.state !== "UNCERTAIN").length,
      module: moduleName,
      ...scoredResults
    });
  } catch (error) {
    console.error("Score error:", error);
    res.status(500).json({ success: false, error: "Puanlama sorgusu başarısız." });
  } finally {
    await session.close();
  }
};

// ─── ENDPOINT 3: legacy diagnose (genus list from graph) ──────────────────

exports.diagnose = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (g:Genus)-[:BELONGS_TO]->(m:Module)
       RETURN g.name AS name, m.name AS module
       ORDER BY m.name, g.name`
    );
    const genera = result.records.map((r) => ({
      name: r.get("name"),
      module: r.get("module"),
    }));
    res.json({ success: true, count: genera.length, data: genera });
  } catch (error) {
    console.error("Diagnose error:", error);
    res.status(500).json({ success: false, error: "Veritabanı sorgusu başarısız." });
  } finally {
    await session.close();
  }
};

// ─── ENDPOINT 4: module entry question ────────────────────────────────────

/**
 * POST /api/diagnose/question/entry
 * Body: { module: 'AGGLUTINATED' | 'PORCELANEOUS' | 'HYALINE' }
 * Returns the first question of the module's decision tree with its answers.
 */
exports.questionEntry = async (req, res) => {
  const { module: moduleName } = req.body || {};
  if (!moduleName) {
    return res.status(400).json({ success: false, error: "module required" });
  }
  const session = getSession();
  try {
    const entryResult = await session.run(
      `MATCH (m:Module {name: $module})-[:TREE_ENTRY]->(q:Question) RETURN q`,
      { module: moduleName }
    );
    if (entryResult.records.length === 0) {
      return res.status(404).json({ success: false, error: `No tree entry for ${moduleName}` });
    }
    const qNode = entryResult.records[0].get("q").properties;

    const answersResult = await session.run(
      `MATCH (q:Question {id: $qId})-[a:ANSWER]->(next)
       RETURN a.value AS value, a.labelTr AS labelTr, a.labelEn AS labelEn,
              CASE WHEN next:Genus THEN 'genus' WHEN next:Outcome THEN 'outcome' ELSE 'question' END AS nextType
       ORDER BY a.value`,
      { qId: qNode.id }
    );
    const answers = answersResult.records.map((r) => ({
      value: r.get("value"),
      labelEn: r.get("labelEn"),
      labelTr: r.get("labelTr"),
      nextType: r.get("nextType"),
    }));

    let charInfo = null;
    if (qNode.chrId) {
      const charResult = await session.run(
        `MATCH (c:Character {id: $chrId})-[:ALLOWS]->(v:Value)
         RETURN c.nameEn AS nameEn, c.nameTr AS nameTr,
                collect({code: v.code, labelTr: v.labelTr, labelEn: v.labelEn}) AS values`,
        { chrId: qNode.chrId }
      );
      if (charResult.records.length > 0) {
        const cr = charResult.records[0];
        charInfo = { id: qNode.chrId, nameEn: cr.get("nameEn"), nameTr: cr.get("nameTr"), values: cr.get("values") };
      }
    }

    return res.json({
      nodeType: "question",
      node: {
        id: qNode.id, code: qNode.code, textEn: qNode.textEn, textTr: qNode.textTr,
        module: qNode.module, chrId: qNode.chrId || null,
        sectionSensitive: qNode.sectionSensitive || false,
        observationHint: qNode.observationHint || null,
        answers, character: charInfo,
      },
    });
  } catch (error) {
    console.error("questionEntry error:", error);
    res.status(500).json({ success: false, error: "Graf sorgusu basarisiz." });
  } finally {
    await session.close();
  }
};
