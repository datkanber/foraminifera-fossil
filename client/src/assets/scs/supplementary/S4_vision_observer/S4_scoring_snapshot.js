/**
 * scoring.js
 * 
 * Implements the Manuscript v18 (Engine M) scoring algorithm for foraminifera diagnosis.
 * 
 * Includes Tablo XIII test case.
 */

const SCORES = { MANDATORY: 3, DIAGNOSTIC: 5, SUPPORTING: 1, CONTRADICTORY: -5 };

const VALUE_IMPLIES = {
  "CHR_11:WELL_DEVELOPED":          [["CHR_11", "PRESENT"]],
  "CHR_11:WEAKLY_DEVELOPED":        [["CHR_11", "PRESENT"]],
  "CHR_14:STRONG":                  [["CHR_14", "PRESENT"]],
  "CHR_14:WEAK":                    [["CHR_14", "PRESENT"]],
  "CHR_15:WELL_DEVELOPED":          [["CHR_15", "PRESENT"]],
  "CHR_15:WEAKLY_DEVELOPED":        [["CHR_15", "PRESENT"]],
  "CHR_17:STRONG":                  [["CHR_17", "PRESENT"]],
  "CHR_17:WEAK":                    [["CHR_17", "PRESENT"]],
  "CHR_09:PLANISPIRAL_TO_BISERIAL": [["CHR_06", "PLANISPIRAL"], ["CHR_05", "BISERIAL"]],
  "CHR_09:PLANISPIRAL_TO_UNISERIAL":[["CHR_06", "PLANISPIRAL"], ["CHR_05", "UNISERIAL"]],
  "CHR_09:BISERIAL_TO_UNISERIAL":   [["CHR_05", "BISERIAL"],   ["CHR_05", "UNISERIAL"]],
  "CHR_09:TRISERIAL_TO_BISERIAL":   [["CHR_05", "TRISERIAL"],  ["CHR_05", "BISERIAL"]],
  "CHR_09:TRISERIAL_TO_UNISERIAL":  [["CHR_05", "TRISERIAL"],  ["CHR_05", "UNISERIAL"]],
};

function buildH(obs) {
  const h = {};
  for (const [c, o] of Object.entries(obs)) {
    if (c === "CHR_21" || !o || o.state === "NOT_OBSERVABLE" || o.state === "UNCERTAIN" || !o.value) continue;
    if (!h[c]) h[c] = new Set();
    h[c].add(o.value);
    
    const implied = VALUE_IMPLIES[`${c}:${o.value}`] || [];
    for (const [ic, iv] of implied) {
      if (!h[ic]) h[ic] = new Set();
      h[ic].add(iv);
    }
  }
  return h;
}

function evaluateRuleM(h, mappings) {
  const validMappings = mappings ? mappings.filter(m => m.value) : [];
  if (validMappings.length === 0) {
    return { verdict: 'NEUTRAL', held: new Set() };
  }
  
  // Group rule mappings by character (multi-mapping evaluation, conjunctive across characters, disjunctive within)
  const groups = {};
  for (const m of validMappings) {
    const c = m.chrId || m.chr_id;
    if (!groups[c]) groups[c] = new Set();
    groups[c].add(m.value);
  }
  
  let anyhold = false;
  const held = new Set();
  
  for (const c of Object.keys(groups)) {
    if (h[c]) {
      const hit = [...groups[c]].filter(v => h[c].has(v));
      if (hit.length === 0) {
        return { verdict: 'MISMATCH', held: new Set() };
      }
      anyhold = true;
      for (const v of hit) held.add(`${c}:${v}`);
    }
    // If not in h[c], it is unobserved. We skip this character group. 
    // It doesn't cause a MISMATCH unless a character was observed and contradicts.
  }
  
  return anyhold ? { verdict: 'MATCH', held } : { verdict: 'NEUTRAL', held: new Set() };
}

function isSubset(setA, setB) {
  for (const elem of setA) {
    if (!setB.has(elem)) return false;
  }
  return true;
}

/**
 * Scores a set of genera using Engine M (Manuscript v18) definitions.
 * @param {Object} observations 
 * @param {Object} generaMap - { "GenusName": { genus, module, flag, taxonomicReviewRequired, rules: [{ level, text, mappings }] } }
 * @returns {Object} { status, identification, confidenceNote, ranking, excluded }
 */
function scoreGenera(observations, generaMap) {
  const h = buildH(observations);
  const scored = [];
  
  let nObserved = 0;
  for (const [chr, o] of Object.entries(observations)) {
    if (chr !== "CHR_21" && chr !== "CHR_01" && o && o.state !== "NOT_OBSERVABLE" && o.state !== "UNCERTAIN") {
      nObserved++;
    }
  }
  
  for (const g of Object.values(generaMap)) {
    let score = 0;
    let mv = false;
    let nc = 0;
    let nd = 0;
    const Dset = new Set();
    let m01 = false;
    let dnm = false;
    
    let mandatoryTotal = 0;
    let mandatoryMatched = 0;
    const mandatoryViolated = [];
    const diagnosticMatched = [];
    const diagnosticUnobservable = [];
    const supportingMatched = [];
    const contradictions = [];
    const matchedEvidence = [];
    const neutralRules = [];

    for (const rule of g.rules) {
      const { verdict, held } = evaluateRuleM(h, rule.mappings);
      const L = rule.level;
      
      const text = rule.text;
      const detail = rule.mappings ? rule.mappings.map(m => `${m.chrId || m.chr_id}=${m.value}`).join(", ") : "";

      if (L === "CONTRADICTORY") {
        if (verdict === "MATCH") {
          nc++;
          contradictions.push(`${text} [${detail}]`);
        }
        continue;
      }
      
      if (L === "MANDATORY") mandatoryTotal++;
      
      if (verdict === "MATCH") {
        score += SCORES[L] || 0;
        matchedEvidence.push({ level: L[0], text, detail });
        
        if (L === "MANDATORY") {
          mandatoryMatched++;
          const hasNon01 = [...held].some(kv => !kv.startsWith("CHR_01:"));
          if (hasNon01) m01 = true;
        } else if (L === "DIAGNOSTIC") {
          nd++;
          for (const kv of held) Dset.add(kv);
          diagnosticMatched.push(text);
        } else if (L === "SUPPORTING") {
          supportingMatched.push(text);
        }
      }
      
      if (L === "MANDATORY" && verdict === "MISMATCH") {
        mv = true;
        mandatoryViolated.push(`${text} [${detail}]`);
      }
      
      if (L === "DIAGNOSTIC" && verdict === "NEUTRAL" && rule.mappings && rule.mappings.length > 0) {
        dnm = true;
        diagnosticUnobservable.push(text);
        neutralRules.push({ level: 'D', text });
      } else if (verdict === "NEUTRAL") {
        neutralRules.push({ level: L[0], text });
      }
    }
    
    score -= 5 * nc;
    const excluded = mv || (nc >= 1 && score < 0);
    let exclusionReason = null;
    if (mv) exclusionReason = "mandatory character incompatible: " + mandatoryViolated[0];
    else if (nc >= 1 && score < 0) exclusionReason = "strong contradiction: " + contradictions[0];
    
    scored.push({
      genus: g.genus,
      module: g.module,
      flag: g.flag || null,
      taxonomicReviewRequired: g.taxonomicReviewRequired || false,
      score,
      mandatoryTotal,
      mandatoryMatched,
      mandatoryViolated,
      diagnosticMatched,
      diagnosticUnobservable,
      supportingMatched,
      contradictions,
      matchedEvidence,
      neutralRules,
      excluded,
      exclusionReason,
      // Engine M internals
      _nd: nd,
      _Dset: Dset,
      _nc: nc,
      _m01: m01,
      _dnm: dnm
    });
  }
  
  const active = scored.filter(r => !r.excluded).sort((a, b) => b.score - a.score || b._nd - a._nd);
  const excludedArr = scored.filter(r => r.excluded);
  
  let status = "INDETERMINATE";
  let identification = null;
  let confidenceNote = null;
  
  if (active.length === 0) {
    status = nObserved >= 3 ? "NO_MATCH_WITHIN_CORE_TAXA" : "INDETERMINATE";
    confidenceNote = status === "NO_MATCH_WITHIN_CORE_TAXA" 
      ? "VALID_NO_MATCH"
      : "INSUFFICIENT_OBSERVATIONS";
  } else {
    const g1 = active[0];
    const g2 = active.length > 1 ? active[1] : null;
    
    if (nObserved < 2 || !g1._m01) {
      status = "INDETERMINATE";
      confidenceNote = "INSUFFICIENT_OBSERVATIONS_LEAD";
    } else {
      const hasD = g1._Dset.size > 0;
      const noC = g1._nc === 0;
      const sep = g2 === null ? true : ((g1.score - g2.score >= 1) && !isSubset(g1._Dset, g2._Dset));
      
      if (hasD && noC && sep) {
        status = "CONFIRMED_GENUS";
        identification = g1.genus;
      } else if (g2 && g1.score === g2.score) {
        status = "CANDIDATE_GENUS";
        identification = g1.genus;
        confidenceNote = "TIE_BREAK_FAILED";
      } else if (noC && !hasD && g1._dnm) {
        status = "PROBABLE_GENUS";
        identification = g1.genus;
        confidenceNote = "MISSING_DIAGNOSTIC";
      } else if (noC && !sep) {
        status = "CANDIDATE_GENUS";
        identification = g1.genus;
        confidenceNote = "POOR_SEPARATION";
      } else {
        status = noC ? "PROBABLE_GENUS" : "CANDIDATE_GENUS";
        identification = g1.genus;
      }
    }
  }
  
  // Clean up internals for response
  active.forEach(r => { delete r._nd; delete r._Dset; delete r._nc; delete r._m01; delete r._dnm; });
  excludedArr.forEach(r => { delete r._nd; delete r._Dset; delete r._nc; delete r._m01; delete r._dnm; });
  
  return {
    status,
    identification,
    confidenceNote,
    ranking: active,
    excluded: excludedArr
  };
}

module.exports = {
  scoreGenera,
  buildH,
  evaluateRuleM
};
