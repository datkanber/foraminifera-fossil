# 12 Kasım 2026 — bu hazırlık turunun kapsamı

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

---

# V29 uzman karşılaştırması — hazırlık paketi

P001–P010 için hazırlık görüntüleri atanmıştır; F001–F060 hâlâ rezervdir. Kişi atamaları, katılım teyitleri ve insan gözlem yanıtları boştur.

Önce Study_Protocol_TR.docx dosyasını okuyun. 8–10 pilot materyal ile EXP01/EXP02 ve ayrı
referans doğrulamasını belirleyin. coordinator_private içindeki iki CSV'yi gerçek
kayıtlarla doldurun. Pilot/ana deneyde kullanılacak gerçek fosillere enrolled=yes
yazın. Dijital görüntüleri yalnız kodlu materials/<örnek>/view01.png ... adlarıyla
yerleştirin; metadata/gömülü etiket körlemesini insan incelemesiyle onaylayın.

Gözlemcilere yalnız kendi Observer_EXP01_Pilot.zip / Observer_EXP02_Pilot.zip dosyasını
verin. Bunların mevcut hâli boş hazırlık şablonudur. Materyal ve kayıtlar eklenince
paketleri yenileyin. Tam koordinatör paketi, referans tablosu, kural kartları, eski
S9 sonuçları veya analiz kodu gözlemcilere verilmez.

HTML form tarayıcıda çevrimdışı açılır, 21 seçimi, dört körleme beyanını ve gözlem
süresini kaydeder. Veri dışarı gönderilmez. Word formu kâğıt alternatifidir; kâğıtta
ölçülen gerçek süre ayrıca aktarılmalıdır. Yarım form nötr gözlemmiş gibi doldurulmaz.

Komutlar depo kökünde:

```powershell
python eval/prepare_expert_study.py --refresh-observer-packs
python eval/expert_comparison.py receive --phase pilot --file "C:\path\P001_EXP01.json"
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
