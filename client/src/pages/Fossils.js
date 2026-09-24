import { useState, useEffect } from "react";
import "../styles/pages/fossils.css";
import ceratiteIcon from "../assets/johnny-automatic-ceratite.svg";
import foraminiferaIcon from "../assets/foraminifera.svg";
import TaxonProfileCard from "../components/TaxonProfileCard";
import { useLanguage } from "../contexts/LanguageContext";

const API = process.env.REACT_APP_API_URL + "/api/diagnose";

// ─── STATUS / LEVEL META ────────────────────────────────────────────────────
const getStatusMeta = (t) => ({
  CONFIRMED_GENUS:          { label: t("status.confirmed"),      color: "#1a7a1a", bg: "#d4edda" },
  PROBABLE_GENUS:           { label: t("status.probable"),       color: "#856404", bg: "#fff3cd" },
  CANDIDATE_GENUS:          { label: t("status.candidate"),      color: "#0c5460", bg: "#d1ecf1" },
  INDETERMINATE:            { label: t("status.indeterminate"),  color: "#721c24", bg: "#f8d7da" },
  NO_MATCH_WITHIN_CORE_TAXA:{ label: t("status.nomatch"),        color: "#383d41", bg: "#e2e3e5" },
});

const getLevelLabels = (t) => ({
  M: { label: t("level.m"), color: "#721c24", bg: "#f8d7da" },
  D: { label: t("level.d"), color: "#0c5460", bg: "#d1ecf1" },
  S: { label: t("level.s"), color: "#1a7a1a", bg: "#d4edda" },
  C: { label: t("level.c"), color: "#383d41", bg: "#e2e3e5" },
});

// ─── MODULE MAP ──────────────────────────────────────────────────────────────
const MODULE_VALUE_TO_LABEL = {
  AGGLUTINATED: "Aglütinat",
  PORCELANEOUS: "Porselen",
  HYALINE: "Hyalin",
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function Fossils() {
  const [mode, setMode] = useState(null);
  const { t } = useLanguage();

  return (
    <section id="fossils" className="fossils-page">
      <div className="fossils-content">
        <h2 className="fossils-title">{t("fossils.title")}</h2>
        <p className="fossils-desc">
          {t("fossils.desc")}
        </p>
        {mode === null   && <ModeSelector onSelect={setMode} />}
        {mode === "wizard"  && <WizardMode  onBack={() => setMode(null)} />}
        {mode === "scoring" && <ScoringMode onBack={() => setMode(null)} />}
      </div>
    </section>
  );
}

// ─── MODE SELECTOR ──────────────────────────────────────────────────────────
function ModeSelector({ onSelect }) {
  const { t } = useLanguage();
  return (
    <div className="mode-selector">
      <button className="mode-card" onClick={() => onSelect("wizard")}>
        <img
          src={ceratiteIcon}
          alt={t("mode.wizard.title")}
          className="mode-icon-svg"
        />
        <strong>{t("mode.wizard.title")}</strong>
        <span>{t("mode.wizard.desc")}</span>
      </button>
      <button className="mode-card" onClick={() => onSelect("scoring")}>
        <img
          src={foraminiferaIcon}
          alt={t("mode.scoring.title")}
          className="mode-icon-svg"
        />
        <strong>{t("mode.scoring.title")}</strong>
        <span>{t("mode.scoring.desc")}</span>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WIZARD MODE — step-by-step decision tree
// ═══════════════════════════════════════════════════════════════════════════════
function WizardMode({ onBack }) {
  // Stack of {nodeType, node} — history of visited nodes
  const [stack, setStack] = useState([]); // previous states
  const [current, setCurrent] = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const { lang, t } = useLanguage();
  // Human-readable breadcrumb: [{q, a}]
  const [crumbs, setCrumbs]   = useState([]);

  // ── Fetch composition question on mount ──────────────────────────────────
  useEffect(() => {
    fetchStart();
  }, []); // eslint-disable-line

  const fetchStart = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API}/question`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.error || "Sunucu hatası");
      setCurrent(data);
    } catch (e) { setError("API bağlantısı kurulamadı: " + e.message); }
    finally  { setLoading(false); }
  };

  // ── User picks an answer ─────────────────────────────────────────────────
  const handleAnswer = async (answer) => {
    setLoading(true); setError(null);

    // Push current to stack (for back navigation)
    setStack((s) => [...s, { current, result }]);

    const qText = lang === 'tr' ? (current.node?.textTr || "Kavkı bileşimi nedir?") : (current.node?.textEn || "What is the test composition?");
    const aLabel = lang === 'tr' ? (answer.labelTr || answer.value || answer.code) : (answer.labelEn || answer.value || answer.code);

    try {
      // ── Step A: CHR_01 composition chosen → fetch module entry question ──
      if (current.nodeType === "module_select") {
        const moduleCode = answer.code || answer.value; // e.g. "AGGLUTINATED"
        const res  = await fetch(`${API}/question/entry`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module: moduleCode }),
        });
        const data = await res.json();
        if (!res.ok || data.success === false) throw new Error(data.error || "Sunucu hatası");
        setCurrent(data); setResult(null);
        setCrumbs((c) => [...c, { q: qText, a: aLabel }]);
        return;
      }

      // ── Step B: Normal question → walk ANSWER edge ───────────────────────
      const res  = await fetch(`${API}/question`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: current.node.id, answerValue: answer.value }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.error || "Sunucu hatası");
      
      setCrumbs((c) => [...c, { q: qText, a: aLabel }]);

      if (data.nodeType === "genus" || data.nodeType === "outcome") {
        setResult(data); setCurrent(null);
      } else {
        setCurrent(data); setResult(null);
      }
    } catch (e) { 
      setError("Hata: " + e.message); 
      // Revert stack and crumbs on error
      setStack((s) => s.slice(0, -1));
    }
    finally { setLoading(false); }
  };

  // ── Go back one step ─────────────────────────────────────────────────────
  const handleBack = () => {
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    setStack((s) => s.slice(0, -1));
    setCrumbs((c) => c.slice(0, -1));
    setCurrent(prev.current);
    setResult(prev.result);
    setError(null);
  };

  // ── Restart ──────────────────────────────────────────────────────────────
  const reset = () => {
    setStack([]); setCrumbs([]); setCurrent(null); setResult(null);
    fetchStart();
  };

  return (
    <div className="wizard-layout">
      {/* Breadcrumb bar */}
      <div className="wizard-breadcrumb">
        <button className="back-link" onClick={onBack}>{t("btn.back")}</button>
        {crumbs.map((c, i) => (
          <span key={i} className="breadcrumb-step">
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-q">{c.q.length > 28 ? c.q.slice(0,28)+"…" : c.q}</span>
            <span className="breadcrumb-a">→ {c.a}</span>
          </span>
        ))}
      </div>

      <div className="wizard-body">
        {/* Sidebar: step log */}
        <div className="wizard-steps">
          <div className="steps-header">{lang === 'tr' ? "Yol" : "Path"} ({crumbs.length} {lang === 'tr' ? "adım" : "steps"})</div>
          {crumbs.length === 0 && <div className="steps-empty">{lang === 'tr' ? "Henüz adım atılmadı." : "No steps taken yet."}</div>}
          {crumbs.map((c, i) => (
            <div key={i} className="step-item">
              <span className="step-num">{i + 1}</span>
              <div>
                <div className="step-q">{c.q.length > 36 ? c.q.slice(0,36)+"…" : c.q}</div>
                <div className="step-a">▶ {c.a}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div className="wizard-main">
          {loading && <div className="wizard-loading"><span className="spinner" /> {lang === 'tr' ? "Yükleniyor..." : "Loading..."}</div>}
          {error   && <div className="wizard-error">{error}</div>}

          {!loading && !error && current && !result && (
            <QuestionCard
              current={current}
              onAnswer={handleAnswer}
              onBack={stack.length > 0 ? handleBack : null}
            />
          )}

          {!loading && !error && result && (
            <ResultCard result={result} onReset={reset} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── QUESTION CARD ─────────────────────────────────────────────────────────
function QuestionCard({ current, onAnswer, onBack }) {
  const { nodeType, node } = current;
  const { lang, t } = useLanguage();
  // module_select uses node.values; question uses node.answers
  const answers = nodeType === "module_select" ? node.values : (node.answers || []);

  return (
    <div className="question-card">
      {node.sectionSensitive && (
        <div className="section-warning">
          ⚠️ <strong>{lang === 'tr' ? "Kesit Yönü Kontrolü:" : "Section Orientation:"}</strong> {lang === 'tr' ? "Bu soru kesit yönüne duyarlıdır. Aksiyal veya ekvatoryal kesit olduğundan emin olun" : "This question is sensitive to section orientation. Make sure you are using an axial or equatorial section"} (CHR_21).
        </div>
      )}

      <div className="question-code">{node.code || "CHR_01"}</div>
      <div className="question-text">{lang === 'tr' ? (node.textTr || "Kavkı bileşimi nedir?") : (node.textEn || "What is the test composition?")}</div>

      {node.character && (
        <div className="question-chr-badge">
          <span className="chr-id">{node.character.id}</span>
          <span className="chr-name">{lang === 'tr' ? node.character.nameTr : (node.character.nameEn || node.character.nameTr)}</span>
        </div>
      )}

      {node.observationHint && (
        <div className="observation-hint">
          💡 {lang === 'tr' ? "Gözlem ipucu" : "Observation hint"}:{" "}
          {Array.isArray(node.observationHint)
            ? node.observationHint.join(", ")
            : node.observationHint}
        </div>
      )}

      <div className="answer-grid">
        {answers.map((a, i) => (
          <button key={i} className="answer-btn" onClick={() => onAnswer(a)}>
            <span className="answer-label">{lang === 'tr' ? (a.labelTr || a.value || a.code) : (a.labelEn || a.value || a.code)}</span>
            {a.nextType === "genus"   && <span className="answer-tag genus-tag">→ Genus</span>}
            {a.nextType === "outcome" && <span className="answer-tag outcome-tag">→ Outcome</span>}
          </button>
        ))}
      </div>

      <div className="question-nav">
        {onBack && <button className="nav-btn back-btn" onClick={onBack}>← Back</button>}
        <button
          className="nav-btn skip-btn"
          onClick={() => onAnswer({ value: "NOT_OBSERVABLE", labelTr: "Gözlenemiyor / Emin Değilim", labelEn: "Not Observable / Not Sure" })}
        >
          {t("btn.skip")}
        </button>
      </div>
    </div>
  );
}

// ─── RESULT CARD ───────────────────────────────────────────────────────────
function ResultCard({ result, onReset, onBack }) {
  const { nodeType, node } = result;
  const { lang, t } = useLanguage();

  if (nodeType === "outcome") {
    const isIndet = node.kind === "INDETERMINATE";
    const isNotObs = node.kind === "NOT_OBSERVABLE";

    return (
      <div className="result-card outcome-card">
        <div
          className="result-status"
          style={{
            background: isNotObs ? "#fef3c7" : "#fee2e2",
            color: isNotObs ? "#92400e" : "#991b1b",
          }}
        >
          {isNotObs ? (lang === 'tr' ? "GÖZLENEMİYOR" : "NOT OBSERVABLE") : isIndet ? (lang === 'tr' ? "BELİRSİZ SONUÇ" : "INDETERMINATE RESULT") : (lang === 'tr' ? "YÖNLENDİRME" : "FORWARDING")}
        </div>

        <h3 className="result-genus" style={{ fontSize: "20px" }}>
          {isNotObs ? (lang === 'tr' ? "Bu karakter belirlenemedi" : "This character could not be determined") : node.id.replace(/_/g, " ")}
        </h3>

        <p style={{ color: "var(--color-text-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
          {isNotObs
            ? (node.message || (lang === 'tr' ? "Bu karakter gözlenemediğinden karar ağacında ilerlenemiyor." : "Cannot proceed in decision tree because this character is not observable."))
            : isIndet
              ? (lang === 'tr' ? "Bu kesitte yeterli tanı bilgisi elde edilemedi. Farklı kesit yönü veya ek gözlem deneyin." : "Insufficient diagnostic information in this section. Try a different section or observation.")
              : (lang === 'tr' ? "Karar ağacı bu noktada başka bir dala yönlendiriyor." : "The decision tree forwards to another branch here.")}
        </p>

        {/* NOT_OBSERVABLE: show reachable genera */}
        {isNotObs && node.reachableGenera && node.reachableGenera.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", color: "var(--color-text)" }}>
              {lang === 'tr' ? "Bu daldan erişilebilir olası cinsler" : "Reachable candidate genera from this branch"} ({node.reachableGenera.length}):
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {node.reachableGenera.map((g) => (
                <span
                  key={g.name}
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    fontSize: "13px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    color: "#166534",
                    fontStyle: "italic",
                    fontWeight: "500",
                  }}
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* NOT_OBSERVABLE: show available branches for re-selection */}
        {isNotObs && node.availableBranches && node.availableBranches.length > 0 && (
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "16px",
            fontSize: "14px",
          }}>
            <strong style={{ color: "#1e3a8a" }}>💡 {lang === 'tr' ? "İpucu:" : "Hint:"}</strong>{" "}
            <span style={{ color: "#1e40af" }}>
              {lang === 'tr' ? "Geri gidip bu soru için mevcut cevaplardan birini seçebilirsiniz:" : "You can go back and choose one of the available answers for this question:"}{" "}
              {node.availableBranches.map((b) => (lang === 'tr' ? b.labelTr : b.labelEn) || b.value).join(", ")}
            </span>
          </div>
        )}

        <div className="result-actions">
          <button className="nav-btn back-btn" onClick={onBack}>← Back</button>
          <button className="nav-btn reset-btn" onClick={onReset}>{t("btn.reset")}</button>
        </div>
      </div>
    );
  }

  // Genus result
  const { name, module, flag, taxonomicReviewRequired, rules = {}, closestComparisons = [] } = node;

  return (
    <div className="result-card genus-result">
      <div className="result-status" style={{ background: "#d4edda", color: "#1a7a1a" }}>
        ✓ {t("genus.found")}
      </div>
      <h3 className="result-genus"><em>{name}</em></h3>
      <div className="result-module-badge">{module}</div>

      {flag && <div className="flag-warning">⚠️ {flag}</div>}
      {taxonomicReviewRequired && (
        <div className="flag-warning">⚠️ {t("warning.taxonomic")}</div>
      )}

      <div className="flag-warning" style={{ background: "#fff3cd", color: "#856404", border: "1px solid #ffeeba", marginTop: "12px", fontSize: "13px" }}>
        <strong>{lang === 'tr' ? "Uyarı:" : "Warning:"}</strong> {t("warning.disclaimer")}
      </div>

      <div className="rules-section">
        {Object.entries(rules).map(([level, items]) =>
          !items || items.length === 0 ? null : (
            <div key={level} className="rule-group">
              <div
                className="rule-group-header"
                style={{
                  background: getLevelLabels(t)[level[0]]?.bg,
                  color: getLevelLabels(t)[level[0]]?.color,
                }}
              >
                [{level[0]}] {getLevelLabels(t)[level[0]]?.label || level}
              </div>
              <ul className="rule-list">
                {items.map((r, i) => (
                  <li key={i} className="rule-item">
                    {r.code && <span className="rule-code">{r.code}</span>}
                    {r.text}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>

      {closestComparisons.length > 0 && (
        <div className="comparisons">
          <strong>{t("genus.closest")}</strong>
          {closestComparisons.map((c, i) => (
            <span key={i} className="comparison-chip"><em>{c}</em></span>
          ))}
        </div>
      )}

      <TaxonProfileCard scientificName={name} />

      <div className="result-actions">
        <button className="nav-btn back-btn" onClick={onBack}>← Back</button>
        <button className="nav-btn reset-btn" onClick={onReset}>{t("btn.reset")}</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING MODE
// ═══════════════════════════════════════════════════════════════════════════════
const CHR_LIST = [
  { id: "CHR_01", nameTr: "Kavkı bileşimi", nameEn: "Test composition", values: [
    { code: "AGGLUTINATED", labelTr: "Aglütinat", labelEn: "Agglutinated" },
    { code: "PORCELANEOUS", labelTr: "Porselen", labelEn: "Porcelaneous" },
    { code: "HYALINE",      labelTr: "Hyalin", labelEn: "Hyaline" },
  ]},
  { id: "CHR_03", nameTr: "Septalarla bölünme", nameEn: "Septation", values: [
    { code: "PRESENT", labelTr: "Var", labelEn: "Present" }, { code: "ABSENT", labelTr: "Yok", labelEn: "Absent" },
  ]},
  { id: "CHR_04", nameTr: "Loca organizasyonu", nameEn: "Chamber organization", values: [
    { code: "UNDIVIDED", labelTr: "Septasız", labelEn: "Undivided" }, { code: "MULTICHAMBERED", labelTr: "Çok localı", labelEn: "Multichambered" },
  ]},
  { id: "CHR_05", nameTr: "Loca dizilimi", nameEn: "Chamber arrangement", values: [
    { code: "UNISERIAL", labelTr: "Uniserial", labelEn: "Uniserial" }, { code: "BISERIAL", labelTr: "Biserial", labelEn: "Biserial" },
    { code: "TRISERIAL", labelTr: "Triserial", labelEn: "Triserial" }, { code: "QUINQUELOCULINE", labelTr: "Quinqueloculine", labelEn: "Quinqueloculine" },
    { code: "CYCLIC", labelTr: "Siklik", labelEn: "Cyclic" },
  ]},
  { id: "CHR_06", nameTr: "Sarılım tipi", nameEn: "Coiling pattern", values: [
    { code: "PLANISPIRAL", labelTr: "Planispiral", labelEn: "Planispiral" }, { code: "TROCHOSPIRAL", labelTr: "Trokospiral", labelEn: "Trochospiral" },
    { code: "STREPTOSPIRAL", labelTr: "Streptospiral", labelEn: "Streptospiral" }, { code: "GLOMOSPIRAL", labelTr: "Glomospiral", labelEn: "Glomospiral" },
    { code: "UNCOILED", labelTr: "Sarılmamış", labelEn: "Uncoiled" },
  ]},
  { id: "CHR_08", nameTr: "İnvolüt / Evolüt", nameEn: "Involution / Evolution", values: [
    { code: "INVOLUTE", labelTr: "İnvolüt", labelEn: "Involute" }, { code: "SEMI_INVOLUTE", labelTr: "Yarı involüt", labelEn: "Semi Involute" },
    { code: "EVOLUTE", labelTr: "Evolüt", labelEn: "Evolute" },
  ]},
  { id: "CHR_09", nameTr: "Büyüme sırasında değişim", nameEn: "Ontogenetic change", values: [
    { code: "NONE", labelTr: "Değişim yok", labelEn: "None" },
    { code: "PLANISPIRAL_TO_BISERIAL",  labelTr: "Planispiral → Biserial", labelEn: "Planispiral → Biserial" },
    { code: "PLANISPIRAL_TO_UNISERIAL", labelTr: "Planispiral → Uniserial", labelEn: "Planispiral → Uniserial" },
    { code: "TRISERIAL_TO_BISERIAL",    labelTr: "Triserial → Biserial", labelEn: "Triserial → Biserial" },
    { code: "TRISERIAL_TO_UNISERIAL",   labelTr: "Triserial → Uniserial", labelEn: "Triserial → Uniserial" },
    { code: "COILED_TO_SERIAL",         labelTr: "Sarılı → Seri", labelEn: "Coiled → Serial" },
  ]},
  { id: "CHR_10", nameTr: "İç yapı karmaşıklığı", nameEn: "Internal complexity", values: [
    { code: "SIMPLE", labelTr: "Basit", labelEn: "Simple" }, { code: "SUBDIVIDED", labelTr: "Alt bölmeli", labelEn: "Subdivided" },
    { code: "COMPLEX", labelTr: "Karmaşık", labelEn: "Complex" }, { code: "LABYRINTHIC", labelTr: "Labirentik", labelEn: "Labyrinthic" },
  ]},
  { id: "CHR_11", nameTr: "İkincil locacıklar", nameEn: "Secondary chamberlets", values: [
    { code: "PRESENT", labelTr: "Var", labelEn: "Present" }, { code: "ABSENT", labelTr: "Yok", labelEn: "Absent" },
    { code: "WELL_DEVELOPED", labelTr: "İyi gelişmiş", labelEn: "Well Developed" },
  ]},
  { id: "CHR_13", nameTr: "İç bölmeler", nameEn: "Internal partitions", values: [
    { code: "ABSENT", labelTr: "Yok", labelEn: "Absent" }, { code: "RADIAL", labelTr: "Radyal", labelEn: "Radial" },
    { code: "SUBEPIDERMAL", labelTr: "Subepidermal", labelEn: "Subepidermal" }, { code: "VERTICAL", labelTr: "Düşey", labelEn: "Vertical" },
  ]},
  { id: "CHR_14", nameTr: "Pillarlar", nameEn: "Pillars", values: [
    { code: "PRESENT", labelTr: "Var", labelEn: "Present" }, { code: "ABSENT", labelTr: "Yok", labelEn: "Absent" },
    { code: "STRONG", labelTr: "Güçlü", labelEn: "Strong" }, { code: "WEAK", labelTr: "Zayıf", labelEn: "Weak" },
  ]},
  { id: "CHR_17", nameTr: "Marjinal kord", nameEn: "Marginal cord", values: [
    { code: "PRESENT", labelTr: "Var", labelEn: "Present" }, { code: "ABSENT", labelTr: "Yok", labelEn: "Absent" },
    { code: "STRONG", labelTr: "Güçlü", labelEn: "Strong" },
  ]},
  { id: "CHR_21", nameTr: "Kesit yönü", nameEn: "Section orientation", values: [
    { code: "AXIAL", labelTr: "Eksenel", labelEn: "Axial" }, { code: "EQUATORIAL", labelTr: "Ekvatoryal", labelEn: "Equatorial" },
    { code: "OBLIQUE", labelTr: "Eğik", labelEn: "Oblique" }, { code: "UNKNOWN", labelTr: "Bilinmiyor", labelEn: "Unknown" },
  ]},
];

function ScoringMode({ onBack }) {
  const [observations, setObservations] = useState({});
  const [scoreResult, setScoreResult]   = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const { lang, t } = useLanguage();

  const toggleObs = (chrId, value) => {
    setObservations((prev) => {
      const cur = prev[chrId];
      if (value === "__NOT_OBS__") {
        // Toggle NOT_OBSERVABLE
        if (cur?.state === "NOT_OBSERVABLE") {
          const next = { ...prev }; delete next[chrId]; return next;
        }
        return { ...prev, [chrId]: { value: null, state: "NOT_OBSERVABLE" } };
      }
      if (cur?.value === value && cur?.state === "PRESENT") {
        const next = { ...prev }; delete next[chrId]; return next;
      }
      return { ...prev, [chrId]: { value, state: "PRESENT" } };
    });
  };

  const handleScore = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${API}/score`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observations }),
      });
      const data = await res.json();
      if (data.success) setScoreResult(data);
      else setError(data.error);
    } catch { setError("API bağlantısı kurulamadı."); }
    finally   { setLoading(false); }
  };

  const reset = () => { setObservations({}); setScoreResult(null); setError(null); };

  return (
    <div className="scoring-layout">
      <button className="back-link" onClick={onBack} style={{ marginBottom: "12px" }}>
        {t("btn.back")}
      </button>

      <div className="scoring-body">
        {/* Left: character selector */}
        <div className="scoring-form">
          <div className="scoring-form-header">{lang === 'tr' ? "Morfolojik Gözlemler" : "Morphological Observations"}</div>
          <p className="scoring-hint">
            {lang === 'tr' ? "Gözlemlediğiniz değerleri seçin. Belirsizse \"Gözlenemiyor\"u işaretleyin." : "Select the values you observed. If uncertain, check \"Not Observable\"."}
          </p>

          {CHR_LIST.map((chr) => {
            const obs = observations[chr.id];
            return (
              <div key={chr.id} className="chr-block">
                <div className="chr-block-header">
                  <span className="chr-id-badge">{chr.id}</span>
                  <span className="chr-name-text">{lang === 'tr' ? chr.nameTr : (chr.nameEn || chr.nameTr)}</span>
                  {obs && (
                    <button className="chr-clear" onClick={() => {
                      setObservations((p) => { const n={...p}; delete n[chr.id]; return n; });
                    }}>✕</button>
                  )}
                </div>
                <div className="chr-values">
                  {chr.values.map((v) => {
                    const sel = obs?.value === v.code && obs?.state === "PRESENT";
                    return (
                      <button
                        key={v.code}
                        className={`chr-value-btn${sel ? " selected" : ""}`}
                        onClick={() => toggleObs(chr.id, v.code)}
                      >
                        {lang === 'tr' ? v.labelTr : (v.labelEn || v.labelTr || v.code)}
                      </button>
                    );
                  })}
                  <button
                    className={`chr-value-btn not-obs-btn${obs?.state === "NOT_OBSERVABLE" ? " selected" : ""}`}
                    onClick={() => toggleObs(chr.id, "__NOT_OBS__")}
                  >
                    {t("btn.skip")}
                  </button>
                </div>
              </div>
            );
          })}

          <button className="diagnose-button" onClick={handleScore} disabled={loading}>
            {loading ? t("btn.scoring") : t("btn.score")}
          </button>
          {Object.keys(observations).length > 0 && (
            <button className="nav-btn reset-btn" onClick={reset} style={{ marginTop: "6px", width: "100%" }}>
              {t("btn.reset")}
            </button>
          )}
        </div>

        {/* Right: results */}
        <div className="scoring-results">
          {!scoreResult && !loading && !error && (
            <div className="no-results">
              {Object.keys(observations).length === 0
                ? (lang === 'tr' ? "Gözlem seçin ve puanlama yapın." : "Select observations and calculate score.")
                : (lang === 'tr' ? `${Object.keys(observations).filter(k => observations[k]?.state === "PRESENT").length} aktif gözlem seçildi — Puanla butonuna tıklayın.` : `${Object.keys(observations).filter(k => observations[k]?.state === "PRESENT").length} active observations selected — Click Score.`)}
            </div>
          )}
          {loading && <div className="wizard-loading"><span className="spinner" /> {lang === 'tr' ? "Puanlanıyor..." : "Scoring..."}</div>}
          {error   && <div className="wizard-error">{error}</div>}
          {scoreResult && !loading && <ScoreResult data={scoreResult} />}
        </div>
      </div>
    </div>
  );
}

// ─── SCORE RESULT ──────────────────────────────────────────────────────────
function ScoreResult({ data }) {
  const { status, identification, confidenceNote, ranking = [], excluded = [], observedCharacterCount } = data;
  const { lang, t } = useLanguage();
  const meta = getStatusMeta(t)[status] || {};

  return (
    <div className="score-result">
      <div
        className="score-status-banner"
        style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}` }}
      >
        <strong>{meta.label || status}</strong>
        {identification && <span className="score-id-name"> — <em>{identification}</em></span>}
      </div>

      <div className="confidence-note" style={{ background: "#fff3cd", color: "#856404", border: "1px solid #ffeeba", padding: "8px 12px", borderRadius: "6px", marginBottom: "12px", fontSize: "13px", marginTop: "12px" }}>
        <strong>{lang === 'tr' ? "Uyarı:" : "Warning:"}</strong> {t("warning.disclaimer")}
      </div>

      {confidenceNote && <div className="confidence-note">{t(confidenceNote)}</div>}
      <div className="obs-count">
        {t("score.obs_count")}: <strong>{observedCharacterCount}</strong>
      </div>

      {identification && <TaxonProfileCard scientificName={identification} />}

      {ranking.length > 0 && (
        <div className="ranking-section">
          <div className="ranking-header">{t("score.ranking")}</div>
          <table className="ranking-table">
            <thead>
              <tr>
                <th>#</th><th>{lang === 'tr' ? "Cins" : "Genus"}</th><th>{lang === 'tr' ? "Mod." : "Mod."}</th>
                <th>{lang === 'tr' ? "Puan" : "Score"}</th><th>M.</th><th>D.</th><th>C.</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.genus} className={i === 0 ? "top-row" : ""}>
                  <td>{i + 1}</td>
                  <td><em>{r.genus}</em>{r.flag ? " ⚠️" : ""}</td>
                  <td><span className="module-chip">{r.module?.slice(0, 3)}</span></td>
                  <td><strong>{r.score}</strong></td>
                  <td>{r.mandatoryMatched}/{r.mandatoryTotal}</td>
                  <td>{r.diagnosticMatched?.length || 0}</td>
                  <td style={{ color: r.contradictions?.length > 0 ? "#721c24" : "inherit" }}>
                    {r.contradictions?.length || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Evidence for top candidate */}
          {ranking[0]?.matchedEvidence?.length > 0 && (
            <div className="evidence-section">
              <div className="evidence-header">
                {lang === 'tr' ? "Eşleşen kanıtlar" : "Matched evidence"} — <em>{ranking[0].genus}</em>
              </div>
              {ranking[0].matchedEvidence.map((e, i) => {
                const lm = getLevelLabels(t)[e.level] || {};
                return (
                  <div
                    key={i}
                    className="evidence-item"
                    style={{ borderLeft: `3px solid ${lm.color || "#ccc"}` }}
                  >
                    <span
                      className="evidence-level-badge"
                      style={{ background: lm.bg, color: lm.color }}
                    >
                      [{e.level}]
                    </span>
                    <span className="evidence-text">{e.text}</span>
                    <span className="evidence-detail">{e.detail}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {excluded.length > 0 && (
        <details className="excluded-section">
          <summary>{t("score.excluded")} ({excluded.length})</summary>
          <ul className="excluded-list">
            {excluded.map((r) => (
              <li key={r.genus}>
                <em>{r.genus}</em>:{" "}
                <span className="excluded-reason">{r.exclusionReason}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

export default Fossils;
