const { getSession } = require('../db/neo4j');

exports.diagnose = async (req, res) => {
  // Kullanıcıdan gelen filtreler
  // Örnek body: { "stage": "Thanetian", "characters": ["Yüksek konik", "İnvolut"] }
  const { stage, characters } = req.body;
  const session = getSession();

  try {
    // 1. Tüm taksonları ve özelliklerini Neo4j'den tek bir Cypher sorgusuyla çekiyoruz
    const query = `
      MATCH (s:Species)
      OPTIONAL MATCH (s)-[:BELONGS_TO_GENUS]->(g:Genus)-[:BELONGS_TO_FAMILY]->(f:Family)
      OPTIONAL MATCH (s)-[:OCCURS_IN_STAGE]->(st:Stage)
      OPTIONAL MATCH (s)-[:HAS_CHARACTER]->(c:MorphologicalCharacter)
      OPTIONAL MATCH (s)-[:HAS_MEASUREMENT]->(m:Measurement)
      RETURN s.name AS species, s.id AS id, s.description AS description, 
             g.name AS genus, f.name AS family,
             collect(DISTINCT st.name) AS stages,
             collect(DISTINCT {name: c.name, value: c.value, group: c.group}) AS characters,
             collect(DISTINCT {name: m.name, value: m.value, group: m.group, min: m.minValue, max: m.maxValue, avg: m.averageValue, unit: m.unit}) AS measurements
    `;
    
    const result = await session.run(query);
    
    const taxa = result.records.map(record => ({
      id: record.get('id'),
      species: record.get('species'),
      genus: record.get('genus'),
      family: record.get('family'),
      description: record.get('description'),
      stages: record.get('stages'),
      characters: record.get('characters').filter(c => c.name !== null),
      measurements: record.get('measurements').filter(m => m.name !== null)
    }));

    // 2. JS içinde Karar Destek Eşleştirme (Scoring) Algoritması
    const results = taxa.map(taxon => {
      let score = 0;
      let maxScore = 0;
      let matchedTraits = [];

      // Katı Filtre (Hard Filter): Eğer kat girildiyse ve tür o katta yaşamıyorsa doğrudan ele
      if (stage) {
        if (!taxon.stages.includes(stage)) {
          return null; 
        }
      }

      // Esnek Puanlama (Soft Filter): Girilen her bir karakter için taksonda benzer bir ifade arıyoruz
      if (characters && characters.length > 0) {
        characters.forEach(charInput => {
          maxScore += 1;
          const match = taxon.characters.find(c => 
            (c.value && c.value.toLowerCase().includes(charInput.toLowerCase())) || 
            (c.name && c.name.toLowerCase().includes(charInput.toLowerCase()))
          );
          if (match) {
            score += 1;
            matchedTraits.push({ input: charInput, matched: match });
          }
        });
      }

      // Eşleşme Yüzdesi
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 100;
      
      return {
        ...taxon,
        score,
        maxScore,
        matchPercentage: Math.round(percentage),
        matchedTraits
      };
    }).filter(t => t !== null);

    // 3. En yüksek puan alandan en düşüğe göre sırala
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("Diagnosis error:", error);
    res.status(500).json({ success: false, error: "Veritabani sorgusu basarisiz." });
  } finally {
    await session.close();
  }
};
