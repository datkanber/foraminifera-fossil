import "../styles/pages/home.css";
import { useLanguage } from "../contexts/LanguageContext";

function Home() {
  const { lang } = useLanguage();
  return (
    <main className="home-page">
      <section className="home-introduction">
        <h1>{lang === 'tr' ? "Foraminifera ve Jeoloji" : "Foraminifera and Geology"}</h1>

        <p>
          {lang === 'tr' 
            ? "Foraminiferler, temel olarak deniz ortamlarında yaşayan mikroskobik tek hücreli organizmalardır. Kavkı olarak bilinen kabukları, tortullarda ve fosil kayıtlarında yaygın olarak korunur." 
            : "Foraminifera are microscopic single-celled organisms that live mainly in marine environments. Their shells, known as tests, are commonly preserved in sediment and the fossil record."}
        </p>

        <p>
          {lang === 'tr' 
            ? "Jeologlar ve paleontologlar, jeolojik yaşı, eski deniz ortamlarını, su derinliğini ve Dünya'nın iklimindeki değişiklikleri araştırmak için foraminiferleri incelerler." 
            : "Geologists and paleontologists study foraminifera to investigate geological age, ancient marine environments, water depth, and changes in Earth's climate."}
        </p>
      </section>

      <section className="home-information" id="about">
        <article className="information-panel">
          <h2>{lang === 'tr' ? "Foraminifera Nedir?" : "What are Foraminifera?"}</h2>

          <p>
            {lang === 'tr' 
              ? "Foraminiferler, farklı şekillere, loca dizilimlerine ve duvar yapılarına sahip olabilen kabuklu mikroorganizmalardır. Bu özellikler biyolojik ve jeolojik sınıflandırma için oldukça faydalıdır." 
              : "Foraminifera are microorganisms with shells that may have different shapes, chamber arrangements, and wall structures. These characteristics are useful for biological and geological classification."}
          </p>
        </article>

        <article className="information-panel" id="geology">
          <h2>{lang === 'tr' ? "Jeolojik Önemi" : "Geological Importance"}</h2>

          <p>
            {lang === 'tr' 
              ? "Fosil foraminiferler, biyostratigrafi ve paleo-ortamsal yorumlama için kullanılır. Kayaç ve tortul örneklerindeki varlıkları, jeolojik zaman ve çökel ortamları hakkında bilgi sağlayabilir." 
              : "Fossil foraminifera are used in biostratigraphy and paleoenvironmental interpretation. Their occurrence in rock and sediment samples can provide information about geological time and depositional environments."}
          </p>
        </article>

        <article className="information-panel" id="fossils">
          <h2>{lang === 'tr' ? "Fosil Verileri" : "Fossil Data"}</h2>

          <p>
            {lang === 'tr' 
              ? "Fosil kayıtları; taksonomi, jeolojik yaş, örnek derinliği, morfoloji, loca sayısı, kabuk tipi ve bentik veya planktonik habitat gibi ekolojik bilgileri içerebilir." 
              : "Fossil records may include taxonomy, geological age, sample depth, morphology, chamber count, shell type, and ecological information such as benthic or planktonic habitat."}
          </p>
        </article>
      </section>
    </main>
  );
}

export default Home;