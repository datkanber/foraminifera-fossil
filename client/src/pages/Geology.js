import { useState, useEffect } from "react";
import "../styles/pages/geology.css";
import { useLanguage } from "../contexts/LanguageContext";

const API = process.env.REACT_APP_API_URL + "/api/taxa";

// Client-side English translation fallback (used when API doesn't return *En fields)
const EN_TRANSLATIONS = {
  "Karsella hottingeri":           { depth: "Shallow marine environment", habitat: "Warm and shallow coastal waters", source: "Project dataset – Excel Sheet 10, literature review" },
  "Pseudolacazina oeztemueri":     { depth: "Very shallow to shallow marine water environment", habitat: "Lived on the seabed together with red and green algae.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Alveolina haymanaensis":        { depth: "Shallow-very shallow marine zone, inner ramp", habitat: "Warm and sunny coastal ecosystems, living attached to the bottom in the shallow parts of the oceans.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Ranikothalia polatliensis":     { depth: "Very shallow environment extremely close to the shoreline, representing the transition from land to sea", habitat: "Very shallow and warm ocean coasts just in front of deltas where rivers flow into the sea.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Laffitteina erki":              { depth: "Shallow marine water environment", habitat: "Warm, clear, and calm ocean waters where sunlight easily reaches the seabed, along with algae and other shallow water organisms.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Discocyclina seunesi":          { depth: "Very shallow marine water environment", habitat: "Warm ocean coastal ecosystems on the seabed, together with other very shallow water organisms.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Orbitoclypeus haymanaensis":    { depth: "Shallow sea", habitat: "Detrital and carbonate marine coastal environment located under massive limestone rocks formed by advancing sea water.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Orbitolites":                   { depth: "Very shallow to shallow sea", habitat: "Restricted shelf with normal salinity, inner ramp and shallow marine carbonate platform deposits.", source: "Project environment data table" },
  "Opertorbitolites":              { depth: "Very shallow to shallow sea", habitat: "Transitional sandy limestone and shallow marine coastal environment where detrital material from land and carbonates precipitate together.", source: "Project environment data table" },
  "Bolkarina":                     { depth: "Very shallow to shallow sea", habitat: "Restricted shelf behind the coast and around reefs, back-reef, and calm algal limestone environments.", source: "Project environment data table" },
  "Chapmanina":                    { depth: "Very shallow to shallow sea", habitat: "Inner ramp, shallow marine limestone, and clayey or sandy limestone deposits associated with back-reef or fore-reef.", source: "Project environment data table" },
  "Elphidium":                     { depth: "Very shallow sea", habitat: "Shoreline, lagoons, estuaries, tidal zones, and continental shelf. Tolerant to variable salinity and slightly brackish water conditions.", source: "Project environment data table" },
  "Bolivinella":                   { depth: "Shallow sea", habitat: "Sheltered bays near the coast, back-reef, lagoons, and sediments on the shallow shelf bottom; generally warm and temperate shallow marine environments.", source: "Project environment data table" },
  "Polymorphina":                  { depth: "Shallow to medium depth shelf waters", habitat: "Free benthic life on muddy and sandy bottoms in marine shelf and coastal transition environments with normal salinity.", source: "Project environment data table" },
  "Glandulina":                    { depth: "From middle shelf to bathyal zone; approximately from 50 meters to 500-1000 meters", habitat: "Outer continental shelf, open shelf, and upper continental slope seabed environments.", source: "Project environment data table" },
  "Bulimina":                      { depth: "From middle shelf to bathyal zone; typically from 100-200 meters to 1000-2000+ meters", habitat: "Open marine outer shelf and continental slope deposits; infaunal life tolerant to organic-rich, low-oxygen muddy bottoms.", source: "Project environment data table" },
  "Nodosaria":                     { depth: "Generally from 50-100 meters to bathyal zone depths, 200-1000+ meters", habitat: "Middle-outer continental shelf, continental slope, and open basin; free benthic or infaunal life in fine-grained sediments with normal marine salinity.", source: "Project environment data table" },
  "Frondicularia":                 { depth: "Mostly 50-200 meters; in some species up to the upper bathyal zone, 200-400 meters", habitat: "Clayey limestone, shale, and marl deposits in middle and outer neritic shelf and basin transition areas.", source: "Project environment data table" },
};

function Geology() {
  const { lang } = useLanguage();
  return (
    <section id="geology" className="geology-page">
      <div className="geology-content">
        <h2>{lang === 'tr' ? "Jeolojik Bağlam" : "Geological Context"}</h2>
        <p>
          {lang === 'tr' ? (
            <>Mevcut ontoloji, büyük bentik foraminiferler için önemli evrimsel aşamaları temsil eden <strong>Paleosen</strong> ve <strong>Eosen</strong> dönemlerine odaklanmaktadır.</>
          ) : (
            <>The current ontology focuses on the <strong>Paleocene</strong> and <strong>Eocene</strong> periods, representing important evolutionary stages for larger benthic foraminifera.</>
          )}
        </p>
        
        <div className="geology-grid">
          <div className="geology-card">
            <h3>{lang === 'tr' ? "Tanesiyen (Thanetian)" : "Thanetian"}</h3>
            <p>{lang === 'tr' ? "Geç Paleosen katı. Karmaşık formların ilk radyasyonu ve spesifik fauna toplulukları ile karakterizedir." : "Late Paleocene stage. Characterized by the first radiation of complex forms and specific faunal assemblages."}</p>
          </div>
          <div className="geology-card">
            <h3>{lang === 'tr' ? "İlerdiyen (Ilerdian)" : "Ilerdian"}</h3>
            <p>{lang === 'tr' ? "Tethys bölgesinde önemli bir Erken Eosen katı. Alveolina gibi taksonların hızlı çeşitlenmesine tanık olmuştur." : "Important Early Eocene stage in the Tethys region. Witnessed rapid diversification of taxa such as Alveolina."}</p>
          </div>
          <div className="geology-card">
            <h3>{lang === 'tr' ? "Küiziyen (Cuisian)" : "Cuisian"}</h3>
            <p>{lang === 'tr' ? "Kavkı morfolojisi ve ekolojik adaptasyonlarda daha ileri uzmanlaşmaların görüldüğü Geç Erken Eosen katı." : "Late Early Eocene stage where further specializations in shell morphology and ecological adaptations are observed."}</p>
          </div>
        </div>

        <TaxonEnvironmentSection />
      </div>
    </section>
  );
}

// ─── TAXON ENVIRONMENT SECTION ──────────────────────────────────────────
function TaxonEnvironmentSection() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  const { lang } = useLanguage();

  // Fetch all profiles on mount
  useEffect(() => {
    fetch(`${API}/environment`)
      .then((res) => {
        if (!res.ok) throw new Error("Veri yüklenemedi");
        return res.json();
      })
      .then((data) => {
        setProfiles(data.profiles || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Client-side filtering
  const filtered = profiles.filter((p) => {
    const matchesSearch = !searchTerm ||
      p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = !rankFilter || p.rank === rankFilter;
    return matchesSearch && matchesRank;
  });

  return (
    <div className="taxon-env-section">
      <h3 className="taxon-env-title">{lang === 'tr' ? "Takson Ortam Kayıtları" : "Taxon Environment Records"}</h3>
      <p className="taxon-env-desc">
        {lang === 'tr' ? "Proje veri setinden derlenen yerel derinlik ve paleo-ortam bilgileri. Tür düzeyindeki kayıtlar bütün cinse otomatik olarak genellenmez." : "Local depth and paleo-environment information compiled from the project dataset. Species-level records are not automatically generalized to the entire genus."}
      </p>

      {/* Search & Filter */}
      <div className="taxon-env-controls">
        <input
          type="text"
          className="taxon-env-search"
          placeholder={lang === 'tr' ? "Bilimsel isme göre ara..." : "Search by scientific name..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="taxon-env-filter"
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
        >
          <option value="">{lang === 'tr' ? "Tümü" : "All"}</option>
          <option value="SPECIES">{lang === 'tr' ? "Tür" : "Species"}</option>
          <option value="GENUS">{lang === 'tr' ? "Cins" : "Genus"}</option>
        </select>
      </div>

      {/* Content */}
      {loading && (
        <div className="taxon-env-loading">{lang === 'tr' ? "Yükleniyor..." : "Loading..."}</div>
      )}

      {error && (
        <div className="taxon-env-error">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="taxon-env-count">
            {filtered.length} / {profiles.length} {lang === 'tr' ? "kayıt gösteriliyor" : "records showing"}
          </div>

          <div className="taxon-env-grid">
            {filtered.map((p, i) => (
              <div key={i} className="taxon-env-card">
                <div className="taxon-env-card-header">
                  <em className="taxon-env-name">{p.scientificName}</em>
                  <span className={`taxon-env-rank ${p.rank === "SPECIES" ? "env-rank-species" : "env-rank-genus"}`}>
                    {p.rank === "SPECIES" ? (lang === 'tr' ? "Tür" : "Species") : (lang === 'tr' ? "Cins" : "Genus")}
                  </span>
                </div>

                {p.taxonomicReviewRequired && (
                  <div className="taxon-env-review-badge">
                    {lang === 'tr' ? "Taksonomik inceleme gerekli" : "Taxonomic review required"}
                  </div>
                )}

                <div className="taxon-env-field">
                  <span className="taxon-env-field-label">{lang === 'tr' ? "Derinlik:" : "Depth:"}</span>
                  <span>{lang === 'tr' ? (p.depthTextTr || "—") : (p.depthTextEn || (EN_TRANSLATIONS[p.scientificName]?.depth) || p.depthTextTr || "—")}</span>
                </div>
                <div className="taxon-env-field">
                  <span className="taxon-env-field-label">{lang === 'tr' ? "Yaşadığı ortam:" : "Habitat:"}</span>
                  <span>{lang === 'tr' ? (p.habitatTextTr || "—") : (p.habitatTextEn || (EN_TRANSLATIONS[p.scientificName]?.habitat) || p.habitatTextTr || "—")}</span>
                </div>
                <div className="taxon-env-field taxon-env-source">
                  <span className="taxon-env-field-label">{lang === 'tr' ? "Kaynak:" : "Source:"}</span>
                  <span>{lang === 'tr' ? (p.sourceLabel || "—") : (p.sourceLabelEn || (EN_TRANSLATIONS[p.scientificName]?.source) || p.sourceLabel || "—")}</span>
                </div>

                {!p.linkedToOntology && (
                  <div className="taxon-env-unlinked">
                    {lang === 'tr' ? "Henüz tanı ontolojisine bağlı değil" : "Not yet linked to diagnostic ontology"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="taxon-env-empty">
              {lang === 'tr' ? "Aramanızla eşleşen kayıt bulunamadı." : "No records found matching your search."}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Geology;
