// Prepare evidence-backed supplementary artifacts; no invented expert review.
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../../../../..');const root=path.resolve(__dirname,'../supplementary');
const load=n=>JSON.parse(fs.readFileSync(path.join(repo,'api/data',n)));
const write=(p,s)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};
const json=(p,data)=>write(p,JSON.stringify(data,null,2));
function csv(p,rows){if(!rows.length)return;const keys=Object.keys(rows[0]);const q=v=>'"'+String(typeof v==='object'?JSON.stringify(v):v??'').replaceAll('"','""')+'"';write(p,keys.join(',')+'\n'+rows.map(r=>keys.map(k=>q(r[k])).join(',')).join('\n')+'\n');}
const rules=load('rule_chr_mapping.json');const genera=['agglutinated','porcelaneous','hyaline'].flatMap(m=>load('genera_'+m+'.json').genera);
csv(path.join(root,'S1_knowledge_base/S1_genera.csv'),genera.map(g=>({genus:g.genus,module:g.module,flag:g.flag,taxonomic_review_required:g.taxonomicReviewRequired||(g.system_flags||[]).some(s=>/taxonomicReviewRequired\s*=\s*TRUE/i.test(s)),
  mandatory_rules:rules.filter(r=>r.genus===g.genus&&r.level==='M').length,diagnostic_rules:rules.filter(r=>r.genus===g.genus&&r.level==='D').length,
  scoring_diagnostic_rules:rules.filter(r=>r.genus===g.genus&&r.level==='D'&&r.mappings.some(m=>m.value)).length,
  closest_comparisons:g.closest_comparisons||[],authority_status:'See live WoRMS lookup file; missing values are unverified',
  stratigraphic_range:'Not independently curated in repository; requires author verification',per_rule_literature_provenance:'Not supplied by master files; not reconstructed from model output'})));
csv(path.join(root,'S1_knowledge_base/S1_rules.csv'),rules.map(r=>({rule_key:r.rule_key,genus:r.genus,module:r.module,level:r.level,code:r.code,text:r.text,mappings:r.mappings,mapping_status:r.status,
  source_statement_and_page:null,source_provenance_status:'Not present in supplied master data'})));
json(path.join(root,'S1_knowledge_base/S1_characters.json'),load('characters.json'));
json(path.join(root,'S1_knowledge_base/S1_rule_mappings.json'),rules);

write(path.join(root,'S3_ontology_and_trees/foram_ontology_v1.owl'),fs.readFileSync(path.join(repo,'foram_ontology_v1.owl')));
for(const m of ['agglutinated','porcelaneous','hyaline'])json(path.join(root,'S3_ontology_and_trees/decision_tree_'+m+'.json'),load('decision_tree_'+m+'.json'));
write(path.join(root,'S3_ontology_and_trees/S3_SCOPE.md'),'This supplement contains the supplied machine-readable OWL and three JSON trees. The original source ontology DOCX cited in the manuscript was not supplied and is not claimed to be included. No reasoner or OOPS run is claimed.\n');

const {buildVisionObserverPrompt}=require(path.join(repo,'api/src/prompts/visionObserver'));
write(path.join(root,'S4_vision_observer/S4_prompt.txt'),buildVisionObserverPrompt({}));
write(path.join(root,'S4_vision_observer/S4_prompt_source.js'),fs.readFileSync(path.join(repo,'api/src/prompts/visionObserver.js')));
write(path.join(root,'S4_vision_observer/S4_controller_snapshot.js'),fs.readFileSync(path.join(repo,'api/src/controllers/vlmController.js')));
write(path.join(root,'S4_vision_observer/S4_scoring_snapshot.js'),fs.readFileSync(path.join(repo,'api/src/services/scoring.js')));
json(path.join(root,'S4_vision_observer/S4_execution_config.json'),JSON.parse(fs.readFileSync(path.resolve(__dirname,'../evaluation/execution_config.json'))));

for(const name of ['panel_manifest.json','panel_manifest.csv','panel_freeze.json'])write(path.join(root,'S5_image_panel',name),fs.readFileSync(path.resolve(__dirname,'../evaluation',name)));
write(path.join(root,'S5_image_panel/S5_SCOPE.md'),`The planned 150-image two-expert blinded evaluation was not performed. This is a 150-image-panel exploratory, source-labelled case series: 28 panels from additional articles and 122 from a book cited as a knowledge-base source. The modules are imbalanced (33 agglutinated, 37 porcelaneous, 80 hyaline). There are 24 reference genera and 30 source/section clusters. Panels are not 150 verified independent specimens. One VLM pass per image; no expert character sheets, expert agreement, human timing or three-run repeatability estimates. Original figure annotations may provide cues. Image preparation is deterministic rectangular extraction/rendering; no generated or enhanced fossil imagery. Original genus labels on the Mattern figure were excluded by crop. Model input filenames and reference labels are not sent. Book/reference overlap and possible public-image training contamination limit interpretation.\n\nThe previous manuscript's S5 expert-review results are unavailable. This S5 documents the replacement image panel and must be described accordingly in the manuscript.\n`);
const sources=[
 {id:'Schlagintweit_Hadi_2018',authors:'Felix Schlagintweit; Mehdi Hadi',year:2018,title:'Coskinolina sistanensis n. sp., a new larger benthic foraminifera from the early Eocene of eastern Iran',journal:'Acta Palaeontologica Romaniae 14(1):47–55',doi:'10.5281/zenodo.13190022',url:'https://zenodo.org/records/13190022',license:'CC-BY-4.0',cohort:'Additional articles',article_figure_pages:'51–52',local_pdf:'Schlagintweit_Hadi_2018_Coskinolina.pdf'},
 {id:'Mattern_2024',authors:'Frank Mattern et al.',year:2024,title:'Lithostratigraphy and Limestone Microfacies of the Jafnayn Formation (Paleocene to Early Eocene, Al-Khod, Sultanate of Oman): Deposition in a Restricted Lagoon with Intervals of Open Marine Conditions',journal:'Geosciences 14(12):352',doi:'10.3390/geosciences14120352',url:'https://www.mdpi.com/2076-3263/14/12/352',license:'CC-BY-4.0',cohort:'Additional articles',article_figure_pages:'23, Figure 15',local_pdf:'Mattern_2024_Jafnayn.pdf'},
 {id:'BoudagherFadel_2018',authors:'Marcelle K. BouDagher-Fadel',year:2018,title:'Evolution and Geological Significance of Larger Benthic Foraminifera, Second Edition',journal:'UCL Press',doi:'10.14324/111.9781911576938',url:'https://discovery.ucl.ac.uk/id/eprint/10047587/',license:'CC-BY-4.0',cohort:'KB reference book (overlap)',article_figure_pages:'Chapter 6, numbered plate/panel in manifest',local_pdf:'BoudagherFadel_2018_LBF.pdf'},
];
json(path.join(root,'S5_image_panel/S5_sources.json'),sources);
csv(path.join(root,'S5_image_panel/S5_sources.csv'),sources);
for(const s of sources){const p=path.join(repo,'eval/literature_pilot/sources',s.local_pdf);s.source_pdf_sha256=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}
json(path.join(root,'S5_image_panel/S5_source_checksums.json'),sources);
write(path.join(root,'S5_image_panel/ATTRIBUTION_AND_LICENSES.md'),sources.map(s=>`## ${s.id}\n\n${s.authors} (${s.year}). ${s.title}. ${s.journal}. https://doi.org/${s.doi} .\n\nSource: ${s.url}\nLicense: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ .\nModification: selected figure regions extracted/cropped; source figure labels/scales retained where inside the crop; no diagnostic content synthesized. UCL and NHM collection credits remain as stated in the original captions.\n\n`).join('')+'\nThe author portrait was supplied by the user and is not included in the image-panel CC BY licence. Do not redistribute it under an assumed licence.\n');

const index={
 S1:'Knowledge-base genus/rule/character inventory and integrity audit; uncurated literature provenance explicitly marked',
 S2:'Live read-only competency-query executions; independent expected values only where derivable from master JSON',
 S3:'Supplied OWL ontology and JSON decision trees; not the missing original source DOCX',
 S4:'Actual prompt, controller, scoring snapshot and frozen execution configuration',
 S5:'Replacement source-labelled exploratory image panel; no expert review results',
 S6:'104-path internal consistency and A1–A7 counterfactuals; not expert-sheet ablations',
 S7:'Image-level real VLM responses, scoring metrics, confidence and observability tables with within-panel uncertainty',
 S8:'Per-module and source-cohort results, exclusions and reproducibility checks',
};
json(path.join(root,'SUPPLEMENTARY_INDEX.json'),index);
write(path.join(root,'README.md'),'# Supplementary Materials S1–S8\n\n'+Object.entries(index).map(([k,v])=>`- **${k}**: ${v}`).join('\n')+'\n\nScope differs from the draft manuscript because two independent experts were unavailable. Never relabel these files as completed expert review or a blinded independently sampled 150-specimen experiment. Detailed source provenance for every rule and some stratigraphic/authority fields still require author curation.\n');
console.log('S1, S3, S4, S5 and supplementary index exported. S2, S6, S7 and S8 use their separate evidence-generating scripts.');
