import { normalizeSearch, searchSite } from "./siteSearch";

/**
 * Lazy-loaded GeoKnow knowledge engine for the floating site chatbot.
 * Pulls answers directly from the platform's public JSON datasets, page
 * structure, STONE Eskişehir event records, and contact information so
 * nothing is fabricated outside verified site data.
 */

let kbPromise = null;

async function loadKnowledgeBase() {
  if (!kbPromise) {
    kbPromise = Promise.all([
      import("../data/searchIndex"),
      import("../../../api/data/taxon_environment.json"),
      import("../../../api/data/genera_agglutinated.json"),
      import("../../../api/data/genera_porcelaneous.json"),
      import("../../../api/data/genera_hyaline.json"),
      import("../../../api/data/characters.json"),
      import("../data/newsContent"),
    ])
      .then(([searchMod, envMod, aggMod, porcMod, hyalMod, charMod, newsMod]) => {
        const genera = [];
        for (const group of [aggMod.default, porcMod.default, hyalMod.default]) {
          for (const g of group.genera) {
            genera.push({ ...g, module: group.module });
          }
        }
        return {
          searchDocuments: searchMod.searchDocuments || [],
          environments: envMod.default || [],
          genera,
          characters: charMod.default?.characters || [],
          news: newsMod,
        };
      })
      .catch((err) => {
        kbPromise = null;
        throw err;
      });
  }
  return kbPromise;
}

const STAGES = [
  {
    id: "thanetian",
    tr: "Tanesiyen (Geç Paleosen, 59.2 – 56.0 My)",
    en: "Thanetian (Late Paleocene, 59.2 – 56.0 Ma)",
    taxa: ["Karsella hottingeri", "Laffitteina erki", "Pseudolacazina oeztemueri"],
    descTr: "Karmaşık kavkı formlarının ilk radyasyonu ve erken bentik fauna toplulukları.",
    descEn: "Initial radiation of complex test forms and early benthic assemblages.",
  },
  {
    id: "ilerdian",
    tr: "İlerdiyen (Erken Eosen, 56.0 – 52.0 My)",
    en: "Ilerdian (Early Eocene, 56.0 – 52.0 Ma)",
    taxa: ["Alveolina haymanaensis", "Orbitolites", "Discocyclina seunesi"],
    descTr: "Tethys bölgesinde Alveolina, Orbitolites ve Nummulitidae taksonlarının hızlı yayılımı ve sığ karbonat platformları.",
    descEn: "Explosive diversification of Alveolina, Orbitolites, and shallow carbonate platforms in the Tethys realm.",
  },
  {
    id: "cuisian",
    tr: "Küiziyen (Geç Erken Eosen, 52.0 – 47.8 My)",
    en: "Cuisian (Late Early Eocene, 52.0 – 47.8 Ma)",
    taxa: ["Orbitoclypeus haymanaensis", "Ranikothalia polatliensis", "Chapmanina"],
    descTr: "Kavkı morfolojisi ve loca diziliminde ileri uzmanlaşmalar; iç rampadan dış havzaya geçiş zonları.",
    descEn: "Advanced specializations in shell morphology and inner ramp to outer basin transitions.",
  },
];

const LAB_SPECIMENS = [
  { name: "Globigerinoides ruber", lifeTr: "Planktonik (yüzey suyu ~0–50 m)", lifeEn: "Planktonic (surface water ~0–50 m)" },
  { name: "Globigerinella calida", lifeTr: "Planktonik (üst su kolonu ~0–100 m)", lifeEn: "Planktonic (upper water column ~0–100 m)" },
  { name: "Elphidium sp.", lifeTr: "Bentik (kıyı, lagün, haliç ~0–50 m)", lifeEn: "Benthic (coast, lagoon, estuary ~0–50 m)" },
  { name: "Cycloclypeus carpenteri", lifeTr: "Bentik (ışıklı zonun alt kısmı ~50–150 m)", lifeEn: "Benthic (lower sunlit zone ~50–150 m)" },
  { name: "Amphicoryna scalaris", lifeTr: "Bentik (şelf – üst yamaç ~50–500 m)", lifeEn: "Benthic (shelf – upper slope ~50–500 m)" },
  { name: "Trifarina angulosa", lifeTr: "Bentik (dış şelf – üst yamaç ~100–600 m)", lifeEn: "Benthic (outer shelf – upper slope ~100–600 m)" },
  { name: "Bulimina marginata", lifeTr: "Bentik (dış şelf – üst kıta yamacı ~100–1000 m)", lifeEn: "Benthic (outer shelf – upper slope ~100–1000 m)" },
];

const MODULE_LABELS = {
  AGGLUTINATED: { tr: "Aglütinat (Agglutinated)", en: "Agglutinated" },
  PORCELANEOUS: { tr: "Porselen (Porcelaneous)", en: "Porcelaneous" },
  HYALINE: { tr: "Hyalin (Hyaline)", en: "Hyaline" },
};

const STOP_WORDS = new Set([
  "ve", "ile", "bir", "bu", "su", "ne", "nedir", "neler", "nasil", "nasıl", "nerede",
  "kim", "kimdir", "kac", "kaç", "hakkinda", "bilgi", "ver", "goster", "sitede", "site",
  "var", "mi", "mu", "mı", "de", "da", "icin", "gibi", "olarak", "gore", "hangi",
  "what", "where", "who", "how", "when", "which", "about", "the", "is", "are", "for",
  "and", "in", "on", "of", "to", "a", "an", "tell", "me", "show", "geoknow",
]);

function extractTokens(query) {
  return normalizeSearch(query)
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));
}

function hasAny(normQuery, phrases) {
  return phrases.some((p) => normQuery.includes(normalizeSearch(p)));
}

function findMatchingEnvironment(kb, normQuery, tokens) {
  const exact = kb.environments.find((e) => {
    const sci = normalizeSearch(e.scientificName);
    const gen = normalizeSearch(e.parentGenus || "");
    return normQuery.includes(sci) || (gen.length >= 4 && tokens.includes(gen));
  });
  if (exact) return exact;
  return kb.environments.find((e) => {
    const sci = normalizeSearch(e.scientificName);
    return tokens.some((tok) => tok.length >= 4 && sci.includes(tok));
  });
}

function findMatchingGenus(kb, normQuery, tokens) {
  const exact = kb.genera.find((g) => {
    const name = normalizeSearch(g.genus);
    return normQuery.includes(name) || tokens.includes(name);
  });
  if (exact) return exact;
  return kb.genera.find((g) => {
    const name = normalizeSearch(g.genus);
    return tokens.some((tok) => tok.length >= 4 && name.includes(tok));
  });
}

function findMatchingCharacter(kb, normQuery, tokens) {
  if (!tokens.length) return null;
  let best = null;
  let bestScore = 0;
  for (const ch of kb.characters) {
    const idNorm = normalizeSearch(ch.id);
    if (normQuery.includes(idNorm)) return ch;
    const hay = normalizeSearch(`${ch.name_tr} ${ch.name_en} ${ch.note || ""}`);
    let score = 0;
    for (const tok of tokens) {
      if (tok.length >= 3 && hay.includes(tok)) score += 1;
    }
    if (score >= 2 && score > bestScore) {
      bestScore = score;
      best = ch;
    }
  }
  return best;
}

export async function answerQuestion(query, lang = "tr") {
  const raw = String(query || "").trim();
  if (!raw) return null;

  const kb = await loadKnowledgeBase();
  const norm = normalizeSearch(raw);
  const tokens = extractTokens(raw);
  const isTr = lang === "tr";

  // 1. Greetings / Help
  if (
    hasAny(norm, ["merhaba", "selam", "iyi gunler", "iyi aksamlar", "gunaydin", "hello", "hi", "hey", "yardim", "help"]) &&
    tokens.length <= 2
  ) {
    return {
      text: isTr
        ? "Merhaba! Ben GeoKnow asistanıyım. Sitedeki veriler üzerinden foraminifer taksonları, tanı destek kuralları, Paleosen–Eosen katları, Görsel YZ, 3D Laboratuvar, STONE etkinliği ve iletişim bilgileri hakkında yardımcı olabilirim."
        : "Hello! I'm the GeoKnow assistant. Using verified site records, I can help with foraminiferal taxa, diagnosis support rules, Paleocene–Eocene stages, Visual AI, the 3D Lab, STONE event details, and contact information.",
      bullets: isTr
        ? [
            "Takson sorgulama: ör. \"Alveolina nerede yaşar?\" veya \"Karsella hottingeri\"",
            "Yöntem: \"Tanı sistemi nasıl çalışır?\" veya \"Kavkı bileşimi karakterleri\"",
            "Bölümler: \"3D Lab örnekleri\", \"STONE Eskişehir\", \"İletişim\"",
          ]
        : [
            "Taxon lookup: e.g. \"Where does Alveolina live?\" or \"Karsella hottingeri\"",
            "Methods: \"How does diagnosis work?\" or \"Test composition characters\"",
            "Sections: \"3D Lab specimens\", \"STONE Eskişehir\", \"Contact details\"",
          ],
      links: [
        { to: "/tani", label: isTr ? "Tanı Destek Sistemi" : "Diagnosis Support" },
        { to: "/jeoloji", label: isTr ? "Jeolojik Bağlam" : "Geological Context" },
      ],
    };
  }

  // 2. Contact & Institution
  if (hasAny(norm, ["iletisim", "eposta", "e posta", "mail", "telefon", "adres", "neredesiniz", "kampus", "meselik", "contact", "email", "phone", "address", "reach"])) {
    return {
      text: isTr
        ? "GeoKnow araştırma grubuna Eskişehir Osmangazi Üniversitesi (ESOGÜ) Jeoloji Mühendisliği Bölümü üzerinden ulaşabilirsiniz:"
        : "You can reach the GeoKnow research group at Eskişehir Osmangazi University (ESOGÜ), Department of Geological Engineering:",
      bullets: isTr
        ? [
            "E-posta: kokur@ogu.edu.tr · kubrayayan6@gmail.com",
            "Telefon: +90 0222 239 3750 (Dahili: 3405)",
            "Adres: ESOGÜ Mühendislik Mimarlık Fakültesi, Jeoloji Mühendisliği Bölümü, M2 Blok No: 206, Meşelik Kampüsü, Eskişehir",
          ]
        : [
            "Email: kokur@ogu.edu.tr · kubrayayan6@gmail.com",
            "Phone: +90 0222 239 3750 (Ext: 3405)",
            "Address: ESOGÜ Faculty of Engineering and Architecture, Dept. of Geological Engineering, Block M2 No: 206, Meşelik Campus, Eskişehir, Türkiye",
          ],
      links: [
        { to: "/iletisim", label: isTr ? "İletişim Sayfası" : "Contact Page" },
        { to: "/hakkinda", label: isTr ? "Proje Hakkında" : "About the Project" },
      ],
    };
  }

  // 3. Specific Taxon / Genus Lookup (Environment + Morphology Rules + Stage)
  const envMatch = findMatchingEnvironment(kb, norm, tokens);
  const genusMatch = findMatchingGenus(kb, norm, tokens);
  if (envMatch || genusMatch) {
    const title = envMatch ? envMatch.scientificName : genusMatch.genus;
    const genusName = envMatch?.parentGenus || genusMatch?.genus || title;
    const stage = STAGES.find((s) =>
      s.taxa.some((t) => normalizeSearch(t).includes(normalizeSearch(genusName)))
    );
    const mod = genusMatch ? MODULE_LABELS[genusMatch.module]?.[lang] : null;
    const bullets = [];

    if (mod) {
      bullets.push(isTr ? `Duvar modülü: ${mod}` : `Wall module: ${mod}`);
    }
    if (stage) {
      bullets.push(isTr ? `Kronostratigrafik kat: ${stage.tr}` : `Chronostratigraphic stage: ${stage.en}`);
    }
    if (envMatch) {
      const depth = isTr ? envMatch.depthTextTr : envMatch.depthTextEn || envMatch.depthTextTr;
      const hab = isTr ? envMatch.habitatTextTr : envMatch.habitatTextEn || envMatch.habitatTextTr;
      const src = isTr ? envMatch.sourceLabel : envMatch.sourceLabelEn || envMatch.sourceLabel;
      if (depth) bullets.push(isTr ? `Paleo-derinlik: ${depth}` : `Paleo-depth: ${depth}`);
      if (hab) bullets.push(isTr ? `Yaşadığı ortam: ${hab}` : `Habitat: ${hab}`);
      if (src) bullets.push(isTr ? `Kaynak: ${src}` : `Source: ${src}`);
    }
    if (genusMatch?.rules) {
      const ruleEntries = Object.entries(genusMatch.rules).slice(0, 3);
      for (const [chrId, rules] of ruleEntries) {
        if (rules[0]?.text) {
          bullets.push(`${chrId}: ${rules[0].text}`);
        }
      }
    }

    return {
      text: isTr
        ? `${title} için sitedeki veritabanında kayıtlı bilgiler:`
        : `Verified platform records found for ${title}:`,
      bullets,
      links: [
        { to: `/jeoloji?taxon=${encodeURIComponent(genusName)}#taxon-profile`, label: isTr ? `${genusName} Ortam & WoRMS Profili` : `${genusName} Environment & WoRMS Profile` },
        { to: "/tani", label: isTr ? "Tanı Aracında İncele" : "Open Diagnosis Tool" },
      ],
    };
  }

  // 4. Morphological Character Match (CHR_01..CHR_21)
  const charMatch = findMatchingCharacter(kb, norm, tokens);
  if (charMatch) {
    const title = isTr ? charMatch.name_tr : charMatch.name_en;
    const vals = (charMatch.values || []).slice(0, 6).map((v) =>
      isTr ? charMatch.value_labels_tr?.[v] || v : charMatch.value_labels_en?.[v] || v
    );
    return {
      text: isTr
        ? `${charMatch.id} — "${title}" karakteri (${charMatch.group || "TANIM"}):`
        : `${charMatch.id} — "${title}" character (${charMatch.group || "DIAGNOSIS"}):`,
      bullets: [
        ...(charMatch.note ? [charMatch.note] : []),
        ...(vals.length ? [isTr ? `Durumlar / Değerler: ${vals.join(", ")}` : `Values: ${vals.join(", ")}`] : []),
      ],
      links: [{ to: "/tani", label: isTr ? "Tanı Sistemini Başlat" : "Start Diagnosis" }],
    };
  }

  // 5. 3D Lab
  if (hasAny(norm, ["3d", "lab", "laboratuvar", "muze", "oyun", "tur", "quiz", "scan", "tarama", "virtual", "museum", "specimen"])) {
    return {
      text: isTr
        ? "3D Sanal Foraminifer Laboratuvarı; WebGL ve Three.js ile hazırlanmış 7 gerçek µCT foraminifer taraması, 1 bilimsel sanat eseri, 5 duvar panosu, mikroskop inceleme modu, saha not defteri ve etkileşimli sınav içerir."
        : "The 3D Virtual Foraminifera Laboratory features 7 real µCT scans, 1 artwork, 5 wall information boards, a microscope inspection mode, field notebook, and an interactive quiz built with WebGL & Three.js.",
      bullets: LAB_SPECIMENS.map((s) => `${s.name} — ${isTr ? s.lifeTr : s.lifeEn}`),
      links: [{ to: "/lab", label: isTr ? "3D Laboratuvara Git" : "Enter 3D Lab" }],
    };
  }

  // 6. Visual AI / VLM
  if (hasAny(norm, ["gorsel yz", "yapay zeka", "vlm", "ince kesit", "foto", "goruntu", "visual ai", "thin section", "artificial intelligence", "image", "gemini"])) {
    return {
      text: isTr
        ? "Görsel YZ (/vlm) modülü, mikroskop ince kesit fotoğraflarından loca dizilimi, kavkı formu ve duvar yapısı gibi morfolojik karakterleri çıkarır. API kotası yönetimi nedeniyle şu anda sınırlı ve talep üzerine erişim kapsamındadır."
        : "The Visual AI (/vlm) module extracts draft morphological observations from thin-section micrographs. To protect API quotas, open public access is currently paused and available on request.",
      bullets: isTr
        ? [
            "Akademik araştırma veya demo erişimi talep etmek için İletişim (/iletisim) sayfasından ekibimize yazabilirsiniz.",
            "API gerektirmeyen Tanı Yap (/tani) ve 3D Lab (/lab) araçlarını sınırsız şekilde hemen kullanabilirsiniz.",
          ]
        : [
            "Contact our team via the Contact page (/iletisim) to request demo or research access.",
            "Rule-based Diagnosis (/tani) and the 3D Lab (/lab) remain fully open without any usage limit.",
          ],
      links: [
        { to: "/iletisim", label: isTr ? "Erişim İçin İletişim" : "Contact for Access" },
        { to: "/vlm", label: isTr ? "Görsel YZ Sayfası" : "Visual AI Page" },
        { to: "/tani", label: isTr ? "Kural Tabanlı Tanı" : "Rule-Based Diagnosis" },
      ],
    };
  }

  // 7. Rule-based Diagnosis (/tani)
  if (hasAny(norm, ["tani", "teshis", "karar agaci", "sihirbaz", "puanlama", "modul", "duvar yapisi", "diagnose", "diagnosis", "wizard", "scoring", "ontology", "agglutinated", "porcelaneous", "hyaline", "aglutinat", "porselen", "hyalin"])) {
    return {
      text: isTr
        ? "GeoKnow Tanı Destek Sistemi (/tani) iki çalışma modu ve 3 ana duvar modülüyle Paleosen–Eosen bentik foraminifer cinslerini şeffaf kurallarla daraltır:"
        : "The GeoKnow Diagnosis Support System (/tani) narrows Paleocene–Eocene larger benthic foraminiferal genera through two modes and three wall-structure modules:",
      bullets: isTr
        ? [
            "Modlar: Adım Adım Karar Ağacı (Sihirbaz) ve 21 Morfolojik Karakterli Puanlama Modeli.",
            "Modüller: Aglütinat (Agglutinated), Porselen (Porcelaneous) ve Hyalin (Hyaline).",
            "Gözlem durumları: Var (PRESENT), Yok (ABSENT), Gözlenemiyor (NOT_OBSERVABLE — cinsi elemez), Emin değilim (UNCERTAIN).",
          ]
        : [
            "Modes: Step-by-Step Decision Tree (Wizard) and 21-Character Morphological Scoring.",
            "Modules: Agglutinated, Porcelaneous, and Hyaline wall structures.",
            "States: PRESENT, ABSENT, NOT_OBSERVABLE (never wrongly eliminates), and UNCERTAIN.",
          ],
      links: [
        { to: "/tani", label: isTr ? "Tanı Aracını Başlat" : "Launch Diagnosis Tool" },
        { to: "/hakkinda", label: isTr ? "Metodolojiyi Oku" : "Read Methodology" },
      ],
    };
  }

  // 8. Geology & Stratigraphic Stages
  if (hasAny(norm, ["jeoloji", "stratigrafi", "kronostratigrafi", "paleosen", "eosen", "tanesiyen", "ilerdiyen", "kuiziyen", "derinlik", "ortam", "habitat", "tethys", "geology", "stratigraphy", "thanetian", "ilerdian", "cuisian", "paleocene", "eocene", "depth"])) {
    return {
      text: isTr
        ? "Jeolojik Bağlam (/jeoloji) sayfası, Tethys biyoprovensindeki 3 kritik Paleosen–Eosen katını ve veri setindeki 18+ takson derinlik/ortam kaydını sunar:"
        : "Geological Context (/jeoloji) covers three key Tethyan Paleocene–Eocene stages and 18+ taxon depth and paleo-habitat records:",
      bullets: STAGES.map((s) => `${isTr ? s.tr : s.en} — ${isTr ? s.descTr : s.descEn}`),
      links: [{ to: "/jeoloji", label: isTr ? "Jeolojik Bağlama Git" : "Open Geological Context" }],
    };
  }

  // 9. News & STONE Eskişehir Event
  if (hasAny(norm, ["haber", "etkinlik", "stone", "erasmus", "eskisehir", "villamayor", "andezit", "karabacak", "yayan", "ekip", "ispanya", "basin", "news", "event", "academy", "press"])) {
    return {
      text: isTr
        ? "STONE Eskişehir Digital Geo Academy, 22–24 Ekim 2026 tarihlerinde ESOGÜ Jeoloji Mühendisliği Bölümü ev sahipliğinde Erasmus+ KA210-SCH (KA210-SCH-CEAB2BDA) kapsamında düzenlendi."
        : "STONE Eskişehir Digital Geo Academy took place on 22–24 October 2026 at ESOGÜ Dept. of Geological Engineering under Erasmus+ KA210-SCH (KA210-SCH-CEAB2BDA).",
      bullets: isTr
        ? [
            "Türkiye ve İspanya'dan 4 kurum, 14 katılımcı bir araya geldi.",
            "Villamayor kumtaşı, Ankara andeziti, laboratuvar çalışmaları ve Yazılıkaya / Frig Vadisi saha gözlemleri yürütüldü.",
            "ESOGÜ katkıları Prof. Dr. Volkan Karabacak ve GeoKnow Direktörü Dr. Öğr. Üyesi Kübra Yayan tarafından koordine edildi.",
          ]
        : [
            "Brought together 14 participants across four partner institutions from Türkiye and Spain.",
            "Featured Villamayor sandstone, Ankara andesite, tectonics lab work, and Yazılıkaya field observations.",
            "Coordinated with Prof. Dr. Volkan Karabacak and GeoKnow Director Asst. Prof. Dr. Kübra Yayan at ESOGÜ.",
          ],
      links: [{ to: "/haberler", label: isTr ? "Haber & Etkinlik Raporu" : "Read News & Event Report" }],
    };
  }

  // 10. About / Platform Summary
  if (hasAny(norm, ["hakkinda", "platform", "proje", "pilot", "veriseti", "veri seti", "kac tur", "kac takson", "about", "dataset", "project", "purpose", "team"])) {
    return {
      text: isTr
        ? "GeoKnow, Eskişehir Osmangazi Üniversitesi bünyesinde geliştirilen; Paleosen–Eosen büyük bentik foraminiferleri için şeffaf karar destek ve dijital jeoloji platformudur."
        : "GeoKnow is a digital geology and transparent decision-support platform developed at ESOGÜ for Paleocene–Eocene larger benthic foraminifera.",
      bullets: isTr
        ? [
            "7 pilot takson, 30+ tanı kuralı ve 21 morfolojik karakter matrisi",
            "3 duvar modülü (Aglütinat, Porselen, Hyalin) + WoRMS / Neo4j ortam profilleri",
            "Kural tabanlı teşhis, Görsel YZ ince kesit desteği ve 3D Sanal Laboratuvar bir arada",
          ]
        : [
            "7 pilot taxa, 30+ diagnostic rules, and a 21-character morphological matrix",
            "Three wall modules (Agglutinated, Porcelaneous, Hyaline) + WoRMS / Neo4j profiles",
            "Combines rule-based diagnosis, Visual AI thin-section drafting, and a 3D Virtual Lab",
          ],
      links: [
        { to: "/hakkinda", label: isTr ? "Proje Hakkında" : "About GeoKnow" },
        { to: "/tani", label: isTr ? "Tanı Aracı" : "Diagnosis Tool" },
      ],
    };
  }

  // 11. Full-Text Fallback across searchDocuments
  const hits = searchSite(kb.searchDocuments, raw, lang, "all").slice(0, 3);
  if (hits.length > 0) {
    return {
      text: isTr
        ? `"${raw}" aramanızla ilgili sitede şu kayıtları buldum:`
        : `Here is what I found on the site matching "${raw}":`,
      bullets: hits.map((h) => `${h.title[lang]} — ${h.description[lang]}`),
      links: hits.map((h) => ({ to: h.href, label: h.title[lang] })).slice(0, 3),
    };
  }

  // 12. Graceful Out-of-Scope / Suggestion Fallback
  return {
    text: isTr
      ? `"${raw}" için sitedeki kayıtlarda doğrudan bir eşleşme bulamadım. İsterseniz platform içi aramaya bakabilir veya aşağıdaki konulardan birini sorabilirsiniz.`
      : `I couldn't find an exact match for "${raw}" in GeoKnow's records. You can open site search or ask about one of these topics:`,
    bullets: isTr
      ? [
          "Cins ve türler (örn. Alveolina, Karsella, Laffitteina, Nummulites)",
          "Tanı Destek Sistemi, 21 karakter, Görsel YZ ve 3D Lab",
          "Jeolojik katlar (Tanesiyen, İlerdiyen, Küiziyen), STONE etkinliği ve iletişim",
        ]
      : [
          "Genera & taxa (e.g. Alveolina, Karsella, Laffitteina, Nummulites)",
          "Diagnosis Support, 21 characters, Visual AI, and 3D Lab",
          "Geological stages (Thanetian, Ilerdian, Cuisian), STONE meeting, and contact info",
        ],
    links: [{ to: `/arama?q=${encodeURIComponent(raw)}`, label: isTr ? "Sitede Ara" : "Open Site Search" }],
  };
}
