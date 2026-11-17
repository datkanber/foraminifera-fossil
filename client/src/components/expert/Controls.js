import { useLanguage } from '../../contexts/LanguageContext';
export function useExpertText() {
  const { lang } = useLanguage();
  return (tr, en) => lang === 'tr' ? tr : en;
}
export function Field({ label, children, hint }) {
  return <label className="ev-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}
export function TextField({ label, value, onChange, multiline = false, ...props }) {
  const control = { value: value || '', onChange: e => onChange(e.target.value), ...props };
  return <Field label={label}>{multiline ? <textarea rows={3} {...control} /> : <input {...control} />}</Field>;
}
export function SelectField({ label, value, onChange, options, required = false, disabled = false }) {
  const t = useExpertText();
  return <Field label={label}><select aria-label={label} value={value || ''} onChange={e => onChange(e.target.value)} required={required} disabled={disabled}>
    <option value="">{t('Seçiniz', 'Select')}</option>{options.map(o => <option key={Array.isArray(o) ? o[0] : o} value={Array.isArray(o) ? o[0] : o}>{Array.isArray(o) ? o[1] : o}</option>)}
  </select></Field>;
}
export function Check({ children, checked, onChange, disabled = false }) {
  return <label className="ev-check"><input type="checkbox" checked={Boolean(checked)} onChange={e => onChange(e.target.checked)} disabled={disabled} /><span>{children}</span></label>;
}
export function DeclarationFields({ kind, data, onChange, disabled }) {
  const t = useExpertText();
  const rows = kind === 'specimens' ? [
    ['reference_label_hidden', t('Referans cinsini görmedim.', 'I have not seen the reference genus.')],
    ['other_observer_hidden', t('Diğer uzmanın formunu görmedim.', 'I have not seen the other expert’s form.')],
    ['system_outputs_hidden', t('Sistem veya VLM/AI tahminlerini görmedim.', 'I have not seen system or VLM/AI predictions.')],
    ['independent_completion', t('Gözlemleri kendim, bağımsız tamamladım.', 'I completed these observations independently, without AI.')]
  ] : [
    ['other_observer_hidden', t('Diğer uzmanın yanıtlarını görmedim.', 'I have not seen the other expert’s responses.')],
    ['version_recorded', t('İncelenen sürüm ve kural listesi kayıtlı.', 'The reviewed version and rule list are recorded.')],
    ['scientific_judgment', t('Gerekçeler kendi bilimsel kanaatimi yansıtır.', 'The reasons reflect my own scientific judgment.')]
  ];
  return <fieldset className="ev-declarations" disabled={disabled}><legend>{t('Bağımsızlık ve dijital onay', 'Independence and digital confirmation')}</legend>
    {rows.map(([key, label]) => <Check key={key} checked={data?.[key]} onChange={value => onChange({ ...data, [key]: value })}>{label}</Check>)}
  </fieldset>;
}
export function FormDownloads({ base }) {
  const t = useExpertText();
  return <div className="ev-actions"><a href={`${base}/export?format=json`}>JSON</a><a href={`${base}/export?format=csv`}>CSV</a>
    <a href={`${base}/export?format=print`} target="_blank" rel="noreferrer">{t('Yazdır / PDF kaydet', 'Print / Save PDF')}</a></div>;
}
