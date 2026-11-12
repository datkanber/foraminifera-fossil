"""Deterministic v32 repairs from the preserved v31 masters, not leaf-derived scoring.

Routing-only questions record no scalar observation. Repeated refinements keep
the earlier observation, rather than overwriting it with a different construct.
The change log identifies remaining text that cannot safely be mapped.
"""
from pathlib import Path
import json,copy
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'eval/archive/pre_v32_20261112/api/data'
OUT=ROOT/'eval/results/v32'
def read(p):return json.loads(p.read_text('utf-8'))
def save(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def main():
    chars=read(BASE/'characters.json');byid={c['id']:c for c in chars['characters']};rules=read(BASE/'rule_chr_mapping.json');byrule={r['rule_key']:r for r in rules};log=[]
    additions={
      'CHR_02':['TRIANGULAR','COMPACT','CENTRALLY_THICKENED','BICONVEX','ANGULAR_PERIPHERY','RADIALLY_ORNAMENTED','GRANULAR_SURFACE'],
      'CHR_05':['MILIOLINE_OTHER'],
      'CHR_07':['STRAIGHT_OR_GENTLY_CURVED_AXIS','RADIAL_BRANCHING','IRREGULAR_TANGLED_BRANCHING','DISTINCT_SPIRAL_UMBILICAL_SIDES'],
      'CHR_08':['COMPLETELY_EMBRACING'],
      'CHR_10':['PERIPHERALLY_DIFFERENTIATED'],
      'CHR_11':['ANNULAR_STOLONS','RADIALLY_ELONGATE_ZONES'],
      'CHR_12':['PERIEMBRYONIC_COMPLEX'],
      'CHR_13':['LONGITUDINAL_CONTINUOUS','LOW_LONGITUDINAL'],
      'CHR_14':['NON_ALTERNATING_PATTERN'],
      'CHR_16':['MODIFIED_NECK','DENDRITIC'],
      'CHR_18':['STRONG_CONNECTED_SEPTAL_CANALS']}
    renamed={'CHR_02':'Test form and external architecture','CHR_07':'Spatial organization of coiling or branches','CHR_08':'Involution and chamber embracement','CHR_11':'Secondary chamberlets and connectivity','CHR_14':'Pillars and their arrangement','CHR_18':'Septal filaments and canal architecture'}
    for cid,values in additions.items():
        c=byid[cid]
        for value in values:
            if value not in c['values']:c['values'].append(value)
            c.setdefault('value_labels_en',{})[value]=value.replace('_',' ').lower()
        if cid in renamed:c['name_en']=renamed[cid]
        log.append({'kind':'controlled_vocabulary_extension','character':cid,'values':values,'basis':'Explicit qualifiers in existing rule-card text; no panel predictions or reference labels used.'})
    diagnostic={
      'Bathysiphon_D1':('CHR_07','STRAIGHT_OR_GENTLY_CURVED_AXIS'),
      'Rhabdammina_D2':('CHR_07','RADIAL_BRANCHING'),
      'Rhizammina_D1':('CHR_07','IRREGULAR_TANGLED_BRANCHING'),
      'Reticulophragmium_D1':('CHR_13','RETICULATE'),
      'Trochammina_D3':('CHR_02','OVOID'),
      'Trochammina_D2':('CHR_07','DISTINCT_SPIRAL_UMBILICAL_SIDES'),
      'Textularia_D2':('CHR_09','NONE'),
      'Dictyoconus_D2':('CHR_13','RADIAL'),
      'Triloculina_D2':('CHR_02','TRIANGULAR'),
      'Pyrgoina_D1':('CHR_16','MODIFIED_NECK'),
      'Peneroplis_D2':('CHR_09','NONE'),
      'Dendritina_D1':('CHR_16','DENDRITIC'),
      'Fabularia_D1':('CHR_08','COMPLETELY_EMBRACING'),
      'Pseudolacazina_D2':('CHR_13','LONGITUDINAL_CONTINUOUS'),
      'Pseudolacazina_D1':('CHR_14','NON_ALTERNATING_PATTERN'),
      'Lacazinella_D2':('CHR_13','LOW_LONGITUDINAL'),
      'Periloculina_D1':('CHR_12','PERIEMBRYONIC_COMPLEX'),
      'Idalina_D1':('CHR_02','COMPACT'),
      'Laffitteina_D2':('CHR_02','CENTRALLY_THICKENED'),
      'Rotalia_D1':('CHR_02','BICONVEX'),
      'Pararotalia_D1':('CHR_02','ANGULAR_PERIPHERY'),
      'Cuvillierina_D1':('CHR_10','PERIPHERALLY_DIFFERENTIATED'),
      'Ornatorotalia_D1':('CHR_02','RADIALLY_ORNAMENTED'),
      'Granorotalia_D1':('CHR_02','GRANULAR_SURFACE'),
      'Discocyclina_D1':('CHR_11','ANNULAR_STOLONS'),
      'Chordoperculinoides_D4':('CHR_18','STRONG_CONNECTED_SEPTAL_CANALS')}
    # Inflated chambers are not equivalent to an ovoid whole test. Keep this
    # description unscored pending an explicit chamber-shape vocabulary.
    diagnostic.pop('Trochammina_D3')
    for key,(cid,value) in diagnostic.items():
        r=byrule[key];r['mappings']=[{'chr_id':cid,'value':value,'confidence':'MEDIUM'}];r['status']='MEDIUM'
        r['curation']={'date':'2026-11-12','basis':'Existing rule text, newly represented qualifier','independent_expert_validated':False}
        log.append({'kind':'diagnostic_mapping','rule_key':key,'mapping':r['mappings'],'source_text':r['text']})
    def mapping(key,cid,values,mode=None):
        r=byrule[key];r['mappings']=[{'chr_id':cid,'value':v,'confidence':'MEDIUM'} for v in values];r['status']='MEDIUM'
        r['curation']={'date':'2026-11-12','basis':'Existing explicit rule statement; broaden only its stated alternatives','independent_expert_validated':False}
        if mode:r['match_mode']=mode
        log.append({'kind':'mandatory_mapping','rule_key':key,'mapping':r['mappings'],'source_text':r['text']})
    for key in ['Rzehakina_M3','Gaudryina_M3','Clavulina_M3']:mapping(key,'CHR_03',['PRESENT'])
    mapping('Quinqueloculina_M3','CHR_11',['ABSENT'])
    for key in ['Asterocyclina_M4','Discocyclina_M5','Orbitoclypeus_M4']:mapping(key,'CHR_15',['PRESENT'])
    mapping('Dictyoconus_M4','CHR_10',['SUBDIVIDED','RETICULATE','LABYRINTHIC','COMPLEX'])
    mapping('Miliola_M3','CHR_05',['QUINQUELOCULINE','TRILOCULINE','BILOCULINE','MILIOLINE_OTHER'])
    mapping('Nummulitoides_M5','CHR_02',['DISCOIDAL','FLATTENED','LENTICULAR'])
    r=byrule['Pseudolacazina_M4'];r['match_mode']='ANY';r['mappings']=[{'chr_id':c,'value':v,'confidence':'MEDIUM'} for c,v in [('CHR_13','LONGITUDINAL_CONTINUOUS'),('CHR_13','VERTICAL'),('CHR_14','PRESENT')]];r['status']='MEDIUM'
    # Avoid counting the same longitudinal feature as both M and D: the detailed
    # D2 stays a hint while M4 now expresses the actual partitions-or-pillars.
    byrule['Pseudolacazina_D2']['mappings']=[]
    c=byrule['Vertebralina_C2'];c['mappings']=[{'chr_id':cid,'value':value,'confidence':'MEDIUM'} for cid,value in [('CHR_06','PLANISPIRAL'),('CHR_09','NONE')]];c['match_mode']='ALL_OBSERVED'
    for genus,code,text,cid,value,url in [
      ('Miliola','D1','Cribrate trematophore at the aperture','CHR_16','CRIBRATE','https://forams.treatise.geolex.org/displayInfo.php?genera=Miliola'),
      ('Asterocyclina','D3','Equatorial chambers form radially elongated zones','CHR_11','RADIALLY_ELONGATE_ZONES','https://forams.treatise.geolex.org/displayInfo.php?genera=Asterocyclina')]:
        r={'rule_key':genus+'_'+code,'genus':genus,'module':'PORCELANEOUS' if genus=='Miliola' else 'HYALINE','level':'D','code':code,'text':text,
          'mappings':[{'chr_id':cid,'value':value,'confidence':'HIGH'}],'status':'HIGH',
          'curation':{'date':'2026-11-12','basis':'Treatise on Invertebrate Paleontology, Part C, digital diagnosis','source_url':url,'independent_expert_validated':False}}
        rules.append(r);log.append({'kind':'source_supported_new_rule','rule':r})
    # Keep the human-readable rule cards synchronized with the atomic master.
    for module in ['agglutinated','porcelaneous','hyaline']:
        card=read(BASE/f'genera_{module}.json')
        for g in card['genera']:
            g['rules']={level:[{'code':r['code'],'text':r['text'],**({'match_mode':r['match_mode']} if r.get('match_mode') else {})} for r in rules if r['genus']==g['genus'] and r['level']==level] for level in ['M','D','S','C']}
        save(ROOT/f'api/data/genera_{module}.json',card)
    log.append({'kind':'disjunctive_rule','rule_key':r['rule_key'],'mode':'ANY','semantics':'MATCH if any alternative holds; MISMATCH only if all alternatives are observed and fail; otherwise NEUTRAL.'})
    save(ROOT/'api/data/characters.json',chars);save(ROOT/'api/data/rule_chr_mapping.json',rules)
    repeated={'AGG_Q4F','AGG_Q5A','AGG_Q5E','AGG_Q5F','AGG_Q6B','PORC_Q4A3','PORC_Q4B3','PORC_Q4BF','HYA_Q4A','HYA_Q6BT','HYA_Q7B'}
    for module in ['agglutinated','porcelaneous','hyaline']:
        tree=read(BASE/f'decision_tree_{module}.json');nodes={n['id']:n for n in tree['nodes']}
        for nid in repeated.intersection(nodes):
            n=nodes[nid];prior=n.pop('chr_id',None);n['type']='routing';n['routing_only']=True;n['refines_character']=prior
            for answer in n['answers']:answer.pop('maps_to',None)
            log.append({'kind':'routing_refinement','node':nid,'former_character':prior,'reason':'Refinement concerns a different qualifier; preserve the earlier scalar observation. No evidence inferred from routing or leaf identity.'})
        for nid in ['AGG_Q3E','HYA_Q1','PORC_Q3']:
            if nid not in nodes:continue
            n=nodes[nid];former=n.pop('chr_id');n['type']='routing';n['routing_only']=True
            for a in n['answers']:
                v=a['value'];m=a.pop('maps_to',None) or {}
                if nid=='AGG_Q3E':
                    m={('CHR_06' if v in ['PLANISPIRAL','STREPTOSPIRAL','TROCHOSPIRAL'] else 'CHR_05'):v} if v in ['PLANISPIRAL','STREPTOSPIRAL','TROCHOSPIRAL','UNISERIAL','BISERIAL','TRISERIAL'] else {}
                elif nid=='HYA_Q1':m={'CHR_05':'ANNULAR'} if v=='ANNULAR_CYCLIC' else {'CHR_06':v}
                else:
                    m={'CHR_05':v} if v!='CYCLIC' else {}
                    if v=='OTHER':a['value']='MILIOLINE_OTHER';m={'CHR_05':'MILIOLINE_OTHER'}
                if m:a['maps_to']=m
            log.append({'kind':'heterogeneous_routing','node':nid,'former_character':former,'reason':'Per-answer bindings distinguish serial arrangement, coiling and non-scoring context.'})
        if module=='porcelaneous':
            n=nodes['PORC_Q3F'];n['text_en']='Does initially planispiral growth persist, or become uniserial?'
            for a in n['answers']:
                if a['value']=='COILED_TO_SERIAL':a['value']='PLANISPIRAL_TO_UNISERIAL'
        if module=='agglutinated':
            n=nodes['AGG_Q4F'];n['type']='question';n.pop('routing_only',None);n.pop('refines_character',None);n['chr_id']='CHR_09'
            n['text_en']='Does septate streptospiral growth remain coiled, or pass into a serial adult stage?'
            n['answers']=[{'value':'NONE','label_en':'Remains coiled','next':'GENUS:Recurvoides'},
                          {'value':'COILED_TO_SERIAL','label_en':'Serial adult stage','next':'GENUS:Karrerulina'}]
            log.append({'kind':'reroute','node':'AGG_Q4F','reason':'The septate branch cannot lead to unseptate Glomospira. Observe ontogeny instead; Glomospira remains on its unseptate branch.'})
        if module=='hyaline':
            n=nodes['HYA_Q3B'];n['text_en']='How developed is the marginal cord / peripheral canal system?'
            n['answers']=[{'value':'ABSENT','label_en':'Absent','next':'GENUS:Lenticulina'},
              {'value':'STRONG','label_en':'Exceptionally thick or massive','next':'GENUS:Chordoperculinoides'},
              {'value':'WEAK','label_en':'Present, not massive','next':'HYA_Q5A'}]
            tree['nodes']=[x for x in tree['nodes'] if x['id']!='HYA_Q4A']
            log.append({'kind':'collapse_repeated_question','node':'HYA_Q4A','into':'HYA_Q3B','reason':'Ask marginal-cord development once, preserving explicit strength.'})
            nodes['HYA_Q8A']['text_en']='Do the spiral laminae mainly clasp the preceding marginal cord, leaving earlier whorls exposed?'
            nodes['HYA_Q8A']['answers'][1]['next']='INDETERMINATE:SEMI_INVOLUTE_NUMMULITID'
            next(a for a in nodes['HYA_Q7A']['answers'] if a['value']=='ABSENT')['next']='HYA_Q8INV'
            tree['nodes'].append({'id':'HYA_Q8INV','type':'routing','routing_only':True,'code':'8INV',
              'text_en':'Is the involute test compact/subglobular with tight coiling rather than typically lenticular?',
              'text_tr':'Involut kavki sik sarilimli ve kompakt/subglobular mi?',
              'answers':[{'value':'COMPACT_SUBGLOBULAR','label_en':'Compact/subglobular','next':'GENUS:Palaeonummulites'},
                         {'value':'LENTICULAR','label_en':'Typically lenticular','next':'GENUS:Nummulites'}]})
            log.append({'kind':'reroute','genus':'Palaeonummulites','reason':'Move the involute genus to the observed INVOLUTE branch; do not overwrite a semi-involute observation using the leaf label.'})
        save(ROOT/f'api/data/decision_tree_{module}.json',tree)
    missing=sorted({r['genus'] for r in rules if not any(x['genus']==r['genus'] and x['level']=='D' and any(m.get('value') for m in x['mappings']) for x in rules)})
    save(OUT/'vocabulary_tree_repairs.json',{'basis':'v31 masters; no external expert approval or test-label optimization','changes':log,'genera_without_scored_D':missing,
      'remaining_requirement':'Do not invent an observable diagnostic from vague or duplicated text; remaining genera require precise anatomical source definitions or additional independent character facets.'})
    print(json.dumps({'changes':len(log),'remaining_unscored_D':missing}))

if __name__=='__main__':main()
