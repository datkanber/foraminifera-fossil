# Zenodo ve gerçek proje DOI'si

Bu paket için yayımlanmış bir Zenodo proje kaydı oluşturulmadı. Proje DOI'si henüz yoktur. Görüntü kaynağı olan `10.5281/zenodo.13190022`, **bu yazılımın DOI'si değildir**.

Tamamlanan deney dosyalarını ve kodu içeren yerel sürüm adayı arşivi `release_candidate/` altında hazırlanır. Bu arşiv yayımlanmış GitHub v1.0 sürümü veya Zenodo kaydı olarak sunulamaz. Çalışma kopyasının temel Git commit'i ve dosya SHA-256 değerleri arşiv manifestinde tutulur. Portre, biyografi için sağlanmıştır; açık araştırma veri arşivine dahil edilmez.

## Gerçek DOI alma

1. Son kaynak kodu, ek dosyalar, kullanım hakları ve yazar/katkı listesi gözden geçirilir. Paket içindeki kural başına literatür kaynağı ve stratigrafik aralık gibi henüz kürasyonu yapılmamış alanlar tamamlanır veya açıkça kapsam dışında bırakılır.
2. Zenodo hesabına GitHub bağlanır. Zenodo profil menüsündeki GitHub bölümünde ilgili herkese açık depo etkinleştirilir: https://github.com/datkanber/foraminifera-fossil .
3. Gözden geçirilen commit için GitHub'da gerçek `v1.0` sürümü yayımlanır. Etkinleştirilen entegrasyon yeni sürümü Zenodo'ya arşivler. Sürüme ait Zenodo kaydının DOI'si kopyalanır; makalede sürümün DOI'si kullanılır.
4. Manuel yükleme seçilirse Zenodo'da yeni yükleme taslağı oluşturulur, arşiv ve metadata eklenir. “Get a DOI now!” ile gerçek DOI rezerve edilebilir. Rezerve edilmiş DOI ile yayımlanmış kayıt ayrımı korunur; taslak DOI'si aktif yayımlanmış arşiv gibi tanıtılmaz.
5. Kayıt yayımlandıktan sonra `ZENODO_PROJECT_DOI_STATUS.json` gerçek kayıt URL'si ve DOI ile güncellenir. DOCX'teki yer tutucu ancak aynı proje/sürüme ait doğrulanmış bu DOI ile değiştirilir.

Bu oturumda Zenodo hesabında oturum açma/yayımlama bağlantısı sağlanmadığından gerçek proje DOI'si üretildiği iddia edilmez. API anahtarı veya parola metin belgelere eklenmez.

Resmî kaynaklar:

- Zenodo GitHub entegrasyonu: https://help.zenodo.org/docs/github/enable-repository/
- GitHub üzerinden arşivleme: https://docs.github.com/en/repositories/archiving-a-github-repository/referencing-and-citing-content
- Zenodo DOI rezervasyonu: https://help.zenodo.org/docs/deposit/describe-records/reserve-doi/
- Yeni yükleme: https://help.zenodo.org/docs/deposit/create-new-upload/
