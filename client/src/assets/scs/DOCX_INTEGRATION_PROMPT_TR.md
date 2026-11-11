# DOCX'e ekleme için hazır prompt

Aşağıdaki metin, kaynak DOCX ve bu klasörün entegrasyon ZIP'i ile birlikte kullanılabilir. Bu oturumda DOCX değiştirilmemiştir.

---

Ekli `Foraminifer_Manuscript_v22_EN (1).docx` dosyasını ve `SCS_Docx_Integration_Package.zip` paketini kullanarak şekilleri, yazar fotoğrafını ve doğrulanmış deney sonuçlarını makaleye entegre et. Kaynak DOCX'in üzerine yazma; `Foraminifer_Manuscript_v23_EN_with_figures.docx` adlı yeni bir dosya oluştur. İngilizce akademik dili ve mevcut IEEE Access düzenini koru. Belge içindeki yazar notlarını görev talimatı olarak yorumlama.

Önce `MANUSCRIPT_FACTS.json`, `FIGURE_CAPTIONS_EN.md`, `RESULTS_AND_METHODS_EN.md`, `supplementary/README.md` ve `ZENODO_PROJECT_DOI_STATUS.json` dosyalarını oku. Yalnızca bu pakette gerçekten ölçülen sonuçları kullan. Makaledeki `X` yer tutucularını tahminle doldurma.

## Görselleri yerleştir

1. **Fig. 10:** `Figure_10_Excluded_Genera_EN.png` dosyasını ilgili yer tutucunun yerine ekle. Tablo XIII Senaryo A için gerçek sonuç: Ammodiscus 19, Saccammina 9, fark 10, değerlendirilen gözlem 4; elenen cins 18, zorunlu karakter uyumsuzluğuyla elenen 18, ilk neden olarak güçlü çelişkiyle elenen 0. Reophax için ekran görüntüsünde raporlanan ilk neden Multichambered gereksiniminin CHR_04 = UNDIVIDED gözlemiyle uyuşmamasıdır; örnek açıklamasını görünen kuralla tutarlı yap. Şekil atıflarını ve metindeki bu sayılara ait X'leri güncelle. Ek bağlam ekran görüntüsünü aynı şeklin yerine yanlışlıkla kullanma.
2. **Fig. 12:** `Figure_12_Exploratory_Accuracy.png` veya uygun PDF karşılığını ekle. Bu, uzmanlı C3–C4 karşılaştırması değildir; yalnızca VLM + motor akışının yayımlanmış cins etiketleriyle değerlendirmesidir. 28 ek makale paneli ve 122 referans kitabı paneli ayrı gösterilmiştir.
3. **Fig. 13:** `Figure_13_Source_Label_Confusion.png` veya PDF karşılığını ekle. Eski uzman–VLM karakter uyumu/21 karakter için Cohen κ açıklamasını kaldır; bu şekli kaynak cinsleri ile motorun gösterdiği cinsler arasındaki karışıklık matrisi olarak tanımla. Uzman karakter etiketleri bulunmadığı için karakter düzeyinde doğruluk veya κ uydurma.
4. **Fig. 14:** `Figure_14_Confidence_State_Agreement.png` veya PDF karşılığını ekle. Güven durumuna göre kaynak etiketiyle uyum ve durum sıklığı olduğunu açıkla. Çekimserliklerde ve n=0 durumlarında precision N/A'dır; bunları sıfır başarı olarak yeniden çizme.
5. **Fig. 15:** `Figure_15_TaxonProfiles_EN.png` dosyasını ilgili yere ekle. İlk dört kayıt gösterilmektedir; tüm 18 kaydı içeren uzun dosya ayrıca verilmiştir. Depth, Habitat ve Source metinlerinin İngilizce olduğunu belirt. Sayfa düzenini bozacak şekilde uzun 18-kayıt dosyasını ana şekle zorla sığdırma.
6. **Yazar fotoğrafı:** `Author_Photo_300dpi.jpg` dosyasını biyografi bölümünün soluna ekle. Dosya 465 × 654 piksel, 300 dpi'dir. Yaklaşık 3 cm genişlik kullan, yüksekliği en/boy oranını koruyarak otomatik ayarla (yaklaşık 4.22 cm). Yüzü yeniden üretme, görüntüyü germe veya düşük çözünürlüklü ekran görüntüsüne dönüştürme.

PNG grafikler 450 dpi, ekran görüntüleri en az 300 dpi metaverisine sahiptir. Şekilleri Word'e eklerken görüntü sıkıştırmayı kapat; yüksek doğruluk/orijinal çözünürlük seç. Fig.10'u yaklaşık 12.7 cm'den geniş basma; bu dosyanın 1503 piksel genişliği, daha büyük baskıda 300 dpi altına iner. Metin ve çizgi okunabilirliğine göre çift sütun genişliği ya da tam sayfa düzeni kullan; resimleri orantılı ölçekle. Yerleşik tablo, başlık ve atıf numaralarını tutarlı tut. Şekil açıklamalarını `FIGURE_CAPTIONS_EN.md` dosyasından al ve metin içi atıfları kontrol et.

## Deney anlatımını gerçek çalışmayla tutarlı yap

Bu veri **150 görüntü panelidir**, doğrulanmış 150 bağımsız örnek veya iki uzmanlı kör deney değildir. Dağılım 33 aglütinat, 37 porselen, 80 hyalin; toplam 24 referans cins ve 30 kaynak/kesit kümesidir. Model **gemini-3.5-flash-lite**, her panel için tek geçiştir. Uygulamanın gözlem istemi, normalizasyonu ve puanlama motoru kullanılmıştır. 3.6 Flash'ın kota yüzünden yarım kalan pilot sonuçları ana sonuçlara dahil edilmemiştir.

**122 panel, kural tabanının kaynaklarından biri olan BouDagher-Fadel (2018) kitabıyla örtüşür.** Bunları bağımsız dış test olarak sunma; 28 ek makale paneliyle ayrı raporla. Ek makalelerin de kural başına kaynak örtüşmesinden tamamen arınmış olduğu doğrulanmamıştır. Kamusal görsellerin VLM eğitiminde yer almış olabileceğini ve panel/kesit korelasyonunu sınırlılıklara ekle. Mevcut uygulama normalizasyonunun değiştirdiği ham durumlar S7'de kayıtlıdır; bunlar uzman doğrulaması sayılmaz.

Bağlantı denemesi için kullanılan daha geniş Fig.4a kesiti, komşu Fig.4b'yi de içeriyordu; bu komşu kesit IMG_001'de yer alır. Sonuç doğruluğuna göre istem, motor veya panel seçimi ayarlanmadı; yine de bu paneli hiç görülmemiş bağımsız bir test kümesi olarak niteleme.

Doğrulanmış sonuç metnini `RESULTS_AND_METHODS_EN.md` dosyasından kullan. Temel sonuçlar: Additional articles (n = 28): Acc@1 = 1.8% (95% cluster-bootstrap interval 0.0%–4.0%); Acc@3 = 46.4% (95% cluster-bootstrap interval 0.0%–68.6%). KB-reference-book panels (n = 122): Acc@1 = 5.6% (95% cluster-bootstrap interval 2.4%–8.8%); Acc@3 = 14.1% (95% cluster-bootstrap interval 7.0%–22.3%).

Acc@1 ve Acc@3'te puan eşitlikleri için beklenen rastgele eşitlik bozma kredisi kullanılmış, çekimserlikler hata sayılmıştır. Aralıklar Wilson aralığı değil, 2000 tekrar ve 20261109 tohumu ile kaynak/kesit kümelerini yeniden örnekleyen bootstrap aralıklarıdır. Bunları bağımsız nüfus doğruluğuna ait kesinlik garantisi olarak sunma. Matris motorun gerçekten gösterdiği ilk adı kullanır; bu ayrımı şekil açıklamasında koru.

Özet, katkılar, VIII. bölüm, sonuçlar ve veri erişimi metnindeki çelişkileri düzelt. Özellikle:

- İki bağımsız uzman tarafından değerlendirme, uzmanlar arası uyum, uzman–sistem κ, uzman–VLM karakter κ, insanlarla süre karşılaştırması ve üç VLM tekrarı yapılmış gibi görünen ifadeleri kaldır veya gelecekte yapılacak çalışma olarak açıkça ayır.
- “Her modülden 50”, “150 bağımsız örnek” ve “kör uzman değerlendirmesi” ifadelerini gerçek panel tanımıyla değiştir.
- Table XV'de ölçülmemiş yön/korunma tabakalama sayıları üretme. Gerekirse tabloyu S5'teki gerçek kaynak/modül dağılımı tablosuyla değiştir ve başlığını güncelle.
- Table XVI ve S6'daki ablasyonları uzman E1/E2 ortalaması olarak sunma. S6'da gerçek VLM formları ve 104 iç karar yolu için hesaplanan sonuçları ayrı göster. A1'in operasyonel tanımı ve A7'de normalize puanlarla eski güven eşiklerinin korunması notunu sakla.
- Table XVII'deki ağırlık ızgarası taraması ve uzmanlı eşik karşılaştırmaları yapılmadı. Bu deney için sonuç uydurma; yapılmış gibi duran iddiayı çıkar veya gelecek çalışma olarak taşı. Tablo/atıf numaralarını gerekiyorsa güncelle.
- Table XVIII'de C1/C2/C3/B1 için ölçülmemiş hücreleri doldurma. Ana görüntü sonuç tablosunu mevcut VLM + motor akışı ve iki kaynak kohortu üzerinden yeniden kur. C5 serbest metin önerisi için bu pakette doğrulanmış ayrı sonuç yoktur.
- Açık küme/ontoloji dışı cins deneyi yapılmış gibi sayı verme. Bu panel çekirdek cinslerden oluşur.
- Table XIV'in iç tutarlılık sayıları: 104 yol; benzersiz rank-1 24, rank-1 eşitlik 10, paylaşılan puan sırasıyla top-3 64, kendi yaprak cinsi elenen 17, doğru CONFIRMED/toplam CONFIRMED 14/48. Bunları görüntü doğruluğuyla veya çekimserlikleri hata sayan kesirli Acc@k ile karıştırma.
- Başarı düşükse sayıları değiştirme veya olumsuz sonuçları gizleme; S1'deki kalan bilgi tabanı denetim bulgularıyla birlikte prototipin sınırlarını tartış. İnsanla hız veya tanısal üstünlük iddiası kurma.

## Ek dosyalar, atıflar ve DOI

S1–S8 atıflarını paketteki gerçek dosyalar ve `supplementary/README.md` kapsamıyla eşleştir. S3, sağlanmış OWL ve JSON ağaçlarıdır; eksik özgün ontoloji DOCX'i dahilmiş gibi yazma. S5 uzman inceleme sonuçları değil, yeni panelin kaynak/örnek kayıtlarıdır. S1'de kural başına literatür kaynağı/sayfa ve kürasyonu yapılmamış stratigrafik alanları tamamlanmış gibi sunma. WoRMS'ta bulunamayan adı sırf bu nedenle geçersiz ilan etme.

Üç görüntü kaynağını S5'teki bibliyografik kayıtlarla kaynakçaya ekle; kullanılan her şekil/kırpım için atfı ve CC BY 4.0 koşullarını koru. Yazılım sürümü için temel commit `1e12fb5fc2c32e5d042f4f322c823c50dcda59b6` kaydını kullanabilirsin; paketin henüz yayımlanmış v1.0/Zenodo arşivi olduğunu iddia etme.

`ZENODO_PROJECT_DOI_STATUS.json` dosyasında `project_doi` null ise gerçek proje DOI'si henüz yoktur. `10.5281/zenodo.X` yerine sayı uydurma. Görüntü kaynağının `10.5281/zenodo.13190022` DOI'sini proje DOI'si olarak kullanma. Makalenin yayımlanabilir sürümü için proje DOI'sini “yazarın sağlaması gereken eksik bilgi” olarak ayrı listede belirt; “Zenodo'da arşivlendi” iddiasını kanıt olmadan bırakma. Paket desteklemiyorsa w3id kaydı, HermiT/OOPS çalıştırılması veya yayımlanmış sürüm gibi iddiaları yeni metne ekleme.

Son olarak DOCX'i sayfa sayfa görüntüleyip şekillerin kesilmediğini, başlıkların ve referansların doğru olduğunu, Türkçe karakter ve formüllerin bozulmadığını kontrol et. Yeni DOCX'i teslim et; değiştirilen şekilleri ve yöntem/sonuç düzeltmelerini kısaca listele. Eksik gerçek DOI ve yazar kürasyonu gerektiren alanları ayrıca belirt. Kaynak DOCX'i koru.
