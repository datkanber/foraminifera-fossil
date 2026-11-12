// Fold Turkish/Latin accents consistently without changing displayed text.
export function normalizeSearch(value) {
  return String(value || "").normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/ı/g, "i").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchSite(documents, query, lang = "tr", type = "all") {
  const phrase = normalizeSearch(query.slice(0, 160));
  if (!phrase) return [];
  const tokens = [...new Set(phrase.split(/\s+/))];
  return documents.filter(doc => type === "all" || doc.type === type).map(doc => {
    const title = normalizeSearch(`${doc.title.tr} ${doc.title.en}`);
    const body = normalizeSearch(`${doc.description.tr} ${doc.description.en} ${doc.body || ""} ${(doc.keywords || []).join(" ")}`);
    if (!tokens.every(token => `${title} ${body}`.includes(token))) return null;
    let score = normalizeSearch(doc.title[lang]) === phrase ? 100 : 0;
    for (const token of tokens) {
      score += title.split(" ").includes(token) ? 20 : title.includes(token) ? 10 : 1;
    }
    if (title.startsWith(phrase)) score += 30;
    return { ...doc, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.title[lang].localeCompare(b.title[lang], lang));
}
