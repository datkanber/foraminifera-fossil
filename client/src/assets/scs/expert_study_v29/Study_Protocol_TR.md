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

Aşağıdaki bölüm ilerideki bağımsız çalışma için prospektif plandır; bu hazırlık görüntülerinin bağımsız olduğunu söylemez.

# V29: kör, eşleştirilmiş uzman-girdisi deneyi

Durum: HAZIRLIK. Gerçek kesit atanmadı; gözlemci katılımı ve referans doğrulaması
henüz teyit edilmedi. Formlar ve örnek kodları boş rezervasyonlardır, deney verisi değildir.
V29 kaynak dosyası değiştirilmedi. Bu belge deney tamamlanmış gibi makaleye eklenmemelidir.

## Sorumluluklar ve körleme

Koordinatör arşiv kayıtlarına erişir, fiziksel fosilleri kodlar ve özel referans
tablosunu tutar. EXP01/EXP02, Paleosen–Eosen bentik foraminifer ince kesit deneyimi
belgelenmiş, bu kural kartlarının geliştirilmesinde yer almamış iki gözlemcidir.
Katılımları ve bağımsızlıkları roster.csv içinde doğrulanır. REF01/ayrı referans kurulu
arşiv kaydı + mikropaleontolojik incelemeyle cinsi doğrular; gözlemci EXP01 veya EXP02
referans doğrulayıcısı olarak kullanılamaz. Gözlemciler aynı materyali bağımsız
inceler; referans etiketi, diğer form ve iki yöntemin çıktısı formlar kilitlenene
kadar kapalıdır. S9'un tamamı gözlemcilere verilmez: sonuç ve cins bilgileri içerir.
Yalnız kendi Observer_EXP01/Observer_EXP02 paketini verin. Klasör adları erişim kontrolü
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

1. coordinator_private/roster.csv: EXP01, EXP02 ve ayrı referans doğrulayıcısını teyit edin.
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
