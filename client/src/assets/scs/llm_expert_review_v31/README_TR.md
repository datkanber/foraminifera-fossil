# V31 — LLM taslaklarının kör uzman incelemesi

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
python eval/expert_comparison.py receive --study client/src/assets/scs/llm_expert_review_v31 --phase pilot --file "C:\path\approved.json"
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
