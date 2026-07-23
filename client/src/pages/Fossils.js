import { useState } from "react";
import "../styles/pages/fossils.css";

function Fossils() {
  const [stage, setStage] = useState("");
  const [characters, setCharacters] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleDiagnose = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Virgülle ayrılmış özellikleri diziye çevir
    const charArray = characters.split(",").map(c => c.trim()).filter(Boolean);

    try {
      setHasSearched(true);
      const apiUrl = process.env.REACT_APP_API_URL + "/api/diagnose";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage, characters: charArray })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("API connection failed. Lütfen arka uç (Node.js) sunucusunun çalıştığından emin olun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="fossils" className="fossils-page">
      <div className="fossils-content">
        <h2 style={{ color: "var(--color-primary)", fontSize: "14px", borderBottom: "1px solid var(--color-border)", paddingBottom: "4px", marginBottom: "8px", marginTop: "0" }}>
          Tanı Destek Sistemi
        </h2>
        <p style={{ marginBottom: "12px", fontSize: "12px" }}>
          Mikroskop altında gözlemlediğiniz morfolojik özellikleri ve jeolojik katı girerek, 
          ontolojimizdeki en olası takson adaylarını listeleyin.
        </p>

        <div className="fossils-container">
          
          {/* Sol Taraf: Form */}
          <div className="diagnostic-form-container">
            <form onSubmit={handleDiagnose} className="diagnostic-form">
              <div className="form-group">
                <label>Jeolojik Kat (Stage)</label>
                <select value={stage} onChange={(e) => setStage(e.target.value)}>
                  <option value="">-- Tümü --</option>
                  <option value="Thanetian">Tanesiyen (Thanetian)</option>
                  <option value="Ilerdian">İlerdiyen (Ilerdian)</option>
                  <option value="Cuisian">Küiziyen (Cuisian)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Morfolojik Karakterler</label>
                <input 
                  type="text" 
                  placeholder="Örn: Yüksek konik, İnvolut, Oval"
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                />
                <small>Birden fazla özellik aramak için aralarına virgül koyun.</small>
              </div>

              <button type="submit" className="diagnose-button" disabled={loading} style={{ width: "auto", alignSelf: "flex-start", padding: "4px 16px" }}>
                {loading ? "Sorgulanıyor..." : "Adayları Getir"}
              </button>
              
              {error && <div className="error-message">{error}</div>}
            </form>
          </div>

          {/* Sağ Taraf: Sonuçlar (ALV Grid) */}
          <div className="diagnostic-results" style={{ overflowX: "auto", fontFamily: "Courier New, monospace" }}>
            {results.length === 0 && !loading && (
              <div className="no-results" style={{ border: "1px solid var(--color-border)", padding: "1rem", backgroundColor: "var(--color-surface)" }}>
                {!hasSearched ? "Sorgu bekleniyor..." : "Eşleşen sonuç bulunamadı."}
              </div>
            )}
            
            {results.length > 0 && (
              <table className="alv-grid" style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)", fontSize: "11px", fontFamily: "Tahoma, Arial, sans-serif" }}>
                <thead style={{ backgroundColor: "var(--color-sap-bg)", color: "var(--color-text)", textAlign: "left", borderBottom: "2px solid #808080" }}>
                  <tr>
                    <th style={{ padding: "4px", border: "1px inset #fff", borderRight: "1px solid #808080", borderBottom: "1px solid #808080" }}>TÜR</th>
                    <th style={{ padding: "4px", border: "1px inset #fff", borderRight: "1px solid #808080", borderBottom: "1px solid #808080" }}>CİNS</th>
                    <th style={{ padding: "4px", border: "1px inset #fff", borderRight: "1px solid #808080", borderBottom: "1px solid #808080" }}>AİLE</th>
                    <th style={{ padding: "4px", border: "1px inset #fff", borderRight: "1px solid #808080", borderBottom: "1px solid #808080" }}>EŞLEŞME</th>
                    <th style={{ padding: "4px", border: "1px inset #fff", borderBottom: "1px solid #808080" }}>GEREKÇELER</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((taxon, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "alv-row-even" : "alv-row-odd"}>
                      <td style={{ padding: "4px", borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}><strong>{taxon.species.replace(/_/g, ' ')}</strong></td>
                      <td style={{ padding: "4px", borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>{taxon.genus}</td>
                      <td style={{ padding: "4px", borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>{taxon.family}</td>
                      <td style={{ padding: "4px", borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", fontWeight: "bold", color: taxon.matchPercentage === 100 ? "var(--color-primary)" : "inherit" }}>
                        %{taxon.matchPercentage}
                      </td>
                      <td style={{ padding: "4px", borderBottom: "1px solid var(--color-border)" }}>
                        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px" }}>
                          {taxon.matchedTraits && taxon.matchedTraits.map((t, i) => (
                            <li key={i}>{t.matched.group}: {t.matched.value || t.matched.name}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default Fossils;
