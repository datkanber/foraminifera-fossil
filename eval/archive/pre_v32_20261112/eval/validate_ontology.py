"""Actual HermiT classification plus isolated negative controls; never edits OWL."""
from pathlib import Path
import json, shutil, os
import owlready2 as owl

ROOT=Path(__file__).resolve().parents[1]

def main():
    java=shutil.which('java')
    if not java:
        candidates=list((Path(os.environ.get('LOCALAPPDATA',''))/'Programs/Neo4j Desktop 2/resources/offline/runtime').glob('*/bin/java.exe'))
        if candidates:java=str(sorted(candidates)[-1])
    if not java:raise RuntimeError('A Java runtime is required for actual HermiT validation.')
    owl.JAVA_EXE=java
    results=[]
    for probe in ['base','disjoint_category','two_distinct_modules','invalid_evidence_level','min2_vs_max1']:
        world=owl.World()
        with (ROOT/'foram_ontology_v1.owl').open('rb') as f:onto=world.get_ontology('https://w3id.org/foram-ontology').load(fileobj=f)
        if probe=='disjoint_category':list(onto.Genus.instances())[0].is_a.append(onto.RuleItem)
        if probe=='two_distinct_modules':
            g=list(onto.Genus.instances())[0]
            other=next(m for m in onto.Module.instances() if m not in g.belongsToModule)
            g.belongsToModule.append(other)
        if probe=='invalid_evidence_level':list(onto.RuleItem.instances())[0].evidenceLevel='BOGUS'
        if probe=='min2_vs_max1':
            with onto:onto.MorphologicalCharacter('CardinalityProbe').is_a.append(onto.allowedValue.max(1,onto.CharacterValue))
        consistent=True
        try:owl.sync_reasoner(world,debug=0)
        except owl.OwlReadyInconsistentOntologyError:consistent=False
        unsat=[c.name for c in world.inconsistent_classes() if c!=owl.Nothing] if consistent else None
        expected=probe=='base'
        assert consistent==expected,(probe,consistent)
        if probe=='base':assert not unsat,unsat
        results.append({'probe':probe,'consistent':consistent,'expected_consistent':expected,'unsatisfiable_named_classes':unsat})
        print('HermiT:',probe,'consistent' if consistent else 'inconsistent (expected negative control)',flush=True)
        world.close()
    data=json.loads((ROOT/'api/data/characters.json').read_text('utf-8'))['characters']
    rules=json.loads((ROOT/'api/data/rule_chr_mapping.json').read_text('utf-8'))
    assert all(len(set(c['values']))>=2 for c in data)
    assert all(r['level'] in ['M','D','S','C'] for r in rules)
    (ROOT/'eval/results/revision/ontology_validation.json').write_text(json.dumps({'reasoner':'HermiT via Owlready2','java':java,
        'probes':results,'closed_world_json_cardinality_checks_passed':True,
        'note':'Negative controls are isolated in-memory worlds. Missing OWL assertions alone do not establish inconsistency under open-world semantics.'},indent=2)+'\n',encoding='utf-8')

if __name__=='__main__':main()
