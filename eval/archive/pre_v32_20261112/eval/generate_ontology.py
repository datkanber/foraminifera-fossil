#!/usr/bin/env python3
"""Regenerate the OWL export from the frozen schema and current JSON mappings.

The frozen template supplies unchanged labels, properties, tree links and
annotations. Rule mappings are replaced, not appended. Cardinality and
disjointness axioms are generated on every run, so re-export preserves them.
"""
from pathlib import Path
import xml.etree.ElementTree as E
import json, hashlib, itertools

ROOT=Path(__file__).resolve().parents[1]
NS={'rdf':'http://www.w3.org/1999/02/22-rdf-syntax-ns#','rdfs':'http://www.w3.org/2000/01/rdf-schema#',
    'owl':'http://www.w3.org/2002/07/owl#','xsd':'http://www.w3.org/2001/XMLSchema#',
    'dcterms':'http://purl.org/dc/terms/','':'https://w3id.org/foram-ontology#'}
for prefix,uri in NS.items():E.register_namespace(prefix,uri)
def q(prefix,name):return '{'+NS[prefix]+'}'+name
def link(parent,prefix,name,target):return E.SubElement(parent,q(prefix,name),{q('rdf','resource'):target})
def literal(parent,prefix,name,value,datatype='string'):
    e=E.SubElement(parent,q(prefix,name),{q('rdf','datatype'):NS['xsd']+datatype});e.text=str(value);return e

def main():
    base=ROOT/'eval/archive/pre_audit_20261111/foram_ontology_v1.owl'
    tree=E.parse(base);r=tree.getroot()
    r.set('{http://www.w3.org/XML/1998/namespace}base','https://w3id.org/foram-ontology')
    rules=json.loads((ROOT/'api/data/rule_chr_mapping.json').read_text('utf-8'))
    byid={e.get(q('rdf','about')):e for e in r.findall(q('owl','NamedIndividual'))}
    classes={e.get(q('rdf','about')):e for e in r.findall(q('owl','Class'))}
    for rule in rules:
        e=byid['#'+rule['rule_key']]
        for c in list(e):
            if c.tag in [q('','refersToCharacter'),q('','suggestedCharacterValue'),q('','mappingConfidence')]:e.remove(c)
        for c in sorted(set(m['chr_id'] for m in rule['mappings'])):link(e,'','refersToCharacter','#'+c)
        for m in rule['mappings']:
            if m.get('value'):
                literal(e,'','suggestedCharacterValue',m['chr_id']+'='+m['value'])
                literal(e,'','mappingConfidence',m['chr_id']+':'+m.get('confidence','HIGH'))
    def restriction(cls,prop,cardinality,n,range_class=None,enumeration=None):
        sub=E.SubElement(classes['#'+cls],q('rdfs','subClassOf'));res=E.SubElement(sub,q('owl','Restriction'))
        link(res,'owl','onProperty','#'+prop)
        literal(res,'owl',cardinality,n,'nonNegativeInteger')
        if range_class:link(res,'owl','onClass','#'+range_class)
        if enumeration:
            on=E.SubElement(res,q('owl','onDataRange'));data=E.SubElement(on,q('rdfs','Datatype'))
            # RDF collection of literals requires explicit rdf:first/rest cells.
            coll=E.SubElement(data,q('owl','oneOf'));node=E.SubElement(coll,q('rdf','Description'))
            for i,value in enumerate(enumeration):
                literal(node,'rdf','first',value)
                if i==len(enumeration)-1:link(node,'rdf','rest',NS['rdf']+'nil')
                else:rest=E.SubElement(node,q('rdf','rest'));node=E.SubElement(rest,q('rdf','Description'))
    restriction('Genus','belongsToModule','qualifiedCardinality',1,'Module')
    restriction('RuleItem','evidenceLevel','qualifiedCardinality',1,enumeration=['MANDATORY','DIAGNOSTIC','SUPPORTING','CONTRADICTORY'])
    restriction('MorphologicalCharacter','allowedValue','minQualifiedCardinality',2,'CharacterValue')
    # All evidence-level values must belong to the enumeration (a qualified
    # exactly-one alone does not forbid values outside its data range).
    ev=r.find("owl:DatatypeProperty[@rdf:about='#evidenceLevel']",NS)
    old_range=ev.find(q('rdfs','range'))
    if old_range is not None:ev.remove(old_range)
    dr=classes['#RuleItem'].find('.//'+q('owl','onDataRange'))[0]
    import copy
    E.SubElement(ev,q('rdfs','range')).append(copy.deepcopy(dr))
    core=['Genus','MorphologicalCharacter','CharacterValue','RuleItem','DecisionQuestion','Module']
    dis=E.SubElement(r,q('owl','AllDisjointClasses'))
    members=E.SubElement(dis,q('owl','members'),{q('rdf','parseType'):'Collection'})
    for c in core:E.SubElement(members,q('rdf','Description'),{q('rdf','about'):'#'+c})
    # OWL has no unique-name assumption: explicitly distinguish the module
    # individuals and the controlled-value individuals used by cardinalities.
    different_sets=[]
    for kind in ['Module','CharacterValue']:
        values=[e.get(q('rdf','about')) for e in byid.values() if any(c.get(q('rdf','resource'))=='#'+kind for c in e.findall(q('rdf','type')))]
        if len(values)>1:
            diff=E.SubElement(r,q('owl','AllDifferent'));members=E.SubElement(diff,q('owl','distinctMembers'),{q('rdf','parseType'):'Collection'})
            for v in values:E.SubElement(members,q('rdf','Description'),{q('rdf','about'):v})
            different_sets.append({'kind':kind,'individuals':len(values)})
    output=ROOT/'foram_ontology_v1.owl'
    E.indent(tree,space='  ');tree.write(output,encoding='utf-8',xml_declaration=True)
    stats={'classes':len(classes),'object_properties':len(r.findall(q('owl','ObjectProperty'))),
      'datatype_properties':len(r.findall(q('owl','DatatypeProperty'))),'named_individuals':len(byid),
      'class_restrictions':len(r.findall('.//'+q('owl','Restriction'))),'disjointness_axioms':1,
      'pairwise_disjoint_class_relations':len(list(itertools.combinations(core,2))),
      'all_different_axioms':different_sets,'rules':len(rules),
      'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),
      'semantics':'OWL open-world restrictions are not closed-world data validation. The JSON cardinality checks run separately.',
      'specification':'https://www.w3.org/TR/owl2-syntax/'}
    p=ROOT/'eval/results/revision/ontology_metrics.json';p.parent.mkdir(exist_ok=True,parents=True);p.write_text(json.dumps(stats,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(stats,indent=2))
if __name__=='__main__':main()
