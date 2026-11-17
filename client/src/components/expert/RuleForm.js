import { TextField, SelectField, DeclarationFields, Check, useExpertText } from './Controls';
export default function RuleForm({ card, data, setData, readonly, reviewMode = 'INDEPENDENT', proposals = [] }) {
  const t = useExpertText();
  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  return <>
    {reviewMode === 'AI_ASSISTED' && <section className="ev-notice"><strong>AI_ASSISTED_REVIEW</strong><p>{t('Aşağıdakiler doğrulanmamış AI önerileridir. Kendi kararınızı ve kanıtınızı ayrı alanlara yazın. Bu inceleme bağımsız kör insan kanıtı sayılmaz.', 'The following are unverified AI proposals. Enter your own decision and evidence separately. This review is not independent blinded human evidence.')}</p>
      {proposals.map(p => <details key={p.id}><summary>{p.profileId} · {p.draftHash.slice(0, 12)}</summary><p>{p.reasoning}</p><pre>{JSON.stringify(p.assessment, null, 2)}</pre><p>{p.sources}</p><p>{p.limitations}</p><small>{p.provenance.modelConfiguration} · {p.provenance.generatedAt}</small></details>)}
    </section>}
    <article className="ev-rule-card"><div className="ev-eyebrow">{card.rule_key} · {card.level} · {card.module}</div><h3><i>{card.genus}</i></h3><p>{card.text}</p>
      <p>{t('Mevcut eşleme', 'Existing mapping')}: {card.mappings.length ? card.mappings.map(m => `${m.chr_id} = ${m.value} (${m.confidence || '—'})`).join('; ') : t('Eşlenmemiş', 'Unmapped')}</p>
      <p>{t('Eşleme durumu', 'Mapping status')}: {card.status || '—'} · {t('Eşleşme biçimi', 'Match mode')}: {card.match_mode || 'ALL'}</p>
      {(card.references || card.curation || card.audit_flags) && <details><summary>{t('Mevcut kaynak ve kürasyon bilgisi', 'Existing references and curation')}</summary><pre>{JSON.stringify({ references: card.references, curation: card.curation, audit_flags: card.audit_flags }, null, 2)}</pre></details>}
    </article>
    <fieldset disabled={readonly}><legend>{t('Bağımsız kural değerlendirmesi', 'Independent rule review')}</legend><div className="ev-grid">
      <SelectField label={t('Taksonomik karar', 'Taxonomic decision')} value={data.decision} onChange={v => update('decision', v)} options={[[ 'APPROVE', t('Onayla', 'Approve')], ['CORRECT', t('Düzelt', 'Correct')], ['REJECT', t('Reddet', 'Reject')], ['UNABLE', t('Değerlendirilemedi', 'Unable to assess')]]} />
      <SelectField label={t('Kanıt sınıflaması', 'Evidence classification')} value={data.evidence} onChange={v => update('evidence', v)} options={[[ 'APPROPRIATE', t('Uygun', 'Appropriate')], ['CHANGE', t('Değişmeli', 'Requires change')]]} />
      <SelectField label={t('Karakter eşlemesi', 'Character mapping')} value={data.mapping} onChange={v => update('mapping', v)} options={[[ 'CORRECT', t('Doğru', 'Correct')], ['INCORRECT', t('Yanlış', 'Incorrect')], ['MISSING', t('Eksik', 'Missing')]]} />
      <SelectField label={t('Literatür dayanağı', 'Literature support')} value={data.literatureStrength} onChange={v => update('literatureStrength', v)} options={[[ 'STRONG', t('Güçlü', 'Strong')], ['PARTIAL', t('Kısmi', 'Partial')], ['MISSING', t('Eksik', 'Missing')]]} />
    </div>
      <TextField label={t('Beklenen görünürlük koşulu', 'Expected visibility conditions')} value={data.visibilityCondition} onChange={v => update('visibilityCondition', v)} multiline />
      <div className="ev-grid"><SelectField label={t('Sorun tipi', 'Problem type')} value={data.problemType} onChange={v => update('problemType', v)} options={[[ 'TAXONOMY', t('Taksonomik anlam', 'Taxonomic meaning')], ['EVIDENCE', t('Kanıt düzeyi', 'Evidence level')], ['MISSING_CHARACTER', t('Eksik karakter/değer', 'Missing character/value')], ['MAPPING', t('Yanlış eşleme', 'Incorrect mapping')], ['AMBIGUOUS', t('Muğlak terim', 'Ambiguous term')], ['OTHER', t('Başka', 'Other')]]} />
        <SelectField label={t('Beklenen etki', 'Expected effect')} value={data.expectedEffect} onChange={v => update('expectedEffect', v)} options={[[ 'KEEP', t('Kuralı koru', 'Keep rule')], ['CHANGE_SCORING', t('Puanlamayı değiştir', 'Change scoring')], ['HINT_ONLY', t('Yalnız ipucu', 'Hint only')], ['NEW_CHARACTER', t('Ek karakter gerekir', 'Additional character needed')], ['INVESTIGATE', t('Araştırılmalı', 'Investigate')]]} />
        <SelectField label={t('Önerilen kanıt düzeyi', 'Proposed evidence level')} value={data.proposedLevel} onChange={v => update('proposedLevel', v)} options={['M', 'D', 'S', 'C']} />
      </div><TextField label={t('Önerilen doğru tanı / ifade', 'Proposed diagnosis / corrected statement')} value={data.correction} onChange={v => update('correction', v)} multiline />
      <TextField label={t('Önerilen CHR → değer eşlemesi', 'Proposed CHR → value mapping')} value={data.proposedMapping} onChange={v => update('proposedMapping', v)} />
      <div className="ev-grid"><TextField label={t('Literatür kaynağı', 'Literature reference')} value={data.reference} onChange={v => update('reference', v)} />
        <TextField label={t('Sayfa / plaka / şekil', 'Page / plate / figure')} value={data.pagePlateFigure} onChange={v => update('pagePlateFigure', v)} /></div>
      <p>{t('Düzeltme veya ret için gerekçe, kaynak, sayfa/şekil, sorun tipi ve beklenen etki zorunludur.', 'Corrections or rejections require a reason, reference, page/figure, problem type and expected effect.')}</p>
      <TextField label={t('Ek gözlemler', 'Additional observations')} value={data.observations} onChange={v => update('observations', v)} multiline />
    </fieldset>
    {reviewMode === 'AI_ASSISTED' && <fieldset disabled={readonly}><legend>{t('Bu kural için açık insan doğrulaması', 'Explicit human verification of this rule')}</legend>
      <SelectField label={t('AI önerileri hakkındaki kararım', 'My action on the AI proposals')} value={data.humanReview?.action} onChange={v => update('humanReview', { ...data.humanReview, action: v })} options={[[ 'APPROVE', t('Öneriyi onayla', 'Approve proposal')], ['REJECT', t('Öneriyi reddet', 'Reject proposal')], ['CORRECT', t('Öneriyi düzelt', 'Correct proposal')], ['INDEPENDENT_ALTERNATIVE', t('Kendi alternatifimi ver', 'Provide my own alternative')]]} />
      <TextField label={t('Kendi inceleme gerekçem', 'My review rationale')} value={data.humanReview?.note} onChange={v => update('humanReview', { ...data.humanReview, note: v })} multiline />
      <Check checked={data.humanReview?.completedByHuman} onChange={v => update('humanReview', { ...data.humanReview, completedByHuman: v })}>{t('Bu tek kuralı kaynaklarıyla bizzat inceledim ve kendi kararımı kaydettim.', 'I personally reviewed this individual rule and its sources and recorded my own decision.')}</Check>
    </fieldset>}
    <DeclarationFields kind="rules" data={data.declarations} onChange={v => update('declarations', v)} disabled={readonly} />
  </>;
}
export function RuleSummary({ study, data, setData, readonly }) {
  const t = useExpertText();
  const forms = study.ownForms.filter(f => f.kind === 'rules' && f.status === 'FINAL');
  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const fields = [
    ['institution', 'Kurum', 'Institution'], ['expertise', 'Uzmanlık alanı', 'Expertise'],
    ['developmentRelationship', 'Kural geliştirmeyle ilişki / bağımsızlık açıklaması', 'Relationship to rule development / independence disclosure'],
    ['sourcesUsed', 'Kullanılan kaynaklar', 'Sources used'], ['criticalRuleIds', 'Kritik taksonomik uyuşmazlıkların kart ID’leri', 'Critical taxonomic discrepancy rule IDs'],
    ['vocabularyOpinion', 'Morfolojik terim ve karakter sözlüğünün yeterliliği', 'Adequacy of morphological terminology and vocabulary'],
    ['evidenceOpinion', 'M/D/S/C sınıflamasının bilimsel gerekçesi', 'Scientific rationale of the M/D/S/C classes'],
    ['coverageOpinion', 'Ayırt edicilik ve eksik cins kapsamı', 'Discrimination and missing genus coverage'],
    ['revisionPriorities', 'Öncelikli revizyonlar / yayımlanabilirlik çekinceleri', 'Revision priorities / publication reservations']
  ];
  return <>
    <div className="ev-notice">{t('Sayılar yalnız sizin kesin gönderdiğiniz kartlardan hesaplanır.', 'Counts are calculated only from the cards you actually submitted.')}</div>
    <div className="ev-metrics"><p>{t('İncelenen', 'Reviewed')}: <strong>{forms.length} / {study.rules.length}</strong></p>
      {['APPROVE', 'CORRECT', 'REJECT', 'UNABLE'].map(d => <p key={d}>{d}: <strong>{forms.filter(f => f.data.decision === d).length}</strong></p>)}
      {['STRONG', 'PARTIAL', 'MISSING'].map(d => <p key={d}>{t('Literatür', 'Literature')} {d}: <strong>{forms.filter(f => f.data.literatureStrength === d).length}</strong></p>)}</div>
    <fieldset disabled={readonly}><legend>{t('İnceleme kaydı ve genel bilimsel görüş', 'Review record and overall scientific opinion')}</legend>
      {fields.map(([key, tr, en]) => <TextField key={key} label={t(tr, en)} value={data[key]} onChange={v => update(key, v)} multiline={!['institution', 'expertise'].includes(key)} />)}
    </fieldset><DeclarationFields kind="rules" data={data.declarations} onChange={v => update('declarations', v)} disabled={readonly} />
  </>;
}
