"""Import genuine source images for FORM USABILITY, never invent independent specimens.

The supplied tests directory is matched by SHA-256 to the earlier published
panel manifest. Source files are read-only. Labels/provenance stay private.
"""
from pathlib import Path
import json,csv,collections,random,shutil,re
from PIL import Image
from docx import Document
from expert_comparison import ROOT,DEFAULT,read,save,digest,csvread,csvwrite,require,usability_report
from prepare_expert_study import observer_materials

SOURCE=ROOT/'client/src/assets/tests'
# Chosen by wall-type/source diversity, readable focal structure and source
# cluster separation, without consulting any algorithm score or model response.
SELECTION=['IMG_003','IMG_029','IMG_144','IMG_028','IMG_041','IMG_066','IMG_107','IMG_094','IMG_087','IMG_090']
CODES=['EXP01','EXP02'];VERIFIER='REF01'
INVITATION='''# Davet taslağı — gönderilmedi

Sayın Hocam,

GeoKnow için 21 karakterlik ince kesit gözlem formunun kullanımını pilot olarak
değerlendirmek istiyoruz. Bu hazırlık turunda daha önce yayımlanmış ve sistemin
önceki görüntü değerlendirmesinde yer almış 10 kesit görüntüsü kodlandı. Amaç,
formdaki terimlerin açıklığını, gözlem süresini ve gözlenemeyen özellikleri
belirlemektir; bu tur bağımsız tanısal doğrulama olarak sunulmayacaktır.

EXP01 ve EXP02 iki gözlemci rolünün kodlarıdır; isim ve katılım henüz atanmadı.
Referans yayın etiketleri ayrı tutulacak, REF01 rolündeki uzman tarafından
doğrulama bekleyecektir. Gözlemciler diğer formu ve motor çıktısını görmeden
bağımsız çalışacaktır. Bu konuda uygunluğunuz ve Paleosen–Eosen bentik foraminifer
ince kesit deneyiminiz hakkında bilgi verebilir misiniz?

Hazırlık sonrasında, yeni ve kaynak bağımsız 60 fiziksel fosille ayrı bir çalışma
planlanmaktadır. Süre ve katılım taahhüdü varsayılmamaktadır. Bu metin yalnız
yerel taslaktır; herhangi bir kişiye iletilmemiştir.
'''

def inside_workspace(p):
    p=p.resolve();require(p.is_relative_to(ROOT.resolve()),'File operation escapes the workspace');return p

def archive_owned_template(study,path):
    if not path.exists():return
    old=inside_workspace(path);target=inside_workspace(study/'coordinator_private/legacy_unassigned_templates'/path.relative_to(study))
    target.parent.mkdir(parents=True,exist_ok=True)
    require(not target.exists(),'A prior template archive already exists: '+str(target))
    shutil.move(str(old),str(target))

def main():
    study=DEFAULT;private=study/'coordinator_private'
    require(not list((study/'submissions').rglob('*.json')),'Do not alter a study after real observer submissions')
    require(not (private/'locks').exists(),'Do not alter sealed studies')
    require(not (private/'pilot_case_mapping.csv').exists(),'Pilot already imported; do not silently recode image cases')
    canonical=read(ROOT/'client/src/assets/scs/evaluation/panel_manifest.json')
    byhash={r['sha256']:r for r in canonical};byid={r['image_id']:r for r in canonical};inventory=[];available={}
    for p in sorted(SOURCE.rglob('*')):
        if not p.is_file() or p.suffix.lower() not in ['.png','.jpg','.jpeg','.tif','.tiff','.webp']:continue
        h=digest(p);row={'relative_source_file':p.relative_to(SOURCE).as_posix(),'sha256':h,'readable':False,'previous_panel_id':'','size':None}
        try:
            with Image.open(p) as im:
                im.verify()
            with Image.open(p) as im:row.update(readable=True,size=list(im.size),metadata_keys=sorted(im.info.keys()))
        except Exception as e:row['error']=type(e).__name__
        match=byhash.get(h)
        if row['readable'] and match:
            row['previous_panel_id']=match['image_id'];available[match['image_id']]=p
        inventory.append(row)
    require(all(s in available for s in SELECTION),'Selected source image is unavailable or unreadable')
    require(len({byid[s]['cluster'] for s in SELECTION})==10,'Avoid selecting multiple cases from one known source/section cluster')
    report={'scope':'Source inventory, not an independent human dataset','source_directory':str(SOURCE),
      'image_extension_files':len(inventory),'readable_images':sum(x['readable'] for x in inventory),
      'unreadable_files':[x['relative_source_file'] for x in inventory if not x['readable']],
      'exact_matches_to_previous_published_panels':sum(bool(x['previous_panel_id']) for x in inventory),
      'new_readable_images':sum(x['readable'] and not x['previous_panel_id'] for x in inventory),
      'filename_identity_mismatches':sum(bool(x['previous_panel_id']) and Path(x['relative_source_file']).stem!=x['previous_panel_id'] for x in inventory),
      'selection_basis':'10 cases, 3 agglutinated/3 porcelaneous/4 hyaline; 10 source clusters; source metadata and visual review only, no score-based selection.',
      'physical_specimen_independence_verified':False,'confirmatory_use_allowed':False,
      'label_join':'Exact image SHA-256 to the existing provenance manifest; never basename-to-sidecar joins.',
      'images':inventory}
    save(private/'source_image_inventory.json',report)
    save(private/'excluded_prior_panel_hashes.json',{'reason':'Previously evaluated published panels must not be relabeled as independent confirmatory material.','sha256':[r['sha256'] for r in canonical]})
    backup=private/'pre_material_assignment_20261112';backup.mkdir(exist_ok=True)
    for p in [study/'study_config.json',private/'roster.csv',private/'specimen_registry.csv']:
        shutil.copyfile(p,backup/p.name)
    config=read(study/'study_config.json');old_codes=config['observer_codes']
    config.update(observer_codes=CODES,reference_verifier_code=VERIFIER,
      status='PREPARATION_IMAGE_CASES_IMPORTED_NO_HUMAN_RESPONSES',
      pilot_purpose='FORM_USABILITY_ON_PREVIOUSLY_EVALUATED_PUBLISHED_IMAGES',pilot_independent_validation=False,
      sampling_plan='10 preparation image cases; no independent physical specimens verified. Later confirmatory target remains 60 new source-independent fossils.')
    save(study/'study_config.json',config)
    for old in old_codes:
        if old in CODES:continue
        for phase in ['pilot','confirmatory']:
            folder=study/'public'/phase/old
            blank=folder/'blank_observation_rows.csv'
            if blank.exists():require(all(not r['value'] and not r['state'] for r in csvread(blank)),'Do not move a filled observer form')
            archive_owned_template(study,folder)
            archive_owned_template(study,study/f'Observer_{old}_{phase.capitalize()}.zip')
    roster=[{'person_code':code,'role':role,'name_or_private_registry_reference':'','participation_confirmed':'','expertise_verified':'','independent_of_rule_development':'','notes':'Role code only; person and participation not confirmed.'} for code,role in [(CODES[0],'OBSERVER'),(CODES[1],'OBSERVER'),(VERIFIER,'REFERENCE_VERIFIER')]]
    csvwrite(private/'roster.csv',roster)
    registry=csvread(private/'specimen_registry.csv');mapping=[];labels=[]
    order=list(SELECTION);random.Random(20261112).shuffle(order)
    for i,original_id in enumerate(order,1):
        code=f'P{i:03}';source=available[original_id];meta=byid[original_id]
        dest=study/'public/pilot/materials'/code/'view01.png';dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source,dest)
        require(digest(dest)==meta['sha256'],'Copy changed source image')
        r=next(r for r in registry if r['phase']=='pilot' and r['specimen_id']==code)
        r.update(enrolled='yes',independence_unit_id='',bootstrap_cluster_id=meta['cluster'],source_collection='Previously published image panel; reused preparation material',
          archive_record_id=meta['source']+' / '+original_id,used_in_rule_construction='unknown',independence_verified='',
          reference_genus='',reference_module='',reference_status='',reference_verifier_code=VERIFIER,reference_evidence='',
          material_mode='digital',blinding_reviewed='',
          screening_or_exclusion_reason='Preparation only: previously evaluated published panel, not eligible for confirmatory validation.',
          notes='This code identifies a preparation image case, not a verified independent fossil. Published label is held separately; REF01 verification pending.')
        mapping.append({'pilot_code':code,'public_view':'materials/'+code+'/view01.png','source_filename':source.name,'source_sha256':meta['sha256'],
          'canonical_panel_id':original_id,'source':meta['source'],'source_cluster':meta['cluster'],'page':meta.get('page'),
          'plate':meta.get('plate'),'panel':meta.get('panel'),'width':meta['width'],'height':meta['height'],
          'focal_instruction':'Evaluate the main central structure; clipped objects at the image edge are not additional cases.',
          'physical_specimen_identity':'NOT_VERIFIED','previously_evaluated':True,'confirmatory_eligible':False})
        labels.append({'pilot_code':code,'published_reference_genus':meta['reference_genus'],'published_reference_module':meta['module'],
          'label_source':'Prior image provenance manifest bound by SHA-256','reference_status':'PUBLISHED_LABEL_NOT_YET_VERIFIED_BY_REF01',
          'reference_verifier_code':VERIFIER,'verified_reference_genus':'','verified_by_name':'','verified_at':'','notes':''})
    for r in registry:
        if r['phase']=='confirmatory':r['reference_verifier_code']=VERIFIER
    csvwrite(private/'specimen_registry.csv',registry);csvwrite(private/'pilot_case_mapping.csv',mapping);csvwrite(private/'reference_labels.csv',labels)
    save(private/'pilot_case_mapping.json',mapping)
    (private/'pilot_global_attribution_public.md').write_text('''# Attribution and scope

Preparation material includes image crops from Schlagintweit & Hadi (2018),
https://doi.org/10.5281/zenodo.13190022 ; Mattern et al. (2024),
https://doi.org/10.3390/geosciences14120352 ; and BouDagher-Fadel (2018),
https://doi.org/10.14324/111.9781911576938 . Sources are distributed under
CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ .

The earlier extraction used rectangular crops; this preparation import only
renames/copies those pixels without enhancement or resampling. Original scale
bars and panel marks remain. Per-case source coordinates and published labels
are held by the coordinator and are available after the blinded form exercise.
The citation list gives no case-to-taxon mapping. Please do not search source
figures or earlier model outputs while completing the forms. Prior familiarity
with a source image should be disclosed to the coordinator.

These are previously evaluated published images for form usability; they are
not a new independent validation cohort. Participant names and responses remain
unfilled until actual recruitment and observation.
''',encoding='utf-8')
    def replace_codes(text):
        return text.replace('E1','EXP01').replace('E2','EXP02').replace('R1','REF01')
    # Current-status addendum precedes the original prospective protocol.
    current='''# 12 Kasım 2026 — bu hazırlık turunun kapsamı

`tests` klasöründeki 149 PNG uzantılı dosyadan 148'i açılıyor ve önceki yayın
panelleriyle birebir eşleşiyor; IMG_001.png görüntü olarak açılamıyor. Dosya
adları panel kimliklerine kaydığı için tüm eşleme hash ile yapıldı.

10 görüntü P001–P010 olarak kodlandı. Bunlar önceki veri setinden gelen hazırlık
görüntü vakalarıdır; 10 bağımsız fiziksel fosil olarak doğrulanmış değildir.
Gözlemci kodları EXP01 ve EXP02, referans doğrulayıcı kodu REF01'dir. Kişi adları,
katılım teyitleri ve gözlem yanıtları boştur. Her kaynak kümesinden tek görüntü
seçildi; fiziksel fosil kimliği ayrıca doğrulanmadan bağımsızlık iddia edilmez.

Bu turda amaç form anlaşılabilirliği, süre ve gözlenemeyen özellikleri ölçmektir.
İnsan formları gelince `python eval/expert_comparison.py usability` kullanılır;
bu komut cins doğruluğu hesaplamaz. Asıl 60 örnekli bağımsız test için yeni materyal
gereklidir. Mevcut görüntüler doğrulama kohortuna alınmaz.
Eski bağımsız-çalışma komutları check/lock/analyze bu yeniden kullanılan hazırlık
görüntülerine uygulanmaz; bunlar yeni ve referansı doğrulanmış materyal için korunur.

Yayın cins etiketleri yalnız `coordinator_private/reference_labels.csv` içindedir;
REF01 tarafından doğrulanmış referanslar olarak işaretlenmedi. `pilot_case_mapping`
dosyaları eski kaynak/etiket eşlemesini içerir ve gözlemcilere verilmez. Eski JSON
model yanıtları, skorlar ve S9 sonuçları gözlemci paketlerine eklenmedi.

`Observer_EXP01_Pilot.zip` ve `Observer_EXP02_Pilot.zip` içinde 10 kodlu görüntü,
etiketsiz galeri, 21 karakterlik Word/HTML formu ve farklı sunum sıraları vardır.
Form seçilen görüntünün hash'ini örnek koduyla karşılaştırır; yanlış P klasöründen
seçilen `view01.png` kabul edilmez. Görsel kalite özgün çözünürlükle korunur;
düşük çözünürlüklü yayın kırpımları büyütülerek yeni ayrıntı üretilmedi. Basılı
panel işaretleri ve kaynağı tanıma riski nedeniyle körleme insan kontrolü bekler.

''' 
    old_protocol=replace_codes((study/'Study_Protocol_TR.md').read_text('utf-8'))
    (study/'Study_Protocol_TR.md').write_text(current+'---\n\nAşağıdaki bölüm ilerideki bağımsız çalışma için prospektif plandır; bu hazırlık görüntülerinin bağımsız olduğunu söylemez.\n\n'+old_protocol,encoding='utf-8')
    d=Document()
    for block in (study/'Study_Protocol_TR.md').read_text('utf-8').split('\n\n'):
        b=block.replace('\n',' ')
        if b.startswith('# '):d.add_heading(b[2:],0)
        elif b.startswith('## '):d.add_heading(b[3:],1)
        else:d.add_paragraph(b)
    d.save(study/'Study_Protocol_TR.docx')
    for name in ['Davet_Taslagi_TR.md','README_TR.md']:
        text=replace_codes((study/name).read_text('utf-8'))
        if name=='Davet_Taslagi_TR.md':
            (study/name).write_text(INVITATION,encoding='utf-8');continue
        if name=='README_TR.md':
            text=text.replace('**Gerçek deney henüz başlamadı.** 0 atanmış fosil, 0 teyit edilmiş gözlemci ve 0\ndoldurulmuş gerçek form vardır. P001–P010 ve F001–F060 rezerv kodlardır.',
              'P001–P010 için hazırlık görüntüleri atanmıştır; F001–F060 hâlâ rezervdir. Kişi atamaları, katılım teyitleri ve insan gözlem yanıtları boştur.')
        (study/name).write_text(current+'---\n\n'+text,encoding='utf-8')
    text=(study/'PLANNED_MANUSCRIPT_TEXT_EN.md').read_text('utf-8')
    (study/'PLANNED_MANUSCRIPT_TEXT_EN.md').write_text('Current preparation status: ten previously evaluated published image panels have been coded for form usability only. No human forms have been completed and no independent specimen validation has been conducted. The planned 60-specimen comparison below still requires new independent material.\n\n'+text,encoding='utf-8')
    observer_materials(study,read(study/'frozen_v29/api/data/characters.json')['characters'])
    for phase in ['pilot','confirmatory']:
        for observer in CODES:(study/'submissions'/phase/observer).mkdir(parents=True,exist_ok=True)
    status=read(study/'PREPARATION_STATUS.json');status.update(status='PREPARATION_PILOT_IMAGES_IMPORTED_ROLES_UNCONFIRMED',
      observer_codes=CODES,reference_verifier_code=VERIFIER,pilot_image_cases_prepared=10,actual_specimens_assigned=0,
      independent_physical_specimens_verified=0,confirmed_observers=0,completed_human_forms=0,human_experiment_conducted=False,
      source_inventory_summary={k:v for k,v in report.items() if k not in ['images','source_directory']},
      missing=['confirmed EXP01/EXP02 participants','REF01 reference review','human observation forms','new independent material for confirmatory validation'])
    save(study/'PREPARATION_STATUS.json',status)
    save(study/'technical_tests/current_readiness.json',usability_report(study))
    # All source image bytes must remain untouched.
    require(all(digest(SOURCE/x['relative_source_file'])==x['sha256'] for x in inventory),'Source directory images changed')
    print(json.dumps({'pilot_image_cases':10,'observer_codes':CODES,'reference_verifier':VERIFIER,
      'new_independent_specimens':0,'actual_human_forms':0,'source_images_unchanged':True,
      'readable_source_images':report['readable_images'],'prior_panel_matches':report['exact_matches_to_previous_published_panels']},indent=2))

if __name__=='__main__':main()
