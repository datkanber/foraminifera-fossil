"""Replace only the expert-evaluation subsection in a supplied V31 copy."""
from expert_comparison import *
from build_llm_review_forms import VIII_G,STUDY
from docx import Document
from docx.text.paragraph import Paragraph
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from copy import deepcopy
import re,argparse

def main():
    parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);args=parser.parse_args()
    require(args.source.exists(),'Actual V31 source DOCX is required; do not substitute V30 or V29')
    require('v31' in args.source.name.lower(),'Source must be the supplied V31, not a relabeled older manuscript')
    original_hash=digest(args.source);doc=Document(args.source);body=list(doc._body._body)
    candidates=[]
    def text(e):return ' '.join(n.text or '' for n in e.xpath('.//w:t'))
    for i,e in enumerate(body):
        t=text(e)
        if e.tag==qn('w:p') and re.match(r'^G[.\s]',t) and any(w in t.lower() for w in ['expert','review','evaluation']):candidates.append(i)
    require(len(candidates)==1,'Could not uniquely locate the V31 VIII-G expert subsection')
    start=candidates[0];end=len(body)-1
    for i in range(start+1,len(body)):
        t=text(body[i])
        if re.match(r'^H[.\s]',t) or t.strip() in ['DISCUSSION AND LIMITATIONS','DISCUSSION','CONCLUSION AND FUTURE WORK','QUALITATIVE CASE STUDIES']:
            end=i;break
    require(end<len(body)-1,'Could not identify the end of VIII-G')
    require(not any(e.tag==qn('w:tbl') for e in body[start:end]),'Existing VIII-G tables require separate source review; do not silently retain unverified performance values')
    old=[text(e) for e in body[start:end]]
    blocks=[b.strip().replace('\n',' ') for b in VIII_G.split('\n\n') if b.strip()]
    paragraphs=[e for e in body[start:end] if e.tag==qn('w:p')]
    def set_text(e,value):
        p=Paragraph(e,doc._body);style=deepcopy(p.runs[0]._r.rPr) if p.runs and p.runs[0]._r.rPr is not None else None
        for child in list(e):
            if child.tag!=qn('w:pPr'):e.remove(child)
        run=p.add_run(value)
        if style is not None:run._r.insert(0,style)
    for i,value in enumerate(blocks):
        if i<len(paragraphs):set_text(paragraphs[i],value)
        else:
            e=deepcopy(paragraphs[-1]);body[end].addprevious(e);set_text(e,value)
    for e in paragraphs[len(blocks):]:set_text(e,'')
    output=STUDY/'Foraminifer_Manuscript_v31_LLM_Expert_Review.docx';doc.save(output)
    require(digest(args.source)==original_hash,'Source manuscript changed')
    save(STUDY/'evidence/manuscript_edit.json',{'source':str(args.source),'source_sha256':original_hash,'output':str(output),
       'changed_section':'VIII-G','old_text':old,'new_text':blocks,'human_results_added':False})
    print(json.dumps({'output':str(output),'source_unchanged':True,'human_results_added':False}))

if __name__=='__main__':main()
