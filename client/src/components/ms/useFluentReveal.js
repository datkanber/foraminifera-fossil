import { useEffect } from "react";

/**
 * Global mouse coordinate tracker for Microsoft Fluent Reveal highlight effect.
 * Attaches a passive mousemove listener to track pointer coordinates relative to
 * cards and containers with `.ms-fluent-reveal` or `.ms-card`.
 */
export function useFluentReveal() {
  useEffect(() => {
    let frame = null;

    function handleMouseMove(e) {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const targets = document.querySelectorAll(
          ".ms-card, .ms-home-quick-card, .mode-card, .ms-home-banner, .taxon-env-card, .ms-home-metric-card"
        );
        for (let i = 0; i < targets.length; i++) {
          const el = targets[i];
          const rect = el.getBoundingClientRect();
          // Only calculate for elements within reasonable distance of viewport & cursor
          if (
            e.clientX >= rect.left - 120 &&
            e.clientX <= rect.right + 120 &&
            e.clientY >= rect.top - 120 &&
            e.clientY <= rect.bottom + 120
          ) {
            el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          }
        }
      });
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

