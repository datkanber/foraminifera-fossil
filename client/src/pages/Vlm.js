import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/ms/PageHero";
import microscopeWorkbenchVisual from "../assets/images/generated/microscope-workbench.jpg";
import "../styles/pages/vlm.css";
import { useLanguage } from "../contexts/LanguageContext";

// React app starts with REACT_APP_API_URL or falls back to relative/local route
const API_URL = (process.env.REACT_APP_API_URL || "") + "/api/vlm/observe";
const VLM_PUBLIC_ACCESS_ENABLED = false;

// Basic SVG icons to replace emojis
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
    <circle cx="12" cy="5" r="2"></circle>
    <path d="M12 7v4"></path>
    <line x1="8" y1="16" x2="8" y2="16"></line>
    <line x1="16" y1="16" x2="16" y2="16"></line>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);


function Vlm() {
  const [file, setFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const uploadTriggerRef = useRef(null);
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    locality: "",
    age: "",
    optics: "",
    scale: "",
    views: "",
    runScore: true
  });

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.match("image.*")) {
      setError("Lütfen sadece resim dosyası yükleyin (JPG, PNG).");
      return;
    }
    
    if (file.size > 8 * 1024 * 1024) {
      setError("Dosya boyutu 8MB'dan küçük olmalıdır.");
      return;
    }

    setFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64Image(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!VLM_PUBLIC_ACCESS_ENABLED) return;
    if (!base64Image) {
      setError("Lütfen analiz için bir görüntü yükleyin.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Görüntü analiz edilirken bir hata oluştu.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ms-vlm-page" lang={lang}>
      <PageHero
        eyebrow={lang === "tr" ? "Görsel Yapay Zekâ & Karar Destek" : "Visual AI & Decision Support"}
        title={t("vlm.title")}
        text={t("vlm.desc")}
        tone="gray"
        backdrop="thinsection"
        image={microscopeWorkbenchVisual}
        imageAlt={lang === "tr" ? "İnce kesit incelemeye hazırlanan optik mikroskop" : "Optical microscope prepared for thin-section examination"}
        highlights={
          !VLM_PUBLIC_ACCESS_ENABLED
            ? lang === "tr"
              ? ["Sınırlı Kullanım", "Talep Üzerine Erişim", "Kural Tabanlı Tanı Aktif"]
              : ["Limited Usage", "Access on Request", "Rule-Based Tool Active"]
            : undefined
        }
        actions={
          !VLM_PUBLIC_ACCESS_ENABLED ? (
            <div className="ms-page-hero-actions">
              <Link to="/iletisim" className="ms-btn">
                <span>{lang === "tr" ? "Erişim Talep Et" : "Request Access"}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/tani" className="ms-btn ms-btn--secondary">
                <span>{lang === "tr" ? "Kural Tabanlı Tanıya Geç" : "Switch to Rule-Based Diagnosis"}</span>
              </Link>
            </div>
          ) : (
            <Link to="/tani" className="ms-btn ms-btn--secondary">
              <span>{lang === "tr" ? "Kural Tabanlı Tanıya Geç" : "Switch to Rule-Based Diagnosis"}</span>
            </Link>
          )
        }
      />

      <section className="ms-section ms-vlm-section">
        <div className="ms-container">
          {!VLM_PUBLIC_ACCESS_ENABLED && (
            <aside className="vlm-access-notice" role="region" aria-label={lang === "tr" ? "Sınırlı kullanım bildirimi" : "Limited access notice"}>
              <div className="vlm-access-main">
                <div className="vlm-access-badge">
                  <LockIcon />
                  <span>{lang === "tr" ? "Sınırlı / Limitli Kullanım" : "Limited / Quota-Restricted Use"}</span>
                </div>
                <h2 className="vlm-access-title">
                  {lang === "tr"
                    ? "Görsel Yapay Zekâ modülü şu anda talep üzerine kullanıma açılmaktadır"
                    : "Visual AI analysis is currently available by request only"}
                </h2>
                <p className="vlm-access-desc">
                  {lang === "tr"
                    ? "Arka plandaki görüntü işleme ve model kotasını korumak amacıyla bu sayfa herkese açık kullanımda geçici olarak sınırlandırılmıştır. Akademik araştırma, eğitim veya demo denemesi talep etmek için bizimle iletişime geçebilirsiniz."
                    : "To protect image-processing API quotas and compute resources, live open-access submissions on this page are temporarily restricted. Please reach out to request demo or research access for academic studies and coursework."}
                </p>
                <div className="vlm-access-actions">
                  <Link to="/iletisim" className="ms-btn">
                    <span>{lang === "tr" ? "Erişim İçin İletişime Geç" : "Contact Us for Access"}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <a
                    href="mailto:kokur@ogu.edu.tr?subject=GeoKnow%20Visual%20AI%20Erisim%20Talebi"
                    className="ms-btn ms-btn--secondary"
                  >
                    kokur@ogu.edu.tr
                  </a>
                  <Link to="/tani" className="ms-link">
                    {lang === "tr" ? "Kural Tabanlı Tanıyı Ücretsiz Kullan" : "Use Rule-Based Diagnosis (No Limit)"}
                  </Link>
                </div>
              </div>

              <dl className="vlm-access-meta">
                <div>
                  <dt>{lang === "tr" ? "Erişim Durumu" : "Access Status"}</dt>
                  <dd>{lang === "tr" ? "Sınırlı · Talep Üzerine" : "Limited · On Request"}</dd>
                </div>
                <div>
                  <dt>{lang === "tr" ? "Kullanım Kapsamı" : "Intended Use"}</dt>
                  <dd>{lang === "tr" ? "Akademik Araştırma & Dersler" : "Academic Research & Courses"}</dd>
                </div>
                <div>
                  <dt>{lang === "tr" ? "Kesintisiz Alternatif" : "Open Alternative"}</dt>
                  <dd>{lang === "tr" ? "Tanı Yap (/tani) ve 3D Lab (/lab)" : "Diagnosis (/tani) & 3D Lab (/lab)"}</dd>
                </div>
              </dl>
            </aside>
          )}

          <div className="vlm-body">
          {/* Left Side: Upload & Form */}
          <div className={`vlm-left${!VLM_PUBLIC_ACCESS_ENABLED ? " vlm-left--locked" : ""}`}>
            <div className="vlm-panel-head">
              <h2 className="vlm-panel-title">{lang === "tr" ? "1. Görsel ve gözlem bilgileri" : "1. Image and observations"}</h2>
              {!VLM_PUBLIC_ACCESS_ENABLED && (
                <span className="vlm-lock-pill">
                  <LockIcon />
                  <span>{lang === "tr" ? "Ön izleme" : "Preview"}</span>
                </span>
              )}
            </div>
            <div
              className={`upload-zone ${base64Image ? 'active' : ''}${loading ? ' is-scanning' : ''}${!VLM_PUBLIC_ACCESS_ENABLED ? ' is-locked' : ''}`}
              onDragOver={VLM_PUBLIC_ACCESS_ENABLED ? handleDragOver : undefined}
              onDrop={VLM_PUBLIC_ACCESS_ENABLED ? handleDrop : undefined}
            >
              {base64Image ? (
                <>
                  <img src={base64Image} alt={lang === "tr" ? "Seçilen ince kesit görseli" : "Selected thin-section image"} className="image-preview" />
                  {loading && (
                    <div className="vlm-scan-overlay" aria-hidden="true">
                      <div className="vlm-scan-beam" />
                    </div>
                  )}
                  <button
                    className="remove-btn"
                    type="button"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBase64Image("");
                      setFile(null);
                      setResult(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      requestAnimationFrame(() => uploadTriggerRef.current?.focus());
                    }}
                    aria-label={lang === "tr" ? "Görseli kaldır" : "Remove image"}
                    title={lang === "tr" ? "Görseli kaldır" : "Remove image"}
                  >
                    <CloseIcon />
                  </button>
                </>
              ) : (
                <button
                  ref={uploadTriggerRef}
                  type="button"
                  className="upload-trigger"
                  disabled={!VLM_PUBLIC_ACCESS_ENABLED}
                  onClick={() => VLM_PUBLIC_ACCESS_ENABLED && fileInputRef.current?.click()}
                >
                  <CameraIcon />
                  <span className="upload-text">
                    {VLM_PUBLIC_ACCESS_ENABLED
                      ? t("vlm.upload")
                      : lang === "tr"
                        ? "Canlı görsel yükleme sınırlı erişim modundadır"
                        : "Live image upload is in limited access mode"}
                  </span>
                  <span className="upload-hint">
                    {VLM_PUBLIC_ACCESS_ENABLED
                      ? t("vlm.formats")
                      : lang === "tr"
                        ? "Erişim tanımlandığında JPG, PNG ve WEBP desteklenir"
                        : "Supports JPG, PNG, and WEBP once access is enabled"}
                  </span>
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/jpeg, image/png, image/webp, image/gif"
                disabled={!VLM_PUBLIC_ACCESS_ENABLED}
                onChange={handleFileSelect}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="vlm-locality">{t("vlm.loc")}</label>
                <input
                  id="vlm-locality"
                  type="text"
                  name="locality"
                  placeholder={t("vlm.loc.ph")}
                  value={formData.locality}
                  disabled={!VLM_PUBLIC_ACCESS_ENABLED}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="vlm-age">{t("vlm.age")}</label>
                <input
                  id="vlm-age"
                  type="text"
                  name="age"
                  placeholder={t("vlm.age.ph")}
                  value={formData.age}
                  disabled={!VLM_PUBLIC_ACCESS_ENABLED}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="vlm-optics">{t("vlm.optics")}</label>
                <input
                  id="vlm-optics"
                  type="text"
                  name="optics"
                  placeholder={t("vlm.optics.ph")}
                  value={formData.optics}
                  disabled={!VLM_PUBLIC_ACCESS_ENABLED}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="runScore"
                name="runScore"
                checked={formData.runScore}
                disabled={!VLM_PUBLIC_ACCESS_ENABLED}
                onChange={handleChange}
              />
              <label htmlFor="runScore">{t("vlm.auto_score")}</label>
            </div>

            {error && (
              <div className="error-message" role="alert">
                <AlertIcon /> <span>{error}</span>
              </div>
            )}

            {VLM_PUBLIC_ACCESS_ENABLED ? (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading || !base64Image}
              >
                {loading ? (
                  <><span className="spinner"></span> {lang === 'tr' ? "Analiz Ediliyor..." : "Analyzing..."}</>
                ) : (
                  t("vlm.analyze_btn")
                )}
              </button>
            ) : (
              <Link to="/iletisim" className="submit-btn submit-btn--contact">
                <LockIcon />
                <span>{lang === "tr" ? "Demo & Erişim Talebi İçin İletişime Geç" : "Contact Team to Request Demo Access"}</span>
              </Link>
            )}
          </div>

          {/* Right Side: Results or Limited Mode Showcase */}
          <div className="vlm-right" aria-busy={loading} aria-live="polite">
            <h2 className="vlm-panel-title">{lang === "tr" ? "2. Bulgular ve aday cinsler" : "2. Findings and candidate genera"}</h2>
            {!VLM_PUBLIC_ACCESS_ENABLED && !result && !loading && (
              <div className="vlm-restricted-preview">
                <div className="vlm-workflow-grid">
                  <div className="vlm-workflow-step">
                    <span className="vlm-step-num">01</span>
                    <div>
                      <h3>{lang === "tr" ? "İnce Kesit Görseli" : "Thin-Section Image"}</h3>
                      <p>
                        {lang === "tr"
                          ? "Mikroskop görüntüsüyle birlikte lokasyon, jeolojik yaş ve optik kesit bağlamı modele iletilir."
                          : "Submit a micrograph along with optional locality, geological age, and section optics."}
                      </p>
                    </div>
                  </div>
                  <div className="vlm-workflow-step">
                    <span className="vlm-step-num">02</span>
                    <div>
                      <h3>{lang === "tr" ? "Otomatik Karakter Çıkarımı" : "Character Extraction"}</h3>
                      <p>
                        {lang === "tr"
                          ? "Kavkı duvarı, loca dizilimi ve septa yapıları CHR_01–CHR_21 karakter şemasına göre raporlanır."
                          : "Test wall, chamber arrangement, and septa traits are mapped to the CHR_01–CHR_21 schema."}
                      </p>
                    </div>
                  </div>
                  <div className="vlm-workflow-step">
                    <span className="vlm-step-num">03</span>
                    <div>
                      <h3>{lang === "tr" ? "Ontoloji Skor Doğrulaması" : "Ontology Scoring Verification"}</h3>
                      <p>
                        {lang === "tr"
                          ? "Çıkarılan gözlemler kural tabanlı skorlama motoruna aktarılarak olası cins adayları sıralanır."
                          : "Extracted traits flow into the rule-based engine to rank compatible foraminiferal genera."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="vlm-sample-box" aria-label={lang === "tr" ? "Örnek çıktı önizlemesi" : "Sample output preview"}>
                  <div className="vlm-sample-head">
                    <span className="vlm-sample-tag">
                      {lang === "tr" ? "Örnek Çıktı Görünümü · Canlı Sonuç Değildir" : "Sample Output Preview · Illustrative"}
                    </span>
                    <Link to="/iletisim" className="ms-link">
                      {lang === "tr" ? "Erişim iste →" : "Request access →"}
                    </Link>
                  </div>
                  <div className="vlm-suggestion vlm-suggestion--sample">
                    <div className="vlm-status">{lang === "tr" ? "Örnek VLM Önerisi" : "Sample VLM Suggestion"}</div>
                    <div className="vlm-id"><em>Nummulites</em> / Hyaline Taxon</div>
                    <p className="vlm-explanation">
                      {lang === "tr"
                        ? "Ekvatoryal kesitte çok odacıklı planispiral sarılım, belirgin septa kavislenmesi ve lamelli hiyalin duvar yapısı gözlemlenmektedir."
                        : "Equatorial section shows multilocular planispiral coiling, curved septa, and lamellar hyaline wall structure."}
                    </p>
                    <div className="observation-grid">
                      <div className="obs-card">
                        <div className="obs-id">CHR_01 · Wall</div>
                        <div className="obs-value">Hyaline (Calcareous)</div>
                        <span className="obs-state state-PRESENT">PRESENT</span>
                      </div>
                      <div className="obs-card">
                        <div className="obs-id">CHR_05 · Coiling</div>
                        <div className="obs-value">Planispiral involute</div>
                        <span className="obs-state state-PRESENT">PRESENT</span>
                      </div>
                      <div className="obs-card">
                        <div className="obs-id">CHR_11 · Septa</div>
                        <div className="obs-value">Curved radial</div>
                        <span className="obs-state state-PRESENT">PRESENT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {VLM_PUBLIC_ACCESS_ENABLED && !result && !loading && (
              <div className="empty-state">
                <BotIcon />
                <h3>{t("vlm.results")}</h3>
                <p>{t("vlm.results.ph")}</p>
              </div>
            )}

            {loading && (
              <div className="empty-state">
                <span className="spinner"></span>
                <h3>{lang === 'tr' ? "Yapay Zeka Çalışıyor..." : "AI is working..."}</h3>
                <p>{lang === 'tr' ? "Gemini Vision modeli görüntüyü inceliyor. Bu işlem birkaç saniye sürebilir." : "Gemini Vision model is processing the image. This may take a few seconds."}</p>
              </div>
            )}

            {result && !loading && (
              <div className="results-container">
                {/* VLM Suggestion */}
                {result.observation?.vlm_suggestion && (
                  <div className="vlm-suggestion">
                    <div className="vlm-status">{lang === 'tr' ? "VLM Önerisi" : "VLM suggestion"}</div>
                    <div className="vlm-id">
                      {result.observation.vlm_suggestion.best_open_id || (lang === 'tr' ? "Belirsiz Takson" : "Uncertain Taxon")}
                    </div>
                    
                    {(lang === 'tr' ? result.observation.student_explanation_tr : (result.observation.student_explanation_en || result.observation.student_explanation_tr)) && (
                      <div className="vlm-explanation">
                        {lang === 'tr' ? result.observation.student_explanation_tr : (result.observation.student_explanation_en || result.observation.student_explanation_tr)}
                      </div>
                    )}

                    <div className="vlm-candidates">
                      <strong>{lang === 'tr' ? "Aday Cinsler: " : "Candidate Genera: "}</strong>
                      {result.observation.vlm_suggestion.candidate_genera?.length > 0 ? (
                        <div className="vlm-candidate-chips">
                          {result.observation.vlm_suggestion.candidate_genera.map((g) => (
                            <Link
                              key={g.name}
                              to={`/jeoloji?taxon=${encodeURIComponent(g.name)}`}
                              className="vlm-candidate-chip"
                            >
                              <em>{g.name}</em>
                              <span aria-hidden="true">→</span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span>{lang === 'tr' ? "Bulunamadı" : "None"}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Scoring Engine Result */}
                {result.score && (
                  <div style={{ padding: '16px 20px', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '8px', background: 'var(--color-surface)' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-text)', fontSize: '15px' }}>{lang === 'tr' ? "Skor Motoru Sonucu" : "Scoring Engine Result"}</h4>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text)' }}>
                      {result.score.identification ? <em>{result.score.identification}</em> : (lang === 'tr' ? "Tanı Konulamadı" : "No diagnosis")}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-accent-text)', marginTop: '6px' }}>
                      {result.score.status}
                    </div>
                  </div>
                )}

                {/* Observations */}
                <div>
                  <h3 className="result-section-title">{lang === 'tr' ? "Karakter Çıkarımları" : "Character Extractions"}</h3>
                  <div className="observation-grid">
                    {Object.entries(result.observation?.observations || {}).map(([key, obs]) => {
                      if (obs.state === "NOT_OBSERVABLE") return null;
                      return (
                        <div key={key} className="obs-card">
                          <div className="obs-id">{key}</div>
                          <div className="obs-value">{obs.value || "-"}</div>
                          <div className={`obs-state state-${obs.state}`}>{obs.state}</div>
                          {obs.reason && (
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px', fontStyle: 'italic', lineHeight: '1.4' }}>
                              "{obs.reason}"
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="ms-message ms-message--warning vlm-disclaimer">
                  <div className="vlm-disclaimer-icon"><AlertIcon /></div>
                  <div><strong>{lang === 'tr' ? "Uyarı:" : "Warning:"}</strong> {t("warning.disclaimer")}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  </main>
);
}

export default Vlm;
