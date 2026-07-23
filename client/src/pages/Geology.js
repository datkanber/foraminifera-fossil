import "../styles/pages/geology.css";

function Geology() {
  return (
    <section id="geology" className="geology-page">
      <div className="geology-content">
        <h2>Jeolojik Bağlam</h2>
        <p>
          Mevcut ontoloji, büyük bentik foraminiferler için önemli evrimsel aşamaları temsil eden <strong>Paleosen</strong> ve <strong>Eosen</strong> dönemlerine odaklanmaktadır.
        </p>
        
        <div className="geology-grid">
          <div className="geology-card">
            <h3>Tanesiyen (Thanetian)</h3>
            <p>Geç Paleosen katı. Karmaşık formların ilk radyasyonu ve spesifik fauna toplulukları ile karakterizedir.</p>
          </div>
          <div className="geology-card">
            <h3>İlerdiyen (Ilerdian)</h3>
            <p>Tethys bölgesinde önemli bir Erken Eosen katı. <em>Alveolina</em> gibi taksonların hızlı çeşitlenmesine tanık olmuştur.</p>
          </div>
          <div className="geology-card">
            <h3>Küiziyen (Cuisian)</h3>
            <p>Kavkı morfolojisi ve ekolojik adaptasyonlarda daha ileri uzmanlaşmaların görüldüğü Geç Erken Eosen katı.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Geology;
