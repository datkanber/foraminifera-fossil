# Mevcut sitede uzman alanını çalıştırma

17 Kasım 2026 kontrolünde canlı `/api/expert-validation/auth/session` adresi
`200 text/html` ile sitenin ana sayfasını döndürüyordu. Mevcut Render API'sindeki
aynı yol ise `404 Cannot GET` dönüyordu. Bu nedenle yalnızca istemci dosyalarını
yeniden yayımlamak uzman girişini çalıştırmaya yetmez. Oturum API'si de güncel
sunucu koduyla çalışmalı ve aynı alan adı üzerinden erişilebilir olmalıdır.

İstemci artık bu yanıtları oturum kabul etmez; beyaz ekran yerine giriş formunu
ve servis erişim uyarısını gösterir. Bu değişiklik sunucuda hesap oluşturmaz.

## API ve istemciyi güncelleme

Mevcut barındırma ortamınızı kullanın. API'nin başlangıcı `api/server.js`,
çalıştırma komutu `npm start` (çalışma dizini `api/`) olur. Bağımlılıklar için
`npm ci` kullanın. Çalışma anında sürüm kilidi oluşturabilmek için yalnız `api/`
dizini değil, bütün depo sunucuda bulunmalıdır.

API ortamında şunları ayarlayın:

```text
NODE_ENV=production
PORT=5000
VALIDATION_APP_ORIGIN=https://geoknow.asrlab.cloud
VALIDATION_GIT_COMMIT=<yayımladığınız 40 karakterlik commit>
NEO4J_URI=<sunucunun erişebildiği veritabanı adresi>
NEO4J_USERNAME=<veritabanı kullanıcısı>
NEO4J_PASSWORD=<veritabanı parolası>
```

`VALIDATION_NEO4J_DATABASE` ile gerekiyorsa veritabanını seçin. Gerçek sırları
barındırma ortamının gizli ayarlarında saklayın. Veritabanı hazırlama, yedekleme
ve koordinatör oluşturma komutları [kurulum kılavuzundadır](EXPERT_VALIDATION.md).
Yerel staging hesabı başka bir veritabanına kendiliğinden aktarılmaz.

İstemciyi `client/` dizininde `npm ci` ve `npm run build` ile oluşturup mevcut
statik site köküne `client/dist` içeriğini yayımlayın.

## Aynı alan adında API yönlendirmesi

`/api/expert-validation/*` istekleri SPA'nın `index.html` geri dönüşüne girmeden
güncel Express API'ye yönlenmelidir. Kimlik doğrulaması aynı alan adındaki
HttpOnly çerezlerini kullanır. İstemci adresini uzak API alan adına çevirmek
yerine, mevcut ters vekilinizde bu yolu yönlendirin.

Nginx kullanıyorsanız, mevcut HTTPS `server` bloğunuz için örnek:

```nginx
# API aynı makinede 5000 portunda çalışıyorsa:
location ^~ /api/expert-validation/ {
    proxy_pass http://127.0.0.1:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache off;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

API ayrı konteynerdeyse `127.0.0.1:5000` yerine onun iç ağ adresini kullanın.
İstemci ile API arasında yalnız bir güvenilen ters vekil varsa API'de
`VALIDATION_TRUST_PROXY_HOPS=1` ayarlayın; gerçek vekil zincirinize göre belirleyin.
Özel API yollarına CDN önbelleği veya HTML hata sayfası uygulamayın. Depodaki
`client/vercel.json` yalnız onu okuyan platformlarda etkilidir; Nginx veya başka
bir sunucu bu dosyadan yönlendirme oluşturmaz.

## Yayım sonrası kontrol

Çerezsiz bir terminal isteğiyle kontrol edin:

```sh
curl -i https://geoknow.asrlab.cloud/api/expert-validation/auth/session
```

Beklenen yanıt `401`, `Content-Type: application/json` ve oturum gerektiğini
belirten JSON'dur. `200 text/html` yanlış statik yönlendirme, `404 Cannot GET`
ise eksik/eski API dağıtımı anlamına gelir. `503` JSON gelirse API çalışıyordur;
veritabanı bağlantısını ve sunucu günlüklerini kontrol edin.

Ardından gizli pencerede `/expert-validation` adresini açın. Oluşturduğunuz
koordinatör hesabıyla giriş yapın, bir çalışma oluşturun ve EXP01/EXP02 davetlerini
üretin. Uzman daveti kabul ederken kendi parolasını belirler. Kullanım sayfası
`/uzman-rehberi` adresindedir.

Yerel regresyon kontrolleri:

```sh
npm --prefix client test
npm --prefix client run build
node api/test/expertValidation.unavailable.browser.cjs
node api/test/expertValidation.browser.cjs
```

Tarayıcı kontrolleri kurulu Playwright ve Chrome kullanır; gerekirse Playwright
modül yolunu `PLAYWRIGHT_MODULE` değişkeniyle verin. Testler yalnız yerel yazılım
test verisi kullanır, canlı hesaplara veya bilimsel kayıtlara yazmaz.
