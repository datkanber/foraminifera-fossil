import { ARRANGEMENT, GLOSSARY, LIFE, REAL_SPECIMENS } from "./specimens";

// ─── QUIZ ───────────────────────────────────────────────────────────────────
// A round is 5 questions about the specimens (built from specimens.js, so new
// exhibits join the quiz on their own) and 3 concept questions from the pool
// below. Every question carries an explanation shown after the answer.

const SPECIMEN_QUESTIONS = 5;
const CONCEPT_QUESTIONS = 3;
export const QUIZ_LENGTH = SPECIMEN_QUESTIONS + CONCEPT_QUESTIONS;

const CONCEPTS = [
  {
    tr: {
      prompt: "Foraminiferler nasıl canlılardır?",
      options: ["Kavkı yapan tek hücreli protistler", "Çok hücreli yumuşakçalar", "Fotosentez yapan deniz yosunları", "Mercan polipleri"],
      explain: "Foraminiferler tek hücreli canlılardır (protist). Hücre, odacıklardan oluşan bir kavkı yapar ve büyüdükçe yeni odacıklar ekler.",
    },
    en: {
      prompt: "What kind of organisms are foraminifera?",
      options: ["Single-celled protists that build a test", "Multicellular molluscs", "Photosynthetic seaweeds", "Coral polyps"],
      explain: "Foraminifera are single-celled organisms (protists). The cell builds a chambered test and adds new chambers as it grows.",
    },
  },
  {
    tr: {
      prompt: "Bir kayaç tabakasında bol miktarda Elphidium buldun. Tabaka büyük olasılıkla nerede çökelmiştir?",
      options: ["Kıyıda, lagünde ya da haliçte", "Derin okyanus tabanında", "Açık okyanusun yüzey sularında", "Bir çöl gölünde"],
      explain: "Elphidium, tuzluluğu değişken, çok sığ kıyı ortamlarının bentik foraminiferidir.",
    },
    en: {
      prompt: "A rock layer is full of Elphidium. Where did the layer most likely form?",
      options: ["On a coast, in a lagoon or an estuary", "On the deep ocean floor", "In the surface water of the open ocean", "In a desert lake"],
      explain: "Elphidium is the benthic foraminifer of very shallow coastal settings with changing salinity.",
    },
  },
  {
    tr: {
      prompt: "Globigerinoides ruber kavkısının kimyası en çok neyi tahmin etmekte kullanılır?",
      options: ["Geçmişteki deniz yüzeyi sıcaklığını", "Kayacın manyetik yönünü", "Deniz tabanının sertliğini", "Volkanik küllerin yaşını"],
      explain: "Kavkının oksijen izotopları ve Mg/Ca oranı, oluştuğu yüzey suyunun sıcaklığını kaydeder.",
    },
    en: {
      prompt: "What is the chemistry of Globigerinoides ruber tests mostly used to estimate?",
      options: ["Past sea-surface temperature", "The magnetic direction of the rock", "The hardness of the sea floor", "The age of volcanic ash"],
      explain: "The oxygen isotopes and Mg/Ca ratio of the test record the temperature of the surface water it grew in.",
    },
  },
  {
    tr: {
      prompt: "Bulimina marginata'nın bol olduğu bir çamur neyi işaret eder?",
      options: ["Organikçe zengin, oksijeni düşük bir dibi", "Dalgaların vurduğu kumlu bir sahili", "Buzla kaplı bir denizi", "Tatlı su gölünü"],
      explain: "B. marginata sedimentin içinde yaşar ve organik maddenin bol, oksijenin az olduğu çamurlara dayanıklıdır.",
    },
    en: {
      prompt: "What does mud rich in Bulimina marginata point to?",
      options: ["An organic-rich, oxygen-poor sea floor", "A wave-washed sandy beach", "An ice-covered sea", "A freshwater lake"],
      explain: "B. marginata lives within the sediment and tolerates mud with plenty of organic matter and little oxygen.",
    },
  },
  {
    tr: {
      prompt: "Cycloclypeus neden yalnızca güneş ışığının ulaştığı derinliklerde yaşar?",
      options: ["Fotosentez yapan ortak yaşarlar (simbiyontlar) barındırdığı için", "Soğuk sudan hoşlanmadığı için", "Kavkısı ışıkta sertleştiği için", "Avcılardan saklanmak için"],
      explain: "Hücresindeki diyatomeler fotosentezle besin üretir; bu yüzden konakçı ışıklı zonda yaşamak zorundadır.",
    },
    en: {
      prompt: "Why does Cycloclypeus live only where sunlight reaches?",
      options: ["It houses photosynthetic partners (symbionts)", "It dislikes cold water", "Its test hardens in light", "To hide from predators"],
      explain: "The diatoms in its cell make food by photosynthesis, so the host must live in the sunlit zone.",
    },
  },
  {
    tr: {
      prompt: "Mısır piramitlerinin yapıldığı kireçtaşında bol bulunan büyük foraminifer hangisidir?",
      options: ["Nummulites", "Globigerinoides", "Elphidium", "Bulimina"],
      explain: "Gize piramitlerinin taşları Eosen yaşlı nümmülitli kireçtaşıdır; Nummulites, Paleosen–Eosen büyük bentiklerinin en ünlüsüdür.",
    },
    en: {
      prompt: "Which large foraminifer fills the limestone the Egyptian pyramids are built of?",
      options: ["Nummulites", "Globigerinoides", "Elphidium", "Bulimina"],
      explain: "The Giza pyramids are built of Eocene nummulitic limestone; Nummulites is the most famous of the Paleocene–Eocene larger benthics.",
    },
  },
  {
    tr: {
      prompt: "İlk planktonik foraminiferler hangi dönemde ortaya çıktı?",
      options: ["Jura", "Kambriyen", "Neojen", "Kuvaterner"],
      explain: "Foraminiferler Kambriyen'den beri var, ama su kolonunda yaşayan planktonik türler Jura döneminde ortaya çıktı.",
    },
    en: {
      prompt: "When did the first planktonic foraminifera appear?",
      options: ["Jurassic", "Cambrian", "Neogene", "Quaternary"],
      explain: "Foraminifera have existed since the Cambrian, but planktonic species living in the water column appeared in the Jurassic.",
    },
  },
  {
    tr: {
      prompt: "Bu laboratuvardaki hangi model gerçek bir örneğin taraması değildir?",
      options: ["Interwoven Microcosmos", "Cycloclypeus carpenteri", "Bulimina marginata", "Trifarina angulosa"],
      explain: "Interwoven Microcosmos, yapay zekâ ile üretilip Blender'da şekillendirilmiş bir sanat eseridir. Diğerleri gerçek örneklerden taranmıştır.",
    },
    en: {
      prompt: "Which model in this lab is not a scan of a real specimen?",
      options: ["Interwoven Microcosmos", "Cycloclypeus carpenteri", "Bulimina marginata", "Trifarina angulosa"],
      explain: "Interwoven Microcosmos is an artwork generated with AI and sculpted in Blender. The others were scanned from real specimens.",
    },
  },
  {
    tr: {
      prompt: "Sedimentten foraminifer ayıklarken örnek genellikle hangi elekten yıkanır?",
      options: ["63 µm", "2 cm", "5 mm", "1 µm"],
      explain: "63 µm elek, kil ve silti yıkayıp atar; foraminifer kavkıları elekte kalır.",
    },
    en: {
      prompt: "Which sieve is sediment usually washed through to pick foraminifera?",
      options: ["63 µm", "2 cm", "5 mm", "1 µm"],
      explain: "A 63 µm sieve washes away clay and silt; the foraminifera tests stay on the sieve.",
    },
  },
  {
    tr: {
      prompt: "Camsı görünen, çok sayıda ince gözenekle delinmiş kalsit kavkı duvarına ne denir?",
      options: ["Hiyalin", "Porselenimsi", "Aglütine", "Silisli"],
      explain: "Hiyalin duvar camsı ve gözeneklidir. Porselenimsi duvar mat ve gözeneksiz, aglütine duvar ise yapıştırılmış tanelerden yapılır.",
    },
    en: {
      prompt: "What is a glassy calcite test wall pierced by many fine pores called?",
      options: ["Hyaline", "Porcelaneous", "Agglutinated", "Siliceous"],
      explain: "A hyaline wall is glassy and perforate. A porcelaneous wall is opaque and imperforate; an agglutinated wall is made of cemented grains.",
    },
  },
  {
    tr: {
      prompt: "µCT taramasını sıradan bir fotoğraftan ayıran nedir?",
      options: ["X-ışınıyla iç yapıyı da 3 boyutta ölçmesi", "Renkleri daha canlı göstermesi", "Yalnızca fosillerde çalışması", "Mikroskop gerektirmemesi"],
      explain: "µCT yüzlerce X-ışını kesitinden 3D model kurar; bu yüzden kavkının içindeki odacıklar da görünür. Laboratuvarda \"Kesit\" moduyla deneyebilirsin.",
    },
    en: {
      prompt: "What sets a µCT scan apart from an ordinary photo?",
      options: ["It measures the internal structure in 3D with X-rays", "It shows brighter colours", "It only works on fossils", "It needs no microscope"],
      explain: "µCT builds a 3D model from hundreds of X-ray slices, so the chambers inside the test show too. Try the \"Section\" mode in the lab.",
    },
  },
];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const pick = (list, n) => shuffle(list).slice(0, n);

const firstSentence = (text) => text.split(/(?<=\.)\s/)[0];

function optionSet(correct, pool) {
  const wrong = pick([...new Set(pool)].filter((o) => o !== correct), 3);
  return shuffle([correct, ...wrong]);
}

// Each builder returns a question in both languages, so switching language
// mid-quiz keeps the same question.
const SPECIMEN_BUILDERS = {
  identify: (s) => {
    const names = REAL_SPECIMENS.map((x) => x.name);
    const options = optionSet(s.name, names);
    return {
      specimenId: s.id,
      options: { tr: options, en: options },
      answer: s.name,
      tr: { prompt: "Döndürüp incele: bu hangi tür?", explain: `${s.name}. ${s.tr.look[0]}` },
      en: { prompt: "Rotate and inspect: which species is this?", explain: `${s.name}. ${s.en.look[0]}` },
    };
  },
  life: (s) => ({
    specimenId: s.id,
    options: { tr: [LIFE.planktonic.tr, LIFE.benthic.tr], en: [LIFE.planktonic.en, LIFE.benthic.en] },
    answer: s.life === "planktonic" ? 0 : 1,
    tr: { prompt: `${s.name} planktonik mi, bentik mi?`, explain: `${GLOSSARY[s.life].tr.join(": ")} ${s.name}: ${s.tr.habitat}.` },
    en: { prompt: `Is ${s.name} planktonic or benthic?`, explain: `${GLOSSARY[s.life].en.join(": ")} ${s.name}: ${s.en.habitat}.` },
  }),
  arrangement: (s) => {
    const keys = optionSet(s.arrangement, Object.keys(ARRANGEMENT));
    return {
      specimenId: s.id,
      options: { tr: keys.map((k) => ARRANGEMENT[k].tr), en: keys.map((k) => ARRANGEMENT[k].en) },
      answer: keys.indexOf(s.arrangement),
      tr: { prompt: `${s.name} kavkısında odacıklar nasıl dizilmiş?`, explain: s.tr.look[0] },
      en: { prompt: `How are the chambers of ${s.name} arranged?`, explain: s.en.look[0] },
    };
  },
  habitat: (s) => {
    const ids = optionSet(s.id, REAL_SPECIMENS.map((x) => x.id)).map((id) => REAL_SPECIMENS.find((x) => x.id === id));
    // Two specimens can share a habitat line; keep options distinct.
    const unique = ids.filter((x, i) => ids.findIndex((y) => y.tr.habitat === x.tr.habitat) === i);
    return {
      specimenId: s.id,
      options: { tr: unique.map((x) => x.tr.habitat), en: unique.map((x) => x.en.habitat) },
      answer: unique.findIndex((x) => x.id === s.id),
      tr: { prompt: `${s.name} en çok nerede yaşar?`, explain: `${s.name}: ${s.tr.habitat}. ${firstSentence(s.tr.why)}` },
      en: { prompt: `Where does ${s.name} mostly live?`, explain: `${s.name}: ${s.en.habitat}. ${firstSentence(s.en.why)}` },
    };
  },
};

// Options are compared by index; `identify` answers by name, so normalise.
function normalise(question) {
  if (typeof question.answer === "number") return question;
  return { ...question, answer: question.options.en.indexOf(question.answer) };
}

export function buildQuizRound() {
  const kinds = Object.keys(SPECIMEN_BUILDERS);
  const specimens = pick(REAL_SPECIMENS, SPECIMEN_QUESTIONS);
  const specimenQuestions = specimens.map((s, i) => {
    // A specimen can opt out of a question kind that would be ambiguous for it.
    // Skipped kinds pass to the next one in turn, keeping the mix even.
    const skip = s.quizSkip || [];
    const kind = kinds.map((_, k) => kinds[(i + k) % kinds.length]).find((k) => !skip.includes(k));
    return normalise(SPECIMEN_BUILDERS[kind](s));
  });

  const conceptQuestions = pick(CONCEPTS, CONCEPT_QUESTIONS).map((c) => {
    const order = shuffle(c.tr.options.map((_, i) => i));
    return {
      specimenId: null,
      options: { tr: order.map((i) => c.tr.options[i]), en: order.map((i) => c.en.options[i]) },
      answer: order.indexOf(0),
      tr: { prompt: c.tr.prompt, explain: c.tr.explain },
      en: { prompt: c.en.prompt, explain: c.en.explain },
    };
  });

  return shuffle([...specimenQuestions, ...conceptQuestions]);
}
