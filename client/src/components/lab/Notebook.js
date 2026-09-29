import React from "react";
import { UI } from "./labText";
import { POSTERS, posterTitle } from "./posters";
import { LIFE, SPECIMENS, specimenNumber } from "./specimens";

// ─── FIELD NOTEBOOK ─────────────────────────────────────────────────────────
// The visitor's checklist: every exhibit and board, ticked once opened. A
// row takes the visitor there; the buttons start the tour or the quiz.

export default function Notebook({ lang, open, onToggle, studied, boardsRead, bestScore, quizTotal, onSpecimen, onBoard, onTour, onQuiz }) {
  const t = UI[lang];
  const doneCount = studied.length + boardsRead.length;
  const total = SPECIMENS.length + POSTERS.length;
  const tourStarted = studied.length > 0;
  const tourDone = studied.length === SPECIMENS.length;

  return (
    <aside className={`lab-notebook ${open ? "is-open" : ""}`} aria-label={t.notebook}>
      <button className="lab-notebook-toggle" onClick={onToggle} aria-expanded={open}>
        <span>📓 {t.notebook}</span>
        <span className="lab-notebook-count">
          {doneCount}/{total}
        </span>
      </button>

      {open && (
        <div className="lab-notebook-body">
          <div className="lab-progress" aria-hidden="true">
            <div className="lab-progress-fill" style={{ width: `${(doneCount / total) * 100}%` }} />
          </div>

          <div className="lab-notebook-actions">
            {!tourDone && (
              <button className="lab-primary-btn is-small" onClick={onTour}>
                ▶ {tourStarted ? t.continueTour : t.tour}
              </button>
            )}
            <button className={`${tourDone ? "lab-primary-btn" : "lab-ghost-btn"} is-small`} onClick={onQuiz}>
              🧪 {t.quiz}
              {typeof bestScore === "number" && <span className="lab-notebook-best"> · {bestScore}/{quizTotal}</span>}
            </button>
          </div>

          <h3 className="lab-notebook-head">
            {t.exhibits} <span>{studied.length}/{SPECIMENS.length}</span>
          </h3>
          <ul className="lab-notebook-list">
            {SPECIMENS.map((s) => {
              const done = studied.includes(s.id);
              return (
                <li key={s.id}>
                  <button className={done ? "is-done" : ""} onClick={() => onSpecimen(s.id)}>
                    <span className={`lab-num is-small ${s.art ? "is-art" : ""}`}>{done ? "✓" : specimenNumber(s.id)}</span>
                    <span className="lab-notebook-name">
                      <span className={s.art ? "" : "lab-taxon"}>{s.name}</span>
                      <small>{s.art ? t.artBadge : LIFE[s.life][lang]}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <h3 className="lab-notebook-head">
            {t.boards} <span>{boardsRead.length}/{POSTERS.length}</span>
          </h3>
          <ul className="lab-notebook-list">
            {POSTERS.map((p) => {
              const done = boardsRead.includes(p.id);
              return (
                <li key={p.id}>
                  <button className={done ? "is-done" : ""} onClick={() => onBoard(p.id)}>
                    <span className="lab-num is-small is-board">{done ? "✓" : p.icon}</span>
                    <span className="lab-notebook-name">{posterTitle(p.id, lang)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
