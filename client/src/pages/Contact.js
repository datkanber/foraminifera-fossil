import React from 'react';
import '../styles/pages/contact.css';

function Contact() {
  return (
    <section className="contact-page">
      <div className="contact-container">
        <h2>İletişim</h2>
        <div className="contact-details">
          <p><strong>E-posta (1):</strong> kokur@ogu.edu.tr</p>
          <p><strong>E-posta (2):</strong> kubrayayan6@gmail.com</p>
          <p><strong>Adres:</strong> Eskişehir Osmangazi Üniversitesi, MMF, Jeoloji Mühendisliği Bölümü M2 Blok no:206</p>
          <p><strong>Telefon:</strong> +90 0222 239 3750 Dahili (Extension): 3405</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
