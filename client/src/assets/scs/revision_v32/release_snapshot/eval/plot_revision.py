from evaluation_common import *
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

DEST=ROOT/'client/src/assets/scs'/('revision_v32' if V32 else 'revision_v28')

def save(fig,name):
    fig.savefig(DEST/(name+'.png'),dpi=450,bbox_inches='tight')
    fig.savefig(DEST/(name+'.pdf'),bbox_inches='tight')
    plt.close(fig)

def main():
    DEST.mkdir(parents=True,exist_ok=True)
    plt.rcParams.update({'font.size':9,'pdf.fonttype':42,'axes.spines.top':False,'axes.spines.right':False})
    rows=read(OUT/'monte_carlo_summary.json');fig,axes=plt.subplots(1,2,figsize=(8.5,3.5))
    for ax,k in zip(axes,[1,3]):
        for model,color in [('A0','#176b9b'),('B1','#c15820')]:
            for noise,style in [(0.,'--'),(.05,'-')]:
                rs=sorted([r for r in rows if r['model']==model and r['noise_requested']==noise],key=lambda r:r['missing_requested'])
                ax.plot([r['missing_requested']*100 for r in rs],[r['acc'+str(k)]*100 for r in rs],style+'o',color=color,label=f'{model}, {int(noise*100)}% noise')
        ax.set(xlabel='Requested masking of mapped characters (%)',ylabel=f'Tie-aware Acc@{k} (%)',ylim=(0,100),xticks=[0,10,30,50]);ax.grid(alpha=.2)
    axes[1].legend(fontsize=8);fig.suptitle('KB-derived synthetic stress test: 75 genera, 20 repeats each')
    fig.tight_layout();save(fig,'Monte_Carlo_A0_vs_B1')
    rows=read(OUT/'sensitivity_summary.json');fig,axes=plt.subplots(1,2,figsize=(8.5,3.5));names=['A0','S1_equal','S2_M_gt_D','S3_no_S','S4_C_low','S4_C_high']
    for ax,dataset in zip(axes,['paths','panels']):
        rs=[next(r for r in rows if r['dataset']==dataset and r['cohort']=='ALL' and r['configuration']==name) for name in names]
        ax.plot(range(6),[r['acc1']*100 for r in rs],'o-',label='Acc@1 (%)');ax.plot(range(6),[r['acc3']*100 for r in rs],'s-',label='Acc@3 (%)')
        ax.set(xticks=range(6),xticklabels=['A0','S1','S2','S3','S4 low','S4 high'],ylabel='Agreement (%)',title='104 internal paths' if dataset=='paths' else '150 archived VLM panels',ylim=(0,100));ax.grid(alpha=.2)
    axes[1].legend();fig.tight_layout();save(fig,'Weight_Sensitivity')
    # Replacement for the main manuscript's existing Fig. 3.
    group=next(x for x in read(OUT/'current_A0_results.json') if x['dataset']=='panels')
    cases=group['cases'];rs=metrics(cases,group['results']);states=['CONFIRMED_GENUS','PROBABLE_GENUS','CANDIDATE_GENUS','INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA']
    fig,axes=plt.subplots(1,2,figsize=(8.5,3.8))
    for ax,cohort in zip(axes,['Additional articles','KB reference book (overlap)']):
        subset=[r for r in rs if r['cohort']==cohort];values=[];counts=[]
        for state in states:
            rr=[r for r in subset if r['status']==state];counts.append(len(rr));values.append(100*sum(r['acc1'] for r in rr)/len(rr) if rr and state not in ABSTAIN else float('nan'))
        ax.bar(range(5),np.nan_to_num(values),color='#176b9b',alpha=.8,label='Top-1 agreement')
        ax.set(xticks=range(5),xticklabels=['CONF.','PROB.','CAND.','INDET.','NO MATCH'],ylim=(0,105),ylabel='Agreement (%)',title=f'{cohort}\n(n = {len(subset)})')
        for i,(v,n) in enumerate(zip(values,counts)):
            ax.text(i,(v if np.isfinite(v) else 0)+3,(f'{v:.1f}%' if np.isfinite(v) else 'N/A')+f'\nn={n}',ha='center',fontsize=8)
        right=ax.twinx();right.plot(range(5),[n/len(subset)*100 for n in counts],'o-',color='#c15820');right.set(ylim=(0,105),ylabel='Output frequency (%)')
        ax.tick_params(axis='x',labelsize=7)
    fig.tight_layout();save(fig,'Figure_3_Current_Confidence')
    print('Three PNG/PDF figure pairs generated (450 dpi / vector).')

if __name__=='__main__':main()
