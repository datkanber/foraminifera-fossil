# V29 uzman karşılaştırması — hazırlık paketi

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
python eval/expert_comparison.py receive --phase pilot --file "C:\path\P001_E1.json"
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
