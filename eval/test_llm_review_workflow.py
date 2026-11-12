"""Synthetic software fixtures only. Never creates production expert approvals."""
import unittest,tempfile,copy
from expert_comparison import *
from llm_observation_drafts import validate_draft_observations,prompt_for,eligible_cases
from test_expert_comparison import ExpertComparisonTests,fake_sheet,characters

class DraftReviewTests(unittest.TestCase):
    def fixture(self,folder):
        ExpertComparisonTests().fixture_study(folder)
        config=read(folder/'study_config.json');config['requires_llm_expert_review']=True;save(folder/'study_config.json',config)
        for i in range(1,9):
            sid=f'P{i:03}';raw={'status':'LLM_DRAFT','specimen_id':sid,'phase':'pilot','observations':{c:{'value':None,'state':'NOT_OBSERVABLE','reason':'SYNTHETIC SOFTWARE FIXTURE ONLY'} for c in characters()},'expert_approval':None}
            draft=folder/'llm_drafts/pilot'/sid/'draft.json';save(draft,raw);save(draft.parent/'draft_seal.json',{'sha256':digest(draft)})
            for o in ['E1','E2']:
                sheet=fake_sheet(sid,o);sheet.update(status='EXPERT_VERIFIED',source_draft_sha256=digest(draft),expert_approval={'completed_by_human':True,'reviewer_code':o,'approved_at':'2026-11-12T10:01:00+03:00'})
                sheet['observations']={c:{**v,'review_action':'APPROVE','review_note':''} for c,v in raw['observations'].items()}
                save(folder/'submissions/pilot'/o/(sid+'.json'),sheet)

    def test_raw_and_pending_are_not_verified(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            for status in ['LLM_DRAFT','EXPERT_REVIEW_PENDING',None]:
                with self.assertRaisesRegex(ValueError,'not an expert-verified'):validate_expert_review(Path(temp),{'status':status})

    def test_same_source_required_and_every_character_reviewed(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);form=read(s/'submissions/pilot/E1/P001.json')
            self.assertTrue(validate_expert_review(s,form))
            form['source_draft_sha256']='wrong'
            with self.assertRaisesRegex(ValueError,'same immutable'):validate_expert_review(s,form)
            form=read(s/'submissions/pilot/E1/P001.json');form['observations']['CHR_21']['review_action']=None
            with self.assertRaisesRegex(ValueError,'Every character'):validate_expert_review(s,form)

    def test_correction_requires_real_change_and_note(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);form=read(s/'submissions/pilot/E1/P001.json');o=form['observations']['CHR_02']
            o['review_action']='CORRECT';o['review_note']='SYNTHETIC NOTE'
            with self.assertRaisesRegex(ValueError,'require a change'):validate_expert_review(s,form)
            o.update(value='GLOBULAR',state='UNCERTAIN',reason='SYNTHETIC tentative visual observation')
            self.assertTrue(validate_expert_review(s,form))
            obs=validate_sheet(form,characters(),'P001','E1','pilot');self.assertEqual(obs['CHR_02']['state'],'UNCERTAIN')

    def test_raw_draft_mutation_is_rejected(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);p=s/'llm_drafts/pilot/P001/draft.json';p.write_text(p.read_text('utf-8')+' ',encoding='utf-8')
            with self.assertRaisesRegex(ValueError,'draft changed'):validate_expert_review(s,read(s/'submissions/pilot/E1/P001.json'))

    def test_no_implicit_approval(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);form=read(s/'submissions/pilot/E1/P001.json');form['expert_approval']=None
            with self.assertRaisesRegex(ValueError,'Actual reviewer'):validate_expert_review(s,form)

    def test_draft_schema_and_no_neutral_promotion(self):
        cs=list(characters().values());obs={c['id']:{'value':None,'state':'NOT_OBSERVABLE','reason':'SYNTHETIC visibility limit'} for c in cs}
        obs['CHR_02'].update(value='GLOBULAR',state='UNCERTAIN');self.assertEqual(validate_draft_observations(obs,cs)['CHR_02']['state'],'UNCERTAIN')
        broken=copy.deepcopy(obs);del broken['CHR_21']
        with self.assertRaises(ValueError):validate_draft_observations(broken,cs)
        self.assertNotIn('reference_genus',prompt_for(cs));self.assertNotIn('rule_chr_mapping',prompt_for(cs))

    def test_reviewed_pipeline_uses_frozen_paired_scorer(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);lock(s,'pilot');result=analyze(s,'pilot')
            self.assertEqual(result['n_specimens'],8);self.assertEqual(result['n_forms'],16)
            self.assertEqual(result['metrics']['acc1']['A0_minus_B1']['mean'],0)

    def test_no_confirmatory_drafts_from_reserved_or_missing_fossils(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s)
            with self.assertRaisesRegex(ValueError,'No new confirmatory fossils'):eligible_cases(s,'confirmatory')

    def test_drafting_rejects_historical_images_before_any_provider_call(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);rows=csvread(s/'coordinator_private/specimen_registry.csv')
            r=dict(rows[0]);r.update(specimen_id='F001',phase='confirmatory',independence_unit_id='SYNTHETIC_F001',material_mode='digital');rows.append(r)
            csvwrite(s/'coordinator_private/specimen_registry.csv',rows)
            im=s/'public/confirmatory/materials/F001/view01.png';im.parent.mkdir(parents=True);im.write_bytes(b'SYNTHETIC_PRIOR_HASH_TEST')
            save(s/'coordinator_private/excluded_prior_panel_hashes.json',{'sha256':[digest(im)]})
            with self.assertRaisesRegex(ValueError,'Previously evaluated panels'):eligible_cases(s,'confirmatory')

    def test_shared_raw_draft_is_included_in_analysis_lock(self):
        with tempfile.TemporaryDirectory(prefix='llm_review_SYNTHETIC_') as temp:
            s=Path(temp);self.fixture(s);lock(s,'pilot')
            sealed=s/'coordinator_private/locks/pilot/inputs/llm_drafts/pilot/P001/draft.json'
            self.assertTrue(sealed.exists());sealed.write_text(sealed.read_text('utf-8')+' ',encoding='utf-8')
            with self.assertRaisesRegex(ValueError,'Sealed original file changed'):analyze(s,'pilot')

if __name__=='__main__':unittest.main()
