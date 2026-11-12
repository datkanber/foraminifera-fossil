import { createElement, useEffect, useRef } from "react";

let sharedObserver = null;

function getObserver() {
  if (sharedObserver || typeof IntersectionObserver === "undefined") return sharedObserver;
  sharedObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sharedObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  return sharedObserver;
}

/**
 * Fades and lifts its content into view the first time it scrolls on screen
 * (Fluent "enter" motion). Usage: <Reveal as="section" delay={120}>…</Reveal>
 */
export default function Reveal({ as = "div", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = getObserver();
    if (!observer) {
      node.classList.add("is-visible");
      return undefined;
    }
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return createElement(
    as,
    {
      ref,
      className: `ms-reveal${className ? ` ${className}` : ""}`,
      style: delay ? { ...style, "--reveal-delay": `${delay}ms` } : style,
      ...rest,
    },
    children
  );
}

