import { useState } from "react";

import logo from "../assets/images/logo.png";

import "../styles/components/navbar.css";

function Navbar() {
  // -jr Mobile navigation open/close state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // -jr Changes the mobile menu visibility
  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <a className="navbar-brand" href="/" aria-label="GeoKnow Home">
          <img className="navbar-logo" src={logo} alt="GeoKnow" />
        </a>

        <button
          className="navbar-toggle"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar-menu ${isMenuOpen ? "navbar-menu-open" : ""}`}>
          <a href="/">Home</a>
          <a href="#about">About</a>
          <a href="#geology">Geology</a>
          <a href="#fossils">Fossils</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
