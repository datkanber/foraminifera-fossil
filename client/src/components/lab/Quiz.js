import React, { useMemo, useState } from "react";
import SpecimenViewer from "./SpecimenViewer";
import { UI } from "./labText";
import { buildQuizRound } from "./quizQuestions";
import { SPECIMENS } from "./specimens";

// ─── QUIZ ───────────────────────────────────────────────────────────────────
// One round of questions from quizQuestions.js. Specimen questions show the
// model in a small viewer (its name is never shown there). Every answer is
// followed by an explanation; the result lists exhibits worth another look.

function resultMessage(t, score, total) {
  const ratio = score / total;
  if (ratio === 1) return t.resultMessages[3];
  if (ratio >= 0.75) return t.resultMessages[2];
  if (ratio >= 0.5) return t.resultMessages[1];
  return t.resultMessages[0];
}

export default function Quiz({ lang, bestScore, onClose, onFinish, onStudy }) {
  const t = UI[lang];
  const [round, setRound] = useState(0);
  const questions = useMemo(() => buildQuizRound(), [round]);
  const [index, setIndex] = useState(-1); // -1: intro screen
  const [answers, setAnswers] = useState([]);

  const question = questions[index];
  const chosen = answers[index];
  const answered = chosen !== undefined;
  const finished = index >= questions.length;
  const score = answers.filter((a, i) => a === questions[i].answer).length;

  const choose = (option) => {
    if (answered) return;
    const next = [...answers];
    next[index] = option;
    setAnswers(next);
  };

  const advance = () => {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) onFinish(score, questions.length);
    setIndex(nextIndex);
  };

  const restart = () => {
    setRound((r) => r + 1);
    setAnswers([]);
    setIndex(0);
  };

  const missed = finished
    ? [...new Set(questions.filter((q, i) => q.specimenId && answers[i] !== q.answer).map((q) => q.specimenId))]
    : [];

  return (
    <div className="lab-modal" role="dialog" aria-modal="true" aria-labelledby="lab-quiz-title" onClick={onClose}>
      <div className="lab-quiz" onClick={(e) => e.stopPropagation()}>
        <header className="lab-quiz-head">
          <h2 id="lab-quiz-title">🧪 {t.quizTitle}</h2>
          {index >= 0 && !finished && (
            <ol className="lab-quiz-dots" aria-label={`${t.question} ${index + 1} / ${questions.length}`}>
              {questions.map((q, i) => (
                <li
                  key={i}
                  className={
                    answers[i] === undefined ? (i === index ? "is-current" : "") : answers[i] === q.answer ? "is-right" : "is-wrong"
                  }
                />
              ))}
            </ol>
          )}
          <button className="lab-icon-btn" onClick={onClose} aria-label={t.close}>
            ✕
          </button>
        </header>

        {index === -1 && (
          <div className="lab-quiz-intro">
            <p>{t.quizIntro}</p>
            {typeof bestScore === "number" && (
              <p className="lab-quiz-best">
                {t.bestScore}: {bestScore} / {questions.length}
              </p>
            )}
            <button className="lab-primary-btn" onClick={() => setIndex(0)} autoFocus>
              {t.quizStart} →
            </button>
          </div>
        )}

        {question && (
          <div className={`lab-quiz-body ${question.specimenId ? "has-model" : ""}`}>
            {question.specimenId && (
              <SpecimenViewer
                className="lab-quiz-viewer"
                specimen={SPECIMENS.find((s) => s.id === question.specimenId)}
              />
            )}
            <div className="lab-quiz-question">
              <div className="lab-quiz-count">
                {t.question} {index + 1} / {questions.length}
              </div>
              <h3>{question[lang].prompt}</h3>
              <div className="lab-quiz-options">
                {question.options[lang].map((option, i) => {
                  let state = "";
                  if (answered && i === question.answer) state = "is-right";
                  else if (answered && i === chosen) state = "is-wrong";
                  return (
                    <button key={option} className={`lab-quiz-option ${state}`} disabled={answered} onClick={() => choose(i)}>
                      {option}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className={`lab-quiz-feedback ${chosen === question.answer ? "is-right" : "is-wrong"}`} role="status">
                  <strong>
                    {chosen === question.answer ? t.correct : `${t.wrong} ${t.answerWas}: ${question.options[lang][question.answer]}.`}
                  </strong>
                  <p>{question[lang].explain}</p>
                  <button className="lab-primary-btn" onClick={advance} autoFocus>
                    {index + 1 < questions.length ? `${t.next} →` : t.seeResult}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {finished && (
          <div className="lab-quiz-result">
            <div className="lab-quiz-score">
              {score}
              <span> / {questions.length}</span>
            </div>
            <p className="lab-quiz-message">{resultMessage(t, score, questions.length)}</p>
            {missed.length > 0 && (
              <div className="lab-quiz-missed">
                <div className="lab-terms-title">{t.studyAgain}</div>
                {missed.map((id) => {
                  const s = SPECIMENS.find((x) => x.id === id);
                  return (
                    <button key={id} className="lab-ghost-btn" onClick={() => onStudy(id)}>
                      <em>{s.name}</em> →
                    </button>
                  );
                })}
              </div>
            )}
            <div className="lab-quiz-actions">
              <button className="lab-ghost-btn" onClick={onClose}>
                {t.backToLab}
              </button>
              <button className="lab-primary-btn" onClick={restart}>
                ↺ {t.retry}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
