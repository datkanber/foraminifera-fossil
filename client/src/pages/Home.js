import "../styles/pages/home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-introduction">
        <h1>Foraminifera and Geology</h1>

        <p>
          Foraminifera are microscopic single-celled organisms that live
          mainly in marine environments. Their shells, known as tests, are
          commonly preserved in sediment and the fossil record.
        </p>

        <p>
          Geologists and paleontologists study foraminifera to investigate
          geological age, ancient marine environments, water depth, and
          changes in Earth's climate.
        </p>
      </section>

      <section className="home-information" id="about">
        <article className="information-panel">
          <h2>What are Foraminifera?</h2>

          <p>
            Foraminifera are microorganisms with shells that may have
            different shapes, chamber arrangements, and wall structures.
            These characteristics are useful for biological and geological
            classification.
          </p>
        </article>

        <article className="information-panel" id="geology">
          <h2>Geological Importance</h2>

          <p>
            Fossil foraminifera are used in biostratigraphy and
            paleoenvironmental interpretation. Their occurrence in rock and
            sediment samples can provide information about geological time
            and depositional environments.
          </p>
        </article>

        <article className="information-panel" id="fossils">
          <h2>Fossil Data</h2>

          <p>
            Fossil records may include taxonomy, geological age, sample
            depth, morphology, chamber count, shell type, and ecological
            information such as benthic or planktonic habitat.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Home;