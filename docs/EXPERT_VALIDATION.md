# GeoKnow bağımsız uzman doğrulaması

Yeni üç kategori, AI simülasyonları, güvenli staging ve makale entegrasyonu için
[V32 sürüm ve staging kılavuzu](EXPERT_VALIDATION_RELEASE.md) dosyasına bakın.

Giriş: `/expert-validation`. Uzman yolları: `/expert-validation/specimens`
(Form B), `/expert-validation/rules` (Form A). Türkçe/English anahtarı özel
çalışma alanında bulunur. Hiçbir uzman gözlemi yapay zekâ ile doldurulmaz.

## İlk kurulum

API için Node 20.9+ gerekir; mevcut istemci araçlarıyla Node 24.11+ kullanılması
uygundur. API dizininde `npm ci` çalıştırın. Mevcut Neo4j bağlantısını kullanır.
Yeni `EVRecord` ve `EVMutex` etiketleri ontoloji düğümlerinden ayrıdır.
İsteğe bağlı `VALIDATION_NEO4J_DATABASE` ile ayrı bir veritabanı seçilebilir.
Veritabanının önceden oluşturulmuş olması gerekir.

`api/.env.example` içindeki doğrulama değişkenlerini ortamınıza aktarın:

- Yerelde `VALIDATION_APP_ORIGIN=http://localhost:3000`; üretimde tam HTTPS site
  origin’i (ör. `https://geoknow.asrlab.cloud`), sonunda `/` olmadan.
- Üretimde `NODE_ENV=production`; çerez HttpOnly, Secure, SameSite=Strict olur.
- Dağıtımda `VALIDATION_GIT_COMMIT` tam 40 karakterli gerçek kaynak commit’i
  olmalıdır. Her çalışma ayrıca kaynak dosyalarının SHA-256 değerlerini ve tam
  içeriklerini dondurur. Commit edilmemiş yerel kaynakla yalnız `SOFTWARE_TEST`
  çalışması oluşturulur; gerçek araştırma için önce kodu commit edin.
- `VALIDATION_TRUST_PROXY_HOPS` yalnız barındırma topolojinize uygun güvenilen
  proxy sayısı olmalıdır. Yerelde `0` kullanın.

API dizininde şemayı hazırlayın:

```powershell
npm.cmd run validation:admin -- migrate
```

Koordinatör parolası komut satırı argümanı veya kaynak koduna yazılmaz. Aşağıdaki
komutla gizli girişten stdin’e iletin (en az 12 karakter):

```powershell
$validationSecret = Read-Host 'Koordinatör parolası' -AsSecureString
$validationCredential = [System.Net.NetworkCredential]::new('', $validationSecret)
$validationCredential.Password | node scripts/validation-admin.js create-admin coordinator
Remove-Variable validationSecret, validationCredential
```

`api` içinde `npm.cmd start`, `client` içinde `npm.cmd start` çalıştırın.
Webpack, özel `/api/expert-validation` isteklerini yerel API’ye proxy eder.
Üretimde aynı origin proxy zorunludur: `client/vercel.json` bu yolu mevcut
Render API’sine yönlendirir. Farklı sunucu kullanırsanız hedefi değiştirin.
CDN bu yolu önbelleğe almamalıdır. API yanıtları `no-store, private` döndürür.
Bu değişiklik dağıtım yapmaz ve mevcut veritabanını kendiliğinden migrate etmez.

## Koordinatörün iş akışı

1. Yeni çalışma oluşturun: pilot / ayrı doğrulama, gerçek araştırma / yazılım
   testi, tüm kurallar / seçilmiş alt küme ve seçim gerekçesi. Gerçek V32’nin
   708 kartı ve 21 karakteri kaynaktan alınır. Teknik öncelik seçimi, belirtilen
   taksonları ve eşlenmemiş zorunlu kuralları toplar; taksonomik karar önermez.
2. EXP01 ve EXP02 için özel davet üretin. Bağlantıları kendiniz ilgili kişilere
   iletin. Uygulama e-posta göndermez. Davet 48 saat geçerli ve tek kullanımlıktır;
   bağlantı parçasından okunup adres çubuğundan silinir. Uzman parolasını kendi
   belirler. Yeniden giriş adı `<çalışma-uuid>.exp01` veya `.exp02` olur.
   Daveti yenilemek hesap kurtarma sağlar; kabul edilince eski oturumlar kapanır.
3. Gerçek fosilleri P001–P010 veya F001–F060 kodlarıyla kaydedin. Bunlar hedef
   aralıklarıdır; otomatik fosil veya sonuç oluşturulmaz. Özel fiziksel fosil
   ID’si çalışmalar arasında tekrar edemez. İlişkili kaya/kaynak örnekleri aynı
   özel küme ID’sini taşımalıdır. İki uzmana aynı materyal atanır.
4. Dijital görünümleri yükleyin (tek kare 8-bit PNG/JPEG/WebP, en çok 8 MB,
   40 milyon piksel). Sunucu boyut değiştirmeden/iyileştirmeden, EXIF yönünü
   uygulayıp metadatayı kaldırarak kayıpsız PNG saklar. Orijinal ve sunulan
   görüntü hash’leri özel kayıtta, sunulan hash uzman formunda tutulur.
   Piksellerdeki cins/etiket yazısını koordinatör kontrol etmelidir. Görüntüler
   herkese açık dizine yazılmaz; yetkili API üzerinden Neo4j’den sunulur.
5. İki uzman daveti kabul ettiğinde Form B’yi açın. Hedefin altında örnek sayısı
   varsa protokol sapması zorunludur. Doğrulama kohortunda pilot inceleme ve
   protokol kesinleştirme beyanı gerekir. Materyal ve atamalar artık dondurulur.
6. İki uzmanın bütün Form B’leri kesin gönderildikten sonra Form A’yı açın.
   Aynı kişiler pilot ve doğrulama kohortlarına katılıyorsa **hiçbir çalışmada
   Form A’yı doğrulama kohortunun Form B’leri de tamamlanmadan açmayın**.
   Çalışmalar arası insan kimliği eşleştirmesi koordinatörün sorumluluğundadır.
   Pilot kullanılabilirliğini süre/eksik alan/geri bildirimle değerlendirin;
   devam eden kör gözlemlere model sonuçları açıklamayın.
7. Ayrı referans sürecini koordinatör panelinde kaydedin: REF01 gibi ayrı
   doğrulayıcı kodu, bağımsız kaynak ve kanıt. EXP01/EXP02 referans doğrulayıcısı
   olamaz. Belirsiz/kapsam dışı referanslar gerekçeli olarak dışlanır; formlar
   silinmez. Bir uzman tahmini, referans etiketi yerine geçmez.
8. Kartların ardından iki uzman Form A sonuç özeti ve bağımsızlık beyanını da
   gönderir. Uyuşmazlıkları ayrı uzlaştırma kaydına yazın. Onaylanan kural
   önerileri ontolojiyi otomatik değiştirmez. Yetkili düzeltmeler ayrı ek kayıttır;
   orijinal yanıtların yerine geçmez ve birincil analize karıştırılmaz.
9. Veri kilidi bütün atamalar, özetler ve referans kayıtları tamamlanmadan
   açılmaz. Kilit geri alınamaz; yeni değerlendirme için yeni çalışma sürümü
   oluşturun. Kilit sonrası rapor ve dışa aktarımlar açılır.

## Uzmanın iş akışı

Davet → kendi parolasını belirleme → Form B’de kayıt seçme → gözlem sayacını
başlatma → kalite ve 21 karakteri kaydetme → bağımsızlık beyanı → kesin gönderim.
Taslaklar sunucuda saklanır; aynı kaydın eski sekmeden üzerine yazılması engellenir.
Sekme gizlenince sayaç durur; dönüşte devam düğmesi kullanılır. Sunucu 30 saniyelik
tarayıcı sinyallerini kullanır; doğrulanmayan tek aralık en çok 90 saniye sayılır.
Bu yöntem gözetimsiz zaman ölçümüdür, uzmanın dikkatini kanıtlamaz.

Eksik karakterler otomatik tamamlanmaz. NOT_OBSERVABLE ve UNCERTAIN nötrdür.
Negatif değer + PRESENT geçerlidir; ABSENT durumu yalnız ABSENT/NONE değeriyle
geçerlidir. CHR_21 puana girmez. İsteğe bağlı cins/öznel güven alanı 21 durum
tamamlandıktan sonra açılır. Kesin gönderimler salt okunurdur; kendi formunuzun
JSON, CSV ve yazdırılabilir sürümünü alabilirsiniz. PDF için tarayıcıda Yazdır →
PDF olarak kaydet kullanılır. Form A’da diğer uzmanın cevapları gösterilmez.

Özel API gözlemler, gizli referanslar ve kural kartları arasındaki erişimi sunucuda
denetler. GeoKnow’un önceden herkese açık ontoloji ve tahmin araçları varlığını
korur; uzmanların oturum dışında bu kaynaklara bakmasını teknik olarak önleyemez.
Bağımsızlık beyanı ve çalışma protokolü bu dış maruziyeti kapsar.

## Analiz ve dışa aktarımlar

Rapor İngilizce Methods/Results metni, kural kararları, karakter bazında uyuşma
ve Cohen kappa, A0/B1 Top-1/Top-3, kapsama/çekimserlik, yanlış dışlamalar, duvar
modülü ve motor güven durumu tablolarını içerir. Olasılık üretmeyen motor için
olasılık kalibrasyonu `NOT ESTIMABLE` olarak belirtilir.

A0 ve B1 aynı, değiştirilmemiş gözlemleri alır. Modül yalnız gözlemcinin CHR_01
yanıtından belirlenir; referans etiketi modele verilmez. Ortak sıralarda kesirli
Top-k kredisi, çekimserlikte sıfır kredi kullanılır. Önce iki uzman aynı fosil
içinde ortalanır. 5.000 deterministik bootstrap tekrarı fosil/kaynak kümesini
birlikte yeniden örnekler. İki form iki bağımsız fosil değildir. İki kaynak
kümesinden az veri için güven aralığı, sabit marjinlerde kappa hesaplanmaz.
Pilot ve doğrulama kohortları birleştirilmez. Kural inceleme sayısı tanı doğruluğu
olarak rapor edilmez. Yazılım testi raporları belirgin biçimde işaretlidir;
makale için insan değerlendirmesi sonucu üretmez.

S10 JSON, kodlanmış kayıtlar ve sonuçları içerir. Serbest metinlerde kişisel
bilgi bulunabilir; paylaşmadan önce koordinatör yayın kontrolü yapmalıdır.
**Özel yeniden üretim arşivi** kaynak içerikleri, referans kanıtları, kaynak
kümeleri ve denetim izini içerir; uzmanlara veya açık web’e verilmez.

Çevrimdışı tekrar üretim (API dizininde):

```powershell
node scripts/validation-admin.js analyze-archive private-reproduction.json > report.json
```

## Yedekleme ve kurtarma

Neo4j’nin düzenli altyapı yedeğine ek olarak modül kayıtları şifreli dışa
aktarılabilir. En az 16 karakterli ayrı yedek parolası stdin’den verilir:

```powershell
$validationSecret = Read-Host 'Yedek şifreleme parolası' -AsSecureString
$validationCredential = [System.Net.NetworkCredential]::new('', $validationSecret)
$validationCredential.Password | node scripts/validation-admin.js backup C:/secure/study.validation-backup.json
Remove-Variable validationSecret, validationCredential
```

AES-256-GCM yedeği çalışma, özel görüntüler, hesaplar ve kaynak kilitlerini
içerir; etkin oturumlar ve davetler dahil edilmez. Parolayı ayrı güvenli yerde
saklayın. Aynı dosyanın üstüne yazılmaz. Yedekleri git deposu dışında saklayın.
Kurtarma yalnız boş modül veritabanına izin verir:
`node scripts/validation-admin.js restore-empty <dosya>` (parola stdin’den).
Kaynak ve kilit hash’leri kontrol edilir. Kurtarmayı önce ayrı test veritabanında
prova edin. Süresi dolmuş oturum/davet/oran kayıtları için
`npm.cmd run validation:admin -- purge-expired` komutunu düzenli çalıştırın.

## Doğrulama

`npm.cmd --prefix api test`, `npm.cmd --prefix client run build`.
Gerçek tarayıcı akışı için Playwright bulunan ortamda:
`node api/test/expertValidation.browser.cjs`.
Gerekirse `PLAYWRIGHT_MODULE` kurulu modülün mutlak yoludur;
`PLAYWRIGHT_CHANNEL` varsayılanı `chrome`.

API ve tarayıcı testleri izole bellek deposu ve SOFTWARE_TEST kayıtları kullanır.
Kalıcı veri/işlem testi `api/test/expertValidation.neo4j.cjs` dosyasındadır.
Yalnız yeni ve boş, silinebilir bir yerel Neo4j örneğinde çalıştırılır:
`VALIDATION_TEST_NEO4J_URI=bolt://127.0.0.1:18687`. Test bu adres dışındaki
bağlantıları ve önceden veri içeren veritabanını reddeder. Kendi test kayıtlarını
silip şifreli yedekten geri yüklediğinden mevcut veritabanında çalıştırmayın.
Üretim Neo4j verisine bağlanmaz. Dağıtım sonrası origin/proxy/çerez kontrolü
ayrıca yapılmalıdır. Görüntüler veritabanında tutulduğu için yedek
boyutu ve Neo4j depolama kapasitesi çalışma materyaline göre planlanmalıdır.

Bu uygulamada 66 API testi, gerçek Chromium ile iki uzman/koordinatör akışı ve
ayrı, sıfırdan oluşturulmuş Neo4j Community örneğinde kalıcılık, eşzamanlı işlem,
çevrimdışı yeniden üretim ve şifreli yedek/kurtarma doğrulandı. Sentetik test
raporları araştırma sonucu değildir. Üretim dağıtımı yapılmadı.

Şema kaynak belgeleri ve SHA-256 değerleri:
`api/data/expert_validation_schema.json`. V29 çevrimdışı akışı değiştirilmemiştir.
İşlem kilidi [Neo4j eşzamanlı erişim yönergesini](https://neo4j.com/docs/operations-manual/current/database-internals/concurrent-data-access/),
metadata temizliği [Sharp çıktı davranışını](https://sharp.pixelplumbing.com/api-output/) izler.
