import "../styles/components/footer.css";

function Footer() {
  // -jr Keeps the copyright year current automatically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-summary">
          <strong>Foraminifera Fossil</strong>

          <p>
            A simple geological information platform for studying
            foraminifera, fossil records, and sample data.
          </p>
        </div>

        <nav
          className="footer-links"
          aria-label="Footer navigation"
        >
          <a href="/">Home</a>
          <a href="#about">About</a>
          <a href="#geology">Geology</a>
          <a href="#fossils">Fossils</a>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>
          © {currentYear} Foraminifera Fossil. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;