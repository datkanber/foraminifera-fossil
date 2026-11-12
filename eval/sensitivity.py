#!/usr/bin/env python3
"""S1-S5 sensitivity on 104 frozen paths and 150 archived VLM sheets.

Run from repository root: python eval/sensitivity.py
All 27 threshold combinations are evaluated; no optimum is selected.
RBO_EXT uses Webber et al. (2010), Eq. 32, p=.9, on actual active
rankings, with the service's deterministic tie order. Accuracy separately
uses uniform score-tie credit and counts abstentions as errors.
"""
import itertools, math, collections
from evaluation_common import *

def rbo(a,b,p=.9):
    """Extrapolated finite, unequal-list RBO; no artificial excluded tail."""
    assert 0<p<1 and len(a)==len(set(a)) and len(b)==len(set(b))
    if not a or not b:return float(a==b)
    if len(a)>len(b):a,b=b,a
    s,l=len(a),len(b);sa=set();sb=set();overlap=[]
    for d in range(1,l+1):
        if d<=s:sa.add(a[d-1])
        sb.add(b[d-1]);overlap.append(len(sa&sb))
    xs=overlap[s-1];xl=overlap[-1]
    base=sum(x/d*p**d for d,x in enumerate(overlap,1))
    extra=sum(xs*(d-s)/(s*d)*p**d for d in range(s+1,l+1))
    value=(1-p)/p*(base+extra)+((xl-xs)/l+xs/s)*p**l
    assert -1e-12<=value<=1+1e-12
    return max(0.,min(1.,value))

def configurations():
    levels=['MANDATORY','DIAGNOSTIC','SUPPORTING','CONTRADICTORY']
    configs=[{'id':'A0'}]
    for name,weights in [('S1_equal',[1,1,1,-1]),('S2_M_gt_D',[5,3,1,-5]),('S3_no_S',[3,5,0,-5]),('S4_C_low',[3,5,1,-3]),('S4_C_high',[3,5,1,-10])]:
        configs.append({'id':name,'options':{'weights':dict(zip(levels,weights))}})
    for obs,nm,delta in itertools.product([1,2,3],[2,3,4],[1,2,3]):
        configs.append({'id':f'S5_o{obs}_nm{nm}_d{delta}','options':{'tauObs':obs,'tauNoMatch':nm,'delta':delta}})
    return configs

def main():
    configs=configurations();write('sensitivity_configurations.json',configs)
    all_summary=[];all_rows=[];case_results=[]
    for cases in [path_cases(),panel_cases(False),panel_cases(True)]:
        dataset=cases[0]['dataset'];print('Scoring',dataset,len(cases),'x',len(configs),flush=True)
        results=engine(cases,configs);n=len(cases);baseline=results[:n]
        for i,cfg in enumerate(configs):
            rs=results[i*n:(i+1)*n];rows=metrics(cases,rs)
            for c,r,b,row in zip(cases,rs,baseline,rows):
                a=[x['genus'] for x in b['ranking']];z=[x['genus'] for x in r['ranking']]
                aa=set(a[:3]);zz=set(z[:3]);den=max(len(aa),len(zz))
                row.update(configuration=cfg['id'],rbo=rbo(a,z),top1_same=(a[:1]==z[:1]),
                    top3_set_same=aa==zz,top3_overlap=len(aa&zz)/den if den else 1.,
                    status_same=b['status']==r['status'],output_same=b['identification']==r['identification'])
                all_rows.append(row)
            for cohort in ['ALL']+sorted(set(c['cohort'] for c in cases)):
                selected=[x for x in rows if cohort=='ALL' or x['cohort']==cohort]
                s={'dataset':dataset,'configuration':cfg['id'],'cohort':cohort,**summary(selected)}
                for k in ['rbo','top1_same','top3_set_same','top3_overlap','status_same','output_same']:s[k]=sum(x[k] for x in selected)/len(selected)
                all_summary.append(s)
            if cfg['id']=='A0':case_results.append({'dataset':dataset,'cases':cases,'results':rs})
    csvwrite('sensitivity_summary.csv',all_summary);csvwrite('sensitivity_cases.csv',all_rows)
    write('sensitivity_summary.json',all_summary);write('current_A0_results.json',case_results)
    # Before/after replay is evaluated on identical archived observations.
    before_after=[]
    for group in case_results:
        cases=group['cases'];before=engine(cases,frozen=True,dataDir='eval/archive/pre_audit_20261111')
        for label,rs in [('before',before),('after',group['results'])]:
            rows=metrics(cases,rs)
            for module in ['ALL']+sorted(set(c.get('reference_module',c['module']) or 'UNKNOWN' for c in cases)):
                chosen=[x for x in rows if module=='ALL' or x['module']==module]
                before_after.append({'version':label,'dataset':group['dataset'],'module':module,**summary(chosen)})
        if group['dataset']==('panels_legacy_normalized' if V32 else 'panels'):
            for c,r in zip(cases,before):
                archived=read(PANEL/'raw'/f"{c['case_id']}.json")['score']
                assert r['status']==archived['status'] and r['identification']==archived['identification']
                assert r['ranking']==[{'genus':x['genus'],'score':x['score']} for x in archived['ranking']]
    write('before_after_summary.json',before_after)
    csvwrite('before_after_summary.csv',before_after)
    write('sensitivity_provenance.json',{'inputs':input_hashes(),'configurations':len(configs),'p':.9,'threshold_grid':27,
      'rbo_source':'https://www.williamwebber.com/research/papers/wmz10_tois.pdf, Eq. 32',
      'ties':'RBO uses actual deterministic service order; Acc@k uses fractional score ties. Empty/empty ranking similarity=1, not a correct identification.',
      'normalization':'v32 primary = original provider receipts through the corrected production normalizer; legacy normalized sheets are a paired historical comparator.' if V32 else 'Primary = archived application-normalized sheets; secondary = restore raw UNCERTAIN/NOT_OBSERVABLE only.',
      'limits':'Development sensitivity, no weight tuning on a held-out set and no new model requests.'})
    print('Sensitivity complete; before/after replays verified against archived originals.',flush=True)

if __name__=='__main__':main()
