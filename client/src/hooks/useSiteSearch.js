import { useEffect, useState } from "react";

// The catalogue loads only when search is opened, and is shared across routes.
let cataloguePromise;
function loadCatalogue() {
  if (!cataloguePromise) {
    cataloguePromise = import("../data/searchIndex").then(module => module.searchDocuments)
      .catch(error => { cataloguePromise = null; throw error; });
  }
  return cataloguePromise;
}

export default function useSiteSearch() {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setStatus("loading");
    loadCatalogue().then(data => {
      if (active) { setDocuments(data); setStatus("ready"); }
    }).catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, [attempt]);
  return { documents, status, retry: () => setAttempt(value => value + 1) };
}
