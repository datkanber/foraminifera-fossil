import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import PageHero from "../components/ms/PageHero";
import Reveal from "../components/ms/Reveal";
import workshopPhoto from "../assets/photos/1792745417607.jpg";
import "../styles/pages/about.css";

function About() {
  const { lang } = useLanguage();

  return (
    <main id="about" className="ms-about-page" lang={lang}>
      {/* ── 1. MICROSOFT PAGE HERO ── */}
      <PageHero
        eyebrow={lang === "tr" ? "GeoKnow Araştırma Platformu" : "GeoKnow Research Platform"}
        title={lang === "tr" ? "Veriseti ve Proje Hakkında" : "About the Dataset & Project"}
        text={
          lang === "tr"
            ? "Paleosen–Eosen büyük bentik foraminiferleri için ortak bir tanımlama ontolojisi geliştirmek ve paleontolojik teşhis sürecini şeffaf karar desteğiyle güçlendirmek amacıyla hazırlanmıştır."
            : "Developed to establish a common diagnostic ontology for Paleocene–Eocene larger benthic foraminifera and to empower paleontological diagnosis through transparent decision support."
        }
        tone="gray"
        image={workshopPhoto}
        imageAlt="Laboratory and Research Activity"
        imagePosition="center 30%"
        actions={
          <div className="ms-page-hero-actions">
            <Link to="/tani" className="ms-btn">
              <span>{lang === "tr" ? "Tanı Sistemini Başlat" : "Start Decision Support"}</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link to="/jeoloji" className="ms-btn ms-btn--secondary">
              {lang === "tr" ? "Jeolojik Ortamlar" : "Geological Environments"}
            </Link>
          </div>
        }
      />

      {/* ── 2. NARRATIVE & CORE METHODOLOGY ── */}
      <section className="ms-section ms-about-narrative-section">
        <div className="ms-container">
          <div className="ms-about-columns">
            <Reveal className="ms-about-column-main">
              <span className="ms-eyebrow">
                {lang === "tr" ? "Özgün Bilimsel Model" : "Original Scientific Model"}
              </span>
              <h2 className="ms-about-section-title">
                {lang === "tr"
                  ? "Büyük bentik foraminiferler için ortak ontolojik sınıflandırma"
                  : "Common ontological classification for larger benthic foraminifera"}
              </h2>
              <div className="ms-about-text">
                <p>
                  {lang === "tr" ? (
                    <>
                      Bu platform, Paleosen–Eosen büyük bentik foraminiferleri için ortak bir tanımlama ontolojisi geliştirmek amacıyla hazırlanmıştır. 
                      Sistemdeki veriseti; 7 pilot taksonun (<em>Karsella hottingeri, Pseudolacazina oeztemueri vb.</em>) tanımlarından özenle çıkarılmış morfolojik 
                      ve ölçülebilir karakterler analiz edilerek <strong>tamamen tarafımızdan (paleontolojik uzmanlık ile) özgün olarak</strong> oluşturulmuştur. 
                      Daha önce yapılmamış detaylı bir ontolojik sınıflama modeli sunmaktadır.
                    </>
                  ) : (
                    <>
                      This platform was created to develop a common identification ontology for Paleocene–Eocene larger benthic foraminifera. 
                      The dataset in the system was originally created <strong>entirely by us (with paleontological expertise)</strong> by analyzing the morphological 
                      and measurable characters meticulously extracted from the definitions of 7 pilot taxa (<em>Karsella hottingeri, Pseudolacazina oeztemueri, etc.</em>). 
                      It provides a detailed ontological classification model that has not been done before.
                    </>
                  )}
                </p>
                <p>
                  {lang === "tr" ? (
                    <>
                      Bu sistem kesin tür tayini yapan otomatik bir yapı olarak değil, paleontoloğun tanı sürecini destekleyen bir <strong>Karar Destek Modeli</strong> olarak çalışır. 
                      Adayları daraltır, karakter eşleşmelerini ve kaynaklarını göstererek tanı sürecinize hız ve doğruluk kazandırır.
                    </>
                  ) : (
                    <>
                      This system does not work as an automated structure that makes a definitive species identification, but rather as a <strong>Decision Support Model</strong> that supports the paleontologist's diagnosis process. 
                      It narrows down candidates, shows character matches and sources, and adds speed and accuracy to your diagnosis process.
                    </>
                  )}
                </p>
              </div>
            </Reveal>

            <Reveal className="ms-about-column-side" delay={100}>
              <div className="ms-card ms-about-highlight-card">
                <div className="ms-card-body">
                  <span className="ms-badge ms-badge--neutral">
                    {lang === "tr" ? "Metodolojik İlke" : "Methodological Principle"}
                  </span>
                  <h3 className="ms-card-title">
                    {lang === "tr" ? "Şeffaf Karar Desteği" : "Transparent Decision Support"}
                  </h3>
                  <p className="ms-card-text">
                    {lang === "tr"
                      ? "Kara kutu yapay zekâ yaklaşımlarının aksine, her çıkarım literatürdeki tip kesiti, morfolojik karakter kuralları ve katman seviyeleriyle gerekçelendirilir."
                      : "Unlike black-box AI approaches, every deduction is substantiated by type-section literature, morphological character rules, and stratigraphic layers."}
                  </p>
                  <div className="ms-about-stat-strip">
                    <div className="ms-about-stat">
                      <strong>7</strong>
                      <span>{lang === "tr" ? "Pilot Takson" : "Pilot Taxa"}</span>
                    </div>
                    <div className="ms-about-stat">
                      <strong>30+</strong>
                      <span>{lang === "tr" ? "Kural Matrisi" : "Rule Matrix"}</span>
                    </div>
                    <div className="ms-about-stat">
                      <strong>%100</strong>
                      <span>{lang === "tr" ? "Açık Veri" : "Open Science"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. FOUR CORE CAPABILITIES GRID ── */}
      <section className="ms-section ms-section--gray ms-about-features-section">
        <div className="ms-container">
          <Reveal className="ms-section-header">
            <div>
              <span className="ms-eyebrow">
                {lang === "tr" ? "Platform Mimarisi" : "Platform Architecture"}
              </span>
              <h2 className="ms-section-title">
                {lang === "tr" ? "Sistemin Temel Bileşenleri" : "Core Platform Components"}
              </h2>
              <p className="ms-section-lead">
                {lang === "tr"
                  ? "Araştırmacıya mikroskop başından saha gözlemine kadar eşlik eden bütünleşik araçlar bütünü."
                  : "An integrated suite of tools accompanying researchers from microscopy to geological field observations."}
              </p>
            </div>
          </Reveal>

          <div className="ms-grid ms-grid--4">
            <Reveal as="div" className="ms-card ms-card--flat" delay={0}>
              <div className="ms-card-body">
                <span className="ms-about-card-badge">01</span>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Kural Tabanlı Teşhis" : "Rule-Based Diagnosis"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Duvar yapısı, loca düzeni ve morfolojik ölçümlerle adım adım tür eleme sihirbazı."
                    : "Step-by-step wizard eliminating candidate taxa via wall structure and morphology."}
                </p>
              </div>
            </Reveal>

            <Reveal as="div" className="ms-card ms-card--flat" delay={80}>
              <div className="ms-card-body">
                <span className="ms-about-card-badge">02</span>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Görsel YZ Entegrasyonu" : "Visual AI Integration"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "İnce kesit fotoğraflarından otomatik karakter ve loca çıkarımı yapan yapay zekâ modeli."
                    : "Computer vision model automatically extracting characters from thin sections."}
                </p>
              </div>
            </Reveal>

            <Reveal as="div" className="ms-card ms-card--flat" delay={160}>
              <div className="ms-card-body">
                <span className="ms-about-card-badge">03</span>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "3D Sanal Laboratuvar" : "3D Virtual Laboratory"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "WebGL ve Three.js tabanlı etkileşimli kavkı ve numune mikroskop laboratuvarı."
                    : "Interactive shell specimen and microscope inspection laboratory built with WebGL."}
                </p>
              </div>
            </Reveal>

            <Reveal as="div" className="ms-card ms-card--flat" delay={240}>
              <div className="ms-card-body">
                <span className="ms-about-card-badge">04</span>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Jeolojik Ortam Verisi" : "Geological Environments"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Su derinliği, tuzluluk ve paleo-ortam kayıtlarını içeren takson veritabanı."
                    : "Taxon database detailing paleodepth, salinity, and depositional habitats."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. CTA BANNER ── */}
      <section className="ms-section ms-about-cta-section">
        <div className="ms-container">
          <div className="ms-home-cta-box">
            <div className="ms-home-cta-copy">
              <span className="ms-eyebrow ms-home-cta-eyebrow">
                {lang === "tr" ? "Keşfe Katılın" : "Join the Discovery"}
              </span>
              <h2 className="ms-home-cta-title">
                {lang === "tr"
                  ? "Bilimsel verisetimizi tanı aracıyla test edin."
                  : "Test our scientific dataset using the diagnosis tool."}
              </h2>
              <p className="ms-home-cta-desc">
                {lang === "tr"
                  ? "Mikro-fosil örneklerinizi karakter eşleştirme sihirbazı veya puanlama modeli ile adım adım teşhis edin."
                  : "Diagnose your micro-fossil specimens step-by-step using our character matching wizard or scoring model."}
              </p>
            </div>
            <div className="ms-home-cta-buttons">
              <Link className="ms-btn ms-btn--lg ms-home-cta-btn-white" to="/tani">
                <span>{lang === "tr" ? "Tanı Aracını Başlat" : "Launch Diagnosis"}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="ms-btn ms-btn--lg ms-home-cta-btn-ghost" to="/iletisim">
                <span>{lang === "tr" ? "İletişime Geçin" : "Contact Us"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
