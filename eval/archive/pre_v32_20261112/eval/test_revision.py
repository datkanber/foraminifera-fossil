import unittest, json, math, random, subprocess, re, xml.etree.ElementTree as E
from pathlib import Path
from evaluation_common import *
from sensitivity import rbo

class RevisionTests(unittest.TestCase):
    def test_rbo_identity_disjoint_symmetry_and_bounds(self):
        self.assertAlmostEqual(rbo(['a','b','c'],['a','b','c']),1)
        self.assertEqual(rbo(['a'],['b']),0)
        self.assertEqual(rbo([],[]),1)
        self.assertEqual(rbo([],['a']),0)
        rng=random.Random(17)
        for _ in range(100):
            a=rng.sample(list('abcdefgh'),rng.randint(1,8));b=rng.sample(list('abcdefgh'),rng.randint(1,8))
            self.assertAlmostEqual(rbo(a,b),rbo(b,a))
            self.assertTrue(0<=rbo(a,b)<=1)
        # Analytical unequal-list example: S=[a], L=[a,b], p=.9.
        self.assertAlmostEqual(rbo(['a'],['a','b']),1.)
        self.assertAlmostEqual(rbo(['a'],['b','a']),.45)

    def test_score_ties_and_abstentions(self):
        r={'status':'CANDIDATE_GENUS','ranking':[{'genus':g,'score':1} for g in 'abcd']}
        self.assertEqual(credit(r,'a',1),.25);self.assertEqual(credit(r,'b',3),.75)
        r['status']='INDETERMINATE';self.assertEqual(credit(r,'a',3),0)

    def test_frozen_inputs_are_not_relabelled(self):
        manifest=read(PANEL/'panel_manifest.json')
        self.assertEqual(len(manifest),150)
        for row in manifest:
            self.assertEqual(hashlib.sha256((PANEL/row['file']).read_bytes()).hexdigest(),row['sha256'])
        before=read(OUT/'before_paths.json');now=read(ROOT/'eval/results/paths.json')
        self.assertEqual([(x['module'],x['leaf_genus'],x['observations']) for x in before],[(x['module'],x['leaf_genus'],x['observations']) for x in now])

    def test_no_target_audit_findings(self):
        out=subprocess.check_output(['python',str(ROOT/'eval/audit.py')],cwd=ROOT,text=True,encoding='utf-8')
        for category in ['a','b','d']:
            line=next(x for x in out.splitlines() if x.startswith('('+category+')'))
            self.assertEqual(int(re.search(r'\s(\d+)\s+(?:rules|rule pairs|pairs)$',line).group(1)),0,line)

    def test_synthetic_pairing_and_controls(self):
        profiles=read(OUT/'synthetic_profiles.json');cases=read(OUT/'synthetic_cases.json');details=read(OUT/'synthetic_corruptions.json')
        self.assertEqual(len(profiles),75);self.assertEqual(len(cases),12000)
        self.assertTrue(all(not p['constraint_conflicts']['mismatched_positive']['M'] and not p['constraint_conflicts']['mismatched_positive']['D'] for p in profiles))
        bygenus=collections.Counter(c['reference_genus'] for c in cases)
        self.assertEqual(set(bygenus.values()),{160})
        for c in cases:
            d=details[c['case_id']];self.assertNotIn('CHR_01',d['masked']);self.assertNotIn('CHR_01',d['corrupted'])
            self.assertFalse(set(d['masked'])&set(d['corrupted']))
            self.assertEqual(c['observations']['CHR_01']['value'],c['module'])
            self.assertEqual(len(d['masked']),math.floor(d['n_available']*d['missing_requested']+.5))
            if not d['noise_requested']:self.assertEqual(d['corrupted'],{})

    def test_threshold_changes_do_not_change_ranks(self):
        rows=read(OUT/'sensitivity_summary.json')
        for x in rows:
            if x['configuration'].startswith('S5_'):
                self.assertAlmostEqual(x['rbo'],1);self.assertEqual(x['top1_same'],1);self.assertEqual(x['top3_set_same'],1)

    def test_default_scorer_preserves_frozen_algorithm_on_same_data(self):
        cases=path_cases()+panel_cases()
        actual=engine(cases)
        original_algorithm=engine(cases,frozen=True,dataDir='api/data')
        self.assertEqual(actual,original_algorithm)

if __name__=='__main__':unittest.main()
