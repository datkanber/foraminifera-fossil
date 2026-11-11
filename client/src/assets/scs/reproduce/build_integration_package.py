"""Build the integration brief and local review archives from actual final results."""
from pathlib import Path
import collections
import hashlib
import json
import subprocess
import zipfile

ROOT=Path(__file__).resolve().parent.parent
REPO=Path(__file__).resolve().parents[5]
S=json.loads((ROOT/'supplementary/S7_image_results/S7_summary.json').read_text(encoding='utf-8'))
P=json.loads((ROOT/'evaluation/panel_manifest.json').read_text(encoding='utf-8'))
CFG=json.loads((ROOT/'evaluation/execution_config.json').read_text(encoding='utf-8'))
CAP=json.loads((ROOT/'evidence/capture_summary.json').read_text(encoding='utf-8'))
assert S['n_images']==150
assert json.loads((ROOT/'evidence/evaluation_validation.json').read_text())['all_150_successful']
COMMIT=subprocess.check_output(['git','rev-parse','HEAD'],cwd=REPO,text=True).strip()
def write(name,text):
 p=ROOT/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text,encoding='utf-8')
def pct(v): return f'{v*100:.1f}%'
def metric(e):
 if e['mean'] is None:return 'not estimable'
 if e['low'] is None:return pct(e['mean'])+' (interval not estimable)'
 return f"{pct(e['mean'])} (95% cluster-bootstrap interval {pct(e['low'])}–{pct(e['high'])})"
A,B=S['cohorts']
cohort_text=f"Additional articles (n = {A['n']}): Acc@1 = {metric(A['acc1'])}; Acc@3 = {metric(A['acc3'])}. KB-reference-book panels (n = {B['n']}): Acc@1 = {metric(B['acc1'])}; Acc@3 = {metric(B['acc3'])}."
facts={
 'base_git_commit':COMMIT,'project_doi':None,'archived_release_published':False,
 'study_type':'Exploratory, source-labelled image-panel case series; no independent human expert evaluation',
 'n_image_panels':150,'verified_independent_specimens':False,'n_reference_genera':24,
 'by_module':{'AGGLUTINATED':33,'PORCELANEOUS':37,'HYALINE':80},'runs_per_image':1,
 'model':CFG['model'],'cohorts':S['cohorts'],'overall':S['overall'],
 'source_clusters':30,'bootstrap_resamples':2000,'seed':20261109,
 'known_reference_overlap_panels':122,'additional_article_panels':28,
 'expert_review_performed':False,'expert_vlm_character_kappa_available':False,
 'human_timing_available':False,'open_set_experiment_performed':False,'weight_grid_sweep_performed':False,
 'normalization_changed_entries':S['normalization_changed_entries'],
 'smoke_probe_scope':'The larger Fig.4a development-field crop included adjacent Fig.4b, which reappears in IMG_001. No prompt/engine/image selection was tuned on accuracy; this panel is exploratory and is not a certified untouched test set.',
 'table_XIII_scenario_A':{'top_genus':'Ammodiscus','score':19,'runner_up':'Saccammina','runner_up_score':9,'margin':10,'evaluated_observations':4,'excluded_genera':18,'mandatory_exclusions':18,'strong_contradiction_exclusions':0},
 'internal_104_paths':{'rank1_unique':24,'rank1_tied':10,'top3_shared_rank':64,'leaf_excluded':17,'confirmed_correct':14,'confirmed_total':48},
 'competency_queries':{'executed':10,'master_json_matches':10},'existing_api_tests':{'passed':43,'failed':0},
 'author_photo':{'file':'Author_Photo_300dpi.jpg','width_px':465,'height_px':654,'dpi':300,'recommended_width_cm':3.0,'preserve_aspect_ratio':True},
 'limitations':S['limitations'],
}
write('MANUSCRIPT_FACTS.json',json.dumps(facts,indent=2,ensure_ascii=False)+'\n')

captions={
 'Figure 10':'Genera excluded by the running scoring engine for scenario A of Table XIII. All 18 exclusions are caused by incompatible mandatory characters; no genus is excluded primarily by a strong contradiction. The English-interface screenshot shows the first reported rule responsible for each exclusion.',
 'Figure 12':f'Tie-aware top-1 and top-3 agreement with published genus labels as a function of the fraction of unobservable characters in the exploratory image-panel evaluation ({CFG["model"]}, one pass per panel). The 28 additional-article panels and 122 panels from a knowledge-base reference book are shown separately. The latter cohort has known source overlap with the knowledge base. Fractions are binned in intervals of 0.1; empty bins are left empty. Numbers below the axes give panel counts. Vertical intervals are 95% percentile intervals from 2000 bootstrap resamples of source/section clusters; intervals are not estimated from a single cluster.',
 'Figure 13':'Confusion matrices comparing published reference genera with the genus displayed by the engine, separately for additional-article panels and panels from the knowledge-base reference book. Numbers are panel counts and colour represents the percentage within each reference genus. Abstentions are shown as separate output categories. The displayed-genus matrix uses the engine’s actual top-name output; the accuracy tables use expected uniform breaking of score ties. This figure replaces the planned expert–VLM character-agreement figure: no expert character sheets or character-level Cohen κ values were obtained.',
 'Figure 14':'Genus precision and output frequency for the engine’s five confidence states in the source-labelled exploratory evaluation. Bars show agreement with published reference genera using the declared score-tie rule; the orange line shows the share of panels receiving each state. Results from additional articles and from the overlapping reference-book source are separated. Whiskers represent 95% source/section-cluster bootstrap intervals where at least two clusters are available. Precision is undefined for abstentions and for states receiving no panels, and is marked N/A.',
 'Figure 15':'English-interface display of local TaxonProfile environmental records, with Depth, Habitat and Source values in English. The first four records are shown here; an additional screenshot contains all 18 records. Species-specific records are not automatically generalized to the entire genus.',
}
write('FIGURE_CAPTIONS_EN.md','# Figure captions\n\n'+'\n\n'.join(f'**{k}.** {v}' for k,v in captions.items())+'\n')
methods=f'''# Evidence-backed replacement text

## Methods — exploratory image-panel evaluation

Because two independent micropalaeontologists were unavailable, the planned blinded multi-expert evaluation was not conducted. Instead, an exploratory, source-labelled case series was assembled from 150 published image panels representing 24 core genera: 33 agglutinated, 37 porcelaneous and 80 hyaline panels. The unit of analysis is an image panel, not a verified independent specimen. Twenty-eight panels came from two additional articles (23 Coskinolina and five Alveolina panels); 122 came from BouDagher-Fadel (2018), a book explicitly cited as a knowledge-base reference. These cohorts were analysed separately. The additional articles are not certified to be free of rule-source overlap because per-rule bibliographic provenance is unavailable. Public-image exposure during VLM training cannot be excluded.

Panel identities and rectangular extraction coordinates were frozen before the main model run. Published taxon-name labels were excluded from the Mattern images by cropping; original structural annotations and scales remain where they fall within retained source regions. No fossil image was synthesized or enhanced. Image resolution and preparation are recorded in the panel manifest. One pass of {CFG['model']} was run per panel using the application's unchanged observation prompt and normalisation routine (temperature 0.2). Reference labels, source filenames and reference module assignments were not sent to the VLM. The normalized observations were scored by the unchanged local engine, with the module derived from the VLM's CHR_01. An incomplete Gemini 3.6 Flash attempt was stopped when the provider returned its daily free-tier quota limit; those responses are archived separately and excluded from all primary figures and metrics. The main 150-panel run uses a single model and identical frozen inputs.

Top-1 and top-3 agreement were computed against published genus labels. Ties at a score were credited according to expected uniform tie breaking, while INDETERMINATE and NO_MATCH outputs counted as errors and contributed to the coverage calculation. For a tied reference genus, credit at k is max(0,min(1,(k-a)/t)), where a genera have higher scores and t share the reference score. The unobservable fraction φ is the number of NOT_OBSERVABLE or UNCERTAIN states among CHR_01–CHR_20 divided by 20, after the application's normalisation. Precision for CONFIRMED, PROBABLE and CANDIDATE states uses the same top-1 credit; precision is undefined for abstentions. The matrix shows the actual displayed top name. Descriptive 95% intervals were obtained from 2000 bootstrap resamples of source/section clusters (seed 20261109); fewer than two clusters do not support an interval. Clustering does not establish specimen independence or representativeness.

## Results

{cohort_text}

The pooled, imbalanced 150-panel set had Acc@1 = {metric(S['overall']['acc1'])} and Acc@3 = {metric(S['overall']['acc3'])}; these pooled numbers are descriptive and do not constitute independent external validation. Coverage was {metric(S['overall']['coverage'])}, and the published reference genus was excluded in {metric(S['overall']['reference_exclusion'])} of panels. Complete image-level outputs, state-wise results and source-stratified estimates are supplied in S7 and S8.

The separate internal consistency test reproduced 104 decision-tree paths: 24 had the leaf genus uniquely at rank 1, ten had it tied at rank 1, 64 placed it within the first three shared-score ranks, and 17 excluded their own leaf genus. Fourteen of 48 CONFIRMED outputs identified the leaf genus. These are shared-rank retrieval counts, not the abstention-aware tie-fractional accuracy estimates. Seven prespecified counterfactuals were evaluated on the internal paths and the actual VLM-derived sheets (S6); they were not evaluated on expert sheets. All ten competency queries matched independently derived master-JSON answers for the recorded parameters. The existing 43 API tests passed.

## Limits and unavailable measurements

No expert-review outcomes, expert–expert or expert–system κ, expert–VLM character-level κ, human identification times, three-run repeatability, open-set rejection study or weight-grid sensitivity sweep were obtained. Such claims cannot be filled from this package. The source book overlaps the knowledge-base references; article-cohort sample size and genus coverage are narrow; panels can be correlated, annotated and low-resolution; source labels may be mistaken; public-image training exposure is unknown. Existing application normalisation is retained, and its changes to raw model states are audited in S7. Domain-specific rule provenance, stratigraphic ranges and unresolved WoRMS names still require author curation. The system remains a prototype whose errors and remaining knowledge-base audit findings must be reported.

## Source citations

- Schlagintweit, F., and Hadi, M. (2018). Coskinolina sistanensis n. sp., a new larger benthic foraminifera from the early Eocene of eastern Iran. Acta Palaeontologica Romaniae, 14(1), 47–55. https://doi.org/10.5281/zenodo.13190022 .
- Mattern, F., et al. (2024). Lithostratigraphy and Limestone Microfacies of the Jafnayn Formation (Paleocene to Early Eocene, Al-Khod, Sultanate of Oman): Deposition in a Restricted Lagoon with Intervals of Open Marine Conditions. Geosciences, 14(12), 352. https://doi.org/10.3390/geosciences14120352 .
- BouDagher-Fadel, M. K. (2018). Evolution and Geological Significance of Larger Benthic Foraminifera, second edition. UCL Press. https://doi.org/10.14324/111.9781911576938 .

Source licensing and full attribution are recorded in S5. The source-paper Zenodo DOI is not the software-project DOI.
'''
write('RESULTS_AND_METHODS_EN.md',methods)

prompt=f'''# DOCX'e ekleme için hazır prompt

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

Bu veri **150 görüntü panelidir**, doğrulanmış 150 bağımsız örnek veya iki uzmanlı kör deney değildir. Dağılım 33 aglütinat, 37 porselen, 80 hyalin; toplam 24 referans cins ve 30 kaynak/kesit kümesidir. Model **{CFG['model']}**, her panel için tek geçiştir. Uygulamanın gözlem istemi, normalizasyonu ve puanlama motoru kullanılmıştır. 3.6 Flash'ın kota yüzünden yarım kalan pilot sonuçları ana sonuçlara dahil edilmemiştir.

**122 panel, kural tabanının kaynaklarından biri olan BouDagher-Fadel (2018) kitabıyla örtüşür.** Bunları bağımsız dış test olarak sunma; 28 ek makale paneliyle ayrı raporla. Ek makalelerin de kural başına kaynak örtüşmesinden tamamen arınmış olduğu doğrulanmamıştır. Kamusal görsellerin VLM eğitiminde yer almış olabileceğini ve panel/kesit korelasyonunu sınırlılıklara ekle. Mevcut uygulama normalizasyonunun değiştirdiği ham durumlar S7'de kayıtlıdır; bunlar uzman doğrulaması sayılmaz.

Bağlantı denemesi için kullanılan daha geniş Fig.4a kesiti, komşu Fig.4b'yi de içeriyordu; bu komşu kesit IMG_001'de yer alır. Sonuç doğruluğuna göre istem, motor veya panel seçimi ayarlanmadı; yine de bu paneli hiç görülmemiş bağımsız bir test kümesi olarak niteleme.

Doğrulanmış sonuç metnini `RESULTS_AND_METHODS_EN.md` dosyasından kullan. Temel sonuçlar: {cohort_text}

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

Üç görüntü kaynağını S5'teki bibliyografik kayıtlarla kaynakçaya ekle; kullanılan her şekil/kırpım için atfı ve CC BY 4.0 koşullarını koru. Yazılım sürümü için temel commit `{COMMIT}` kaydını kullanabilirsin; paketin henüz yayımlanmış v1.0/Zenodo arşivi olduğunu iddia etme.

`ZENODO_PROJECT_DOI_STATUS.json` dosyasında `project_doi` null ise gerçek proje DOI'si henüz yoktur. `10.5281/zenodo.X` yerine sayı uydurma. Görüntü kaynağının `10.5281/zenodo.13190022` DOI'sini proje DOI'si olarak kullanma. Makalenin yayımlanabilir sürümü için proje DOI'sini “yazarın sağlaması gereken eksik bilgi” olarak ayrı listede belirt; “Zenodo'da arşivlendi” iddiasını kanıt olmadan bırakma. Paket desteklemiyorsa w3id kaydı, HermiT/OOPS çalıştırılması veya yayımlanmış sürüm gibi iddiaları yeni metne ekleme.

Son olarak DOCX'i sayfa sayfa görüntüleyip şekillerin kesilmediğini, başlıkların ve referansların doğru olduğunu, Türkçe karakter ve formüllerin bozulmadığını kontrol et. Yeni DOCX'i teslim et; değiştirilen şekilleri ve yöntem/sonuç düzeltmelerini kısaca listele. Eksik gerçek DOI ve yazar kürasyonu gerektiren alanları ayrıca belirt. Kaynak DOCX'i koru.
'''
write('DOCX_INTEGRATION_PROMPT_TR.md',prompt)

write('README_TR.md',f'''# Hazır görseller ve entegrasyon paketi

9 Kasım 2026. Kaynak DOCX değiştirilmedi. Uygulama kodu, `.env` dosyası ve bilgi tabanı değiştirilmedi.

## Ana dosyalar

- `Figure_10_Excluded_Genera_EN.png`: Tablo XIII A, gerçek uygulamada 18 eleme; 300 dpi.
- `Figure_12_Exploratory_Accuracy.png/.pdf`: gözlenemeyen karakter oranına göre gerçek görüntü sonuçları; PNG 450 dpi.
- `Figure_13_Source_Label_Confusion.png/.pdf`: yayımlanmış cins etiketleri ile motor çıktılarının karışıklık matrisi; PNG 450 dpi.
- `Figure_14_Confidence_State_Agreement.png/.pdf`: güven durumlarına göre kaynak etiketiyle uyum ve durum sıklığı; PNG 450 dpi.
- `Figure_15_TaxonProfiles_EN.png`: İngilizce alanlarla ilk dört kayıt; 300 dpi. `_all18` dosyası tüm kayıtları içerir.
- `Author_Photo_300dpi.jpg`: kullanıcı tarafından sağlanan özgün portre, 465 × 654 piksel, 300 dpi. Yaklaşık 3 cm genişlikte, en/boy oranı korunarak kullanılmalı.
- `DOCX_INTEGRATION_PROMPT_TR.md`: kaynak DOCX ve ZIP ile birlikte kullanılacak hazır prompt.
- `FIGURE_CAPTIONS_EN.md`, `RESULTS_AND_METHODS_EN.md`, `MANUSCRIPT_FACTS.json`: tutarlı İngilizce başlıklar, yöntem/sonuç metni ve kesin veri kaydı.
- `SCS_Docx_Integration_Package.zip`: ana görseller, fotoğraf, prompt ve destekleyici sonuçlar.
- `Supplementary_Materials_S1-S8.zip`: S1–S8 dosyaları, 150 görüntü, ham model yanıtları ve yeniden üretme betikleri.
- `release_candidate/foraminifera-fossil_v1.0_DRAFT.zip`: yayımlanmamış yerel sürüm adayı; gerçek v1.0/Zenodo kaydı değildir.

## Deneyin gerçek kapsamı

150 panel, 24 cins; dağılım 33 aglütinat, 37 porselen, 80 hyalin. Model {CFG['model']}, panel başına tek geçiş. Tüm 150 panelin gerçek yanıtı tamamlandı; görüntü ve model kayıtlarının SHA-256 değerleri doğrulandı. 28 panel ek makalelerden, 122 panel bilgi tabanı referans kitabından gelir. Bu ikinci grup kaynakla örtüşür ve grafiklerde ayrı raporlanır. Panel sayısı bağımsız örnek sayısı olarak yorumlanamaz. İki uzmanlı kör deney veya karakter düzeyinde uzman κ sonucu yoktur. Fig.13'ün eski açıklaması bu nedenle değiştirilmelidir.

{cohort_text}

Aralıklar 2000 tekrar kaynak/kesit-kümeli bootstrap ile hesaplandı; nüfusa genellenebilir bir dış doğrulama garantisi değildir. Ham VLM durumlarıyla mevcut uygulamanın normalize ettiği durumlar arasındaki farklar S7'de tutulur. 3.6 Flash'ın günlük kotaya takılan ilk denemesi ayrı pilot klasöründedir ve ana sonuçlara dahil değildir.

## Kontroller

- Tablo XIII A: Ammodiscus 19, Saccammina 9, fark 10, değerlendirilen gözlem 4.
- Fig.10: 18 zorunlu uyumsuzluk elemesi, ilk neden olarak güçlü çelişki elemesi 0.
- Fig.15: 18 kaydın üç İngilizce alanı API ve arayüzde doğrulandı.
- 43 mevcut API testi geçti; 10 yetkinlik sorgusu bağımsız master JSON cevaplarıyla eşleşti.
- 104 iç karar yolu ve A1–A7 karşılaştırmaları yeniden hesaplandı. Bunlar bağımsız görüntü doğruluğu değildir.
- Kaynak DOCX SHA-256'sı başlangıçla eşleşir. Ana uygulama dosyalarında değişiklik yoktur.

## Dışarıda kalan son işlemler

Gerçek proje DOI'si henüz alınmadı; `ZENODO_TR.md` ve `ZENODO_PROJECT_DOI_STATUS.json` bunu açıkça kaydeder. Yayımlanmış GitHub v1.0 sürümü ve Zenodo kaydı olmadan DOI uydurulamaz. S1'in kural başına kaynak/sayfa ve stratigrafik aralık gibi yazar kürasyonu gerektiren alanları da tamamlanmış gibi sunulmaz. S1–S8 kapsamı uzman bulunmaması nedeniyle draft makaledekinden farklıdır; entegrasyon promptu gerekli metin değişikliklerini belirtir.

## Yeniden üretme

`reproduce/download_sources.py` üç özgün kaynağı indirip SHA-256 doğrular; `prepare_image_panel.py` sabit seçimi yeniden çıkarır. `run_image_evaluation.cjs` yeniden çağrı yapmadan başarılı kayıtları sürdürür. Çalıştırırken `EVAL_MODEL=gemini-3.5-flash-lite` ve `EVAL_INTERVAL_MS=4500` ayarları kullanılmalıdır. Uygulamanın gizli API anahtarı pakete dahil edilmez. Grafikler `plot_image_results.py` ile mevcut ham kayıtlardan çevrimdışı üretilebilir. Ek açıklamalar ve lisanslar S5'tedir.
''')
write('EVALUATION_WITHOUT_EXPERTS_TR.md','# Uzmansız değerlendirme tamamlandı\n\nBu dosya önceki planın durumunu günceller. 150 panelin gerçek tek-model değerlendirmesi tamamlandı. Ayrıntılar `README_TR.md`, `RESULTS_AND_METHODS_EN.md`, `MANUSCRIPT_FACTS.json` ve S5–S8 içindedir. İki uzmanlı kör deney yapılmadı. Kaynak örtüşmesi bulunan 122 panel ayrı raporlanır; 150 panel bağımsız 150 örnek değildir. Önceki beş adayla sınırlı durum artık geçerli değildir.\n')
write('evidence/api_test_summary.json',json.dumps({'command':'npm test','working_directory':'api','date':'2026-11-09','tests':43,'passed':43,'failed':0,'exit_code':0,'basis':'Observed actual command output in this session'},indent=2))

# Keep author portrait in document package, not in openly licensed research data.
def zip_files(dest,files,base):
 with zipfile.ZipFile(dest,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted(set(files)):
   if p.is_file():z.write(p,p.relative_to(base).as_posix())
supp_files=list((ROOT/'supplementary').rglob('*'))+list((ROOT/'reproduce').glob('*'))
supp_files += list((ROOT/'evaluation').rglob('*.json'))+list((ROOT/'evaluation/images').glob('*.png'))
supp_files += [ROOT/'RESULTS_AND_METHODS_EN.md',ROOT/'MANUSCRIPT_FACTS.json']
supp_files=[p for p in supp_files if p.is_file() and '__pycache__' not in p.parts]
zip_files(ROOT/'Supplementary_Materials_S1-S8.zip',supp_files,ROOT)

release=ROOT/'release_candidate';release.mkdir(exist_ok=True)
write('release_candidate/zenodo_metadata_DRAFT.json',json.dumps({
 'title':'Foraminifera Fossil: ontology and genus-identification decision support — v1.0 release candidate',
 'upload_type':'software','version':'1.0-DRAFT','creators':[{'name':'Yayan, Kübra','affiliation':'Eskişehir Osmangazi University'}],
 'description':'Local review candidate. Code MIT; ontology/data CC BY 4.0. Source image attribution and experimental scope are supplied in S5. Creator/contributor list requires author confirmation before publication.',
 'related_identifiers':[{'identifier':'https://github.com/datkanber/foraminifera-fossil','relation':'isSupplementTo','scheme':'url'}],
 'notes':f'Base commit {COMMIT}; additional uncommitted research artifacts included. No project DOI exists and this draft has not been published. Author portrait excluded.'},indent=2,ensure_ascii=False))
tracked=subprocess.check_output(['git','ls-files','-z'],cwd=REPO).decode().split('\0')
safe=[]
for name in tracked:
 if not name:continue
 p=REPO/name
 if p.is_file() and not any(x in {'.git','.vercel','node_modules'} for x in p.relative_to(REPO).parts) and not (p.name.startswith('.env') and p.name!='.env.example'):
  safe.append(p)
candidate_path=release/'foraminifera-fossil_v1.0_DRAFT.zip'
with zipfile.ZipFile(candidate_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in safe:z.write(p,p.relative_to(REPO).as_posix())
 z.write(ROOT/'Supplementary_Materials_S1-S8.zip','research/Supplementary_Materials_S1-S8.zip')
 z.write(ROOT/'MANUSCRIPT_FACTS.json','research/MANUSCRIPT_FACTS.json')
 z.write(ROOT/'RESULTS_AND_METHODS_EN.md','research/RESULTS_AND_METHODS_EN.md')
 z.write(release/'zenodo_metadata_DRAFT.json','zenodo_metadata_DRAFT.json')
manifest_out=[]
for p in sorted(ROOT.rglob('*')):
 if p.is_file() and p.name not in ['SHA256SUMS.txt','SCS_Docx_Integration_Package.zip'] and '__pycache__' not in p.parts:
  manifest_out.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(ROOT).as_posix())
write('SHA256SUMS.txt','\n'.join(manifest_out)+'\n')
main=[p for p in ROOT.iterdir() if p.is_file() and (p.suffix in ['.md','.json','.pdf','.png','.txt'] or p.name in ['Author_Photo_300dpi.jpg','Supplementary_Materials_S1-S8.zip'])]
main += [p for p in (ROOT/'evidence').glob('*.json') if p.name!='archive_validation.json']
zip_files(ROOT/'SCS_Docx_Integration_Package.zip',main,ROOT)
print(json.dumps({'figures_12_to_14':'complete','image_panels':150,'model':CFG['model'],
 'cohort_results':cohort_text,'integration_zip_bytes':(ROOT/'SCS_Docx_Integration_Package.zip').stat().st_size,
 'release_candidate_bytes':candidate_path.stat().st_size,'project_doi':None},indent=2))
