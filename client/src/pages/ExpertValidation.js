import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { validationRequest, setValidationCsrf, studyPath } from '../components/expert/api';
import { TextField, SelectField, useExpertText } from '../components/expert/Controls';
import CoordinatorPanel, { CreateStudy } from '../components/expert/CoordinatorPanel';
import ExpertWorkspace from '../components/expert/ExpertWorkspace';
import '../styles/pages/expert-validation.css';

export default function ExpertValidation() {
  const t = useExpertText(), { lang, toggleLanguage } = useLanguage();
  const [session, setSession] = useState(null), [ready, setReady] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [invitation] = useState(() => { const value = new URLSearchParams(window.location.hash.slice(1)).get('invite'); if (value) window.history.replaceState(null, '', window.location.pathname); return value; });
  const [login, setLogin] = useState(''), [password, setPassword] = useState(''), [studies, setStudies] = useState([]), [studyId, setStudyId] = useState(''), [study, setStudy] = useState(null), [creating, setCreating] = useState(false);
  const handleError = useCallback(message => setError(message), []);
  const loadList = useCallback(async () => { const list = await validationRequest('/studies'); setStudies(list); return list; }, []);
  const reload = useCallback(async () => { if (studyId) setStudy(await validationRequest(studyPath(studyId))); }, [studyId]);
  useEffect(() => {
    let active = true;
    validationRequest('/auth/session').then(s => { if (active) { setSession(s); setValidationCsrf(s.csrf); } }).catch(e => { if (active && e.status !== 401) setError(e.message); }).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!session) return;
    loadList().then(list => { if (session.user.role === 'EXPERT') setStudyId(session.user.studyId); else if (list.length) setStudyId(list[0].id); }).catch(e => setError(e.message));
  }, [session, loadList]);
  useEffect(() => { setStudy(null); if (studyId) reload().catch(e => setError(e.message)); }, [studyId, reload]);
  const signIn = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try { const s = await validationRequest(invitation ? '/auth/redeem' : '/auth/login', { method: 'POST', body: invitation ? { token: invitation, password } : { login, password } }); setValidationCsrf(s.csrf); setSession(s); setPassword(''); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const signOut = async () => {
    setBusy(true);
    try { await validationRequest('/auth/logout', { method: 'POST' }); setValidationCsrf(''); setSession(null); setStudy(null); setStudyId(''); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const phases = { PREPARATION: t('Hazırlık', 'Preparation'), SPECIMENS: t('1 · Kör gözlem', '1 · Blinded observations'), RULES: t('2 · Kural incelemesi', '2 · Rule review'), LOCKED: t('3 · Veri kilitli', '3 · Data locked') };
  return <main className="ev-page">
    <header className="ev-header"><a className="ev-brand" href="/">GeoKnow<span>{t('Bağımsız uzman doğrulaması', 'Independent expert validation')}</span></a><div className="ev-actions"><Link to="/uzman-rehberi" target="_blank" rel="noreferrer">{t('Uzman rehberi', 'Expert guide')}</Link><button type="button" onClick={toggleLanguage}>{lang === 'tr' ? 'English' : 'Türkçe'}</button>{session && <><span>{session.user.code}</span><button type="button" disabled={busy} onClick={signOut}>{t('Çıkış', 'Sign out')}</button></>}</div></header>
    <div className="ev-content"><p className="ev-eyebrow">{t('ÖZEL ARAŞTIRMA ALANI', 'PRIVATE RESEARCH WORKSPACE')}</p><h1>{t('Bağımsız uzman değerlendirmesi', 'Independent expert validation')}</h1>
      <p className="ev-intro">{t('Önce fosilleri bağımsız gözlemleyin. Ardından ontoloji ve kural kartlarını değerlendirin.', 'Observe the specimens independently first. Then review the ontology and rule cards.')}</p>
      {error && <div className="ev-error" role="alert"><span>{error}</span><button type="button" onClick={() => setError('')} aria-label={t('Mesajı kapat', 'Dismiss message')}>×</button></div>}
      {!ready ? <p role="status">{t('Oturum kontrol ediliyor…', 'Checking session…')}</p> : !session ? <form className="ev-login ev-panel" onSubmit={signIn}>
        <h2>{invitation ? t('Uzman davetini kabul et', 'Accept expert invitation') : t('Güvenli giriş', 'Secure sign-in')}</h2>
        <p>{invitation ? t('Kendi parolanızı belirleyin. Davet yalnız bir kez kullanılabilir.', 'Choose your own password. This invitation can be used once.') : t('Koordinatörün davet bağlantısını kullanın veya mevcut hesabınızla giriş yapın.', 'Use your coordinator’s invitation link or sign in to your existing account.')}</p>
        {!invitation && <TextField label={t('Hesap adı', 'Account login')} value={login} onChange={setLogin} autoComplete="username" required />}
        <TextField label={invitation ? t('Yeni parola (en az 12 karakter)', 'New password (at least 12 characters)') : t('Parola', 'Password')} value={password} onChange={setPassword} type="password" autoComplete={invitation ? 'new-password' : 'current-password'} minLength={invitation ? 12 : undefined} maxLength={200} required />
        <button className="ev-primary" disabled={busy}>{busy ? t('İşleniyor…', 'Working…') : invitation ? t('Hesabı etkinleştir', 'Activate account') : t('Giriş yap', 'Sign in')}</button>
      </form> : <>
        {session.user.login && <div className="ev-notice">{t('Sonraki girişleriniz için hesap adınız', 'Your login for future visits')}: <strong>{session.user.login}</strong></div>}
        {session.user.role === 'EXPERT' && <p>{t('Hesap adınız', 'Your login')}: <code>{session.user.studyId}.{session.user.code.toLowerCase()}</code></p>}
        {session.user.role === 'COORDINATOR' && <div className="ev-study-bar"><SelectField label={t('Çalışma', 'Study')} value={studyId} onChange={v => { setCreating(false); setStudyId(v); setError(''); }} options={studies.map(s => [s.id, `${s.title} · ${s.cohort} · ${s.phase}`])} />
          <button type="button" onClick={() => setCreating(c => !c)}>{creating ? t('Kapat', 'Close') : t('Yeni çalışma', 'New study')}</button></div>}
        {creating && session.user.role === 'COORDINATOR' && <CreateStudy onError={handleError} onCreated={async id => { await loadList(); setCreating(false); setStudyId(id); }} />}
        {studyId && !study ? <p role="status">{t('Çalışma yükleniyor…', 'Loading study…')}</p> : study && <>
          <div className="ev-study-heading"><div><h2>{study.title}</h2><small>{study.cohort} · {study.version.softwareVersion} · {study.id}</small></div><span className="ev-status">{phases[study.phase]}</span><button type="button" onClick={() => reload().catch(e => setError(e.message))}>{t('Durumu yenile', 'Refresh status')}</button></div>
          {study.purpose === 'SOFTWARE_TEST' && <div className="ev-error">{t('YAZILIM TESTİ — gerçek bilimsel sonuç değildir.', 'SOFTWARE TEST — not human research results.')}</div>}
          {session.user.role === 'COORDINATOR' ? <CoordinatorPanel key={study.id} study={study} reload={async () => { await reload(); await loadList(); }} onError={handleError} /> : <ExpertWorkspace study={study} reload={reload} onError={handleError} />}
        </>}
        {!studyId && !creating && <div className="ev-empty">{t('Henüz atanmış çalışma yok.', 'No study has been assigned yet.')}</div>}
      </>}
    </div><footer className="ev-footer">GeoKnow · {t('Ham uzman yanıtları ayrı saklanır. Analiz yalnız veri kilidinden sonra açılır.', 'Original expert responses are retained separately. Analysis opens only after data lock.')}</footer>
  </main>;
}
