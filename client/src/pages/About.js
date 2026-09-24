import "../styles/pages/about.css";
import { useLanguage } from "../contexts/LanguageContext";

function About() {
  const { lang } = useLanguage();
  return (
    <section id="about" className="about-page">
      <div className="about-content">
        <h2>{lang === 'tr' ? "Veriseti ve Proje Hakkında" : "About the Dataset & Project"}</h2>
        <p>
          {lang === 'tr' ? (
            <>
              Bu platform, Paleosen–Eosen büyük bentik foraminiferleri için ortak bir tanımlama ontolojisi geliştirmek amacıyla hazırlanmıştır. 
              Sistemdeki veriseti; 7 pilot taksonun (<em>Karsella hottingeri, Pseudolacazina oeztemueri vb.</em>) tanımlarından özenle çıkarılmış morfolojik 
              ve ölçülebilir karakterler analiz edilerek <strong>tamamen tarafımızdan (paleontolojik uzmanlık ile) özgün olarak</strong> oluşturulmuştur. 
              Daha önce yapılmamış detaylı bir ontolojik sınıflama modeli sunmaktadır.
            </>
          ) : (
            <>
              This platform was created to develop a common identification ontology for Paleocene-Eocene larger benthic foraminifera. 
              The dataset in the system was originally created <strong>entirely by us (with paleontological expertise)</strong> by analyzing the morphological 
              and measurable characters meticulously extracted from the definitions of 7 pilot taxa (<em>Karsella hottingeri, Pseudolacazina oeztemueri, etc.</em>). 
              It provides a detailed ontological classification model that has not been done before.
            </>
          )}
        </p>
        <p>
          {lang === 'tr' ? (
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
    </section>
  );
}

export default About;
