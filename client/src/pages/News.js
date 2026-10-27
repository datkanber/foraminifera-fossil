import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { newsArticles, newsPhotos, pressSources, projectParticipants } from '../data/news';
import '../styles/pages/news.css';

const copy = {
  tr: {
    eyebrow: 'GEOKNOW’DAN HABERLER', title: 'Bilimden sahaya,', titleAccent: 'bizden haberler.',
    intro: 'Birlikte öğreniyor, keşfediyor ve jeolojik mirası geleceğe taşıyoruz. Araştırma grubumuzun etkinlikleri, buluşmaları ve ortak çalışmalarından notlar.',
    all: 'Tümü', event: 'Etkinlikler', press: 'Basında biz', filter: 'Haber kategorileri',
    featured: 'ÖNE ÇIKAN', read: 'Haberin devamı', day: 'Gün', location: 'Eskişehir, Türkiye',
    project: 'Erasmus+ STONE', programme: '22–24 Ekim 2026', partnership: 'Türkiye × İspanya',
    pressEyebrow: 'SINIRLARI AŞAN İŞ BİRLİĞİ', pressTitle: 'İspanya basınında STONE',
    pressIntro: 'Jeolojik miras ve dijital eğitim etrafındaki ortak çalışmalarımız İspanya basınında da yer buldu.',
    source: 'Haberi kaynağında oku', galleryEyebrow: 'BULUŞMADAN KARELER', galleryTitle: 'Birlikte keşfettik, birlikte öğrendik.',
    galleryIntro: 'Eskişehir’de bilim, kültür ve teknolojiyle geçen üç günden hatıralar.',
    enlarge: 'Fotoğrafı büyüt', close: 'Fotoğrafı kapat', previous: 'Önceki fotoğraf', next: 'Sonraki fotoğraf',
    back: 'Tüm haberlere dön', participants: 'Bu buluşmanın insanları', partners: 'PROJE EKİPLERİ',
    related: 'Keşfetmeye devam edin', articlePhotos: 'Haberden kareler', photos: 'Fotoğraf galerisi',
    upcoming: 'Bir sonraki durak: İspanya', upcomingText: 'Mart ayında bilim ve kültürel miras etrafında yeniden buluşmak üzere.',
    results: 'haber gösteriliyor', sourceNote: 'İlgili basın haberi', newTab: '(yeni sekmede açılır)',
  },
  en: {
    eyebrow: 'THE GEOKNOW JOURNAL', title: 'From science to the field,', titleAccent: 'stories worth sharing.',
    intro: 'Learning together, exploring together, and bringing geological heritage into the future. Notes from our research group’s activities, meetings and collaborations.',
    all: 'All stories', event: 'Events', press: 'In the press', filter: 'News categories',
    featured: 'FEATURED STORY', read: 'Read the story', day: 'Day', location: 'Eskişehir, Türkiye',
    project: 'Erasmus+ STONE', programme: '22–24 October 2026', partnership: 'Türkiye × Spain',
    pressEyebrow: 'COLLABORATION BEYOND BORDERS', pressTitle: 'STONE in the Spanish press',
    pressIntro: 'Our shared work on geological heritage and digital education is reaching audiences in Spain.',
    source: 'Read the original article', galleryEyebrow: 'MOMENTS FROM OUR MEETING', galleryTitle: 'Shared discoveries. Shared experiences.',
    galleryIntro: 'Memories from three days of science, culture and technology in Eskişehir.',
    enlarge: 'Enlarge photo', close: 'Close photo', previous: 'Previous photo', next: 'Next photo',
    back: 'Back to all stories', participants: 'The people behind the meeting', partners: 'PROJECT TEAMS',
    related: 'Keep exploring', articlePhotos: 'Moments from the story', photos: 'Photo gallery',
    upcoming: 'Next stop: Spain', upcomingText: 'Meeting again in March through science and cultural heritage.',
    results: 'stories shown', sourceNote: 'Related press coverage', newTab: '(opens in a new tab)',
  },
};

function Arrow({ external = false, ...props }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...props}>
      {external ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

function ArticleMeta({ article, lang, text }) {
  return (
    <div className="news-meta">
      <time dateTime={article.date}>
        {new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${article.date}T12:00:00Z`))}
      </time>
      <span aria-hidden="true">·</span>
      <span>{article.day ? `${text.project} / ${text.day} ${article.day}` : text.press}</span>
    </div>
  );
}

function PhotoGallery({ photoIds, lang, text, compact = false }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const activePhoto = activeIndex === null ? null : newsPhotos[photoIds[activeIndex]];

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeIndex]);

  function openPhoto(index, event) {
    triggerRef.current = event.currentTarget;
    setActiveIndex(index);
    dialogRef.current.showModal();
  }

  function movePhoto(direction) {
    setActiveIndex(index => (index + direction + photoIds.length) % photoIds.length);
  }

  return (
    <>
      <div className={`news-gallery ${compact ? 'news-gallery--compact' : ''}`}>
        {photoIds.map((id, index) => (
          <button key={id} type="button" className="news-gallery-photo" onClick={event => openPhoto(index, event)} aria-label={`${text.enlarge}: ${newsPhotos[id].caption[lang]}`}>
            <img src={newsPhotos[id].src} alt={newsPhotos[id].caption[lang]} loading="lazy" decoding="async" width="640" height="480" />
            <span className="news-gallery-caption">{newsPhotos[id].caption[lang]} <span aria-hidden="true">↗</span></span>
            <span className="news-gallery-expand" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <dialog
        className="news-lightbox"
        ref={dialogRef}
        aria-label={text.photos}
        onClose={() => { setActiveIndex(null); triggerRef.current?.focus(); }}
        onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}
        onKeyDown={event => {
          if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
        }}
      >
        <div className="news-lightbox-content">
          <button type="button" className="news-lightbox-close" aria-label={text.close} onClick={() => dialogRef.current.close()} autoFocus>×</button>
          {activePhoto && <img src={activePhoto.src} alt={activePhoto.caption[lang]} />}
          <div className="news-lightbox-bottom">
            <p aria-live="polite">{activePhoto?.caption[lang]} <span>{activeIndex === null ? '' : activeIndex + 1} / {photoIds.length}</span></p>
            {photoIds.length > 1 && <div className="news-lightbox-controls">
              <button type="button" onClick={() => movePhoto(-1)} aria-label={text.previous}>←</button>
              <button type="button" onClick={() => movePhoto(1)} aria-label={text.next}>→</button>
            </div>}
          </div>
        </div>
      </dialog>
    </>
  );
}

function PressLinks({ text }) {
  return (
    <div className="news-press-links">
      {pressSources.map((source, index) => (
        <a href={source.url} key={source.name} target="_blank" rel="noopener noreferrer" className="news-press-link">
          <span className="news-press-number">0{index + 1}</span>
          <span className="news-press-name">{source.name}<small>{source.title || text.source}</small></span>
          <Arrow external />
          <span className="news-sr-only">{text.newTab}</span>
        </a>
      ))}
    </div>
  );
}

function StoryCard({ article, lang, text }) {
  return (
    <article className="news-card">
      <Link to={`/haberler/${article.slug}`} className="news-card-photo" tabIndex={-1} aria-hidden="true">
        <img src={newsPhotos[article.photo].src} alt="" loading="lazy" decoding="async" width="640" height="480" />
        <span className="news-photo-label">{article.category === 'press' ? text.press : `${text.day} ${article.day}`}</span>
      </Link>
      <div className="news-card-body">
        <ArticleMeta article={article} lang={lang} text={text} />
        <h3><Link to={`/haberler/${article.slug}`}>{article.title[lang]}</Link></h3>
        <p>{article.summary[lang]}</p>
        <Link to={`/haberler/${article.slug}`} className="news-text-link" aria-label={`${text.read}: ${article.title[lang]}`}>{text.read}<Arrow /></Link>
      </div>
    </article>
  );
}

function NewsIndex({ lang, text, filter, setFilter }) {
  const filtered = newsArticles.filter(article => filter === 'all' || article.category === filter);
  const [featured, ...otherArticles] = filtered;
  return (
    <>
      <header className="news-heading">
        <p className="news-eyebrow"><span />{text.eyebrow}</p>
        <h1>{text.title}<br /><span>{text.titleAccent}</span></h1>
        <p className="news-intro">{text.intro}</p>
        <div className="news-heading-note"><span>GeoKnow</span><span>SCIENCE · HERITAGE · CONNECTIONS</span></div>
      </header>

      <div className="news-filter-row">
        <div className="news-filters" role="group" aria-label={text.filter}>
          {['all', 'event', 'press'].map(category => (
            <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>
              {text[category]}<span>{category === 'all' ? newsArticles.length : newsArticles.filter(article => article.category === category).length}</span>
            </button>
          ))}
        </div>
        <span className="news-result-count" role="status">{filtered.length} {text.results}</span>
      </div>

      <section className="news-stories" aria-label={text.all}>
        <article className="news-featured">
          <Link to={`/haberler/${featured.slug}`} className="news-featured-photo" tabIndex={-1} aria-hidden="true">
            <img src={newsPhotos[featured.photo].src} alt="" width="900" height="675" fetchPriority="high" />
            <span className="news-featured-marker">{text.featured}</span>
            <span className="news-featured-location"><span aria-hidden="true">◎</span> {text.location}</span>
          </Link>
          <div className="news-featured-body">
            <ArticleMeta article={featured} lang={lang} text={text} />
            <h2><Link to={`/haberler/${featured.slug}`}>{featured.title[lang]}</Link></h2>
            <p>{featured.summary[lang]}</p>
            <Link className="news-button" to={`/haberler/${featured.slug}`}>{text.read}<Arrow /></Link>
            <span className="news-featured-credit">GeoKnow <span aria-hidden="true">/</span> {text.project}</span>
          </div>
        </article>
        <div className="news-project-strip"><span>{text.project}</span><span>{text.programme}</span><span>{text.partnership}</span></div>
        {otherArticles.length > 0 && <div className="news-card-grid">{otherArticles.map(article => <StoryCard key={article.slug} article={article} lang={lang} text={text} />)}</div>}
      </section>

      {filter !== 'event' && <section className="news-press" aria-labelledby="news-press-title">
        <div><p className="news-eyebrow">{text.pressEyebrow}</p><h2 id="news-press-title">{text.pressTitle}</h2><p>{text.pressIntro}</p></div>
        <PressLinks text={text} />
      </section>}

      <section className="news-gallery-section" aria-labelledby="news-gallery-title">
        <p className="news-eyebrow">{text.galleryEyebrow}</p>
        <div className="news-section-heading"><h2 id="news-gallery-title">{text.galleryTitle}</h2><p>{text.galleryIntro}</p></div>
        <PhotoGallery photoIds={['welcome', 'vr', 'odunpazari', 'specimens', 'heritage', 'sazova']} lang={lang} text={text} />
      </section>

      <aside className="news-next-stop"><span className="news-next-symbol" aria-hidden="true">↗</span><div><span className="news-eyebrow">STONE · TÜRKİYE × {lang === 'tr' ? 'İSPANYA' : 'SPAIN'}</span><h2>{text.upcoming}</h2><p>{text.upcomingText}</p></div><span className="news-next-march">{lang === 'tr' ? 'MART' : 'MARCH'}</span></aside>
    </>
  );
}

function NewsArticle({ article, lang, text }) {
  return (
    <>
      <Link to="/haberler" className="news-back-link"><span aria-hidden="true">←</span>{text.back}</Link>
      <article className="news-article">
        <header className="news-article-heading">
          <p className="news-eyebrow">{text.project} <span aria-hidden="true">/</span> {article.category === 'press' ? text.press : `${text.day} ${article.day}`}</p>
          <h1>{article.title[lang]}</h1>
          <p className="news-article-lead">{article.summary[lang]}</p>
          <ArticleMeta article={article} lang={lang} text={text} />
        </header>
        <figure className="news-article-cover"><img src={newsPhotos[article.photo].src} alt={newsPhotos[article.photo].caption[lang]} width="1200" height="900" /><figcaption>{newsPhotos[article.photo].caption[lang]}</figcaption></figure>
        <div className="news-article-layout">
          <div className="news-article-copy">
            {article.sections.map(section => <section key={section.title.en}><h2>{section.title[lang]}</h2><p>{section.text[lang]}</p></section>)}
            {article.source && <a className="news-text-link news-article-source" href={article.source.url} target="_blank" rel="noopener noreferrer">{text.sourceNote}: {article.source.name}<Arrow external /><span className="news-sr-only">{text.newTab}</span></a>}
          </div>
          <aside className="news-article-aside"><span className="news-eyebrow">ERASMUS+</span><h2>STONE</h2><p>{lang === 'tr' ? 'Jeoloji, eğitim ve kültürel mirası buluşturan uluslararası iş birliği.' : 'An international collaboration connecting geology, education and cultural heritage.'}</p><dl><dt>{lang === 'tr' ? 'Buluşma' : 'Meeting'}</dt><dd>{text.programme}</dd><dt>{lang === 'tr' ? 'Ev sahibi' : 'Host'}</dt><dd>{lang === 'tr' ? 'Eskişehir Osmangazi Üniversitesi' : 'Eskişehir Osmangazi University'}</dd><dt>{lang === 'tr' ? 'Ortaklık' : 'Partnership'}</dt><dd>{text.partnership}</dd></dl></aside>
        </div>

        {article.category === 'press' && <section className="news-article-press"><h2>{text.pressTitle}</h2><PressLinks text={text} /></section>}
        {article.showParticipants && <section className="news-participants"><p className="news-eyebrow">{text.partners}</p><h2>{text.participants}</h2><div className="news-participant-grid">{projectParticipants.map(group => <div key={group.institution.en}><span>{group.country[lang]}</span><h3>{group.institution[lang]}</h3><ul>{group.names.map(name => <li key={name}>{name}</li>)}</ul></div>)}</div></section>}
        <section className="news-article-gallery"><h2>{text.articlePhotos}</h2><PhotoGallery key={article.slug} photoIds={article.gallery} lang={lang} text={text} compact /></section>
      </article>
      <section className="news-related"><h2>{text.related}</h2><div className="news-card-grid">{newsArticles.filter(item => item.slug !== article.slug).slice(0, 3).map(item => <StoryCard key={item.slug} article={item} lang={lang} text={text} />)}</div></section>
    </>
  );
}

export default function News() {
  const { lang } = useLanguage();
  const { slug } = useParams();
  const [filter, setFilter] = useState('all');
  const text = copy[lang];
  const article = slug ? newsArticles.find(item => item.slug === slug) : null;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [slug]);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${article ? article.title[lang] : (lang === 'tr' ? 'Haberler ve Etkinlikler' : 'News & Events')} | GeoKnow`;
    return () => { document.title = previousTitle; };
  }, [article, lang]);

  if (slug && !article) return <Navigate to="/haberler" replace />;
  return <main className="news-page" lang={lang}>{article ? <NewsArticle article={article} lang={lang} text={text} /> : <NewsIndex lang={lang} text={text} filter={filter} setFilter={setFilter} />}</main>;
}
