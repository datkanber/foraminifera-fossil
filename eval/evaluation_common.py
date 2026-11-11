"""Shared offline inputs/metrics. No provider calls; no test-set model fitting."""
from pathlib import Path
import json, subprocess, csv, collections, random, hashlib

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'eval/results/revision'
PANEL=ROOT/'client/src/assets/scs/evaluation'
ABSTAIN={'INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA'}

def read(path): return json.loads(Path(path).read_text('utf-8'))
def write(name,obj):
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def csvwrite(name,rows):
    if not rows:return
    with (OUT/name).open('w',encoding='utf-8',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader()
        for r in rows:w.writerow({k:json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else v for k,v in r.items()})

def engine(cases,configurations=None,**kwargs):
    request={'cases':cases,'configurations':configurations or [{'id':'A0'}],**kwargs}
    run=subprocess.run(['node',str(ROOT/'eval/engine_bridge.cjs')],input=json.dumps(request),text=True,encoding='utf-8',capture_output=True,cwd=ROOT)
    if run.returncode:raise RuntimeError(run.stderr)
    return json.loads(run.stdout)

def credit(result,truth,k,abstentions=True):
    if abstentions and result['status'] in ABSTAIN:return 0.0
    ranking=result['ranking'];target=next((r for r in ranking if r['genus']==truth),None)
    if target is None:return 0.0
    above=sum(r['score']>target['score'] for r in ranking)
    ties=sum(r['score']==target['score'] for r in ranking)
    return max(0.,min(1.,(k-above)/ties))

def path_cases():
    paths=read(OUT/'before_paths.json')
    cases=[]
    for i,p in enumerate(paths):
        obs=dict(x.split('=',1) for x in p['observations'].split('; ') if x)
        cases.append({'case_id':f'PATH_{i+1:03}', 'dataset':'paths','reference_genus':p['leaf_genus'],
          'module':p['module'].upper(),'cohort':'internal','observations':{k:{'value':v,'state':'PRESENT'} for k,v in obs.items()}})
    assert len(cases)==104
    return cases

def panel_cases(preserve_uncertainty=False):
    result=[]
    for p in read(PANEL/'panel_manifest.json'):
        raw=read(PANEL/'raw'/f"{p['image_id']}.json")
        assert raw['success']
        obs=json.loads(json.dumps(raw['response']['observation']['observations']))
        if preserve_uncertainty:
            source=raw['raw_response'] if 'raw_response' in raw else None
            # Exact provider receipt is read below; fail instead of guessing schema.
            data=next((a.get('providerResponse') for a in reversed(raw.get('attempts',[])) if a.get('providerResponse',{}).get('candidates')),None) or raw.get('provider_response',raw.get('raw_provider_response',{}))
            if not data: data=raw.get('provider',{})
            candidate=data.get('candidates',[{}])[0] if isinstance(data,dict) else {}
            text=''.join(x.get('text','') for x in candidate.get('content',{}).get('parts',[]))
            if not text:
                # Primary run receipts store the returned provider body under raw.
                data=raw.get('raw',{})
                text=''.join(x.get('text','') for x in data.get('candidates',[{}])[0].get('content',{}).get('parts',[]))
            text=text.strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
            parsed=json.loads(text)
            original=parsed.get('observations',parsed.get('observation',{}).get('observations',{}))
            assert original, 'Cannot find raw observations in provider receipt'
            for c,o in original.items():
                if c in obs and o.get('state') in ['NOT_OBSERVABLE','UNCERTAIN'] and obs[c].get('state') not in ['NOT_OBSERVABLE','UNCERTAIN']:
                    obs[c]['state']=o['state']
        o=obs.get('CHR_01',{})
        module=o.get('value') if o.get('state') not in ['UNCERTAIN','NOT_OBSERVABLE'] else None
        if module not in ['AGGLUTINATED','PORCELANEOUS','HYALINE']:module=None
        result.append({'case_id':p['image_id'],'dataset':'panels_raw_neutral' if preserve_uncertainty else 'panels',
            'reference_genus':p['reference_genus'],'reference_module':p['module'],'module':module,
            'cohort':p['cohort'],'cluster':p.get('cluster_id',p.get('cluster',p.get('source_cluster'))),'observations':obs})
    assert len(result)==150
    return result

def metrics(cases,results):
    assert len(cases)==len(results)
    rows=[]
    for c,r in zip(cases,results):
        assert c['case_id']==r['case_id']
        truth=c['reference_genus'];target=next((x for x in r['ranking'] if x['genus']==truth),None)
        above=sum(x['score']>target['score'] for x in r['ranking']) if target else None
        ties=sum(x['score']==target['score'] for x in r['ranking']) if target else None
        rows.append({'case_id':c['case_id'],'dataset':c['dataset'],'module':c.get('reference_module',c['module']),
          'cohort':c.get('cohort'),'reference_genus':truth,'status':r['status'],'prediction':r['identification'],
          'acc1':credit(r,truth,1),'acc3':credit(r,truth,3),'reference_excluded':truth in r['excluded'],
          'reference_omitted':not target and truth not in r['excluded'],
          'rank1_unique':target is not None and above==0 and ties==1,
          'rank1_tied':target is not None and above==0 and ties>1,
          'top3_shared_rank':target is not None and above<3,
          'confirmed_correct':r['status']=='CONFIRMED_GENUS' and r['identification']==truth})
    return rows

def summary(rows):
    n=len(rows)
    return {'n':n,'acc1':sum(r['acc1'] for r in rows)/n,'acc3':sum(r['acc3'] for r in rows)/n,
      'coverage':sum(r['status'] not in ABSTAIN for r in rows)/n,
      'reference_exclusion':sum(r['reference_excluded'] for r in rows)/n,
      'reference_omission':sum(r.get('reference_omitted',False) for r in rows)/n,
      'rank1_unique':sum(r['rank1_unique'] for r in rows),'rank1_tied':sum(r['rank1_tied'] for r in rows),
      'top3_shared_rank':sum(r['top3_shared_rank'] for r in rows),
      'confirmed_correct':sum(r['confirmed_correct'] for r in rows),'states':dict(collections.Counter(r['status'] for r in rows))}

def input_hashes():
    return {str(p.relative_to(ROOT)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in
      [ROOT/'api/data/rule_chr_mapping.json',ROOT/'api/data/characters.json',ROOT/'api/src/services/scoring.js',PANEL/'panel_manifest.json']}
