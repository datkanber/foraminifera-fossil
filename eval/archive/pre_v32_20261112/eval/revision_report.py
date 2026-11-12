"""Generate manuscript-ready numbers and figures from completed offline results."""
from evaluation_common import *
import statistics, random, subprocess

DELIVERY=ROOT/'client/src/assets/scs/revision_v28'

def interval(cases,values,seed=20261111):
    clusters=collections.defaultdict(list)
    for c,v in zip(cases,values):clusters[c['cluster']].append(v)
    assert None not in clusters
    keys=sorted(clusters)
    if len(keys)<2:return {'mean':statistics.mean(values),'low':None,'high':None,'clusters':len(keys)}
    rng=random.Random(seed);samples=[]
    for _ in range(2000):
        draw=[v for key in rng.choices(keys,k=len(keys)) for v in clusters[key]]
        samples.append(statistics.mean(draw))
    samples.sort()
    return {'mean':statistics.mean(values),'low':samples[49],'high':samples[1949],'clusters':len(keys)}

def main():
    DELIVERY.mkdir(parents=True,exist_ok=True)
    groups=read(OUT/'current_A0_results.json');byname={x['dataset']:x for x in groups}
    ablations=[]
    configs=[{'id':'A'+str(i),'counterfactual':'A'+str(i)} for i in range(8)]
    for name in ['paths','panels']:
        cases=byname[name]['cases'];results=engine(cases,configs);n=len(cases)
        for i,config in enumerate(configs):
            rows=metrics(cases,results[i*n:(i+1)*n])
            ablations.append({'dataset':name,'configuration':config['id'],**summary(rows)})
    write('current_ablations.json',ablations);csvwrite('current_ablations.csv',ablations)
    stats=[]
    for name in ['panels','panels_raw_neutral']:
        group=byname[name];cases=group['cases'];rows=metrics(cases,group['results'])
        for kind,label in [('ALL','ALL')]+[('cohort',x) for x in sorted(set(c['cohort'] for c in cases))]+[('module',x) for x in ['AGGLUTINATED','PORCELANEOUS','HYALINE']]:
            selected=[(c,r) for c,r in zip(cases,rows) if kind=='ALL' or (c['cohort'] if kind=='cohort' else c['reference_module'])==label]
            cs,rs=map(list,zip(*selected));result={'dataset':name,'group_type':kind,'group':label,**summary(rs),'intervals':{}}
            for metric in ['acc1','acc3','reference_excluded']:
                result['intervals'][metric]=interval(cs,[float(r[metric]) for r in rs])
            result['intervals']['coverage']=interval(cs,[float(r['status'] not in ABSTAIN) for r in rs])
            stats.append(result)
    write('panel_stratified_results.json',stats)
    original=byname['panels'];neutral=byname['panels_raw_neutral'];diff=[]
    a=metrics(original['cases'],original['results']);b=metrics(neutral['cases'],neutral['results'])
    for cohort in ['ALL','Additional articles','KB reference book (overlap)']:
        ids=[i for i,c in enumerate(original['cases']) if cohort=='ALL' or c['cohort']==cohort]
        cs=[original['cases'][i] for i in ids]
        diff.append({'cohort':cohort,'changed_panels':sum(original['cases'][i]['observations']!=neutral['cases'][i]['observations'] for i in ids),
          'display_changed':sum(a[i]['prediction']!=b[i]['prediction'] for i in ids),'state_changed':sum(a[i]['status']!=b[i]['status'] for i in ids),
          'delta_acc1':interval(cs,[b[i]['acc1']-a[i]['acc1'] for i in ids]),'delta_acc3':interval(cs,[b[i]['acc3']-a[i]['acc3'] for i in ids])})
    write('current_normalization_replay.json',diff)
    # Reproducible rule triggers are supplied for every current excluded leaf.
    path_rows=list(csv.DictReader((ROOT/'eval/results/consistency_paths.csv').open(encoding='utf-8')))
    exclusions=[r for r in path_rows if r['leaf_excluded'].lower() in ['true','1']]
    write('current_path_exclusions.json',exclusions)
    print('Reports complete:',len(exclusions),'excluded paths; bootstrap cohorts and seven ablations recomputed.',flush=True)

if __name__=='__main__':main()
