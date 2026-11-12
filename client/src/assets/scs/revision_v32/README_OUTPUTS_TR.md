# v32 gerçek çıktı paketi

Bu teslim sayısal çıktıları ve makaledeki yerlerini verir. V31 veya izlenen v32
DOCX dosyasına işlem yapılmadı. `TRACKED_DRAFT_33_TBD_MAP.csv` 33 alanın tamamını,
`TRACKED_DRAFT_21_COMMENT_RESPONSES.csv` 21 Word yorumunu kanıt dosyalarına bağlar.
Yalnız TBD'leri kapatmak yetmez: eski sayılar içeren yorumlu tablo/paragrafları da
bu güncel CSV'lerle değiştirin.

| Ana çıktı | Güncel değer |
|---|---:|
| Karakter / cins | 21 / 75 |
| Esas durum / tüm kodlar | 131 / 171 |
| Kural / puanlanabilir kural | 708 / 494 |
| İç tutarlılık: tekil / ortak birincilik | 32 / 31 |
| İç tutarlılık: ortak-sıralı top-3 / yaprak dışlama | 79 / 0 (104 yol) |
| Doğru CONFIRMED | 19 / 27 (%70,37) |
| Tanısal eşlemesi olmayan cins | Alveolina, Psammosphaera |
| VLM panel top-1 / top-3 | %3.33 / %12.33 |
| VLM kapsam / referansın kuralla elenmesi | %88.67 / %43.33 |
| Monte Carlo: %30 maskeleme, %5 gürültü A0 top-1 / top-3 | %58.08 / %72.71 |
| Aynı koşul B1 top-1 / top-3 | %10.19 / %27.86 |
| Literatür, beş çekirdek profil A0 top-1 / top-3 | %0 / %50 |
| API / değerlendirme regresyon / CQ kontrolleri | 55 / 7 / 10 başarılı |

Tablo II, IV, VII, IX ve XII–XVI adlarıyla ayrı CSV/JSON dosyaları vardır.
`V32_NUMERICAL_SUMMARY.json` tam hassasiyetli sayıları; `raw_reports/` koşuların
ayrıntılarını, tüm 33 ayarı, 12.000 girdi/24.000 yöntem değerlendirmesini,
7 ablasyonu ve literatür profillerini içerir. İzole yerel Neo4j testinde 10 gerçek
Cypher sorgusu çalıştırıldı. Canlı veri tabanı/site değiştirilmedi.

Şekil 5–7, düzeltilmiş 150 panel tekrarından 450 dpi PNG ve vektör PDF olarak
üretildi; çizilen veriler raw_reports/figure_5_7_plotted_data.json içindedir.
Şekil 3–4, gerçek yerel uygulamanın yeni ekran görüntüleridir; HTTP makbuzu
Figure_3_4_Scoring_Receipt.json dosyasındadır. Monte Carlo ve ağırlık grafikleri
ayrıca verilir. Görsellerdeki eski numaraları otomatik eşitlemeyin; dosya başlığı
ve açıklaması hangi deneyin çizildiğini belirtir.

Önemli düzeltmeler:

- Denetim (a–i), v31 kayıtlı dosyalarında 0,0,3,0,28,28,7,11,0; v32'de
  0,0,4,0,20,2,0,0,0. Bütün kategoriler sıfır değil; (c) bir ekranlama uyarısıdır,
  (e) 20 puanlanamayan zorunlu ifadeyi, (f) iki tanısal boşluğu belirtir.
- 22 yerine 32 ağaç düğümünde hiçbir atomik veya cevap-temelli bağlama yoktur.
  Tekrarlanan farklı nitelik soruları skora veri eklemeyen yönlendirmedir;
  marjinal kord soruları tek soruda birleştirilmiştir. PORC_Q4BF önceki CHR_10
  gözlemini yanlış biçimde üzerine yazıyordu; artık yönlendirme olarak kalır.
- Yeni normalizasyon 184 ham nötr durumu (153 UNCERTAIN, 31 NOT_OBSERVABLE)
  nötr tutar. Ham değer/durum ikilisini yalnız 2 girdide değiştirir. Eski
  normalleştirilmiş dosyalarla fark 130 panelde 496 girdidir; görüntülenen cins
  14 panelde değişir. Eski φ üst sınırı 0,35 yerine 0,50'dir. Neden-sonuç
  yorumu bu sayılardan otomatik çıkmaz.
- Literatürde beş çekirdek profil doğrulandı; bunlar uzman onaylı yeni kesitler
  değildir. Karsella çekirdek dışıdır. R. sindensis yerine R. soldadensis veya
  R. polatliensis tanımı kullanılmadı. Kaynakların hepsi özgün ilk tanım değildir;
  metinde yayımlanmış tanım/yeniden tanım ayrımı korunmalıdır.
- OWL metrikleri gerçek dosyadan hesaplandı: 9.741 RDF üçlüsü, 7.098 mantıksal
  aksiyom = TBox 77 + RBox 4 + ABox 7.017. Bu koşuda OWL API 3.4.3 kullanıldı;
  eski 5.1.9 dipnotu aynen korunmamalıdır. HermiT tutarlı, 4/4 bozulma testi beklenen
  tutarsızlığı verdi. İki DifferentIndividuals kümesi 3 modül ve 171 durum içerir.
- Idalina için 761200 yumuşakça homonimidir; foraminifer AphiaID uydurulmadı.
  Otorite Schlumberger & Munier-Chalmas, 1884 ve PBDB 1662 kaynakla doğrulandı.
  Planocamerinoides 848836, kabul edilen Nummulites 520941 ile ayrı gösterilir.
- OpenAI Codex v32 kod/deney/kaynak kontrolü ve çıktı paketlemesine yardım etti.
  Yazar son metni ve kullanım beyanını kendi incelemesiyle onaylamalıdır.

S10_Protocol_Only gelecekteki uzman çalışmasına aittir; sonuç tablosu değildir.
Gerçek uzman formları/referans doğrulamaları yoktur. Zenodo DOI kaydı oluşturulmadı.
V27 tarihsel 150 panel arşivi onarılmış V29 S9 ile eşitlenmedi.

`release_snapshot/` bu çıktılara ait JSON/OWL/kodları; `SHA256SUMS.txt` her dosyanın
özetini verir. Kaynak PDF'lerin tamamı yeniden dağıtılmaz; URL/hash kayıtları
literature_source_provenance.json içindedir. Ağ veya yeni VLM çağrısı yapılmadan
eldeki arşiv üzerinden sonuçlar yeniden üretilebilir.
