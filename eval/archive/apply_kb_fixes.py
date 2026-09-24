"""Apply the 13 rule-mapping fixes (KB review, Sep 2026) to the three copies of the
knowledge base: api/data/rule_chr_mapping.json (source), neo4j_import.cypher and
foram_ontology_v1.owl. Run from the repository root:  python apply_kb_fixes.py

Idempotent: if a fix has already been applied the script exits with an error
rather than silently applying it twice.
"""
import json, re, sys

# rule_key -> (action, chr_id, old_value, new_value)
#   action 'set'  : change the value of the mapping on chr_id
#   action 'drop' : remove the mapping on chr_id (rule becomes non-scoring if nothing is left)
FIXES = {
    # inverted polarity: "absent" encoded as the present state
    'Triloculina_M4':   ('set',  'CHR_10', 'SUBDIVIDED', 'SIMPLE'),
    'Miliolinella_M4':  ('set',  'CHR_10', 'SUBDIVIDED', 'SIMPLE'),
    'Sigmoilina_M3':    ('set',  'CHR_10', 'SUBDIVIDED', 'SIMPLE'),
    'Miliola_M4':       ('set',  'CHR_10', 'SUBDIVIDED', 'SIMPLE'),
    'Borelis_C2':       ('set',  'CHR_10', 'SUBDIVIDED', 'SIMPLE'),
    'Glomalveolina_C2': ('set',  'CHR_10', 'SUBDIVIDED', 'SIMPLE'),
    'Rhizammina_M3':    ('set',  'CHR_04', 'MULTICHAMBERED', 'UNDIVIDED'),
    'Lenticulina_D1':   ('set',  'CHR_17', 'PRESENT', 'ABSENT'),
    # inverted, and the vocabulary has no state for the intended absence
    'Saccammina_D2':    ('drop', 'CHR_02', 'TUBULAR', None),
    'Alveolina_D4':     ('drop', 'CHR_05', 'TRILOCULINE', None),
    # mapped to the wrong character (stolon type is not chamber arrangement)
    'Orbitoclypeus_D1': ('drop', 'CHR_05', 'ANNULAR', None),
    'Nemkovella_D1':    ('drop', 'CHR_05', 'ANNULAR', None),
    # partial-match artefact: the CHR_17 pair penalised every specimen with a marginal cord
    'Nummulitoides_C2': ('drop', 'CHR_17', 'PRESENT', None),
}

# ---------------------------------------------------------------- JSON (source of truth)
path = 'api/data/rule_chr_mapping.json'
rules = json.load(open(path, encoding='utf-8'))
seen = set()
for r in rules:
    fx = FIXES.get(r['rule_key'])
    if not fx:
        continue
    action, chr_id, old, new = fx
    hit = [m for m in r['mappings'] if m['chr_id'] == chr_id and m['value'] == old]
    if len(hit) != 1:
        sys.exit('JSON: %s has no unique mapping %s=%s (already applied?)' % (r['rule_key'], chr_id, old))
    if action == 'set':
        hit[0]['value'] = new
    else:
        r['mappings'].remove(hit[0])
    r['status'] = r['mappings'][0]['confidence'] if r['mappings'] else 'NONE'   # status = primary mapping
    seen.add(r['rule_key'])
missing = set(FIXES) - seen
if missing:
    sys.exit('JSON: rules not found: %s' % sorted(missing))
open(path, 'w', encoding='utf-8').write(json.dumps(rules, indent=1, ensure_ascii=False))
print('  JSON: %d rules updated' % len(FIXES))

# ---------------------------------------------------------------- Cypher import script
path = 'neo4j_import.cypher'
cy = open(path, encoding='utf-8').read()
cy_count = 0
for key, (action, chr_id, old, new) in FIXES.items():
    pat = re.compile(r"^MATCH \(r:RuleItem \{key: '%s'\}\), \(c:Character \{id: '%s'\}\) MERGE \(r\)-\[:REFERS_TO \{confidence: '[A-Z]+', suggestedValue: '%s'\}\]->\(c\);\n"
                     % (re.escape(key), chr_id, old), re.M)
    m = list(pat.finditer(cy))
    if len(m) != 1:
        sys.exit('Cypher: %s %s=%s found %d times (expected 1)' % (key, chr_id, old, len(m)))
    line = m[0].group(0)
    if action == 'set':
        cy = cy.replace(line, line.replace("suggestedValue: '%s'" % old, "suggestedValue: '%s'" % new))
    else:
        cy = cy.replace(line, '')
    cy_count += 1
open(path, 'w', encoding='utf-8').write(cy)
print('  Cypher: %d lines updated' % cy_count)

# ---------------------------------------------------------------- OWL
path = 'foram_ontology_v1.owl'
owl = open(path, encoding='utf-8').read()
owl_count = 0
for key, (action, chr_id, old, new) in FIXES.items():
    start = owl.find('<owl:NamedIndividual rdf:about="#%s">' % key)
    end = owl.find('</owl:NamedIndividual>', start)
    if start < 0 or end < 0:
        sys.exit('OWL: individual %s not found' % key)
    block = owl[start:end]
    val = '>%s=%s</suggestedCharacterValue>' % (chr_id, old)
    if block.count(val) != 1:
        sys.exit('OWL: %s lacks unique %s=%s (already applied?)' % (key, chr_id, old))
    if action == 'set':
        nb = block.replace(val, '>%s=%s</suggestedCharacterValue>' % (chr_id, new))
    else:
        lines = block.split('\n')
        keep = []
        for ln in lines:
            if ln.strip() == '<refersToCharacter rdf:resource="#%s"/>' % chr_id:
                continue
            if val in ln:
                continue
            if '<mappingConfidence' in ln and '>%s:' % chr_id in ln:
                continue
            keep.append(ln)
        nb = '\n'.join(keep)
    owl = owl[:start] + nb + owl[end:]
    owl_count += 1
open(path, 'w', encoding='utf-8').write(owl)
print('  OWL: %d individuals updated' % owl_count)

print('\nApplied %d fixes to JSON, Cypher and OWL.' % len(FIXES))
