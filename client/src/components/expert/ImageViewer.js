import { useEffect, useRef, useState } from 'react';
import { VALIDATION_API, studyPath } from './api';
import { useExpertText } from './Controls';
export default function ImageViewer({ studyId, specimen }) {
  const t = useExpertText();
  const [view, setView] = useState(0), [zoom, setZoom] = useState(1), [offset, setOffset] = useState({ x: 0, y: 0 });
  const [failed, setFailed] = useState(false), drag = useRef(null);
  useEffect(() => { setView(0); setZoom(1); setOffset({ x: 0, y: 0 }); }, [specimen.id]);
  useEffect(() => { setZoom(1); setOffset({ x: 0, y: 0 }); setFailed(false); }, [view]);
  const image = specimen.images[view];
  if (!image) return <div className="ev-notice">{t('Kodlanmış fiziksel ince kesiti inceleyin.', 'Examine the assigned coded physical thin section.')}</div>;
  return <section className="ev-viewer" aria-label={t('İnce kesit görüntüleyici', 'Thin-section image viewer')}>
    <div className="ev-view-controls"><label>{t('Görünüm', 'View')} <select value={view} onChange={e => setView(Number(e.target.value))}>
      {specimen.images.map((v, i) => <option key={v.id} value={i}>{i + 1} / {specimen.images.length}</option>)}</select></label>
      <button type="button" onClick={() => setZoom(z => Math.max(1, z - .5))} aria-label={t('Uzaklaştır', 'Zoom out')}>−</button>
      <output>{Math.round(zoom * 100)}%</output><button type="button" onClick={() => setZoom(z => Math.min(8, z + .5))} aria-label={t('Yakınlaştır', 'Zoom in')}>+</button>
      <button type="button" onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}>{t('Sıfırla', 'Reset')}</button>
    </div>
    <div className="ev-image-stage" tabIndex={0} role="group" aria-label={t('Kaydırmak için sürükleyin veya ok tuşlarını kullanın', 'Drag or use arrow keys to pan')}
      onPointerDown={e => { drag.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={e => { if (drag.current) setOffset({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }); }}
      onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
      onKeyDown={e => { const directions = { ArrowLeft: [30, 0], ArrowRight: [-30, 0], ArrowUp: [0, 30], ArrowDown: [0, -30] }; if (directions[e.key]) { e.preventDefault(); const [x, y] = directions[e.key]; setOffset(o => ({ x: o.x + x, y: o.y + y })); } }}>
      {failed ? <p role="alert">{t('Görüntü yüklenemedi. Oturumunuzu kontrol edip sayfayı yenileyin.', 'Image failed to load. Check your session and reload.')}</p> :
        <img draggable={false} alt={`${specimen.id} — ${t('görünüm', 'view')} ${view + 1}`} onError={() => setFailed(true)}
          src={`${VALIDATION_API}${studyPath(studyId)}/specimens/${specimen.id}/images/${image.id}`}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }} />}
    </div><small>{t('Sürükleyerek veya ok tuşlarıyla kaydırın.', 'Drag or use arrow keys to pan.')} · SHA-256: <code>{image.sha256}</code></small>
  </section>;
}
