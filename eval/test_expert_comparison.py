"""All observations here are SYNTHETIC SOFTWARE FIXTURES, never real expert data."""
import unittest,tempfile,copy,json,shutil
from pathlib import Path
from expert_comparison import *

STUDY=DEFAULT
def characters():return {c['id']:c for c in read(STUDY/'frozen_v29/api/data/characters.json')['characters']}
def fake_sheet(sid='P001',observer='E1'):
    return {'fixture':'SYNTHETIC_SOFTWARE_TEST_NOT_HUMAN_OBSERVATION','specimen_id':sid,'observer_code':observer,'phase':'pilot',
      'material_mode':'physical','physical_material_code':sid,'materials':[],
      'observations':{c:{'value':None,'state':'NOT_OBSERVABLE'} for c in characters()},
      'attestations':dict.fromkeys(['reference_label_hidden','other_observer_hidden','system_outputs_hidden','independent_completion'],True),
      'timing':{'started_at':'2026-11-12T10:00:00+03:00','completed_at':'2026-11-12T10:01:00+03:00','active_seconds':60,'method':'SYNTHETIC_FIXTURE'}}

class ExpertComparisonTests(unittest.TestCase):
    def test_fractional_ties_and_abstention(self):
        r={'status':'CANDIDATE_GENUS','ranking':[{'genus':g,'score':5} for g in ['A','B','C']]}
        self.assertAlmostEqual(credit(r,'B',1),1/3);self.assertEqual(credit(r,'B',3),1)
        self.assertEqual(credit(r,'D',3),0)
        r['status']='INDETERMINATE';self.assertEqual(credit(r,'B',3),0)

    def test_two_observers_do_not_double_specimen_count(self):
        rows=[]
        for sid,a,b in [('TEST1',[1,0],[0,0]),('TEST2',[0,0],[1,1])]:
            for method,values in [('A0',a),('B1',b)]:
                for observer,value in zip(['E1','E2'],values):
                    rows.append({'specimen_id':sid,'observer_code':observer,'method':method,'bootstrap_cluster':sid,**dict.fromkeys(METRICS,value)})
        result=bootstrap(aggregate(rows),200,5)
        self.assertEqual(result['n_specimens'],2);self.assertEqual(result['n_bootstrap_clusters'],2)
        self.assertEqual(result['metrics']['acc1']['A0_minus_B1']['mean'],-.25)
        self.assertTrue(-1<=result['metrics']['acc1']['A0_minus_B1']['low']<=.5)

    def test_shared_source_clusters_not_counted_as_independent(self):
        rows=[{'specimen_id':sid,'method':method,'bootstrap_cluster':'SAME_ROCK',**dict.fromkeys(METRICS,0.)} for sid in ['S1','S2'] for method in ['A0','B1']]
        result=bootstrap(rows,100,1)
        self.assertEqual(result['n_specimens'],2);self.assertEqual(result['n_bootstrap_clusters'],1)
        self.assertIsNone(result['metrics']['acc1']['A0_minus_B1']['low'])

    def test_uncertainty_is_never_promoted(self):
        sheet=fake_sheet();sheet['observations']['CHR_02']={'value':'GLOBULAR','state':'UNCERTAIN'}
        obs=validate_sheet(sheet,characters(),'P001','E1','pilot')
        self.assertEqual(obs['CHR_02'],{'value':'GLOBULAR','state':'UNCERTAIN'})

    def test_missing_character_rejected(self):
        sheet=fake_sheet();del sheet['observations']['CHR_21']
        with self.assertRaisesRegex(ValueError,'exactly all 21'):validate_sheet(sheet,characters(),'P001','E1','pilot')

    def test_absence_cannot_encode_a_positive_value(self):
        sheet=fake_sheet();sheet['observations']['CHR_06']={'value':'PLANISPIRAL','state':'ABSENT'}
        with self.assertRaisesRegex(ValueError,'positive evidence'):validate_sheet(sheet,characters(),'P001','E1','pilot')

    def test_blinding_and_duration_are_required(self):
        sheet=fake_sheet();sheet['attestations']['system_outputs_hidden']=False
        with self.assertRaisesRegex(ValueError,'blinding'):validate_sheet(sheet,characters(),'P001','E1','pilot')
        sheet=fake_sheet();sheet['timing']['active_seconds']=0
        with self.assertRaisesRegex(ValueError,'duration'):validate_sheet(sheet,characters(),'P001','E1','pilot')

    def test_duplicate_observer_is_rejected(self):
        row={'specimen_id':'TEST','method':'A0','observer_code':'E1','bootstrap_cluster':'TEST',**dict.fromkeys(METRICS,0)}
        with self.assertRaisesRegex(ValueError,'two observations'):aggregate([row,row.copy()])

    def test_frozen_code_drift_is_rejected(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);shutil.copytree(STUDY/'frozen_v29',s/'frozen_v29');check_version(s)
            with (s/'frozen_v29/api/src/services/scoring.js').open('a') as f:f.write('\n// TEST_ONLY_TAMPER\n')
            with self.assertRaisesRegex(ValueError,'changed'):check_version(s)

    def fixture_study(self,s):
        shutil.copytree(STUDY/'frozen_v29',s/'frozen_v29')
        config=read(STUDY/'study_config.json');config['bootstrap_resamples']=100;save(s/'study_config.json',config)
        roster=csvread(STUDY/'coordinator_private/roster.csv')
        for p in roster:
            for k in ['participation_confirmed','expertise_verified','independent_of_rule_development']:p[k]='yes'
            p['notes']='SYNTHETIC_SOFTWARE_FIXTURE'
        csvwrite(s/'coordinator_private/roster.csv',roster)
        registry=[]
        for i in range(1,9):
            sid=f'P{i:03}';registry.append({'specimen_id':sid,'phase':'pilot','enrolled':'yes','independence_unit_id':'SYNTHETIC_UNIT_'+sid,
              'bootstrap_cluster_id':'SYNTHETIC_CLUSTER_'+sid,'source_collection':'SYNTHETIC_SOFTWARE_FIXTURE','archive_record_id':'NO_REAL_ARCHIVE',
              'used_in_rule_construction':'no','independence_verified':'yes','reference_genus':'Ammodiscus','reference_module':'AGGLUTINATED',
              'reference_status':'verified','reference_verifier_code':'R1','reference_evidence':'SYNTHETIC_UNIT_TEST_NOT_REAL_VERIFICATION','material_mode':'physical','blinding_reviewed':'yes'})
            for observer in ['E1','E2']:save(s/'submissions/pilot'/observer/(sid+'.json'),fake_sheet(sid,observer))
        csvwrite(s/'coordinator_private/specimen_registry.csv',registry)

    def test_seal_score_and_specimen_analysis_end_to_end(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);self.fixture_study(s)
            summary=lock(s,'pilot');self.assertEqual(summary['n_forms'],16)
            result=analyze(s,'pilot')
            self.assertEqual(result['n_specimens'],8);self.assertEqual(result['n_forms'],16)
            self.assertEqual(len(read(s/'results/pilot/scoring_receipts.json')),32)
            self.assertEqual(len(read(s/'results/pilot/scoring_receipts.json')[0]['ranking']),75)
            self.assertTrue((s/'results/pilot/results_for_manuscript.md').exists())

    def test_reference_cannot_be_verified_by_form_observer(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);self.fixture_study(s);rows=csvread(s/'coordinator_private/specimen_registry.csv');rows[0]['reference_verifier_code']='E1';csvwrite(s/'coordinator_private/specimen_registry.csv',rows)
            with self.assertRaisesRegex(ValueError,'reference verifier'):collect(s,'pilot')

    def test_duplicate_physical_fossil_rejected(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);self.fixture_study(s);rows=csvread(s/'coordinator_private/specimen_registry.csv');rows[1]['independence_unit_id']=rows[0]['independence_unit_id'];csvwrite(s/'coordinator_private/specimen_registry.csv',rows)
            with self.assertRaisesRegex(ValueError,'same fossil'):collect(s,'pilot')

    def test_sealed_data_tampering_rejected(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);self.fixture_study(s);lock(s,'pilot');bundle=s/'coordinator_private/locks/pilot/sealed.json'
            with bundle.open('a') as f:f.write(' ')
            with self.assertRaisesRegex(ValueError,'changed'):analyze(s,'pilot')

    def test_empty_actual_study_cannot_produce_results(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);self.fixture_study(s);roster=csvread(s/'coordinator_private/roster.csv');roster[0]['participation_confirmed']='';csvwrite(s/'coordinator_private/roster.csv',roster)
            with self.assertRaises(ValueError):collect(s,'pilot')
            self.assertFalse((s/'results/pilot/summary.json').exists())

    def test_pilot_reuse_is_rejected(self):
        with tempfile.TemporaryDirectory(prefix='foram_synthetic_test_') as temp:
            s=Path(temp);self.fixture_study(s);rows=csvread(s/'coordinator_private/specimen_registry.csv')
            for i in range(1,61):
                r=dict(rows[0]);r.update(specimen_id=f'F{i:03}',phase='confirmatory',independence_unit_id=rows[0]['independence_unit_id'] if i==1 else f'SYNTHETIC_CONFIRM_UNIT_{i}');rows.append(r)
            csvwrite(s/'coordinator_private/specimen_registry.csv',rows)
            with self.assertRaisesRegex(ValueError,'Pilot specimens'):collect(s,'confirmatory')

if __name__=='__main__':unittest.main()
