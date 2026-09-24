"""Knowledge-base integrity audit, categories (a)-(h) of the manuscript (Section IV-B).

Usage (from the repository root):
    python3 eval/audit.py [api/data] [--list]

(a) contradictory rules whose character-state pair equals a pair of a positive (M/D/S) rule of the same genus
(b) mandatory rules that conflict with another mandatory or diagnostic rule of the same genus on the same
    character (no allowed state of one rule is compatible with the other, implications included)
(c) rules whose text is negated but whose mapping encodes a positive state (automated screen; flagged rules
    must be checked by hand)
(d) character-state pairs of one genus counted by more than one scoring rule: two diagnostic or supporting
    rules, or a mandatory and a diagnostic rule (directly or through an implication mapping)
(e) mandatory rules without a scoring character-state pair
(f) genera without a scoring diagnostic rule
(g) decision-tree answers whose value is outside the controlled vocabulary of the character the node asks about
(h) decision-tree nodes that ask again about a character already asked on the path leading to them
"""
import json, re, sys, collections

args = [a for a in sys.argv[1:] if not a.startswith('--')]
LIST = '--list' in sys.argv
D = (args[0] if args else 'api/data').rstrip('/') + '/'

chars = {c['id']: c['values'] for c in json.load(open(D + 'characters.json', encoding='utf-8'))['characters']}
rules = json.load(open(D + 'rule_chr_mapping.json', encoding='utf-8'))
IMPL = {
    ('CHR_11', 'WELL_DEVELOPED'): [('CHR_11', 'PRESENT')], ('CHR_11', 'WEAKLY_DEVELOPED'): [('CHR_11', 'PRESENT')],
    ('CHR_14', 'STRONG'): [('CHR_14', 'PRESENT')], ('CHR_14', 'WEAK'): [('CHR_14', 'PRESENT')],
    ('CHR_15', 'WELL_DEVELOPED'): [('CHR_15', 'PRESENT')], ('CHR_15', 'WEAKLY_DEVELOPED'): [('CHR_15', 'PRESENT')],
    ('CHR_17', 'STRONG'): [('CHR_17', 'PRESENT')], ('CHR_17', 'WEAK'): [('CHR_17', 'PRESENT')],
    ('CHR_09', 'PLANISPIRAL_TO_BISERIAL'): [('CHR_06', 'PLANISPIRAL'), ('CHR_05', 'BISERIAL')],
    ('CHR_09', 'PLANISPIRAL_TO_UNISERIAL'): [('CHR_06', 'PLANISPIRAL'), ('CHR_05', 'UNISERIAL')],
    ('CHR_09', 'BISERIAL_TO_UNISERIAL'): [('CHR_05', 'BISERIAL'), ('CHR_05', 'UNISERIAL')],
    ('CHR_09', 'TRISERIAL_TO_BISERIAL'): [('CHR_05', 'TRISERIAL'), ('CHR_05', 'BISERIAL')],
    ('CHR_09', 'TRISERIAL_TO_UNISERIAL'): [('CHR_05', 'TRISERIAL'), ('CHR_05', 'UNISERIAL')],
}
NEGATIVE_STATES = {'ABSENT', 'SIMPLE', 'UNDIVIDED', 'UNCOILED', 'NONE'}
NEGATION = re.compile(r'\b(absent|no|not|without|lacking|lack)\b', re.I)

genera = collections.defaultdict(list)
for r in rules:
    r['pairs'] = [(m['chr_id'], m['value']) for m in r['mappings'] if m.get('value')]
    genera[(r['module'], r['genus'])].append(r)

def closure(c, vals):
    """States of character c that hold if any of vals holds (implications included)."""
    out = set(vals)
    for v in vals:
        out |= {iv for ic, iv in IMPL.get((c, v), []) if ic == c}
    return out

def groups(r):
    g = collections.defaultdict(set)
    for c, v in r['pairs']:
        g[c].add(v)
    return g

F = collections.OrderedDict((k, []) for k in 'abcdefgh')

for (mod, genus), rs in genera.items():
    pos = {p for r in rs if r['level'] in 'MDS' for p in r['pairs']}
    # (a)
    for r in rs:
        if r['level'] == 'C' and set(r['pairs']) & pos:
            F['a'].append('%s: %s' % (r['rule_key'], sorted(set(r['pairs']) & pos)))
    # (b)
    Ms = [r for r in rs if r['level'] == 'M']
    for r in Ms:
        gr = groups(r)
        for o in rs:
            if o is r or o['level'] not in 'MD':
                continue
            go = groups(o)
            if o['level'] == 'M' and o['rule_key'] < r['rule_key']:
                continue  # count each M-M pair once
            for c in set(gr) & set(go):
                if not (closure(c, gr[c]) & closure(c, go[c])):
                    F['b'].append('%s vs %s on %s: %s / %s' % (r['rule_key'], o['rule_key'], c, sorted(gr[c]), sorted(go[c])))
    # (d)
    count = collections.Counter()
    for r in rs:
        if r['level'] in 'DS':
            for p in set(r['pairs']):
                count[p] += 1
    dup = {p for p, n in count.items() if n > 1}
    Mp = {p for r in rs if r['level'] == 'M' for p in r['pairs']}
    for r in rs:
        if r['level'] == 'D':
            for p in set(r['pairs']):
                if p in Mp or set(IMPL.get(p, [])) & Mp:
                    dup.add(p)
    for p in sorted(dup):
        F['d'].append('%s: %s=%s' % (genus, p[0], p[1]))
    # (e), (f)
    for r in Ms:
        if not r['pairs']:
            F['e'].append(r['rule_key'])
    if not any(r['level'] == 'D' and r['pairs'] for r in rs):
        F['f'].append('%s (%s)' % (genus, mod))

# (c)
for r in rules:
    if r['pairs'] and NEGATION.search(r['text']) and all(v not in NEGATIVE_STATES for _, v in r['pairs']):
        F['c'].append('%s [%s]: "%s" -> %s' % (r['rule_key'], r['level'], r['text'], r['pairs']))

# (g), (h)
for module in ('agglutinated', 'porcelaneous', 'hyaline'):
    t = json.load(open(D + 'decision_tree_%s.json' % module, encoding='utf-8'))
    nodes = {n['id']: n for n in t['nodes']}
    for n in t['nodes']:
        c = n.get('chr_id')
        if not c:
            continue
        for a in n['answers']:
            if a['value'] != '*' and a['value'] not in chars[c]:
                F['g'].append('%s (%s): %s%s' % (n['id'], c, a['value'], ' [maps_to %s]' % a['maps_to'] if a.get('maps_to') else ''))
    reasked = set()
    def walk(nid, asked):
        n = nodes[nid]
        c = n.get('chr_id')
        if c and c in asked:
            reasked.add((nid, c, asked[c]))
        nxt_asked = dict(asked)
        if c:
            nxt_asked.setdefault(c, nid)
        for a in n['answers']:
            if not a['next'].startswith(('GENUS:', 'INDETERMINATE:', 'REDIRECT:')):
                walk(a['next'], nxt_asked)
    walk(t['entry'], {})
    for nid, c, first in sorted(reasked):
        F['h'].append('%s asks %s again (first asked at %s)' % (nid, c, first))

LABEL = dict(a='contradictory rule repeats a positive pair', b='mandatory rule conflicts with M/D rule',
             c='negated text, positive mapping (screen)', d='pair counted more than once in a genus',
             e='mandatory rule without mapping', f='genus without scoring diagnostic rule',
             g='tree answer outside vocabulary', h='character asked again on a path')
unit = dict(a='rules', b='rule pairs', c='rules', d='pairs', e='rules', f='genera', g='answers', h='nodes')
for k, items in F.items():
    print('(%s) %-44s %4d %s' % (k, LABEL[k], len(items), unit[k]))
    if LIST:
        for i in items:
            print('      ', i)
