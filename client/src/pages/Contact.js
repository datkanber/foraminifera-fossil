import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import PageHero from "../components/ms/PageHero";
import Reveal from "../components/ms/Reveal";
import heroContactHall from "../assets/photos/1792745403944.jpg";
import "../styles/pages/contact.css";

function ContactIcon({ name }) {
  if (name === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </svg>
    );
  }
  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (name === "institution") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 21h18" />
        <path d="M5 21V10l7-5 7 5v11" />
        <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
        <circle cx="12" cy="9" r="1" />
      </svg>
    );
  }
  return null;
}

function Contact() {
  const { lang } = useLanguage();

  return (
    <main className="ms-contact-page" lang={lang}>
      {/* ── 1. MICROSOFT PAGE HERO ── */}
      <PageHero
        eyebrow={lang === "tr" ? "GeoKnow Araştırma Grubu" : "GeoKnow Research Group"}
        title={lang === "tr" ? "İletişim ve İş Birliği" : "Contact & Collaboration"}
        text={
          lang === "tr"
            ? "Paleontolojik veriseti, karar destek modeli, akademik araştırmalar veya proje iş birlikleri hakkında sorularınız için bize ulaşın."
            : "Reach out to our research team for inquiries regarding the paleontological dataset, decision-support model, academic studies, or project collaborations."
        }
        highlights={
          lang === "tr"
            ? ["ESOGÜ Jeoloji Müh.", "GeoKnow Araştırma Grubu", "Erasmus+ STONE"]
            : ["ESOGÜ Geological Eng.", "GeoKnow Research Group", "Erasmus+ STONE"]
        }
        tone="gray"
        image={heroContactHall}
        imageAlt={lang === "tr" ? "ESOGÜ jeoloji koleksiyonunu ziyaret eden STONE araştırma ekibi" : "The STONE research team visiting the ESOGÜ geology collection"}
        imagePosition="center center"
        mediaTag={lang === "tr" ? "ESOGÜ jeoloji koleksiyonu · STONE araştırma ekibi" : "ESOGÜ geology collection · STONE research team"}
      />

      {/* ── 2. CONTACT CHANNELS GRID ── */}
      <section className="ms-section ms-contact-cards-section">
        <div className="ms-container">
          <Reveal className="ms-section-header">
            <div>
              <span className="ms-eyebrow">
                {lang === "tr" ? "Doğrudan İletişim Kanalları" : "Direct Channels"}
              </span>
              <h2 className="ms-section-title">
                {lang === "tr" ? "Ekip ve Kurum İletişim Bilgileri" : "Team & Institutional Details"}
              </h2>
            </div>
          </Reveal>

          <div className="ms-grid ms-grid--3">
            {/* E-posta Kartı */}
            <Reveal as="div" className="ms-card ms-contact-card" delay={0}>
              <div className="ms-card-body">
                <div className="ms-contact-icon-wrap">
                  <ContactIcon name="mail" />
                </div>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "E-posta" : "Email"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Sorularınız ve akademik bilgi talepleriniz için doğrudan e-posta gönderebilirsiniz."
                    : "Send us an email for your questions, inquiries, and academic feedback."}
                </p>
                <div className="ms-contact-links">
                  <a href="mailto:kokur@ogu.edu.tr" className="ms-contact-link">
                    kokur@ogu.edu.tr
                  </a>
                  <a href="mailto:kubrayayan6@gmail.com" className="ms-contact-link">
                    kubrayayan6@gmail.com
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Adres Kartı */}
            <Reveal as="div" className="ms-card ms-contact-card" delay={80}>
              <div className="ms-card-body">
                <div className="ms-contact-icon-wrap">
                  <ContactIcon name="location" />
                </div>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Adres ve Yerleşke" : "Campus & Address"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Eskişehir Osmangazi Üniversitesi, Mühendislik Mimarlık Fakültesi, Jeoloji Mühendisliği Bölümü, M2 Blok No: 206, Meşelik Kampüsü, Eskişehir"
                    : "Eskişehir Osmangazi University, Faculty of Engineering and Architecture, Department of Geological Engineering, Block M2 No: 206, Meşelik Campus, Eskişehir, Türkiye"}
                </p>
                <div className="ms-contact-links">
                  <span className="ms-badge ms-badge--neutral">
                    {lang === "tr" ? "Meşelik Kampüsü, M2 Blok" : "Meşelik Campus, Block M2"}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Telefon Kartı */}
            <Reveal as="div" className="ms-card ms-contact-card" delay={160}>
              <div className="ms-card-body">
                <div className="ms-contact-icon-wrap">
                  <ContactIcon name="phone" />
                </div>
                <h3 className="ms-card-title">
                  {lang === "tr" ? "Telefon" : "Phone"}
                </h3>
                <p className="ms-card-text">
                  {lang === "tr"
                    ? "Bölüm santrali ve dahili hat üzerinden mesai saatleri içerisinde ulaşabilirsiniz."
                    : "Reach out via university central exchange and department extension during work hours."}
                </p>
                <div className="ms-contact-links">
                  <a href="tel:+9002222393750" className="ms-contact-link ms-contact-phone">
                    +90 0222 239 3750
                  </a>
                  <span className="ms-contact-ext">
                    {lang === "tr" ? "Dahili: 3405" : "Extension: 3405"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. INSTITUTIONAL CALLOUT ── */}
      <section className="ms-section ms-section--gray ms-contact-inst-section">
        <div className="ms-container">
          <div className="ms-card ms-contact-inst-card">
            <div className="ms-card-body ms-contact-inst-body">
              <div className="ms-contact-inst-text">
                <span className="ms-eyebrow">
                  {lang === "tr" ? "Akademik Çatı" : "Academic Affiliation"}
                </span>
                <h2 className="ms-section-title">
                  {lang === "tr"
                    ? "Eskişehir Osmangazi Üniversitesi · Jeoloji Mühendisliği Bölümü"
                    : "Eskişehir Osmangazi University · Department of Geological Engineering"}
                </h2>
                <p className="ms-section-lead">
                  {lang === "tr"
                    ? "GeoKnow araştırma grubu ve paleontoloji laboratuvarı, mikrofosil ontolojisi ve dijital jeoloji karar destek sistemleri geliştirmeye devam etmektedir."
                    : "The GeoKnow research group and paleontology laboratory continue to advance microfossil ontology and digital geology decision-support systems."}
                </p>
              </div>
              <div className="ms-contact-inst-actions">
                <Link to="/hakkinda" className="ms-btn ms-btn--secondary">
                  {lang === "tr" ? "Proje Hakkında" : "About the Project"}
                </Link>
                <Link to="/haberler" className="ms-link">
                  {lang === "tr" ? "Saha haberlerini incele" : "Explore field news"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
