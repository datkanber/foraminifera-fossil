import { useState, useEffect } from "react";
import "../styles/components/taxon-profile-card.css";
import { useLanguage } from "../contexts/LanguageContext";

const API = process.env.REACT_APP_API_URL + "/api/taxa";

/**
 * TaxonProfileCard
 *
 * Reusable component that fetches and displays WoRMS taxonomy + local
 * paleo-environment data for a given scientific name.
 *
 * Props:
 * - scientificName: string (genus name to look up)
 */
function TaxonProfileCard({ scientificName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (!scientificName) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API}/profile?name=${encodeURIComponent(scientificName)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Profil yüklenemedi");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [scientificName]);

  if (!scientificName) return null;

  if (loading) {
    return (
      <div className="taxon-card">
        <div className="taxon-card-header">
          <span className="taxon-card-title">{t("taxon.profile")}</span>
        </div>
        <div className="taxon-skeleton">
          <div className="skeleton-line" style={{ width: "60%" }} />
          <div className="skeleton-line" style={{ width: "80%" }} />
          <div className="skeleton-line" style={{ width: "40%" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="taxon-card">
        <div className="taxon-card-header">
          <span className="taxon-card-title">{t("taxon.profile")}</span>
        </div>
        <div className="taxon-info-notice">
          {lang === 'tr' ? "Takson profili yüklenirken bir hata oluştu." : "Error loading taxon profile."}
        </div>
      </div>
    );
  }

  if (!data || !data.success) return null;

  const { taxonomy, wormsEnvironment, localProfiles, availability, warnings } = data;

  return (
    <div className="taxon-card">
      <div className="taxon-card-header">
        <span className="taxon-card-title">{t("taxon.profile")} — <em>{scientificName}</em></span>
        <AvailabilityBadge worms={availability?.worms} local={availability?.local} lang={lang} />
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="taxon-warnings">
          {warnings.map((w, i) => (
            <div key={i} className="taxon-warning-item">ℹ️ {w}</div>
          ))}
        </div>
      )}

      {/* Taxonomy Section */}
      <TaxonomySection taxonomy={taxonomy} lang={lang} t={t} />

      {/* WoRMS Environment Section */}
      <WormsEnvironmentSection env={wormsEnvironment} lang={lang} t={t} />

      {/* Local Profiles Section */}
      <LocalProfilesSection profiles={localProfiles} genusName={scientificName} lang={lang} t={t} />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────

function AvailabilityBadge({ worms, local, lang }) {
  const wormsLabel = {
    live: "WoRMS ✓",
    stale_cache: lang === 'tr' ? "WoRMS (önbellek)" : "WoRMS (cache)",
    not_found: lang === 'tr' ? "WoRMS (bulunamadı)" : "WoRMS (not found)",
    unavailable: "WoRMS ✗",
  };

  return (
    <div className="taxon-availability">
      <span className={`avail-badge ${worms === "live" ? "avail-ok" : worms === "unavailable" ? "avail-off" : "avail-warn"}`}>
        {wormsLabel[worms] || "WoRMS ?"}
      </span>
      {local && <span className="avail-badge avail-ok">{lang === 'tr' ? "Yerel ✓" : "Local ✓"}</span>}
    </div>
  );
}

function TaxonomySection({ taxonomy, lang, t }) {
  const fields = [
    { label: "Order", key: "order" },
    { label: "Superfamily", key: "superfamily" },
    { label: "Family", key: "family" },
    { label: "Genus", key: "genus" },
    { label: "Taxonomic Status", key: "status" },
    { label: "AphiaID", key: "aphiaId" },
    { label: "Accepted Name", key: "acceptedName" },
    { label: "Accepted AphiaID", key: "acceptedAphiaId" },
  ];

  return (
    <details className="taxon-section" open>
      <summary className="taxon-section-title">{lang === 'tr' ? "Taksonomi" : "Taxonomy"}</summary>
      <div className="taxon-section-body">
        {!taxonomy ? (
          <div className="taxon-info-notice">{lang === 'tr' ? "WoRMS taksonomi verisi mevcut değil." : "WoRMS taxonomy data not available."}</div>
        ) : (
          <table className="taxon-table">
            <tbody>
              {fields.map((f) => (
                <tr key={f.key}>
                  <td className="taxon-field-label">{f.label}</td>
                  <td className="taxon-field-value">
                    {taxonomy[f.key] != null ? (
                      f.key === "status" ? <StatusBadge status={taxonomy[f.key]} /> : String(taxonomy[f.key])
                    ) : (
                      <span className="taxon-no-data">{t("taxon.nodata")}</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="taxon-field-label">Source</td>
                <td className="taxon-field-value">
                  {taxonomy.sourceUrl ? (
                    <a
                      href={taxonomy.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="taxon-link"
                    >
                      {taxonomy.source || "WoRMS"} ↗
                    </a>
                  ) : (
                    <span className="taxon-no-data">{t("taxon.nodata")}</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </details>
  );
}

function StatusBadge({ status }) {
  const isAccepted = status === "accepted";
  return (
    <span className={`status-badge ${isAccepted ? "status-accepted" : "status-unaccepted"}`}>
      {status}
    </span>
  );
}

function WormsEnvironmentSection({ env, lang, t }) {
  const boolFields = [
    { label: "Marine", key: "marine" },
    { label: "Brackish water", key: "brackishWater" },
    { label: "Freshwater", key: "freshwater" },
    { label: "Terrestrial", key: "terrestrial" },
    { label: "Extinct", key: "extinct" },
  ];

  return (
    <details className="taxon-section">
      <summary className="taxon-section-title">{lang === 'tr' ? "WoRMS Ortam Bilgisi" : "WoRMS Environment Data"}</summary>
      <div className="taxon-section-body">
        {!env ? (
          <div className="taxon-info-notice">{lang === 'tr' ? "WoRMS ortam verisi mevcut değil." : "WoRMS environment data not available."}</div>
        ) : (
          <>
            <table className="taxon-table">
              <tbody>
                {boolFields.map((f) => (
                  <tr key={f.key}>
                    <td className="taxon-field-label">{f.label}</td>
                    <td className="taxon-field-value">
                      <BoolValue val={env[f.key]} t={t} />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="taxon-field-label">Functional group</td>
                  <td className="taxon-field-value">
                    {env.functionalGroups && env.functionalGroups.length > 0
                      ? env.functionalGroups.join(", ")
                      : <span className="taxon-no-data">{t("taxon.nodata")}</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </details>
  );
}

function BoolValue({ val, t }) {
  if (val === true) return <span className="bool-yes">{t("taxon.yes")}</span>;
  if (val === false) return <span className="bool-no">{t("taxon.no")}</span>;
  return <span className="taxon-no-data">{t("taxon.nodata")}</span>;
}

function LocalProfilesSection({ profiles, genusName, lang, t }) {
  if (!profiles || profiles.length === 0) {
    return (
      <details className="taxon-section">
        <summary className="taxon-section-title">{lang === 'tr' ? "Proje Veri Seti" : "Project Dataset"}</summary>
        <div className="taxon-section-body">
          <div className="taxon-info-notice">{t("taxon.nolocal")}</div>
        </div>
      </details>
    );
  }

  return (
    <details className="taxon-section" open>
      <summary className="taxon-section-title">{lang === 'tr' ? "Proje Veri Seti" : "Project Dataset"} ({profiles.length} {lang === 'tr' ? "kayıt" : "records"})</summary>
      <div className="taxon-section-body">
        {profiles.map((p, i) => (
          <div key={i} className="local-profile-item">
            <div className="local-profile-header">
              <em className="local-profile-name">{p.scientificName}</em>
              <span className={`rank-badge ${p.rank === "SPECIES" ? "rank-species" : "rank-genus"}`}>
                {p.rank === "SPECIES" ? (lang === 'tr' ? "Tür" : "Species") : (lang === 'tr' ? "Cins" : "Genus")}
              </span>
              {p.taxonomicReviewRequired && (
                <span className="review-badge">{lang === 'tr' ? "Taksonomik inceleme gerekli" : "Taxonomic review required"}</span>
              )}
            </div>

            <div className="local-profile-fields">
              <div className="local-field">
                <span className="local-field-label">{lang === 'tr' ? "Derinlik:" : "Depth:"}</span>
                <span className="local-field-value">{lang === 'tr' ? (p.depthTextTr || "—") : (p.depthTextEn || p.depthTextTr || "—")}</span>
              </div>
              <div className="local-field">
                <span className="local-field-label">{lang === 'tr' ? "Yaşadığı ortam:" : "Habitat:"}</span>
                <span className="local-field-value">{lang === 'tr' ? (p.habitatTextTr || "—") : (p.habitatTextEn || p.habitatTextTr || "—")}</span>
              </div>
              <div className="local-field">
                <span className="local-field-label">{lang === 'tr' ? "Kaynak:" : "Source:"}</span>
                <span className="local-field-value local-source">{p.sourceLabel || "—"}</span>
              </div>
            </div>

            {p.generalizationWarning && (
              <div className="species-generalization-warning">
                ⚠️ {p.generalizationWarning}
              </div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}

export default TaxonProfileCard;
