import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import useSiteSearch from "../hooks/useSiteSearch";
import { searchSite } from "../utils/siteSearch";
import SiteSearchResults, { SearchFilters, searchCopy } from "../components/SiteSearchResults";
import "../styles/components/site-search.css";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = (params.get("q") || "").slice(0, 160);
  const type = ["pages", "news", "taxa"].includes(params.get("type")) ? params.get("type") : "all";
  const [draft, setDraft] = useState(query);
  const [limit, setLimit] = useState(20);
  const { lang } = useLanguage();
  const text = searchCopy[lang];
  const { documents, status, retry } = useSiteSearch();
  const results = useMemo(() => searchSite(documents, query, lang, type), [documents, query, lang, type]);

  useEffect(() => { setDraft(query); setLimit(20); }, [query, type]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${text.title} | GeoKnow`;
    return () => { document.title = previousTitle; };
  }, [text.title]);

  function update(search, filter) {
    const next = new URLSearchParams();
    if (search.trim()) next.set("q", search.trim());
    if (filter !== "all") next.set("type", filter);
    setParams(next);
  }

  return (
    <main className="site-search-page" lang={lang}>
      <h1>{text.title}</h1>
      <form className="site-search-form" role="search" onSubmit={event => { event.preventDefault(); update(draft, type); }}>
        <label className="site-search-sr-only" htmlFor="search-page-input">{text.placeholder}</label>
        <input id="search-page-input" type="search" autoComplete="off" maxLength={160} placeholder={text.placeholder} value={draft} onChange={event => setDraft(event.target.value)} />
        <button type="submit">{text.search}</button>
      </form>
      <SearchFilters value={type} onChange={filter => update(query, filter)} text={text} />
      <SiteSearchResults results={results} status={status} query={query} lang={lang} retry={retry} limit={limit} />
      {results.length > limit && <button className="site-search-view-all" type="button" onClick={() => setLimit(value => value + 20)}>{text.more}</button>}
    </main>
  );
}
