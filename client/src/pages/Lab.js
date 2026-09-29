import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { createLabWorld } from "../components/lab/labWorld";
import InspectPanel from "../components/lab/InspectPanel";
import Notebook from "../components/lab/Notebook";
import Quiz from "../components/lab/Quiz";
import { UI } from "../components/lab/labText";
import { drawPoster, posterTitle } from "../components/lab/posters";
import { QUIZ_LENGTH } from "../components/lab/quizQuestions";
import { SPECIMENS, specimenById, specimenNumber } from "../components/lab/specimens";
import "../styles/pages/lab.css";

// ─── 3D FORAMINIFERA LAB ────────────────────────────────────────────────────
// -jr The page is split in two:
//   components/lab/labWorld.js  — the three.js room (walking, clicking)
//   this file                   — React state: which panel is open, progress
// They talk through the world's small API (flyToSpecimen, setPaused, …) and
// its callbacks (onHover, onSelect, onProgress).

const PROGRESS_KEY = "foram_lab_progress";

function readProgress() {
  const empty = { studied: [], boards: [], best: null };
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") };
  } catch {
    return empty;
  }
}

// The reading view of a wall board: the same canvas, full size.
function BoardView({ id, lang, onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    drawPoster(id, lang, canvasRef.current);
  }, [id, lang]);
  const title = posterTitle(id, lang);
  return (
    <div className="lab-modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="lab-board">
        <button className="lab-icon-btn lab-board-close" onClick={onClose} aria-label={UI[lang].close}>
          ✕
        </button>
        <canvas ref={canvasRef} className="lab-board-canvas" role="img" aria-label={title} onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  );
}

function MonitorCard({ lang, onClose, onGo }) {
  const t = UI[lang];
  return (
    <div className="lab-modal" role="dialog" aria-modal="true" aria-labelledby="lab-monitor-title" onClick={onClose}>
      <div className="lab-card" onClick={(e) => e.stopPropagation()}>
        <button className="lab-icon-btn lab-board-close" onClick={onClose} aria-label={t.close}>
          ✕
        </button>
        <div className="lab-card-icon">🖥️</div>
        <h2 id="lab-monitor-title">{t.monitorTitle}</h2>
        <p>{t.monitorText}</p>
        <button className="lab-primary-btn" onClick={onGo} autoFocus>
          {t.monitorGo} →
        </button>
      </div>
    </div>
  );
}

export default function Lab() {
  const { lang } = useLanguage();
  const t = UI[lang];
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const worldRef = useRef(null);

  const [loaded, setLoaded] = useState(0);
  const [intro, setIntro] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [inspecting, setInspecting] = useState(null);
  const [board, setBoard] = useState(null);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [notebookOpen, setNotebookOpen] = useState(() => window.innerWidth > 900);
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // Private windows may refuse storage; progress then lasts one visit.
    }
  }, [progress]);

  const markStudied = useCallback((id) => {
    setProgress((p) => (p.studied.includes(id) ? p : { ...p, studied: [...p.studied, id] }));
  }, []);
  const markBoard = useCallback((id) => {
    setProgress((p) => (p.boards.includes(id) ? p : { ...p, boards: [...p.boards, id] }));
  }, []);

  // ── Opening things ──
  const openSpecimen = useCallback(
    (id, { fly = false } = {}) => {
      setBoard(null);
      setQuizOpen(false);
      const show = () => {
        setInspecting(id);
        markStudied(id);
      };
      // From the notebook or the tour: walk there first, then open.
      if (fly) worldRef.current?.flyToSpecimen(id, show);
      else {
        worldRef.current?.flyToSpecimen(id, null, true);
        show();
      }
    },
    [markStudied]
  );

  const openBoard = useCallback(
    (id, { fly = false } = {}) => {
      const show = () => {
        setBoard(id);
        markBoard(id);
      };
      if (fly) worldRef.current?.flyToBoard(id, show);
      else {
        worldRef.current?.flyToBoard(id, null, true);
        show();
      }
    },
    [markBoard]
  );

  const startTour = useCallback(() => {
    setIntro(false);
    const next = SPECIMENS.find((s) => !progress.studied.includes(s.id)) || SPECIMENS[0];
    openSpecimen(next.id, { fly: true });
  }, [openSpecimen, progress.studied]);

  const onSelect = useCallback(
    (target) => {
      if (target.kind === "specimen") openSpecimen(target.id);
      else if (target.kind === "poster") openBoard(target.id);
      else if (target.kind === "monitor") setMonitorOpen(true);
    },
    [openSpecimen, openBoard]
  );

  // The world is created once; the latest callbacks are reached through a ref.
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    const world = createLabWorld(canvasRef.current, {
      lang,
      onHover: setHovered,
      onSelect: (target) => selectRef.current(target),
      onProgress: setLoaded,
    });
    worldRef.current = world;
    return () => {
      world.dispose();
      worldRef.current = null;
    };
    // lang only seeds the first drawing; later changes go through setLanguage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    worldRef.current?.setLanguage(lang);
  }, [lang]);

  useEffect(() => {
    worldRef.current?.setStudied(progress.studied);
  }, [progress.studied]);

  const panelOpen = Boolean(inspecting || board || quizOpen || monitorOpen);
  useEffect(() => {
    // Behind the intro the room keeps rendering; behind a panel it rests.
    worldRef.current?.setPaused(panelOpen || intro, { render: intro && !panelOpen });
  }, [panelOpen, intro]);

  // Esc closes the top panel.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (quizOpen) setQuizOpen(false);
      else if (inspecting) setInspecting(null);
      else if (board) setBoard(null);
      else if (monitorOpen) setMonitorOpen(false);
      else if (intro) setIntro(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quizOpen, inspecting, board, monitorOpen, intro]);

  const hoverText = (() => {
    if (!hovered) return t.hint;
    if (hovered.kind === "specimen") {
      const s = specimenById(hovered.id);
      return `#${specimenNumber(s.id)} ${s.name} — ${t.clickToInspect}`;
    }
    if (hovered.kind === "poster") return `${posterTitle(hovered.id, lang)} — ${t.clickToRead}`;
    return `${t.monitorTitle} — ${t.clickToInspect}`;
  })();

  const loadingDone = loaded >= 1;

  return (
    // lang: CSS uppercase then follows Turkish rules (i -> İ).
    <div className="lab-wrapper" lang={lang}>
      <canvas ref={canvasRef} className="lab-canvas" aria-label={t.title} />

      {!intro && (
        <>
          <Notebook
            lang={lang}
            open={notebookOpen}
            onToggle={() => setNotebookOpen((o) => !o)}
            studied={progress.studied}
            boardsRead={progress.boards}
            bestScore={progress.best}
            quizTotal={QUIZ_LENGTH}
            onSpecimen={(id) => openSpecimen(id, { fly: true })}
            onBoard={(id) => openBoard(id, { fly: true })}
            onTour={startTour}
            onQuiz={() => setQuizOpen(true)}
          />
          <div className="lab-hud" aria-live="polite">
            <div className={`lab-hud-hint ${hovered ? "is-hover" : ""}`}>{hoverText}</div>
          </div>
          <button className="lab-help-btn" onClick={() => setIntro(true)} aria-label={t.help}>
            ?
          </button>
          {!loadingDone && (
            <div className="lab-load-chip" role="status">
              {t.loading} · {Math.round(loaded * 100)}%
            </div>
          )}
        </>
      )}

      {intro && (
        <div className="lab-intro" role="dialog" aria-modal="true" aria-labelledby="lab-intro-title">
          <div className="lab-intro-box">
            <div className="lab-intro-icon" aria-hidden="true">
              🔬
            </div>
            <h2 id="lab-intro-title">{t.title}</h2>
            <p className="lab-intro-lead">{t.introLead}</p>
            <ul className="lab-intro-goals">
              {t.introGoals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
            <div className="lab-ctrl-grid">
              <div className="lab-ctrl-item">
                <span className="lab-key-badge">W A S D</span>
                <span className="lab-ctrl-label">{t.controlsWalk}</span>
              </div>
              <div className="lab-ctrl-item">
                <span className="lab-key-badge">🖱 {t.keyDrag}</span>
                <span className="lab-ctrl-label">{t.controlsLook}</span>
              </div>
              <div className="lab-ctrl-item">
                <span className="lab-key-badge">🖱 {t.keyClick}</span>
                <span className="lab-ctrl-label">{t.controlsClick}</span>
              </div>
              <div className="lab-ctrl-item">
                <span className="lab-key-badge">⚙ {t.keyWheel}</span>
                <span className="lab-ctrl-label">{t.controlsWheel}</span>
              </div>
            </div>
            <p className="lab-intro-touch">{t.controlsTouch}</p>
            <div className="lab-intro-load" role="status">
              <div className="lab-progress">
                <div className="lab-progress-fill" style={{ width: `${Math.round(loaded * 100)}%` }} />
              </div>
              <span>{loadingDone ? `✓ ${t.ready}` : `${t.loading} · ${Math.round(loaded * 100)}%`}</span>
            </div>
            <div className="lab-intro-actions">
              <button className="lab-primary-btn" onClick={startTour} autoFocus>
                ▶ {progress.studied.length ? t.continueTour : t.startTour}
              </button>
              <button className="lab-ghost-btn" onClick={() => setIntro(false)}>
                {t.freeRoam}
              </button>
            </div>
          </div>
        </div>
      )}

      {inspecting && (
        <InspectPanel
          specimenId={inspecting}
          lang={lang}
          onClose={() => setInspecting(null)}
          onNavigate={(id) => openSpecimen(id)}
          onQuiz={() => {
            setInspecting(null);
            setQuizOpen(true);
          }}
        />
      )}

      {board && <BoardView id={board} lang={lang} onClose={() => setBoard(null)} />}

      {monitorOpen && <MonitorCard lang={lang} onClose={() => setMonitorOpen(false)} onGo={() => navigate("/tani")} />}

      {quizOpen && (
        <Quiz
          lang={lang}
          bestScore={progress.best}
          onClose={() => setQuizOpen(false)}
          onFinish={(score) => setProgress((p) => ({ ...p, best: Math.max(score, p.best ?? 0) }))}
          onStudy={(id) => openSpecimen(id)}
        />
      )}
    </div>
  );
}
