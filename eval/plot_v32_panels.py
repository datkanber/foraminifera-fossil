"""Actual manuscript Figures 5-7, using corrected archived-panel replay."""
from evaluation_common import *
from revision_report import interval
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

DEST=ROOT/'client/src/assets/scs/revision_v32'
COHORTS=['Additional articles','KB reference book (overlap)']
def save(fig,name):
    fig.savefig(DEST/(name+'.png'),dpi=450,bbox_inches='tight');fig.savefig(DEST/(name+'.pdf'),bbox_inches='tight');plt.close(fig)
def main():
    assert V32;DEST.mkdir(parents=True,exist_ok=True)
    group=next(g for g in read(OUT/'current_A0_results.json') if g['dataset']=='panels');cases=group['cases'];rows=metrics(cases,group['results'])
    plt.rcParams.update({'font.size':9,'pdf.fonttype':42,'axes.spines.top':False,'axes.spines.right':False})
    phis={c['case_id']:sum(c['observations'].get(f'CHR_{i:02}',{}).get('state')in ['UNCERTAIN','NOT_OBSERVABLE']for i in range(1,21))/20 for c in cases}
    plotted=[];fig,axes=plt.subplots(1,2,figsize=(8.6,3.5),sharey=True)
    for ax,cohort in zip(axes,COHORTS):
        counts=[]
        for k,color,marker in [('acc1','#176b9b','o'),('acc3','#bd5e26','s')]:
            points=[]
            for b in range(10):
                selected=[(c,r)for c,r in zip(cases,rows)if c['cohort']==cohort and min(9,int(phis[c['case_id']]*10+1e-8))==b]
                if not selected:continue
                cs,rs=map(list,zip(*selected));ci=interval(cs,[r[k]for r in rs]);x=(b+.5)/10;points.append((x,ci['mean']*100))
                if k=='acc1':counts.append((x,len(rs)))
                low=ci['low'];high=ci['high']
                ax.errorbar([x],[100*ci['mean']],yerr=None if low is None else [[100*(ci['mean']-low)],[100*(high-ci['mean'])]],color=color,marker=marker,capsize=3,linestyle='none')
                plotted.append({'figure':5,'cohort':cohort,'metric':k,'bin_low':b/10,'n':len(rs),'clusters':ci['clusters'],**ci})
            ax.plot([p[0]for p in points],[p[1]for p in points],color=color,label='Acc@'+k[-1])
        for x,n in counts:ax.text(x,97,'n='+str(n),ha='center',fontsize=7)
        ax.set(title=cohort,xlabel='Neutral fraction, CHR_01–CHR_20',ylim=(0,105),xlim=(0,.7));ax.grid(alpha=.2)
    axes[0].set_ylabel('Tie-fractional agreement (%)');axes[1].legend();fig.tight_layout();save(fig,'Figure_5_Neutral_Fraction_Agreement')
    fig,axes=plt.subplots(1,2,figsize=(12,8.4),gridspec_kw={'width_ratios':[1,1.55]})
    for ax,cohort in zip(axes,COHORTS):
        selected=[r for r in rows if r['cohort']==cohort];truths=sorted({r['reference_genus']for r in selected});outputs=sorted({r['prediction'] if r['status']not in ABSTAIN else r['status']for r in selected},key=str)
        matrix=np.zeros((len(truths),len(outputs)),int)
        for r in selected:matrix[truths.index(r['reference_genus']),outputs.index(r['prediction']if r['status']not in ABSTAIN else r['status'])]+=1
        shades=100*matrix/matrix.sum(axis=1,keepdims=True);im=ax.imshow(shades,cmap='Blues',vmin=0,vmax=100,aspect='auto')
        for i in range(len(truths)):
            for j in range(len(outputs)):
                if matrix[i,j]:ax.text(j,i,str(matrix[i,j]),ha='center',va='center',fontsize=8,color='white'if shades[i,j]>=50 else 'black')
                if truths[i]==outputs[j]:ax.add_patch(plt.Rectangle((j-.48,i-.48),.96,.96,fill=False,edgecolor='#b85c27',linewidth=1.2))
        ax.set(xticks=range(len(outputs)),xticklabels=[o.replace('_GENUS','').replace('NO_MATCH_WITHIN_CORE_TAXA','NO MATCH')for o in outputs],yticks=range(len(truths)),yticklabels=truths,title=cohort,xlabel='Displayed genus or abstention',ylabel='Published reference genus')
        ax.tick_params(axis='x',labelrotation=70,labelsize=7);ax.tick_params(axis='y',labelsize=8);fig.colorbar(im,ax=ax,fraction=.035,pad=.02,label='Within-reference proportion (%)')
        for i,g in enumerate(truths):
            for j,o in enumerate(outputs):plotted.append({'figure':6,'cohort':cohort,'reference':g,'displayed':o,'n':int(matrix[i,j]),'within_reference_percent':float(shades[i,j])})
    fig.tight_layout();save(fig,'Figure_6_Reference_Display_Confusion')
    states=['CONFIRMED_GENUS','PROBABLE_GENUS','CANDIDATE_GENUS','INDETERMINATE','NO_MATCH_WITHIN_CORE_TAXA'];fig,axes=plt.subplots(1,2,figsize=(8.6,3.8),sharey=True)
    for ax,cohort in zip(axes,COHORTS):
        selected=[(c,r)for c,r in zip(cases,rows)if c['cohort']==cohort];freq=[];prec=[];bounds=[];counts=[]
        for state in states:
            rr=[(c,r)for c,r in selected if r['status']==state];counts.append(len(rr));freq.append(100*len(rr)/len(selected));ci=None
            if rr and state not in ABSTAIN:
                cs,rs=map(list,zip(*rr));ci=interval(cs,[r['acc1']for r in rs]);prec.append(100*ci['mean']);bounds.append(None if ci['low']is None else [100*(ci['mean']-ci['low']),100*(ci['high']-ci['mean'])])
            else:prec.append(float('nan'));bounds.append(None)
            plotted.append({'figure':7,'cohort':cohort,'state':state,'n':len(rr),'frequency_percent':freq[-1],'precision_fractional_top1':ci})
        x=np.arange(5);ax.bar(x-.18,freq,.36,color='white',edgecolor='#333',label='Output frequency');ax.bar(x+.18,np.nan_to_num(prec),.36,color='#999',edgecolor='#333',label='Conditional Acc@1')
        for i,(value,bound,n)in enumerate(zip(prec,bounds,counts)):
            if bound is not None:ax.errorbar([i+.18],[value],yerr=[[bound[0]],[bound[1]]],fmt='none',ecolor='black',capsize=2)
            if not np.isfinite(value):ax.text(i+.18,3,'N/A',rotation=90,ha='center',fontsize=7)
            ax.text(i,101,'n='+str(n),ha='center',fontsize=7)
        ax.set(xticks=x,xticklabels=['CONF.','PROB.','CAND.','INDET.','NO MATCH'],ylim=(0,110),title=cohort);ax.tick_params(axis='x',labelsize=7);ax.grid(axis='y',alpha=.15)
    axes[0].set_ylabel('Panel frequency or agreement (%)');axes[1].legend(fontsize=7);fig.tight_layout();save(fig,'Figure_7_Confidence_State_Agreement')
    write('figure_5_7_plotted_data.json',plotted)
    (DEST/'Figure_5_7_Captions_EN.md').write_text('''Figure 5. Tie-fractional Acc@1 and Acc@3 by neutral-observation fraction in the corrected v32 replay of 150 archived, unreviewed VLM panels. The fraction counts NOT_OBSERVABLE/UNCERTAIN among CHR_01–CHR_20 and excludes CHR_21. Bins have width 0.1; n labels give panel counts. Intervals use 2,000 source/section-cluster bootstrap resamples (seed 20261111); intervals are omitted when a bin contains fewer than two clusters. This is descriptive development-set analysis.

Figure 6. Published reference genus versus displayed first output or abstention, separated by source cohort. Integers are panel counts and shading gives the percentage within the published reference genus. Framed cells indicate matching genus labels. Displayed first outputs use deterministic tie order; the agreement metrics elsewhere use fractional score ties.

Figure 7. Output frequency (white) and conditional tie-fractional top-one agreement (gray), with 95% source/section-cluster bootstrap intervals, for the corrected v32 replay. Precision is N/A for abstentions and empty states; a missing interval also reflects fewer than two source clusters. Confidence labels are not calibrated probabilities.
''',encoding='utf-8')
    print('Figures 5-7: 450 dpi PNG and vector PDF, with archived plotted data.')

if __name__=='__main__':main()
