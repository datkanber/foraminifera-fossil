#!/usr/bin/env python3
"""Paired, KB-derived synthetic stress test, not independent image validation.

75 genera x 20 repeats x {0,10,30,50}% masking x {0,5}% noise.
The module is known and CHR_01 is neither masked nor corrupted. Unencoded
anatomy remains unknown. B1 assigns equal rank to every compatible genus.
"""
import itertools, math, random, hashlib, collections, statistics
from evaluation_common import *

SEED=20261111

def build_profiles():
    rules=read(ROOT/'api/data/rule_chr_mapping.json')
    chars={c['id']:c['values'] for c in read(ROOT/'api/data/characters.json')['characters']}
    impl=json.loads(subprocess.check_output(['node',str(ROOT/'eval/engine_bridge.cjs')],input=b'{"describe":true}',cwd=ROOT))['implications']
    groups=collections.defaultdict(list)
    for r in rules:groups[r['genus']].append(r)
    profiles=[]
    def holds(values):
        h=collections.defaultdict(set)
        for c,v in values.items():
            h[c].add(v)
            for cc,vv in impl.get(c+':'+v,[]):h[cc].add(vv)
        return h
    def verdict(h,r):
        constraints=collections.defaultdict(set)
        for m in r['mappings']:
            if m.get('value'):constraints[m['chr_id']].add(m['value'])
        observed=[bool(h[c]&values) for c,values in constraints.items() if c in h]
        return 'MISMATCH' if False in observed else 'MATCH' if observed else 'NEUTRAL'
    for genus,rs in groups.items():
        domains=collections.defaultdict(set)
        for r in rs:
            if r['level'] in 'MDS':
                for m in r['mappings']:
                    c,v=m['chr_id'],m['value']
                    if v and c not in ['CHR_01','CHR_21']:domains[c].add(v)
        # A transition can encode multiple stated ontogenetic arrangements.
        for key,implied in impl.items():
            c,v=key.split(':',1)
            if c=='CHR_09' and len({vv for cc,vv in implied if cc=='CHR_05'} & domains.get('CHR_05',set()))>=2:
                domains[c].add(v)
        keys=sorted(k for k,v in domains.items() if v)
        domains={k:sorted(domains[k]) for k in keys}
        combinations=math.prod(len(x) for x in domains.values())
        assert combinations<200000, (genus,combinations)
        best=None;selected=None;violations=None
        for vals in itertools.product(*(domains[k] for k in keys)):
            values={'CHR_01':rs[0]['module'],**dict(zip(keys,vals))};h=holds(values)
            bad={lev:[r['rule_key'] for r in rs if r['level']==lev and verdict(h,r)=='MISMATCH'] for lev in 'MDS'}
            contradiction=[r['rule_key'] for r in rs if r['level']=='C' and verdict(h,r)=='MATCH']
            objective=(len(bad['M']),len(bad['D']),len(contradiction),len(bad['S']),vals)
            if best is None or objective<best:best,selected,violations=objective,values,{'mismatched_positive':bad,'matched_C':contradiction}
        assert selected is not None
        profiles.append({'genus':genus,'module':rs[0]['module'],'values':selected,'available_morphological_characters':len(keys),
          'source_rule_keys':[r['rule_key'] for r in rs if r['level'] in 'MDS' and r['mappings']],
          'constraint_conflicts':violations,'candidate_assignments':combinations,
          'objective':'Lexicographic minimum M mismatches, D mismatches, C matches, S mismatches; no scorer rank or image labels used.'})
    assert len(profiles)==75
    return profiles,chars,impl

def bootstrap_delta(rows,model,k):
    lookup={(r['case_id'],r['model']):r for r in rows};diff=collections.defaultdict(list)
    for r in rows:
        if r['model']==model:diff[r['reference_genus']].append(r['acc'+str(k)]-lookup[(r['case_id'],'B1')]['acc'+str(k)])
    values=[statistics.mean(v) for v in diff.values()];rng=random.Random(SEED+k)
    draws=sorted(statistics.mean(rng.choices(values,k=len(values))) for _ in range(2000))
    return {'mean':statistics.mean(values),'low':draws[49],'high':draws[1949],'resampling_unit':'genus','n_genera':len(values),'resamples':2000}

def main():
    profiles,chars,impl=build_profiles();write('synthetic_profiles.json',profiles)
    cases=[];details={}
    for p in profiles:
        for rep in range(20):
            seed=int.from_bytes(hashlib.sha256(f"{SEED}/{p['genus']}/{rep}".encode()).digest()[:8],'big')
            rng=random.Random(seed);features=sorted(c for c in p['values'] if c!='CHR_01');order=rng.sample(features,len(features))
            noises={}
            for c in features:
                v=p['values'][c]
                original={v}|{vv for cc,vv in impl.get(c+':'+v,[]) if cc==c}
                alternatives=[]
                for vv in chars[c]:
                    implied={vv}|{v3 for cc,v3 in impl.get(c+':'+vv,[]) if cc==c}
                    if vv not in ['NOT_OBSERVABLE','UNCERTAIN','UNKNOWN'] and not original&implied:alternatives.append(vv)
                if rng.random()<.05 and alternatives:noises[c]=rng.choice(alternatives)
            for missing in [0.,.1,.3,.5]:
                masked=set(order[:math.floor(len(features)*missing+.5)])
                for rate in [0.,.05]:
                    obs={c:{'value':v,'state':'PRESENT'} for c,v in p['values'].items()}
                    for c in masked:obs[c]={'value':None,'state':'NOT_OBSERVABLE'}
                    changed={c:v for c,v in noises.items() if c not in masked} if rate else {}
                    for c,v in changed.items():obs[c]={'value':v,'state':'PRESENT'}
                    cid=f"SYN_{p['genus']}_{rep:02}_m{int(missing*100)}_n{int(rate*100)}"
                    case={'case_id':cid,'dataset':'synthetic','reference_genus':p['genus'],'module':p['module'],'cohort':'KB-derived profiles','observations':obs}
                    cases.append(case);details[cid]={'missing_requested':missing,'noise_requested':rate,'repeat':rep,'n_available':len(features),
                      'masked':sorted(masked),'corrupted':changed,'n_retained':len(features)-len(masked)}
    write('synthetic_cases.json',cases);write('synthetic_corruptions.json',details)
    print('Scoring paired synthetic cases:',len(cases),'x two models',flush=True)
    configurations=[{'id':'A0'},{'id':'B1','baseline':'B1'}]
    results=engine(cases,configurations);n=len(cases);rows=[]
    for i,config in enumerate(configurations):
        scored=metrics(cases,results[i*n:(i+1)*n])
        for row in scored:row.update(model=config['id'],**details[row['case_id']])
        rows.extend(scored)
    summaries=[]
    for missing in [0.,.1,.3,.5]:
        for noise in [0.,.05]:
            selected=[r for r in rows if r['missing_requested']==missing and r['noise_requested']==noise]
            for model in ['A0','B1']:
                subset=[r for r in selected if r['model']==model]
                s={'model':model,'missing_requested':missing,'noise_requested':noise,**summary(subset)}
                s['mask_fraction_realized']=sum(len(r['masked']) for r in subset)/sum(r['n_available'] for r in subset)
                s['noise_fraction_realized']=sum(len(r['corrupted']) for r in subset)/sum(r['n_retained'] for r in subset)
                if model=='A0':
                    s['paired_delta_acc1']=bootstrap_delta(selected,model,1);s['paired_delta_acc3']=bootstrap_delta(selected,model,3)
                summaries.append(s)
    csvwrite('monte_carlo_cases.csv',rows);csvwrite('monte_carlo_summary.csv',summaries);write('monte_carlo_summary.json',summaries)
    write('monte_carlo_provenance.json',{'seed':SEED,'repeats_per_genus':20,'n_genera':75,'input_hashes':input_hashes(),
      'n_cases':n,'n_model_evaluations':len(rows),'noise':'Independent Bernoulli(.05) replacement of retained mapped characters; semantically compatible implication states excluded from replacements.',
      'mask':'Without replacement, round-half-up proportion of each sparse mapped profile. Unmapped anatomy remains unknown. CHR_01 and CHR_21 excluded.',
      'module':'Known from CHR_01 for both systems; 25 candidates per case.',
      'B1':'Any observed mismatch of any M or D rule eliminates a genus. All surviving genera are tied; no hidden alphabetical advantage in Acc@k. Supporting/contradictory rules unused.',
      'limits':'Synthetic, ontology-derived development stress test. It cannot prove field robustness or replace expert/input validation. Profile conflicts and clean-input failures are retained, not filtered.'})
    print('Monte Carlo complete.',flush=True)

if __name__=='__main__':main()
