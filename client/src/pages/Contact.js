import React from 'react';
import '../styles/pages/contact.css';
import { useLanguage } from '../contexts/LanguageContext';

function Contact() {
  const { lang } = useLanguage();
  return (
    <section className="contact-page">
      <div className="contact-container">
        <h2>{lang === 'tr' ? "İletişim" : "Contact"}</h2>
        <div className="contact-details">
          <p><strong>{lang === 'tr' ? "E-posta" : "Email"} (1):</strong> kokur@ogu.edu.tr</p>
          <p><strong>{lang === 'tr' ? "E-posta" : "Email"} (2):</strong> kubrayayan6@gmail.com</p>
          <p><strong>{lang === 'tr' ? "Adres" : "Address"}:</strong> {lang === 'tr' ? "Eskişehir Osmangazi Üniversitesi, MMF, Jeoloji Mühendisliği Bölümü M2 Blok no:206" : "Eskişehir Osmangazi University, Engineering and Architecture Faculty, Department of Geological Engineering, Block M2 No:206"}</p>
          <p><strong>{lang === 'tr' ? "Telefon" : "Phone"}:</strong> +90 0222 239 3750 Dahili (Extension): 3405</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
