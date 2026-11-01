import "../styles/pages/home.css";
import { Link } from "react-router-dom";
import { dayTwoPhotos } from "../data/fieldPhotos";
import workshopPhoto from "../assets/photos/1792745417607.jpg";
import collectionPhoto from "../assets/photos/1792745403944.jpg";
import { useLanguage } from "../contexts/LanguageContext";
import foram1 from "../assets/images/foram1.jpg";
import foram2 from "../assets/images/foram2.jpg";
import foram3 from "../assets/images/foram3.jpg";

const galleryPhotos = [
  ...dayTwoPhotos.filter(photo => ['20261023_145547', '20261023_150127'].includes(photo.id)).map(photo => ({ ...photo, href: '/haberler#day-2' })),
  {
    id: 'workshop', src: workshopPhoto, width: 1152, height: 1536, href: '/haberler#day-1',
    caption: { tr: 'Laboratuvarda bilgi paylaşımı', en: 'Sharing knowledge in the laboratory' },
  },
  {
    id: 'collections', src: collectionPhoto, width: 1152, height: 1536, href: '/haberler#day-1',
    caption: { tr: 'Jeoloji koleksiyonlarının ziyareti', en: 'Visiting the geological collections' },
  },
];

function Home() {
  const { lang } = useLanguage();
  return (
    <main className="home-page" lang={lang}>
      <div className="home-content">
        <h1 className="home-title" id="home-title">{lang === 'tr' ? "Foraminifera ve Jeoloji" : "Foraminifera and Geology"}</h1>

        <section className="home-event" aria-labelledby="home-event-title">
          <div className="home-event-gallery">
            {galleryPhotos.map((photo, index) => (
              <figure key={photo.id}>
                <Link to={photo.href}>
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(max-width: 900px) 50vw, 30vw"
                    alt={photo.caption[lang]}
                    width={photo.width}
                    height={photo.height}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    decoding="async"
                  />
                </Link>
                <figcaption>{photo.caption[lang]}</figcaption>
              </figure>
            ))}
          </div>
          <div className="home-event-copy">
            <h2 id="home-event-title">STONE Eskişehir Digital Geo Academy</h2>
            <p className="home-event-date">{lang === 'tr' ? '22–24 Ekim 2026' : '22–24 October 2026'} · Erasmus+ STONE</p>
            <p>
              {lang === 'tr'
                ? 'Türkiye ve İspanya’dan eğitimciler ve araştırmacılar ESOGÜ’de bir araya geldi. Laboratuvar çalışmaları ve Yazılıkaya saha gezisinden fotoğrafları inceleyebilirsiniz.'
                : 'Educators and researchers from Türkiye and Spain came together at ESOGÜ. Explore photographs from the laboratory activities and the field visit to Yazılıkaya.'}
            </p>
            <Link className="home-news-link" to="/haberler">
              {lang === 'tr' ? 'Tüm haberler ve fotoğraflar' : 'All news and photographs'} →
            </Link>
          </div>
        </section>


      {/* ── HERO SECTION ── */}
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-content">
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
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="home-information" id="about">

        <article className="information-panel">
          <div className="panel-icon">
            <img src={foram1} alt="" />
          </div>
          <h2>{lang === 'tr' ? "Foraminifera Nedir?" : "What are Foraminifera?"}</h2>
          <p>
            {lang === 'tr'
              ? "Foraminiferler, farklı şekillere, loca dizilimlerine ve duvar yapılarına sahip olabilen kabuklu mikroorganizmalardır. Bu özellikler biyolojik ve jeolojik sınıflandırma için oldukça faydalıdır."
              : "Foraminifera are microorganisms with shells that may have different shapes, chamber arrangements, and wall structures. These characteristics are useful for biological and geological classification."}
          </p>
        </article>

        <article className="information-panel" id="geology">
          <div className="panel-icon">
            <img src={foram2} alt="" />
          </div>
          <h2>{lang === 'tr' ? "Jeolojik Önemi" : "Geological Importance"}</h2>
          <p>
            {lang === 'tr'
              ? "Fosil foraminiferler, biyostratigrafi ve paleo-ortamsal yorumlama için kullanılır. Kayaç ve tortul örneklerindeki varlıkları, jeolojik zaman ve çökel ortamları hakkında bilgi sağlayabilir."
              : "Fossil foraminifera are used in biostratigraphy and paleoenvironmental interpretation. Their occurrence in rock and sediment samples can provide information about geological time and depositional environments."}
          </p>
        </article>

        <article className="information-panel" id="fossils">
          <div className="panel-icon">
            <img src={foram3} alt="" />
          </div>
          <h2>{lang === 'tr' ? "Fosil Verileri" : "Fossil Data"}</h2>
          <p>
            {lang === 'tr'
              ? "Fosil kayıtları; taksonomi, jeolojik yaş, örnek derinliği, morfoloji, loca sayısı, kabuk tipi ve bentik veya planktonik habitat gibi ekolojik bilgileri içerebilir."
              : "Fossil records may include taxonomy, geological age, sample depth, morphology, chamber count, shell type, and ecological information such as benthic or planktonic habitat."}
          </p>
        </article>

      </section>

      </div>
    </main>
  );
}

export default Home;
