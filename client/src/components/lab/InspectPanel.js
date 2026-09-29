import React, { useEffect, useState } from "react";
import SpecimenViewer from "./SpecimenViewer";
import { UI } from "./labText";
import { ARRANGEMENT, GLOSSARY, LIFE, SIZE_REFERENCES, SPECIMENS, WALL, formatSize, specimenNumber } from "./specimens";

// ─── INSPECTION PANEL ───────────────────────────────────────────────────────
// Opens over the room when an exhibit is chosen: a large 3D viewer on one
// side, the teaching card in tabs on the other, and previous / next buttons
// that walk the tour order.

const TABS = ["overview", "identify", "why", "source"];

// Logarithmic ruler from 0.05 mm to 100 mm: a foraminifer next to a hair,
// a sand grain, a grain of rice and a coin.
const RULER_MIN = Math.log10(0.05);
const RULER_MAX = Math.log10(100);
const rulerX = (mm) => ((Math.log10(mm) - RULER_MIN) / (RULER_MAX - RULER_MIN)) * 100;

function SizeRuler({ specimen, lang }) {
  const t = UI[lang];
  const x = rulerX(specimen.size.mm);
  return (
    <div className="lab-ruler">
      <div className="lab-ruler-title">{t.sizeRuler}</div>
      <div className="lab-ruler-track">
        <div className="lab-ruler-marker" style={{ left: `${x}%` }}>
          <span className="lab-ruler-marker-label">
            <em>{specimen.name.split(" ")[0]}</em> ≈ {formatSize(specimen.size.mm, lang)}
          </span>
        </div>
        {SIZE_REFERENCES.map((ref) => (
          <div key={ref.mm} className="lab-ruler-tick" style={{ left: `${rulerX(ref.mm)}%` }}>
            <span>
              {ref[lang]}
              <br />
              {formatSize(ref.mm, lang)}
            </span>
          </div>
        ))}
      </div>
      {!specimen.size.known && <p className="lab-ruler-note">{t.sizeUnknown}</p>}
    </div>
  );
}

export default function InspectPanel({ specimenId, lang, onClose, onNavigate, onQuiz }) {
  const t = UI[lang];
  const specimen = SPECIMENS.find((s) => s.id === specimenId);
  const c = specimen[lang];
  const index = SPECIMENS.indexOf(specimen);

  const [tab, setTab] = useState("overview");
  const [mode, setMode] = useState("solid");
  const [depth, setDepth] = useState(0.5);
  const [rotate, setRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setTab("overview");
    setMode("solid");
    setDepth(0.5);
  }, [specimenId]);

  // Sectioning a spinning model is hard to follow: stop the spin for it.
  const chooseMode = (next) => {
    setMode(next);
    if (next === "section") setRotate(false);
  };

  const facts = specimen.art
    ? []
    : [
        [t.life, LIFE[specimen.life][lang]],
        [t.wall, WALL[specimen.wall][lang]],
        [t.arrangement, ARRANGEMENT[specimen.arrangement][lang]],
        [t.habitat, c.habitat],
        ...(c.record ? [[t.record, c.record]] : []),
      ];

  const previous = SPECIMENS[index - 1];
  const next = SPECIMENS[index + 1];

  return (
    <div className="lab-modal" role="dialog" aria-modal="true" aria-labelledby="lab-inspect-title" onClick={onClose}>
      <div className="lab-inspect" onClick={(e) => e.stopPropagation()}>
        <header className="lab-inspect-head">
          <span className={`lab-num ${specimen.art ? "is-art" : ""}`}>{specimenNumber(specimen.id)}</span>
          <div className="lab-inspect-titles">
            <h2 id="lab-inspect-title">
              <span className={specimen.art ? "" : "lab-taxon"}>{specimen.name}</span>
              {specimen.authority && <span className="lab-authority"> {specimen.authority}</span>}
            </h2>
            <div className="lab-chips">
              {specimen.art ? (
                <span className="lab-chip is-art">{t.artBadge}</span>
              ) : (
                <>
                  <span className={`lab-chip is-${specimen.life}`}>{LIFE[specimen.life][lang]}</span>
                  <span className="lab-chip">{WALL[specimen.wall][lang]}</span>
                  <span className="lab-chip">{ARRANGEMENT[specimen.arrangement][lang]}</span>
                </>
              )}
            </div>
          </div>
          <button className="lab-icon-btn" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </header>

        <div className="lab-inspect-body">
          <section className="lab-stage">
            <SpecimenViewer
              specimen={specimen}
              mode={mode}
              sectionDepth={depth}
              autoRotate={rotate}
              resetKey={resetKey}
              onDetailLoading={setLoadingDetail}
            />
            {loadingDetail && <div className="lab-stage-chip">{t.viewer.loadingDetail}</div>}
            {specimen.size && (
              <div className="lab-stage-size">
                {specimen.size.known ? t.realSize : t.typicalSize} ≈ {formatSize(specimen.size.mm, lang)}
              </div>
            )}
            <div className="lab-stage-tools">
              <div className="lab-segmented" role="group" aria-label={t.viewer.mode}>
                {["solid", "xray", "section"].map((m) => (
                  <button key={m} className={mode === m ? "is-active" : ""} aria-pressed={mode === m} onClick={() => chooseMode(m)}>
                    {t.viewer[m]}
                  </button>
                ))}
              </div>
              <button className={`lab-tool-btn ${rotate ? "is-active" : ""}`} aria-pressed={rotate} onClick={() => setRotate(!rotate)}>
                ⟳ {t.viewer.rotate}
              </button>
              <button className="lab-tool-btn" onClick={() => setResetKey((k) => k + 1)}>
                ⤢ {t.viewer.reset}
              </button>
            </div>
            {mode === "section" && (
              <label className="lab-section-slider">
                <span>{t.viewer.depth}</span>
                <input type="range" min="0" max="1" step="0.01" value={depth} onChange={(e) => setDepth(Number(e.target.value))} />
              </label>
            )}
            <p className="lab-stage-note">
              {mode === "section" ? t.viewer.sectionHint : specimen.internal ? t.viewer.internalHint : t.viewer.noInternal}
              <span className="lab-stage-drag"> · {t.viewer.dragHint}</span>
            </p>
          </section>

          <section className="lab-info">
            <div className="lab-tabs" role="tablist">
              {TABS.map((key) => (
                <button
                  key={key}
                  role="tab"
                  id={`lab-tab-${key}`}
                  aria-selected={tab === key}
                  aria-controls="lab-tabpanel"
                  className={tab === key ? "is-active" : ""}
                  onClick={() => setTab(key)}
                >
                  {t.tabs[key]}
                </button>
              ))}
            </div>

            <div className="lab-tabpanel" role="tabpanel" id="lab-tabpanel" aria-labelledby={`lab-tab-${tab}`}>
              {tab === "overview" && (
                <>
                  <p className="lab-lead">{c.summary}</p>
                  {facts.length > 0 && (
                    <dl className="lab-facts">
                      {facts.map(([label, value]) => (
                        <div key={label} className="lab-fact">
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {specimen.size && <SizeRuler specimen={specimen} lang={lang} />}
                  <div className="lab-terms">
                    <div className="lab-terms-title">{t.terms}</div>
                    <dl>
                      {specimen.terms.map((key) => (
                        <div key={key} className="lab-term">
                          <dt>{GLOSSARY[key][lang][0]}</dt>
                          <dd>{GLOSSARY[key][lang][1]}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </>
              )}

              {tab === "identify" && (
                <>
                  <h3 className="lab-subhead">{t.lookFor}</h3>
                  <ol className="lab-look">
                    {c.look.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </>
              )}

              {tab === "why" && <p className="lab-lead">{c.why}</p>}

              {tab === "source" && (
                <dl className="lab-facts is-stacked">
                  <div className="lab-fact">
                    <dt>{t.specimenInfo}</dt>
                    <dd>{c.specimen}</dd>
                  </div>
                  <div className="lab-fact">
                    <dt>{t.modelCredit}</dt>
                    <dd>{specimen.source.author}</dd>
                  </div>
                  <div className="lab-fact">
                    <dt>{t.license}</dt>
                    <dd>
                      <a href={specimen.source.licenseUrl} target="_blank" rel="noreferrer">
                        {specimen.source.license}
                      </a>
                      . {t.modified}
                    </dd>
                  </div>
                  <div className="lab-fact">
                    <dt>Sketchfab</dt>
                    <dd>
                      <a href={specimen.source.url} target="_blank" rel="noreferrer">
                        {t.viewSource} ↗
                      </a>
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </section>
        </div>

        <footer className="lab-inspect-foot">
          <button className="lab-ghost-btn" disabled={!previous} onClick={() => previous && onNavigate(previous.id)}>
            ← {t.prev}
          </button>
          <span className="lab-step">
            {index + 1} / {SPECIMENS.length}
          </span>
          {next ? (
            <button className="lab-primary-btn" onClick={() => onNavigate(next.id)}>
              {t.next} →
            </button>
          ) : (
            <button className="lab-primary-btn" onClick={onQuiz}>
              🧪 {t.finishTour}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
