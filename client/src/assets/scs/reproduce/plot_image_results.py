"""Create Figures 12–14 from completed, auditable image runs. No mock results.

Uses cluster bootstrap intervals because panels are not verified independent
specimens. Primary figures require all 150 successful same-model results.
"""
from pathlib import Path
import collections
import csv
import hashlib
import json
import math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter

ROOT = Path(__file__).resolve().parent.parent
EV = ROOT / 'evaluation'
S7 = ROOT / 'supplementary/S7_image_results'
S8 = ROOT / 'supplementary/S8_stratified_results'
S7.mkdir(parents=True, exist_ok=True)
S8.mkdir(parents=True, exist_ok=True)
manifest_bytes = (EV/'panel_manifest.json').read_bytes()
manifest = json.loads(manifest_bytes)
config = json.loads((EV/'execution_config.json').read_text(encoding='utf-8'))
assert hashlib.sha256(manifest_bytes).hexdigest() == config['manifestSha256']
COHORTS = ['Additional articles', 'KB reference book (overlap)']
SHORT = ['Additional articles', 'KB reference book: source overlap']
STATES = ['CONFIRMED_GENUS','PROBABLE_GENUS','CANDIDATE_GENUS','INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA']
STATE_LABELS = ['Confirmed','Probable','Candidate','Indeterminate','No match']
SEED = 20261109

def credit(ranking, truth, k):
    target = next((r for r in ranking if r['genus'] == truth), None)
    if target is None:
        return 0.0
    above = sum(r['score'] > target['score'] for r in ranking)
    tied = sum(r['score'] == target['score'] for r in ranking)
    return max(0.0, min(1.0, (k - above) / tied))

assert credit([{'genus':'a','score':2},{'genus':'b','score':2}], 'a', 1) == 0.5
assert math.isclose(credit([{'genus':'a','score':2},{'genus':'b','score':1},{'genus':'c','score':1},{'genus':'d','score':1}], 'b', 3), 2/3)
assert credit([{'genus':'a','score':1}], 'z', 3) == 0

rows = []
normalization_changes = []
for m in manifest:
    raw = json.loads((EV/'raw'/f"{m['image_id']}.json").read_text(encoding='utf-8'))
    assert raw['success'], f"Incomplete image: {m['image_id']}"
    assert raw['configHash'] == config['configHash']
    assert raw['imageSha256'] == m['sha256']
    assert raw['response']['model'] == config['model']
    obs = raw['response']['observation']['observations']
    score = raw['score']
    status = score['status']
    assert status in STATES
    abstain = status in ['INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA']
    phi = sum(obs[f'CHR_{i:02d}']['state'] in ['NOT_OBSERVABLE','UNCERTAIN'] for i in range(1,21))/20
    assert 0 <= phi <= 1
    pred = score['identification'] if not abstain else ('Indeterminate' if status == 'INDETERMINATE' else 'No match')
    row = {**{k:m[k] for k in ['image_id','reference_genus','module','cohort','source','plate','panel','cluster']},
        'model':config['model'],'predicted_genus':pred,'status':status,'phi':phi,'phi_bin':min(9,int(phi*10)),
        'acc1':0.0 if abstain else credit(score['ranking'],m['reference_genus'],1),
        'acc3':0.0 if abstain else credit(score['ranking'],m['reference_genus'],3),
        'displayed_top1_correct':float(not abstain and pred==m['reference_genus']),
        'covered':float(not abstain),'reference_excluded':float(any(r['genus']==m['reference_genus'] for r in score['excluded'])),
        'elapsed_seconds':raw['elapsedMs']/1000,'provider_attempts':len(raw['attempts'])}
    assert row['acc1'] <= row['acc3']
    rows.append(row)
    # Audit raw model states against actual app normalization; no expert correction.
    response = next(a['providerResponse'] for a in reversed(raw['attempts']) if a.get('providerStatus') == 200)
    text = ''.join(p.get('text','') for p in response.get('candidates',[{}])[0].get('content',{}).get('parts',[]))
    try:
        unnormalized = json.loads(text[text.index('{'):text.rindex('}')+1]).get('observations',{})
        for c,o in obs.items():
            before = unnormalized.get(c,{})
            if before.get('state') != o.get('state') or before.get('value') != o.get('value'):
                normalization_changes.append({'image_id':m['image_id'],'character':c,'raw_state':before.get('state'),
                    'normalized_state':o.get('state'),'raw_value':before.get('value'),'normalized_value':o.get('value')})
    except (ValueError,KeyError,json.JSONDecodeError):
        normalization_changes.append({'image_id':m['image_id'],'character':'AUDIT_PARSE_UNAVAILABLE'})

assert len(rows) == 150
assert len({r['image_id'] for r in rows}) == 150

def dump_json(p,obj):
    p.write_text(json.dumps(obj,indent=2,ensure_ascii=False,allow_nan=False)+'\n',encoding='utf-8')

def dump_csv(p,data,default_fields=None):
    fields = list(data[0]) if data else default_fields or ['no_rows']
    with p.open('w',newline='',encoding='utf-8-sig') as f:
        w = csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(data)

def estimate(data,key):
    if not data:
        return {'mean':None,'low':None,'high':None,'n':0,'clusters':0}
    groups = collections.defaultdict(list)
    for r in data:
        groups[r['cluster']].append(float(r[key]))
    means = np.array([sum(v) for v in groups.values()])
    counts = np.array([len(v) for v in groups.values()])
    result = {'mean':float(sum(means)/sum(counts)),'low':None,'high':None,'n':len(data),'clusters':len(groups)}
    if len(groups) >= 2:
        rng = np.random.default_rng(SEED)
        draw = rng.integers(0,len(groups),(2000,len(groups)))
        boot = means[draw].sum(axis=1)/counts[draw].sum(axis=1)
        result.update(low=float(np.quantile(boot,.025)),high=float(np.quantile(boot,.975)))
    return result

def summarize(data,label):
    return {'group':label,'n':len(data),'source_clusters':len({r['cluster'] for r in data}),
        'acc1':estimate(data,'acc1'),'acc3':estimate(data,'acc3'),'coverage':estimate(data,'covered'),
        'reference_exclusion':estimate(data,'reference_excluded'),
        'displayed_top1_accuracy':estimate(data,'displayed_top1_correct'),
        'states':dict(collections.Counter(r['status'] for r in data))}

overall = summarize(rows,'All panels')
cohorts = [summarize([r for r in rows if r['cohort']==c],c) for c in COHORTS]
strata = [summarize([r for r in rows if r['module']==m],m) for m in ['AGGLUTINATED','PORCELANEOUS','HYALINE']]
for c in COHORTS:
    for m in ['AGGLUTINATED','PORCELANEOUS','HYALINE']:
        group = [r for r in rows if r['cohort']==c and r['module']==m]
        strata.append(summarize(group,c+' / '+m))
bins = []
states = []
for c in COHORTS:
    group = [r for r in rows if r['cohort']==c]
    for b in range(10):
        d = [r for r in group if r['phi_bin']==b]
        bins.append({'cohort':c,'bin':b,'phi_lower':b/10,'phi_upper':(b+1)/10,
            'n':len(d),'acc1':estimate(d,'acc1'),'acc3':estimate(d,'acc3')})
    for s in STATES:
        d = [r for r in group if r['status']==s]
        states.append({'cohort':c,'status':s,'n':len(d),'share':len(d)/len(group),
            'precision':estimate(d,'acc1') if s in STATES[:3] else {'mean':None,'low':None,'high':None,'n':len(d),'clusters':len({r['cluster'] for r in d})}})
dump_csv(S7/'S7_image_level_results.csv',rows)
dump_csv(S7/'S7_normalization_changes.csv',normalization_changes,['image_id','character','raw_state','normalized_state','raw_value','normalized_value'])
summary = {'model':config['model'],'n_images':len(rows),'overall':overall,'cohorts':cohorts,'by_module':strata,
    'observability_bins':bins,'confidence_states':states,'bootstrap_resamples':2000,'seed':SEED,
    'uncertainty_method':'Percentile bootstrap resampling source/section clusters within each reported group; intervals are unavailable with fewer than two clusters. These are within-panel descriptive intervals, not population accuracy guarantees.',
    'normalization_changed_entries':len(normalization_changes),'runs_per_image':1,
    'limitations':['No independent expert sheets or expert agreement','150 panels are not 150 verified independent specimens',
        '122 book panels overlap a named knowledge-base reference; reported separately','Additional-article rule-level provenance overlap cannot be excluded because per-rule references are not supplied',
        'Public-image VLM training contamination unknown','Class/module imbalance and low-resolution source panels',
        'One VLM pass; no run-to-run variability estimate','Existing application normalization retained without manual correction'],
    'primary_manifest_sha256':config['manifestSha256'],'config_hash':config['configHash']}
dump_json(S7/'S7_summary.json',summary)
flat = []
for g in [overall,*cohorts,*strata]:
    flat.append({'group':g['group'],'n':g['n'],'clusters':g['source_clusters'],
        **{f'{k}_{field}':g[k][field] for k in ['acc1','acc3','coverage','reference_exclusion'] for field in ['mean','low','high']}})
dump_csv(S8/'S8_stratified_metrics.csv',flat)
dump_json(S8/'S8_stratified_metrics.json',strata)
dump_csv(S7/'S7_observability_bins.csv',[{k:v for k,v in b.items() if k not in ['acc1','acc3']}|{f'{k}_{v}':b[k][v] for k in ['acc1','acc3'] for v in ['mean','low','high']} for b in bins])
dump_csv(S7/'S7_confidence_states.csv',[{'cohort':s['cohort'],'status':s['status'],'n':s['n'],'share':s['share'],**{f'precision_{k}':s['precision'][k] for k in ['mean','low','high']}} for s in states])

plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.spines.top':False,'axes.spines.right':False,
    'pdf.fonttype':42,'ps.fonttype':42,'axes.labelcolor':'#263238','text.color':'#263238','axes.titleweight':'bold'})
TEAL, BLUE, ORANGE = '#087f8c','#254b87','#c87925'
def save(fig,stem):
    fig.savefig(ROOT/(stem+'.png'),dpi=450,bbox_inches='tight',facecolor='white')
    fig.savefig(ROOT/(stem+'.pdf'),bbox_inches='tight',facecolor='white')
    plt.close(fig)
def errorbar(ax,x,e,color,marker='o',label=None):
    if e['mean'] is None:return
    if e['low'] is not None:
        ax.errorbar(x,e['mean'],yerr=[[e['mean']-e['low']],[e['high']-e['mean']]],color=color,marker=marker,capsize=2,label=label)
    else:ax.plot(x,e['mean'],marker,color=color,label=label)

# Fig.12: empty bins remain empty; no fitted trend or invented interpolation.
fig,axes = plt.subplots(1,2,figsize=(7.5,4.2),sharey=True)
for ax,c,title in zip(axes,COHORTS,SHORT):
    data = [b for b in bins if b['cohort']==c]
    for key,color,marker,label in [('acc1',TEAL,'o','Top-1'),('acc3',BLUE,'s','Top-3')]:
        ys = [d[key]['mean'] if d[key]['mean'] is not None else np.nan for d in data]
        ax.plot(np.arange(10)/10+.05,ys,color=color,marker=marker,linewidth=1.3,label=label)
        for d in data:
            e = d[key]
            if e['mean'] is not None and e['low'] is not None:
                ax.vlines(d['bin']/10+.05,e['low'],e['high'],color=color,alpha=.65,linewidth=1)
    for d in data:
        if d['n']:ax.text(d['bin']/10+.05,-.13,str(d['n']),ha='center',va='top',transform=ax.get_xaxis_transform(),fontsize=7,color='#666666')
    n = sum(d['n'] for d in data)
    ax.set_title(f'{title}\n(n = {n})',fontsize=10)
    ax.set_xlim(0,1);ax.set_ylim(-.02,1.04);ax.set_xticks(np.arange(0,1.01,.2));ax.grid(axis='y',alpha=.18)
    ax.set_xlabel('Unobservable fraction, φ (bins of 0.1)',labelpad=23)
    ax.yaxis.set_major_formatter(PercentFormatter(1));ax.legend(frameon=False,loc='lower right',fontsize=8)
axes[0].set_ylabel('Tie-aware accuracy')
fig.text(.5,.01,'VLM + engine; one pass per panel. Numbers below axes: panels per populated bin. Bars: 95% cluster bootstrap.',ha='center',fontsize=7)
fig.tight_layout(rect=(0,.05,1,1));save(fig,'Figure_12_Exploratory_Accuracy')

# Fig.13 uses the genus displayed by the engine; score ties are not fractionally
# expanded in the confusion matrix. Acc@k tables use the declared tie-aware rule.
predictions = sorted({r['predicted_genus'] for r in rows if r['predicted_genus'] not in ['Indeterminate','No match']})
predictions += [p for p in ['Indeterminate','No match'] if any(r['predicted_genus']==p for r in rows)]
truths = [sorted({r['reference_genus'] for r in rows if r['cohort']==c}) for c in COHORTS]
fig,axes = plt.subplots(2,1,figsize=(7.5,10),gridspec_kw={'height_ratios':[max(3,len(truths[0])),max(5,len(truths[1]))]})
confusion_records=[]
for ax,c,title,labels in zip(axes,COHORTS,SHORT,truths):
    counts = np.array([[sum(r['cohort']==c and r['reference_genus']==g and r['predicted_genus']==p for r in rows) for p in predictions] for g in labels])
    proportions = counts/counts.sum(axis=1,keepdims=True)
    im=ax.pcolormesh(np.arange(len(predictions)+1)-.5,np.arange(len(labels)+1)-.5,
        proportions,vmin=0,vmax=1,cmap='Blues',shading='flat',rasterized=False)
    ax.set_xlim(-.5,len(predictions)-.5);ax.set_ylim(len(labels)-.5,-.5)
    ax.set_xticks(range(len(predictions)),predictions,rotation=90,ha='center',fontsize=8)
    ax.set_yticks(range(len(labels)),[f'{g} (n={int(n)})' for g,n in zip(labels,counts.sum(axis=1))],fontsize=9)
    ax.set_ylabel('Published reference genus');ax.set_title(title,fontsize=10)
    for y,g in enumerate(labels):
        for x,p in enumerate(predictions):
            confusion_records.append({'cohort':c,'reference_genus':g,'displayed_prediction':p,'count':int(counts[y,x]),'row_fraction':float(proportions[y,x])})
            if counts[y,x]:ax.text(x,y,str(counts[y,x]),ha='center',va='center',fontsize=7,color='white' if proportions[y,x]>.55 else '#19334a')
    cb=fig.colorbar(im,ax=ax,fraction=.025,pad=.02);cb.ax.yaxis.set_major_formatter(PercentFormatter(1));cb.ax.tick_params(labelsize=7)
    if cb.solids is not None:cb.solids.set_rasterized(False)
axes[-1].set_xlabel('Engine-displayed top genus or abstention')
fig.text(.5,.005,'Numbers: panel counts; color: within-reference-genus percentage. Source labels are not independent expert character sheets.',ha='center',fontsize=7)
fig.tight_layout(rect=(0,.03,1,1));save(fig,'Figure_13_Source_Label_Confusion')
dump_csv(S7/'S7_confusion_matrix.csv',confusion_records)

# Fig.14: precision is undefined for abstentions and states with n=0.
fig,axes = plt.subplots(1,2,figsize=(7.5,4.6),sharey=True)
for ax,c,title in zip(axes,COHORTS,SHORT):
    d=[s for s in states if s['cohort']==c];secondary=ax.twinx()
    for i,s in enumerate(d):
        e=s['precision']
        if e['mean'] is not None:
            ax.bar(i,e['mean'],color=TEAL,width=.62,alpha=.85)
            if e['low'] is not None:ax.vlines(i,e['low'],e['high'],color='#21343d',linewidth=1.2)
        else:ax.text(i,.025,'N/A',ha='center',fontsize=8,color='#777777')
        ax.text(i,1.055,f"n={s['n']}",ha='center',fontsize=7,transform=ax.get_xaxis_transform())
    secondary.plot(range(5),[s['share'] for s in d],color=ORANGE,marker='o',linewidth=1.5,label='Share of panels')
    ax.set_title(title,fontsize=10,pad=32);ax.set_xticks(range(5),STATE_LABELS,rotation=30,ha='right',fontsize=8)
    ax.set_ylim(0,1.03);secondary.set_ylim(0,1.03);ax.yaxis.set_major_formatter(PercentFormatter(1));secondary.yaxis.set_major_formatter(PercentFormatter(1))
    secondary.spines['top'].set_visible(False);secondary.spines['right'].set_visible(True)
    ax.grid(axis='y',alpha=.16);secondary.tick_params(labelsize=7)
axes[0].set_ylabel('Genus precision (tie-aware)')
fig.text(.99,.55,'Share of panels (orange line)',va='center',ha='right',rotation=90,fontsize=8,color=ORANGE)
fig.text(.5,.015,'Bars: agreement with published genus labels; whiskers: 95% cluster bootstrap. N/A: no genus decision or n=0.',ha='center',fontsize=7)
fig.tight_layout(rect=(0,.04,.96,1));save(fig,'Figure_14_Confidence_State_Agreement')

dump_json(ROOT/'evidence/evaluation_validation.json',{'all_150_successful':True,'single_model':config['model'],
    'image_hashes_match_freeze':True,'acc1_never_exceeds_acc3':True,'same_config_hash':True,
    'confusion_counts_sum_to_150':sum(r['count'] for r in confusion_records)==150,
    'n_genera':len({r['reference_genus'] for r in rows}),'module_counts':dict(collections.Counter(r['module'] for r in rows)),
    'cohort_counts':dict(collections.Counter(r['cohort'] for r in rows)),'no_expert_labels_created':True})
print(json.dumps({'n':150,'model':config['model'],'overall':overall,'cohorts':cohorts},indent=2))
