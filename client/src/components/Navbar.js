import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/images/logo.png";
import SiteSearchDialog from "./SiteSearchDialog";
import "../styles/components/navbar.css";

const navigation = [
  { to: "/", key: "nav.home" },
  { to: "/haberler", key: "nav.news" },
  { to: "/tani", key: "nav.diagnose" },
  { to: "/vlm", key: "nav.vlm" },
  { to: "/jeoloji", key: "nav.geology" },
  { to: "/lab", key: "nav.lab" },
  { to: "/hakkinda", key: "nav.about" },
  { to: "/iletisim", key: "nav.contact" },
];

// Change the ID when publishing a new announcement so it appears again.
const announcement = {
  id: "geoknow:announcement:stone-eskisehir-2026",
  to: "/haberler",
  tr: {
    message: "STONE Eskişehir Digital Geo Academy: taş mirası ve dijital jeoloji buluşmasından notlar.",
    link: "Haberi inceleyin",
  },
  en: {
    message: "Explore highlights from STONE Eskişehir Digital Geo Academy.",
    link: "Read the story",
  },
};

function Icon({ name, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {name === "globe" && <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></>}
      {name === "chevron" && <path d="m7 10 5 5 5-5" />}
      {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
      {name === "menu" && <path d="M4 6h16M4 12h16M4 18h16" />}
      {name === "search" && <><circle cx="10.5" cy="10.5" r="7" /><path d="m16 16 5 5" /></>}
    </svg>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(() => {
    try {
      return sessionStorage.getItem(announcement.id) !== "dismissed";
    } catch {
      return true;
    }
  });
  const headerRef = useRef(null);
  const brandRef = useRef(null);
  const toggleRef = useRef(null);
  const exploreRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const text = announcement[lang];

  function closeMenus() {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    exploreRef.current?.removeAttribute("open");
  }

  function openSearch() {
    setIsMenuOpen(false);
    exploreRef.current?.removeAttribute("open");
    setIsSearchOpen(true);
  }

  function closeSearch() {
    setIsSearchOpen(false);
    searchRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    exploreRef.current?.removeAttribute("open");
  }, [location.pathname, location.hash, location.search]);

  useEffect(() => {
    if (!headerRef.current) return undefined;
    const syncHeight = () => document.documentElement.style.setProperty("--header-height", `${headerRef.current.getBoundingClientRect().height}px`);
    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onPointerDown(event) {
      if (!headerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
        exploreRef.current?.removeAttribute("open");
      }
    }
    function onShortcut(event) {
      if (!event.defaultPrevented && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsMenuOpen(false);
        exploreRef.current?.removeAttribute("open");
        setIsSearchOpen(true);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onShortcut);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onShortcut);
    };
  }, []);

  function handleEscape(event) {
    if (event.key !== "Escape" || isSearchOpen) return;
    if (exploreRef.current?.open) {
      exploreRef.current.removeAttribute("open");
      exploreRef.current.querySelector("summary").focus();
    } else if (isMenuOpen) {
      setIsMenuOpen(false);
      toggleRef.current?.focus();
    }
  }

  function dismissAnnouncement() {
    setIsAnnouncementVisible(false);
    try {
      sessionStorage.setItem(announcement.id, "dismissed");
    } catch {
      // Dismissal still works when browser storage is unavailable.
    }
    brandRef.current?.focus({ preventScroll: true });
  }

  function isActive(to) {
    if (to === "/") return location.pathname === "/";
    if (to === "/haberler" && location.pathname === "/news") return true;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  }

  function navigationLink(item) {
    return (
      <Link key={item.to} to={item.to} className="navbar-link" aria-current={isActive(item.to) ? "page" : undefined} onClick={closeMenus}>
        {t(item.key)}
      </Link>
    );
  }

  return (
    <header className={`navbar${isScrolled ? " is-scrolled" : ""}`} ref={headerRef} onKeyDown={handleEscape}>
      <a className="navbar-skip" href="#main-content">{lang === "tr" ? "Ana içeriğe atla" : "Skip to main content"}</a>
      <div className="navbar-container">
        <button ref={toggleRef} type="button" className="navbar-toggle" onClick={() => setIsMenuOpen(open => !open)} aria-label={lang === "tr" ? (isMenuOpen ? "Menüyü kapat" : "Menüyü aç") : (isMenuOpen ? "Close menu" : "Open menu")} aria-expanded={isMenuOpen} aria-controls="site-navigation">
          <Icon name={isMenuOpen ? "close" : "menu"} />
        </button>

        <Link ref={brandRef} className="navbar-brand" to="/" onClick={closeMenus} aria-label={lang === "tr" ? "GeoKnow ana sayfa" : "GeoKnow home"}>
          <img src={logo} alt="GeoKnow" className="navbar-logo" width="142" height="62" />
        </Link>

        <nav id="site-navigation" className={`navbar-menu${isMenuOpen ? " navbar-menu-open" : ""}`} aria-label={lang === "tr" ? "Ana gezinme" : "Main navigation"}>
          {navigation.map(navigationLink)}
        </nav>

        <div className="navbar-tools">
          <details className="navbar-explore" ref={exploreRef}>
            <summary>{lang === "tr" ? "Tüm GeoKnow" : "All GeoKnow"}<Icon name="chevron" /></summary>
            <nav className="navbar-explore-panel" data-heading={lang === "tr" ? "GeoKnow sayfaları" : "GeoKnow pages"} aria-label={lang === "tr" ? "Tüm GeoKnow sayfaları" : "All GeoKnow pages"}>
              {navigation.map(navigationLink)}
            </nav>
          </details>
          <button ref={searchRef} type="button" className="navbar-search-btn" onClick={openSearch} aria-label={lang === "tr" ? "Sitede ara" : "Search the site"} aria-haspopup="dialog" aria-expanded={isSearchOpen} title={lang === "tr" ? "Sitede ara (Ctrl+K)" : "Search the site (Ctrl+K)"}>
            <span>{lang === "tr" ? "Ara" : "Search"}</span><Icon name="search" />
          </button>
          <button type="button" className="navbar-lang-btn" onClick={toggleLanguage} aria-label={lang === "tr" ? "Switch to English" : "Türkçeye geç"} title={lang === "tr" ? "Switch to English" : "Türkçeye geç"}>
            <Icon name="globe" /><span>{lang === "tr" ? "TR" : "EN"}</span>
          </button>
        </div>
      </div>

      {isAnnouncementVisible && (
        <aside className="navbar-announcement" aria-label={lang === "tr" ? "GeoKnow duyurusu" : "GeoKnow announcement"}>
          <div className="navbar-announcement-content">
            <span>{text.message}</span>
            <Link to={announcement.to} onClick={closeMenus}>{text.link}</Link>
          </div>
          <button type="button" className="navbar-announcement-close" onClick={dismissAnnouncement} aria-label={lang === "tr" ? "Duyuruyu kapat" : "Dismiss announcement"}>
            <Icon name="close" />
          </button>
        </aside>
      )}
      {isSearchOpen && <SiteSearchDialog onClose={closeSearch} />}
    </header>
  );
}
