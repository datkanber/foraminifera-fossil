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
      "warning.disclaimer": "Sonuçları kullanmadan önce daima doğrulayın. Bu bir eğitim ve karar-destek aracıdır, resmi bir taksonomik teşhis değildir.",
      "genus.found": "CİNS BULUNDU",
      "genus.closest": "En yakın karşılaştırmalar: ",
      "level.m": "ZORUNLU",
      "level.d": "TANISAL",
      "level.s": "DESTEKLEYİCİ",
      "level.c": "ÇELİŞEN",
      "taxon.profile": "Takson Profili",
      "taxon.nodata": "Veri mevcut değil",
      "taxon.yes": "Evet",
      "taxon.no": "Hayır",
      "taxon.nolocal": "Bu takson için yerel ortam kaydı bulunmuyor.",
      "footer.title": "Foraminifera Karar Destek Sistemi",
      "footer.uni": "Eskişehir Osmangazi Üniversitesi",
      "footer.lab": "GeoKnow Araştırma Grubu",
      "footer.rights": "Tüm hakları saklıdır.",
      "vlm.title": "VLM Gözlemcisi (AI)",
      "vlm.desc": "Google Gemini Vision destekli yapay zeka ile foraminifer mikrofosili görüntülerini analiz edin, morfolojik karakterleri otomatik çıkarın.",
      "vlm.upload": "Görüntü yüklemek için tıklayın veya sürükleyip bırakın",
      "vlm.formats": "Desteklenen formatlar: JPG, PNG, WEBP (Max 8MB)",
      "vlm.loc": "Lokasyon",
      "vlm.loc.ph": "Örn: Sivrihisar...",
      "vlm.age": "Jeolojik Yaş",
      "vlm.age.ph": "Örn: Eosen...",
      "vlm.optics": "Işıklandırma / Büyütme (Optics)",
      "vlm.optics.ph": "Örn: İnce kesit, yansıyan ışık...",
      "vlm.auto_score": "Analiz sonrası Karar Destek motorunu çalıştır (Skorlama)",
      "vlm.analyze_btn": "Görüntüyü Analiz Et",
      "vlm.results": "Analiz Sonuçları",
      "vlm.results.ph": "Yapay zeka çıkarımları burada görüntülenecektir.",
      "VALID_NO_MATCH": "Yeterli morfolojik bilgi mevcut ancak hiçbir çekirdek takson uyumlu değil. Bu geçerli bir sonuçtur; zorla tanı verilmez.",
      "INSUFFICIENT_OBSERVATIONS": "Güvenilir cins kararı için yetersiz tanı bilgisi.",
      "INSUFFICIENT_OBSERVATIONS_LEAD": "Güvenilir cins kararı için en az iki bilgilendirici (CHR_01 dışı zorunlu dahil) karakter gözlenmelidir.",
      "TIE_BREAK_FAILED": "İki veya daha fazla cins gözlenen karakterlerle ayrıştırılamıyor (beraberlik).",
      "MISSING_DIAGNOSTIC": "Kritik tanısal karakter(ler) bu kesitte gözlenemiyor.",
      "POOR_SEPARATION": "Liderin tanısal kanıtları rakibinden ayrışmıyor veya puan farkı yetersiz."
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
      "warning.disclaimer": "Always verify results before use. This is an educational and decision-support tool, not an official taxonomic diagnosis.",
      "genus.found": "GENUS FOUND",
      "genus.closest": "Closest comparisons: ",
      "level.m": "MANDATORY",
      "level.d": "DIAGNOSTIC",
      "level.s": "SUPPORTING",
      "level.c": "CONTRADICTORY",
      "taxon.profile": "Taxon Profile",
      "taxon.nodata": "No data available",
      "taxon.yes": "Yes",
      "taxon.no": "No",
      "taxon.nolocal": "No local environment record for this taxon.",
      "footer.title": "Foraminifera Decision Support System",
      "footer.uni": "Eskişehir Osmangazi University",
      "footer.lab": "GeoKnow Research Group",
      "footer.rights": "All rights reserved.",
      "vlm.title": "VLM Observer (AI)",
      "vlm.desc": "Analyze foraminifera microfossil images with Google Gemini Vision AI to automatically extract morphological characters.",
      "vlm.upload": "Click or drag and drop to upload an image",
      "vlm.formats": "Supported formats: JPG, PNG, WEBP (Max 8MB)",
      "vlm.loc": "Location",
      "vlm.loc.ph": "e.g. Sivrihisar...",
      "vlm.age": "Geological Age",
      "vlm.age.ph": "e.g. Eocene...",
      "vlm.optics": "Lighting / Optics",
      "vlm.optics.ph": "e.g. Thin section, reflected light...",
      "vlm.auto_score": "Run Decision Support engine after analysis (Scoring)",
      "vlm.analyze_btn": "Analyze Image",
      "vlm.results": "Analysis Results",
      "vlm.results.ph": "AI inferences will be displayed here.",
      "VALID_NO_MATCH": "Sufficient morphological data available but no core taxon is compatible. This is a valid result; do not force a diagnosis.",
      "INSUFFICIENT_OBSERVATIONS": "Insufficient diagnostic information for a reliable genus determination.",
      "INSUFFICIENT_OBSERVATIONS_LEAD": "At least two informative characters (including non-CHR_01 mandatory) must be observed for a reliable genus decision.",
      "TIE_BREAK_FAILED": "Two or more genera cannot be differentiated with the observed characters (tie).",
      "MISSING_DIAGNOSTIC": "Critical diagnostic character(s) cannot be observed in this section.",
      "POOR_SEPARATION": "The leader's diagnostic evidence does not separate from its rival or the score difference is insufficient."
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
