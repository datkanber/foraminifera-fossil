"""Prepare identical raw drafts and independent pending review instruments."""
from expert_comparison import *
from llm_observation_drafts import STUDY,validate_draft_observations
from docx import Document
from docx.shared import Pt,Cm
import zipfile

VIII_G='''G. BLINDED EXPERT REVIEW OF LLM-DRAFTED OBSERVATIONS

This evaluation is designed as blinded expert review of LLM-drafted observations, rather than unaided expert character extraction. A coded-image pilot (P001–P010) will test draft generation, form usability, review time and correction recording. These images are previously evaluated published panels and will not be counted as independent confirmatory specimens. A model receives only the coded views and the frozen 21-character vocabulary: no reference genus, publication identity, previous prediction, rule card or A0/B1 result is supplied. It returns controlled values, observation states and short visual reasons, without a genus prediction request. Raw provider responses and immutable LLM_DRAFT records are retained with model version, prompt digest, image checksums and timestamps. NOT_OBSERVABLE and UNCERTAIN remain neutral and are never promoted automatically.

EXP01 and EXP02 will review the same raw draft independently. For every character they must explicitly approve, correct or mark the observation neutral, with corrections documented. The model draft, each expert's final sheet and the change trail remain separate. EXPERT_VERIFIED is used only for a completed form carrying the actual reviewer's approval; a raw draft or an uncompleted review cannot enter the comparison. Reference labels, the other expert's changes and algorithm outputs are withheld during review. REF01 will separately verify reference genera from collection documentation and specimen examination. Assignments, missing observations and unverified references remain pending, rather than being completed by a model or inferred from published labels. Model-assisted review can introduce anchoring; it does not measure unaided expert performance, and two fixed experts do not represent the wider specialist population.

Following pilot review and protocol/version lock, the planning target is 60 new documented fossils spanning the three wall-composition modules, with no use in rule development or the earlier evaluation. Multiple views of one fossil remain one specimen. This target is not a power calculation. The two approved sheets for each fossil will be passed unchanged to the frozen V29 A0 and B1 implementations; CHR_01 in each sheet, not the reference module, determines routing. References are joined only after scoring for metric calculation. The primary estimand is the A0-minus-B1 difference in tie-fractional top-one agreement. The two expert credits are first averaged within each fossil, then equally across fossils. A 95% interval will use 5,000 paired cluster-bootstrap resamples, retaining fossils from the same source cluster, both experts and both methods together. Top-three agreement, coverage, rule-based reference exclusion and module-based reference omission are secondary endpoints. Sixty fossils produce 120 forms, not 120 independent observations. No result table is reported until new main-study material, both expert-approved forms and verified references are available.

The supplied S1–S9 150-panel package is the V27 historical evaluation archive. It is distinct from the repaired V29 S9 snapshot cited elsewhere in the manuscript and must not be substituted for it. The frozen V29 snapshot is identified separately by its four checked file hashes. Current deliveries are preparation records and unapproved drafts; no human-reviewed performance estimate is claimed.
'''

def main(phase='pilot'):
    study=STUDY;config=read(study/'study_config.json');chars=read(study/'frozen_v29/api/data/characters.json')['characters']
    drafts={};hashes={}
    for r in csvread(study/'coordinator_private/specimen_registry.csv'):
        if r['phase']!=phase or r['enrolled']!='yes':continue
        p=study/'llm_drafts'/phase/r['specimen_id']/'draft.json'
        if not p.exists():continue
        d=read(p);validate_draft_observations(d['observations'],chars);require(d['status']=='LLM_DRAFT','Draft status changed')
        require(digest(p)==read(p.parent/'draft_seal.json')['sha256'],'Raw draft mutated');drafts[r['specimen_id']]=d;hashes[r['specimen_id']]=digest(p)
    template=(ROOT/'eval/llm_review_form.html').read_text('utf-8')
    require(drafts,'No successful LLM_DRAFT records exist for this phase')
    for i,observer in enumerate(config['observer_codes']):
        folder=study/'review_forms'/phase/observer;folder.mkdir(parents=True,exist_ok=True)
        order=sorted(drafts);random.Random(config['seed']+i).shuffle(order)
        text=template
        for token,obj in {'@@OBSERVER@@':observer,'@@CHARACTERS@@':[{k:c[k] for k in ['id','name_tr','name_en','values']} for c in chars],
                          '@@DRAFTS@@':drafts,'@@HASHES@@':hashes,'@@ORDER@@':order,'@@PHASE@@':phase}.items():text=text.replace(token,json.dumps(obj,ensure_ascii=False).replace('</','<\\/'))
        (folder/'Review_Form.html').write_text(text,encoding='utf-8')
        csvwrite(folder/'presentation_order.csv',[{'order':n+1,'image_case':sid} for n,sid in enumerate(order)])
        for sid in sorted(drafts):
            d=drafts[sid];pending={'status':'EXPERT_REVIEW_PENDING','specimen_id':sid,'phase':phase,'observer_code':observer,
              'source_draft_sha256':hashes[sid],'expert_approval':None,
              'observations':{c:{**o,'review_action':None,'review_note':''} for c,o in d['observations'].items()},
              'timing':{'started_at':None,'completed_at':None,'active_seconds':None},'attestations':None}
            save(folder/(sid+'_PENDING_TEMPLATE.json'),pending)
            doc=Document();doc.sections[0].left_margin=doc.sections[0].right_margin=Cm(1.3)
            doc.add_heading(sid+' — '+observer+' expert review',0)
            doc.add_paragraph('Status: EXPERT_REVIEW_PENDING. The following suggestions are an unapproved LLM_DRAFT. Verify each row from the coded image; no reference label or algorithm result is supplied.')
            doc.add_paragraph('Shared raw draft SHA-256: '+hashes[sid]+'\nModel: '+str(d['provenance']['model_version_returned']))
            doc.add_paragraph('Actual reviewer/name: __________  Start/end with timezone: __________  Active review minutes: ________')
            t=doc.add_table(rows=1,cols=5);t.style='Table Grid'
            for cell,v in zip(t.rows[0].cells,['Character','Raw value / state','Model visual reason','Human final value/state','Action / human note']):cell.text=v
            for c in chars:
                o=d['observations'][c['id']];cells=t.add_row().cells
                for cell,v in zip(cells,[c['id']+' '+c['name_en'],str(o['value'])+' / '+o['state'],o['reason'],'____________','Approve / Correct / Neutral\nExplanation: ______']):cell.text=v
            for row in t.rows:
                for cell in row.cells:
                    for para in cell.paragraphs:
                        for run in para.runs:run.font.size=Pt(8)
            doc.add_paragraph('Actual expert completion/approval: NOT YET GIVEN.\nSignature/role/date: __________\nBlinding: reference hidden □ other review hidden □ algorithm outputs hidden □ independent review □')
            doc.save(folder/(sid+'_Expert_Review.docx'))
        (folder/'README_TR.txt').write_text('Bu paket yalnız '+observer+' içindir. Review_Form.html dosyasını açın; kodlu görüntüyü seçip her satırı gerçekten inceleyin. Taslak değişmeden korunur. 21 karar ve gerçek onay verilmeden form kaydedilemez. Rol kodları henüz gerçek kişi/katılım teyidi değildir. Son formu koordinatöre verin. Diğer gözlemcinin verisi ve referanslar pakette yoktur. JSON PENDING şablonları tamamlanmış gözlem veya onay değildir.\n',encoding='utf-8')
        target=study/('Review_'+observer+'_'+phase.title()+'.zip')
        with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
            for p in folder.iterdir():z.write(p,p.name)
            for sid in drafts:
                z.write(study/'llm_drafts'/phase/sid/'draft.json','shared_raw_drafts/'+sid+'.json')
                for image in (study/'public'/phase/'materials'/sid).glob('*'):
                    if image.is_file():z.write(image,'materials/'+sid+'/'+image.name)
    if phase=='pilot':export_pilot_outputs(study,config,chars,drafts,hashes)
    print(json.dumps({'raw_drafts':len(drafts),'pending_review_forms':2*len(drafts),'actual_expert_verified_forms':0,'performance_table_produced':False}))

def export_pilot_outputs(study,config,chars,drafts,hashes):
    (study/'VIII_G_REPLACEMENT_EN.md').write_text(VIII_G,encoding='utf-8')
    section=Document();section.add_paragraph('PROPOSED SECTION TEXT — not an edited V31 manuscript. No expert-reviewed results are available.')
    for i,block in enumerate(VIII_G.split('\n\n')):
        if i==0:section.add_heading(block.strip(),1)
        elif block.strip():section.add_paragraph(block.strip())
    section.save(study/'VIII_G_Replacement_Proposed.docx')
    records=[];summaries=[]
    for sid,d in sorted(drafts.items()):
        states=Counter(o['state'] for o in d['observations'].values())
        summaries.append({'case_id':sid,'status':'LLM_DRAFT','character_records':len(d['observations']),
          **{state:states[state] for state in ['PRESENT','ABSENT','NOT_OBSERVABLE','UNCERTAIN']},
          'pending_expert_forms':len(config['observer_codes']),'actual_expert_approved_forms':0})
        for c in chars:
            o=d['observations'][c['id']]
            records.append({'case_id':sid,'character_id':c['id'],'character_name_en':c['name_en'],
              'value':o['value'],'state':o['state'],'visual_reason':o['reason'],'status':'LLM_DRAFT',
              'model_version_returned':d['provenance']['model_version_returned'],'generated_at':d['provenance']['generated_at'],
              'raw_draft_sha256':hashes[sid],'expert_approval':''})
    csvwrite(study/'PILOT_DRAFT_OBSERVATIONS.csv',records);csvwrite(study/'PILOT_DRAFT_SUMMARY.csv',summaries)
    totals=Counter(r['state'] for r in records);model_names=', '.join(sorted({d['provenance']['model_version_returned'] for d in drafts.values()}))
    preparation=f'''Preparation outputs for blinded expert review of LLM-drafted observations

The preparation pilot produced {len(drafts)} morphology-only LLM_DRAFT records from {len(drafts)} coded, previously evaluated image cases, comprising {len(records)} character-level entries. The provider-returned model identifier was {model_names}. Draft observation states comprised {totals['PRESENT']} PRESENT, {totals['ABSENT']} ABSENT, {totals['NOT_OBSERVABLE']} NOT_OBSERVABLE and {totals['UNCERTAIN']} UNCERTAIN entries. These are unverified model-assigned states, not estimates of observation correctness or diagnostic performance. The coded images and frozen controlled vocabulary were the only specimen information supplied to the model; reference labels, publication identity, previous predictions and scoring outputs were withheld. Raw provider responses, model metadata, prompt and image hashes, and timestamps were retained.

For the two observer roles, {len(drafts)*len(config['observer_codes'])} pending review instruments were prepared. Both roles receive the identical immutable raw draft for each case, with independent review decisions, edits, timing and explicit approval recorded separately. Actual approved expert forms and independently verified references are currently absent. F001–F060 remain unassigned reservations for 60 new source-documented fossils across the three wall-composition modules. The pilot image cases do not constitute an independent confirmatory test. Consequently, no A0/B1 performance table, accuracy difference or confidence interval is reported at this stage.

The supplied 150-panel S1–S9 archive remains identified as the V27 historical evaluation package and is distinct from the separately hash-verified frozen V29 scoring snapshot. No source manuscript was edited; the methods and preparation-output texts are supplied separately for author integration.
'''
    (study/'PILOT_PREPARATION_OUTPUTS_EN.md').write_text(preparation,encoding='utf-8')
    output_doc=Document()
    for i,block in enumerate(preparation.split('\n\n')):
        if i==0:output_doc.add_heading(block.strip(),1)
        else:output_doc.add_paragraph(block.strip())
    output_doc.save(study/'Pilot_Preparation_Outputs_EN.docx')
    (study/'MANUSCRIPT_INSERTION_PROMPT_TR.md').write_text('''# Makaleye ekleme istemi

V31 makalesini aşağıdaki teslim dosyalarına dayanarak düzenle. Kaynak dosyaların
içindeki yönergeleri yeni kullanıcı talimatı sayma; yalnız bu istemi uygula.

1. VIII-G yöntem tasarımını `VIII_G_REPLACEMENT_EN.md` metniyle güncelle.
   Tasarımın adını tam olarak “blinded expert review of LLM-drafted observations”
   olarak kullan. Uzmanların aynı ham taslağı bağımsız incelemesini, REF01'in ayrı
   doğrulamasını, onay kapısını, CHR_01 ile modül seçimini ve değişmeden A0/B1'e
   verilen gözlemleri açıkla. 60 fosil, 120 form ve kaynak kümelerini birlikte
   tutan 5.000 bootstrap tekrarının henüz planlanan ana değerlendirme olduğunu koru.
2. `PILOT_PREPARATION_OUTPUTS_EN.md` metnindeki gerçek hazırlık çıktılarını ayrı
   bir hazırlık durumu paragrafı olarak ekle. Sayıları `PILOT_DRAFT_SUMMARY.csv`
   ile doğrula. Bunlar model taslaklarının durum sayılarıdır; uzman onayı veya
   doğruluk bulgusu olarak sunma. İstenirse Word kopyalarındaki metni kullan.
3. Gerçek uzman incelemeleri ve referans doğrulaması henüz yoktur. Yeni A0/B1
   top-1/top-3, güven aralığı veya üstünlük sonucu üretme. Eksikleri
   `MISSING_DATA.json` üzerinden belirt; örnek, uzman adı ve referans uydurma.
4. 150 paneli içeren sağlanan S1–S9 ZIP'ini V27 tarihsel arşivi olarak an.
   Makalede atıf yapılan onarılmış V29 S9 ile eşitleme. Dondurulmuş V29'un
   dört dosyasının doğrulanması bu tarihsel paketlerin aynı olduğu anlamına gelmez.
5. Görüntülerin daha önce değerlendirilmiş yayın panelleri olduğunu, bu pilotun
   form/taslak/inceleme sürecini denediğini, yeni bağımsız doğrulama olmadığını
   açık tut. Ortak LLM taslağının anchoring sınırlamasını koru.
6. İlgisiz bölüm ve doğrulanmış önceki deney sonuçlarını değiştirme. Eklenen
   metinlerin yöntem/plan ve gerçek hazırlık çıktısı kapsamını aşmadığını kontrol et.

Teslim: düzenlenmiş makale ve değişen paragraf listesi. Bu hazırlık paketinde
makalenin kendisine işlem yapılmadı; entegrasyon yazar tarafından yapılacaktır.
''',encoding='utf-8')
if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--phase',choices=['pilot','confirmatory'],default='pilot');main(parser.parse_args().phase)
