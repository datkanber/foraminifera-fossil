import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { validationRequest, studyPath } from './api';
import { TextField, SelectField, DeclarationFields, Check, useExpertText } from './Controls';
import ImageViewer from './ImageViewer';
export default function SpecimenForm({ study, specimen, record, data, setData, timer, setTimer, onError }) {
  const t = useExpertText(), { lang } = useLanguage();
  const [tick, setTick] = useState(Date.now()), [timerBusy, setTimerBusy] = useState(false);
  const readonly = record.status === 'FINAL' || study.phase !== 'SPECIMENS';
  const endpoint = `${studyPath(study.id)}/specimens/${specimen.id}/timer`;
  useEffect(() => {
    if (readonly || timer.runningAt == null) return undefined;
    const interval = setInterval(() => setTick(Date.now()), 1000);
    const heartbeat = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      validationRequest(endpoint, { method: 'POST', body: { action: 'heartbeat' } }).then(setTimer).catch(e => { onError(e.message); });
    }, 30_000);
    const pauseHidden = () => {
      if (document.visibilityState === 'hidden') validationRequest(endpoint, { method: 'POST', body: { action: 'pause' }, keepalive: true }).then(setTimer).catch(e => onError(e.message));
    };
    document.addEventListener('visibilitychange', pauseHidden);
    return () => { clearInterval(interval); clearInterval(heartbeat); document.removeEventListener('visibilitychange', pauseHidden); };
  }, [endpoint, readonly, timer.runningAt, setTimer, onError]);
  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const changeTimer = async action => {
    setTimerBusy(true);
    try { setTimer(await validationRequest(endpoint, { method: 'POST', body: { action } })); }
    catch (e) { onError(e.message); } finally { setTimerBusy(false); }
  };
  const seconds = Math.floor(((timer.activeMs || 0) + (timer.runningAt == null ? 0 : Math.max(0, Math.min(90_000, tick - timer.runningAt)))) / 1000);
  const observations = data.observations || {};
  const allComplete = study.characters.every(c => observations[c.id]?.state && (['UNCERTAIN', 'NOT_OBSERVABLE'].includes(observations[c.id].state) || observations[c.id].value));
  return <>
    <div className="ev-notice">{t('Kör gözlem: referans cinsi, diğer uzman yanıtları ve sistem tahminleri kapalıdır. CHR_21 yalnız kesit bağlamıdır.', 'Blinded observation: reference genus, other expert responses and system predictions are withheld. CHR_21 is section context only.')}</div>
    <p>{t('Atanan kesit yönü', 'Assigned section orientation')}: <strong>{specimen.orientation}</strong> · {t('Materyal', 'Material')}: {specimen.materialMode}</p>
    <ImageViewer studyId={study.id} specimen={specimen} />
    <div className="ev-timer"><strong>{t('Aktif gözlem', 'Active observation')}: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</strong>
      {!readonly && <button type="button" disabled={timerBusy} onClick={() => changeTimer(timer.runningAt != null ? 'pause' : timer.startedAt ? 'resume' : 'start')}>
        {timer.runningAt != null ? t('Mola', 'Pause') : timer.startedAt ? t('Devam et', 'Resume') : t('Gözleme başla', 'Start observation')}</button>}
      <small>{t('Sekme gizlendiğinde süre durur. Geri döndüğünüzde devam edin.', 'The timer pauses when the tab is hidden. Resume when you return.')}</small>
    </div>
    <fieldset disabled={readonly}><legend>{t('Görüntü / korunma kalitesi', 'Image / preservation quality')}</legend><div className="ev-grid">
      <SelectField label={t('Genel kalite', 'Overall quality')} value={data.quality} onChange={v => update('quality', v)} options={[[ 'GOOD', t('İyi', 'Good')], ['MODERATE', t('Orta', 'Moderate')], ['LOW', t('Düşük', 'Low')]]} />
      <TextField label={t('Kalite notu', 'Quality note')} value={data.qualityNote} onChange={v => update('qualityNote', v)} />
    </div></fieldset>
    <p>{t('NOT_OBSERVABLE ve UNCERTAIN yokluk değildir. Yokluğu gözlenen özellikte değer ABSENT/NONE ve durum PRESENT kullanılabilir; ABSENT durumu yalnız ABSENT/NONE değeriyle geçerlidir.', 'NOT_OBSERVABLE and UNCERTAIN do not mean absent. A clearly observed negative value may use ABSENT/NONE with PRESENT; the ABSENT state requires an ABSENT/NONE value.')}</p>
    <fieldset disabled={readonly}><legend>{t('21 morfolojik karakter', '21 morphological characters')}</legend>
      <div className="ev-table-wrap"><table className="ev-character-table"><thead><tr><th>{t('Karakter', 'Character')}</th><th>{t('Değer kodu', 'Controlled value')}</th><th>{t('Gözlem durumu', 'Observation state')}</th><th>{t('Görsel gerekçe / not', 'Visual justification / comment')}</th></tr></thead>
        <tbody>{study.characters.map(c => {
          const o = observations[c.id] || { value: '', state: '', comment: '' };
          const values = c.values.filter(v => !['NOT_OBSERVABLE', 'UNCERTAIN'].includes(v));
          const change = (field, value) => update('observations', { ...observations, [c.id]: { ...o, [field]: value } });
          return <tr key={c.id}><th scope="row"><code>{c.id}</code><br />{c[`name_${lang}`] || c.name_en}{c.id === 'CHR_21' && <small>{t('Yalnız bağlam', 'Context only')}</small>}</th>
            <td><select aria-label={`${c.id} ${t('değer', 'value')}`} value={o.value || ''} onChange={e => change('value', e.target.value || null)}><option value="">—</option>
              {values.map(v => <option key={v} value={v}>{c[`value_labels_${lang}`]?.[v] || v} [{v}]</option>)}</select></td>
            <td><select aria-label={`${c.id} ${t('durum', 'state')}`} value={o.state || ''} onChange={e => change('state', e.target.value)}>
              <option value="">{t('Seçiniz', 'Select')}</option>
              {[['PRESENT', t('Güvenle gözlendi', 'Clearly observed')], ['ABSENT', t('Açıkça yok', 'Clearly absent')], ['NOT_OBSERVABLE', t('Gözlenemiyor', 'Not observable')], ['UNCERTAIN', t('Emin değilim', 'Uncertain')]].map(([v, label]) => <option key={v} value={v}>{label} [{v}]</option>)}
            </select></td><td><textarea rows={2} aria-label={`${c.id} ${t('not', 'comment')}`} value={o.comment || ''} onChange={e => change('comment', e.target.value)} maxLength={2000} /></td></tr>;
        })}</tbody></table></div>
    </fieldset>
    <fieldset disabled={readonly || !allComplete}><legend>{t('Karakterler tamamlandıktan sonra — isteğe bağlı', 'After all characters are recorded — optional')}</legend>
      {!allComplete && <p>{t('Önce 21 karakterin gözlem durumunu kaydedin.', 'Record the observation state for all 21 characters first.')}</p>}
      <div className="ev-grid"><TextField label={t('Bağımsız cins tahmini', 'Independent genus identification')} value={data.independentGenus} onChange={v => update('independentGenus', v)} />
        <TextField label={t('Alternatif cinsler', 'Alternative genera')} value={data.alternativeGenera} onChange={v => update('alternativeGenera', v)} />
        <SelectField label={t('Öznel kanaat (yazılım güven sınıfı değildir)', 'Subjective confidence (separate from engine states)')} value={data.subjectiveConfidence} onChange={v => update('subjectiveConfidence', v)} options={[[ 'HIGH', t('Yüksek', 'High')], ['MODERATE', t('Orta', 'Moderate')], ['LOW', t('Düşük', 'Low')]]} /></div>
      <Check checked={data.unidentified} onChange={v => update('unidentified', v)}>{t('Cins belirlenemedi / kapsam dışı olabilir', 'Genus unidentified / may be out of scope')}</Check>
    </fieldset>
    <fieldset disabled={readonly}><legend>{t('Form geri bildirimi', 'Form feedback')}</legend><TextField label={t('Terim, görünürlük veya kullanım notu', 'Terminology, visibility or usability note')} value={data.feedback} onChange={v => update('feedback', v)} multiline /></fieldset>
    <DeclarationFields kind="specimens" data={data.declarations} onChange={v => update('declarations', v)} disabled={readonly} />
  </>;
}
