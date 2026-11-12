# Koordinatör için veri akışı

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
