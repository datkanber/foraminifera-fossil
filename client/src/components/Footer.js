import React from "react";
import logo from "../assets/images/logo.png";
import { useLanguage } from "../contexts/LanguageContext";

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer" style={{ backgroundColor: 'var(--color-sap-bg)', borderTop: '1px solid var(--color-border)', padding: '32px 40px 24px', marginTop: 'auto', color: 'var(--color-text)' }}>
      <div className="footer-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* TOP ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div className="footer-brand">
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--color-primary)' }}>
              {t("footer.title")}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              {t("footer.uni")}
            </p>
          </div>
          
          <div className="footer-logo-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)' }}>
              {t("footer.lab")}
            </span>
            <img 
              src={logo} 
              alt="GeoKnow Logo" 
              style={{ height: '36px', objectFit: 'contain' }} 
            />
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} {t("footer.rights")}
          </span>
          <strong style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>
            {t("warning.disclaimer")}
          </strong>
        </div>

      </div>
    </footer>
  );
}

export default Footer;