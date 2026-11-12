"""Verify supplied archives and stage an unscored LLM-draft review pilot."""
from expert_comparison import *
from pathlib import PurePosixPath
import zipfile

DEST=ROOT/'client/src/assets/scs/llm_expert_review_v31'
INPUTS=ROOT/'client/src/assets/scs/abc'

def verify_archive(z,base):
    checked=[]
    for line in z.read(base+'SHA256SUMS.txt').decode('utf-8-sig').splitlines():
        if not line.strip():continue
        expected,relative=line.split(maxsplit=1)
        p=PurePosixPath(relative.lstrip('*').replace('\\','/'))
        require('..' not in p.parts and not p.is_absolute(),'Unsafe archive checksum path')
        name=base+p.as_posix();ok=name in z.namelist() and hashlib.sha256(z.read(name)).hexdigest()==expected
        checked.append({'path':p.as_posix(),'passed':ok})
    require(all(c['passed'] for c in checked),'Supplied S10 checksum mismatch')
    return checked

def main():
    require(not (DEST/'study_config.json').exists(),'Study already staged; do not overwrite drafts or reviews')
    DEST.mkdir(parents=True,exist_ok=True)
    source=DEFAULT;hist=INPUTS/'Foraminifer_Supplementary_Materials_S1-S9.zip';prep=INPUTS/'S10_Expert_Study_Preparation.zip'
    report={'requested_but_not_found':['Foraminifer_Manuscript_v31.docx','Foraminifer_Supplementary_Material_S10.zip'],
      'requested_S1_S9_parenthetical_copy':'User supplied unsuffixed archive path; this exact file, not an assumed (1) copy, was used.',
      'archives':{},'versions_are_distinct':True}
    with zipfile.ZipFile(prep) as z:
        require(z.testzip() is None,'S10 archive CRC mismatch');base='S10_Expert_Study_Preparation/'
        checks=verify_archive(z,base);lock=read(source/'frozen_v29/version_lock.json')
        actual_lock=json.loads(z.read(base+'frozen_v29/version_lock.json'))
        for relative,expected in actual_lock['files'].items():
            data=z.read(base+'frozen_v29/'+relative);require(hashlib.sha256(data).hexdigest()==expected,'Frozen archive version mismatch')
            require(lock['files'].get(relative)==expected,'Local pilot and supplied frozen snapshot differ')
            target=DEST/'frozen_v29'/relative;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
        (DEST/'frozen_v29/version_lock.json').write_bytes(z.read(base+'frozen_v29/version_lock.json'))
        report['archives']['S10_preparation']={'source':str(prep),'sha256':digest(prep),'crc_passed':True,'checksum_entries':checks,'version_lock_files_verified':4,'contains_analysis_script':any(n.endswith('expert_comparison.py') for n in z.namelist())}
    with zipfile.ZipFile(hist) as z:
        require(z.testzip() is None,'Historical archive CRC mismatch')
        manifest=json.loads(z.read('evaluation/panel_manifest.json'));cfg=json.loads(z.read('evaluation/execution_config.json'))
        require(hashlib.sha256(z.read('evaluation/panel_manifest.json')).hexdigest()==cfg['manifestSha256'],'Historical manifest hash mismatch')
        for p in manifest:require(hashlib.sha256(z.read('evaluation/'+p['file'])).hexdigest()==p['sha256'],'Historical panel image hash mismatch')
        for name,key in [('S4_scoring_snapshot.js','scoringSha256'),('S4_controller_snapshot.js','controllerSha256'),('S4_prompt_source.js','promptSha256')]:
            require(hashlib.sha256(z.read('supplementary/S4_vision_observer/'+name)).hexdigest()==cfg[key],'Historical snapshot checksum mismatch')
        historical={'classification':'V27_HISTORICAL_EVALUATION_ARCHIVE','source':str(hist),'sha256':digest(hist),'crc_passed':True,
          'n_panels':len(manifest),'all_panel_hashes_verified':True,'historical_scorer_sha256':cfg['scoringSha256'],
          'historical_rules_sha256':cfg['rulesSha256'],'not_the_repaired_V29_S9':True,
          'SHA256SUMS_txt_present':any(n.endswith('SHA256SUMS.txt') for n in z.namelist())}
        report['archives']['S1_S9']=historical
        require(cfg['scoringSha256']!=actual_lock['files']['api/src/services/scoring.js'],'Do not silently equate the historical and repaired versions')
    config=read(source/'study_config.json');config.update(status='LLM_DRAFT_REVIEW_PREPARATION',design='blinded expert review of LLM-drafted observations',requires_llm_expert_review=True)
    save(DEST/'study_config.json',config)
    for name in ['roster.csv','specimen_registry.csv','reference_labels.csv','pilot_case_mapping.csv','excluded_prior_panel_hashes.json']:
        q=DEST/'coordinator_private'/name;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source/'coordinator_private'/name,q)
    registry=csvread(DEST/'coordinator_private/specimen_registry.csv');cases=[r['specimen_id'] for r in registry if r['phase']=='pilot' and r['enrolled']=='yes']
    require(len(cases)==10,'Expected prepared P001-P010 materials')
    for code in cases:
        a=source/'public/pilot/materials'/code;b=DEST/'public/pilot/materials'/code
        shutil.copytree(a,b)
    for observer in config['observer_codes']:
        for phase in ['pilot','confirmatory']:(DEST/'submissions'/phase/observer).mkdir(parents=True,exist_ok=True)
    (DEST/'llm_drafts/pilot').mkdir(parents=True,exist_ok=True)
    save(DEST/'evidence/input_archive_verification.json',report)
    save(DEST/'evidence/source_file_hashes.json',{str(p):digest(p) for p in [hist,prep,ROOT/'eval/expert_comparison.py']})
    save(DEST/'coordinator_private/historical_panel_manifest.json',manifest)
    print(json.dumps({'study':str(DEST),'S10_checksums_verified':len(checks),'historical_panels_verified':len(manifest),'pilot_image_cases':cases,'V31_source_available':False,'human_reviews':0},indent=2))

if __name__=='__main__':main()
