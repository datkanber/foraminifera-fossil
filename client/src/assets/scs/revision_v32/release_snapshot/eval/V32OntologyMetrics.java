import java.io.File;
import java.util.*;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.model.*;
import org.semanticweb.owlapi.util.DLExpressivityChecker;
public class V32OntologyMetrics{
 public static void main(String[] args)throws Exception{
  var manager=OWLManager.createOWLOntologyManager();var ontology=manager.loadOntologyFromOntologyDocument(new File(args[0]));
  var types=new TreeMap<String,Integer>();for(var axiom:ontology.getAxioms())types.merge(axiom.getAxiomType().toString(),1,Integer::sum);
  StringBuilder json=new StringBuilder("{\"owlapi_version\":\"3.4.3 (bundled with Owlready2 HermiT)\",\"axioms\":");
  json.append(ontology.getAxiomCount()).append(",\"logical_axioms\":").append(ontology.getLogicalAxiomCount());
  json.append(",\"TBox_axioms\":").append(ontology.getTBoxAxioms(false).size());
  json.append(",\"RBox_axioms\":").append(ontology.getRBoxAxioms(false).size());
  json.append(",\"ABox_axioms\":").append(ontology.getABoxAxioms(false).size());
  json.append(",\"DL_expressivity\":\"").append(new DLExpressivityChecker(Set.of(ontology)).getDescriptionLogicName()).append("\",\"axiom_types\":{");
  boolean comma=false;for(var e:types.entrySet()){if(comma)json.append(',');comma=true;json.append('"').append(e.getKey()).append("\":").append(e.getValue());}
  json.append("}}");System.out.println(json);
 }
}
