import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { validationRequest, VALIDATION_API, studyPath } from './api';
import { FormDownloads, useExpertText } from './Controls';
import SpecimenForm from './SpecimenForm';
import RuleForm, { RuleSummary } from './RuleForm';
export default function ExpertWorkspace({ study, reload, onError }) {
  const t = useExpertText(), location = useLocation();
  const kind = location.pathname.endsWith('/rules') ? 'rules' : 'specimens';
  const [subject, setSubject] = useState(''), [record, setRecord] = useState(null), [data, setData] = useState({});
  const [timer, setTimer] = useState({ activeMs: 0, runningAt: null }), [busy, setBusy] = useState(false), [dirty, setDirty] = useState(false), [confirmSubmit, setConfirmSubmit] = useState(false);
  const canA = ['RULES', 'LOCKED'].includes(study.phase) && study.bComplete;
  const assignments = kind === 'specimens' ? study.specimens.map(p => ({ id: p.id, label: p.id, status: p.status })) :
    [...study.rules.map(r => ({ id: r.rule_key, label: `${r.rule_key} · ${r.genus} (${r.level})`, status: study.ownForms.find(f => f.kind === 'rules' && f.subject === r.rule_key)?.status || 'EMPTY' })),
      { id: 'review', label: t('İnceleme sonuç özeti ve kapanış', 'Review summary and closure'), status: study.ownForms.find(f => f.kind === 'summary')?.status || 'EMPTY' }];
  const actualKind = kind === 'rules' && subject === 'review' ? 'summary' : kind;
  const path = `${studyPath(study.id)}/forms/${actualKind}/${encodeURIComponent(subject)}`;
  useEffect(() => { setSubject(''); setRecord(null); setDirty(false); setConfirmSubmit(false); }, [kind, study.id]);
  useEffect(() => {
    if (!subject) return undefined;
    let cancelled = false;
    setRecord(null); setConfirmSubmit(false);
    validationRequest(path).then(f => { if (!cancelled) { setRecord(f); setData(f.data); setTimer(f.timer); setDirty(false); } }).catch(e => { if (!cancelled) onError(e.message); });
    return () => { cancelled = true; };
  }, [path, subject, onError]);
  useEffect(() => {
    const handler = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler); return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
  const updateData = useCallback(change => { setData(change); setDirty(true); setConfirmSubmit(false); }, []);
  const pause = () => {
    if (kind === 'specimens' && subject && timer.runningAt != null) validationRequest(`${studyPath(study.id)}/specimens/${subject}/timer`, { method: 'POST', body: { action: 'pause' }, keepalive: true }).catch(e => onError(e.message));
  };
  const save = async submit => {
    setBusy(true); onError('');
    try {
      const payload = actualKind === 'specimens' ? { ...data, materialMode: study.specimens.find(p => p.id === subject).materialMode, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } : data;
      const f = await validationRequest(path, { method: 'PUT', body: { revision: record.revision, data: payload, submit } });
      setRecord(f); setData(f.data); setTimer(f.timer); setDirty(false); setConfirmSubmit(false); await reload();
    } catch (e) { onError(e.message); } finally { setBusy(false); }
  };
  const readonly = record?.status === 'FINAL' || study.phase === 'LOCKED';
  const completed = assignments.filter(a => a.status === 'FINAL').length;
  return <>
    <nav className="ev-tabs" aria-label={t('Değerlendirme formları', 'Evaluation forms')}>
      <Link to="/expert-validation/specimens" aria-current={kind === 'specimens' ? 'page' : undefined} onClick={e => { if (dirty && !window.confirm(t('Kaydedilmemiş değişiklikler var. Ayrılmak istiyor musunuz?', 'You have unsaved changes. Leave this form?'))) e.preventDefault(); else pause(); }}>{t('1. Form B · Kör fosil gözlemi', '1. Form B · Blinded specimens')}</Link>
      {canA ? <Link to="/expert-validation/rules" aria-current={kind === 'rules' ? 'page' : undefined} onClick={e => { if (dirty && !window.confirm(t('Kaydedilmemiş değişiklikler var. Ayrılmak istiyor musunuz?', 'You have unsaved changes. Leave this form?'))) e.preventDefault(); else pause(); }}>{t('2. Form A · Kural incelemesi', '2. Form A · Rule review')}</Link> : <span>{t('2. Form A · Kilitli', '2. Form A · Locked')}</span>}
    </nav>
    {study.phase === 'PREPARATION' ? <div className="ev-notice">{t('Koordinatör materyali ve atamaları hazırlıyor. Değerlendirme henüz açılmadı.', 'The coordinator is preparing material and assignments. Evaluation has not opened.')}</div> : kind === 'rules' && !canA ?
      <div className="ev-notice">{t('Form A için iki uzmanın da tüm Form B kayıtlarını göndermesi ve koordinatörün sonraki aşamayı açması gerekir.', 'Form A opens after both experts submit all Form B records and the coordinator advances the study.')}</div> : <>
        <div className="ev-assignment-bar"><label>{t('Atanan değerlendirme', 'Assigned evaluation')}<select value={subject} onChange={e => {
          if (dirty && !window.confirm(t('Kaydedilmemiş değişiklikler var. Ayrılmak istiyor musunuz?', 'You have unsaved changes. Leave this form?'))) return;
          pause(); setSubject(e.target.value);
        }}><option value="">{t('Bir kayıt seçin', 'Select a record')}</option>{assignments.map(a => <option key={a.id} value={a.id}>{a.label} · {a.status}</option>)}</select></label>
          <span>{completed} / {assignments.length} {t('gönderildi', 'submitted')}</span><progress value={completed} max={assignments.length || 1} /></div>
        {!subject ? <div className="ev-empty">{t('Başlamak veya taslağınıza devam etmek için atanmış bir kayıt seçin.', 'Select an assignment to begin or resume your saved draft.')}</div> : !record ? <p role="status">{t('Form yükleniyor…', 'Loading form…')}</p> : <section className="ev-form" aria-busy={busy}>
          <div className="ev-form-heading"><h2>{actualKind === 'specimens' ? 'Form B' : 'Form A'} · {subject}</h2><span className="ev-status">{record.status}</span></div>
          {readonly && <div className="ev-notice">{t('Kesin gönderim kilitli. Yanıtlarınız salt okunur.', 'Final submission is locked. Your responses are read-only.')} {record.submittedAt && new Date(record.submittedAt).toLocaleString()}</div>}
          {actualKind === 'specimens' ? <SpecimenForm study={study} specimen={study.specimens.find(p => p.id === subject)} record={record} data={data} setData={updateData} timer={timer} setTimer={setTimer} onError={onError} /> :
            actualKind === 'summary' ? <RuleSummary study={study} data={data} setData={updateData} readonly={readonly} /> : <RuleForm card={study.rules.find(r => r.rule_key === subject)} data={data} setData={updateData} readonly={readonly} reviewMode={study.ruleReviewMode} proposals={(study.aiProposals || []).filter(p => p.ruleId === subject)} />}
          <div className="ev-save-bar">{record.status === 'FINAL' ? <FormDownloads base={`${VALIDATION_API}${path}`} /> : <>
            <button type="button" disabled={busy} onClick={() => save(false)}>{busy ? t('Kaydediliyor…', 'Saving…') : t('Taslağı kaydet', 'Save draft')}</button>
            <span role="status">{dirty ? t('Kaydedilmemiş değişiklikler', 'Unsaved changes') : record.savedAt ? `${t('Kaydedildi', 'Saved')}: ${new Date(record.savedAt).toLocaleTimeString()}` : ''}</span>
            <button className="ev-primary" type="button" disabled={busy} onClick={() => setConfirmSubmit(true)}>{t('Değerlendirmeyi gönder', 'Submit evaluation')}</button>
          </>}</div>
          {confirmSubmit && !readonly && <div className="ev-confirm" role="group" aria-label={t('Kesin gönderim onayı', 'Final submission confirmation')}><p>{t('Bu işlem yanıtlarınızı kilitler. Beyanlarınız ve uzman kodunuz dijital onay olarak kaydedilir.', 'This action locks your responses. Your declarations and expert code are recorded as digital confirmation.')}</p>
            <button className="ev-primary" type="button" disabled={busy} onClick={() => save(true)}>{t('Onaylıyorum, kesin gönder', 'Confirm final submission')}</button><button type="button" onClick={() => setConfirmSubmit(false)}>{t('Düzenlemeye dön', 'Continue editing')}</button></div>}
        </section>}
      </>}
  </>;
}
