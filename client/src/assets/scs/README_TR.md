# Hazır görseller ve entegrasyon paketi

9 Kasım 2026. Kaynak DOCX değiştirilmedi. Uygulama kodu, `.env` dosyası ve bilgi tabanı değiştirilmedi.

## Ana dosyalar

- `Figure_10_Excluded_Genera_EN.png`: Tablo XIII A, gerçek uygulamada 18 eleme; 300 dpi.
- `Figure_12_Exploratory_Accuracy.png/.pdf`: gözlenemeyen karakter oranına göre gerçek görüntü sonuçları; PNG 450 dpi.
- `Figure_13_Source_Label_Confusion.png/.pdf`: yayımlanmış cins etiketleri ile motor çıktılarının karışıklık matrisi; PNG 450 dpi.
- `Figure_14_Confidence_State_Agreement.png/.pdf`: güven durumlarına göre kaynak etiketiyle uyum ve durum sıklığı; PNG 450 dpi.
- `Figure_15_TaxonProfiles_EN.png`: İngilizce alanlarla ilk dört kayıt; 300 dpi. `_all18` dosyası tüm kayıtları içerir.
- `Author_Photo_300dpi.jpg`: kullanıcı tarafından sağlanan özgün portre, 465 × 654 piksel, 300 dpi. Yaklaşık 3 cm genişlikte, en/boy oranı korunarak kullanılmalı.
- `DOCX_INTEGRATION_PROMPT_TR.md`: kaynak DOCX ve ZIP ile birlikte kullanılacak hazır prompt.
- `FIGURE_CAPTIONS_EN.md`, `RESULTS_AND_METHODS_EN.md`, `MANUSCRIPT_FACTS.json`: tutarlı İngilizce başlıklar, yöntem/sonuç metni ve kesin veri kaydı.
- `SCS_Docx_Integration_Package.zip`: ana görseller, fotoğraf, prompt ve destekleyici sonuçlar.
- `Supplementary_Materials_S1-S8.zip`: S1–S8 dosyaları, 150 görüntü, ham model yanıtları ve yeniden üretme betikleri.
- `release_candidate/foraminifera-fossil_v1.0_DRAFT.zip`: yayımlanmamış yerel sürüm adayı; gerçek v1.0/Zenodo kaydı değildir.

## Deneyin gerçek kapsamı

150 panel, 24 cins; dağılım 33 aglütinat, 37 porselen, 80 hyalin. Model gemini-3.5-flash-lite, panel başına tek geçiş. Tüm 150 panelin gerçek yanıtı tamamlandı; görüntü ve model kayıtlarının SHA-256 değerleri doğrulandı. 28 panel ek makalelerden, 122 panel bilgi tabanı referans kitabından gelir. Bu ikinci grup kaynakla örtüşür ve grafiklerde ayrı raporlanır. Panel sayısı bağımsız örnek sayısı olarak yorumlanamaz. İki uzmanlı kör deney veya karakter düzeyinde uzman κ sonucu yoktur. Fig.13'ün eski açıklaması bu nedenle değiştirilmelidir.

Additional articles (n = 28): Acc@1 = 1.8% (95% cluster-bootstrap interval 0.0%–4.0%); Acc@3 = 46.4% (95% cluster-bootstrap interval 0.0%–68.6%). KB-reference-book panels (n = 122): Acc@1 = 5.6% (95% cluster-bootstrap interval 2.4%–8.8%); Acc@3 = 14.1% (95% cluster-bootstrap interval 7.0%–22.3%).

Aralıklar 2000 tekrar kaynak/kesit-kümeli bootstrap ile hesaplandı; nüfusa genellenebilir bir dış doğrulama garantisi değildir. Ham VLM durumlarıyla mevcut uygulamanın normalize ettiği durumlar arasındaki farklar S7'de tutulur. 3.6 Flash'ın günlük kotaya takılan ilk denemesi ayrı pilot klasöründedir ve ana sonuçlara dahil değildir.

## Kontroller

- Tablo XIII A: Ammodiscus 19, Saccammina 9, fark 10, değerlendirilen gözlem 4.
- Fig.10: 18 zorunlu uyumsuzluk elemesi, ilk neden olarak güçlü çelişki elemesi 0.
- Fig.15: 18 kaydın üç İngilizce alanı API ve arayüzde doğrulandı.
- 43 mevcut API testi geçti; 10 yetkinlik sorgusu bağımsız master JSON cevaplarıyla eşleşti.
- 104 iç karar yolu ve A1–A7 karşılaştırmaları yeniden hesaplandı. Bunlar bağımsız görüntü doğruluğu değildir.
- Kaynak DOCX SHA-256'sı başlangıçla eşleşir. Ana uygulama dosyalarında değişiklik yoktur.

## Dışarıda kalan son işlemler

Gerçek proje DOI'si henüz alınmadı; `ZENODO_TR.md` ve `ZENODO_PROJECT_DOI_STATUS.json` bunu açıkça kaydeder. Yayımlanmış GitHub v1.0 sürümü ve Zenodo kaydı olmadan DOI uydurulamaz. S1'in kural başına kaynak/sayfa ve stratigrafik aralık gibi yazar kürasyonu gerektiren alanları da tamamlanmış gibi sunulmaz. S1–S8 kapsamı uzman bulunmaması nedeniyle draft makaledekinden farklıdır; entegrasyon promptu gerekli metin değişikliklerini belirtir.

## Yeniden üretme

`reproduce/download_sources.py` üç özgün kaynağı indirip SHA-256 doğrular; `prepare_image_panel.py` sabit seçimi yeniden çıkarır. `run_image_evaluation.cjs` yeniden çağrı yapmadan başarılı kayıtları sürdürür. Çalıştırırken `EVAL_MODEL=gemini-3.5-flash-lite` ve `EVAL_INTERVAL_MS=4500` ayarları kullanılmalıdır. Uygulamanın gizli API anahtarı pakete dahil edilmez. Grafikler `plot_image_results.py` ile mevcut ham kayıtlardan çevrimdışı üretilebilir. Ek açıklamalar ve lisanslar S5'tedir.
