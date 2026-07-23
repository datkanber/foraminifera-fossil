import "../styles/pages/about.css";

function About() {
  return (
    <section id="about" className="about-page">
      <div className="about-content">
        <h2>Veriseti ve Proje Hakkında</h2>
        <p>
          Bu platform, Paleosen–Eosen büyük bentik foraminiferleri için ortak bir tanımlama ontolojisi geliştirmek amacıyla hazırlanmıştır. 
          Sistemdeki veriseti; 7 pilot taksonun (<em>Karsella hottingeri, Pseudolacazina oeztemueri vb.</em>) tanımlarından özenle çıkarılmış morfolojik 
          ve ölçülebilir karakterler analiz edilerek <strong>tamamen tarafımızdan (paleontolojik uzmanlık ile) özgün olarak</strong> oluşturulmuştur. 
          Daha önce yapılmamış detaylı bir ontolojik sınıflama modeli sunmaktadır.
        </p>
        <p>
          Bu sistem kesin tür tayini yapan otomatik bir yapı olarak değil, paleontoloğun tanı sürecini destekleyen bir <strong>Karar Destek Modeli</strong> olarak çalışır. 
          Adayları daraltır, karakter eşleşmelerini ve kaynaklarını göstererek tanı sürecinize hız ve doğruluk kazandırır.
        </p>
      </div>
    </section>
  );
}

export default About;
