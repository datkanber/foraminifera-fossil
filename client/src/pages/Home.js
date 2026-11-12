import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { dayTwoPhotos } from "../data/fieldPhotos";
import workshopPhoto from "../assets/photos/1792745417607.jpg";
import collectionPhoto from "../assets/photos/1792745403944.jpg";
import foram1 from "../assets/images/foram1.jpg";
import foram2 from "../assets/images/foram2.jpg";
import foram3 from "../assets/images/foram3.jpg";
import Reveal from "../components/ms/Reveal";
import "../styles/pages/home.css";

const heroSlides = [
  {
    id: "spotlight-1",
    photo: dayTwoPhotos.find(p => p.id === "20261023_145547") || dayTwoPhotos[3],
    eyebrow: {
      tr: "Dijital Jeoloji ve Fosil Keşfi",
      en: "Digital Geology & Fossil Discovery",
    },
    title: {
      tr: "Dünyanın geçmişini mikroskobik yaşamla okuyun.",
      en: "Read Earth's past through microscopic life.",
    },
    summary: {
      tr: "Foraminiferleri kural tabanlı ontoloji ve görsel yapay zekâ ile tanıyın, jeolojik bağlamı keşfedin ve bilimsel gözlemlerinizi karar desteğine dönüştürün.",
      en: "Identify foraminifera with rule-based ontology and visual AI, explore their geological context, and turn observations into decision support.",
    },
    actionPrimary: {
      to: "/tani",
      tr: "Tanılamayı başlat",
      en: "Start identification",
    },
    actionSecondary: {
      to: "/lab",
      tr: "3D Laboratuvarı Keşfet",
      en: "Explore 3D Lab",
    },
  },
  {
    id: "spotlight-2",
    photo: dayTwoPhotos.find(p => p.id === "20261023_145744") || dayTwoPhotos[5],
    eyebrow: {
      tr: "Erasmus+ STONE Saha Çalışması",
      en: "Erasmus+ STONE Field Study",
    },
    title: {
      tr: "Yazılıkaya ve Frig Vadisi'nde jeolojik miras.",
      en: "Geological heritage in Yazılıkaya and Phrygian Valley.",
    },
    summary: {
      tr: "Türkiye ve İspanya'dan araştırmacılar Eskişehir'de taş mirası ve jeolojik formasyonları yerinde inceledi.",
      en: "Researchers from Türkiye and Spain examined stone heritage and geological formations on-site in Eskişehir.",
    },
    actionPrimary: {
      to: "/haberler",
      tr: "Etkinlik Raporunu Oku",
      en: "Read Event Report",
    },
    actionSecondary: {
      to: "/jeoloji",
      tr: "Jeolojik Bağlam",
      en: "Geological Context",
    },
  },
  {
    id: "spotlight-3",
    photo: {
      id: "workshop",
      src: workshopPhoto,
      width: 1152,
      height: 1536,
      caption: {
        tr: "ESOGÜ laboratuvarında paleontolojik analiz ve mikroskop incelemeleri",
        en: "Paleontological analysis and microscopy in ESOGÜ laboratory",
      },
    },
    eyebrow: {
      tr: "Görsel Yapay Zekâ & Karar Destek",
      en: "Visual AI & Decision Support",
    },
    title: {
      tr: "Mikroskop kesitlerinden otomatik karakter çıkarımı.",
      en: "Automated character extraction from thin-section imagery.",
    },
    summary: {
      tr: "Görsel YZ modeli foraminifer kesitlerindeki loca dizilimi, duvar yapısı ve kavkı formunu tespit ederek tanı sürecinizi hızlandırır.",
      en: "Our Visual AI model identifies chamber arrangements, wall structures, and test forms from thin sections to accelerate diagnosis.",
    },
    actionPrimary: {
      to: "/vlm",
      tr: "Görsel YZ'yi Dene",
      en: "Try Visual AI",
    },
    actionSecondary: {
      to: "/hakkinda",
      tr: "Proje Hakkında",
      en: "About Project",
    },
  },
];

const galleryPhotos = [
  ...dayTwoPhotos
    .filter(photo => ["20261023_145547", "20261023_150127"].includes(photo.id))
    .map(photo => ({ ...photo, href: "/haberler#day-2" })),
  {
    id: "workshop",
    src: workshopPhoto,
    width: 1152,
    height: 1536,
    href: "/haberler#day-1",
    caption: { tr: "Laboratuvarda bilgi paylaşımı", en: "Sharing knowledge in the laboratory" },
  },
  {
    id: "collections",
    src: collectionPhoto,
    width: 1152,
    height: 1536,
    href: "/haberler#day-1",
    caption: { tr: "Jeoloji koleksiyonlarının ziyareti", en: "Visiting the geological collections" },
  },
];

function QuickIcon({ name }) {
  if (name === "diagnose") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    );
  }
  if (name === "vlm") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
        <path d="m15 11 2-2 4 4" />
      </svg>
    );
  }
  if (name === "lab") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="m12 2 9 5v10l-9 5-9-5V7l9-5z" />
        <path d="m12 12 9-5" />
        <path d="M12 12v10" />
        <path d="m12 12-9-5" />
      </svg>
    );
  }
  if (name === "geology") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M2 18h20" />
        <path d="M2 12h20" />
        <path d="M2 6h20" />
        <path d="m6 6 4 6-4 6" />
        <path d="m14 6 4 6-4 6" />
      </svg>
    );
  }
  if (name === "news") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
      </svg>
    );
  }
  return null;
}

export default function Home() {
  const { lang } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlide = heroSlides[slideIndex];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  function prevSlide() {
    setSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  }

  function nextSlide() {
    setSlideIndex(prev => (prev + 1) % heroSlides.length);
  }

  const quickLinks = [
    {
      to: "/tani",
      icon: "diagnose",
      title: lang === "tr" ? "Tanı Yap" : "Diagnose",
      subtitle: lang === "tr" ? "Ontolojik karar destek" : "Ontological decision support",
    },
    {
      to: "/vlm",
      icon: "vlm",
      title: lang === "tr" ? "Görsel YZ" : "Visual AI",
      subtitle: lang === "tr" ? "Otomatik karakter çıkarımı" : "Automated character extraction",
    },
    {
      to: "/lab",
      icon: "lab",
      title: lang === "tr" ? "3D Lab" : "3D Lab",
      subtitle: lang === "tr" ? "İnteraktif mikroskop ve kavkılar" : "Interactive microscope & shells",
    },
    {
      to: "/jeoloji",
      icon: "geology",
      title: lang === "tr" ? "Jeoloji" : "Geology",
      subtitle: lang === "tr" ? "Paleosen–Eosen ortamları" : "Paleocene–Eocene environments",
    },
    {
      to: "/haberler",
      icon: "news",
      title: lang === "tr" ? "Haberler" : "News & Events",
      subtitle: lang === "tr" ? "STONE Geo Academy" : "STONE Geo Academy",
    },
  ];

  return (
    <main className="ms-home" lang={lang}>
      {/* ── 1. HERO SPOTLIGHT BANNER (FULL WIDTH MICROSOFT HERO) ── */}
      <section
        className="ms-home-hero"
        aria-label={lang === "tr" ? "Öne Çıkan Başlıklar" : "Featured Highlights"}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="ms-container--wide ms-home-hero-container">
          <div className="ms-home-banner">
            <div className="ms-home-banner-media">
              <img
                key={activeSlide.photo.id || activeSlide.id}
                src={activeSlide.photo.src}
                srcSet={activeSlide.photo.srcSet}
                sizes="(max-width: 960px) 100vw, 55vw"
                alt={activeSlide.photo.caption ? activeSlide.photo.caption[lang] : activeSlide.title[lang]}
                className="ms-home-banner-img"
              />
              <div className="ms-home-banner-media-gradient" />
            </div>

            <div className="ms-home-banner-copy">
              <span className="ms-eyebrow ms-home-kicker">
                {activeSlide.eyebrow[lang]}
              </span>
              <h1 className="ms-home-hero-title">
                {activeSlide.title[lang]}
              </h1>
              <p className="ms-home-hero-text">
                {activeSlide.summary[lang]}
              </p>

              <div className="ms-home-hero-actions">
                <Link className="ms-btn ms-btn--lg ms-home-btn-primary" to={activeSlide.actionPrimary.to}>
                  <span>{activeSlide.actionPrimary[lang]}</span>
                  <span className="ms-home-arrow" aria-hidden="true">→</span>
                </Link>
                <Link className="ms-btn ms-btn--lg ms-btn--secondary ms-home-btn-secondary" to={activeSlide.actionSecondary.to}>
                  {activeSlide.actionSecondary[lang]}
                </Link>
              </div>

              {/* Carousel controls */}
              <div className="ms-home-carousel-controls">
                <button
                  type="button"
                  className="ms-home-control-btn"
                  onClick={prevSlide}
                  aria-label={lang === "tr" ? "Önceki slayt" : "Previous slide"}
                >
                  ‹
                </button>
                <div className="ms-home-dots" role="tablist" aria-label="Slides">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === slideIndex}
                      aria-label={`${lang === "tr" ? "Slayt" : "Slide"} ${idx + 1}`}
                      className={`ms-home-dot${idx === slideIndex ? " is-active" : ""}`}
                      onClick={() => setSlideIndex(idx)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="ms-home-control-btn"
                  onClick={nextSlide}
                  aria-label={lang === "tr" ? "Sonraki slayt" : "Next slide"}
                >
                  ›
                </button>
                <span className="ms-home-slide-counter" aria-live="polite">
                  {slideIndex + 1} / {heroSlides.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK ACCESS CARDS (MICROSOFT 365 / SURFACE STYLE) ── */}
      <section className="ms-section ms-home-quick-section" aria-label={lang === "tr" ? "Hızlı Erişim" : "Quick Access"}>
        <div className="ms-container">
          <div className="ms-home-quick-grid">
            {quickLinks.map((item, i) => (
              <Link key={item.to} to={item.to} className="ms-home-quick-card">
                <div className="ms-home-quick-icon">
                  <QuickIcon name={item.icon} />
                </div>
                <div className="ms-home-quick-text">
                  <span className="ms-home-quick-title">{item.title}</span>
                  <span className="ms-home-quick-sub">{item.subtitle}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED EVENT: STONE ESKİŞEHİR DIGITAL GEO ACADEMY ── */}
      <section className="ms-section ms-section--gray ms-home-event-section" aria-labelledby="home-event-title">
        <div className="ms-container">
          <Reveal className="ms-section-header">
            <div>
              <span className="ms-eyebrow">
                {lang === "tr" ? "Uluslararası Etkinlik ve Saha Mirası" : "International Event & Field Heritage"}
              </span>
              <h2 id="home-event-title" className="ms-section-title">
                STONE Eskişehir Digital Geo Academy
              </h2>
              <p className="ms-section-lead">
                {lang === "tr"
                  ? "Taş mirası ve dijital jeolojinin buluştuğu Erasmus+ STONE projesinde Eskişehir Osmangazi Üniversitesi ve İspanya ortaklığıyla gerçekleştirilen saha ve laboratuvar çalışmaları."
                  : "Field and laboratory studies conducted through the Erasmus+ STONE project connecting stone heritage and digital geology, hosted at Eskişehir Osmangazi University."}
              </p>
            </div>
            <Link className="ms-link" to="/haberler">
              {lang === "tr" ? "Tüm haberler ve fotoğraflar" : "All news and photographs"}
            </Link>
          </Reveal>

          <div className="ms-home-event-layout">
            <div className="ms-home-event-gallery">
              {galleryPhotos.map((photo, index) => (
                <Reveal
                  as="figure"
                  key={photo.id}
                  className="ms-home-gallery-item"
                  delay={index * 60}
                >
                  <Link to={photo.href} className="ms-home-gallery-link">
                    <img
                      src={photo.src}
                      srcSet={photo.srcSet}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      alt={photo.caption[lang]}
                      width={photo.width}
                      height={photo.height}
                      loading="lazy"
                    />
                    <div className="ms-home-gallery-overlay">
                      <span className="ms-home-gallery-caption">{photo.caption[lang]}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal className="ms-card ms-home-event-card">
              <div className="ms-card-body">
                <span className="ms-badge ms-badge--neutral">
                  {lang === "tr" ? "22–24 Ekim 2026 · ESOGÜ & Yazılıkaya" : "22–24 October 2026 · ESOGÜ & Yazılıkaya"}
                </span>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Taş Mirası ve Dijital Jeoloji" : "Stone Heritage & Digital Geology"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Türkiye ve İspanya’dan akademisyenler, eğitimciler ve öğrenciler ESOGÜ Jeoloji Mühendisliği laboratuvarlarında mikroskop incelemeleri gerçekleştirdi ve Yazılıkaya Frig Vadisi açık hava sahasında jeolojik formasyonları yerinde fotoğrafladı."
                    : "Academicians, educators, and students from Türkiye and Spain carried out microscopy studies in ESOGÜ Geological Engineering laboratories and investigated geological rock formations on-site in Yazılıkaya."}
                </p>
                <div className="ms-card-footer">
                  <Link className="ms-btn ms-btn--secondary" to="/haberler">
                    <span>{lang === "tr" ? "Detaylı Haberi İncele" : "Explore Full Story"}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. RESEARCH HIGHLIGHTS & KEY STATS (MICROSOFT NUMBERS) ── */}
      <section className="ms-section ms-home-metrics-section">
        <div className="ms-container">
          <div className="ms-home-metrics-grid">
            <Reveal className="ms-home-metric-card" delay={0}>
              <span className="ms-home-metric-number">7</span>
              <span className="ms-home-metric-label">
                {lang === "tr" ? "Pilot Takson" : "Pilot Taxa"}
              </span>
              <p className="ms-home-metric-desc">
                {lang === "tr"
                  ? "Paleosen–Eosen dönemlerine ait özgün ontolojik karakter analizi"
                  : "Original ontological character analysis for Paleocene–Eocene"}
              </p>
            </Reveal>

            <Reveal className="ms-home-metric-card" delay={80}>
              <span className="ms-home-metric-number">30+</span>
              <span className="ms-home-metric-label">
                {lang === "tr" ? "Kural Tabanlı Eşleşme" : "Rule-Based Matches"}
              </span>
              <p className="ms-home-metric-desc">
                {lang === "tr"
                  ? "Morfolojik ve ölçülebilir niteliklerle aday türleri daraltan karar desteği"
                  : "Decision support narrowing candidate species via morphological traits"}
              </p>
            </Reveal>

            <Reveal className="ms-home-metric-card" delay={160}>
              <span className="ms-home-metric-number">3D</span>
              <span className="ms-home-metric-label">
                {lang === "tr" ? "İnteraktif Kavkı Modelleri" : "Interactive Shell Models"}
              </span>
              <p className="ms-home-metric-desc">
                {lang === "tr"
                  ? "Web tabanlı sanal laboratuvarda üç boyutlu numune inceleme ve test odası"
                  : "Three-dimensional specimen inspection in a web-based virtual lab"}
              </p>
            </Reveal>

            <Reveal className="ms-home-metric-card" delay={240}>
              <span className="ms-home-metric-number">AI</span>
              <span className="ms-home-metric-label">
                {lang === "tr" ? "Görsel Model Desteği" : "Visual Model Support"}
              </span>
              <p className="ms-home-metric-desc">
                {lang === "tr"
                  ? "İnce kesit fotoğraflarından otomatik loca ve duvar karakter çıkarımı"
                  : "Automated extraction of chamber and wall characters from thin sections"}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. EDUCATIONAL CARDS: WHAT ARE FORAMINIFERA? ── */}
      <section className="ms-section ms-section--gray ms-home-edu-section" id="about">
        <div className="ms-container">
          <Reveal className="ms-section-header">
            <div>
              <span className="ms-eyebrow">
                {lang === "tr" ? "Bilimsel Çerçeve" : "Scientific Framework"}
              </span>
              <h2 className="ms-section-title">
                {lang === "tr" ? "Foraminifera ve Paleontoloji" : "Foraminifera and Paleontology"}
              </h2>
              <p className="ms-section-lead">
                {lang === "tr"
                  ? "Mikroskobik tek hücreli organizmaların kalkerli kavkıları, jeolojik zaman ve paleo-iklim araştırmalarının en güvenilir anahtarlarındandır."
                  : "The calcareous tests of microscopic single-celled organisms are among the most reliable keys to geological time and paleo-climate research."}
              </p>
            </div>
            <Link className="ms-link" to="/hakkinda">
              {lang === "tr" ? "Proje ve ontoloji hakkında" : "About project and ontology"}
            </Link>
          </Reveal>

          <div className="ms-grid ms-grid--3">
            <Reveal as="article" className="ms-card ms-card--interactive" delay={0}>
              <div className="ms-card-media ms-home-edu-media">
                <img src={foram1} alt={lang === "tr" ? "Foraminifera Kavkısı" : "Foraminifera Test"} />
              </div>
              <div className="ms-card-body">
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Foraminifera Nedir?" : "What are Foraminifera?"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Foraminiferler, farklı şekillere, loca dizilimlerine ve mineralojik duvar yapılarına sahip kabuklu mikroorganizmalardır. Biyolojik ve jeolojik sınıflandırmada temel referans olarak kabul edilirler."
                    : "Foraminifera are shelled microorganisms with distinctive shapes, chamber arrangements, and mineral wall structures. They are primary references in geological classification."}
                </p>
                <div className="ms-card-footer">
                  <Link className="ms-link" to="/tani">
                    {lang === "tr" ? "Tanılamayı keşfedin" : "Explore diagnosis"}
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal as="article" className="ms-card ms-card--interactive" delay={80}>
              <div className="ms-card-media ms-home-edu-media">
                <img src={foram2} alt={lang === "tr" ? "Jeolojik Önem" : "Geological Importance"} />
              </div>
              <div className="ms-card-body">
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Jeolojik Önemi" : "Geological Importance"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Fosil foraminiferler, biyostratigrafi ve paleo-ortamsal yorumlama için kullanılır. Kayaç ve tortul örneklerindeki varlıkları, çökel ortamları, su derinliği ve tuzluluk hakkında kritik bilgiler sağlar."
                    : "Fossil foraminifera are used for biostratigraphy and paleoenvironmental interpretation. Their occurrence in rock records indicates depositional depth, salinity, and climate."}
                </p>
                <div className="ms-card-footer">
                  <Link className="ms-link" to="/jeoloji">
                    {lang === "tr" ? "Ortam verilerini inceleyin" : "Review environment data"}
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal as="article" className="ms-card ms-card--interactive" delay={160}>
              <div className="ms-card-media ms-home-edu-media">
                <img src={foram3} alt={lang === "tr" ? "Fosil Verileri" : "Fossil Data"} />
              </div>
              <div className="ms-card-body">
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Fosil Verileri ve Karar Destek" : "Fossil Data & Decision Support"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Sistemimiz taksonomi, jeolojik yaş, derinlik, morfoloji, loca sayısı ve kabuk yapısını ontolojik kurallarla işleyerek araştırmacının kesin tür teşhisini destekler."
                    : "Our system processes taxonomy, geological age, depth, morphology, chamber counts, and shell structure through ontological rules to support researcher diagnosis."}
                </p>
                <div className="ms-card-footer">
                  <Link className="ms-link" to="/hakkinda">
                    {lang === "tr" ? "Ontoloji detayları" : "Ontology details"}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 6. CALLOUT CALL-TO-ACTION (MICROSOFT BLUE BAND) ── */}
      <section className="ms-section ms-home-cta-section">
        <div className="ms-container">
          <div className="ms-home-cta-box">
            <div className="ms-home-cta-copy">
              <span className="ms-eyebrow ms-home-cta-eyebrow">
                {lang === "tr" ? "Hemen Başlayın" : "Get Started"}
              </span>
              <h2 className="ms-home-cta-title">
                {lang === "tr"
                  ? "Mikro-fosil tanı sürecinizi bilimsel karar desteğiyle hızlandırın."
                  : "Accelerate your micro-fossil diagnosis with scientific decision support."}
              </h2>
              <p className="ms-home-cta-desc">
                {lang === "tr"
                  ? "Numunelerinizi kural tabanlı tanı sihirbazıyla inceleyin veya görsel yapay zekâ modelimize ince kesit görseli yükleyin."
                  : "Examine specimens using the rule-based wizard or upload thin-section imagery to our Visual AI model."}
              </p>
            </div>
            <div className="ms-home-cta-buttons">
              <Link className="ms-btn ms-btn--lg ms-home-cta-btn-white" to="/tani">
                <span>{lang === "tr" ? "Tanı Yapmaya Başla" : "Start Identification"}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="ms-btn ms-btn--lg ms-home-cta-btn-ghost" to="/vlm">
                <span>{lang === "tr" ? "Görsel YZ Analizi" : "Visual AI Analysis"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
