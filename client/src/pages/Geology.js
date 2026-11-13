import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TaxonProfileCard from "../components/TaxonProfileCard";
import { useLanguage } from "../contexts/LanguageContext";
import PageHero from "../components/ms/PageHero";
import Reveal from "../components/ms/Reveal";
import heroImg from "../assets/photos/day-2/20261023_145821-1920.jpg";
import "../styles/pages/geology.css";

const API = process.env.REACT_APP_API_URL + "/api/taxa";

// Client-side English translation fallback (used when API doesn't return *En fields)
const EN_TRANSLATIONS = {
  "Karsella hottingeri":           { depth: "Shallow marine environment", habitat: "Warm and shallow coastal waters", source: "Project dataset – Excel Sheet 10, literature review" },
  "Pseudolacazina oeztemueri":     { depth: "Very shallow to shallow marine water environment", habitat: "Lived on the seabed together with red and green algae.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Alveolina haymanaensis":        { depth: "Shallow-very shallow marine zone, inner ramp", habitat: "Warm and sunny coastal ecosystems, living attached to the bottom in the shallow parts of the oceans.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Ranikothalia polatliensis":     { depth: "Very shallow environment extremely close to the shoreline, representing the transition from land to sea", habitat: "Very shallow and warm ocean coasts just in front of deltas where rivers flow into the sea.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Laffitteina erki":              { depth: "Shallow marine water environment", habitat: "Warm, clear, and calm ocean waters where sunlight easily reaches the seabed, along with algae and other shallow water organisms.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Discocyclina seunesi":          { depth: "Very shallow marine water environment", habitat: "Warm ocean coastal ecosystems on the seabed, together with other very shallow water organisms.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Orbitoclypeus haymanaensis":    { depth: "Shallow sea", habitat: "Detrital and carbonate marine coastal environment located under massive limestone rocks formed by advancing sea water.", source: "Project dataset – Excel Sheet 10, literature review" },
  "Orbitolites":                   { depth: "Very shallow to shallow sea", habitat: "Restricted shelf with normal salinity, inner ramp and shallow marine carbonate platform deposits.", source: "Project environment data table" },
  "Opertorbitolites":              { depth: "Very shallow to shallow sea", habitat: "Transitional sandy limestone and shallow marine coastal environment where detrital material from land and carbonates precipitate together.", source: "Project environment data table" },
  "Bolkarina":                     { depth: "Very shallow to shallow sea", habitat: "Restricted shelf behind the coast and around reefs, back-reef, and calm algal limestone environments.", source: "Project environment data table" },
  "Chapmanina":                    { depth: "Very shallow to shallow sea", habitat: "Inner ramp, shallow marine limestone, and clayey or sandy limestone deposits associated with back-reef or fore-reef.", source: "Project environment data table" },
  "Elphidium":                     { depth: "Very shallow sea", habitat: "Shoreline, lagoons, estuaries, tidal zones, and continental shelf. Tolerant to variable salinity and slightly brackish water conditions.", source: "Project environment data table" },
  "Bolivinella":                   { depth: "Shallow sea", habitat: "Sheltered bays near the coast, back-reef, lagoons, and sediments on the shallow shelf bottom; generally warm and temperate shallow marine environments.", source: "Project environment data table" },
  "Polymorphina":                  { depth: "Shallow to medium depth shelf waters", habitat: "Free benthic life on muddy and sandy bottoms in marine shelf and coastal transition environments with normal salinity.", source: "Project environment data table" },
  "Glandulina":                    { depth: "From middle shelf to bathyal zone; approximately from 50 meters to 500-1000 meters", habitat: "Outer continental shelf, open shelf, and upper continental slope seabed environments.", source: "Project environment data table" },
  "Bulimina":                      { depth: "From middle shelf to bathyal zone; typically from 100-200 meters to 1000-2000+ meters", habitat: "Open marine outer shelf and continental slope deposits; infaunal life tolerant to organic-rich, low-oxygen muddy bottoms.", source: "Project environment data table" },
  "Nodosaria":                     { depth: "Generally from 50-100 meters to bathyal zone depths, 200-1000+ meters", habitat: "Middle-outer continental shelf, continental slope, and open basin; free benthic or infaunal life in fine-grained sediments with normal marine salinity.", source: "Project environment data table" },
  "Frondicularia":                 { depth: "Mostly 50-200 meters; in some species up to the upper bathyal zone, 200-400 meters", habitat: "Clayey limestone, shale, and marl deposits in middle and outer neritic shelf and basin transition areas.", source: "Project environment data table" },
};

const STAGES = [
  {
    id: "thanetian",
    step: "01",
    epoch: { tr: "Geç Paleosen", en: "Late Paleocene" },
    name: { tr: "Tanesiyen (Thanetian)", en: "Thanetian" },
    age: "59.2 – 56.0 My",
    duration: "3.2 Ma",
    facies: {
      tr: "İlk büyük bentik radyasyon · Sığ karbonat platformu",
      en: "Initial larger benthic radiation · Shallow carbonate platform",
    },
    desc: {
      tr: "Karmaşık kabuk formlarının ilk radyasyonu ve spesifik bentik fauna toplulukları ile karakterizedir. Karsella ve Laffitteina gibi erken formlar bu dönemde öne çıkar.",
      en: "Characterized by the initial radiation of complex shell forms and specific benthic faunal assemblages, featuring early taxa such as Karsella and Laffitteina.",
    },
    taxa: ["Karsella hottingeri", "Laffitteina erki", "Pseudolacazina oeztemueri"],
  },
  {
    id: "ilerdian",
    step: "02",
    epoch: { tr: "Erken Eosen", en: "Early Eocene" },
    name: { tr: "İlerdiyen (Ilerdian)", en: "Ilerdian" },
    age: "56.0 – 52.0 My",
    duration: "4.0 Ma",
    facies: {
      tr: "Hızlı takson çeşitlenmesi · İç rampa ve resif kuşağı",
      en: "Rapid taxonomic diversification · Inner ramp & reef belt",
    },
    desc: {
      tr: "Tethys bölgesinde kritik bir Erken Eosen katı. Alveolina, Orbitolites ve Nummulitidae taksonlarının hızlı yayılımına ve sığ karbonat platformlarına tanık olmuştur.",
      en: "A critical Early Eocene stage in the Tethys realm, witnessing explosive diversification of taxa such as Alveolina and shallow carbonate platform communities.",
    },
    taxa: ["Alveolina haymanaensis", "Orbitolites", "Discocyclina seunesi"],
  },
  {
    id: "cuisian",
    step: "03",
    epoch: { tr: "Geç Erken Eosen", en: "Late Early Eocene" },
    name: { tr: "Küiziyen (Cuisian)", en: "Cuisian" },
    age: "52.0 – 47.8 My",
    duration: "4.2 Ma",
    facies: {
      tr: "İleri kavkı uzmanlaşması · Kıyıdan açık havzaya geçiş",
      en: "Advanced test specialization · Shoreline to outer basin gradient",
    },
    desc: {
      tr: "Kavkı morfolojisi, loca dizilimi ve ekolojik adaptasyonlarda ileri uzmanlaşmaların görüldüğü; iç rampadan dış havzaya geçiş zonlarını temsil eden kat.",
      en: "Stage characterized by advanced specializations in shell morphology, chamber arrangement, and adaptations from inner ramp to outer basin transition zones.",
    },
    taxa: ["Orbitoclypeus haymanaensis", "Ranikothalia polatliensis", "Chapmanina"],
  },
];

const STAGE_TAXA_INFO = {
  "Karsella hottingeri": {
    stageId: "thanetian",
    genus: "Karsella",
    rank: "SPECIES",
    depth: { tr: "Sığ denizel ortam", en: "Shallow marine environment" },
    habitat: {
      tr: "Sıcak ve sığ kıyı suları",
      en: "Warm and shallow coastal waters",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  "Laffitteina erki": {
    stageId: "thanetian",
    genus: "Laffitteina",
    rank: "SPECIES",
    depth: { tr: "Sığ su denizel ortamı", en: "Shallow marine water environment" },
    habitat: {
      tr: "Algler ve diğer sığ su canlılarıyla birlikte, güneş ışığının deniz tabanına rahatça ulaştığı sıcak, berrak ve sakin okyanus suları.",
      en: "Warm, clear, and calm ocean waters where sunlight easily reaches the seabed, along with algae and other shallow water organisms.",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  "Pseudolacazina oeztemueri": {
    stageId: "thanetian",
    genus: "Pseudolacazina",
    rank: "SPECIES",
    depth: {
      tr: "Çok sığ ile sığ su denizel ortamı",
      en: "Very shallow to shallow marine water environment",
    },
    habitat: {
      tr: "Kırmızı ve yeşil alglerle birlikte deniz tabanında yaşamıştır.",
      en: "Lived on the seabed together with red and green algae.",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  "Alveolina haymanaensis": {
    stageId: "ilerdian",
    genus: "Alveolina",
    rank: "SPECIES",
    depth: {
      tr: "Sığ–çok sığ denizel bölge, iç rampa",
      en: "Shallow-very shallow marine zone, inner ramp",
    },
    habitat: {
      tr: "Okyanusların sığ kesimlerinde tabana tutunarak yaşayan, sıcak ve güneşli sahil ekosistemleri.",
      en: "Warm and sunny coastal ecosystems, living attached to the bottom in the shallow parts of the oceans.",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  Orbitolites: {
    stageId: "ilerdian",
    genus: "Orbitolites",
    rank: "GENUS",
    depth: { tr: "Çok sığ ile sığ deniz", en: "Very shallow to shallow sea" },
    habitat: {
      tr: "Normal tuzluluğa sahip kısıtlı şelf, iç rampa ve sığ denizel karbonat platformu çökelleri.",
      en: "Restricted shelf with normal salinity, inner ramp and shallow marine carbonate platform deposits.",
    },
    source: {
      tr: "Proje ortam veri tablosu",
      en: "Project environment data table",
    },
  },
  "Discocyclina seunesi": {
    stageId: "ilerdian",
    genus: "Discocyclina",
    rank: "SPECIES",
    depth: { tr: "Çok sığ su denizel ortamı", en: "Very shallow marine water environment" },
    habitat: {
      tr: "Deniz tabanında, diğer çok sığ su canlılarıyla birlikte sıcak okyanus kıyı ekosistemleri.",
      en: "Warm ocean coastal ecosystems on the seabed, together with other very shallow water organisms.",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  "Orbitoclypeus haymanaensis": {
    stageId: "cuisian",
    genus: "Orbitoclypeus",
    rank: "SPECIES",
    depth: { tr: "Sığ deniz", en: "Shallow sea" },
    habitat: {
      tr: "İlerleyen deniz suyunun oluşturduğu masif kireçtaşı kayalıklarının altında yer alan kırıntılı ve karbonatlı denizel kıyı ortamı.",
      en: "Detrital and carbonate marine coastal environment located under massive limestone rocks formed by advancing sea water.",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  "Ranikothalia polatliensis": {
    stageId: "cuisian",
    genus: "Ranikothalia",
    rank: "SPECIES",
    depth: {
      tr: "Karadan denize geçişi temsil eden, kıyı çizgisine son derece yakın çok sığ ortam",
      en: "Very shallow environment extremely close to the shoreline, representing the transition from land to sea",
    },
    habitat: {
      tr: "Akarsuların denize döküldüğü deltaların hemen önündeki çok sığ ve sıcak okyanus kıyıları.",
      en: "Very shallow and warm ocean coasts just in front of deltas where rivers flow into the sea.",
    },
    source: {
      tr: "Proje veri seti – Excel Sayfa 10, literatür derlemesi",
      en: "Project dataset – Excel Sheet 10, literature review",
    },
  },
  Chapmanina: {
    stageId: "cuisian",
    genus: "Chapmanina",
    rank: "GENUS",
    depth: { tr: "Çok sığ ile sığ deniz", en: "Very shallow to shallow sea" },
    habitat: {
      tr: "İç rampa, resif gerisi veya önüyle bağlantılı sığ denizel kireçtaşı ve killi ya da kumlu kireçtaşı çökelleri.",
      en: "Inner ramp, shallow marine limestone, and clayey or sandy limestone deposits associated with back-reef or fore-reef.",
    },
    source: {
      tr: "Proje ortam veri tablosu",
      en: "Project environment data table",
    },
  },
};

const DEPTH_ZONES = [
  { id: "all", label: { tr: "Tüm Zonlar", en: "All Zones" }, range: { tr: "0 – 1000+ m", en: "0 – 1000+ m" } },
  { id: "shore", label: { tr: "Kıyı & Çok Sığ", en: "Shore & Very Shallow" }, range: "0 – 20 m" },
  { id: "shelf", label: { tr: "Sığ – Orta Şelf", en: "Shallow – Mid Shelf" }, range: "20 – 150 m" },
  { id: "bathyal", label: { tr: "Dış Şelf & Batıyal", en: "Outer Shelf & Bathyal" }, range: "150 – 1000+ m" },
];

function matchDepthZone(profile, zoneId) {
  if (!zoneId || zoneId === "all") return true;
  const text = `${profile.depthTextTr || ""} ${profile.depthTextEn || ""} ${profile.habitatTextTr || ""}`.toLowerCase();
  if (zoneId === "bathyal") return /bat[iı]yal|bathyal|dış.*şelf|outer.*shelf|yamaç|slope|500|1000|2000/.test(text);
  if (zoneId === "shore") return /çok sığ|very shallow|kıyı|shoreline|lagün|lagoon|delta|iç rampa|inner ramp/.test(text);
  if (zoneId === "shelf") return /sığ deniz|shallow sea|shallow marine|orta şelf|middle shelf|resif|reef|şelf/.test(text) && !/bat[iı]yal|bathyal/.test(text);
  return true;
}

function Geology() {
  const { lang } = useLanguage();
  const [params, setSearchParams] = useSearchParams();
  const selectedTaxon = (params.get("taxon") || "").trim().slice(0, 100);
  const matchedInitialStage = STAGE_TAXA_INFO[selectedTaxon]?.stageId;

  const [activeStageId, setActiveStageId] = useState(matchedInitialStage || "ilerdian");
  const [activeChipTaxon, setActiveChipTaxon] = useState(() => {
    if (selectedTaxon && STAGE_TAXA_INFO[selectedTaxon]) return selectedTaxon;
    return "Alveolina haymanaensis";
  });
  const [scrollTrigger, setScrollTrigger] = useState(() => (selectedTaxon ? 1 : 0));

  useEffect(() => {
    if (!scrollTrigger || !selectedTaxon) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById("taxon-profile")?.scrollIntoView({ block: "start", behavior: "smooth" })
    );
    return () => cancelAnimationFrame(frame);
  }, [scrollTrigger, selectedTaxon]);

  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[1];
  const spotlightTaxon = activeStage.taxa.includes(activeChipTaxon)
    ? activeChipTaxon
    : activeStage.taxa[0];
  const taxonMeta = STAGE_TAXA_INFO[spotlightTaxon];

  const handleStageSelect = (stageId) => {
    setActiveStageId(stageId);
    const stageObj = STAGES.find((s) => s.id === stageId);
    if (stageObj && !stageObj.taxa.includes(activeChipTaxon)) {
      setActiveChipTaxon(stageObj.taxa[0]);
    }
  };

  const handleChipSelect = (e, stageId, taxonName) => {
    e.stopPropagation();
    setActiveStageId(stageId);
    setActiveChipTaxon(taxonName);
    setSearchParams({ taxon: taxonName }, { replace: true });
  };

  const handleOpenProfileSection = (taxonName) => {
    setSearchParams({ taxon: taxonName }, { replace: true });
    setScrollTrigger((c) => c + 1);
  };

  return (
    <main id="geology" className="ms-geology-page" lang={lang}>
      {/* ── 1. MICROSOFT PAGE HERO BANNER ── */}
      <PageHero
        eyebrow={lang === "tr" ? "Paleontolojik Stratigrafi ve Ortam" : "Paleontological Stratigraphy & Environment"}
        title={lang === "tr" ? "Jeolojik Bağlam ve Paleo-Ortamlar" : "Geological Context & Paleo-Environments"}
        text={
          lang === "tr"
            ? "Mevcut ontoloji, büyük bentik foraminiferler için önemli evrimsel aşamaları temsil eden Paleosen ve Eosen dönemlerine, çökel derinliklerine ve fosil ortam kayıtlarına odaklanmaktadır."
            : "The current ontology focuses on the Paleocene and Eocene periods, representing key evolutionary radiation stages, depositional depths, and fossil environment records for larger benthic foraminifera."
        }
        tone="gray"
        image={heroImg}
        imageAlt="Midas Monument and Geological Landscape"
        imagePosition="center 30%"
        highlights={[
          lang === "tr" ? "59.2 – 47.8 My Kronostratigrafi" : "59.2 – 47.8 Ma Chronostratigraphy",
          lang === "tr" ? "Tethys Karbonat Platformu" : "Tethys Carbonate Realm",
          lang === "tr" ? "18+ Ortam ve Derinlik Kaydı" : "18+ Depth & Environment Records",
        ]}
        mediaTag={lang === "tr" ? "Saha Stratigrafisi · Paleosen–Eosen" : "Field Stratigraphy · Paleocene–Eocene"}
        actions={
          <Link to="/tani" className="ms-btn">
            <span>{lang === "tr" ? "Fosil Tanılamaya Geç" : "Go to Identification"}</span>
            <span aria-hidden="true">→</span>
          </Link>
        }
      />

      {/* ── 2. INTERACTIVE STRATIGRAPHIC TIMELINE ── */}
      <section className="ms-section ms-geology-stages-section">
        <div className="ms-container">
          <Reveal className="ms-section-header">
            <div>
              <span className="ms-eyebrow">
                {lang === "tr" ? "Stratigrafik Katlar" : "Stratigraphic Stages"}
              </span>
              <h2 className="ms-section-title">
                {lang === "tr" ? "Paleosen ve Eosen Kronostratigrafisi" : "Paleocene & Eocene Chronostratigraphy"}
              </h2>
              <p className="ms-section-lead">
                {lang === "tr"
                  ? "Tethys biyoprovensinde foraminifer faunasının evrimsel çeşitlenişini belirleyen üç kritik katı ve mavi takson etiketlerini yerinde inceleyin."
                  : "Explore the three critical stages defining the evolutionary diversification of Tethyan foraminiferal fauna along the interactive timeline and taxon selectors."}
              </p>
            </div>
          </Reveal>

          <div className="ms-geo-timeline" role="tablist" aria-label={lang === "tr" ? "Jeolojik kat zaman çizelgesi" : "Geological stage timeline"}>
            <div className="ms-geo-timeline-rail" aria-hidden="true" />
            {STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`ms-geo-timeline-node${isSelected ? " is-active" : ""}`}
                  onClick={() => handleStageSelect(stage.id)}
                >
                  <span className="ms-geo-node-dot" aria-hidden="true" />
                  <span className="ms-geo-node-age">{stage.age}</span>
                  <strong className="ms-geo-node-name">{stage.name[lang]}</strong>
                  <span className="ms-geo-node-epoch">{stage.epoch[lang]} · {stage.duration}</span>
                </button>
              );
            })}
          </div>

          <div className="ms-grid ms-grid--3 ms-geo-stage-cards">
            {STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              return (
                <div
                  key={stage.id}
                  className={`ms-card ms-geology-card${isSelected ? " is-selected" : ""}`}
                  onClick={() => handleStageSelect(stage.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleStageSelect(stage.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                >
                  <div className="ms-card-body">
                    <div className="ms-geo-card-top">
                      <span className={`ms-badge ${isSelected ? "ms-badge--accent" : "ms-badge--neutral"}`}>
                        {stage.step} · {stage.epoch[lang]}
                      </span>
                      <span className="ms-geo-card-age">{stage.age}</span>
                    </div>
                    <h3 className="ms-card-title">{stage.name[lang]}</h3>
                    <p className="ms-card-text">{stage.desc[lang]}</p>
                    <div className="ms-geo-card-taxa">
                      {stage.taxa.map((taxonName) => {
                        const chipActive = isSelected && spotlightTaxon === taxonName;
                        return (
                          <button
                            key={taxonName}
                            type="button"
                            aria-pressed={chipActive}
                            className={`ms-geo-taxon-chip${chipActive ? " is-active" : ""}`}
                            onClick={(e) => handleChipSelect(e, stage.id, taxonName)}
                          >
                            <em>{taxonName}</em>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="ms-geo-stage-spotlight" role="tabpanel" aria-label={activeStage.name[lang]}>
            <div className="ms-geo-spotlight-stage">
              <div className="ms-geo-spotlight-meta">
                <span className="ms-eyebrow">
                  {activeStage.step} · {activeStage.epoch[lang]} · {activeStage.age} ({activeStage.duration})
                </span>
                <h3>{activeStage.name[lang]}</h3>
              </div>
              <p className="ms-geo-spotlight-desc">{activeStage.desc[lang]}</p>
              <div className="ms-geo-spotlight-facies">{activeStage.facies[lang]}</div>
            </div>

            {taxonMeta && (
              <div className="ms-geo-spotlight-taxon">
                <div className="ms-geo-spotlight-taxon-head">
                  <div>
                    <span className="ms-geo-spotlight-kicker">
                      {lang === "tr" ? "Seçili Kat Temsilci Taksonu" : "Selected Stage Representative Taxon"}
                    </span>
                    <h4 className="ms-geo-spotlight-taxon-name">
                      <em>{spotlightTaxon}</em>
                    </h4>
                  </div>
                  <span className="ms-geo-spotlight-rank">
                    {taxonMeta.rank === "SPECIES"
                      ? (lang === "tr" ? "Tür" : "Species")
                      : (lang === "tr" ? "Cins" : "Genus")}
                  </span>
                </div>

                <dl className="ms-geo-spotlight-facts">
                  <div className="ms-geo-spotlight-fact">
                    <dt>{lang === "tr" ? "Paleo-derinlik" : "Paleo-depth"}</dt>
                    <dd>{taxonMeta.depth[lang]}</dd>
                  </div>
                  <div className="ms-geo-spotlight-fact">
                    <dt>{lang === "tr" ? "Ortam" : "Habitat"}</dt>
                    <dd>{taxonMeta.habitat[lang]}</dd>
                  </div>
                </dl>

                <div className="ms-geo-spotlight-actions">
                  <button
                    type="button"
                    className="ms-btn ms-btn--sm ms-geo-spotlight-btn"
                    onClick={() => handleOpenProfileSection(spotlightTaxon)}
                  >
                    <span>
                      {lang === "tr" ? "Tam WoRMS & Ontoloji Profili ↓" : "Full WoRMS & Ontology Profile ↓"}
                    </span>
                  </button>
                  <Link
                    to={`/fosiller?q=${encodeURIComponent(taxonMeta.genus)}`}
                    className="ms-btn ms-btn--sm ms-geo-spotlight-secondary"
                  >
                    <span>{lang === "tr" ? "Fosil Kataloğunda Aç →" : "Open in Fossil Catalog →"}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. SELECTED TAXON PROFILE (IF QUERY PARAM) ── */}
      {selectedTaxon && (
        <section id="taxon-profile" className="ms-section ms-section--gray ms-geology-taxon-profile-section" aria-labelledby="selected-taxon-heading">
          <div className="ms-container">
            <div className="ms-section-header">
              <div>
                <span className="ms-eyebrow">
                  {lang === "tr" ? "Seçilen Takson Detayı" : "Selected Taxon Detail"}
                </span>
                <h2 id="selected-taxon-heading" className="ms-section-title">
                  <em>{selectedTaxon}</em>
                </h2>
              </div>
              <button
                type="button"
                className="ms-btn ms-btn--secondary ms-btn--sm"
                onClick={() => setSearchParams({}, { replace: true })}
              >
                {lang === "tr" ? "Profili Kapat ×" : "Close Profile ×"}
              </button>
            </div>
            <TaxonProfileCard scientificName={selectedTaxon} displayName={selectedTaxon} />
          </div>
        </section>
      )}

      {/* ── 4. TAXON ENVIRONMENT RECORDS ── */}
      <section className="ms-section ms-section--gray ms-geology-env-section">
        <div className="ms-container">
          <TaxonEnvironmentSection query={params.get("q") || ""} />
        </div>
      </section>
    </main>
  );
}

// ─── TAXON ENVIRONMENT SECTION ──────────────────────────────────────────
function TaxonEnvironmentSection({ query = "" }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(query);
  const [rankFilter, setRankFilter] = useState("");
  const [depthZone, setDepthZone] = useState("all");
  const { lang } = useLanguage();

  useEffect(() => { setSearchTerm(query); }, [query]);

  // Fetch all profiles on mount
  useEffect(() => {
    fetch(`${API}/environment`)
      .then((res) => {
        if (!res.ok) throw new Error("Veri yüklenemedi");
        return res.json();
      })
      .then((data) => {
        setProfiles(data.profiles || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Client-side filtering
  const filtered = profiles.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = !rankFilter || p.rank === rankFilter;
    const matchesDepth = matchDepthZone(p, depthZone);
    return matchesSearch && matchesRank && matchesDepth;
  });

  return (
    <div className="taxon-env-section">
      <div className="ms-section-header">
        <div>
          <span className="ms-eyebrow">
            {lang === "tr" ? "Veritabanı Kayıtları" : "Database Records"}
          </span>
          <h2 className="ms-section-title">
            {lang === "tr" ? "Takson Ortam ve Derinlik Kayıtları" : "Taxon Environment & Depth Records"}
          </h2>
          <p className="ms-section-lead">
            {lang === "tr"
              ? "Proje veri setinden derlenen yerel derinlik ve paleo-ortam bilgileri. Tür düzeyindeki kayıtlar bütün cinse otomatik olarak genellenmez."
              : "Local depth and paleo-environment information compiled from the project dataset. Species-level records are not automatically generalized to the entire genus."}
          </p>
        </div>
        {!loading && !error && (
          <span className="ms-badge ms-badge--neutral taxon-env-badge-count">
            {filtered.length} / {profiles.length} {lang === "tr" ? "kayıt" : "records"}
          </span>
        )}
      </div>

      {/* Depositional Depth Spectrum */}
      <div className="ms-geo-depth-spectrum" role="group" aria-label={lang === "tr" ? "Çökelme derinliği zonu filtresi" : "Depositional depth zone filter"}>
        <div className="ms-geo-depth-bar" aria-hidden="true" />
        <div className="ms-geo-depth-tabs">
          {DEPTH_ZONES.map((zone) => {
            const active = depthZone === zone.id;
            return (
              <button
                key={zone.id}
                type="button"
                className={`ms-geo-depth-btn${active ? " is-active" : ""}`}
                onClick={() => setDepthZone(zone.id)}
              >
                <span className="ms-geo-depth-label">{zone.label[lang]}</span>
                <span className="ms-geo-depth-range">{typeof zone.range === "string" ? zone.range : zone.range[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="taxon-env-controls">
        <div className="taxon-env-search-wrap">
          <svg className="taxon-env-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className="ms-input taxon-env-search"
            placeholder={lang === "tr" ? "Bilimsel isme göre ara (örn. Alveolina, Karsella)..." : "Search by scientific name (e.g. Alveolina, Karsella)..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="ms-select taxon-env-filter"
          value={rankFilter}
          onChange={(e) => setRankFilter(e.target.value)}
          aria-label={lang === "tr" ? "Taksonomik seviye filtresi" : "Taxonomic rank filter"}
        >
          <option value="">{lang === "tr" ? "Tüm Seviyeler" : "All Ranks"}</option>
          <option value="SPECIES">{lang === "tr" ? "Yalnızca Tür (Species)" : "Species Only"}</option>
          <option value="GENUS">{lang === "tr" ? "Yalnızca Cins (Genus)" : "Genus Only"}</option>
        </select>
      </div>

      {/* Content */}
      {loading && (
        <div className="taxon-env-loading">
          <div className="ms-spinner" />
          <span>{lang === "tr" ? "Ortam verileri yükleniyor..." : "Loading environment data..."}</span>
        </div>
      )}

      {error && (
        <div className="ms-message ms-message--error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="taxon-env-grid">
            {filtered.map((p, i) => (
              <div key={p.scientificName || i} className="ms-card taxon-env-card">
                <div className="ms-card-body taxon-env-card-body">
                  <div className="taxon-env-card-header">
                    <em className="taxon-env-name">{p.scientificName}</em>
                    <span className={`ms-badge ${p.rank === "SPECIES" ? "ms-badge--neutral" : ""}`}>
                      {p.rank === "SPECIES" ? (lang === "tr" ? "Tür" : "Species") : (lang === "tr" ? "Cins" : "Genus")}
                    </span>
                  </div>

                  {p.taxonomicReviewRequired && (
                    <div className="taxon-env-review-badge">
                      {lang === "tr" ? "Taksonomik inceleme gerekli" : "Taxonomic review required"}
                    </div>
                  )}

                  <div className="taxon-env-fields">
                    <div className="taxon-env-field">
                      <strong className="taxon-env-field-label">{lang === "tr" ? "Derinlik:" : "Depth:"}</strong>
                      <span>{lang === "tr" ? (p.depthTextTr || "—") : (p.depthTextEn || (EN_TRANSLATIONS[p.scientificName]?.depth) || p.depthTextTr || "—")}</span>
                    </div>
                    <div className="taxon-env-field">
                      <strong className="taxon-env-field-label">{lang === "tr" ? "Yaşadığı Ortam:" : "Habitat:"}</strong>
                      <span>{lang === "tr" ? (p.habitatTextTr || "—") : (p.habitatTextEn || (EN_TRANSLATIONS[p.scientificName]?.habitat) || p.habitatTextTr || "—")}</span>
                    </div>
                    <div className="taxon-env-field taxon-env-source">
                      <strong className="taxon-env-field-label">{lang === "tr" ? "Kaynak:" : "Source:"}</strong>
                      <span>{lang === "tr" ? (p.sourceLabel || "—") : (p.sourceLabelEn || (EN_TRANSLATIONS[p.scientificName]?.source) || p.sourceLabel || "—")}</span>
                    </div>
                  </div>

                  {!p.linkedToOntology && (
                    <div className="taxon-env-unlinked">
                      {lang === "tr" ? "Henüz tanı ontolojisine bağlı değil" : "Not yet linked to diagnostic ontology"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="taxon-env-empty">
              <p>{lang === "tr" ? "Aramanızla eşleşen takson kaydı bulunamadı." : "No taxon records found matching your query."}</p>
              <button
                type="button"
                className="ms-btn ms-btn--secondary ms-btn--sm"
                onClick={() => { setSearchTerm(""); setRankFilter(""); setDepthZone("all"); }}
              >
                {lang === "tr" ? "Filtreleri Temizle" : "Clear Filters"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Geology;
