"""Small literature-derived development benchmark; never human-verified forms.

Statements absent from a selected description remain unknown. Descriptions of
different species are never substituted to fill an unavailable target profile.
"""
from evaluation_common import *
from datetime import datetime,timezone

RG='https://www.researchgate.net/publication/250084944_Late_Paleocene_Orthophragminae_Foraminifera_from_the_Haymana-Polatli_Basin_central_Turkey_and_description_of_a_new_taxon_Orbitoclypeus_haymanaensis'
SOURCES={
 'Karsella':{'url':'https://doi.org/10.35463/j.apr.2021.01.04','file':'Schlagintweit2021_Karsella.pdf','anchor':'p. 46, redescription and conclusions','kind':'PUBLISHED_REVISION_NOT_ORIGINAL_1997','note':'K. hottingeri is treated as a junior synonym of K. daviesi in this revision. Karsella is outside the 75-genus core.'},
 'Pseudolacazina':{'url':'https://dergipark.org.tr/en/pub/bulletinofmre/article/52243','file':'Sirel1986_Pseudolacazina.pdf','anchor':'p. 124, diagnosis; form A','kind':'PUBLISHED_REDESCRIPTION','note':'Original 1981 name revised in 1986. Do not combine form-A and form-B arrangement states.'},
 'Alveolina':{'url':'https://www.jmo.org.tr/resimler/ekler/9de10adbaa1b2ee_ek.pdf','file':'Sirel1976_Alveolina.pdf','anchor':'pp. 21-22, A. haymanaensis diagnosis and macrospheric form, plates II-III','kind':'ORIGINAL_DESCRIPTION'},
 'Discocyclina':{'url':'https://doi.org/10.1344/GeologicaActa2020.18.8','file':'SerraKiel2020_Pyrenean.pdf','anchor':'p. 53, D. seunesi; Fig. 27 A-B','kind':'PUBLISHED_REDESCRIPTION'},
 'Laffitteina':{'url':'https://dergipark.org.tr/en/pub/bulletinofmre/article/52316','file':'Sirel1994_Laffitteina.pdf','anchor':'pp. 47-48, systematic description, plates I-II','kind':'PUBLISHED_REDESCRIPTION'},
 'Orbitoclypeus':{'url':RG,'doi':'10.2113/47.4.339','anchor':'pp. 344-345, O. haymanaensis diagnosis and description; holotype KAR.8-9','kind':'ORIGINAL_DESCRIPTION','note':'Original paper read through publicly indexed author-uploaded full text; direct PDF access returned 403, no access restriction bypassed.'},
 'Ranikothalia':{'url':'https://doi.org/10.1344/GeologicaActa2020.18.8','file':'SerraKiel2020_Pyrenean.pdf','anchor':'p. 53, remarks and Fig. 26 N-Q; compare Sirel and Deveciler 2018 p. 25','kind':'REFERENCE_CONFLICT_UNRESOLVED','note':'The p.53 morphological description belongs to R. soldadensis; R. sindensis appears in comparisons. Turkish 1998 R. sindensis material is reassigned to R. polatliensis in 2018. Neither description can be silently used as the requested R. sindensis type profile.'}}

def specifications():
    # Atomic paraphrases of the cited descriptions, not extracted rule cards.
    return [
      ('Karsella hottingeri','Karsella',{
        'CHR_01':('AGGLUTINATED','Wall described as agglutinated.'),'CHR_02':('HIGH_CONICAL','Tall conical form in redescription.'),
        'CHR_04':('MULTICHAMBERED','Serial chambers explicitly counted.'),'CHR_05':('UNISERIAL','Neanic chambers form a single series.'),
        'CHR_10':('COMPLEX','Several orders of internal skeletal divisions.'),'CHR_11':('PRESENT','Numerous internal compartments described.'),
        'CHR_12':('COMPLEX','Partitioned deuteroconch and periembryonic chambers.'),'CHR_13':('VERTICAL','Vertical septula described in sections.') }),
      ('Pseudolacazina oeztemueri','Pseudolacazina',{
        'CHR_01':('PORCELANEOUS','Imperforate porcelaneous wall specified.'),'CHR_02':('OVOID','Ovoid test stated.'),
        'CHR_04':('MULTICHAMBERED','Successive chamber cycles specified.'),'CHR_05':('BILOCULINE','Use the explicitly biloculine adult of form A.'),
        'CHR_10':('SUBDIVIDED','Chamber cavities divided by septula.'),'CHR_11':('PRESENT','Parallel tooth-like chamberlets described.'),
        'CHR_13':('LONGITUDINAL_CONTINUOUS','Continuous rows of septula described.'),'CHR_16':('CRIBRATE','Trematophore aperture normalized to cribrate.') }),
      ('Alveolina haymanaensis','Alveolina',{
        'CHR_02':('OVOID','Oval external outline in diagnosis.'),'CHR_10':('SUBDIVIDED','Multiple chamberlets explicitly described.'),
        'CHR_11':('PRESENT','Chamberlet cross-sections documented.'),'CHR_20':('MEGALOSPHERIC_FORM','Selected macrospheric description only.') }),
      ('Discocyclina seunesi','Discocyclina',{
        'CHR_01':('HYALINE','Lamellar perforate test stated.'),'CHR_02':('LENTICULAR','Lenticular morphology explicitly stated.'),
        'CHR_05':('ANNULAR','Thirty to thirty-five annuli described.'),'CHR_11':('PRESENT','Equatorial chamberlets described.'),
        'CHR_12':('BILOCULAR','Protoconch and deuteroconch named as the embryo.') }),
      ('Laffitteina erki','Laffitteina',{
        'CHR_01':('HYALINE','Perforate calcareous hyaline wall stated.'),'CHR_03':('PRESENT','Double septa described.'),
        'CHR_04':('MULTICHAMBERED','Thirty-five chambers counted in a whorl.'),'CHR_06':('TROCHOSPIRAL','High trochospiral test specified.'),
        'CHR_14':('PRESENT','Umbilical pillars explicitly present.'),'CHR_16':('INTERIOMARGINAL','Interiomarginal slit aperture stated.') }),
      ('Orbitoclypeus haymanaensis','Orbitoclypeus',{
        'CHR_02':('LENTICULAR','Inflated lenticular form described.'),'CHR_05':('ANNULAR','Equatorial chamberlets arranged in annuli.'),
        'CHR_11':('PRESENT','Equatorial chamberlets explicitly described.'),'CHR_12':('BILOCULAR','Two embryonic chambers are specified.'),
        'CHR_14':('PRESENT','Central pillars explicitly described.'),'CHR_15':('PRESENT','Lateral chamberlets surround the pillars.') }),
      ('Ranikothalia sindensis','Ranikothalia',{})]

def main():
    chars=read(ROOT/'api/data/characters.json')['characters'];core={r['genus']:r['module'] for r in read(ROOT/'api/data/rule_chr_mapping.json')};profiles=[]
    for i,(species,genus,values) in enumerate(specifications(),1):
        source=dict(SOURCES[genus]);p=OUT/'sources'/source.get('file','UNAVAILABLE')
        if p.exists():source['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
        obs={c['id']:{'value':None,'state':'NOT_OBSERVABLE','reason':'Not stated unambiguously in selected description; this is textual missingness, not an image visibility assessment.'} for c in chars}
        for cid,(value,reason) in values.items():
            assert value in next(c for c in chars if c['id']==cid)['values'];obs[cid]={'value':value,'state':'PRESENT','reason':reason}
        o=obs['CHR_01'];module=o['value'] if o['state']=='PRESENT' else None
        profiles.append({'case_id':f'LIT_{i:02}','dataset':'literature_descriptions','reference_species':species,'reference_genus':genus,
          'reference_module':core.get(genus),'module':module,'cohort':'Written-description development probes','status':'REFERENCE_CONFLICT_NOT_SCORED' if not values else 'LITERATURE_EXTRACTED_NOT_EXPERT_VERIFIED',
          'source':source,'observations':obs,'in_core':genus in core})
    input_path=OUT/'literature_profiles.json';input_text=json.dumps(profiles,ensure_ascii=False,indent=2)+'\n'
    if input_path.exists():assert input_path.read_text('utf-8')==input_text,'Do not tune frozen literature profiles after seeing ranks'
    else:input_path.write_text(input_text,encoding='utf-8')
    lock={'input_sha256':hashlib.sha256(input_path.read_bytes()).hexdigest(),'input_hashes':input_hashes(),
      'scope':'Internal pre-score lock of source-derived development descriptions, not a public preregistration, independent specimens, or expert-reviewed forms.'}
    lock_path=OUT/'literature_input_lock.json'
    if lock_path.exists():assert read(lock_path)==lock
    else:write('literature_input_lock.json',lock)
    cases=[c for c in profiles if c['status']!='REFERENCE_CONFLICT_NOT_SCORED'];payload=[{k:c[k] for k in ['case_id','module','observations']} for c in cases]
    configs=[{'id':'A0'},{'id':'B1','baseline':'B1'}];results=engine(payload,configs);n=len(cases);all_rows=[]
    for i,cfg in enumerate(configs):
        for row,c in zip(metrics(cases,results[i*n:(i+1)*n]),cases):row.update(method=cfg['id'],in_core=c['in_core'],reference_species=c['reference_species']);all_rows.append(row)
    core_rows=[r for r in all_rows if r['in_core']];summaries={method:summary([r for r in core_rows if r['method']==method]) for method in ['A0','B1']}
    calibration=[]
    for status in ['CONFIRMED_GENUS','PROBABLE_GENUS','CANDIDATE_GENUS']:
        rows=[r for r in core_rows if r['method']=='A0' and r['status']==status]
        calibration.append({'status':status,'n':len(rows),'fractional_top1_agreement':sum(r['acc1'] for r in rows)/len(rows) if rows else None})
    write('literature_benchmark_results.json',{'scope':'Source-derived development probes only; no independently observed thin sections or EXPERT_VERIFIED forms. Missing wall composition remains neutral and is not recovered from the reference label.',
      'requested_taxa':7,'scored_profiles':len(cases),'core_profiles':sum(c['in_core'] for c in cases),'out_of_core':['Karsella'],
      'unresolved':['Ranikothalia sindensis: reference-description conflict'],'methods':summaries,'calibration_descriptive_only':calibration,'rows':all_rows,'scoring_receipts':results})
    csvwrite('literature_benchmark_rows.csv',all_rows)
    print(json.dumps({'scored_profiles':len(cases),'core_profiles':sum(c['in_core'] for c in cases),'methods':summaries,'unresolved_reference':'Ranikothalia sindensis'},indent=2))

if __name__=='__main__':main()
