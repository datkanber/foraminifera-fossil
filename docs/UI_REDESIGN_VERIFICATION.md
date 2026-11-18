# Arayüz yenilemesi ve doğrulama

18 Kasım 2026

## Uygulanan değişiklikler

- Değerlendirme Alanı ve Kullanım Kılavuzu sayfaları, bunlara özel bileşenler ve stiller kaldırıldı. Navbar, tüm sayfalar menüsü, mobil menü, çeviri anahtarları ve site arama dizini temizlendi.
- Eski sayfa adresleri mevcut bilinmeyen adres davranışıyla ana sayfaya döner. Değerlendirme API'sinin uygulamaya bağlanması, koordinatör başlangıç işlemi ve Cloudflare/Vercel/geliştirme proxy bağlantıları kaldırıldı.
- Araştırma tekrarlanabilirliği için çevrimdışı analiz modülleri ve arşivlenmiş çalışma verileri korundu. Veritabanında kayıt silinmedi.
- Gece mavisi zemin, mor düğmeler, erişilebilir açık mor metin vurguları, ince kenarlı kartlar, geniş boşluklar ve beyaz footer uygulandı.
- Poppins'in 400/500/600/700 ağırlıkları, Türkçe karakterleri kapsayan Latin/Latin-ext WOFF2 dosyaları ve SIL lisansı projeye eklendi. Harici font isteği ve yeni paket bağımlılığı yok.
- Mevcut STONE duyurusu mor şeride taşındı; kapatma ve oturum boyunca gizleme davranışı korundu.
- Navbar başlangıçta koyu, kaydırıldığında beyazdır. IntersectionObserver kaydırma durumunu, ResizeObserver başlık yüksekliğini izler. Arama penceresi menünün açık/koyu renk değişkenlerinden ayrıldı.
- Hero alanlarında mor radyal gradyanlar ve kenarlarda nokta deseni; kartlarda 3px yükselme, fotoğraflarda en fazla 1.03 ölçek, menülerde yumuşak giriş ve mevcut Reveal bileşeninde görünürlük animasyonu kullanıldı. Azaltılmış hareket tercihi korundu.
- Ana sayfanın mevcut slaytları, metinleri, bağlantıları, fotoğrafları ve takson kartları korundu. Küçük ekranlarda hızlı erişim kartları iki sütuna, geniş içerikler tek sütuna geçer.
- Mobil puanlama sonuç tablosu klavyeyle odaklanabilen kendi kaydırma alanına alındı. Laboratuvar inceleme panelindeki metin ve araçlar dar ekranda taşmadan yerleşir.

## Değiştirilen dosya grupları

| Alan | Dosyalar / bileşenler |
| --- | --- |
| Rotalar ve gezinme | `client/src/App.js`, `components/Navbar.js`, `contexts/LanguageContext.js`, `data/searchIndex.js` |
| Tasarım sistemi | `styles/variables.css`, `global.css`, yeni `premium.css`, `fonts.css`, `styles/DESIGN.md` |
| Ortak sunum | Navbar, Footer, PageHero, SiteSearch ve TaxonProfileCard stilleri |
| Sayfa sunumu | Home, About, Contact, Fossils, Geology, VLM, News, Lab ve mevcut Predict stilleri |
| Mobil sonuçlar | `pages/Fossils.js` içinde yalnızca tablo kapsayıcısı; tanı olayları ve veri işleme korunur |
| Fontlar ve derleme | `assets/fonts/`, `src/index.js`, `public/index.html`, `webpack.config.js` |
| Kaldırılan bölümün yayın bağlantıları | `api/src/app.js`, `api/server.js`, `client/vercel.json`, `public/_headers`, eski Cloudflare fonksiyonu |
| Regresyon kontrolü | `api/test/retiredInterface.test.js`; kaldırılan arayüze özel istemci testi silindi |

## Doğrulanan davranışlar

- Üretim derlemesi başarılı: `cd client && npm run build`.
- API testleri: **70 geçti, 0 başarısız**. Yeni kontrol, kaldırılan API adreslerinin 404 vermesini ve sağlık uç noktasının çalışmasını doğrular.
- Chromium tarayıcısında sekiz sayfa (`/`, `/tani`, `/vlm`, `/jeoloji`, `/hakkinda`, `/iletisim`, `/haberler`, `/arama`) 320, 390, 768, 1024, 1440 ve 1920px genişliklerde kontrol edildi: **48 düzen kontrolünde yatay sayfa taşması yok**. Navbar ayrıca 1280 ve 1600px sınırlarında kontrol edildi.
- Koyu/beyaz yapışkan navbar, masaüstü açılır menüsü, mobilde sekiz sayfaya erişim ve gezinme sonrası kapanma, duyuru kapatma, TR/EN değişimi ve slayt değiştirme çalıştı.
- Kaydırılmış navbar üzerinden arama açma, sonuç yükleme, Escape ile kapanma ve odağın arama düğmesine dönmesi doğrulandı. Yerel arama alanının ilk Escape ile sorguyu temizleyen tarayıcı davranışı korundu.
- Kaldırılan sayfa adresleri ve alt adresleri ana sayfaya döndü; arama ve gezinmede bu bölümlere bağlantı kalmadı.
- Gerçek yerel Express API ve mevcut Neo4j veritabanıyla karar ağacının ilk sorusu ve puanlama isteği **HTTP 200** döndü; yanıtlar tarayıcıda soru ve sıralama tablosuna dönüştü. Test sırasında üretim adresli istekler yerel API'ye yönlendirildi; sahte yanıt kullanılmadı.
- Puanlama sonucu 320px ekranda sayfayı taşırmadı; tablo kendi alanında kaydırılabilir.
- Jeoloji araması ve boş sonuç durumu, haber fotoğraf penceresinin açılıp kapanması, görsel dosya yükleme/önizleme doğrulandı.
- 3D laboratuvar tuvali, serbest gezinmeye geçiş, örnek inceleme paneli ve röntgen kontrolü çalıştı. Mobil yeniden boyutlandırmada panel metni ekran genişliğine sığdı.
- Poppins'in yerel dosyalardan yüklendiği ve footer'ın beyaz olduğu kontrol edildi.
- Kontrol edilen arayüz akışlarında yakalanmamış JavaScript hatası yok. `git diff --check` temiz.

## Sınırlar

- Değişiklikler yerel proje dosyalarında; canlı siteye dağıtım yapılmadı.
- Görsel yapay zekânın ücretli model isteği gönderilmedi. Dosya seçimi ve önizleme test edildi; model yanıtı doğrulanmadı.
- 3D eğitim turunun tüm adımları, sınav ve ilerleme kayıtları bütünüyle tekrarlanmadı. Gerçek VR/WebXR donanımıyla kontrol yapılmadı.
- Ayrı referans ekran görüntüsü bulunmadığından piksel düzeyinde karşılaştırma yapılmadı; paylaşılan metin yönergesi ve Strapi bağlantısı esas alındı.
- Webpack, mevcut büyük fotoğraf/GLB dosyaları ve JavaScript parçaları için boyut uyarıları veriyor; derleme hatası yok.

Yerel tarayıcı kanıtları: `.tmp/premium-verification.json`, `.tmp/premium-flows-verification.json` ve `.tmp/premium-*.png`.
