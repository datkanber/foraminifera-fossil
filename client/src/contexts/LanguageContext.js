import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('foram_lang') || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('foram_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  // Basic dictionary for static strings
  const dict = {
    tr: {
      "app.title": "ForamID",
      "nav.home": "Ana Sayfa",
      "nav.diagnose": "Tanı Yap",
      "nav.fossils": "Fosiller",
      "nav.vlm": "Görsel YZ",
      "nav.about": "Hakkında",
      "nav.geology": "Jeoloji",
      "nav.contact": "İletişim",
      "mode.wizard.title": "Adım Adım Tanı",
      "mode.wizard.desc": "Karar ağacı üzerinden yönlendirilmiş soru-cevap",
      "mode.scoring.title": "Karakter Puanlama",
      "mode.scoring.desc": "Gözlemlediğiniz CHR karakterlerini girin, motor puanlasın",
      "fossils.title": "Tanı Destek Sistemi",
      "fossils.desc": "Mikroskop altında ince kesitte gözlemlediğiniz morfolojik özellikleri girerek olası cinsleri adım adım eleyebilirsiniz.",
      "btn.back": "← Mod Seç",
      "btn.reset": "↺ Yeniden Başla",
      "btn.skip": "Gözlenemiyor / Emin Değilim",
      "btn.score": "Puanla ve Tanı Yap",
      "btn.scoring": "Hesaplanıyor...",
      "status.confirmed": "TEYİT EDİLDİ",
      "status.probable": "MUHTEMEL",
      "status.candidate": "ADAY",
      "status.indeterminate": "BELİRSİZ",
      "status.nomatch": "EŞLEŞİLEMEDİ",
      "score.notobs": "GÖZLENEMİYOR",
      "score.obs_count": "Değerlendirilen gözlem",
      "score.ranking": "Sıralama (aktif adaylar)",
      "score.excluded": "Elenen cinsler",
      "warning.taxonomic": "Taksonomik inceleme gerekli",
      "warning.disclaimer": "Uyarı: Sonuçları kullanmadan önce daima doğrulayın. Bu bir eğitim ve karar-destek aracıdır, resmi bir taksonomik teşhis değildir."
    },
    en: {
      "app.title": "ForamID",
      "nav.home": "Home",
      "nav.diagnose": "Diagnose",
      "nav.fossils": "Fossils",
      "nav.vlm": "Visual AI",
      "nav.about": "About",
      "nav.geology": "Geology",
      "nav.contact": "Contact",
      "mode.wizard.title": "Step-by-Step Diagnosis",
      "mode.wizard.desc": "Guided Q&A via decision tree",
      "mode.scoring.title": "Character Scoring",
      "mode.scoring.desc": "Enter observed CHR characters, engine scores them",
      "fossils.title": "Diagnosis Support System",
      "fossils.desc": "Enter morphological features observed in thin section under microscope to eliminate candidate genera step by step.",
      "btn.back": "← Select Mode",
      "btn.reset": "↺ Restart",
      "btn.skip": "Not Observable / Not Sure",
      "btn.score": "Score and Diagnose",
      "btn.scoring": "Calculating...",
      "status.confirmed": "CONFIRMED",
      "status.probable": "PROBABLE",
      "status.candidate": "CANDIDATE",
      "status.indeterminate": "INDETERMINATE",
      "status.nomatch": "NO MATCH",
      "score.notobs": "NOT OBSERVABLE",
      "score.obs_count": "Evaluated observations",
      "score.ranking": "Ranking (active candidates)",
      "score.excluded": "Excluded genera",
      "warning.taxonomic": "Taxonomic review required",
      "warning.disclaimer": "Warning: Always verify results before use. This is an educational and decision-support tool, not an official taxonomic diagnosis."
    }
  };

  const t = (key) => {
    return dict[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
