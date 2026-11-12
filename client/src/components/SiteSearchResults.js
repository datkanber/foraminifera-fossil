import { Link } from "react-router-dom";

export const searchCopy = {
  tr: {
    title: "GeoKnow’da ara", placeholder: "Sayfa, haber veya fosil cinsi arayın", search: "Ara", clear: "Aramayı temizle", close: "Aramayı kapat",
    all: "Tümü", pages: "Sayfalar", news: "Haberler", taxa: "Taksonlar", loading: "Arama hazırlanıyor…", error: "Arama şu anda yüklenemiyor.", retry: "Tekrar dene",
    empty: "Sonuç bulunamadı. Daha kısa veya farklı bir sözcük deneyin.", start: "Sayfalar, haberler ve takson kayıtlarında arama yapın.", popular: "Keşfedin", results: "sonuç", allResults: "Tüm sonuçları göster", more: "Daha fazla göster", back: "Ana sayfa",
  },
  en: {
    title: "Search GeoKnow", placeholder: "Search pages, news or fossil genera", search: "Search", clear: "Clear search", close: "Close search",
    all: "All", pages: "Pages", news: "News", taxa: "Taxa", loading: "Preparing search…", error: "Search could not be loaded.", retry: "Try again",
    empty: "No results found. Try a shorter or different word.", start: "Search pages, news and taxon records.", popular: "Explore", results: "results", allResults: "View all results", more: "Show more", back: "Home",
  },
};

export function SearchFilters({ value, onChange, text }) {
  return (
    <div className="site-search-filters" role="group" aria-label={text.title}>
      {["all", "pages", "news", "taxa"].map(type => (
        <button type="button" key={type} aria-pressed={value === type} onClick={() => onChange(type)}>{text[type]}</button>
      ))}
    </div>
  );
}

export default function SiteSearchResults({ results, status, query, lang, retry, limit = 8, onNavigate }) {
  const text = searchCopy[lang];
  if (status === "loading") return <p className="site-search-status" role="status">{text.loading}</p>;
  if (status === "error") return <p className="site-search-status" role="status">{text.error} <button type="button" onClick={retry}>{text.retry}</button></p>;
  if (!query.trim()) return <p className="site-search-status">{text.start}</p>;
  return (
    <>
      <p className="site-search-status" role="status" aria-live="polite">{results.length ? `${results.length} ${text.results}` : text.empty}</p>
      <ul className="site-search-results">
        {results.slice(0, limit).map(result => (
          <li key={result.id}>
            <Link to={result.href} onClick={onNavigate}>
              <span className="site-search-result-type">{text[result.type]}</span>
              <span className="site-search-result-title">{result.title[lang]}<span aria-hidden="true">↗</span></span>
              <span className="site-search-result-description">{result.description[lang]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
