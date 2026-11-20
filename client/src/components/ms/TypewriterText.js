import { useEffect, useMemo, useState } from "react";

function toGraphemes(str) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(str), (item) => item.segment);
  }
  return Array.from(str);
}

/**
 * Reveals headline text character-by-character on mount (and when text or
 * language changes) while reserving full dimensions upfront to prevent layout
 * shifts. Respects `prefers-reduced-motion: reduce`.
 */
export default function TypewriterText({ text, segments, delayMs = 60 }) {
  const serializedSegments = Array.isArray(segments)
    ? segments
        .filter((seg) => seg && typeof seg.text === "string" && seg.text.length > 0)
        .map((seg) => `${seg.className || ""}\x01${seg.text}`)
        .join("\x02")
    : "";

  const signatureKey = serializedSegments || (typeof text === "string" && text.length > 0 ? `\x01${text}` : "");

  const compiled = useMemo(() => {
    if (!signatureKey) {
      return { segments: [], fullText: "", totalChars: 0 };
    }

    const items = signatureKey.split("\x02").map((entry) => {
      const sep = entry.indexOf("\x01");
      return {
        className: sep >= 0 ? entry.slice(0, sep) : "",
        text: sep >= 0 ? entry.slice(sep + 1) : entry,
      };
    });

    let cursor = 0;
    const built = items.map((seg) => {
      const rawTokens = seg.text.match(/\s+|[^\s-]+-?/g) || [seg.text];
      const tokens = rawTokens.map((tok) => {
        const chars = toGraphemes(tok);
        const start = cursor;
        const end = cursor + chars.length;
        cursor = end;
        return {
          text: tok,
          chars,
          isWhitespace: /^\s+$/.test(tok),
          start,
          end,
        };
      });
      return {
        className: seg.className,
        text: seg.text,
        tokens,
      };
    });

    return {
      segments: built,
      fullText: items.map((seg) => seg.text).join(" "),
      totalChars: cursor,
    };
  }, [signatureKey]);

  const { segments: builtSegments, fullText, totalChars } = compiled;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [typedCount, setTypedCount] = useState(() => (prefersReducedMotion ? totalChars : 0));
  const [caretPhase, setCaretPhase] = useState(() => (prefersReducedMotion ? "hidden" : "typing"));

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || totalChars === 0) {
      setTypedCount(totalChars);
      setCaretPhase("hidden");
      return undefined;
    }

    setTypedCount(0);
    setCaretPhase("typing");

    const stepMs = Math.min(36, Math.max(18, Math.round(920 / totalChars)));
    const startAt = performance.now() + delayMs;
    let rafId = 0;
    let fadeTimer = 0;
    let hideTimer = 0;

    const tick = (now) => {
      const elapsed = Math.max(0, now - startAt);
      const nextCount = Math.min(totalChars, Math.floor(elapsed / stepMs));
      setTypedCount((prev) => (prev === nextCount ? prev : nextCount));

      if (nextCount < totalChars) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setCaretPhase("blinking");
        fadeTimer = window.setTimeout(() => setCaretPhase("fading"), 1050);
        hideTimer = window.setTimeout(() => setCaretPhase("hidden"), 1320);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, [signatureKey, totalChars, delayMs]);

  if (totalChars === 0) return null;

  const isTypingFinished = typedCount >= totalChars;

  if (isTypingFinished && caretPhase === "hidden") {
    return (
      <>
        {builtSegments.map((seg, idx) =>
          seg.className ? (
            <span key={idx} className={seg.className}>
              {seg.text}
            </span>
          ) : (
            <span key={idx}>{seg.text}</span>
          )
        )}
      </>
    );
  }

  let caretSegIdx = -1;
  let caretTokIdx = -1;

  if (caretPhase !== "hidden") {
    outer: for (let s = 0; s < builtSegments.length; s += 1) {
      const toks = builtSegments[s].tokens;
      for (let t = 0; t < toks.length; t += 1) {
        const tok = toks[t];
        if (!tok.isWhitespace && typedCount >= tok.start && typedCount <= tok.end) {
          caretSegIdx = s;
          caretTokIdx = t;
          break outer;
        }
      }
    }
    if (caretSegIdx === -1) {
      outerFallback: for (let s = 0; s < builtSegments.length; s += 1) {
        const toks = builtSegments[s].tokens;
        for (let t = 0; t < toks.length; t += 1) {
          const tok = toks[t];
          if (!tok.isWhitespace && tok.start > typedCount) {
            caretSegIdx = s;
            caretTokIdx = t;
            break outerFallback;
          }
        }
      }
    }
  }

  const caretClass =
    caretPhase === "blinking"
      ? "ms-tw-caret is-blinking"
      : caretPhase === "fading"
        ? "ms-tw-caret is-fading"
        : "ms-tw-caret";

  const caretNode = (
    <span className="ms-tw-caret-host" aria-hidden="true">
      <span className={caretClass} />
    </span>
  );

  return (
    <>
      {!isTypingFinished && <span className="ms-sr-only">{fullText}</span>}
      {builtSegments.map((seg, sIdx) => (
        <span
          key={sIdx}
          className={seg.className || undefined}
          aria-hidden={!isTypingFinished ? "true" : undefined}
        >
          {seg.tokens.map((tok, tIdx) => {
            if (tok.isWhitespace) {
              return tok.text;
            }
            const clamped = Math.max(0, Math.min(tok.chars.length, typedCount - tok.start));
            const typedPart = clamped > 0 ? tok.chars.slice(0, clamped).join("") : "";
            const restPart = clamped < tok.chars.length ? tok.chars.slice(clamped).join("") : "";
            const isCaretHere = caretSegIdx === sIdx && caretTokIdx === tIdx;

            return (
              <span key={tIdx} className="ms-tw-word">
                {typedPart}
                {isCaretHere && caretNode}
                {restPart && <span className="ms-tw-rest">{restPart}</span>}
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}
