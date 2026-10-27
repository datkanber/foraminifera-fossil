import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { eventPhotos, stoneDays, pressSources, projectParticipants } from '../data/news';
import '../styles/pages/news.css';

const copy = {
  tr: {
    pageTitle: 'Haberler ve Etkinlikler',
    date: '22–24 Ekim 2026',
    intro: 'Türkiye ve İspanya’dan eğitimciler, belediye temsilcileri ve araştırmacılar; taş mirası, dijital belgeleme ve jeoloji eğitimi için Eskişehir’de bir araya geldi.',
    host: 'Ev sahibi', hostName: 'Eskişehir Osmangazi Üniversitesi',
    venue: 'Çalışma alanı', venueName: 'Jeoloji Mühendisliği Bölümü, Tektonik Laboratuvarı',
    programme: 'Program', programmeName: 'Erasmus+ KA210-SCH · STONE',
    onPage: 'Bu sayfada', overview: 'Buluşma hakkında', day: 'Gün',
    partners: 'Proje ekipleri', press: 'İspanya basınında',
    aboutTitle: 'Taş mirası üzerinden ortak bir öğrenme deneyimi',
    about: 'ESOGÜ’nün ev sahipliğinde düzenlenen STONE Eskişehir Digital Geo Academy, dört kurumdan 14 katılımcıyı buluşturdu. Villamayor kumtaşı ve Ankara andezitinden yola çıkan program; laboratuvar çalışmalarını, tarihi çevre gözlemlerini ve dijital belgeleme uygulamalarını bir araya getirdi. Çalışmaların, projenin Dijital Taş El Kitabı ve sanal müze hedeflerine katkı sağlaması amaçlanıyor.',
    agenda: 'Programdan', localTimes: 'Saatler Türkiye yerel saatidir.',
    photos: 'Fotoğraflar', photoCount: 'fotoğraf',
    enlarge: 'Fotoğrafı büyüt', close: 'Kapat', previous: 'Önceki fotoğraf', next: 'Sonraki fotoğraf',
    gallery: 'STONE fotoğraf galerisi',
    partnersIntro: 'Üç günlük buluşmaya katılan Türkiye ve İspanya ekipleri.',
    pressIntro: '22–24 Ekim’deki Eskişehir buluşması, jeolojik mirasın korunması ve dijital teknolojilerin eğitimde kullanımıyla İspanya basınında yer aldı. ESOGÜ ekibinden Prof. Dr. Volkan Karabacak ve GeoKnow Direktörü Dr. Öğr. Üyesi Kübra Yayan’ın katkılarıyla yürütülen çalışmalar, Villamayor kumtaşı ile Ankara andezitini ortak bir eğitim çerçevesinde buluşturdu.',
    original: 'Haberi oku', newTab: 'Yeni sekmede açılır',
    nextMeeting: 'Sonraki buluşma: İspanya, mart ayı.',
  },
  en: {
    pageTitle: 'News & Events',
    date: '22–24 October 2026',
    intro: 'Educators, municipal representatives and researchers from Türkiye and Spain came together in Eskişehir for stone heritage, digital documentation and geology education.',
    host: 'Hosted by', hostName: 'Eskişehir Osmangazi University',
    venue: 'Training venue', venueName: 'Department of Geological Engineering, Tectonics Laboratory',
    programme: 'Programme', programmeName: 'Erasmus+ KA210-SCH · STONE',
    onPage: 'On this page', overview: 'About the meeting', day: 'Day',
    partners: 'Project teams', press: 'In the Spanish press',
    aboutTitle: 'Learning together through stone heritage',
    about: 'Hosted by ESOGÜ, the STONE Eskişehir Digital Geo Academy brought together 14 participants from four institutions. Starting with Villamayor sandstone and Ankara andesite, the programme connected laboratory activities, observations of historic places and digital documentation practice. This work is intended to support the project’s Digital Stone Handbook and virtual museum.',
    agenda: 'From the programme', localTimes: 'All times are local to Türkiye.',
    photos: 'Photographs', photoCount: 'photographs',
    enlarge: 'Enlarge photograph', close: 'Close', previous: 'Previous photograph', next: 'Next photograph',
    gallery: 'STONE photo gallery',
    partnersIntro: 'The teams from Türkiye and Spain who took part in the three-day meeting.',
    pressIntro: 'The Eskişehir meeting on 22–24 October was featured in the Spanish press for its work on geological heritage preservation and digital technologies in education. Contributions from ESOGÜ’s Prof. Dr. Volkan Karabacak and Asst. Prof. Dr. Kübra Yayan, Director of GeoKnow, helped connect Villamayor sandstone and Ankara andesite within a shared educational framework.',
    original: 'Read the article', newTab: 'Opens in a new tab',
    nextMeeting: 'Next meeting: Spain, in March.',
  },
};

function formatDate(date, lang) {
  return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function Photograph({ photo, lang, text, onOpen, cover = false }) {
  return (
    <figure className={`stone-photograph${cover ? ' stone-photograph--cover' : ''}`}>
      <button
        type="button"
        onClick={event => onOpen(photo.id, event.currentTarget)}
        aria-label={`${text.enlarge}: ${photo.caption[lang]}`}
      >
        <img
          src={photo.src}
          alt={photo.caption[lang]}
          width={photo.width}
          height={photo.height}
          loading={cover ? 'eager' : 'lazy'}
          fetchPriority={cover ? 'high' : undefined}
          decoding="async"
        />
      </button>
      <figcaption>{photo.caption[lang]}</figcaption>
    </figure>
  );
}

function PhotoViewer({ activeIndex, setActiveIndex, dialogRef, triggerRef, lang, text }) {
  const isOpen = activeIndex !== null;
  const photo = isOpen ? eventPhotos[activeIndex] : null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  function move(direction) {
    setActiveIndex(index => (index + direction + eventPhotos.length) % eventPhotos.length);
  }

  return (
    <dialog
      ref={dialogRef}
      className="stone-photo-viewer"
      aria-label={text.gallery}
      onClose={() => { setActiveIndex(null); triggerRef.current?.focus(); }}
      onClick={event => { if (event.target === event.currentTarget) dialogRef.current.close(); }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      }}
    >
      <div className="stone-viewer-content">
        <div className="stone-viewer-toolbar">
          <span aria-live="polite">{isOpen ? activeIndex + 1 : ''} / {eventPhotos.length}</span>
          <button type="button" onClick={() => dialogRef.current.close()} autoFocus>
            {text.close}<span aria-hidden="true">×</span>
          </button>
        </div>
        {photo && <img src={photo.src} alt={photo.caption[lang]} />}
        <div className="stone-viewer-footer">
          <p aria-live="polite">{photo?.caption[lang]}</p>
          <div className="stone-viewer-controls">
            <button type="button" onClick={() => move(-1)} aria-label={text.previous}>←</button>
            <button type="button" onClick={() => move(1)} aria-label={text.next}>→</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function DailyReport({ day, lang, text, onOpen }) {
  const photos = eventPhotos.filter(photo => photo.day === day.day && photo.id !== eventPhotos[0].id);

  return (
    <section className="stone-day stone-report-section" id={`day-${day.day}`} aria-labelledby={`day-${day.day}-title`}>
      <header className="stone-day-heading">
        <p>{text.day} {day.day}<span aria-hidden="true">/</span><time dateTime={day.date}>{formatDate(day.date, lang)}</time></p>
        <h2 id={`day-${day.day}-title`}>{day.title[lang]}</h2>
      </header>
      <div className="stone-day-content">
        <div className="stone-prose">
          {day.paragraphs[lang].map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <aside className="stone-agenda" aria-label={`${text.agenda} · ${text.day} ${day.day}`}>
          <h3>{text.agenda}</h3>
          <ol>
            {day.schedule.map(item => (
              <li key={item.time}>
                <span className="stone-agenda-time">{item.time}</span>
                <span>{item.label[lang]}</span>
                {item.lead && <small>{item.lead}</small>}
              </li>
            ))}
          </ol>
          <p>{text.localTimes}</p>
        </aside>
      </div>
      <p className="stone-day-focus">{day.focus[lang]}</p>
      {photos.length > 0 && (
        <div className="stone-day-photos">
          <div className="stone-gallery-heading">
            <h3>{text.photos}</h3>
            <span>{photos.length} {text.photoCount}</span>
          </div>
          <div className="stone-photo-grid">
            {photos.map(photo => <Photograph key={photo.id} photo={photo} lang={lang} text={text} onOpen={onOpen} />)}
          </div>
        </div>
      )}
      {day.day === 3 && <p className="stone-follow-up">{text.nextMeeting}</p>}
    </section>
  );
}

export default function News() {
  const { lang } = useLanguage();
  const text = copy[lang];
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `STONE Eskişehir · ${text.pageTitle} | GeoKnow`;
    return () => { document.title = previousTitle; };
  }, [text.pageTitle]);

  function openPhoto(id, trigger) {
    triggerRef.current = trigger;
    setActiveIndex(eventPhotos.findIndex(photo => photo.id === id));
    dialogRef.current.showModal();
  }

  return (
    <main className="news-page" lang={lang}>
      <div className="stone-page-label">
        <span>{text.pageTitle}</span>
        <span>GeoKnow · {text.hostName}</span>
      </div>

      <header className="stone-intro">
        <div className="stone-intro-copy">
          <p className="stone-event-date">Erasmus+ STONE<span aria-hidden="true">·</span>{text.date}</p>
          <h1>STONE Eskişehir<span>Digital Geo Academy</span></h1>
          <p className="stone-intro-summary">{text.intro}</p>
          <dl className="stone-event-details">
            <div><dt>{text.host}</dt><dd>{text.hostName}</dd></div>
            <div><dt>{text.venue}</dt><dd>{text.venueName}</dd></div>
            <div><dt>{text.programme}</dt><dd>{text.programmeName}</dd></div>
          </dl>
        </div>
        <Photograph photo={eventPhotos[0]} lang={lang} text={text} onOpen={openPhoto} cover />
      </header>

      <div className="stone-report-layout">
        <aside className="stone-report-sidebar">
          <nav aria-label={text.onPage}>
            <p>{text.onPage}</p>
            <a href="#about-meeting">{text.overview}</a>
            {stoneDays.map(day => <a href={`#day-${day.day}`} key={day.day}>{text.day} {day.day}<span>{day.title[lang]}</span></a>)}
            <a href="#project-teams">{text.partners}</a>
            <a href="#press-coverage">{text.press}</a>
          </nav>
          <p className="stone-project-reference">Erasmus+ KA210-SCH<br />KA210-SCH-CEAB2BDA</p>
        </aside>

        <div className="stone-report-body">
          <section id="about-meeting" className="stone-overview stone-report-section" aria-labelledby="stone-overview-title">
            <h2 id="stone-overview-title">{text.aboutTitle}</h2>
            <p>{text.about}</p>
          </section>

          {stoneDays.map(day => <DailyReport key={day.day} day={day} lang={lang} text={text} onOpen={openPhoto} />)}

          <section id="project-teams" className="stone-teams stone-report-section" aria-labelledby="stone-teams-title">
            <h2 id="stone-teams-title">{text.partners}</h2>
            <p>{text.partnersIntro}</p>
            <div className="stone-team-grid">
              {projectParticipants.map(group => (
                <section key={group.institution.en}>
                  <h3>{group.institution[lang]}</h3>
                  <p>{group.detail[lang]}</p>
                  <ul>{(Array.isArray(group.names) ? group.names : group.names[lang]).map(name => <li key={name}>{name}</li>)}</ul>
                </section>
              ))}
            </div>
          </section>

          <section id="press-coverage" className="stone-press stone-report-section" aria-labelledby="stone-press-title">
            <h2 id="stone-press-title">{text.press}</h2>
            <p>{text.pressIntro}</p>
            <div className="stone-press-links">
              {pressSources.map(source => (
                <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${source.name} · ${text.original} (${text.newTab})`}>
                  <span className="stone-press-meta">{source.name}<time dateTime={source.date}>{formatDate(source.date, lang)}</time></span>
                  <span className="stone-press-title" lang="es">{source.title}</span>
                  <span className="stone-press-action">{text.original}<span aria-hidden="true">↗</span></span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <PhotoViewer activeIndex={activeIndex} setActiveIndex={setActiveIndex} dialogRef={dialogRef} triggerRef={triggerRef} lang={lang} text={text} />
    </main>
  );
}
