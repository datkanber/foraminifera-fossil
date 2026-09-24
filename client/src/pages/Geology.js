import { useState, useEffect } from "react";
import "../styles/pages/geology.css";
import { useLanguage } from "../contexts/LanguageContext";

const API = process.env.REACT_APP_API_URL + "/api/taxa";

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
                  <span>{lang === 'tr' ? (p.depthTextTr || "—") : (p.depthTextEn || p.depthTextTr || "—")}</span>
                </div>
                <div className="taxon-env-field">
                  <span className="taxon-env-field-label">{lang === 'tr' ? "Yaşadığı ortam:" : "Habitat:"}</span>
                  <span>{lang === 'tr' ? (p.habitatTextTr || "—") : (p.habitatTextEn || p.habitatTextTr || "—")}</span>
                </div>
                <div className="taxon-env-field taxon-env-source">
                  <span className="taxon-env-field-label">{lang === 'tr' ? "Kaynak:" : "Source:"}</span>
                  <span>{p.sourceLabel || "—"}</span>
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
