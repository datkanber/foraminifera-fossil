'use strict';

// Offline replay of the supplied archived responses and frozen decision paths.
// Run from an extracted S1–S9 bundle with Node.js 24 or later.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const evaluation = path.join(root, 'evaluation');
const supplement = path.join(root, 'supplementary');
const out = path.join(supplement, 'S9_revision_checks', 'data');
const read = name => fs.readFileSync(name);
const json = name => JSON.parse(read(name));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const config = json(path.join(evaluation, 'execution_config.json'));
const s4 = path.join(supplement, 'S4_vision_observer');
const scoreFile = path.join(s4, 'S4_scoring_snapshot.js');
const controller = read(path.join(s4, 'S4_controller_snapshot.js'));
const manifest = path.join(evaluation, 'panel_manifest.json');

assert.equal(hash(read(manifest)), config.manifestSha256);
assert.equal(hash(read(scoreFile)), config.scoringSha256);
assert.equal(hash(controller), config.controllerSha256);
const { scoreGenera, buildH, evaluateRuleM } = require(scoreFile);

const s1 = path.join(supplement, 'S1_knowledge_base');
const characters = json(path.join(s1, 'S1_characters.json')).characters;
const ruleData = json(path.join(s1, 'S1_rule_mappings.json'));
const validValues = Object.fromEntries(characters.map(c => [c.id, new Set(c.values)]));
assert.equal(characters.length, 21);
assert.equal(ruleData.length, 706);
const levels = { M: 'MANDATORY', D: 'DIAGNOSTIC', S: 'SUPPORTING', C: 'CONTRADICTORY' };
const genera = {};
for (const r of ruleData) {
  genera[r.genus] ??= { genus: r.genus, module: r.module, rules: [] };
  genera[r.genus].rules.push({
    key: r.rule_key,
    level: levels[r.level],
    text: r.text,
    mappings: r.mappings
      .filter(m => m.chr_id && m.value)
      .map(m => ({ chrId: m.chr_id, value: m.value })),
  });
}
assert.equal(Object.keys(genera).length, 75);

const modules = ['AGGLUTINATED', 'PORCELANEOUS', 'HYALINE'];
const byModule = Object.fromEntries(modules.map(module => [
  module, Object.fromEntries(Object.entries(genera).filter(([, g]) => g.module === module)),
]));
const neutral = new Set(['UNCERTAIN', 'NOT_OBSERVABLE']);
const evaluable = new Set(['PRESENT', 'ABSENT']);
const abstention = new Set(['INDETERMINATE', 'NO_MATCH_WITHIN_CORE_TAXA']);
const asJson = value => JSON.parse(JSON.stringify(value));
const controllerSource = controller.toString('utf8');
function archivedFunction(name, next) {
  const start = controllerSource.indexOf(`function ${name}(`);
  const end = controllerSource.indexOf(next, start);
  assert(start >= 0 && end > start, `Missing frozen function ${name}`);
  return vm.runInNewContext(`${controllerSource.slice(start, end)}\n${name}`, { validValues });
}
const extractJson = archivedFunction('extractJson', 'const path =');
const normalize = archivedFunction('normalizeObservations', 'async function callGemini(');

function moduleFrom(observations) {
  const c = observations.CHR_01;
  return c && !neutral.has(c.state) && modules.includes(c.value) ? c.value : null;
}
function scorePanel(observations) {
  const module = moduleFrom(observations);
  return { module, ...scoreGenera(observations, module ? byModule[module] : genera) };
}
function credit(score, truth, k) {
  if (abstention.has(score.status)) return 0;
  const target = score.ranking.find(row => row.genus === truth);
  if (!target) return 0;
  const above = score.ranking.filter(row => row.score > target.score).length;
  const tied = score.ranking.filter(row => row.score === target.score).length;
  return Math.max(0, Math.min(1, (k - above) / tied));
}
function panelMetrics(score, truth, observations) {
  const excluded = score.excluded.find(r => r.genus === truth);
  return {
    module: score.module,
    status: score.status,
    displayed_genus: score.identification,
    acc1: credit(score, truth, 1),
    acc3: credit(score, truth, 3),
    coverage: Number(!abstention.has(score.status)),
    displayed_correct: Number(score.identification === truth),
    reference_excluded: Number(Boolean(excluded)),
    exclusion_reason: excluded?.exclusionReason ?? null,
    module_omitted: Number(Boolean(score.module && genera[truth].module !== score.module)),
    phi: characters.slice(0, 20).filter(c => neutral.has(observations[c.id].state)).length / 20,
  };
}

const panels = json(manifest);
assert.equal(panels.length, 150);
assert.equal(new Set(panels.map(p => p.image_id)).size, 150);
const changedStates = [];
const panelRows = panels.map(p => {
  const archive = json(path.join(evaluation, 'raw', `${p.image_id}.json`));
  assert.equal(archive.imageId, p.image_id);
  assert.equal(archive.success, true);
  assert.equal(archive.configHash, config.configHash);
  assert.equal(archive.response.model, config.model);
  assert.equal(archive.imageSha256, p.sha256);
  assert.equal(hash(read(path.join(evaluation, p.file))), p.sha256);
  const successful = archive.attempts.findLast(a => a.providerStatus === 200);
  const text = successful.providerResponse.candidates[0].content.parts.map(x => x.text ?? '').join('');
  const raw = extractJson(text).observations;
  const released = asJson(normalize(raw));
  assert.deepEqual(released, archive.response.observation.observations, p.image_id);
  const releasedScore = scorePanel(released);
  assert.deepEqual(releasedScore, archive.score, p.image_id);

  // Keep all released preprocessing except the two recorded neutral-to-evaluable promotions.
  const preserved = { ...released };
  const reverted = [];
  for (const [character, item] of Object.entries(released)) {
    const rawState = raw?.[character]?.state;
    if (neutral.has(rawState) && evaluable.has(item.state)) {
      preserved[character] = { ...item, state: rawState };
      reverted.push(character);
      changedStates.push({
        image_id: p.image_id,
        character,
        original_raw_state: rawState,
        evaluated_state: item.state,
        value: item.value,
      });
    }
  }
  return {
    image_id: p.image_id,
    reference_genus: p.reference_genus,
    reference_module: p.module,
    cohort: p.cohort,
    cluster: p.cluster,
    reverted,
    released: panelMetrics(releasedScore, p.reference_genus, released),
    preserved: panelMetrics(scorePanel(preserved), p.reference_genus, preserved),
  };
});
assert.equal(changedStates.length, 184);

const s6 = path.join(supplement, 'S6_internal_evaluation');
const frozenPaths = json(path.join(s6, 'S6_paths.json'));
assert.equal(frozenPaths.length, 104);
function pathMetrics(result, leaf) {
  const t = result.ranking.find(row => row.genus === leaf);
  const scoreRank = t ? result.ranking.filter(row => row.score > t.score).length + 1 : null;
  const scoreTies = t ? result.ranking.filter(row => row.score === t.score).length : 0;
  return {
    status: result.status,
    displayed_genus: result.identification,
    excluded: result.excluded.some(row => row.genus === leaf),
    score_rank: scoreRank,
    score_ties: scoreTies,
    acc1: credit(result, leaf, 1),
    acc3: credit(result, leaf, 3),
  };
}
function triggers(result, observations, leaf) {
  const item = result.excluded.find(g => g.genus === leaf);
  if (!item) return null;
  const h = buildH(observations);
  const rules = genera[leaf].rules;
  const mandatory = [];
  const matchedContradictions = [];
  for (const r of rules) {
    if (r.level !== 'MANDATORY' && r.level !== 'CONTRADICTORY') continue;
    const { verdict } = evaluateRuleM(h, r.mappings);
    if (r.level === 'MANDATORY' && verdict === 'MISMATCH') {
      const expected = new Map();
      for (const pair of r.mappings) {
        if (!expected.has(pair.chrId)) expected.set(pair.chrId, []);
        expected.get(pair.chrId).push(pair.value);
      }
      const mismatches = Array.from(expected, ([character, values]) => ({
        character, expected: values, observed: Array.from(h[character] ?? []).sort(),
      })).filter(g => g.observed.length && !g.expected.some(v => g.observed.includes(v)));
      mandatory.push({ key: r.key, text: r.text, mismatches });
    } else if (r.level === 'CONTRADICTORY' && verdict === 'MATCH') {
      matchedContradictions.push({
        key: r.key, text: r.text,
        matching: r.mappings.filter(m => h[m.chrId]?.has(m.value)),
      });
    }
  }
  assert(mandatory.length || (matchedContradictions.length && item.score < 0));
  assert.equal(Boolean(mandatory.length), item.exclusionReason.startsWith('mandatory'));
  return { score: item.score, mandatory, matchedContradictions };
}

const paths = frozenPaths.map(p => {
  const leaf = p.leaf_genus;
  const all = byModule[p.module];
  const original = scoreGenera(p.observations, all);
  const simple = p.module === 'PORCELANEOUS' && p.observations.CHR_10?.value === 'SIMPLE';
  const modified = simple ? { ...p.observations, CHR_10: { ...p.observations.CHR_10, state: 'NOT_OBSERVABLE' } } : p.observations;
  return {
    ...p,
    trigger: triggers(original, p.observations, leaf),
    released: pathMetrics(original, leaf),
    chr10_masked: simple,
    masking: pathMetrics(scoreGenera(modified, all), leaf),
  };
});
const total = paths.filter(p => p.released.excluded).length;
assert.equal(total, 17);
assert.equal(paths.filter(p => p.module === 'PORCELANEOUS' && p.released.excluded).length, 13);
assert.equal(paths.filter(p => p.released.score_rank === 1 && p.released.score_ties === 1).length, 24);
assert.equal(paths.filter(p => p.released.score_rank === 1 && p.released.score_ties > 1).length, 10);
assert.equal(paths.filter(p => p.released.score_rank && p.released.score_rank <= 3).length, 64);
assert.equal(paths.filter(p => p.released.status === 'CONFIRMED_GENUS').length, 48);
assert.equal(paths.filter(p => p.released.status === 'CONFIRMED_GENUS' && p.released.displayed_genus === p.leaf_genus).length, 14);

fs.mkdirSync(out, { recursive: true });
for (const [name, data] of [['S9_panel_replays', panelRows], ['S9_state_promotions', changedStates], ['S9_path_traces', paths]]) {
  fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(data, null, 2) + '\n');
}
console.log(`Verified 150 archived panel replays, ${changedStates.length} state reversions, and 104 paths (${total} leaf exclusions).`);
