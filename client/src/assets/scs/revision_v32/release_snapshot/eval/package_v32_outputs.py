"""Package v32 evidence and a read-only map of all tracked-draft TBD fields."""
from evaluation_common import *
from pathlib import PurePosixPath
import re,zipfile,shutil,xml.etree.ElementTree as E

DEST=ROOT/'client/src/assets/scs/revision_v32'
TRACKED=Path(r'C:\Users\burak\Downloads\Foraminifer_Manuscript_v32_draft_tracked.docx')
def load(n):return json.loads((DEST/n).read_text('utf-8-sig'))
def save(n,j):
    p=DEST/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def csvout(n,rows):
    p=DEST/n;p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('w',encoding='utf-8-sig',newline='')as f:w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def pct(x):return f'{100*x:.2f}'
def tbd_map():
    s=load('V32_NUMERICAL_SUMMARY.json');norm=load('normalization_details.json');table=list(csv.DictReader((DEST/'Table_XII_Internal_Consistency.csv').open(encoding='utf-8-sig')));lookup={r['module'].lower():r for r in table}
    w='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    with zipfile.ZipFile(TRACKED)as z:root=E.fromstring(z.read('word/document.xml'))
    parents={c:p for p in root.iter()for c in p}
    def text(n):return ''if n.tag==w+'del'else (n.text or '')if n.tag==w+'t'else ''.join(text(c)for c in n)
    mapped=[]
    for pi,p in enumerate(root.iter(w+'p')):
        paragraph=text(p);tokens=list(re.finditer(r'\[TBD[^\]]*\]',paragraph))
        for ordinal,match in enumerate(tokens):
            token=match.group();value=None;source='';ancestor=p
            while ancestor in parents and ancestor.tag!=w+'tc':ancestor=parents[ancestor]
            if ancestor.tag==w+'tc':
                tr=parents[ancestor];cells=list(tr.findall(w+'tc'));col=cells.index(ancestor);module=text(cells[0]).strip().lower();r=lookup[module]
                field={2:'rank1_unique',3:'rank1_tied',4:'top3_shared_rank',6:'CONFIRMED'}[col]
                value=f"{r['confirmed_correct']} / {r['confirmed_total']}"if field=='CONFIRMED'else r[field];source='Table_XII_Internal_Consistency.csv'
            elif 'encoded by' in paragraph:
                value='Alveolina; Psammosphaera'if'names'in token else 'Alveolina: second chamberlet tier and early-growth qualifiers; Psammosphaera: coarse wall sediment grains. Independent scalar character facets are still required.';source='knowledge_base_inventory.json'
            elif 'Knowledge-base integrity audit' in paragraph:
                value='eval/bind_tree_vocabulary.py'if'script'in token else 'Alveolina; Psammosphaera';source='audit_counts.json; raw_reports/vocabulary_tree_repairs.json'
            elif 'where a character is queried twice' in paragraph:
                value='Repeated refinements are routing-only and do not overwrite earlier evidence; heterogeneous routing uses explicit per-answer bindings. The marginal-cord questions are collapsed into one observation.';source='raw_reports/vocabulary_tree_repairs.json'
            elif 'unique first ranks changed' in paragraph:
                value=['32','31','PORC_Q4BF was a later refinement misbound to CHR_10; its SIMPLE branch overwrote the earlier SUBDIVIDED evidence. It is now routing-only, as are other distinct refinements. The INVOLUTE Palaeonummulites route is moved to its compatible branch.'][ordinal];source='Table_XII_Internal_Consistency.csv; raw_reports/vocabulary_tree_repairs.json'
            elif 'Implementation checks:' in paragraph or 'unit and regression tests' in paragraph:
                value=str(s['tests']['API']);source='raw_reports/api_tests.txt'
            elif 'rankings were stable' in paragraph:
                value=str(s['threshold_details']['path_confirmed_delta_'+str(ordinal+2)]);source='Table_XV_All_33_Configurations.csv'
            elif paragraph.startswith('Normalization:'):
                value=str(norm['raw_character_entries_changed_by_v32']);source='normalization_details.json; definition is the (value,state) tuple, excluding reason text'
            elif 'The earlier normalization' in paragraph:
                value=[str(norm['panels_with_value_or_state_changes']),str(norm['full_sheet_or_metadata_changes']['display_changed']),'2.67%'][ordinal];source='normalization_details.json; Table_XV_All_33_Configurations.csv (panels_legacy_normalized/A0)'
            elif 'As a first check on input' in paragraph:
                value='Pseudolacazina oeztemueri; Alveolina haymanaensis; Discocyclina seunesi; Laffitteina erki; Orbitoclypeus haymanaensis. Only unambiguous written statements are mapped; unstated traits remain neutral, and wall composition is not inferred from genus labels. Sources include published redescriptions, so replace original descriptions with published descriptions and redescriptions.';source='LITERATURE_CASE_NAMES.json; raw_reports/literature_profiles.json'
            elif 'For the five remaining profiles' in paragraph:
                value='B1: top-1 5.16%, top-3 15.47%, coverage 100%, reference exclusion 40%; A0: coverage 60%, reference exclusion 40%.';source='raw_reports/literature_benchmark_results.json'
            assert value is not None,('Unmapped TBD',pi,token)
            mapped.append({'TBD_id':f'TBD_{len(mapped)+1:02}','accepted_view_paragraph_index':pi,'placeholder':token,'replacement':str(value),'evidence_file':source,'context':paragraph})
    assert len(mapped)==33,len(mapped);csvout('TRACKED_DRAFT_33_TBD_MAP.csv',mapped);save('TRACKED_DRAFT_33_TBD_MAP.json',mapped)

def main():
    assert V32;s=load('V32_NUMERICAL_SUMMARY.json');norm=load('normalization_details.json');ont=load('Table_VII_Ontology_Metrics.json');inv=s['inventory'];tbd_map()
    raw=DEST/'raw_reports';raw.mkdir(exist_ok=True)
    for p in OUT.iterdir():
        if p.is_file()and p.suffix in ['.json','.csv','.txt']and p.name!='api_tests_initial.txt':shutil.copyfile(p,raw/p.name)
    snap=DEST/'release_snapshot';snap.mkdir(exist_ok=True)
    for p in (ROOT/'api/data').glob('*.json'):q=snap/'api/data'/p.name;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,q)
    code=['api/src/services/scoring.js','api/src/services/observationNormalization.js','api/src/services/wormsService.js','api/src/controllers/diagnoseController.js','api/src/controllers/vlmController.js','api/src/prompts/visionObserver.js','api/import_ontology.js','client/src/pages/Fossils.js','foram_ontology_v1.owl']
    for name in code:
        q=snap/name;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,q)
    for name in ['evaluation_common.py','engine_bridge.cjs','audit.py','bind_tree_vocabulary.py','consistency_and_audit.py','section_context.py','monte_carlo.py','sensitivity.py','revision_report.py','plot_revision.py','plot_v32_panels.py','generate_ontology.py','validate_ontology.py','test_revision.py','literature_description_benchmark.py','export_v32_handoff.py','package_v32_outputs.py','V32OntologyMetrics.java','V32Neo4j.java','run_v32_graph_checks.cjs','capture_v32_app.cjs']:
        q=snap/'eval'/name;q.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/'eval'/name,q)
    # Only source URLs/checksums are shared, not whole upstream copyrighted papers.
    provenance=[]
    for p in (OUT/'sources').glob('*.json'):
        if p.name.endswith(('.source.json','.provenance.json')):provenance.append({'record_file':p.name,**json.loads(p.read_text('utf-8'))})
    save('literature_source_provenance.json',provenance)
    src=ROOT/'client/src/assets/scs/supplementary/S1_knowledge_base/S1_WoRMS_authorities.csv'
    with src.open(encoding='utf-8-sig',newline='')as f:authorities=list(csv.DictReader(f))
    for r in authorities:
        r.update(PBDB_taxon_no='',PBDB_url='',rejected_homonym_AphiaID='',curation_scope='Historical 2026-11-09 raw WoRMS lookup; not re-queried in this release')
        if r['queried_genus']=='Idalina':r.update(lookup_status='non_foraminifer_homonym_rejected',aphia_id='',authority='Schlumberger & Munier-Chalmas, 1884',status='Foraminifer AphiaID unresolved',accepted_name='',accepted_aphia_id='',phylum='Foraminifera',family='Hauerinidae',source_url='https://forams.treatise.geolex.org/displayInfo.php?genera=Idalina',PBDB_taxon_no='1662',PBDB_url='https://paleobiodb.org/classic/basicTaxonInfo?taxon_no=1662',rejected_homonym_AphiaID='761200',curation_scope='2026-11-12 live WoRMS + PBDB + Treatise; no foraminifer AphiaID invented')
        if r['queried_genus']=='Planocamerinoides':r.update(aphia_id='848836',authority='Cole, 1958',status='unaccepted',accepted_name='Nummulites',accepted_aphia_id='520941',curation_scope='2026-11-12 live WoRMS; retain flagged historical local genus concept')
    csvout('S1_WoRMS_authorities_v32.csv',authorities)
    mc=s['monte_carlo_30percent_mask_5percent_noise'];a=next(r for r in mc if r['model']=='A0');b=next(r for r in mc if r['model']=='B1');pan=s['primary_panel_metrics']
    oldPhi='Do not retain the old maximum neutral fraction 0.35; the current maximum is 0.50 (10 of 20 entries). Do not infer a monotonic relation from the old plot.'
    replies={
     0:f"30% requested masking / 5% noise: A0 Acc@1={pct(a['acc1'])}%, Acc@3={pct(a['acc3'])}%; B1={pct(b['acc1'])}%/{pct(b['acc3'])}%. Realized masking={pct(a['mask_fraction_realized'])}%. Weight-variant path RBO range={s['weight_RBO_range_paths'][0]:.5f}–{s['weight_RBO_range_paths'][1]:.5f}.",
     1:f"Corrected primary panel replay: Acc@1={pct(pan['acc1'])}%, Acc@3={pct(pan['acc3'])}%; use Table_XVI_Panel_Results.csv for intervals. Recheck the abstract word count after author integration.",
     2:'R. sindensis is unresolved, not silently substituted. Sirel and Deveciler 2018 reassigns Turkish material to R. polatliensis. In Serra-Kiel et al. 2020 p.53, the adjacent morphological description is R. soldadensis; R. sindensis occurs in comparisons. Literature source records document the distinction.',
     3:f"21 characters; {inv['substantive_values']} substantive values, {inv['controlled_values']} total coded values including {inv['response_tokens']} response tokens. Update Table II and any figure counts.",
     4:f"Rules={inv['rule_items']}; scoring={inv['scoring_rules']} ({inv['scoring_share_percent']:.2f}%); character-only={inv['character_only_rules']}; empty mappings={inv['rules_without_any_mapping']}; non-scoring={inv['non_scoring_rules']}. Mapping records={inv['mapping_records']} ({inv['mapping_records_with_value']} with a value); HIGH/MEDIUM/LOW=363/155/22.",
     5:'Use Table_IV_Rule_Inventory.csv, including two source-supported additional D cards; total rules are 708, not 706.',
     6:f"RDF triples={ont['RDF_triples']}; logical axioms=7098, comprising TBox 77 + RBox 4 + ABox 7017. OWL API used here is 3.4.3 bundled with Owlready2/HermiT, not 5.1.9; update the footnote. Restrictions/disjointness=3/1 (15 pairs); 4/4 negative controls detected.",
     7:'v31 snapshot audit (a–i)=0,0,3,0,28,28,7,11,0; current v32=0,0,4,0,20,2,0,0,0. The claimed v31 (g)=0 is unsupported by the archived masters. Category c is a polarity screen and category e remains a real encoding limitation; do not claim all nine categories are zero.',
     8:'sectionWarning is driven by a non-neutral CHR_21=OBLIQUE or TANGENTIAL plus observed mapped CHR_07/08/12/15/17. It lists affected rules, reports scoringChanged=false, and does not alter ranks; actual HTTP/browser test passed.',
     9:'Pseudolacazina_M4 uses ANY: any observed successful alternative gives MATCH; only observing and failing every alternative gives MISMATCH; otherwise NEUTRAL. Vertebralina_C2 separately uses ALL_OBSERVED to represent an adult-planispiral compound contradiction.',
     10:'Current actual application capture confirms scenario A: Ammodiscus, score 19, CONFIRMED_GENUS, 18 excluded genera. Figures 3–4 are fresh high-resolution screenshots with an actual HTTP scoring receipt.',
     11:'Table XII current rows: AGG 36/11/10/29/0/7-of-12; PORC 42/12/17/34/0/7-of-8; HYA 26/9/4/16/0/5-of-7; total 104/32/31/79/0/19-of-27. Columns are paths/unique-first/tied-first/shared-rank-top3/excluded/correct-confirmed.',
     12:'55 API tests and 7 evaluation regression tests pass. Ten CQ queries match the master-derived projections or actual TaxonProfile records on an isolated Neo4j Community database. Browser→HTTP→data→score→render verification passed, with no page errors.',
     13:'All 12,000 inputs / 24,000 paired evaluations were recomputed with seed 20261111. Replace the full table from Table_XIII_Monte_Carlo.csv, including realized masking/noise and intervals; the old masking percentages and deltas must not be retained.',
     14:'All seven ablations A1–A7 plus A0 were recomputed on 104 current paths and 150 corrected-normalization panels. Replace the entire table from Table_XIV_Ablations.csv; the old per-cell numbers are obsolete.',
     15:f"All 33 settings are in Table_XV_All_33_Configurations.csv. Default path Acc@1/3={s['internal_fractional_acc1_percent']:.2f}%/{s['internal_fractional_acc3_percent']:.2f}%; δ=1/2/3 yields 27/25/18 confirmations. τobs=3 gives coverage 78.8462% and Acc@1 29.8344%. Thresholds preserve rankings; use the full file for every weight and state count.",
     16:f"Panel Acc@1/3={pct(pan['acc1'])}%/{pct(pan['acc3'])}%, coverage={pct(pan['coverage'])}%, rule exclusion={pct(pan['reference_exclusion'])}%. {oldPhi} Current normalization changes only 2 raw (value,state) tuples, promotes zero neutral states, differs from the legacy sheets in 496 entries across 130 panels and changes 14 displayed genera. Source-overlap limits remain.",
     17:'Historical raw lookup: 42 name records + 33 no-record names; one returned record is molluscan. Thus 41 usable foraminifer records and 34 names without a usable foraminifer AphiaID remain, including Idalina. Idalina authority and PBDB 1662 are verified; AphiaID 761200 is rejected. Planocamerinoides 848836 is unaccepted, accepted target Nummulites 520941. Only these two names were re-queried on 2026-11-12.',
     18:'Use the actual outcome tables, retaining the negative literature and VLM findings. No expert-reviewed study or independent thin-section accuracy estimate has been completed. Internal confirmation precision is 70.37%, below the proposed 85% target.',
     19:'Factual disclosure to consider: OpenAI Codex assisted with v32 code revisions, deterministic evaluations, source checks, browser verification and output packaging. Keep the earlier Claude disclosure if accurate. This package does not assert author approval of AI-generated edits.',
     20:'The five core profiles are Pseudolacazina oeztemueri, Alveolina haymanaensis, Discocyclina seunesi, Laffitteina erki and Orbitoclypeus haymanaensis. A0=0%/50% top-1/top-3, coverage 60%, exclusion 40%; B1=5.1553%/15.4658%, coverage 100%, exclusion 40%. Karsella is an out-of-core scored probe and R. sindensis is not scored because the reference-description conflict is unresolved. Sources mix original descriptions and redescriptions; these are development probes, not EXPERT_VERIFIED forms.'}
    csvout('TRACKED_DRAFT_21_COMMENT_RESPONSES.csv',[{'Word_comment_id':k,'response':v}for k,v in replies.items()]);(DEST/'TRACKED_DRAFT_COMMENT_RESPONSES_TR_EN.md').write_text('\n\n'.join(f'**Word comment {k}**\n\n{v}'for k,v in replies.items())+'\n',encoding='utf-8')
    rbo=s['weight_RBO_range_paths'];pooled=next(r for r in load('raw_reports/panel_stratified_results.json')if r['dataset']=='panels'and r['group_type']=='ALL')
    def ci(metric):
        x=pooled['intervals'][metric];return f"{pct(x['mean'])}% [{pct(x['low'])}, {pct(x['high'])}]"if x['low']is not None else f"{pct(x['mean'])}% [N/A]"
    (DEST/'V32_VERIFIED_VALUES_EN.md').write_text(f'''# Verified v32 values for author integration

These paragraphs give actual outputs and their scope. No manuscript has been edited.

**Knowledge-base inventory (Tables II and IV).** The current master has 21 characters, 131 substantive states and 171 coded values including 40 response tokens. Its 708 rules include 494 scoring rules (69.77%) and 214 non-scoring hints: 10 have character-only mappings and 204 have no mapping. There are 540 mapping records, 527 with a controlled value; mapping-confidence counts HIGH/MEDIUM/LOW are 363/155/22. The two genera without a scored diagnostic rule are Alveolina and Psammosphaera. Their unrepresented qualifiers remain hints rather than duplicated mandatory evidence.

**Audit and routing (Sections IV-B and VIII-B).** The archived v31-master audit (a–i) is 0, 0, 3, 0, 28, 28, 7, 11, 0; v32 is 0, 0, 4, 0, 20, 2, 0, 0, 0. Thus (g)=0 must not be attributed to the archived v31 masters. The four polarity screens require interpretation, and 20 mandatory statements remain unscored. Repeated refinements no longer overwrite the earlier scalar observation. Heterogeneous routing uses explicit answer bindings, the marginal-cord questions are collapsed, and Palaeonummulites is routed through an involute branch. Thirty-two of 78 nodes have no character or answer-specific binding.

**Internal consistency (Table XII).** Of 104 paths, 32 have a unique first rank, 31 a tied first rank and 79 shared-rank top-three retrieval; none excludes its leaf. There are 27 CONFIRMED_GENUS outputs, of which 19 identify the leaf (70.37%). These retrieval counts differ from abstention-aware fractional Acc@1/Acc@3 of 34.16%/58.45% at 90.38% coverage. The proposed 85% confirmation-precision target is not reached.

**Monte Carlo (Table XIII).** At requested 30% masking and 5% state noise, A0 has Acc@1/Acc@3 of {pct(a['acc1'])}%/{pct(a['acc3'])}%; B1 has {pct(b['acc1'])}%/{pct(b['acc3'])}%. Realized masking is {pct(a['mask_fraction_realized'])}%. All conditions, achieved noise rates and 95% genus-bootstrap intervals are supplied in the CSV. There are 12,000 inputs and 24,000 paired method evaluations, seed 20261111. These are knowledge-base-derived synthetic inputs, not independent fossil accuracy.

**Sensitivity (Table XV).** Across the five weight alternatives the path RBO ranges from {rbo[0]:.5f} to {rbo[1]:.5f}. The 27 threshold configurations preserve score rankings. At default observation/no-match thresholds, delta=1/2/3 yields 27/25/18 confirmations. Raising tau_obs from 2 to 3 changes path coverage from 90.3846% to 78.8462%, and Acc@1 from 34.1613% to 29.8344%. All 33 settings and all eight A0/A1–A7 rows are supplied separately; old cells must not be retained.

**Corrected panel replay (Table XVI; Figures 5–7).** On the 150 archived unreviewed panels, Acc@1 is {ci('acc1')}, Acc@3 is {ci('acc3')}, coverage is {ci('coverage')}, and rule-based reference exclusion is {ci('reference_excluded')}. Intervals use 2,000 source/section-cluster bootstrap resamples, seed 20261111. Cohort and module values are provided in the CSV. The 122 book panels overlap the knowledge-base reference source and the results remain descriptive.

**Normalization.** The current normalizer changes two raw character (value,state) tuples and promotes zero neutral states. It preserves the 153 UNCERTAIN and 31 NOT_OBSERVABLE entries promoted by the legacy routine. Under the same v32 rule base, corrected and legacy sheets differ in 496 character entries across 130 panels; 14 displayed genera and 12 confidence states change. Legacy-normalized Acc@1/Acc@3 are 2.6667%/11.6667%, versus 3.3333%/12.3333% with corrected normalization. Reference exclusion is 43.3333% in both paired conditions; this comparison does not support calling the promotion bug the sole or principal cause of exclusion. The maximum neutral fraction is 0.50, not 0.35. The denominator is CHR_01–CHR_20; CHR_21 is excluded. The active morphology count separately excludes CHR_01.

**Literature benchmark (new VIII-G).** The five core profiles are Pseudolacazina oeztemueri, Alveolina haymanaensis, Discocyclina seunesi, Laffitteina erki and Orbitoclypeus haymanaensis. A0 gives Acc@1/Acc@3 of 0%/50%, coverage 60% and reference exclusion 40%; B1 gives 5.1553%/15.4658%, coverage 100% and reference exclusion 40%. Karsella is outside the core and Ranikothalia sindensis is not scored because of the documented reference-description conflict. Sources include original descriptions and redescriptions. These source-derived development profiles are not independent thin-section specimens or EXPERT_VERIFIED observations. The prospective human study belongs in S10; its results are absent.

**Ontology (Table VII).** There are 9,741 RDF triples and 7,098 logical axioms, comprising TBox 77, RBox 4 and ABox 7,017. OWL API 3.4.3 (bundled with Owlready2/HermiT) was used here; the old 5.1.9 attribution cannot accompany these measurements. The export has three class restrictions, one disjointness axiom (15 class pairs), and two DifferentIndividuals axioms for three modules and 171 controlled values. HermiT finds no unsatisfiable named classes and detects all four isolated corrupted variants.

**Validation.** Fifty-five API tests, seven evaluation regression tests, and ten actual competency-query executions pass. The browser-to-HTTP-to-isolated-Neo4j-to-rendering flow passes with 21 character rows and no page errors. Current scenario A identifies Ammodiscus with score 19 and 18 excluded genera. A non-neutral OBLIQUE/TANGENTIAL CHR_21 produces structured warnings for observed mapped CHR_07/08/12/15/17 without changing the ranking. No production database was altered.
''',encoding='utf-8')
    protocol=DEST/'S10_Protocol_Only';protocol.mkdir(exist_ok=True)
    study=ROOT/'client/src/assets/scs/llm_expert_review_v31'
    for name in ['VIII_G_REPLACEMENT_EN.md','ENROLLMENT_TR.md','PILOT_DRAFT_SUMMARY.csv','MISSING_DATA.json']:
        if (study/name).exists():shutil.copyfile(study/name,protocol/name)
    (protocol/'SCOPE.txt').write_text('Prospective expert-review protocol only. No participant identities, reference labels, raw drafts/images or approved expert forms are included. The historical planned protocol targets frozen V29; v32 evaluation outputs in this package must not be substituted for that lock. A prospective study adopting v32 needs a separately documented pre-data version lock.\n',encoding='utf-8')
    scope={'source_manuscripts_modified':False,'v31_source_sha256':sha(Path(r'C:\Users\burak\Downloads\Foraminifer_Manuscript_v31.docx')),'tracked_draft_sha256':sha(TRACKED),'scope':'Numeric outputs and read-only TBD/comment mapping; no DOCX edits.','validation':'55 API tests, 7 regression tests, 10 actual Cypher CQ checks, HermiT base plus 4 negative controls, actual browser/API/database flow.'};save('DELIVERY_SCOPE.json',scope)
    (DEST/'README_OUTPUTS_TR.md').write_text(f'''# v32 gerçek çıktı paketi

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
| VLM panel top-1 / top-3 | %{pct(pan['acc1'])} / %{pct(pan['acc3'])} |
| VLM kapsam / referansın kuralla elenmesi | %{pct(pan['coverage'])} / %{pct(pan['reference_exclusion'])} |
| Monte Carlo: %30 maskeleme, %5 gürültü A0 top-1 / top-3 | %{pct(a['acc1'])} / %{pct(a['acc3'])} |
| Aynı koşul B1 top-1 / top-3 | %{pct(b['acc1'])} / %{pct(b['acc3'])} |
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
''',encoding='utf-8')
    package=DEST/'V32_Evaluation_Outputs_For_Tracked_Draft.zip'
    files={p.relative_to(DEST).as_posix():p for p in DEST.rglob('*')if p.is_file()and p.name not in [package.name,'SHA256SUMS.txt']}
    checks='\n'.join(sha(p)+'  '+name for name,p in sorted(files.items()))+'\n'
    with zipfile.ZipFile(package,'w',zipfile.ZIP_DEFLATED)as z:
        for name,p in sorted(files.items()):z.write(p,name)
        z.writestr('SHA256SUMS.txt',checks)
    (DEST/'SHA256SUMS.txt').write_text(checks+sha(package)+'  '+package.name+'\n',encoding='utf-8')
    print(json.dumps({'package':str(package),'files':len(files),'TBD_fields_mapped':33,'Word_comments_answered':21,'DOCX_modified':False}))

if __name__=='__main__':main()
