import agglutinated from "../../../api/data/genera_agglutinated.json";
import porcelaneous from "../../../api/data/genera_porcelaneous.json";
import hyaline from "../../../api/data/genera_hyaline.json";
import environments from "../../../api/data/taxon_environment.json";
import { stoneDays, projectParticipants, pressSources } from "./newsContent";

const pair = (tr, en) => ({ tr, en });
const dateLabel = (date, locale) => new Intl.DateTimeFormat(locale, {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${date}T12:00:00Z`));
const pages = [
  ["/", "Ana Sayfa", "Home", "Foraminifera ve jeoloji: araştırma, eğitim ve güncel etkinlikler.", "Foraminifera and geology: research, education and current events.", "fosil fossil foraminifer mikrofosil microfossil"],
  ["/haberler", "Haberler ve Etkinlikler", "News & Events", "STONE Eskişehir Digital Geo Academy buluşması ve fotoğrafları.", "The STONE Eskişehir Digital Geo Academy meeting and photographs.", "Erasmus STONE haber etkinlik news events Eskişehir digital geo academy"],
  ["/tani", "Tanı Destek Sistemi", "Diagnosis Support System", "Karar ağacı veya 21 morfolojik karakterle foraminifer cinslerini karşılaştırın.", "Compare foraminiferal genera using the decision tree or 21 morphological characters.", "tanı tani teşhis identify diagnose karar ağacı puanlama scoring ontoloji ontology kavkı loca duvar aperture chamber wall"],
  ["/vlm", "Görsel Yapay Zekâ", "Visual AI", "İnce kesit görüntülerinden morfolojik gözlem taslağı oluşturun.", "Generate draft morphological observations from thin-section images.", "görsel yapay zeka artificial intelligence Gemini VLM görüntü image ince kesit thin section"],
  ["/jeoloji", "Jeolojik Bağlam", "Geological Context", "Paleosen–Eosen dönemleri ve yerel taksonların derinlik ve habitat kayıtları.", "Paleocene–Eocene stages and local taxon depth and habitat records.", "jeoloji geology Paleosen Paleocene Eosen Eocene Tanesiyen Thanetian İlerdiyen Ilerdian Küiziyen Cuisian depth habitat paleo environment ortam deniz"],
  ["/lab", "3D Laboratuvar", "3D Lab", "Üç boyutlu foraminifer örneklerini sanal laboratuvarda keşfedin.", "Explore three-dimensional foraminiferal specimens in the virtual laboratory.", "3d üç boyutlu sanal laboratuvar virtual lab model museum müze Globigerinoides ruber"],
  ["/hakkinda", "Veriseti ve Proje Hakkında", "About the Dataset & Project", "GeoKnow projesi, foraminifer veri seti ve karar destek yaklaşımı.", "The GeoKnow project, foraminiferal dataset and decision-support approach.", "hakkında about veri seti dataset proje project ontoloji ontology paleontoloji paleontology"],
  ["/iletisim", "İletişim", "Contact", "GeoKnow araştırma grubuyla iletişime geçin.", "Get in touch with the GeoKnow research group.", "iletişim contact email eposta ESOGÜ Osmangazi"],
].map(([href, tr, en, descriptionTr, descriptionEn, keywords]) => ({
  id: `page:${href}`, type: "pages", href, title: pair(tr, en),
  description: pair(descriptionTr, descriptionEn), keywords: [keywords],
}));

const news = stoneDays.map(day => ({
  id: `news:day-${day.day}`, type: "news", href: `/haberler#day-${day.day}`,
  title: pair(`STONE · ${day.title.tr}`, `STONE · ${day.title.en}`),
  description: pair(day.paragraphs.tr[0], day.paragraphs.en[0]),
  body: [...day.paragraphs.tr, ...day.paragraphs.en, day.focus.tr, day.focus.en,
    ...day.schedule.flatMap(item => [item.label.tr, item.label.en, item.lead || ""])].join(" "),
  keywords: ["Erasmus STONE Eskişehir Digital Geo Academy", day.date, dateLabel(day.date, "tr-TR"), dateLabel(day.date, "en-GB")],
}));
news.push({
  id: "news:teams", type: "news", href: "/haberler#project-teams",
  title: pair("STONE proje ekipleri", "STONE project teams"),
  description: pair("Eskişehir buluşmasına katılan Türkiye ve İspanya ekipleri.", "The teams from Türkiye and Spain at the Eskişehir meeting."),
  body: projectParticipants.flatMap(group => [group.institution.tr, group.institution.en, group.detail.tr, group.detail.en,
    ...(Array.isArray(group.names) ? group.names : [...group.names.tr, ...group.names.en])]).join(" "),
  keywords: ["Erasmus STONE ortak partner ESOGÜ"],
}, {
  id: "news:press", type: "news", href: "/haberler#press-coverage",
  title: pair("STONE İspanya basınında", "STONE in the Spanish press"),
  description: pair("Eskişehir buluşması hakkında İspanya basınında yayımlanan haberler.", "Spanish press coverage of the Eskişehir meeting."),
  body: pressSources.map(source => `${source.name} ${source.title}`).join(" "),
  keywords: ["STONE Villamayor Salamanca basın press İspanya Spain"],
});

const moduleNames = {
  AGGLUTINATED: pair("Aglütinat", "Agglutinated"),
  PORCELANEOUS: pair("Porselen", "Porcelaneous"),
  HYALINE: pair("Hyalin", "Hyaline"),
};

// Taxon names and rule text come from the same public masters as the engine.
// Search retrieves records; it never runs or changes diagnostic scoring.
const taxa = new Map();
for (const group of [agglutinated, porcelaneous, hyaline]) {
  for (const genus of group.genera) {
    const module = moduleNames[group.module];
    taxa.set(genus.genus.toLowerCase(), {
      id: `taxon:${genus.genus}`, type: "taxa",
      href: `/jeoloji?taxon=${encodeURIComponent(genus.genus)}#taxon-profile`,
      title: pair(genus.genus, genus.genus),
      description: pair(`${module.tr} modülündeki cins. Taksonomi ve varsa yerel ortam kayıtlarını görüntüleyin.`, `${module.en} genus. View taxonomy and available local environment records.`),
      body: Object.values(genus.rules).flat().map(rule => rule.text).join(" "),
      keywords: ["foraminifer foraminifera fosil fossil cins genus", module.tr, module.en],
    });
  }
}
for (const record of environments) {
  const body = [record.depthTextTr, record.depthTextEn, record.habitatTextTr, record.habitatTextEn].filter(Boolean).join(" ");
  const key = record.scientificName.toLowerCase();
  if (taxa.has(key)) {
    taxa.get(key).body += ` ${body}`;
  } else {
    taxa.set(key, {
      id: `taxon:${record.scientificName}`, type: "taxa",
      href: `/jeoloji?taxon=${encodeURIComponent(record.parentGenus || record.scientificName)}#taxon-profile`,
      title: pair(record.scientificName, record.scientificName),
      description: pair(record.habitatTextTr || record.depthTextTr || "Yerel ortam kaydı.", record.habitatTextEn || record.depthTextEn || "Local environment record."),
      body, keywords: ["foraminifer fosil fossil takson taxon habitat depth ortam", record.parentGenus || ""],
    });
  }
}

export const searchDocuments = [...pages, ...news, ...taxa.values()];
