"""Deliver pilot drafts and missing-data records, never fabricated study results."""
from expert_comparison import *
from llm_observation_drafts import STUDY
from build_llm_review_forms import main as build_forms
from verify_llm_review_delivery import verify
import zipfile,sys,re

def main():
    study=STUDY;build_forms();config=read(study/'study_config.json')
    registry=csvread(study/'coordinator_private/specimen_registry.csv');refs=csvread(study/'coordinator_private/reference_labels.csv')
    pilot=[r for r in registry if r['phase']=='pilot' and r['enrolled']=='yes'];missing=[];draft_count=0
    for r in pilot:
        sid=r['specimen_id'];draft=study/'llm_drafts/pilot'/sid/'draft.json';draft_count+=int(draft.exists())
        approval_record=study/'evidence'/(sid+'_external_transfer_approval.json')
        missing.append({'case_id':sid,'raw_llm_draft':'LLM_DRAFT' if draft.exists() else 'MISSING_PROVIDER_RESPONSE',
          'draft_missing_reason':None if draft.exists() else (read(approval_record)['missing_reason'] if approval_record.exists() else 'No valid provider response has been recorded; no observation was invented.'),
          **{o:'MISSING_ACTUAL_EXPERT_REVIEW' for o in config['observer_codes']},'REF01':'MISSING_ACTUAL_REFERENCE_VERIFICATION',
          'independent_confirmatory_eligible':False})
    require(not list((study/'submissions').rglob('*.json')),'Preparation delivery must not overwrite or mislabel actual human submissions')
    require(not (study/'results').exists(),'Do not package unverified performance result tables')
    save(study/'MISSING_DATA.json',{'status':'PREPARATION_ONLY_NO_PERFORMANCE_TABLE','pilot_image_cases':10,'LLM_DRAFT_count':draft_count,
      'actual_expert_verified_forms':0,'actual_REF01_verifications':0,'main_specimens_assigned':0,'main_planning_target':60,
      'manuscript_editing_requested':False,'manuscript_integration':'USER_WILL_INTEGRATE_STANDALONE_OUTPUTS','V31_source_required_for_delivery':False,
      'missing_main_data':['60 source-documented new fossils, not used in rule development or previous evaluation','two actual approved reviewer forms per main specimen','separate verified references','pilot review and protocol/version lock'],
      'pilot':missing,'human_results_produced':False})
    csvwrite(study/'MISSING_PILOT_FORMS.csv',[{'case_id':r['case_id'],'observer_code':o,'review_status':r[o]} for r in missing for o in config['observer_codes']])
    (study/'README_TR.md').write_text('''# V31 — LLM taslaklarının kör uzman incelemesi

Bu paket hazırlık teslimidir. P001–P010 daha önce değerlendirilmiş yayın
görüntüleridir; bağımsız ana deney materyali değildir. Ham model taslakları
LLM_DRAFT, uzman inceleme şablonları EXPERT_REVIEW_PENDING durumundadır.
Gerçek uzman onayı, referans teyidi veya performans tablosu üretilmedi.

## Dosyalar ve sürümler

- `evidence/input_archive_verification.json`: Kullanıcının abc klasöründeki tam
  ZIP'lerin SHA-256 ve CRC kayıtları. S10'un SHA256SUMS.txt dosyasındaki 21 kayıt
  ve frozen_v29/version_lock.json içindeki dört dosya doğrulandı.
- S1–S9, README'sinde V27'yi tanımlar; 150 panel ve tarihsel scorer/prompt/controller
  hash'leri doğrulandı. Bu arşiv, makalede sözü geçen onarılmış V29 S9 değildir.
  V27'deki kural/scorer hash'leri ile V29'un hash'leri ayrı tutulur.
- `llm_drafts/prompt.txt`, generation_config.json ve model_availability_amendment.json
  yeni üretimin istemini ve model seçiminin kullanılabilirlik gerekçesini kaydeder.
  Yapılandırılmış model iki 503 sonrası hiç başarılı taslak yokken değiştirildi.
  Başarılı taslaklar aynı alternatif modelden gelir. Geçici hata yanıtları saklanır.
- `llm_drafts/pilot/Pxxx/`: gerçek ham sağlayıcı yanıtı, immutable draft.json ve seal.
  Model girdisi yalnız kodlu pikseller, kontrollü sözlük ve tarafsız çıkarım istemidir.
  Referanslar, kaynak yayının kimliği, eski model tahminleri, kurallar ve motor
  sonuçları modele verilmedi; cins tahmini istenmedi.
- `Review_EXP01_Pilot.zip` / `Review_EXP02_Pilot.zip`: iki gözlemciye ayrı verilecek
  paketler. Aynı ham taslaklar, kodlu görüntüler, 21 satırlı Word ve çevrimdışı HTML
  inceleme araçları vardır. Diğer uzmanın kaydı veya referanslar bulunmaz.
- `coordinator_private/`: kaynağa ait önceki etiketler, REF01 kontrolü bekleyen
  referanslar ve rol kayıtları. Bu klasör gözlemcilere verilmez.
- F001–F060 yalnız rezervdir. Yeni fosil, kaynak ve bağımsızlık doğrulaması olmadan
  atanmaz; farklı görünümler tek fosil kodunda kalır. 60 hedefi güç hesabı değildir.

## Gerçek inceleme ve onay

Uzman aynı kodun görüntüsünü seçer; hash eşleşmeden inceleme başlayamaz. Ham taslak
değiştirilmez. Her satır için APPROVE/CORRECT/NEUTRAL kararı gerekir; düzeltme ve
nötr işaretlemede açıklama kaydedilir. 21 karar, körleme beyanları, gerçek inceleme
süresi ve ilgili uzmanın açık onayı olmadan form kaydedilmez. EXPERT_VERIFIED bir
değerlerden çıkarım veya model etiketi değildir. Koordinatör gerçek kişi/uzmanlık
teyidini ayrıca yapar. Kimliği teyitsiz bir rol koduyla veri analize alınmaz.

Örnek komutlar depo veya paket kökünde; bu tasarıma ait --study yolunu kullanın:

```powershell
python eval/expert_comparison.py receive --study client/src/assets/scs/llm_expert_review_v31 --phase pilot --file "C:\\path\\approved.json"
python eval/expert_comparison.py usability --study client/src/assets/scs/llm_expert_review_v31
```

`ENROLLMENT_TR.md` gerçek katılımcı teyidi, REF01 kaydı, yeni materyal atama ve
ana deneyin taslak/form üretim adımlarını açıklar. Mevcut EXP01/EXP02/REF01
kodları ve boş hücreler gerçek katılım veya uzman onayı yerine geçmez.

Bu yeniden kullanılan pilotta kullanım, süre ve düzeltme kayıtları incelenir;
bağımsız doğruluk iddiası kurulmaz. Ana deney için yeni fiziksel fosiller, her
fosile iki gerçek onaylı form ve REF01'in ayrı doğrulaması gerekir. Ardından:

```powershell
python eval/expert_comparison.py check --study client/src/assets/scs/llm_expert_review_v31 --phase confirmatory
python eval/expert_comparison.py lock --study client/src/assets/scs/llm_expert_review_v31 --phase confirmatory
python eval/expert_comparison.py analyze --study client/src/assets/scs/llm_expert_review_v31 --phase confirmatory
```

A0/B1 alt işlemi yalnız bir onaylı formun aynı değer/durumlarını alır. CHR_01
modülü belirler, nötr durumlar korunur. Referans metrik için skorlama sonrası
birleştirilir. Ana fark A0−B1 kesirli top-1'dir: önce iki uzman fosil içinde,
sonra fosiller arasında eşit ortalanır. 5.000 bootstrap aynı kaynak kümesinin
fosillerini, iki uzmanı ve yöntem eşlerini birlikte tutar. İkincil ölçütler top-3,
sonuç verme, kural elemesi ve modül dışı kalmadır. 120 form 120 bağımsız örnek değildir.

`MISSING_DATA.json` mevcut eksikleri gösterir. Eksik uzman/REF01 doğrulaması veya
ana materyal varsa sonuç tablosu yoktur. Model-destekli inceleme, desteksiz insan
performansını ölçmez; ortak taslak ve anchoring etkisi yöntem sınırıdır.

`VIII_G_REPLACEMENT_EN.md` ve `VIII_G_Replacement_Proposed.docx` bu tasarımı
makaleye koymak için hazır metindir. Kullanıcının son talebi doğrultusunda gerçek
makaleye işlem yapılmadı; V31 dosyası bu teslim için gerekmiyor. Ayrı bir
`PILOT_PREPARATION_OUTPUTS_EN.md` metni gerçek hazırlık çıktılarını özetler.
`PILOT_DRAFT_OBSERVATIONS.csv` 21 karakter taslaklarını, `PILOT_DRAFT_SUMMARY.csv`
durum sayılarını içerir. Bunlar LLM_DRAFT çıktılarıdır, uzman doğruluğu veya A0/B1
başarı tablosu değildir. `MANUSCRIPT_INSERTION_PROMPT_TR.md` kullanıcı tarafından
makaleye işletilecek metinlerin kapsamını tarif eder.
''',encoding='utf-8')
    (study/'ENROLLMENT_TR.md').write_text('''# Koordinatör için veri akışı

1. `coordinator_private/roster.csv` içindeki EXP01, EXP02 ve REF01 gerçek kişilere
   atandığında ad, uzmanlık ve katılım teyitlerini gerçek kayıtla doldurun. Şimdilik
   boş bırakılan teyitleri model taslağına dayanarak `yes` yapmayın.
2. Pilot için ilgili `Review_EXP01_Pilot.zip` ve `Review_EXP02_Pilot.zip`
   dosyalarını ayrı uzmanlara verin. Büyük hazırlık ZIP'i koordinatör içindir;
   özel referansları içerdiğinden gözlemcilere dağıtılmaz. Her uzman aynı taslağı
   bağımsız inceler; HTML aracı kaynak kodun görüntüsünü hash ile doğrular,
   her karakter için karar ve açık tamamlanma/onay ister. Word kopyası basılı
   inceleme içindir; gerçek imzalı kayıt olmadan JSON'a otomatik onay aktarılmaz.
3. Uzman JSON'unu `receive` ile alın. İlgili gerçek kişinin teyidi ve 21 karar
   eksikse içe aktarma reddedilir. `usability` yalnız gerçek pilot formlarının
   sürelerini ve nötr gözlemlerini raporlar; bu panellerde doğruluk iddiası yoktur.
4. Pilotla formu ve protokolü değerlendirin; kararları belgelendirin. Form, kural
   sürümü ve ölçütler sabitlenmeden ana teste geçmeyin. `study_config.json` içinde
   `pilot_review_completed` ve `protocol_finalized` yalnız bu işler bitince true olur.
5. Yeni ana materyal için `specimen_registry.csv` içindeki F001–F060 kodlarını
   yalnız belgeli ve önce kullanılmamış fiziksel fosillere atayın. `enrolled=yes`,
   kaynak, arşiv kaydı, fiziksel birim ve gerçek kaynak kümesi kodu gerekir.
   Aynı kaya/örnek/bağımlı koleksiyondaki fosiller aynı bootstrap_cluster_id taşır.
   Görüntü sayısı fosil sayısı değildir; bütün görünümleri aynı kodun
   `public/confirmatory/materials/Fxxx/view01.png`, view02.png vb. dosyalarına koyun.
   Bağımsızlık ve körleştirme gerçekten kontrol edilmeden teyitleri işaretlemeyin.
6. REF01 referans cinsi koleksiyon kaydı ve örnek incelemesiyle ayrıca doğrular.
   Kayıt ve imzalı teyit koordinatörde kalır. `reference_labels.csv` içindeki eski
   yayın etiketleri doğrulanmış referans değildir. Ana analiz, özel
   `specimen_registry.csv` içindeki reference_genus, reference_module,
   reference_status=verified, reference_verifier_code=REF01 ve reference_evidence
   alanlarını okur; bunlar yalnız gerçek doğrulama sonrasında doldurulur.
   Bu alanlar model ve gözlemci paketlerine aktarılmaz.
7. Yeni materyalin taslaklarını ve iki ayrı inceleme paketini üretin:

```powershell
python eval/llm_observation_drafts.py --phase confirmatory --model gemini-3.5-flash-lite
python eval/build_llm_review_forms.py --phase confirmatory
```

Taslak komutu, kayıtlı önceki 150 panelin hash'lerini ve aynı görüntünün farklı
fosil kodlarına atanmasını gönderimden önce reddeder. Model yalnız kodlu görüntü
ve dondurulmuş sözlük alır. Dış sağlayıcıya aktarım için gerekli yetkiyi doğrulayın.
Model/sözlük/istem politikası değişirse eski ham taslakları değiştirmek yerine
ayrı, gerekçesi belgelenmiş bir çalışma sürümü oluşturun.

8. Her F koduna iki gerçek onaylı form ve ayrı doğrulanmış referans tamamlanınca
   README'deki `check`, `lock`, `analyze --phase confirmatory` sırasını kullanın.
   Eksik veriler varken tablo üretilmez. `lock` iki formu, ham taslakları ve
   kaynak kümesi kayıtlarını mühürler; A0/B1 aynı gözlem değer/durumlarını alır.
   Önce iki uzman fosil içinde, sonra fosiller arasında ortalanır; bootstrap
   aynı kaynak kümesindeki fosilleri, iki uzmanı ve yöntem çiftini birlikte tutar.
''',encoding='utf-8')
    # Real test evidence, entirely synthetic and outside the study submissions.
    run=subprocess.run([sys.executable,'-m','unittest','discover','-s','eval','-p','test_llm_review_workflow.py'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
    require(run.returncode==0,run.stdout+run.stderr)
    (study/'evidence/software_tests.txt').write_text(run.stdout+run.stderr,encoding='utf-8')
    save(study/'evidence/software_tests.json',{'passed':int(re.search(r'Ran (\d+) tests',run.stdout+run.stderr).group(1)),'failures':0,'scope':'Temporary synthetic software fixtures only; no actual human approval or performance estimate.'})
    gates=[]
    for command in ['check','analyze']:
        gate=subprocess.run([sys.executable,'eval/expert_comparison.py',command,'--study',str(study),'--phase','confirmatory'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
        require(gate.returncode==2 and not (study/'results').exists(),'Incomplete actual study unexpectedly produced results')
        gates.append({'command':command,'exit_code':gate.returncode,'reason':gate.stderr.strip(),'performance_results_created':False})
    save(study/'evidence/actual_incomplete_study_gate.json',{'passed':True,'scope':'Actual unfilled study records, not synthetic participants','checks':gates})
    save(study/'evidence/delivery_verification.json',verify(study))
    package=study/'S10_LLM_Draft_Expert_Review_Preparation.zip';entries={}
    for f in study.rglob('*'):
        if f.is_file() and f.name not in [package.name,'SHA256SUMS.txt']:entries[f.relative_to(ROOT).as_posix()]=f
    script_names=['expert_comparison.py','test_expert_comparison.py','llm_observation_drafts.py','setup_llm_review_study.py','llm_review_form.html','build_llm_review_forms.py','build_llm_review_delivery.py','test_llm_review_workflow.py','test_llm_review_browser.cjs','verify_llm_review_delivery.py','update_v31_review_design.py','requirements_expert_study.txt']
    save(study/'evidence/delivery_script_hashes.json',{name:digest(ROOT/'eval'/name) for name in script_names})
    entries[(study/'evidence/delivery_script_hashes.json').relative_to(ROOT).as_posix()]=study/'evidence/delivery_script_hashes.json'
    for name in script_names:
        f=ROOT/'eval'/name;entries[f.relative_to(ROOT).as_posix()]=f
    with zipfile.ZipFile(package,'w',zipfile.ZIP_DEFLATED) as z:
        for name,f in sorted(entries.items()):z.write(f,name)
        z.writestr('PACKAGE_MANIFEST.json',json.dumps([{'path':name,'sha256':digest(f)} for name,f in sorted(entries.items())],indent=2))
    with zipfile.ZipFile(package) as z:require(z.testzip() is None,'Delivery archive CRC mismatch')
    (study/'SHA256SUMS.txt').write_text('\n'.join(digest(f)+'  '+f.relative_to(study).as_posix() for f in sorted(study.rglob('*')) if f.is_file() and f.name!='SHA256SUMS.txt')+'\n',encoding='utf-8')
    print(json.dumps({'LLM_DRAFT_count':draft_count,'pending_expert_forms':2*draft_count,'actual_expert_verified_forms':0,'actual_reference_verifications':0,'performance_tables':0,'package':str(package)},indent=2))

if __name__=='__main__':main()
