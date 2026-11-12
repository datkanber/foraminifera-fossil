// Isolated Community-edition test instance, using locally installed Neo4j jars.
// Does not use a user's existing database or Enterprise-only features.
import java.nio.file.Path;
import java.util.Map;
public class V32Neo4j {
 public static void main(String[] args)throws Exception{
  var type=Class.forName("org.neo4j.server.CommunityBootstrapper");
  var instance=type.getConstructor().newInstance();
  Runtime.getRuntime().addShutdownHook(new Thread(()->{try{type.getMethod("stop").invoke(instance);}catch(Exception ignored){}}));
  int code=(Integer)type.getMethod("start",Path.class,Path.class,Map.class,boolean.class,boolean.class)
    .invoke(instance,Path.of(args[0]),Path.of(args[1]),Map.of(),false,false);
  if(code!=0)System.exit(code);
 }
}
