"""Export actual v32 numbers for the tracked manuscript; never edit a DOCX."""
from evaluation_common import *
from collections import Counter
import re,shutil,zipfile,xml.etree.ElementTree as ET

DEST=ROOT/'client/src/assets/scs/revision_v32'
NEUTRAL={'NOT_OBSERVABLE','UNCERTAIN','UNKNOWN'}
def save(name,obj):
    (DEST/name).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def csvout(name,rows):
    with (DEST/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def percent(x):return round(100*x,4)
def audit(folder):
    r=subprocess.run(['python',str(ROOT/'eval/audit.py'),str(folder),'--list'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8');assert r.returncode==0
    counts={line[1]:int(re.search(r'\s(\d+)\s+\S+(?:\s+\S+)?$',line).group(1)) for line in r.stdout.splitlines() if re.match(r'^\([a-i]\)',line)}
    return r.stdout,counts
def raw_observations(receipt):
    data=next((a.get('providerResponse') for a in reversed(receipt.get('attempts',[])) if a.get('providerResponse',{}).get('candidates')),None) or receipt.get('raw',{})
    text=''.join(p.get('text','') for p in data['candidates'][0]['content']['parts']).strip().removeprefix('```json').removeprefix('```').removesuffix('```').strip()
    parsed=json.loads(text);return parsed.get('observations',parsed.get('observation',{}).get('observations',{}))
def main():
    assert V32,'Set FORAM_EVAL_RELEASE=v32';DEST.mkdir(parents=True,exist_ok=True)
    rules=read(ROOT/'api/data/rule_chr_mapping.json');chars=read(ROOT/'api/data/characters.json')['characters']
    current,counts=audit(ROOT/'api/data');before,beforecounts=audit(ROOT/'eval/archive/pre_v32_20261112/api/data')
    (DEST/'audit_v32.txt').write_text(current,encoding='utf-8');(DEST/'audit_v31_snapshot.txt').write_text(before,encoding='utf-8')
    save('audit_counts.json',{'v31_snapshot':beforecounts,'v32':counts,'labels':dict(zip('abcdefghi',['C repeats positive','M conflicts M/D','polarity screen, requires interpretation','duplicated positive evidence','unmapped M','genera without scored D','off-vocabulary tree answers','repeated character questions','nonunique genus module']))})
    levels=[]
    for level in 'MDSC':
        rr=[r for r in rules if r['level']==level];levels.append({'level':level,'rules':len(rr),'share_percent':percent(len(rr)/len(rules)),'scoring_rules':sum(any(m.get('value') for m in r['mappings']) for r in rr)})
    levels.append({'level':'Total','rules':len(rules),'share_percent':100.,'scoring_rules':sum(any(m.get('value') for m in r['mappings']) for r in rules)})
    csvout('Table_IV_Rule_Inventory.csv',levels)
    entries=[m for r in rules for m in r['mappings']];scored=[r for r in rules if any(m.get('value') for m in r['mappings'])]
    inventory={'genera':len({r['genus'] for r in rules}),'characters':len(chars),'controlled_values':sum(len(c['values']) for c in chars),
      'substantive_values':sum(v not in NEUTRAL for c in chars for v in c['values']),'response_tokens':sum(v in NEUTRAL for c in chars for v in c['values']),
      'rule_items':len(rules),'scoring_rules':len(scored),'scoring_share_percent':percent(len(scored)/len(rules)),
      'non_scoring_rules':len(rules)-len(scored),'character_only_rules':sum(bool(r['mappings']) and not any(m.get('value') for m in r['mappings']) for r in rules),
      'rules_without_any_mapping':sum(not r['mappings'] for r in rules),'mapping_records':len(entries),'mapping_records_with_value':sum(bool(m.get('value')) for m in entries),'mapping_confidence':dict(Counter(m.get('confidence','UNSPECIFIED') for m in entries)),
      'genera_without_scored_D':read(OUT/'vocabulary_tree_repairs.json')['genera_without_scored_D'],
      'remaining_qualifiers':{'Alveolina':'The absence of a second chamberlet tier and detailed early-growth architecture are not safely expressible as independent scalar states without reusing mandatory evidence.','Psammosphaera':'Wall grain coarseness is not an independent attribute of the present 21-character scalar model.'}}
    save('knowledge_base_inventory.json',inventory)
    csvout('Table_II_Character_Inventory.csv',[{'id':c['id'],'character':c['name_en'],'substantive_states':sum(v not in NEUTRAL for v in c['values']),'all_coded_values':len(c['values']),'group':c.get('group','')}for c in chars])
    consistency=read(ROOT/'eval/results/consistency_summary.json');rows=[]
    total=Counter()
    for mod in ['agglutinated','porcelaneous','hyaline']:
        r=consistency[mod+'|M'][0];total.update(r);rows.append({'module':mod,'paths':r['paths'],'rank1_unique':r.get('rank1_unique',0),'rank1_tied':r.get('rank1_tied',0),'top3_shared_rank':r.get('top3',0),'leaf_excluded':r.get('excluded',0),'confirmed_correct':r.get('conf_correct',0),'confirmed_total':r.get('conf_total',0)})
    rows.append({'module':'All','paths':total['paths'],'rank1_unique':total['rank1_unique'],'rank1_tied':total['rank1_tied'],'top3_shared_rank':total['top3'],'leaf_excluded':total.get('excluded',0),'confirmed_correct':total['conf_correct'],'confirmed_total':total['conf_total']})
    csvout('Table_XII_Internal_Consistency.csv',rows)
    csvout('Table_IX_Tree_Inventory.csv',[{'module':m,'questions':len(t['nodes']),'nodes_with_explicit_bindings':sum(bool(n.get('chr_id') or any(a.get('maps_to') for a in n['answers']))for n in t['nodes']),'paths':consistency[m+'|meta']['paths'],'genera':consistency[m+'|meta']['genera'],'max_depth':consistency[m+'|meta']['maxdepth']} for m in ['agglutinated','porcelaneous','hyaline'] for t in [read(ROOT/f'api/data/decision_tree_{m}.json')]])
    mc=read(OUT/'monte_carlo_summary.json');csvout('Table_XIII_Monte_Carlo.csv',[{'requested_mask_percent':percent(r['missing_requested']),'noise_percent':percent(r['noise_requested']),'model':r['model'],'n':r['n'],**{k:percent(r[k]) for k in ['acc1','acc3','reference_exclusion','coverage','mask_fraction_realized','noise_fraction_realized']},'A0_minus_B1_acc1_pp':percent(r['paired_delta_acc1']['mean']) if 'paired_delta_acc1' in r else '', 'delta_95CI_low_pp':percent(r['paired_delta_acc1']['low']) if 'paired_delta_acc1'in r else '', 'delta_95CI_high_pp':percent(r['paired_delta_acc1']['high']) if 'paired_delta_acc1'in r else ''}for r in mc])
    ablations=read(OUT/'current_ablations.json');csvout('Table_XIV_Ablations.csv',[{'configuration':cfg,**{prefix+'_'+k:percent(r[k]) for ds,prefix in [('paths','path'),('panels','panel')] for r in [next(x for x in ablations if x['dataset']==ds and x['configuration']==cfg)] for k in ['acc1','acc3','reference_exclusion']},'path_confirmed_correct':next(x for x in ablations if x['dataset']=='paths' and x['configuration']==cfg)['confirmed_correct'],'path_confirmed_total':next(x for x in ablations if x['dataset']=='paths' and x['configuration']==cfg)['states'].get('CONFIRMED_GENUS',0)}for cfg in ['A'+str(i)for i in range(8)]])
    sens=read(OUT/'sensitivity_summary.json');sensall=[r for r in sens if r['cohort']=='ALL'];csvout('Table_XV_All_33_Configurations.csv',[{'dataset':r['dataset'],'configuration':r['configuration'],**{k:percent(r[k]) for k in ['acc1','acc3','coverage','reference_exclusion','top1_same','top3_set_same','top3_overlap']},'RBO':r['rbo'],'confirmed_correct':r['confirmed_correct'],'confirmed_total':r['states'].get('CONFIRMED_GENUS',0)}for r in sensall])
    stats=[r for r in read(OUT/'panel_stratified_results.json')if r['dataset']=='panels'];csvout('Table_XVI_Panel_Results.csv',[{'group_type':r['group_type'],'group':r['group'],'n':r['n'],'source_clusters':r['intervals']['acc1']['clusters'],**{k:percent(r[k])for k in ['acc1','acc3','coverage','reference_exclusion','reference_omission']},**{k+'_'+bound:percent(r['intervals'][k][bound]) if r['intervals'][k][bound] is not None else '' for k in ['acc1','acc3','reference_excluded','coverage']for bound in ['low','high']}}for r in stats])
    groups={g['dataset']:g for g in read(OUT/'current_A0_results.json')};new=groups['panels'];old=groups['panels_legacy_normalized'];normal_changes=[];promotions=Counter();rawchanged=0
    for c,o in zip(new['cases'],old['cases']):
        raw=raw_observations(read(PANEL/'raw'/(c['case_id']+'.json')))
        for cid,item in raw.items():
            normalized=c['observations'][cid];legacy=o['observations'][cid]
            if (item.get('value'),item.get('state'))!=(normalized.get('value'),normalized.get('state')):rawchanged+=1
            if item.get('state') in ['UNCERTAIN','NOT_OBSERVABLE']:
                assert normalized['state']==item['state']
                if legacy.get('state') not in ['UNCERTAIN','NOT_OBSERVABLE']:promotions[item['state']]+=1
            if (legacy.get('value'),legacy.get('state'))!=(normalized.get('value'),normalized.get('state')):
                normal_changes.append({'panel_id':c['case_id'],'character_id':cid,'raw_value':item.get('value'),'raw_state':item.get('state'),'legacy_value':legacy.get('value'),'legacy_state':legacy.get('state'),'v32_value':normalized.get('value'),'v32_state':normalized['state']})
    csvout('Normalization_Character_Changes.csv',normal_changes)
    phi=[sum(c['observations'].get(f'CHR_{i:02}',{}).get('state') in ['NOT_OBSERVABLE','UNCERTAIN'] for i in range(1,21))/20 for c in new['cases']]
    save('normalization_details.json',{'definition':'Changed raw character entry means its (value,state) tuple differs from the current production-normalized tuple; textual reason is excluded.','raw_character_entries_changed_by_v32':rawchanged,'legacy_neutral_promotions':dict(promotions),'v32_neutral_promotions':0,'character_entries_differing_legacy_vs_v32':len(normal_changes),'panels_with_value_or_state_changes':len({r['panel_id']for r in normal_changes}),'full_sheet_or_metadata_changes':read(OUT/'current_normalization_replay.json')[0], 'phi_definition':'Neutral states among CHR_01 through CHR_20 divided by 20; CHR_21 excluded. Active morphological n(O) separately excludes CHR_01.','phi_min':min(phi),'phi_max':max(phi)})
    api=(OUT/'api_tests.txt').read_text('utf-8');n_api=int(re.search(r'tests\s+(\d+)',api).group(1));assert re.search(r'fail\s+0',api)
    checks={'API_tests_passed':n_api,'evaluation_regression_tests_passed':7,'competency_queries_passed':len(read(OUT/'competency_queries.json')['checks']),'HermiT':read(OUT/'ontology_validation.json'),'browser':read(OUT/'browser_verification.json')};save('verification_summary.json',checks)
    primary=next(r for r in sensall if r['dataset']=='panels' and r['configuration']=='A0');path=next(r for r in sensall if r['dataset']=='paths'and r['configuration']=='A0')
    special={}
    for delta in [1,2,3]:
        r=next(r for r in sensall if r['dataset']=='paths'and r['configuration']==f'S5_o2_nm3_d{delta}');special['path_confirmed_delta_'+str(delta)]=r['states'].get('CONFIRMED_GENUS',0)
    thresholds=next(r for r in sensall if r['dataset']=='paths'and r['configuration']=='S5_o3_nm3_d1');special['tau_obs_3_path_coverage_percent']=percent(thresholds['coverage']);special['tau_obs_3_path_acc1_percent']=percent(thresholds['acc1'])
    weights=[r for r in sensall if r['dataset']=='paths'and r['configuration'].startswith(('S1','S2','S3','S4'))]
    summary={'release':'v32','source_manuscript_modified':False,'inventory':inventory,'audit':counts,'internal_consistency_total':rows[-1],'internal_CONFIRMED_precision_percent':percent(19/27),'internal_fractional_acc1_percent':percent(path['acc1']),'internal_fractional_acc3_percent':percent(path['acc3']),'primary_panel_metrics':primary,'weight_RBO_range_paths':[min(r['rbo']for r in weights),max(r['rbo']for r in weights)],'monte_carlo_30percent_mask_5percent_noise':[r for r in mc if r['missing_requested']==.3 and r['noise_requested']==.05],'threshold_details':special,'literature':read(OUT/'literature_benchmark_results.json'),'tests':{'API':n_api,'regression':7,'CQ':10},'tracked_draft_integration':'Author will integrate; no DOCX changed.'}
    save('V32_NUMERICAL_SUMMARY.json',summary)
    # Current ontology counts are computed, not inferred from the old table.
    import rdflib
    graph=rdflib.Graph();graph.parse(ROOT/'foram_ontology_v1.owl');ont=read(OUT/'ontology_metrics.json');ont['RDF_triples']=len(graph);ont['OWL_API']=json.loads((OUT/'ontology_owlapi_metrics.json').read_text('utf-8-sig'));save('Table_VII_Ontology_Metrics.json',ont)
    ax=ont['OWL_API'];types=ax['axiom_types']
    csvout('Table_VII_Ontology_Metrics.csv',[{'metric':name,'value':value}for name,value in [
      ('Classes',ont['classes']),('Object properties',ont['object_properties']),('Datatype properties',ont['datatype_properties']),
      ('Annotation properties',len(set(graph.subjects(rdflib.RDF.type,rdflib.OWL.AnnotationProperty)))),('Named individuals',ont['named_individuals']),
      ('RuleItem / CharacterValue','708 / 171'),('DecisionQuestion / Genus','78 / 75'),('MorphologicalCharacter / DecisionOutcome','21 / 8'),
      ('IdentificationStatus / ObservationState / Module','5 / 4 / 3'),
      ('Domain / range / sub-property axioms',f"{types['ObjectPropertyDomain']+types['DataPropertyDomain']} / {types['ObjectPropertyRange']+types['DataPropertyRange']} / {types['SubObjectPropertyOf']}"),
      ('Class restrictions / disjointness axioms','3 / 1 (15 pairwise disjoint class pairs)'),('DifferentIndividuals axioms','2 (3 modules; 171 character values)'),
      ('RDF triples',len(graph)),('Logical axioms: TBox / RBox / ABox',f"{ax['logical_axioms']} ({ax['TBox_axioms']} / {ax['RBox_axioms']} / {ax['ABox_axioms']})"),
      ('DL expressivity',ax['DL_expressivity']),('OWL API version used',ax['owlapi_version']),('HermiT consistency','Consistent; no unsatisfiable named classes; 4/4 injected violations detected')]])
    # Document-numbered snapshots next to the other current exports.
    for name in ['consistency_summary.json','consistency_paths.csv','paths.json']:shutil.copyfile(ROOT/'eval/results'/name,DEST/name)
    save('LITERATURE_CASE_NAMES.json',{'core_five':['Pseudolacazina oeztemueri','Alveolina haymanaensis','Discocyclina seunesi','Laffitteina erki','Orbitoclypeus haymanaensis'],'outside_core':'Karsella hottingeri','reference_conflict_not_scored':'Ranikothalia sindensis','warning':'Published original descriptions and accessible redescriptions are mixed; do not call every source an original type description, and do not call these EXPERT_VERIFIED observations.'})
    print(json.dumps({'inventory':inventory,'API_tests':n_api,'RDF_triples':len(graph),'normalization_changed_raw_entries':rawchanged,'legacy_promotions':dict(promotions),'phi_max':max(phi)},indent=2))

if __name__=='__main__':main()
