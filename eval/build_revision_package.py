"""Assemble a self-contained offline replay package; no publishing or API calls."""
from evaluation_common import *
import shutil, zipfile, platform, importlib.metadata

DEST=ROOT/'client/src/assets/scs/revision_v28'
PACKAGE='Foraminifera_v28_Revision_Package.zip'

def main():
    DEST.mkdir(parents=True,exist_ok=True)
    beforeafter=read(OUT/'before_after_summary.json');mc=read(OUT/'monte_carlo_summary.json');audit=read(OUT/'audit_repairs.json')
    facts={'date':'2026-11-11','project_doi':None,'external_expert_validation_performed':False,
      'original_18_missing_diagnostics_completed':3,'original_18_remaining':15,'current_total_genera_without_scoring_D':28,
      'audit_target_before_after':{'positive_C_overlap':[17,0],'M_D_conflicts':[10,0],'duplicate_scoring_pairs':[25,0]},
      'mapping_edits':len(audit['changes']),'n_paths':104,'n_panels':150,'n_panel_genera':24,
      'source_overlapping_panels':122,'n_sensitivity_configurations':33,'threshold_grid_size':27,
      'monte_carlo':{'genera':75,'repeats':20,'requested_masking':[.1,.3,.5],'requested_noise':.05,'seed':20261111,'inputs_including_controls':12000,'model_evaluations':24000},
      'before_after_overall':[x for x in beforeafter if x['module']=='ALL'],'owl':read(OUT/'ontology_metrics.json'),
      'monte_carlo_requested_results':[x for x in mc if x['missing_requested'] in [.1,.3,.5] and x['noise_requested']==.05],
      'numbering':'Internal consistency: V27/V28 Table VIII (legacy Table XIV); ontology metrics: S10.4 (legacy Table VII); new sensitivity Table XII, synthetic comparison Table XIII.',
      'live_database_updated':False,'pdf_page_layout_verified':False,
      'limitations':'Structural encoding repairs and KB-derived development analyses; 15 original diagnostic gaps remain, panel accuracy decreases, and synthetic superiority is not external validation.'}
    (DEST/'MANUSCRIPT_FACTS_V28.json').write_text(json.dumps(facts,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    (DEST/'README_TR.md').write_text('''# V28 — yeni denetim ve çevrimdışı deney paketi

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
''',encoding='utf-8')
    (DEST/'INTEGRATION_PROMPT_TR.md').write_text('''Ekli V28 DOCX ve Foraminifera_v28_Revision_Package.zip dosyasını esas al.
MANUSCRIPT_FACTS_V28.json, CHANGES_TR.md, README_TR.md ve S10 ekini oku.
Yalnızca gerçek hesaplanan sayıları kullan. Table VIII iç tutarlılık sonuçlarını,
Table XII duyarlılık sonuçlarını, Table XIII sentetik B1 karşılaştırmasını ve
S10.4 OWL metriklerini koru. Fig.3 güncel ana güven grafiği, Fig.4 sentetik stres
grafiğidir. Eski S1–S9 sonuçlarını yeni masterla karıştırma.

İlk 18 tanısal boşluğun 15'inin kaldığını; toplam 28 cinsin D kuralının
puanlanamadığını; elenen yolların 17'den 19'a yükseldiğini ve panel başarısının
düştüğünü gizleme. Sentetik üstünlüğü bağımsız uzman doğrulaması veya saha
doğruluğu olarak sunma. Olmayan DOI, insan değerlendirmesi veya hakem puanı ekleme.

V28'i değiştirmeden ayrı bir V29 dosyası oluştur. İki sütun düzenini, tablo
taşmalarını, şekil oranlarını ve sayfa sonlarını Word/PDF üzerinden kontrol et.
Bu ortamda DOCX için PDF sayfa kontrolünün tamamlanmadığını dikkate al.
''',encoding='utf-8')
    # Normalize a Windows PowerShell redirection log for portable reading.
    for p in OUT.glob('*.txt'):
        data=p.read_bytes()
        if data.startswith((b'\xff\xfe',b'\xfe\xff')):p.write_text(data.decode('utf-16'),encoding='utf-8')
    result_dir=DEST/'results';result_dir.mkdir(exist_ok=True)
    for p in OUT.iterdir():
        if p.is_file():shutil.copy2(p,result_dir/p.name)
    generated=DEST/'generated_ontology';generated.mkdir(exist_ok=True)
    shutil.copy2(ROOT/'foram_ontology_v1.owl',generated/'foram_ontology_v1.owl')
    entries={}
    def add(p,arc=None):
        if p.is_file():entries[arc or p.relative_to(ROOT).as_posix()]=p
    for p in DEST.iterdir():
        if p.is_file() and p.name not in [PACKAGE,'SHA256SUMS.txt']:add(p,'delivery/'+p.name)
    for p in (ROOT/'eval').iterdir():
        if p.is_file() and p.suffix in ['.py','.cjs','.ps1','.md','.txt']:add(p)
    for dirname in ['eval/results','eval/archive/pre_audit_20261111','api/data','api/src','api/test']:
        for p in (ROOT/dirname).rglob('*'):
            if p.is_file() and '__pycache__' not in p.parts and p.suffix in ['.json','.csv','.txt','.js','.cjs','.owl']:add(p)
    for name in ['api/package.json','api/package-lock.json','api/server.js','foram_ontology_v1.owl','LICENSE','LICENSE-DATA']:add(ROOT/name)
    for p in PANEL.iterdir():
        if p.is_file() and p.suffix in ['.json','.csv']:add(p)
    for dirname in ['raw','images']:
        for p in (PANEL/dirname).iterdir():
            if p.is_file() and p.suffix in ['.json','.png']:add(p)
    for p in (ROOT/'client/src/assets/scs/supplementary/S5_image_panel').rglob('*'):add(p)
    for name in ['download_sources.py','prepare_image_panel.py','requirements_prepare.txt']:add(ROOT/'client/src/assets/scs/reproduce'/name)
    source=Path(read(OUT/'manuscript_changes.json')['source'])
    add(source,'source_manuscript/Foraminifer_Manuscript_v27_IEEE_Access.docx')
    # Exclude all real environment files and inspect exact local credential values
    # without printing them. The package is never uploaded by this script.
    secrets=[]
    import re
    for env in [ROOT/'api/.env',ROOT/'api/.env.local',ROOT/'client/.env']:
        if env.exists():
            for line in env.read_text('utf-8').splitlines():
                if '=' not in line or line.lstrip().startswith('#'):continue
                key,value=line.split('=',1);value=value.strip().strip('"').strip("'")
                if re.search('KEY|PASSWORD|SECRET|TOKEN',key,re.I) and len(value)>=8:secrets.append(value.encode())
    for arc,p in entries.items():
        assert not p.name.startswith('.env'),arc
        if p.suffix in ['.js','.cjs','.py','.ps1','.md','.json','.txt','.csv']:
            data=p.read_bytes();assert not any(secret in data for secret in secrets),'Local credential found in package input: '+arc
    manifest=[{'path':arc,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for arc,p in sorted(entries.items())]
    with zipfile.ZipFile(DEST/PACKAGE,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for arc,p in sorted(entries.items()):z.write(p,arc)
        z.writestr('PACKAGE_MANIFEST.json',json.dumps(manifest,indent=2)+'\n')
    with zipfile.ZipFile(DEST/PACKAGE) as z:assert z.testzip() is None
    hashes=[]
    for p in sorted(DEST.rglob('*')):
        if p.is_file() and p.name!='SHA256SUMS.txt':hashes.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(DEST).as_posix())
    (DEST/'SHA256SUMS.txt').write_text('\n'.join(hashes)+'\n',encoding='utf-8')
    print(json.dumps({'package':str((DEST/PACKAGE).relative_to(ROOT)),'bytes':(DEST/PACKAGE).stat().st_size,'archive_files':len(entries)+1,'crc_check':True,'local_credential_scan':True,'files_in_hash_manifest':len(hashes)}))

if __name__=='__main__':main()
