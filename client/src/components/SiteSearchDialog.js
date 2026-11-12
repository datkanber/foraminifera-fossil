import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import useSiteSearch from "../hooks/useSiteSearch";
import { searchSite } from "../utils/siteSearch";
import SiteSearchResults, { SearchFilters, searchCopy } from "./SiteSearchResults";
import "../styles/components/site-search.css";

export default function SiteSearchDialog({ onClose }) {
  const { lang } = useLanguage();
  const text = searchCopy[lang];
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const { documents, status, retry } = useSiteSearch();
  const results = useMemo(() => searchSite(documents, query, lang, type), [documents, query, lang, type]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    inputRef.current.focus();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, []);

  function close() { dialogRef.current.close(); }
  function submit(event) {
    event.preventDefault();
    if (!query.trim()) { inputRef.current.focus(); return; }
    const params = new URLSearchParams({ q: query.trim() });
    if (type !== "all") params.set("type", type);
    close();
    navigate(`/arama?${params}`);
  }

  function handleArrows(event) {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    if (event.target !== inputRef.current && !event.target.closest(".site-search-results a")) return;
    const links = [...dialogRef.current.querySelectorAll(".site-search-results a")];
    if (!links.length) return;
    event.preventDefault();
    const position = links.indexOf(document.activeElement);
    const next = position + (event.key === "ArrowDown" ? 1 : -1);
    if (next < 0 || next >= links.length) inputRef.current.focus();
    else links[next].focus();
  }

  return (
    <dialog ref={dialogRef} id="site-search-dialog" className="site-search-dialog" aria-labelledby="site-search-heading" onClose={onClose} onKeyDown={handleArrows} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="site-search-dialog-heading">
        <h2 id="site-search-heading">{text.title}</h2>
        <button type="button" className="site-search-close" onClick={close} aria-label={text.close}>×</button>
      </div>
      <form className="site-search-form" role="search" onSubmit={submit}>
        <label className="site-search-sr-only" htmlFor="site-search-input">{text.placeholder}</label>
        <input id="site-search-input" ref={inputRef} type="search" autoFocus autoComplete="off" maxLength={160} placeholder={text.placeholder} value={query} onChange={event => setQuery(event.target.value)} />
        <button type="submit">{text.search}</button>
      </form>
      <SearchFilters value={type} onChange={setType} text={text} />
      {!query.trim() && (
        <div className="site-search-popular">
          <span>{text.popular}</span>
          {["STONE", "Foraminifera", "Alveolina", "3D Lab"].map(term => <button type="button" key={term} onClick={() => { setQuery(term); inputRef.current.focus(); }}>{term}</button>)}
        </div>
      )}
      <SiteSearchResults results={results} status={status} query={query} lang={lang} retry={retry} onNavigate={close} />
      {results.length > 8 && <button className="site-search-view-all" type="button" onClick={submit}>{text.allResults} ({results.length}) →</button>}
    </dialog>
  );
}
