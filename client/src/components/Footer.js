import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/components/footer.css";

const columns = [
  {
    heading: { tr: "Keşfedin", en: "Explore" },
    links: [
      { to: "/", tr: "Ana Sayfa", en: "Home" },
      { to: "/haberler", tr: "Haberler ve Etkinlikler", en: "News & Events" },
      { to: "/lab", tr: "3D Laboratuvar", en: "3D Lab" },
      { to: "/arama", tr: "Sitede ara", en: "Search the site" },
    ],
  },
  {
    heading: { tr: "Araçlar", en: "Tools" },
    links: [
      { to: "/tani", tr: "Tanı Yap", en: "Diagnose" },
      { to: "/vlm", tr: "Görsel Yapay Zekâ", en: "Visual AI" },
      { to: "/jeoloji", tr: "Jeoloji ve Ortamlar", en: "Geology & Environments" },
    ],
  },
  {
    heading: { tr: "GeoKnow", en: "GeoKnow" },
    links: [
      { to: "/hakkinda", tr: "Proje Hakkında", en: "About the Project" },
      { to: "/iletisim", tr: "İletişim", en: "Contact" },
      { to: "/haberler#day-1", tr: "STONE Digital Geo Academy", en: "STONE Digital Geo Academy" },
    ],
  },
];

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </svg>
  );
}

function Footer() {
  const { t, lang, toggleLanguage } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <img src={logo} alt="GeoKnow" width="132" height="58" loading="lazy" />
            <p className="site-footer-title">{t("footer.title")}</p>
            <p className="site-footer-meta">{t("footer.lab")} · {t("footer.uni")}</p>
          </div>

          <nav className="site-footer-columns" aria-label={lang === "tr" ? "Alt bilgi bağlantıları" : "Footer links"}>
            {columns.map(column => (
              <div className="site-footer-column" key={column.heading.en}>
                <h2>{column.heading[lang]}</h2>
                <ul>
                  {column.links.map(link => (
                    <li key={link.to}>
                      <Link to={link.to}>{link[lang]}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="site-footer-column">
              <h2>{lang === "tr" ? "Kurum" : "Institution"}</h2>
              <ul>
                <li><span>{t("footer.uni")}</span></li>
                <li><span>{lang === "tr" ? "Jeoloji Mühendisliği Bölümü" : "Department of Geological Engineering"}</span></li>
                <li><a href="mailto:kokur@ogu.edu.tr">kokur@ogu.edu.tr</a></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="site-footer-bottom">
          <button type="button" className="site-footer-lang" onClick={toggleLanguage} aria-label={lang === "tr" ? "Switch to English" : "Türkçeye geç"}>
            <GlobeIcon />
            <span>{lang === "tr" ? "Türkçe (Türkiye)" : "English (United States)"}</span>
          </button>
          <p className="site-footer-disclaimer">{t("warning.disclaimer")}</p>
          <p className="site-footer-copy">© GeoKnow {year} · {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
