"""Reproducible text-to-vocabulary repairs. No image labels are used for curation.

Unexpressible qualifiers remain non-scoring; this is not expert validation.
The immutable starting point is archive/pre_audit_20261111.
"""
from pathlib import Path
import json, copy, hashlib

REPO = Path(__file__).resolve().parents[1]
DATA = REPO / 'api/data'
SNAP = REPO / 'eval/archive/pre_audit_20261111'
OUT = REPO / 'eval/results/revision'

def main():
    original = json.loads((SNAP/'rule_chr_mapping.json').read_text('utf-8'))
    rules = copy.deepcopy(original)
    by_id = {r['rule_key']: r for r in rules}
    changes = []

    def set_pairs(key, pairs, reason, provenance='Existing rule text'):
        r = by_id[key]
        before = copy.deepcopy(r['mappings'])
        r['mappings'] = [dict(chr_id=c, value=v, confidence='HIGH') for c,v in pairs]
        if before != r['mappings']:
            r['curation'] = {'date':'2026-11-11', 'basis':provenance, 'reason':reason,
                             'independent_expert_validated':False}
            changes.append(dict(rule_key=key, before=before, after=r['mappings'], reason=reason, basis=provenance))

    # A qualifier about branching/architecture cannot be reduced to a positive
    # generic tube, chamberlet, pillar or early coiling state.
    for key in ['Rhabdammina_C1','Rhizammina_C1','Alveolina_C4','Glomalveolina_C1',
                'Pseudolacazina_C1','Alveolina_D3','Pseudolacazina_D1']:
        set_pairs(key, [], 'Qualifier is not represented in the controlled vocabulary; retain text as a non-scoring observation hint.')
    transitions = {
      'Ammobaculites_C1':'NONE','Ammobaculites_C2':'PLANISPIRAL_TO_BISERIAL',
      'Textularia_C1':'TRISERIAL_TO_BISERIAL','Spiroplectammina_C2':'PLANISPIRAL_TO_UNISERIAL',
      'Clavulina_C2':'BISERIAL_TO_UNISERIAL','Articulina_C1':'NONE',
      'Spirolina_C1':'NONE','Coscinospira_C2':'NONE'}
    for key,value in transitions.items():
        set_pairs(key,[('CHR_09',value)],'Encode the ontogenetic transition (or explicit lack of change), not a shared early/adult component.')
    set_pairs('Nubecularia_C1',[('CHR_06','PLANISPIRAL'),('CHR_19','FREE')], 'Remove shared tubular shape; retain the stated free, planispiral architecture.')
    for key in ['Periloculina_C1','Idalina_C2']:
        set_pairs(key,[('CHR_10','SIMPLE')], 'Simple chamber interiors are internal complexity, not the absence of true chambers or a shared milioline arrangement.')
    set_pairs('Palaeonummulites_S3',[], 'Relative cord thickness cannot be encoded as STRONG, which this genus explicitly contradicts.')
    set_pairs('Saccammina_M3',[('CHR_02','GLOBULAR'),('CHR_02','SAC_LIKE')], 'Both alternatives are explicitly stated in the mandatory rule.')
    set_pairs('Saccammina_D2',[('CHR_06','UNCOILED')], 'No tubular coiling: uncoiled state, without inventing a chamber type.')
    for key,vals in [('Reticulophragmium_M4',['SUBDIVIDED','LABYRINTHIC']),
                     ('Dictyoconus_M4',['SUBDIVIDED','RETICULATE'])]:
        set_pairs(key,[('CHR_10',v) for v in vals], 'Accept the explicitly described specialized subdivision as an alternative to its generic subdivision state.')
    set_pairs('Barattolites_M2',[('CHR_02','CONICAL'),('CHR_02','HIGH_CONICAL')], 'High-conical is included in the conical mandatory description and explicitly described by D1.')
    set_pairs('Coskinolina_D1',[], 'Marginal chamber lumen is not the whole test cavity; undivided marginal space does not mean an unchambered organism.')
    set_pairs('Coskinolina_D2',[('CHR_13','ABSENT')], 'Map explicitly absent marginal exoskeletal partitions; do not infer absence of true septa.')
    set_pairs('Spirolina_M3',[('CHR_09','PLANISPIRAL_TO_UNISERIAL')], 'Represent early coiling plus uniserial adult ontogeny in the existing transition character.')
    set_pairs('Coscinospira_M3',[('CHR_09','PLANISPIRAL_TO_UNISERIAL')], 'Represent the early-to-adult change instead of requiring incompatible coiling states simultaneously.')
    set_pairs('Coscinospira_M4',[('CHR_05','UNISERIAL')], 'Adult serial arrangement; early coiling is represented separately in CHR_09.')
    set_pairs('Pseudolacazina_M4',[], 'Partitions and/or pillars is an OR across different characters; the current mapping evaluator implements AND across characters. Retain an explicit non-scoring hint.')
    set_pairs('Asterocyclina_M2',[('CHR_02','DISCOIDAL'),('CHR_02','STELLATE')], 'Allow the explicitly described stellate outline of the flattened test.')

    # Existing texts that can actually be mapped without new anatomical states.
    set_pairs('Hauerina_D2',[('CHR_16','MULTIPLE')], 'Multiple apertural openings is an existing, literal controlled state.')
    for key,val in [('Orbitoclypeus_D3','COMPLEX'),('Nemkovella_D3','SIMPLE')]:
        set_pairs(key,[('CHR_12',val)], 'Use the explicit embryonic-apparatus answer in the existing HYA_Q5C tree; development-set alignment, not independent taxonomic verification.', 'Existing HYA_Q5C answer + generic D3 rule')

    # One exact observation must not receive repeated D/S evidence. Mandatory
    # facts take precedence; a compound D rule keeps its nonredundant mappings.
    implies = {('CHR_11','WELL_DEVELOPED'):{('CHR_11','PRESENT')},('CHR_11','WEAKLY_DEVELOPED'):{('CHR_11','PRESENT')},
               ('CHR_14','STRONG'):{('CHR_14','PRESENT')},('CHR_14','WEAK'):{('CHR_14','PRESENT')},
               ('CHR_15','WELL_DEVELOPED'):{('CHR_15','PRESENT')},('CHR_15','WEAKLY_DEVELOPED'):{('CHR_15','PRESENT')},
               ('CHR_17','STRONG'):{('CHR_17','PRESENT')},('CHR_17','WEAK'):{('CHR_17','PRESENT')}}
    genera = {}
    for r in rules: genera.setdefault(r['genus'],[]).append(r)
    for genus,rs in genera.items():
        mandatory = {(m['chr_id'],m['value']) for r in rs if r['level']=='M' for m in r['mappings'] if m.get('value')}
        used = set()
        for r in sorted(rs,key=lambda x: {'D':0,'S':1}.get(x['level'],2)):
            if r['level'] not in 'DS':continue
            keep=[]
            for m in r['mappings']:
                p=(m['chr_id'],m['value'])
                if not m.get('value'):continue
                if p in used or (r['level']=='D' and (p in mandatory or implies.get(p,set()) & mandatory)):
                    continue
                keep.append(p);used.add(p)
            old=[(m['chr_id'],m['value']) for m in r['mappings'] if m.get('value')]
            if keep!=old:
                set_pairs(r['rule_key'],keep,'Remove repeated positive evidence; preserve the original detailed description as an unscored hint when the vocabulary cannot express its extra qualifier.')
    # Fill a previously unscored literal internal-simple statement, not a label-
    # inferred diagnostic guess.
    set_pairs('Haplophragmoides_D1',[('CHR_10','SIMPLE')], 'Literal chambers internally simple, already in the controlled vocabulary.')
    # The profile-constraint audit also exposes D-D scope conflicts, outside
    # audit.py's original M-D screen. Repair using the statements, not accuracy.
    set_pairs('Caudammina_D2',[], 'Tubular inter-chamber connections are not whole-test shape; the vocabulary has no connection-shape character.')
    set_pairs('Ammobaculites_D1',[('CHR_09','PLANISPIRAL_TO_UNISERIAL')], 'The jointly stated early planispiral and adult uniserial ontogeny is represented by the existing transition state, rather than simultaneous incompatible coiling values.')
    OUT.mkdir(parents=True,exist_ok=True)
    (DATA/'rule_chr_mapping.json').write_text(json.dumps(rules,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')
    # Genus cards retain all original evidence levels/texts. Synchronize provenance
    # and mapping availability with the scoring master instead of inventing text.
    for p in DATA.glob('genera_*.json'):
        j=json.loads((SNAP/p.name).read_text('utf-8'))
        for g in j['genera']:
            g['mapping_curation']={'date':'2026-11-11','scoring_rules':sum(any(m.get('value') for m in r['mappings']) for r in genera[g['genus']]),
                'has_scoring_diagnostic':any(r['level']=='D' and any(m.get('value') for m in r['mappings']) for r in genera[g['genus']]),
                'independent_expert_validated':False,
                'mapping_master':'rule_chr_mapping.json'}
        p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    missing_original=[g for g,rs in genera.items() if not any(r['level']=='D' and any(m.get('value') for m in r['mappings']) for r in original if r['genus']==g)]
    diagnostic_status=[]
    for g in missing_original:
        mapped=[r['rule_key'] for r in genera[g] if r['level']=='D' and any(m.get('value') for m in r['mappings'])]
        diagnostic_status.append({'genus':g,'mapped_D_rules':mapped,'status':'mapped_from_existing_definition' if mapped else 'requires_vocabulary_extension_or_taxonomic_curation',
          'reason':'No unique anatomical state may be invented to force a diagnostic hit; shared generic architecture is not a substitute for branching, wall texture, ornament, chamberlet subtype or apertural subtype.' if not mapped else 'Literal existing vocabulary / explicit development-tree state; not an expert-validated diagnosis.'})
    report={'starting_mapping_sha256':hashlib.sha256((SNAP/'rule_chr_mapping.json').read_bytes()).hexdigest(),
      'result_mapping_sha256':hashlib.sha256((DATA/'rule_chr_mapping.json').read_bytes()).hexdigest(),
      'rules':len(rules),'changes':changes,'original_18_without_diagnostic':diagnostic_status,
      'scope':'Encoding repairs only. No VLM labels, path accuracy, or Monte Carlo outcomes used to choose repairs. Rule-card text/evidence levels unchanged. Unrepresentable anatomy is explicitly retained as hints.'}
    (OUT/'audit_repairs.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'mapping_edits':len(changes),'original_18_now_mapped':sum(bool(x['mapped_D_rules']) for x in diagnostic_status),'rules':len(rules)}))

if __name__=='__main__': main()
