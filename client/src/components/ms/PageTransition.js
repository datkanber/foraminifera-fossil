import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Plays the Fluent page-enter animation whenever the top-level section of the
 * URL changes, and restores the scroll position to the top (unless the URL
 * targets an anchor).
 */
export default function PageTransition({ children }) {
  const { pathname, hash } = useLocation();
  const section = pathname.split("/")[1] || "home";

  useLayoutEffect(() => {
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return (
    <div className="ms-page-transition" key={section}>
      {children}
    </div>
  );
}

export function RouteProgress() {
  return <div className="ms-route-progress" role="progressbar" aria-label="Loading" />;
}
