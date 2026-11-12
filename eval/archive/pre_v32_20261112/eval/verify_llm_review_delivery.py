"""Verify real draft provenance and package separation; never score a draft."""
from expert_comparison import *
from llm_observation_drafts import STUDY,validate_draft_observations,prompt_for
from docx import Document
import re,zipfile

def verify(study=STUDY):
    check_version(study);chars=read(study/'frozen_v29/api/data/characters.json')['characters']
    prompt_hash=hashlib.sha256(prompt_for(chars).encode()).hexdigest()
    names={r['genus'] for r in read(study/'frozen_v29/api/data/rule_chr_mapping.json')}
    rows=[]
    for p in sorted((study/'llm_drafts/pilot').glob('*/draft.json')):
        d=read(p);validate_draft_observations(d['observations'],chars)
        require(d['status']=='LLM_DRAFT' and d['expert_approval'] is None,'A raw model draft cannot acquire human approval')
        require(digest(p)==read(p.parent/'draft_seal.json')['sha256'],'Draft seal mismatch')
        pr=d['provenance'];require(pr['prompt_sha256']==prompt_hash,'Draft prompt mismatch')
        require(pr['dictionary_sha256']==digest(study/'frozen_v29/api/data/characters.json'),'Draft dictionary mismatch')
        require(digest(p.parent/pr['raw_provider_file'])==pr['raw_provider_sha256'],'Raw provider receipt mismatch')
        for im in pr['images']:
            require(digest(study/'public/pilot/materials'/im['coded_file'])==im['sha256'],'Coded image changed')
        reasons=' '.join(o['reason'] for o in d['observations'].values())
        require(not any(re.search(r'\b'+re.escape(g)+r'\b',reasons,re.I) for g in names),'Genus text in a morphology-only draft requires coordinator review')
        rows.append({'case_id':d['specimen_id'],'status':d['status'],'n_characters':len(d['observations']),'draft_sha256':digest(p),'model_returned':pr['model_version_returned']})
    observers=read(study/'study_config.json')['observer_codes']
    with zipfile.ZipFile(study/('Review_'+observers[0]+'_Pilot.zip')) as a,zipfile.ZipFile(study/('Review_'+observers[1]+'_Pilot.zip')) as b:
        for i,z in enumerate([a,b]):
            require(z.testzip() is None,'Reviewer ZIP CRC mismatch')
            require(not any(any(k in n.lower() for k in ['coordinator','reference_labels','scoring','results']) for n in z.namelist()),'Private reference or algorithm data in reviewer package')
            html=z.read('Review_Form.html').decode('utf-8')
            require(observers[1-i] not in html,'The other observer code/data must not be embedded in a review interface')
            for n in z.namelist():
                if n.endswith('_PENDING_TEMPLATE.json'):
                    d=json.loads(z.read(n));require(d['status']=='EXPERT_REVIEW_PENDING' and d['expert_approval'] is None,'Pending form approval must remain empty')
                    require(all(o['review_action'] is None and o['review_note']=='' for o in d['observations'].values()),'Do not prepopulate human review decisions')
            for p in (study/'review_forms/pilot'/observers[i]).glob('*_Expert_Review.docx'):
                require(len(Document(p).tables[0].rows)==22,'Word review instrument needs 21 character rows')
        shared=[n for n in a.namelist() if n.startswith('shared_raw_drafts/')]
        require(len(shared)==len(rows),'Missing shared raw draft')
        for n in shared:require(a.read(n)==b.read(n),'Two experts received different raw drafts')
    require(not list((study/'submissions').rglob('*.json')),'Preparation delivery cannot fabricate actual submissions')
    require(not (study/'results').exists(),'No human performance or usability result exists yet')
    roster=csvread(study/'coordinator_private/roster.csv')
    require(all(r['participation_confirmed']=='' and r['expertise_verified']=='' for r in roster),'Do not assert expert participation before recruitment')
    main=[r for r in csvread(study/'coordinator_private/specimen_registry.csv') if r['phase']=='confirmatory']
    require(len(main)==60 and all(r['enrolled']!='yes' and not r['reference_genus'] and not r['independence_unit_id'] for r in main),'Reserved main-study codes must remain unassigned')
    exported=csvread(study/'PILOT_DRAFT_OBSERVATIONS.csv')
    require(len(exported)==21*len(rows),'Wrong number of draft-only CSV records')
    for r in exported:
        require(r['status']=='LLM_DRAFT' and r['expert_approval']=='','CSV must not assert expert approval')
        original=read(study/'llm_drafts/pilot'/r['case_id']/'draft.json')['observations'][r['character_id']]
        require(r['state']==original['state'] and r['value']==(original['value'] or '') and r['visual_reason']==original['reason'],'CSV differs from raw immutable draft')
    return {'passed':True,'purpose':'Preparation/provenance checks only; not a performance evaluation','drafts':rows,'same_raw_draft_for_both_observers':True,
      'reviewer_package_privacy_passed':True,'frozen_V29_four_hashes_match':True,'exported_draft_character_records':len(exported),'actual_human_forms':0,'actual_verified_references':0,'main_fossils_assigned':0,'performance_tables':0}

if __name__=='__main__':
    result=verify();save(STUDY/'evidence/delivery_verification.json',result);print(json.dumps(result,indent=2))
