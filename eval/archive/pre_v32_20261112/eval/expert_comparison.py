#!/usr/bin/env python3
"""Blinded two-observer, paired specimen-level comparison with frozen V29 A0/B1.

No human observations are generated. `lock` refuses incomplete or unblinded data.
`analyze` reads only the sealed inputs and frozen scorer, never the live service.
"""
from pathlib import Path
import argparse, csv, json, hashlib, shutil, subprocess, statistics, random
from datetime import datetime, timezone
from collections import defaultdict, Counter

ROOT=Path(__file__).resolve().parents[1]
DEFAULT=ROOT/'client/src/assets/scs/expert_study_v29'
NEUTRAL={'NOT_OBSERVABLE','UNCERTAIN'}
ABSTAIN={'INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA'}
METRICS=['acc1','acc3','coverage','reference_excluded','reference_omitted','reference_unavailable']
def read(p):return json.loads(Path(p).read_text('utf-8-sig'))
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def save(p,j):
    p=Path(p);p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def csvread(p):
    with Path(p).open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def csvwrite(p,rows,fields=None):
    p=Path(p);p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields or list(rows[0]));w.writeheader();w.writerows(rows)
def require(condition,message):
    if not condition:raise ValueError(message)

def check_version(study):
    version=read(study/'frozen_v29/version_lock.json')
    for relative,expected in version['files'].items():
        p=study/'frozen_v29'/relative
        require(p.exists() and digest(p)==expected,'Frozen V29 file missing or changed: '+relative)
    return version

def validate_sheet(sheet,characters,specimen,observer,phase):
    require(sheet.get('status') not in ['LLM_DRAFT','EXPERT_REVIEW_PENDING','AWAITING_LLM_DRAFT'],
            'Unapproved model drafts and pending templates are not expert observations')
    require(sheet.get('specimen_id')==specimen and sheet.get('observer_code')==observer and sheet.get('phase')==phase,
            'Wrong specimen/observer/phase on sheet: '+specimen+'/'+observer)
    obs=sheet.get('observations',{})
    require(set(obs)==set(characters),'Every sheet must contain exactly all 21 character IDs: '+specimen+'/'+observer)
    for c,o in obs.items():
        state=o.get('state');value=o.get('value')
        require(state in {'PRESENT','ABSENT'}|NEUTRAL,'Invalid or blank observation state: '+c)
        require(value in characters[c]['values'] or value in [None,''],'Invalid character value: '+c)
        if state not in NEUTRAL:
            require(value not in [None,'','NOT_OBSERVABLE','UNCERTAIN','UNKNOWN'],'Evaluable state requires a substantive value: '+c)
        if state=='ABSENT':require(value in ['ABSENT','NONE'],'ABSENT state must not turn a positive value into positive evidence. Use PRESENT + a negative CV value, or neutral: '+c)
    for key in ['reference_label_hidden','other_observer_hidden','system_outputs_hidden','independent_completion']:
        require(sheet.get('attestations',{}).get(key) is True,'Missing blinding declaration: '+specimen+'/'+observer+'/'+key)
    timing=sheet.get('timing',{})
    require(isinstance(timing.get('active_seconds'),(int,float)) and timing['active_seconds']>0,'Missing positive measured duration: '+specimen+'/'+observer)
    try:
        start=datetime.fromisoformat(timing['started_at'].replace('Z','+00:00'))
        end=datetime.fromisoformat(timing['completed_at'].replace('Z','+00:00'))
        require(start.tzinfo is not None and end.tzinfo is not None and end>start,'Timing requires chronological timezone-aware timestamps')
        require(timing['active_seconds']<=(end-start).total_seconds()+2,'Active duration exceeds elapsed duration')
    except (KeyError,TypeError):raise ValueError('Missing timestamp on sheet: '+specimen+'/'+observer)
    # Preserve neutral states and optional tentative values exactly. No VLM
    # normalization, inferred values, or reference-derived module assignment.
    return {c:{'value':o.get('value') or None,'state':o['state']} for c,o in obs.items()}

def validate_expert_review(study,sheet):
    """An LLM receipt, copied draft or incomplete review is never an approved form."""
    require(sheet.get('status')=='EXPERT_VERIFIED','An LLM_DRAFT or pending review is not an expert-verified form')
    sid=sheet['specimen_id'];phase=sheet['phase']
    draft_path=study/'llm_drafts'/phase/sid/'draft.json'
    require(draft_path.exists(),'The original shared LLM draft is missing')
    require(digest(draft_path)==read(draft_path.parent/'draft_seal.json')['sha256'],'Original LLM draft changed')
    draft=read(draft_path)
    require(draft.get('status')=='LLM_DRAFT','Original source must remain LLM_DRAFT')
    require(sheet.get('source_draft_sha256')==digest(draft_path),'Experts must review the same immutable raw draft')
    approval=sheet.get('expert_approval') or {}
    require(approval.get('completed_by_human') is True and approval.get('reviewer_code')==sheet['observer_code'], 'Actual reviewer completion and approval are required')
    approved=datetime.fromisoformat(str(approval.get('approved_at','')).replace('Z','+00:00'))
    require(approved.tzinfo is not None,'Approval timestamp must include timezone')
    for c,original in draft['observations'].items():
        o=sheet.get('observations',{}).get(c,{})
        require(isinstance(o.get('reason'),str) and bool(o['reason'].strip()),'Every reviewed row needs a visual reason: '+c)
        action=o.get('review_action')
        require(action in ['APPROVE','CORRECT','NEUTRAL'],'Every character needs an explicit human review action: '+c)
        same=all(o.get(k)==original.get(k) for k in ['value','state','reason'])
        if action=='APPROVE':require(same,'Approved row differs from its raw draft: '+c)
        if action=='CORRECT':require(not same and bool(str(o.get('review_note','')).strip()),'Corrections require a change and human explanation: '+c)
        if action=='NEUTRAL':require(o.get('state') in NEUTRAL and bool(str(o.get('review_note','')).strip()),'Neutral markings require neutral state and human explanation: '+c)
    return True

def collect(study,phase):
    check_version(study);config=read(study/'study_config.json')
    roster=csvread(study/'coordinator_private/roster.csv')
    observers=config['observer_codes'];require(len(observers)==2 and len(set(observers))==2,'Exactly two distinct observer codes required')
    people={r['person_code']:r for r in roster}
    for code in observers:
        p=people.get(code,{})
        require(p.get('role')=='OBSERVER' and all(p.get(k)=='yes' for k in ['participation_confirmed','expertise_verified','independent_of_rule_development']),
                'Observer is not recruited/verified/independent: '+code)
    registry=csvread(study/'coordinator_private/specimen_registry.csv')
    enrolled=[r for r in registry if r['phase']==phase and r['enrolled']=='yes']
    n=len(enrolled)
    require(8<=n<=10 if phase=='pilot' else n==config['confirmatory_target'],f'{phase}: expected 8–10 pilot or {config["confirmatory_target"]} confirmatory specimens; found {n}')
    require(len({r['specimen_id'] for r in enrolled})==n,'Duplicate specimen ID')
    require(all(r['independence_unit_id'] for r in enrolled),'Physical specimen unit IDs must be documented')
    require(len({r['independence_unit_id'] for r in enrolled})==n,'The same fossil has multiple specimen codes. Merge its views under one code.')
    pilot_units={r['independence_unit_id'] for r in registry if r['phase']=='pilot' and r['enrolled']=='yes'}
    if phase=='confirmatory':
        require(not pilot_units & {r['independence_unit_id'] for r in enrolled},'Pilot specimens cannot enter the confirmatory set')
        require(config.get('protocol_finalized') is True and config.get('pilot_review_completed') is True,'Review the pilot and finalize the protocol before the confirmatory lock')
        independent_pilot=(study/'results/pilot/summary.json').exists()
        usability_path=study/'results/pilot_usability/summary.json'
        usability=read(usability_path) if usability_path.exists() else {}
        require(independent_pilot or (usability.get('status')=='REAL_FORM_USABILITY_RESULT' and usability.get('completed_observer_pairs',0)>=8),
                'Complete and review an 8–10-case pilot before the confirmatory lock')
    data=read(study/'frozen_v29/api/data/characters.json');characters={c['id']:c for c in data['characters']}
    genera={r['genus']:r['module'] for r in read(study/'frozen_v29/api/data/rule_chr_mapping.json')}
    files={};cases=[];references={};timings=[]
    for p in [study/'study_config.json',study/'coordinator_private/roster.csv',study/'coordinator_private/specimen_registry.csv']:
        files[p.relative_to(study).as_posix()]=p
    for p in [study/'Study_Protocol_TR.md',study/'Study_Protocol_TR.docx']:
        if p.exists():files[p.relative_to(study).as_posix()]=p
    for observer in observers:
        for p in (study/'public'/phase/observer).glob('*'):
            if p.is_file():files[p.relative_to(study).as_posix()]=p
    for r in enrolled:
        sid=r['specimen_id']
        require(r['source_collection'] and r['archive_record_id'] and r['reference_evidence'],'Missing archive/source/reference provenance: '+sid)
        if config.get('requires_llm_expert_review'):
            require(r.get('bootstrap_cluster_id'),'Document the source cluster; do not assume that fossils from the same source are independent: '+sid)
        require(r['used_in_rule_construction']=='no' and r['independence_verified']=='yes','Source independence not verified: '+sid)
        require(r['reference_status']=='verified' and r['reference_genus'] in genera,'Reference must be verified and in the frozen core before enrollment: '+sid)
        verifier=people.get(r['reference_verifier_code'],{})
        require(r['reference_verifier_code'] not in observers and verifier.get('role')=='REFERENCE_VERIFIER' and verifier.get('participation_confirmed')=='yes' and verifier.get('expertise_verified')=='yes','Independent reference verifier missing: '+sid)
        require(r['reference_module']==genera[r['reference_genus']],'Reference module differs from frozen core record: '+sid)
        require(r['material_mode'] in ['digital','physical'] and r['blinding_reviewed']=='yes','Blinded material has not been reviewed: '+sid)
        materials=[]
        if r['material_mode']=='digital':
            folder=study/'public'/phase/'materials'/sid
            materials=[p for p in sorted(folder.glob('*')) if p.is_file()]
            require(materials,'No digital material for '+sid)
            import re
            for p in materials:
                require(re.fullmatch(r'view\d{2}\.(png|jpg|jpeg|tif|tiff|webp)',p.name,re.I),'Use neutral view01/view02 filenames, not archive/taxon names: '+p.name)
                files[p.relative_to(study).as_posix()]=p
        material_hashes=sorted(digest(p) for p in materials)
        prior=study/'coordinator_private/excluded_prior_panel_hashes.json'
        if phase=='confirmatory' and prior.exists():
            require(not set(material_hashes)&set(read(prior)['sha256']), 'Previously evaluated published images are not eligible confirmatory material: '+sid)
        references[sid]={'genus':r['reference_genus'],'module':r['reference_module'],'unit':r['independence_unit_id'],
                         'bootstrap_cluster':r.get('bootstrap_cluster_id') or r['independence_unit_id']}
        for observer in observers:
            path=study/'submissions'/phase/observer/(sid+'.json')
            require(path.exists(),'Missing real observer submission: '+str(path.relative_to(study)))
            sheet=read(path);obs=validate_sheet(sheet,characters,sid,observer,phase)
            if config.get('requires_llm_expert_review'):validate_expert_review(study,sheet)
            if config.get('requires_llm_expert_review'):
                draft_path=study/'llm_drafts'/phase/sid/'draft.json'
                for p in [draft_path,draft_path.parent/'draft_seal.json']:
                    files[p.relative_to(study).as_posix()]=p
                provider=read(draft_path).get('provenance',{}).get('raw_provider_file')
                if provider:
                    p=draft_path.parent/provider;files[p.relative_to(study).as_posix()]=p
            require(sheet.get('material_mode')==r['material_mode'],'Sheet and registry material modes differ: '+sid)
            if materials:
                require(sorted(x['sha256'] for x in sheet.get('materials',[]))==material_hashes,'Observers must inspect exactly the same registered image set: '+sid+'/'+observer)
            else:require(sheet.get('physical_material_code')==sid,'Physical specimen code not attested: '+sid+'/'+observer)
            o=obs['CHR_01'];module=o['value'] if o['state'] not in NEUTRAL and o['value'] in ['AGGLUTINATED','PORCELANEOUS','HYALINE'] else None
            cases.append({'case_id':sid+'__'+observer,'specimen_id':sid,'observer_code':observer,'observations':obs,'module':module})
            timings.append({'specimen_id':sid,'observer_code':observer,'active_seconds':sheet['timing']['active_seconds']})
            files[path.relative_to(study).as_posix()]=path
    if phase=='confirmatory':require(set(r['reference_module'] for r in enrolled)=={'AGGLUTINATED','PORCELANEOUS','HYALINE'},'Confirmatory specimens must span all three wall modules')
    if config.get('requires_llm_expert_review'):
        for name in ['prompt.txt','generation_config.json','model_availability_amendment.json']:
            p=study/'llm_drafts'/name
            if p.exists():files[p.relative_to(study).as_posix()]=p
    return config,cases,references,timings,files

def lock(study,phase):
    config,cases,refs,timings,files=collect(study,phase)
    dest=study/'coordinator_private/locks'/phase
    require(not dest.exists(),'A phase lock already exists; do not overwrite sealed inputs')
    manifest={name:digest(p) for name,p in files.items()}
    dest.mkdir(parents=True)
    for relative,p in files.items():
        q=dest/'inputs'/relative;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,q)
    save(dest/'sealed.json',{'status':'REAL_DATA_SEALED','phase':phase,'created_at':datetime.now(timezone.utc).isoformat(),
      'config':config,'analysis_script_sha256':digest(__file__),'version_lock_sha256':digest(study/'frozen_v29/version_lock.json'),'input_hashes':manifest,
      'cases':cases,'references':refs,'timings':timings})
    shutil.copyfile(__file__,dest/'analysis_source.py')
    save(dest/'seal.json',{'sealed_json_sha256':digest(dest/'sealed.json')})
    return {'status':'SEALED_NOT_YET_SCORED','phase':phase,'n_specimens':len(refs),'n_forms':len(cases)}

def credit(result,truth,k):
    if result['status'] in ABSTAIN:return 0.
    ranking=result['ranking'];target=next((r for r in ranking if r['genus']==truth),None)
    if target is None:return 0.
    above=sum(r['score']>target['score'] for r in ranking);ties=sum(r['score']==target['score'] for r in ranking)
    return max(0.,min(1.,(k-above)/ties))

def usability_report(study):
    """Pilot form/timing only: no reference labels and no algorithm scoring."""
    config=read(study/'study_config.json');observers=config['observer_codes']
    registry=[r for r in csvread(study/'coordinator_private/specimen_registry.csv') if r['phase']=='pilot' and r['enrolled']=='yes']
    roster={r['person_code']:r for r in csvread(study/'coordinator_private/roster.csv')}
    chars={c['id']:c for c in read(study/'frozen_v29/api/data/characters.json')['characters']}
    records=[];counts=defaultdict(int);neutral=defaultdict(lambda:[0,0])
    for r in registry:
        sid=r['specimen_id']
        expected=sorted(digest(p) for p in (study/'public/pilot/materials'/sid).glob('*') if p.is_file())
        for observer in observers:
            path=study/'submissions/pilot'/observer/(sid+'.json')
            if not path.exists():continue
            person=roster.get(observer,{})
            require(person.get('participation_confirmed')=='yes' and person.get('expertise_verified')=='yes','Participant not confirmed for actual usability data: '+observer)
            sheet=read(path);obs=validate_sheet(sheet,chars,sid,observer,'pilot')
            if config.get('requires_llm_expert_review'):validate_expert_review(study,sheet)
            require(sheet.get('material_mode')==r['material_mode'],'Wrong pilot material mode')
            if expected:require(sorted(x['sha256'] for x in sheet.get('materials',[]))==expected,'Wrong preparation image set: '+sid)
            elif r['material_mode']=='physical':require(sheet.get('physical_material_code')==sid,'Wrong physical preparation code: '+sid)
            records.append({'specimen_id':sid,'observer_code':observer,'active_seconds':sheet['timing']['active_seconds'],'feedback':sheet.get('pilot_feedback','')})
            counts[sid]+=1
            for c,o in obs.items():neutral[(observer,c)][0]+=int(o['state'] in NEUTRAL);neutral[(observer,c)][1]+=1
    result={'status':'REAL_FORM_USABILITY_RESULT' if records else 'PREPARATION_NO_SUBMISSIONS',
      'scope':'Form usability on preparation image cases only; no genus accuracy or independent specimen validation.',
      'image_cases_prepared':len(registry),'expected_forms':2*len(registry),'actual_human_forms':len(records),
      'completed_observer_pairs':sum(n==2 for n in counts.values()),'independent_validation_performed':False,'timing_summary':[]}
    for observer in observers:
        ts=[r['active_seconds']/60 for r in records if r['observer_code']==observer]
        if ts:result['timing_summary'].append({'observer_code':observer,'n':len(ts),'median_minutes':statistics.median(ts),'min_minutes':min(ts),'max_minutes':max(ts)})
    if records:
        folder=study/'results/pilot_usability';save(folder/'summary.json',result);csvwrite(folder/'form_timing.csv',records)
        csvwrite(folder/'character_missingness.csv',[{'observer_code':o,'character_id':c,'neutral':v[0],'completed':v[1]} for (o,c),v in neutral.items()])
    return result

def aggregate(form_rows):
    groups=defaultdict(list)
    for r in form_rows:groups[(r['specimen_id'],r['method'])].append(r)
    rows=[]
    for (sid,method),rr in sorted(groups.items()):
        require(len(rr)==2 and len({r['observer_code'] for r in rr})==2,'Exactly two observations per specimen/method required')
        rows.append({'specimen_id':sid,'method':method,'bootstrap_cluster':rr[0]['bootstrap_cluster'],
          **{k:statistics.mean(float(r[k]) for r in rr) for k in METRICS}})
    return rows

def bootstrap(rows,resamples=5000,seed=20261112):
    by=defaultdict(dict)
    for r in rows:by[r['specimen_id']][r['method']]=r
    require(all(set(methods)=={'A0','B1'} for methods in by.values()),'Unpaired method output')
    clusters=defaultdict(list)
    for sid,m in by.items():clusters[m['A0']['bootstrap_cluster']].append(sid)
    keys=sorted(clusters);rng=random.Random(seed);draws=defaultdict(list)
    estimates={}
    for metric in METRICS:
        estimates[metric]={method:statistics.mean(x[method][metric] for x in by.values()) for method in ['A0','B1']}
        estimates[metric]['A0_minus_B1']=estimates[metric]['A0']-estimates[metric]['B1']
    if len(keys)>=2:
        for _ in range(resamples):
            selected=[sid for key in rng.choices(keys,k=len(keys)) for sid in clusters[key]]
            for metric in METRICS:
                a=statistics.mean(by[s]['A0'][metric] for s in selected);b=statistics.mean(by[s]['B1'][metric] for s in selected)
                for name,value in [('A0',a),('B1',b),('A0_minus_B1',a-b)]:draws[(metric,name)].append(value)
    for metric,methods in estimates.items():
        for method,mean in list(methods.items()):
            values=sorted(draws[(metric,method)])
            methods[method]={'mean':mean,'low':values[max(0,int(.025*len(values))-1)] if values else None,
              'high':values[min(len(values)-1,int(.975*len(values))-1)] if values else None}
    return {'n_specimens':len(by),'n_bootstrap_clusters':len(keys),'resamples':resamples,'seed':seed,
      'aggregation':'Mean of two observer credits within each specimen, then equal mean across specimens. Method pairs and both observers stay together during resampling.',
      'metrics':estimates}

def analyze(study,phase):
    check_version(study);folder=study/'coordinator_private/locks'/phase
    require(folder.exists(),'Seal the real, complete forms before any scoring')
    sealed=folder/'sealed.json';require(digest(sealed)==read(folder/'seal.json')['sealed_json_sha256'],'Sealed input bundle changed')
    data=read(sealed)
    require(digest(__file__)==data['analysis_script_sha256'],'Analysis implementation changed after sealing')
    require(digest(folder/'analysis_source.py')==data['analysis_script_sha256'],'Sealed analysis implementation changed')
    require(digest(study/'frozen_v29/version_lock.json')==data['version_lock_sha256'],'Version lock changed after sealing')
    for rel,expected in data['input_hashes'].items():require(digest(folder/'inputs'/rel)==expected,'Sealed original file changed: '+rel)
    # The scoring subprocess receives no reference labels, archive IDs or
    # information from the other observer. Exactly the same input goes to A0/B1.
    results=[]
    for c in data['cases']:
        request={'cases':[{'case_id':c['case_id'],'module':c['module'],'observations':c['observations']}],
          'configurations':[{'id':'A0'},{'id':'B1','baseline':'B1'}]}
        run=subprocess.run(['node',str(study/'frozen_v29/eval/engine_bridge.cjs')],input=json.dumps(request),text=True,encoding='utf-8',capture_output=True)
        require(run.returncode==0,run.stderr);results.extend(json.loads(run.stdout))
    cases={c['case_id']:c for c in data['cases']};rows=[]
    for r in results:
        c=cases[r['case_id']];ref=data['references'][c['specimen_id']];truth=ref['genus']
        omitted=truth not in r['excluded'] and all(x['genus']!=truth for x in r['ranking'])
        rows.append({'specimen_id':c['specimen_id'],'observer_code':c['observer_code'],'method':r['configuration'],
          'bootstrap_cluster':ref['bootstrap_cluster'],'status':r['status'],'reference_genus':truth,
          'acc1':credit(r,truth,1),'acc3':credit(r,truth,3),'coverage':int(r['status'] not in ABSTAIN),
          'reference_excluded':int(truth in r['excluded']),'reference_omitted':int(omitted),'reference_unavailable':int(truth in r['excluded'] or omitted)})
    require(len(rows)==4*len(data['references']),'Incomplete paired run')
    specimen=aggregate(rows);summary=bootstrap(specimen,data['config']['bootstrap_resamples'],data['config']['seed'])
    summary.update(phase=phase,status='PILOT_DESCRIPTIVE_ONLY' if phase=='pilot' else 'CONFIRMATORY_PAIRED_RESULT',
      n_forms=len(cases),source_version='frozen V29 A0 and published B1 implementation',
      version_lock_sha256=data['version_lock_sha256'],sealed_input_sha256=digest(sealed),
      interpretation='Positive A0-minus-B1 favors A0 for accuracy/coverage, but is adverse for exclusion/omission. An interval containing zero does not establish a difference. Two observers do not represent a population of specialists.')
    output=study/'results'/phase;require(not output.exists(),'Do not overwrite analyzed results; use a new reviewed revision')
    csvwrite(output/'form_level_metrics.csv',rows);csvwrite(output/'specimen_level_metrics.csv',specimen)
    save(output/'scoring_receipts.json',results);save(output/'summary.json',summary)
    timing=[]
    for o in data['config']['observer_codes']:
        times=[x['active_seconds'] for x in data['timings'] if x['observer_code']==o]
        timing.append({'observer_code':o,'n':len(times),'median_minutes':statistics.median(times)/60,'min_minutes':min(times)/60,'max_minutes':max(times)/60})
    save(output/'timing_summary.json',timing)
    lines=['# '+summary['status'],'','Real specimens: '+str(summary['n_specimens'])+'; forms: '+str(summary['n_forms'])+'; bootstrap clusters: '+str(summary['n_bootstrap_clusters']),
      '', '| Metric | A0 % | B1 % | A0 − B1, percentage points [95% interval] |','|---|---:|---:|---:|']
    for metric,values in summary['metrics'].items():
        a,b,delta=values['A0'],values['B1'],values['A0_minus_B1']
        interval=f"{100*delta['low']:.1f}, {100*delta['high']:.1f}" if delta['low'] is not None else 'N/A'
        lines.append(f"| {metric} | {100*a['mean']:.1f} | {100*b['mean']:.1f} | {100*delta['mean']:.1f} [{interval}] |")
    (output/'results_for_manuscript.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    return summary

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('command',choices=['check','receive','usability','lock','analyze']);p.add_argument('--study',type=Path,default=DEFAULT);p.add_argument('--phase',choices=['pilot','confirmatory'],default='pilot');p.add_argument('--file',type=Path);a=p.parse_args()
    try:
        if a.command=='check':
            _,cases,refs,_,_=collect(a.study,a.phase);result={'status':'REAL_INPUTS_VALIDATED','specimens':len(refs),'forms':len(cases)}
        elif a.command=='receive':
            require(a.file is not None,'receive requires --file completed_form.json')
            sheet=read(a.file);sid=sheet.get('specimen_id');observer=sheet.get('observer_code');config=read(a.study/'study_config.json')
            registered=csvread(a.study/'coordinator_private/specimen_registry.csv')
            require(any(r['specimen_id']==sid and r['phase']==a.phase and r['enrolled']=='yes' for r in registered),'Form is not for an enrolled specimen in this phase')
            require(observer in config['observer_codes'],'Unknown observer code')
            chars={c['id']:c for c in read(a.study/'frozen_v29/api/data/characters.json')['characters']}
            validate_sheet(sheet,chars,sid,observer,a.phase)
            if config.get('requires_llm_expert_review'):
                people={r['person_code']:r for r in csvread(a.study/'coordinator_private/roster.csv')}
                person=people.get(observer,{})
                require(person.get('participation_confirmed')=='yes' and person.get('expertise_verified')=='yes','Coordinator must first confirm the actual expert behind this role code')
                validate_expert_review(a.study,sheet)
            dest=a.study/'submissions'/a.phase/observer/(sid+'.json');require(not dest.exists(),'Submission already exists; do not overwrite observer data')
            dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(a.file,dest)
            result={'status':'RECEIVED_UNSCORED','sha256':digest(dest),'specimen_id':sid,'observer_code':observer}
        elif a.command=='usability':result=usability_report(a.study)
        elif a.command=='lock':result=lock(a.study,a.phase)
        else:result=analyze(a.study,a.phase)
        print(json.dumps(result,ensure_ascii=True,indent=2))
    except (ValueError,FileNotFoundError) as e:p.exit(2,'Not ready: '+str(e)+'\n')

if __name__=='__main__':main()
