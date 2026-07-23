require("dotenv").config();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const neo4j = require("neo4j-driver");

const DATA_DIR = path.join(__dirname, "../../data");

// Neo4j Driver Setup
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

function safeId(str) {
  if (!str) return "";
  let clean = str.replace(/\u200B/g, "").trim();
  // Map Turkish chars
  const trMap = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "C", Ğ: "G", İ: "I", Ö: "O", Ş: "S", Ü: "U" };
  clean = clean.replace(/[çğıöşüÇĞİÖŞÜ]/g, (m) => trMap[m]);
  return clean.replace(/[^a-zA-Z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
}

function parseSpeciesName(str) {
  if (!str) return "";
  const parts = str.replace(/\u200B/g, "").replace(/\./g, "").split(/\s+/);
  return parts.map(safeId).filter(Boolean).join("_");
}

function parseFloatSafe(val) {
  if (!val) return null;
  const num = parseFloat(val.replace(/\s+/g, "").replace(",", "."));
  return isNaN(num) ? null : num;
}

// Global Mappings for the script
const speciesMap = {
  "K_hottingeri": "Karsella_hottingeri",
  "Karsella_hottingeri": "Karsella_hottingeri",
  "L_erki": "Laffitteina_erki",
  "Laffitteina_erki": "Laffitteina_erki",
  "P_oeztemueri": "Pseudolacazina_oeztemueri",
  "Pseudolacazina_oeztemueri": "Pseudolacazina_oeztemueri",
  "A_haymanaensis": "Alveolina_haymanaensis",
  "Alveolina_haymanaensis": "Alveolina_haymanaensis",
  "R_polatliensis": "Ranikothalia_polatliensis",
  "Ranikothalia_polatliensis": "Ranikothalia_polatliensis",
  "O_haymanaensis": "Orbitoclypeus_haymanaensis",
  "Orbitoclypeus_haymanaensis": "Orbitoclypeus_haymanaensis",
  "D_seunesi": "Discocyclina_seunesi",
  "Discocyclina_seunesi": "Discocyclina_seunesi",
};

async function clearDatabase(session) {
  console.log("Veritabani temizleniyor...");
  await session.run("MATCH (n) DETACH DELETE n");
  console.log("Veritabani temizlendi.");
}

async function loadTaxa(session) {
  console.log("Taksonomi yukleniyor (data002)...");
  
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(DATA_DIR, "data002-takson-envanteri.csv"), { encoding: "utf8" })
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const row of results) {
            const family = row["Aile"] ? row["Aile"].trim() : "";
            const genus = row["Cins"] ? row["Cins"].trim() : "";
            const turStr = row["Tür"] ? row["Tür"].trim() : "";
            
            if (!turStr) continue;
            const parsedSp = parseSpeciesName(turStr);
            if (!speciesMap[parsedSp]) continue;
            const speciesId = speciesMap[parsedSp];
            
            const period = row["Dönem"] ? row["Dönem"].replace(/\u200B/g, "").trim() : "";
            const stage = row["Kat"] ? row["Kat"].replace(/\u200B/g, "").trim() : "";
            const desc = row["Tanımı"] ? row["Tanımı"].replace(/\u200B/g, "").trim() : "";

            // Create Taxon Nodes and Relationships
            await session.run(`
              MERGE (f:Family {name: $family})
              MERGE (g:Genus {name: $genus})
              MERGE (s:Species {id: $speciesId})
              SET s.name = $turStr, s.description = $desc
              MERGE (s)-[:BELONGS_TO_GENUS]->(g)
              MERGE (g)-[:BELONGS_TO_FAMILY]->(f)
            `, { family, genus, speciesId, turStr, desc });

            // Geological Period
            if (period.toLowerCase().includes("paleosen") || period.toLowerCase().includes("paleocene")) {
              await session.run(`MERGE (p:Period {name: "Paleocene"}) WITH p MATCH (s:Species {id: $speciesId}) MERGE (s)-[:OCCURS_IN_PERIOD]->(p)`, { speciesId });
            }
            if (period.toLowerCase().includes("eosen") || period.toLowerCase().includes("eocene")) {
              await session.run(`MERGE (p:Period {name: "Eocene"}) WITH p MATCH (s:Species {id: $speciesId}) MERGE (s)-[:OCCURS_IN_PERIOD]->(p)`, { speciesId });
            }

            // Geological Stage
            const stageLower = stage.toLowerCase();
            const knownStages = [
              { key: "tanesiyen", val: "Thanetian" }, { key: "thanetian", val: "Thanetian" },
              { key: "küiziyen", val: "Cuisian" }, { key: "kuiziyen", val: "Cuisian" },
              { key: "ilerdiyen", val: "Ilerdian" }, { key: "ilerdian", val: "Ilerdian" }
            ];
            for (const st of knownStages) {
              if (stageLower.includes(st.key)) {
                await session.run(`
                  MERGE (st:Stage {name: $val})
                  WITH st MATCH (s:Species {id: $speciesId})
                  MERGE (s)-[:OCCURS_IN_STAGE]->(st)
                `, { val: st.val, speciesId });
              }
            }
          }
          console.log("Taksonomi basariyla yuklendi.");
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function loadCharacters(session) {
  console.log("Karakterler ve olcumler yukleniyor (data003)...");
  
  const content = fs.readFileSync(path.join(DATA_DIR, "data003-karakter-cikarimi-ozet-modelleme-dili.csv"), "utf8");
  const lines = content.split(/\r?\n/);
  
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV line split (ignoring quoted commas for now, assuming clean data003 structure which is mostly comma delimited without quotes containing commas)
    // Actually, let's use a regex to properly split CSV
    const row = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/^"|"$/g, '').trim());
    
    const taksonCol = row[1];
    if (!taksonCol) continue;
    
    const parsedSp = parseSpeciesName(taksonCol);
    if (!speciesMap[parsedSp]) continue;
    const speciesId = speciesMap[parsedSp];
    
    const groupName = row[2] || "";
    const charName = row[3] || "";
    const charValue = row[4] || "";
    
    if (!charName) continue;
    
    const minVal = parseFloatSafe(row[5]);
    const maxVal = parseFloatSafe(row[6]);
    
    // Variable column positions check based on my Python script findings
    let birimIdx = 7;
    let avgVal = null;
    
    const maybeAvg = parseFloatSafe(row[7]);
    if (maybeAvg !== null && row[7] && !isNaN(row[7].replace(',', '.').replace('-', ''))) {
      avgVal = maybeAvg;
      birimIdx = 8;
    }
    
    const unit = row[birimIdx] || "";
    const formStr = (row[birimIdx + 1] || "").toLowerCase();
    const stageStr = (row[birimIdx + 2] || "").toLowerCase();
    
    const isMeasurement = (minVal !== null || maxVal !== null || avgVal !== null) && 
                          groupName.toLowerCase().includes("ölçüm") || groupName.toLowerCase().includes("oran");
                          
    const nodeId = `${speciesId}_${safeId(charName)}_${count}`;
    
    try {
      if (isMeasurement) {
        await session.run(`
          MATCH (s:Species {id: $speciesId})
          MERGE (m:Measurement:Character {id: $nodeId})
          SET m.group = $groupName, m.name = $charName, m.unit = $unit, m.value = $charValue
          ${minVal !== null ? ", m.minValue = " + minVal : ""}
          ${maxVal !== null ? ", m.maxValue = " + maxVal : ""}
          ${avgVal !== null ? ", m.averageValue = " + avgVal : ""}
          MERGE (s)-[:HAS_MEASUREMENT]->(m)
        `, { speciesId, nodeId, groupName, charName, unit, charValue });
      } else {
        await session.run(`
          MATCH (s:Species {id: $speciesId})
          MERGE (c:MorphologicalCharacter:Character {id: $nodeId})
          SET c.group = $groupName, c.name = $charName, c.value = $charValue
          MERGE (s)-[:HAS_CHARACTER]->(c)
        `, { speciesId, nodeId, groupName, charName, charValue });
      }

      // Link Forms
      let formName = null;
      if (formStr.includes("mikrosferik")) formName = "Microspheric";
      if (formStr.includes("megalosferik") || formStr.includes("makrosferik")) formName = "Megalospheric";
      if (formStr.includes("ikisi") || formStr.includes("belirsiz")) formName = "BothForms";
      
      if (formName) {
        await session.run(`
          MERGE (f:DimorphicForm {name: $formName})
          WITH f MATCH (c:Character {id: $nodeId})
          MERGE (c)-[:APPLIES_TO_FORM]->(f)
        `, { formName, nodeId });
      }

    } catch (err) {
      console.error("Error inserting character:", charName, err);
    }
    count++;
  }
  console.log(`Karakterler basariyla yuklendi (${count} kayit islendi).`);
}

async function main() {
  console.log("=== NEO4J AURA IMPORT BASLIYOR ===");
  const session = driver.session();
  try {
    await clearDatabase(session);
    await loadTaxa(session);
    await loadCharacters(session);
    console.log("=== TUM VERILER BASARIYLA YUKLENDI ===");
  } catch (error) {
    console.error("Hata olustu:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
