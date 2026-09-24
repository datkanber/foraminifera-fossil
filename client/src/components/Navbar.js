import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import logo from "../assets/images/logo.png";

import "../styles/components/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();

  // Handler to close the mobile menu on link click
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea' }}>
      <div className="navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 30px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* BRAND LOGO AREA */}
        <div className="navbar-brand">
          <Link to="/" onClick={handleLinkClick}>
            <img
              src={logo}
              alt="GeoKnow Logo"
              className="navbar-logo"
              style={{ height: "45px", objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
          style={{ zIndex: 1001 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAVIGATION LINKS */}
        <nav className={`navbar-menu ${isMenuOpen ? "navbar-menu-open" : ""}`} style={{ display: 'flex', gap: '28px', alignItems: 'center', zIndex: 1000 }}>
          <Link 
            to="/" 
            onClick={handleLinkClick} 
            style={{ textDecoration: 'none', fontSize: '15px', color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: location.pathname === '/' ? '600' : '500', transition: 'color 0.2s ease' }}
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/tani" 
            onClick={handleLinkClick} 
            style={{ textDecoration: 'none', fontSize: '15px', color: location.pathname === '/tani' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: location.pathname === '/tani' ? '600' : '500', transition: 'color 0.2s ease' }}
          >
            {t('nav.diagnose')}
          </Link>
          <Link 
            to="/vlm" 
            onClick={handleLinkClick} 
            style={{ textDecoration: 'none', fontSize: '15px', color: location.pathname === '/vlm' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: location.pathname === '/vlm' ? '600' : '500', transition: 'color 0.2s ease' }}
          >
            {t('nav.vlm')}
          </Link>
          <Link 
            to="/jeoloji" 
            onClick={handleLinkClick} 
            style={{ textDecoration: 'none', fontSize: '15px', color: location.pathname === '/jeoloji' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: location.pathname === '/jeoloji' ? '600' : '500', transition: 'color 0.2s ease' }}
          >
            {t('nav.geology')}
          </Link>
          <Link 
            to="/hakkinda" 
            onClick={handleLinkClick} 
            style={{ textDecoration: 'none', fontSize: '15px', color: location.pathname === '/hakkinda' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: location.pathname === '/hakkinda' ? '600' : '500', transition: 'color 0.2s ease' }}
          >
            {t('nav.about')}
          </Link>
          <Link 
            to="/iletisim" 
            onClick={handleLinkClick} 
            style={{ textDecoration: 'none', fontSize: '15px', color: location.pathname === '/iletisim' ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: location.pathname === '/iletisim' ? '600' : '500', transition: 'color 0.2s ease' }}
          >
            {t('nav.contact')}
          </Link>
          
          <button onClick={toggleLanguage} style={{ background: 'none', border: '1px solid var(--color-primary)', borderRadius: '4px', padding: '4px 8px', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}>
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;