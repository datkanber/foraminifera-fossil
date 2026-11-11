#!/usr/bin/env python3
"""Prepare blank, role-separated pilot/confirmatory materials. No real cases invented."""
from pathlib import Path
import argparse,csv,json,hashlib,zipfile,shutil,random
from docx import Document
from docx.shared import Pt,Cm
from docx.oxml import OxmlElement
from expert_comparison import ROOT,DEFAULT,save,csvwrite,digest,read,require

SOURCE=Path(r'C:\Users\burak\Downloads\Foraminifer_Manuscript_v29.docx')
ARCHIVE=Path(r'C:\Users\burak\Downloads\Foraminifera_v28_Final_Package.zip')
FILES=['api/src/services/scoring.js','api/data/characters.json','api/data/rule_chr_mapping.json','eval/engine_bridge.cjs']

PROTOCOL='''# V29: kör, eşleştirilmiş uzman-girdisi deneyi

Durum: HAZIRLIK. Gerçek kesit atanmadı; gözlemci katılımı ve referans doğrulaması
henüz teyit edilmedi. Formlar ve örnek kodları boş rezervasyonlardır, deney verisi değildir.
V29 kaynak dosyası değiştirilmedi. Bu belge deney tamamlanmış gibi makaleye eklenmemelidir.

## Sorumluluklar ve körleme

Koordinatör arşiv kayıtlarına erişir, fiziksel fosilleri kodlar ve özel referans
tablosunu tutar. E1/E2, Paleosen–Eosen bentik foraminifer ince kesit deneyimi
belgelenmiş, bu kural kartlarının geliştirilmesinde yer almamış iki gözlemcidir.
Katılımları ve bağımsızlıkları roster.csv içinde doğrulanır. R1/ayrı referans kurulu
arşiv kaydı + mikropaleontolojik incelemeyle cinsi doğrular; gözlemci E1 veya E2
referans doğrulayıcısı olarak kullanılamaz. Gözlemciler aynı materyali bağımsız
inceler; referans etiketi, diğer form ve iki yöntemin çıktısı formlar kilitlenene
kadar kapalıdır. S9'un tamamı gözlemcilere verilmez: sonuç ve cins bilgileri içerir.
Yalnız kendi Observer_E1/Observer_E2 paketini verin. Klasör adları erişim kontrolü
sağlamaz; özel koordinatör dosyalarının bulunduğu tam paketi gözlemcilere göndermeyin.

## Materyal ve örnek birimi

8–10 pilot fiziksel fosil P001–P010, ardından AYRI 60 doğrulama fosili F001–F060.
Her fosilin tüm görüntüleri/odak alanları aynı kodda tutulur. Aynı fosile ikinci
örnek kodu verilmez. Aynı kaya örneğine ait farklı fosiller varsa bu bağımlılık
bootstrap_cluster_id ile kaydedilir; 60 görüntü veya 120 form 60 bağımsız fosil
olduğu anlamına gelmez. Kesit arşiv numarası, kaynak koleksiyon ve kural hazırlamada
kullanılmadığına ilişkin kontrol özel kayıtta belgelenir. Bilgi tabanından türetilmiş
sentetik profiller veya eski 150 yayın paneli bu bağımsız testin yerine kullanılamaz.
Arşiv erişimi ve materyal kullanım koşulları koleksiyon sorumlusu ile netleştirilir.

Ana kapsam, sabit 75 cins içindeki bağımsız Paleosen–Eosen örnekleridir. Doğrulanmış
referansı belirsiz veya kapsam dışı örnekler kör seçime alınmadan ayrı tarama kaydına
yazılır. 60 hedefi üç duvar tipini kapsar; 20/20/20 pratik bir seçim hedefidir,
güç hesabı veya yeterli örnek sayısı garantisi değildir. Seçim ölçütleri ve bulunan
dağılım kaydedilir. Sonuçlar görüldükten sonra kötü örnekler çıkarılmaz.

Dijital materyal public/<aşama>/materials/<kod>/view01.png, view02.jpg … biçimindedir.
Görüntü isimleri, dosya metadata'sı, görüntü üzerindeki etiketler ve çevresel katalog
bilgileri cinsi açığa çıkarmamalıdır. Körlemeyi koordinatör insan incelemesiyle
onaylar; yalnız dosyayı yeniden adlandırmak yeterli değildir. Piksel üretimi,
görüntü iyileştirme veya takson işaretlerini değiştiren otomatik işlem yapılmaz.
Dosya hash'leri iki gözlemcinin aynı görüntü setini gördüğünü kontrol eder. Fiziksel
kesitte eski arşiv/takson etiketi örtülür, odak fosil iki gözlemci için aynı kalır.

## Pilot ve form

Önce nötr bir alıştırma ve ortak kullanım açıklaması; sonra gerçek pilot formları
birbirinden bağımsız doldurulur. Her karakter için değer + gözlem durumu girilir;
21 karakterin hiçbiri boş bırakılamaz. Gözlenemeyen özellik için NOT_OBSERVABLE,
görülen ama yorumlanamayan için UNCERTAIN kullanılır; bunlar her iki yöntemde nötrdür.
Bir negatif değerin güvenle gözlenmesi örneğin value=ABSENT, state=PRESENT olarak
kaydedilebilir. state=ABSENT yalnız ABSENT/NONE gibi negatif bir CV değeriyle
kullanılır; pozitif bir değere ABSENT durumu yazıp motorun onu pozitif saymasına
izin verilmez. İkili olmayan bir özellikte SIMPLE gibi uygun değer + PRESENT seçin.
Bir fosilin birden fazla görünümü çelişiyorsa tek değeri zorlamayın; uygun ontogenetik
geçişi CHR_09'da kaydedin, çözülmeyen gözlemde UNCERTAIN ve açıklama kullanın.
CHR_21 yönelim bağlamıdır ve skorlanmaz. Form cins tahmini istemez.

Canlı doldurmada HTML'nin Başla/Mola düğmeleri aktif süreyi ölçer. Kâğıtta gerçek
başlangıç/bitiş saatleri, saat dilimi ve mola hariç süre kaydedilir; sonradan veri
giriş süresi gözlem süresi yerine kullanılmaz. Pilot raporu gözlemci başına medyan
süreyi, aralığı, form eksiklerini, belirsiz terimleri ve gözlenemeyen özellikleri
inceler. Pilot sonuçları doğrulama grubuna karıştırılmaz.

Pilot sonrasında form açıklaması, kod listesi, model/kurallar, B1 tanımı, dışlama
ölçütleri ve analiz planı kesinleştirilir. Varsayılan paket V29'un arşivdeki tam
puanlayıcısını ve B1 uygulamasını hash ile sabitler; canlı sitenin güncel veritabanını
kullanmaz. Kural kodu değişirse yeni sürüm olarak kaydedilir ve V29 testi denmez.
Doğrulama öncesi protocol_finalized ve pilot_review_completed gerçek durumla işaretlenir.

## Aynı girdiler ve analiz

Her form normalizasyon/tamamlama yapılmadan hem A0 hem B1'e verilir. Modül yalnız
gözlemcinin CHR_01 yanıtından çıkarılır; referans duvar tipi modele verilmez. CHR_01
nötrse iki yöntem de 75 cinsi değerlendirir. Skorlama alt işlemi referans cinsleri
ve diğer gözlemcinin verisini almaz. B1, gözlenen herhangi bir M/D uyuşmazlığında
cinsi eler; gözlenemeyen karakteri eleme nedeni yapmaz ve kalanları eşit sırada tutar.
Bu, makaledeki özel Intkey-tarzı karşılaştırıcıdır; Intkey yazılımının kendisi değildir.

Bir formda referansın üstünde a cins, aynı puanda t cins varsa top-k kredisi
q=max(0,min(1,(k-a)/t)); referans yoksa veya sonuç INDETERMINATE/NO_MATCH ise 0.
Tekil birincilik 1, üçlü birincilik 1/3'tür. Önce iki gözlemcinin kredisi HER FOSİL
içinde ortalanır, sonra fosiller eşit ağırlıkla ortalanır. Birincil fark A0−B1
top-1 kredisidir. 60 fosil × 2 gözlemci = 120 form, fakat temel örnek sayısı 60'tır.
5000 eşleştirilmiş bootstrap yeniden örneklemesi (seed 20261112), iki gözlemci ve
iki yöntemi aynı fosil kümesi içinde tutar. Daha üst kaynak kümeleri varsa onların
sayısı ayrıca raporlanır. 95% aralık sıfırı içeriyorsa üstünlük ilan edilmez.
Pilot 8–10 örneğin aralıkları yalnız betimseldir. İki gözlemci tüm uzman nüfusuna
genellenemez. Kesirli birincil ölçüt ikili olmadığı için basit McNemar analizi uygulanmaz.

İkincil ölçütler top-3, sonuç verme oranı, kuralla referans eleme, modül nedeniyle
referansın hiç değerlendirilememesi ve ikisinin birleşimidir. Yanlış modüle yönlendirme
kuralla eleme gibi etiketlenmez ama doğrulukta hata sayılır. Sonuçlar ve örnek/form
sayısı, eksik/haricen doğrulanamayan kayıtlar ve sapmalar eksiksiz raporlanır.
Kayıp bir uzman formu öbürünün kopyasıyla, uzlaşıyla veya yapay zekâyla tamamlanmaz.

## Uygulama sırası

1. coordinator_private/roster.csv: E1, E2 ve ayrı referans doğrulayıcısını teyit edin.
2. specimen_registry.csv: 8–10 gerçek pilot seçin, enrolled=yes yapın, kaynağı,
   referansı, fiziksel birimi ve körleme kontrolünü belgeleyin. Diğer kodlar rezervdir.
3. Aynı kodlu materyali iki gözlemciye, farklı atanmış sıralarla verin.
4. Kendi HTML/Word formunu doldurtsunlar; ham JSON'ları değişmeden teslim alın.
5. receive → check → lock → analyze komutlarını kullanın. Gerçek veri yoksa kod
   analizi reddeder. Çıktı verilmeden önce formlar/referanslar/metrik kodu hash ile
   mühürlenir. Bu mühür işlem kaydıdır; dışarıda zaman damgalanmış önkayıt iddiası değildir.
6. Pilot değerlendirmesi ve protokol kilidi sonrası ayrı 60 fosille tekrarlayın.

## Kaynak ve uyarlama

Körleme ve referans standardını ayrı tarif etme ilkeleri, kullanıcının verdiği
STARD açıklamasından yöntemsel olarak uyarlanmıştır; bu bir klinik deney veya
STARD uyumluluğu iddiası değildir:
https://pmc.ncbi.nlm.nih.gov/articles/PMC5128957/
Makale tanımı: STARD 2015 guidelines for reporting diagnostic accuracy studies:
explanation and elaboration. https://doi.org/10.1136/bmjopen-2016-012799
'''

def form_doc(path,chars,observer='________'):
    d=Document();s=d.sections[0];s.top_margin=s.bottom_margin=Cm(1.4)
    d.add_heading('Blinded expert observation sheet / Kör uzman gözlem formu',0)
    d.add_paragraph('Observer / Gözlemci: '+observer+'    Specimen / Örnek: ________    Phase / Aşama: ________')
    d.add_paragraph('Start / Başlangıç (saat dilimiyle): __________   End / Bitiş: __________\nActive duration / Mola hariç süre: ______ dakika. Material: physical / digital. View codes: __________')
    d.add_paragraph('No reference genus, other observer sheet or engine output is supplied. Gözlenemiyor yok demek değildir. Choose a controlled value and an observation state for every row. CHR_21 is context only.')
    d.add_paragraph('States: PRESENT = güvenle gözlendi (negatif değer de olabilir); ABSENT = açıkça yok (yalnız negatif ABSENT/NONE koduyla); NOT_OBSERVABLE = gözlenemiyor; UNCERTAIN = emin değilim. Nötr durumlar puanlamada değiştirilmez.')
    t=d.add_table(rows=1,cols=4);t.style='Table Grid'
    for c,v in zip(t.rows[0].cells,['Character / Karakter','Allowed values / Değer kodları','Selected value + state','Comment / Not']):c.text=v
    for c in chars:
        row=t.add_row();row.cells[0].text=c['id']+'\n'+c['name_tr']+'\n'+c['name_en']
        row.cells[1].text=', '.join(v for v in c['values'] if v not in ['UNCERTAIN','NOT_OBSERVABLE','UNKNOWN'])
        row.cells[2].text='Değer: __________\nDurum: __________';row.cells[3].text=''
    for row in t.rows:
        pr=row._tr.get_or_add_trPr();pr.append(OxmlElement('w:cantSplit'))
        for cell in row.cells:
            for p in cell.paragraphs:
                for run in p.runs:run.font.size=Pt(8)
    d.add_paragraph('Beyan / Attestation: □ Referans gizliydi □ Diğer form gizliydi □ Motor çıktıları gizliydi □ Bağımsız doldurdum\nKod / İmza ve tarih: __________')
    d.add_paragraph('Pilot feedback / Anlaşılmayan terimler, gözlem güçlüğü: __________________________________________________')
    d.save(path)

def observer_materials(study,chars):
    registry=[]
    if (study/'coordinator_private/specimen_registry.csv').exists():
        with (study/'coordinator_private/specimen_registry.csv').open(encoding='utf-8-sig',newline='') as f:registry=list(csv.DictReader(f))
    template=(ROOT/'eval/expert_form_template.html').read_text('utf-8')
    for phase,prefix,count in [('pilot','P',10),('confirmatory','F',60)]:
        enrolled=[r['specimen_id'] for r in registry if r['phase']==phase and r['enrolled']=='yes']
        codes=enrolled or [f'{prefix}{i:03}' for i in range(1,count+1)]
        for offset,observer in enumerate(['E1','E2']):
            folder=study/'public'/phase/observer;folder.mkdir(parents=True,exist_ok=True)
            order=list(codes);random.Random(20261112+offset+(0 if phase=='pilot' else 100)).shuffle(order)
            text=template.replace('@@OBSERVER@@',observer).replace('@@PHASE@@',phase)
            replacements={'@@OBSERVER_JSON@@':observer,'@@PHASE_JSON@@':phase,'@@ORDER@@':order,'@@CHARACTERS@@':chars}
            for token,value in replacements.items():text=text.replace(token,json.dumps(value,ensure_ascii=False).replace('</','<\\/'))
            (folder/'Observation_Form.html').write_text(text,encoding='utf-8')
            form_doc(folder/'Observation_Form_TR_EN.docx',chars,observer)
            csvwrite(folder/'presentation_order.csv',[{'order':i+1,'specimen_id':sid,'status':'ENROLLED' if enrolled else 'RESERVED_NO_MATERIAL'} for i,sid in enumerate(order)])
            rows=[{'specimen_id':sid,'observer_code':observer,'phase':phase,'character_id':c['id'],'value':'','state':'','comment':''} for sid in order for c in chars]
            csvwrite(folder/'blank_observation_rows.csv',rows)
            (folder/'START_HERE_TR.txt').write_text('Kendi Observation_Form.html dosyanızı tarayıcıda açın; internet gerekmez. Koordinatörün seçtiği kodlu materyalle çalışın. presentation_order sırasını izleyin. Veri satırları boş şablondur; gerçek gözlem yapılmış değildir. Form tamamlanınca JSON dosyasını koordinatöre verin. Diğer gözlemciyle yanıtları veya cins tahminlerini tartışmayın. Kâğıtta doldurulursa gerçek gözlem süresini kaydedin.\n',encoding='utf-8')
            target=study/f'Observer_{observer}_{phase.capitalize()}.zip'
            with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
                for p in folder.iterdir():z.write(p,p.name)
                materials=study/'public'/phase/'materials'
                if materials.exists():
                    for sid in enrolled:
                        for p in (materials/sid).glob('*'):
                            if p.is_file():z.write(p,'materials/'+sid+'/'+p.name)

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--study',type=Path,default=DEFAULT);p.add_argument('--refresh-observer-packs',action='store_true');p.add_argument('--manuscript',type=Path,default=SOURCE);p.add_argument('--archive',type=Path,default=ARCHIVE);a=p.parse_args();study=a.study;source=a.manuscript;archive=a.archive
    if a.refresh_observer_packs:
        require(not (study/'coordinator_private/locks/confirmatory').exists(),'Do not change observer packs after confirmatory lock')
        observer_materials(study,read(study/'frozen_v29/api/data/characters.json')['characters']);print('Observer-only packs refreshed; no submissions changed.');return
    require(not (study/'study_config.json').exists(),'Study already initialized; never overwrite enrolled material or submitted forms')
    study.mkdir(parents=True,exist_ok=True);version_dir=study/'frozen_v29';files={}
    with zipfile.ZipFile(archive) as z:
        for rel in FILES:
            data=z.read('repro/repo/'+rel);target=version_dir/rel;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data);files[rel]=digest(target)
    save(version_dir/'version_lock.json',{'status':'PILOT_CANDIDATE_SNAPSHOT_NOT_A_COMPLETED_TRIAL','source_manuscript':source.name,
        'source_manuscript_sha256':digest(source),'source_archive':archive.name,'source_archive_sha256':digest(archive),
        'files':files,'matches_current_repo':{rel:(ROOT/rel).exists() and digest(ROOT/rel)==h for rel,h in files.items()},
        'A0':'Exactly archived default scoreGenera; weights +3,+5,+1,-5; tauObs=2, tauNoMatch=3, delta=1.',
        'B1':'Exactly archived engine_bridge.cjs b1; same implication closure and CV, any M/D mismatch eliminates, survivors tied, no supporting/contradictory weighting.',
        'live_service_used':False})
    chars=read(version_dir/'api/data/characters.json')['characters'];require(len(chars)==21,'Unexpected vocabulary')
    save(study/'study_config.json',{'status':'PREPARATION_ONLY_NO_REAL_OBSERVATIONS','observer_codes':['E1','E2'],'confirmatory_target':60,
       'module_target_recommendation':{'AGGLUTINATED':20,'PORCELANEOUS':20,'HYALINE':20},'seed':20261112,'bootstrap_resamples':5000,
       'primary':'Specimen-averaged paired A0-minus-B1 fractional top-1 credit','protocol_finalized':False,'pilot_review_completed':False,
       'sampling_plan':'8–10 pilot fossils; 60 different confirmatory fossils; no pilot reuse. No formal power calculation yet.'})
    blank_fields=['specimen_id','phase','enrolled','independence_unit_id','bootstrap_cluster_id','source_collection','archive_record_id',
      'used_in_rule_construction','independence_verified','reference_genus','reference_module','reference_status','reference_verifier_code',
      'reference_evidence','material_mode','blinding_reviewed','screening_or_exclusion_reason','notes']
    registry=[]
    for phase,prefix,count in [('pilot','P',10),('confirmatory','F',60)]:
        for i in range(1,count+1):
            r=dict.fromkeys(blank_fields,'');r.update(specimen_id=f'{prefix}{i:03}',phase=phase);registry.append(r)
        for observer in ['E1','E2']:(study/'submissions'/phase/observer).mkdir(parents=True,exist_ok=True)
        (study/'public'/phase/'materials').mkdir(parents=True,exist_ok=True)
    csvwrite(study/'coordinator_private/specimen_registry.csv',registry)
    roster=[{'person_code':code,'role':role,'name_or_private_registry_reference':'','participation_confirmed':'','expertise_verified':'','independent_of_rule_development':'','notes':''} for code,role in [('E1','OBSERVER'),('E2','OBSERVER'),('R1','REFERENCE_VERIFIER')]]
    csvwrite(study/'coordinator_private/roster.csv',roster)
    (study/'Study_Protocol_TR.md').write_text(PROTOCOL,encoding='utf-8')
    d=Document()
    for block in PROTOCOL.split('\n\n'):
        b=block.replace('\n',' ')
        if b.startswith('# '):d.add_heading(b[2:],0)
        elif b.startswith('## '):d.add_heading(b[3:],1)
        else:d.add_paragraph(b)
    d.save(study/'Study_Protocol_TR.docx')
    english='''Planned paired expert-input comparison (not yet conducted)

Two micropaleontologists independent of rule-card development will record the frozen 21-character observation sheet without access to reference genus labels, the other observer's sheet, or algorithm outputs. An independently documented archive/reference review will establish the genus before unblinding. Eight to ten pilot fossils will assess form usability and measured observation time. After the protocol and version are finalized, 60 different, source-independent fossils spanning all three wall-composition modules are the planning target; this target is not a formal power calculation. Multiple images of one fossil remain one specimen.

Each unmodified observation sheet will be scored by the archived V29 A0 and the paper's B1 eliminative comparator using identical inputs; module routing will use the observer's composition response, not the reference label. Neutral observation states will remain neutral. The primary endpoint will be the A0-minus-B1 difference in tie-fractional top-one agreement. The two observer credits will first be averaged within each specimen and then equally across specimens. Both observers and both methods will remain paired in 5,000 cluster-bootstrap resamples (seed 20261112). Secondary endpoints will include top-three agreement, coverage, rule-based reference exclusion and module-based reference omission. Sixty specimens generate 120 forms, not 120 independent units. Pilot observations will not be pooled with the confirmatory study. No performance estimates will be inserted until the real forms and independent references have been collected and sealed.
'''
    (study/'PLANNED_MANUSCRIPT_TEXT_EN.md').write_text(english,encoding='utf-8')
    (study/'Davet_Taslagi_TR.md').write_text('''Sayın Hocam,

Paleosen–Eosen bentik foraminiferlerin ince kesitlerde cins düzeyinde tanımlanması için hazırlanan GeoKnow motorunu, klasik eleme anahtarıyla aynı uzman gözlemleri üzerinde karşılaştırmak istiyoruz. İlk aşamada 8–10 kodlanmış, bilgi tabanının hazırlanmasında kullanılmamış fosil için 21 karakterlik formun bağımsız doldurulmasını ve anlaşılmayan terimlerin belirtilmesini rica ediyoruz. Gözlem süresini pilotta ölçeceğiz; henüz bir süre veya katılım taahhüdü varsaymıyoruz.

Referans cinsler, diğer gözlemcinin formu ve motor çıktıları form tamamlanana kadar kapalı olacaktır. Pilot sonrası kesinleşecek protokolle ayrı 60 fosillik çalışma planlanmaktadır. Bu konuda ince kesit deneyiminiz, uygunluğunuz ve kural kartlarının geliştirilmesiyle ilişkiniz hakkında bilgi verebilir misiniz?

Bu metin yalnız davet TASLAĞIDIR; kimseye gönderilmemiştir.
''',encoding='utf-8')
    (study/'Uzman_Adaylari_TR.md').write_text('''# Görüşülebilecek adaylar — katılım teyit edilmedi

Bu kişiler deneye atanmadı ve kendileriyle iletişim kurulmadı. Paleosen–Eosen bentik ince kesit deneyimi, kart geliştirmeye katılım, materyali önceden tanıma ve uygunluk ayrıca teyit edilmelidir.

- Nazire Özgen Erdem: erken Eosen çalışmasında ince kesit materyali ve büyük bentik foraminifer birlikteliği belgeleniyor. Birincil yayın: https://www.unige.ch/sphn/Publications/ArchivesSciences/AdS%202004-2015/AdS%202014%20Vol%2067%20Fasc%202/119_124_Erdem_67-2_MR.pdf . Kurumsal yayın sayfası: https://avesis.cumhuriyet.edu.tr/nozgen/dokumanlar .
- Deniz İbilioğlu: Dumlupınar Üniversitesi kurumsal sayfasında çalışma alanları uygulamalı biyostratigrafi ve mikropaleontoloji olarak listeleniyor. Özellikle Paleosen–Eosen bentik kesit uygunluğu teyit edilmeli. https://lee.dpu.edu.tr/tr/index/sayfa/11380/jeoloji-muhendisligi-anabilim-dali .

ESOGÜ arşiv koordinasyonu için bölümün resmî Genel Jeoloji sayfası: https://jeoloji.ogu.edu.tr/Sayfa/Index/12/genel-jeoloji-anabilim-dali . Makalenin yazarı/kural geliştiricisi, bağımsız gözlemci yerine koordinatör veya açıkça beyan edilen referans doğrulama rolünde değerlendirilebilir. Kaynaklar 12 Kasım 2026 tarihinde kontrol edildi; sayfalardaki eski güncelleme tarihleri nedeniyle güncel görev ve uygunluk ayrıca doğrulanmalıdır.
''',encoding='utf-8')
    observer_materials(study,chars)
    (study/'README_TR.md').write_text('''# V29 uzman karşılaştırması — hazırlık paketi

**Gerçek deney henüz başlamadı.** 0 atanmış fosil, 0 teyit edilmiş gözlemci ve 0
doldurulmuş gerçek form vardır. P001–P010 ve F001–F060 rezerv kodlardır.

Önce Study_Protocol_TR.docx dosyasını okuyun. 8–10 pilot materyal ile E1/E2 ve ayrı
referans doğrulamasını belirleyin. coordinator_private içindeki iki CSV'yi gerçek
kayıtlarla doldurun. Pilot/ana deneyde kullanılacak gerçek fosillere enrolled=yes
yazın. Dijital görüntüleri yalnız kodlu materials/<örnek>/view01.png ... adlarıyla
yerleştirin; metadata/gömülü etiket körlemesini insan incelemesiyle onaylayın.

Gözlemcilere yalnız kendi Observer_E1_Pilot.zip / Observer_E2_Pilot.zip dosyasını
verin. Bunların mevcut hâli boş hazırlık şablonudur. Materyal ve kayıtlar eklenince
paketleri yenileyin. Tam koordinatör paketi, referans tablosu, kural kartları, eski
S9 sonuçları veya analiz kodu gözlemcilere verilmez.

HTML form tarayıcıda çevrimdışı açılır, 21 seçimi, dört körleme beyanını ve gözlem
süresini kaydeder. Veri dışarı gönderilmez. Word formu kâğıt alternatifidir; kâğıtta
ölçülen gerçek süre ayrıca aktarılmalıdır. Yarım form nötr gözlemmiş gibi doldurulmaz.

Komutlar depo kökünde:

```powershell
python eval/prepare_expert_study.py --refresh-observer-packs
python eval/expert_comparison.py receive --phase pilot --file "C:\\path\\P001_E1.json"
python eval/expert_comparison.py check --phase pilot
python eval/expert_comparison.py lock --phase pilot
python eval/expert_comparison.py analyze --phase pilot
```

receive formu değiştirmeden kendi dosyasına alır; sonuç göstermez. check gerçek
materyal, uzman, 21 karakter, iki bağımsız form, referans ve körlemeyi doğrular.
lock dosyaları/hash'leri mühürler. analyze sabit V29 A0 ve B1'e aynı gözlemleri
verir; önce her fosilde iki uzmanı ortalar, sonra örnek düzeyinde karşılaştırır.
Sonuçlar results/pilot veya results/confirmatory altında üretilir. Form/referans
verisi yoksa hiçbir gerçek deney sonucu üretilmez.

Pilot sonrasında pilot_review_completed ve protocol_finalized gerçek duruma göre
işaretlenir; ayrı 60 fosil için aynı komutlarda --phase confirmatory kullanılır.
120 form, 60 temel örnektir; aynı kaya materyalinden gelen ilişkili fosillerin
bootstrap_cluster_id alanı birlikte tutulur. İki yöntemin farkı için aralık sıfırı
içeriyorsa üstünlük iddia edilmez.

frozen_v29, V29'un kullandığı yerel Final_Package arşivinden alınmıştır. Canlı
geoknow.asrlab.cloud sürümü bu deneyde sorgulanmaz. Kaynak V29 DOCX değişmedi.
PLANNED_MANUSCRIPT_TEXT_EN.md yalnız yapılacak deney metnidir; sonuç değildir.
Davet_Taslagi_TR.md ve Uzman_Adaylari_TR.md iletişim hazırlığıdır; kimseyle temas
veya katılım anlaşması yapılmış değildir. 60 hedefi bir güç hesabı değildir.
''',encoding='utf-8')
    save(study/'PREPARATION_STATUS.json',{'date':'2026-11-12','status':'PREPARATION_ONLY','actual_specimens_assigned':0,'confirmed_observers':0,'completed_human_forms':0,'pilot_slots':10,'confirmatory_planning_target':60,'human_experiment_conducted':False,'manuscript_source_unchanged':digest(source),'missing':['real independent thin-section material','two confirmed micropaleontologists','separate documented reference verification']})
    print(json.dumps({'prepared':str(study),'real_specimens':0,'real_human_forms':0,'v29_source_unchanged':digest(source)},indent=2))

if __name__=='__main__':main()
