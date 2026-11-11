"""Create V28 from the user's V27; original file is never opened for writing.

V27 renumbered the old Table XIV as Table VIII and moved the ontology
inventory to S9.6. This updater follows the actual V27 numbering.
"""
from evaluation_common import *
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table
from docx.shared import Inches, Pt, Cm
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from copy import deepcopy
import sys, re, collections

DEST=ROOT/'client/src/assets/scs/revision_v28'
SOURCE=Path(sys.argv[1]) if len(sys.argv)>1 else Path(r'C:\Users\burak\Downloads\Foraminifer_Manuscript_v27_IEEE_Access.docx')
def pct(x):return f'{100*x:.1f}'
def ci(x):return f"{pct(x['mean'])} [{pct(x['low'])}-{pct(x['high'])}]" if x['low'] is not None else pct(x['mean'])

def main():
    DEST.mkdir(parents=True,exist_ok=True)
    source_hash=hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    doc=Document(SOURCE);body=list(doc._body._body);changes=[]
    current=read(OUT/'current_A0_results.json');groups={x['dataset']:x for x in current}
    ba=read(OUT/'before_after_summary.json');stats=read(OUT/'panel_stratified_results.json')
    sens=read(OUT/'sensitivity_summary.json');mc=read(OUT/'monte_carlo_summary.json');abl=read(OUT/'current_ablations.json')
    norm=read(OUT/'current_normalization_replay.json')[0]
    audit=read(OUT/'audit_repairs.json');owl=read(OUT/'ontology_metrics.json')
    def result(dataset,version='after',module='ALL'):return next(x for x in ba if x['version']==version and x['dataset']==dataset and x['module']==module)
    def stat(group,dataset='panels'):return next(x for x in stats if x['dataset']==dataset and x['group']==group)
    def ab(ds,c):return next(x for x in abl if x['dataset']==ds and x['configuration']==c)
    a=result('paths');p=result('panels');n=result('panels_raw_neutral')
    original_structure=[{'index':i,'text':' '.join(t.text or '' for t in e.xpath('.//w:t')),
      'rows':[[' '.join(t.text or '' for t in cell.xpath('.//w:t')) for cell in row.xpath('./w:tc')] for row in e.xpath('./w:tr')]}
      for i,e in enumerate(body)]
    def replace(index,text):
        para=Paragraph(body[index],doc._body);before=para.text
        # Preserve section breaks/paragraph properties and existing first run style.
        first=deepcopy(para.runs[0]._r.rPr) if para.runs and para.runs[0]._r.rPr is not None else None
        for child in list(para._p):
            if child.tag!=qn('w:pPr'):para._p.remove(child)
        run=para.add_run(text)
        if first is not None:run._r.insert(0,first)
        changes.append({'body_index_v27':index,'before':before,'after':text})
    def fill(index,rows):
        table=Table(body[index],doc._body)
        assert len(table.rows)==len(rows),(index,len(table.rows),len(rows))
        for tr,values in zip(table.rows,rows):
            for cell,value in zip(tr.cells,values):
                para=cell.paragraphs[0];fmt=deepcopy(para.runs[0]._r.rPr) if para.runs and para.runs[0]._r.rPr is not None else None
                cell.text=str(value)
                if fmt is not None:cell.paragraphs[0].runs[0]._r.insert(0,fmt)

    replace(7,f'ABSTRACT  Genus-level identification of Paleocene-Eocene benthic foraminifera in thin section requires morphological interpretation. We present an ontology with 21 controlled characters, 108 substantive states, 706 evidence-graded rules and 75 genera. An auditable engine ranks candidates while treating unobservable characters as neutral. A reproducible encoding revision removed 17 positive/contradictory overlaps, 10 mandatory/diagnostic conflicts and 25 repeated-scoring pairs. Across 104 unchanged internal decision paths, unique first ranks increased from 24 to {a["rank1_unique"]}, shared-rank top-three retrieval from 64 to {a["top3_shared_rank"]}, while excluded leaves increased from 17 to {round(a["reference_exclusion"]*104)}. The corrected engine achieved {pct(p["acc1"])}% tie-aware top-one agreement on 150 published image panels and {pct(n["acc1"])}% when raw uncertainty was retained; 122 panels overlap a knowledge-base reference book. Thirty-three weight/threshold configurations and a paired synthetic comparison against an unweighted eliminative key were evaluated offline. With 5% noise and 10%, 30% and 50% masking, synthetic top-one agreement was '+', '.join(pct(next(x for x in mc if x['model']=='A0' and x['missing_requested']==m and x['noise_requested']==.05)['acc1'])+'%' for m in [.1,.3,.5])+'. Three OWL cardinality restrictions and core-class disjointness were implemented and tested with HermiT. These development and synthetic tests characterize robustness under specified assumptions; the low image-panel agreement and remaining vocabulary gaps require independent validation.')
    replace(14,original_structure[14]['text'].replace('seven counterfactual ablations, and an exploratory','seven counterfactual ablations, completed weight/threshold sensitivity, a paired synthetic eliminative-key baseline, and an exploratory'))
    replace(65,'OWL structure: The lightweight OWL 2 ontology contains nine classes: Genus, Module, MorphologicalCharacter, CharacterValue, RuleItem, DecisionQuestion, DecisionOutcome, ObservationState and IdentificationStatus. The existing property hierarchies, domain/range axioms and functional datatype properties are retained. The export now includes three qualified cardinality restrictions and an AllDisjointClasses axiom for the six core entity types, as specified below. Module and controlled-value individuals are explicitly distinguished with two AllDifferent axioms. The generated inventory is reported in Supplementary Material S10; identification still uses the rule scorer rather than a description-logic reasoner. eval/generate_ontology.py regenerates the constraints and synchronizes current rule mappings on every export.')
    replace(69,'Reasoning and pitfall scanning: The revised OWL file was classified using HermiT [47] through Owlready2 and was consistent with no unsatisfiable named classes. Four isolated negative controls were rejected: an individual typed as both Genus and RuleItem, a genus assigned to two explicitly distinct modules, an evidenceLevel value outside the four-value enumeration, and a character constrained to at most one allowed value in conflict with the minimum of two. These are actual reasoner runs, not inferred results. Three class restrictions, one n-ary disjointness axiom (15 pairwise class relations) and two AllDifferent axioms are counted separately. Closed-world JSON checks additionally verify the asserted cardinalities; OWL open-world semantics do not make a missing assertion an automatic validation failure. OOPS! [49] was not run.')
    replace(71,'Knowledge-base integrity audit: The audit checks (a) positive/contradictory pair overlap, (b) conflicting mandatory/diagnostic mappings, (c) a lexical negation screen, (d) repeated scored pairs, (e) unmapped mandatory rules, (f) genera without a scored diagnostic, (g) out-of-vocabulary tree answers, (h) repeated questions and (i) module cardinality. The immutable pre-revision master reproduced 17/10/25 findings in (a)/(b)/(d). Sixty-seven documented encoding edits reduced all three to zero without changing reference labels, tree answers, evidence grades or the 706 original rule statements. Scope errors were removed, ontogenetic transitions were encoded explicitly, redundant scoring pairs were retired, and statements not expressible in the vocabulary were retained as non-scoring hints. Of the original 18 genera without a scored diagnostic, three received a literal or existing-tree-supported mapping; 15 could not be completed without inventing anatomy or extending the vocabulary. Retiring false diagnostic proxies leaves 28 genera without a scored diagnostic overall. Remaining counts are (c) 3 lexical flags, (e) 28 unmapped mandatory rules, (f) 28 genera, (g) 7 answers, (h) 11 nodes and (i) 0 genera. These findings and the full before/after ledger are supplied in Supplementary Material S10. The repairs are encoding consistency work, not independent taxonomic validation.')
    # Rule counts and the Nummulites example reflect the revised master.
    rules=read(ROOT/'api/data/rule_chr_mapping.json');levels=['M','D','S','C'];names=['Mandatory','Diagnostic','Supporting','Contradictory']
    rows=[['Evidence level','Code','Rules','Share (%)','Scoring rules']]
    for level,name in zip(levels,names):
        rr=[r for r in rules if r['level']==level];rows.append([name,level,len(rr),f'{len(rr)/len(rules)*100:.1f}',sum(any(m.get('value') for m in r['mappings']) for r in rr)])
    rows.append(['Total','—',len(rules),'100.0',sum(any(m.get('value') for m in r['mappings']) for r in rules)]);fill(48,rows)
    table=Table(body[63],doc._body)
    for row in table.rows:
        if row.cells[0].text=='D2':row.cells[2].text='Non-scoring hint: cord-strength state repeats mandatory presence through implication'
    table=Table(body[128],doc._body)
    table.rows[4].cells[0].text='Ammodiscus D1: CHR_06 = PLANISPIRAL'
    table.rows[-1].cells[0].text='Runner-up (Rhizammina) / margin Δ';table.rows[-1].cells[1].text='7 / 12';table.rows[-1].cells[2].text='7 / 7'
    replace(129,original_structure[129]['text'].replace('and confirmed in the running application (Section VI-F)','on the current JSON mapping master. Pre-curation interface captures are retained only as historical illustrations (Section VI-F)'))
    replace(131,'The application displays the observation count n(O), evidence matches and exclusions. The worked example (Table VII) was replayed after the mapping revision. Scenario A gives Ammodiscus 19, Rhizammina 7, Psammosphaera 6, and Saccammina and Glomospira 4, with a margin of 12. Scenario B masks CHR_07: Ammodiscus falls to 14 and the margin is 7. Both outputs are CONFIRMED_GENUS. The pre-curation screenshots in Supplementary Fig. S9.7 retain their historical scores (Saccammina 9; margins 10 and 5) and should not be read as captures of the corrected master. Revised numerical values are reproduced by api/test/scoring.table13.test.js.')
    replace(146,'We evaluated unchanged internal paths (VIII-A), replayed 150 archived VLM observation sheets (VIII-C–D and VIII-F–G), ran seven ablations and 33 weight/threshold configurations (VIII-E), and compared the scorer with an unweighted eliminative key in a paired synthetic stress test (VIII-H). VIII-B retains the future independent expert protocol. No expert observations, new VLM calls, hidden test-set tuning or simulated human assessments are claimed. S1–S9 describe the frozen earlier evaluation; S10 contains the corrected masters, current outputs, before/after comparisons and reproduction scripts.')
    rows=[original_structure[151]['rows'][0]]
    for module,label in [('AGGLUTINATED','Agglutinated'),('PORCELANEOUS','Porcelaneous'),('HYALINE','Hyaline'),('ALL','All')]:
        x=result('paths',module=module);rows.append([label,x['n'],x['rank1_unique'],x['rank1_tied'],x['top3_shared_rank'],round(x['reference_exclusion']*x['n']),f"{x['confirmed_correct']} / {x['states'].get('CONFIRMED_GENUS',0)}"])
    fill(151,rows)
    replace(152,f'Counts use shared score ranks and do not count abstentions as retrieved identifications. The same 104 path observations and leaf labels were retained. The current JavaScript engine and independent Python Engine M agree on every path state and displayed output. Unique first ranks increased from 24 to 30 and shared-rank top-three retrieval from 64 to 68; excluded leaves increased from 17 to 19. Fractional, abstention-aware Acc@1/Acc@3 changed from 20.0%/46.0% to {pct(a["acc1"])}%/{pct(a["acc3"])}%. Thus removing audit findings did not resolve all tree–rule disagreements. Original results remain frozen, and current path-level triggers are in S10.')
    replace(153,'The revised path replay records 19 excluded leaves and the exact responsible rule statements. A CSV defect in the earlier evaluation script was also corrected: the generic leaf_excluded column had been populated from historical Engine R while the reported results used Engine M. The current export labels both engines separately and supplies Engine M exclusion triggers consistently. No path answer was masked, relabeled or removed to increase agreement. Composite questions still carry information outside the controlled vocabulary, and internal retrieval remains a development consistency measure.')
    replace(162,original_structure[162]['text'].replace('The normalized observations were scored by the unchanged local engine,','For the current revision, these unchanged archived observations were replayed offline with the corrected master and default scorer,').replace('unchanged observation prompt and normalization routine','original observation prompt and normalization routine'))
    replace(164,'Normalization replay: The original provider receipts and application-normalized sheets were retained. In a paired secondary replay, only raw UNCERTAIN or NOT_OBSERVABLE entries promoted to an evaluable state were restored to neutrality; all other normalization was retained. Module selection was re-inferred from CHR_01 without reference labels. Both conditions use the corrected master. Descriptive percentile intervals use 2,000 paired resamples of source/section clusters (seed 20261111); S10 also supplies the frozen pre-curation replay for comparison.')
    replace(175,'E. Ablation, Weight and Threshold Sensitivity Analyses')
    replace(176,original_structure[176]['text'].replace('were evaluated on','were rerun with the corrected master on'))
    rows=[original_structure[179]['rows'][0]]
    labels=['Full model','Unobserved → MISMATCH','No implications','No contradictory rules','Strict conjunction','Tie after PROBABLE','PROBABLE margin ≥ 3','Normalized score']
    for i,label in enumerate(labels):
        x,y=ab('paths','A'+str(i)),ab('panels','A'+str(i))
        rows.append(['A'+str(i),label,pct(x['acc1']),pct(x['acc3']),pct(x['reference_exclusion']),f"{x['confirmed_correct']}/{x['states'].get('CONFIRMED_GENUS',0)}",pct(y['acc1']),pct(y['acc3']),pct(y['reference_exclusion'])])
    fill(179,rows)
    x=ab('paths','A1')
    replace(181,f'With the corrected master, A1 produced {pct(x["reference_exclusion"])}% excluded leaves and Acc@1/Acc@3 of {pct(x["acc1"])}%/{pct(x["acc3"])}%, compared with {pct(a["reference_exclusion"])}% and {pct(a["acc1"])}%/{pct(a["acc3"])}% for A0. All ablations were computed on the same observations and use the current master (Table X). Supporting tables distinguish the frozen pre-curation results from these replays. These contrasts characterize internal and VLM-derived inputs, not expert accuracy.')
    replace(182,'Completed weight/threshold sensitivity: eval/sensitivity.py evaluated A0, equal weights (+1,+1,+1,−1), mandatory-dominant weights (+5,+3,+1,−5), no supporting score (+3,+5,0,−5), contradiction penalties −3 and −10, and all 27 combinations of τ_obs ∈ {1,2,3}, τ_NM ∈ {2,3,4}, δ ∈ {1,2,3}. These 33 configurations were applied to the 104 frozen paths and 150 archived VLM sheets; state-preserving panel replays are supplied separately. Rank-biased overlap [69] uses p=0.9 and the finite unequal-list extrapolation (Eq. 32), with the actual deterministic tie order; accuracy retains fractional score ties. Top-1 and top-3 stability are agreement with A0, separately from agreement with the reference genus. Table XII reports all five weight alternatives. Threshold variation left every ranking unchanged (RBO and top-1/top-3 stability = 1.0), while path Acc@1 ranged from 21.3% to 25.1% through altered abstention; panel Acc@1 remained 3.2%. No configuration was selected as an optimum, and these are development analyses rather than a held-out tuning result.')
    # Current panel summary, including uncertainty intervals recomputed by cluster.
    parts=[]
    for group,label in [('Additional articles','additional-article'),('KB reference book (overlap)','reference-book')]:
        x=stat(group);parts.append(f'{label} panels: Acc@1 {ci(x["intervals"]["acc1"])}%, Acc@3 {ci(x["intervals"]["acc3"])}%')
    replace(184,'Table XI reports the corrected-master replay against published labels. '+ '; '.join(parts)+f'. Pooled Acc@1/Acc@3 were {pct(p["acc1"])}%/{pct(p["acc3"])}%, versus 4.9%/20.1% with the frozen pre-curation master on the same normalized sheets. Rule-based reference exclusion was {pct(p["reference_exclusion"])}%. Encoding repairs improved some internal rankings while reducing image-panel agreement; this adverse result is retained. The 122 book panels remain source-overlapping and the pooled values remain descriptive.')
    replace(185,f'The normalized observation sheets and missingness fractions were not regenerated. With the corrected master, {round(p["reference_exclusion"]*150)} published reference genera were eliminated by rules and {round(p["reference_omission"]*150)} were omitted through the module selected from CHR_01. These are distinct causes of absence from the candidate ranking. The design cannot assign the disagreements uniquely to visual observation errors, published labels or knowledge-base validity. Frozen S9 figures describe the earlier master; current statistics and plots are supplied in S10.')
    rows=[original_structure[188]['rows'][0]]
    for group,label in [('Additional articles','Additional articles'),('KB reference book (overlap)','KB book (source overlap)'),('ALL','All panels'),('AGGLUTINATED','Agglutinated'),('PORCELANEOUS','Porcelaneous'),('HYALINE','Hyaline')]:
        x=stat(group);q=x['intervals'];rows.append([label,f"{x['n']} ({q['acc1']['clusters']})",ci(q['acc1']),ci(q['acc3']),ci(q['coverage']),ci(q['reference_excluded'])])
    fill(188,rows)
    replace(189,'Percentages with descriptive 95% source/section-cluster intervals (2,000 resamples, Python random.Random seed 20261111). Acc@k gives uniform score-tie credit and zero credit for abstentions. Module rows use published reference modules; scoring uses only the VLM-derived composition. All rows use the corrected master. Historical intervals and raw provider responses remain unchanged in the frozen earlier package.')
    scored=metrics(groups['panels']['cases'],groups['panels']['results'])
    counts=collections.Counter(r['prediction'] for r in scored if r['prediction']);most=counts.most_common(1)[0]
    replace(190,f'Errors remained systematic. The most frequently displayed genus in the corrected pooled replay was {most[0]} ({most[1]} panels). The displayed first name and fractional score-tie credit are distinct outcomes, and complete per-panel ranks and omissions are retained. No poorly performing panel was removed after curation.')
    conf=[r for r in scored if r['status']=='CONFIRMED_GENUS']
    replace(191,f'Confidence-state agreement remains low (Fig. 3, regenerated for the corrected master). CONFIRMED_GENUS occurred in {len(conf)} panels, with {pct(sum(r["acc1"] for r in conf)/len(conf))}% mean fractional top-one agreement. On internal paths, {a["confirmed_correct"]} of {a["states"]["CONFIRMED_GENUS"]} confirmed outputs named the leaf (Table VIII). These categories describe rule evidence and should not be interpreted as calibrated probabilities of correctness.')
    replace(192,'The pre-curation archive records ten read-only competency-query matches. The revised local API suite passes 47 tests, including the worked example, every internal path state/output and configurable thresholds. Seven additional scientific tests check RBO properties, tie credit, frozen image hashes, audit targets, paired masking/noise, ranking invariance under threshold changes and preservation of the default scoring algorithm. HermiT and its negative controls are reported in Section IV-B and S10. Database synchronization, when performed, is recorded separately; no unverified live-deployment claim is made.')
    replace(194,f'Restoring promoted raw neutral states changed {norm["changed_panels"]} observation sheets. With the corrected master, pooled Acc@1 changed from {pct(p["acc1"])}% to {pct(n["acc1"])}% (paired difference {pct(norm["delta_acc1"]["mean"])} percentage points; 95% cluster interval {pct(norm["delta_acc1"]["low"])} to {pct(norm["delta_acc1"]["high"])}). Acc@3 changed from {pct(p["acc3"])}% to {pct(n["acc3"])}%. The earlier 4.9%-to-8.9% replay is reproducible only with the frozen pre-curation master; it is retained as a historical comparison, not attributed to the corrected knowledge base.')
    replace(195,f'The displayed genus or abstention changed in {norm["display_changed"]} panels and the evidence state changed in {norm["state_changed"]}. Rule-based reference exclusion remained {pct(n["reference_exclusion"])}%. Paired differences use the same source/section resamples in both conditions. Complete before/after masters and both normalization conditions are supplied in S10; none is an independently expert-labeled evaluation.')
    # Replace Fig. 3's image bytes through its existing relationship; preserve size.
    blips=body[196].xpath('.//a:blip')
    assert len(blips)==1
    part=doc.part.related_parts[blips[0].get(qn('r:embed'))]
    part._blob=(DEST/'Figure_3_Current_Confidence.png').read_bytes()
    replace(197,'Current-master confidence-state agreement and output frequency in the source-labeled panel evaluation. Blue bars show mean tie-fractional top-one agreement; orange lines show output frequency. Labels give panel counts. N/A denotes an abstaining state or a state with no assigned panel. Additional articles and source-overlapping book panels are shown separately. This is the corrected replay, not the historical S9 plot.')
    replace(209,'Knowledge-base validity: Per-rule bibliographic pages and independent multi-expert validation remain unavailable. The revision removes specific encoding conflicts but cannot supply omitted anatomical concepts. Only three of the original 18 unmapped diagnostic genera could be completed from literal existing states or the development tree; 15 remain unresolved, and 28 genera overall have no scored diagnostic after retiring false proxies. Increasing a consistency score by labeling generic shared anatomy as diagnostic would overstate the knowledge base. Synthetic profiles and internal paths share the same rule source, so their results cannot establish taxonomic validity or external generalization.')
    replace(213,f'The ontology encodes 75 genera, 21 controlled characters and 706 graded rule statements. Documented encoding repairs removed the three targeted audit categories, increased unique internal first ranks from 24 to 30 and shared-rank top-three retrieval from 64 to 68, but left 19 excluded paths and reduced image-panel agreement to {pct(p["acc1"])}%. Completed weight/threshold sensitivity and a paired eliminative-key stress test quantify behavior without requiring human observers. The synthetic comparison favors graded scoring under the specified masking/noise process; it does not remedy low agreement on published images. Three cardinality restrictions and core-class disjointness were implemented and passed actual reasoner and negative-control checks.')
    replace(214,'Priorities are independent source-disjoint evaluation, anatomical vocabulary extensions, taxonomic and per-rule source curation, reconciliation of the remaining tree–rule conflicts, and calibration of confidence states. The multi-access comparator and weight/threshold analysis are now completed development experiments, rather than promised future experiments. Expert validation remains future work; no numerical reviewer score or acceptance probability follows from these revisions.')
    replace(216,original_structure[216]['text']+' The corrected, uncommitted revision is identified by the input SHA-256 manifest in S10 rather than by the historical base commit alone. S10 includes audit repairs, all 33 sensitivity settings, 12,000 paired synthetic inputs (24,000 model evaluations), current ontology metrics and HermiT controls, updated manuscript tables, scripts and current figures. A project-specific published Zenodo DOI remains unavailable.')

    # New full-width material is wrapped in continuous one-column sections.
    two=next(deepcopy(s._sectPr) for s in doc.sections if s._sectPr.find(qn('w:cols')).get(qn('w:num'))=='2')
    one=deepcopy(two);one.find(qn('w:cols')).set(qn('w:num'),'1')
    for sect in [one,two]:
        typ=sect.find(qn('w:type'))
        if typ is None:typ=OxmlElement('w:type');sect.insert(0,typ)
        typ.set(qn('w:val'),'continuous')
    def br(anchor,sect):
        e=OxmlElement('w:p');pr=OxmlElement('w:pPr');e.append(pr);pr.append(deepcopy(sect));anchor.addprevious(e)
    def insert_p(anchor,text,template=148):
        e=deepcopy(body[template]);
        original_p=Paragraph(body[template],doc._body)
        fmt=deepcopy(original_p.runs[0]._r.rPr) if original_p.runs and original_p.runs[0]._r.rPr is not None else None
        for c in list(e):
            if c.tag!=qn('w:pPr'):e.remove(c)
        pr=e.find(qn('w:pPr'))
        if pr is not None:
            for c in list(pr):
                if c.tag==qn('w:sectPr'):pr.remove(c)
        anchor.addprevious(e);p=Paragraph(e,doc._body);run=p.add_run(text)
        if fmt is not None:run._r.insert(0,fmt)
        return p
    def insert_table(anchor,title,caption,rows):
        br(anchor,two);insert_p(anchor,title,149);insert_p(anchor,caption,150)
        table=doc.add_table(rows=1,cols=len(rows[0]));table.style=Table(body[151],doc._body).style;table.autofit=False
        table._tbl.replace(table._tbl.tblPr,deepcopy(Table(body[151],doc._body)._tbl.tblPr))
        for row in rows[1:]:table.add_row()
        for row,values in zip(table.rows,rows):
            for cell,value in zip(row.cells,values):
                cell.width=Cm(17.6/len(rows[0]));cell.text=str(value)
                for p in cell.paragraphs:
                    p.paragraph_format.space_after=Pt(2);p.paragraph_format.space_before=Pt(2)
                    for run in p.runs:run.font.name='Arial';run.font.size=Pt(7)
        for cell in table.rows[0].cells:
            for run in cell.paragraphs[0].runs:run.bold=True
        head=OxmlElement('w:tblHeader');table.rows[0]._tr.get_or_add_trPr().append(head)
        anchor.addprevious(table._tbl);br(anchor,one)
    sens_rows=[['Input','Variant','Acc@1 %','Acc@3 %','RBO .9','Top-1 same %','Top-3 same %','State same %']]
    for dataset,label in [('paths','104 paths'),('panels','150 panels')]:
        for config,short in [('A0','A0'),('S1_equal','S1'),('S2_M_gt_D','S2'),('S3_no_S','S3'),('S4_C_low','S4 C=-3'),('S4_C_high','S4 C=-10')]:
            x=next(x for x in sens if x['dataset']==dataset and x['cohort']=='ALL' and x['configuration']==config)
            sens_rows.append([label,short,pct(x['acc1']),pct(x['acc3']),f'{x["rbo"]:.3f}',pct(x['top1_same']),pct(x['top3_set_same']),pct(x['status_same'])])
    insert_table(body[183],'TABLE XII','Completed weight sensitivity against A0 (corrected master)',sens_rows)
    # The synthetic experiment follows the existing normalization subsection.
    anchor=body[198]
    insert_p(anchor,'H. Synthetic Missingness and Noise Stress Test',154)
    insert_p(anchor,'An Intkey-style unweighted multi-access comparator (B1) was implemented using the same controlled observations, implication rules and M/D cards. Any observed mismatch of an M or D rule eliminates a candidate; unknown characters do not. Every survivor is equally ranked, so Acc@k uses uniform tie credit rather than an alphabetical winner. Both systems use known CHR_01 composition (25 candidates), the same inputs and the same minimum of two informative observations. This is a custom eliminative comparator, not a run of the Intkey software [35].')
    insert_p(anchor,'For each of 75 genera, a sparse reference profile was constructed from the current positive rule mappings; unencoded anatomy remained unknown. A deterministic constraint search selected states with minimum M and D mismatches, followed by contradiction and supporting-rule consistency, without using scorer rank or image labels. Twenty repeats per genus used seed 20261111. In each repeat, 10%, 30% or 50% of mapped morphological characters were sampled without replacement and set to NOT_OBSERVABLE (round-half-up); CHR_01 and section orientation were excluded. Retained states were independently replaced with an incompatible controlled value with probability 0.05. Matched 0% masking and 0% noise controls were also evaluated: 12,000 inputs and 24,000 model evaluations in total. The achieved masking/noise rates and all perturbations are archived.')
    insert_p(anchor,'The graded model exceeded B1 at all three requested masking levels (Table XIII; Fig. 4). Paired 95% intervals for the difference resample the 75 genera, keeping repeats and model pairs together. Differences also occur on complete clean profiles, so the full advantage cannot be attributed solely to tolerance of added noise. The test is conditional on this sparse rule-derived profile model and its known modules; it demonstrates a synthetic stress-test advantage rather than independent taxonomic accuracy or field robustness.')
    mc_rows=[['Mask / noise','Model','Acc@1 %','Acc@3 %','Δ Acc@1 vs B1, pp [95% interval]']]
    for missing,noise in [(0.,0.),(.1,.05),(.3,.05),(.5,.05)]:
        for model in ['A0','B1']:
            x=next(x for x in mc if x['model']==model and x['missing_requested']==missing and x['noise_requested']==noise)
            delta=ci(x['paired_delta_acc1']) if model=='A0' else 'Reference'
            mc_rows.append([f'{int(missing*100)}% / {int(noise*100)}%',model,pct(x['acc1']),pct(x['acc3']),delta])
    insert_table(anchor,'TABLE XIII','Paired KB-derived synthetic stress test (75 genera × 20 repeats per condition)',mc_rows)
    br(anchor,two)
    image=insert_p(anchor,'');image.add_run().add_picture(str(DEST/'Monte_Carlo_A0_vs_B1.png'),width=Cm(17.5))
    insert_p(anchor,'Fig. 4. Synthetic masking/noise comparison. Solid curves: 5% Bernoulli replacement of retained mapped states; dashed curves: zero added noise. Both systems receive the same sparse profiles and perturbations. Missingness percentages apply to mapped characters, not an assumed complete 20-character ground truth. All controls and genus-paired intervals are in S10.',197)
    br(anchor,one)
    output=DEST/'Foraminifer_Manuscript_v28_IEEE_Access.docx';doc.save(output)
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==source_hash
    write('manuscript_changes.json',{'source':str(SOURCE),'source_sha256':source_hash,'output':str(output.relative_to(ROOT)),
      'table_number_mapping':'V22 Table XIV -> V27/V28 Table VIII; V22 Table VII ontology inventory -> V27 S9.6 / new S10 inventory. V28 Table VII is the worked example.',
      'paragraph_changes':changes,'new_tables':['XII sensitivity','XIII synthetic stress test'],'figure_3_replaced':True,'figure_4_added':True})
    # Standalone supplementary addendum, with readable tables and exact scope.
    supp=Document();supp.add_heading('Supplementary Material S10: Audit and Offline Evaluation Revision',0)
    supp.add_paragraph('11 November 2026. This addendum supersedes the corresponding numerical results in the frozen S1–S9 package for the corrected master. Historical raw model receipts and original source images are unchanged. No human expert validation or new model inference was performed.')
    def s_table(title,rows):
        supp.add_heading(title,1);t=supp.add_table(rows=1,cols=len(rows[0]));t.style='Table Grid'
        for vals in rows[1:]:t.add_row()
        for row,vals in zip(t.rows,rows):
            for cell,val in zip(row.cells,vals):cell.text=str(val)
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for run in p.runs:run.font.size=Pt(8)
    internal=[['Module','n','Unique first','Tied first','Top 3','Excluded','Correct / CONF.']]
    for module in ['AGGLUTINATED','PORCELANEOUS','HYALINE','ALL']:
        x=result('paths',module=module);internal.append([module,x['n'],x['rank1_unique'],x['rank1_tied'],x['top3_shared_rank'],round(x['reference_exclusion']*x['n']),f"{x['confirmed_correct']}/{x['states'].get('CONFIRMED_GENUS',0)}"])
    s_table('S10.1 Internal consistency',internal)
    s_table('S10.2 Weight sensitivity',sens_rows)
    s_table('S10.3 Synthetic stress test',mc_rows)
    s_table('S10.4 OWL inventory (legacy Table VII)',[['Metric','Count'],['Classes',owl['classes']],['Object / datatype properties',f"{owl['object_properties']} / {owl['datatype_properties']}"],['Named individuals',owl['named_individuals']],['Class restrictions',3],['DisjointClasses axioms',1],['Represented pairwise disjoint class relations',15],['AllDifferent axioms',2]])
    s_table('S10.5 Original 18 genera with unmapped diagnostics',[['Genus','Current status']]+[[x['genus'],', '.join(x['mapped_D_rules']) or 'Requires vocabulary extension / taxonomic curation'] for x in audit['original_18_without_diagnostic']])
    supp.add_heading('Interpretation and outstanding work',1)
    supp.add_paragraph('Target audit categories (a), (b), (d) are zero. Fifteen of the original 18 diagnostic gaps remain; 28 genera overall have no scored diagnostic after false proxies are removed. The primary panel top-1 agreement fell from 4.9% to 3.2%, and the raw-neutral replay from 8.9% to 3.9%. The current 104 paths have 30 unique first ranks, 22 tied first ranks and 68 shared-rank top-three retrievals; 19 leaf genera are still excluded. Synthetic performance favors A0 under the specified generator, but is derived from the KB and is not independent validation. A real project DOI and per-rule literature-page provenance remain unavailable.')
    supp.add_heading('Reproduction',1)
    for cmd in ['python eval/apply_audit_fixes.py','python eval/consistency_and_audit.py --export-paths','npm.cmd --prefix api test','python eval/sensitivity.py','python eval/monte_carlo.py','python eval/generate_ontology.py','python eval/validate_ontology.py','python -m unittest discover -s eval -p test_revision.py','python eval/revision_report.py','python eval/plot_revision.py','python eval/update_manuscript.py']:supp.add_paragraph(cmd,style='List Bullet')
    supp.add_paragraph('JSON/CSV receipts and SHA-256 manifests are distributed with this addendum. Ontology reasoning uses Owlready2 with HermiT and a local Java runtime; plots require Matplotlib. Deterministic ranks retain application tie order for RBO; agreement uses fractional score ties. Seed 20261111 is used for the new synthetic and cluster-bootstrap analyses.')
    supp.save(DEST/'Supplementary_S10_Revision.docx')
    (DEST/'CHANGES_TR.md').write_text('# V28 değişiklikleri\n\nV27 kaynak dosyası değiştirilmedi. İç tutarlılık tablosu V27’de Table VIII olarak numaralanmış; kullanıcının eski Table XIV atfı bu tabloyla eşleşir. Eski ontoloji metrikleri Table VII atfı V27’de S9.6’ya taşınmıştı; güncel metrikler S10.4’te verilmiştir.\n\nHedef denetim bulguları 17/10/25 → 0/0/0. Altmış yedi eşleme düzenlemesi. İlk 18 tanısal boşluktan 3’ü kodlanabildi, 15’i mevcut sözlükle güvenilir biçimde tamamlanamadı. Yanlış tanısal vekiller kaldırılınca toplam 28 cinsin puanlanabilir D kuralı kalmadı; bu durum gizlenmedi.\n\n104 yolda tekil ilk sıra 24 → 30, eşit ilk sıra 10 → 22, paylaşılan top-3 64 → 68, elenen yaprak 17 → 19. Panel top-1 4.9% → 3.2%; ham belirsizlik korunduğunda 8.9% → 3.9%. Sadece olumlu sonuçlar seçilmedi.\n\n33 duyarlılık ayarı, 12.000 sentetik girdi ve 24.000 model değerlendirmesi tamamlandı. B1 karşılaştırması mevcut KB’den türetilmiş sentetik stres testidir; bağımsız uzman veya dış örnek doğrulaması değildir.\n\nOWL: 3 sınıf kısıtı, 1 altılı DisjointClasses aksiyomu (15 ikili ilişki), 2 AllDifferent aksiyomu. Gerçek HermiT çalıştırması ve 4 negatif kontrol başarılı.\n\nV28 ana dosya; yeni Table XII/XIII, güncel Fig.3, yeni Fig.4 ve S10 ekiyle birlikte okunmalıdır. Eski S1–S9 ve ana klasördeki önceki ZIP’ler donmuş tarihsel sonuçları taşır.\n',encoding='utf-8')
    print('V28 manuscript and S10 addendum created; source V27 SHA-256 unchanged.')

if __name__=='__main__':main()
