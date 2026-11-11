# V28 — yeni denetim ve çevrimdışı deney paketi

Kaynak V27 değiştirilmedi. Yeni ana dosya `Foraminifer_Manuscript_v28_IEEE_Access.docx`,
ek dosya `Supplementary_S10_Revision.docx` dosyasıdır. `CHANGES_TR.md` değişiklikleri
ve `MANUSCRIPT_FACTS_V28.json` kesin sayıları kaydeder.

- Denetimde hedeflenen 17/10/25 bulgu 0/0/0 oldu; 67 eşleme düzenlemesi kaydedildi.
- İlk 18 tanısal boşluktan yalnızca 3'ü mevcut tanımlarla kodlanabildi. Kalan 15'i
  aynı sözlük içinde güvenilir biçimde tamamlamak mümkün değildi. Yanlış tanısal
  vekiller kaldırılınca toplam 28 cinsin puanlanabilir D kuralı kalmadı.
- 104 yolda tekil ilk sıra 24 → 30; eşit ilk sıra 10 → 22; paylaşılan top-3 64 → 68.
  Elenen yaprak sayısı 17 → 19 oldu. Bunlar birlikte raporlandı.
- 33 duyarlılık ayarı, 150 arşivlenmiş VLM panelinde ve aynı 104 yolda hesaplandı.
  Ham belirsizliği koruyan ikinci panel koşulu ayrıca değerlendirildi.
- 75 cins × 20 tekrar için üç eksiklik oranı ve %5 gürültü, ayrıca temiz kontroller
  çalıştırıldı. Toplam 12.000 girdi, iki modelle 24.000 değerlendirme yapıldı.
- OWL üreticisine 3 sınıf kısıtı, 1 altılı DisjointClasses aksiyomu (15 ikili ilişki)
  ve 2 AllDifferent aksiyomu eklendi. HermiT temel dosyayı tutarlı buldu; dört
  kasıtlı hata kontrolünün tamamını reddetti.

## Sonuçların sınırı

Panel top-1 uyumu 4.9%'dan 3.2%'ye düştü; ham belirsizlik korununca eski/yeni
master karşılaştırması 8.9% → 3.9% oldu. Bu olumsuz sonuçlar gizlenmedi. 122 panel
bilgi tabanının referans kitabıyla örtüşür. Sentetik B1 karşılaştırması aynı bilgi
tabanından türetildiği için bağımsız dış doğrulama veya insan uzman deneyi değildir.
Sonuçlar 90/100 hakem puanı veya kabul garantisi sağlamaz.

Makalede V27 numaralandırması korundu: iç tutarlılık Table VIII'dedir (eski
Table XIV). Eski ontoloji metrikleri Table VII atfı V27'de S9.6'ya taşınmıştı;
güncel envanter S10.4'tedir. Yeni Table XII duyarlılık, Table XIII sentetik testtir.
Fig.3 yenilendi, Fig.4 eklendi. Eski S1–S9 ve ana `scs` klasöründeki önceki ZIP'ler
donmuş tarihsel sürümlerdir; yeni tablolar için bu paketi kullanın.

## Dosyalar ve kontroller

`results/` tüm yeni JSON/CSV kayıtlarını içerir. Grafikler 450 dpi PNG ve vektörel
PDF olarak verildi. `generated_ontology/` güncel OWL dosyasıdır. ZIP; kaynak V27'yi,
düzeltilmiş JSON masterları, önceki masterları, 150 özgün paneli ve ham model
yanıtlarını, kaynak lisanslarını ve çevrimdışı yeniden üretim betiklerini içerir.
Gerçek sağlayıcı yanıtları korunur; API anahtarları ve `.env` dosyaları dahil edilmez.

47 API testi ve 7 bilimsel kontrol geçti. Mevcut JSON masterları ve OWL değiştirildi;
canlı Neo4j/vercel/deployment güncellenmedi. Gerçek proje DOI'si hâlâ alınmış değildir.

Word dosyayı açtı fakat bu ortamda PDF dışa aktarımı tamamlanmadı. Bu nedenle DOCX
için sayfa sayfa PDF düzen kontrolü yapılmış gibi sunulmaz; Word'de son sayfa
düzenini kontrol edin. Üç grafik PDF'si ise gerçek vektörel dışa aktarımdır.
ZIP içindeki `eval/README.md` çalıştırma sırasını ve yöntem tanımlarını açıklar.

Yazılım MIT; bilimsel kaynak görüntüleri kendi atıf/lisanslarıyla dağıtılır.
Makale ve yazar portresi için genel bir açık lisans veya yayımlama izni varsayılmaz.
Bu ZIP yerel inceleme paketidir; yayımlanmış Zenodo kaydı değildir.
