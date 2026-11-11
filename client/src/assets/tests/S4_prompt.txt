// CQ1: Rules and expected states defining module m
// Parameters: {"m":"AGGLUTINATED"}
MATCH (g:Genus)-[:BELONGS_TO]->(:Module {name:$m}) MATCH (g)-[h:HAS_RULE]->(r) OPTIONAL MATCH (r)-[x:REFERS_TO]->(c:Character) RETURN g.name AS genus, h.level AS level, c.id AS character, x.suggestedValue AS state;

// CQ2: Mandatory rules of genus g referring to character c
// Parameters: {"g":"Ammodiscus","c":"CHR_03"}
MATCH (:Genus {name:$g})-[:HAS_RULE {level:'MANDATORY'}]->(r)-[x:REFERS_TO]->(:Character {id:$c}) RETURN r.text AS text, x.suggestedValue AS state;

// CQ3: Genera sharing a diagnostic state with g
// Parameters: {"g":"Ammodiscus"}
MATCH (a:Genus {name:$g})-[:HAS_RULE {level:'DIAGNOSTIC'}]->()-[x:REFERS_TO]->(c)<-[y:REFERS_TO]-()<-[:HAS_RULE {level:'DIAGNOSTIC'}]-(b:Genus) WHERE a<>b AND x.suggestedValue=y.suggestedValue RETURN b.name AS genus, c.id AS character;

// CQ4: States allowed for character c
// Parameters: {"c":"CHR_03"}
MATCH (:Character {id:$c})-[:ALLOWS]->(v:Value) RETURN v.code AS state;

// CQ5: Genera reachable from question q
// Parameters: {"q":"AGG_Q1"}
MATCH (:Question {id:$q})-[:ANSWER*1..11]->(g:Genus) RETURN DISTINCT g.name AS genus;

// CQ6: Characters never asked in the tree of module m
// Parameters: {"m":"AGGLUTINATED"}
MATCH (c:Character) WHERE NOT EXISTS {MATCH (:Question {module:$m})-[:ASKS_ABOUT]->(c)} RETURN c.id AS character;

// CQ7: Rules without a scoring character-state pair
// Parameters: {}
MATCH (r:RuleItem) WHERE NOT EXISTS {MATCH (r)-[x:REFERS_TO]->() WHERE x.suggestedValue IS NOT NULL} RETURN r.key AS rule_key;

// CQ8: Contradictory rules repeating a positive rule of g
// Parameters: {"g":"Ammodiscus"}
MATCH (g:Genus {name:$g})-[:HAS_RULE {level:'CONTRADICTORY'}]->()-[x:REFERS_TO]->(c)<-[y:REFERS_TO]-()<-[h:HAS_RULE]-(g) WHERE h.level<>'CONTRADICTORY' AND x.suggestedValue=y.suggestedValue RETURN g.name AS genus, c.id AS character;

// CQ9: Genera marked for taxonomic review
// Parameters: {}
MATCH (g:Genus {taxonomicReviewRequired:true}) RETURN g.name AS genus;

// CQ10: Environmental or reference-species profiles linked to g
// Parameters: {"g":"Alveolina"}
MATCH (:Genus {name:$g})-[:HAS_REFERENCE_SPECIES|HAS_ENVIRONMENT_PROFILE]->(t:TaxonProfile) RETURN t.scientificName AS scientificName;
