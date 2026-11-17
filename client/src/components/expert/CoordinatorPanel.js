import { useEffect, useState } from 'react';
import { validationRequest, VALIDATION_API, studyPath } from './api';
import { TextField, SelectField, Check, useExpertText } from './Controls';

export function CreateStudy({ onCreated, onError }) {
  const t = useExpertText();
  const [catalog, setCatalog] = useState(null), [busy, setBusy] = useState(false), [filter, setFilter] = useState('');
  const [input, setInput] = useState({ title: '', cohort: 'PILOT', reviewScope: 'SUBSET', purpose: 'RESEARCH', ruleReviewMode: 'INDEPENDENT', selectionCriteria: '', ruleIds: [] });
  const update = (key, value) => setInput(d => ({ ...d, [key]: value }));
  useEffect(() => { let active = true; validationRequest('/catalog').then(d => { if (active) setCatalog(d); }).catch(e => onError(e.message)); return () => { active = false; }; }, [onError]);
  const priority = r => ['Borelis', 'Alveolina', 'Pseudolacazina', 'Psammosphaera'].includes(r.genus) || (r.level === 'M' && !r.mappings.length) || r.audit_flags?.length;
  const submit = async e => {
    e.preventDefault(); setBusy(true); onError('');
    try { const result = await validationRequest('/studies', { method: 'POST', body: input }); await onCreated(result.id); }
    catch (e) { onError(e.message); } finally { setBusy(false); }
  };
  return <form className="ev-panel" onSubmit={submit}><h2>{t('Yeni doğrulama çalışması', 'New validation study')}</h2>
    <p>{t('V32 karakterleri, kuralları, puanlayıcı ve analiz kodu çalışma oluşturulurken dondurulur. V29 paketi ayrı kalır.', 'The v32 characters, rules, scorer and analysis source are frozen at creation. The V29 package remains separate.')}</p>
    <div className="ev-grid"><TextField label={t('Çalışma başlığı', 'Study title')} value={input.title} onChange={v => update('title', v)} required maxLength={200} />
      <SelectField label={t('Kohort', 'Cohort')} value={input.cohort} onChange={v => update('cohort', v)} options={[[ 'PILOT', 'Pilot · P001–P010'], ['CONFIRMATORY', t('Ayrı doğrulama · F001–F060', 'Separate confirmatory · F001–F060')]]} />
      <SelectField label={t('Kayıt türü', 'Study purpose')} value={input.purpose} onChange={v => update('purpose', v)} options={[[ 'RESEARCH', t('Gerçek insan değerlendirmesi', 'Actual human research')], ['SOFTWARE_TEST', t('Yazılım testi — bilimsel sonuç değildir', 'Software test — not research results')]]} />
      <SelectField label={t('Form A yöntemi', 'Form A review method')} value={input.ruleReviewMode} onChange={v => update('ruleReviewMode', v)} options={[[ 'INDEPENDENT', t('Bağımsız insan incelemesi', 'Independent human review')], ['AI_ASSISTED', t('Ayrı AI önerileriyle insan incelemesi', 'Human review of separate AI proposals')]]} />
      <SelectField label={t('Kural inceleme kapsamı', 'Rule review scope')} value={input.reviewScope} onChange={v => update('reviewScope', v)} options={[[ 'SUBSET', t('Seçilmiş alt küme', 'Selected subset')], ['ALL', t('708 kuralın tamamı', 'All 708 rules')]]} />
    </div><TextField label={t('Seçim ölçütü ve protokol gerekçesi', 'Selection criteria and protocol rationale')} value={input.selectionCriteria} onChange={v => update('selectionCriteria', v)} multiline required />
    {input.reviewScope === 'SUBSET' && <>
      <div className="ev-actions"><button type="button" disabled={!catalog} onClick={() => update('ruleIds', catalog.rules.filter(priority).map(r => r.rule_key))}>{t('Teknik inceleme önceliklerini seç', 'Select technical review priorities')}</button>
        <button type="button" onClick={() => update('ruleIds', [])}>{t('Seçimi temizle', 'Clear selection')}</button><span>{input.ruleIds.length} {t('kart seçildi', 'cards selected')}</span></div>
      <TextField label={t('Kural ID / cins ara', 'Search rule ID / genus')} value={filter} onChange={setFilter} />
      <div className="ev-rule-picker">{!catalog ? <p>{t('Kurallar yükleniyor…', 'Loading rules…')}</p> : catalog.rules.filter(r => `${r.rule_key} ${r.genus}`.toLowerCase().includes(filter.toLowerCase())).map(r =>
        <Check key={r.rule_key} checked={input.ruleIds.includes(r.rule_key)} onChange={checked => update('ruleIds', checked ? [...input.ruleIds, r.rule_key] : input.ruleIds.filter(id => id !== r.rule_key))}><code>{r.rule_key}</code> · {r.genus} · {r.level}{priority(r) ? ' ★' : ''}</Check>)}</div>
    </>}
    <button className="ev-primary" disabled={busy || !catalog}>{busy ? t('Oluşturuluyor…', 'Creating…') : t('Çalışmayı ve sürümü dondur', 'Create study and freeze version')}</button>
  </form>;
}
export default function CoordinatorPanel({ study, reload, onError }) {
  const t = useExpertText(), path = studyPath(study.id);
  const [busy, setBusy] = useState(false), [invite, setInvite] = useState(null), [deviations, setDeviations] = useState('');
  const [pilotReviewed, setPilotReviewed] = useState(false), [protocolFinalized, setProtocolFinalized] = useState(false);
  const [specimen, setSpecimen] = useState({ id: '', sourceId: '', clusterId: '', orientation: 'UNKNOWN', materialMode: 'digital' });
  const [materialChecks, setMaterialChecks] = useState(false), [uploadId, setUploadId] = useState(''), [file, setFile] = useState(null), [blindPixels, setBlindPixels] = useState(false);
  const [ref, setRef] = useState({ specimenId: '', genus: '', verified: true, verifierCode: 'REF01', evidence: '', exclusionReason: '' }), [independentRef, setIndependentRef] = useState(false);
  const [adj, setAdj] = useState({ kind: 'rules', subject: '', resolution: 'RESOLVED', note: '' });
  const [correction, setCorrection] = useState({ kind: 'specimens', subject: '', expertCode: 'EXP01', data: '', reason: '' });
  const [selectedFinal, setSelectedFinal] = useState('');
  const [report, setReport] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const preparation = study.phase === 'PREPARATION', locked = study.phase === 'LOCKED';
  const run = async fn => { setBusy(true); onError(''); try { await fn(); await reload(); } catch (e) { onError(e.message); } finally { setBusy(false); } };
  const invitation = code => run(async () => { const result = await validationRequest(`${path}/invitations`, { method: 'POST', body: { code } }); setInvite({ code, url: `${window.location.origin}/expert-validation#invite=${result.token}` }); });
  const upload = () => run(async () => {
    if (!file) throw new Error(t('Bir görüntü seçin.', 'Select an image.'));
    if (file.size > 8 * 1024 * 1024) throw new Error(t('Görüntü en fazla 8 MB olmalı.', 'Image must be at most 8 MB.'));
    const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); });
    await validationRequest(`${path}/specimens/${uploadId}/images`, { method: 'POST', body: { base64, visualBlindingConfirmed: blindPixels } }); setFile(null);
  });
  const nextLabel = preparation ? t('Form B’yi aç', 'Open Form B') : study.phase === 'SPECIMENS' ? t('Form A’yı aç', 'Open Form A') : t('Veriyi kilitle', 'Lock study data');
  const base = `${VALIDATION_API}${path}`;
  return <>
    {study.ruleReviewMode === 'AI_ASSISTED' && <section className="ev-panel"><h2>{t('Ayrı AI kural önerileri', 'Separate AI rule proposals')}</h2>
      <p>{t('Öneriler Form B sırasında uzmanlara verilmez. Her kural için insan onayı ayrı ve zorunludur; bu kayıtlar AI_ASSISTED_REVIEW olarak raporlanır.', 'Proposals are withheld during Form B. Each rule requires separate human verification; these records are reported as AI_ASSISTED_REVIEW.')}</p>
      <p>{t('Kayıtlı özgün taslak', 'Original drafts registered')}: {study.aiProposals?.length || 0}</p>
      {['PREPARATION', 'SPECIMENS'].includes(study.phase) && <><input type="file" accept="application/json,.json" aria-label={t('AI öneri JSON dosyası', 'AI proposal JSON file')} onChange={e => setProposalFile(e.target.files[0])} />
        <button type="button" disabled={busy || !proposalFile} onClick={() => run(async () => { const payload = JSON.parse(await proposalFile.text()); const proposals = payload.proposals || [payload]; for (const proposal of proposals) await validationRequest(`${path}/ai-proposals`, { method: 'POST', body: proposal }); setProposalFile(null); })}>{t('Özgün önerileri ayrı kaydet', 'Register original proposals separately')}</button></>}
    </section>}
    <div className="ev-metrics"><p>Form B <strong>{study.progress.finalB} / {study.progress.expectedB}</strong></p><p>Form A <strong>{study.progress.finalA} / {study.progress.expectedA}</strong></p><p>{t('İnceleme özeti', 'Review summaries')} <strong>{study.progress.summaries} / 2</strong></p><p>{t('Ayrı fosil', 'Distinct fossils')} <strong>{study.specimens.length}</strong></p></div>
    <section className="ev-panel"><h2>{t('Uzman davetleri', 'Expert invitations')}</h2><p>{t('Bağlantılar tek kullanımlık ve 48 saat geçerlidir. Bağlantıyı yalnız ilgili uzmana iletin. Yenileme, eski daveti geçersiz kılar; kabul edilince eski oturumlar kapanır.', 'Links are single-use and valid for 48 hours. Share each link only with its intended expert. Reissuing revokes the old invitation; accepting it revokes prior sessions.')}</p>
      <div className="ev-actions">{['EXP01', 'EXP02'].map(code => <div key={code}><strong>{code}</strong> · {study.experts[code] ? t('Hesap etkin', 'Account active') : t('Davet bekleniyor', 'Awaiting acceptance')} <button type="button" disabled={busy || locked} onClick={() => invitation(code)}>{t('Davet oluştur / yenile', 'Create / renew invite')}</button></div>)}</div>
      {invite && <div className="ev-notice"><label>{invite.code} {t('özel bağlantısı', 'private link')}<input readOnly value={invite.url} onFocus={e => e.target.select()} /></label><button type="button" onClick={() => { navigator.clipboard.writeText(invite.url).catch(() => onError(t('Bağlantıyı seçip kopyalayın.', 'Select and copy the link.'))); }}>{t('Kopyala', 'Copy')}</button></div>}
    </section>
    {preparation && <>
      <form className="ev-panel" onSubmit={e => { e.preventDefault(); run(async () => { await validationRequest(`${path}/specimens`, { method: 'POST', body: { ...specimen, independenceConfirmed: materialChecks, blindingConfirmed: materialChecks, realMaterialConfirmed: materialChecks } }); setSpecimen(s => ({ ...s, id: '', sourceId: '' })); }); }}>
        <h2>{t('Kodlanmış fosil kaydı', 'Register a coded fossil')}</h2><p>{t('Pilot ve doğrulamada aynı fiziksel fosil tekrar kullanılamaz. Aynı kaya/kaynaktan gelen fosiller için aynı özel küme kodunu kullanın.', 'A physical fossil cannot be reused across pilot and confirmatory studies. Use the same private cluster ID for fossils from a shared rock/source.')}</p>
        <div className="ev-grid">{[['id', t('Anonim ID (P001 / F001)', 'Anonymous ID (P001 / F001)')], ['sourceId', t('Özel benzersiz fiziksel fosil ID', 'Private unique physical fossil ID')], ['clusterId', t('Özel kaynak/kaya küme ID', 'Private source/rock cluster ID')]].map(([key, label]) => <TextField key={key} label={label} value={specimen[key]} onChange={v => setSpecimen(s => ({ ...s, [key]: v }))} required />)}
          <SelectField label={t('Bağımsız kesit yönü', 'Independently supplied section orientation')} value={specimen.orientation} onChange={v => setSpecimen(s => ({ ...s, orientation: v }))} options={['AXIAL', 'EQUATORIAL', 'OBLIQUE', 'TANGENTIAL', 'UNKNOWN']} />
          <SelectField label={t('Materyal', 'Material')} value={specimen.materialMode} onChange={v => setSpecimen(s => ({ ...s, materialMode: v }))} options={[[ 'digital', t('Kodlu dijital görünümler', 'Coded digital views')], ['physical', t('Kodlu fiziksel kesit', 'Coded physical section')]]} />
        </div><Check checked={materialChecks} onChange={setMaterialChecks}>{t('Gerçek materyali, bağımsız fosil birimini ve görsel körlemeyi kontrol ettim.', 'I verified actual material, specimen independence and visual blinding.')}</Check>
        <button disabled={busy || !materialChecks}>{t('Fosili iki uzmana ata', 'Assign fossil to both experts')}</button>
      </form>
      <section className="ev-panel"><h2>{t('Özel ince kesit görüntüsü yükle', 'Upload a private thin-section view')}</h2><div className="ev-grid">
        <SelectField label={t('Fosil ID', 'Specimen ID')} value={uploadId} onChange={setUploadId} options={study.specimens.map(p => p.id)} />
        <label className="ev-field"><span>PNG / JPEG / WebP · ≤ 8 MB</span><input key={file ? 'selected' : 'empty'} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files[0])} /></label>
      </div><Check checked={blindPixels} onChange={setBlindPixels}>{t('Piksellerde cins adı veya tanımlayıcı etiket bulunmadığını kontrol ettim. Dosya metadatası sunucuda kaldırılacak.', 'I checked that pixels contain no taxonomic or identifying labels. File metadata will be stripped by the server.')}</Check>
        <button type="button" disabled={busy || !file || !uploadId || !blindPixels} onClick={upload}>{t('Görünümü güvenli kaydet', 'Save private view')}</button>
      </section>
    </>}
    <section className="ev-panel"><h2>{t('Materyal ve tamamlanma', 'Material and completion')}</h2><div className="ev-table-wrap"><table><thead><tr><th>ID</th><th>{t('Görünüm', 'Views')}</th><th>EXP01</th><th>EXP02</th><th>{t('Referans', 'Reference')}</th></tr></thead><tbody>{study.specimens.map(p => <tr key={p.id}><th>{p.id}</th><td>{p.images.length}</td><td>{p.status.EXP01}</td><td>{p.status.EXP02}</td><td>{study.references[p.id]?.verified ? study.references[p.id].genus : study.references[p.id]?.exclusionReason || '—'}</td></tr>)}</tbody></table></div>
      <details><summary>{t('Özel materyal kayıtları', 'Private material records')}</summary><pre>{JSON.stringify(study.privateSpecimens, null, 2)}</pre></details>
    </section>
    {!locked && <form className="ev-panel" onSubmit={e => { e.preventDefault(); run(() => validationRequest(`${path}/references/${ref.specimenId}`, { method: 'PUT', body: { ...ref, independentVerification: independentRef } })); }}>
      <h2>{t('Ayrı referans doğrulaması — yalnız koordinatör', 'Independent reference verification — coordinator only')}</h2><p>{t('Referans cinsi uzmanların tahmininden türetilmez. Ayrı doğrulayıcı ve bağımsız kanıt kaydedin.', 'Do not derive reference labels from observer guesses. Record a separate verifier and independent evidence.')}</p>
      <div className="ev-grid"><SelectField label={t('Fosil', 'Specimen')} value={ref.specimenId} onChange={v => { const existing = study.references[v]; setRef(r => ({ ...r, specimenId: v, ...(existing || { genus: '', evidence: '', exclusionReason: '', verified: true }) })); }} options={study.specimens.map(p => p.id)} required />
        <TextField label={t('Referans cinsi', 'Reference genus')} value={ref.genus} onChange={v => setRef(r => ({ ...r, genus: v }))} />
        <TextField label={t('Ayrı doğrulayıcı kodu', 'Independent verifier code')} value={ref.verifierCode} onChange={v => setRef(r => ({ ...r, verifierCode: v }))} required />
      </div><TextField label={t('Referans kanıtı / arşiv / kaynak', 'Reference evidence / archive / literature')} value={ref.evidence} onChange={v => setRef(r => ({ ...r, evidence: v }))} multiline required />
      <Check checked={ref.verified} onChange={v => setRef(r => ({ ...r, verified: v }))}>{t('Dondurulmuş kapsam içinde cins doğrulandı', 'In-scope reference genus verified')}</Check>
      {!ref.verified && <TextField label={t('Doğrulanmamış / kapsam dışı referans gerekçesi', 'Unverified / out-of-scope reference exclusion reason')} value={ref.exclusionReason} onChange={v => setRef(r => ({ ...r, exclusionReason: v }))} required />}
      <Check checked={independentRef} onChange={setIndependentRef}>{t('Doğrulama EXP01/EXP02’den ve sistem tahmininden bağımsızdır.', 'Verification is independent of EXP01/EXP02 and system predictions.')}</Check>
      <button disabled={busy || !independentRef}>{t('Özel referansı kaydet', 'Save private reference')}</button>
    </form>}
    <section className="ev-panel"><h2>{t('Gönderilen formlar', 'Submitted forms')}</h2>
      <SelectField label={t('Uzman kaydı', 'Expert record')} value={selectedFinal} onChange={setSelectedFinal} options={study.finalForms.map(f => [`${f.kind}:${f.subject}:${f.expertCode}`, `${f.expertCode} · ${f.kind} · ${f.subject}`])} />
      {selectedFinal && <pre>{JSON.stringify(study.finalForms.find(f => `${f.kind}:${f.subject}:${f.expertCode}` === selectedFinal), null, 2)}</pre>}
    </section>
    {study.phase === 'RULES' && <>
      <form className="ev-panel" onSubmit={e => { e.preventDefault(); run(() => validationRequest(`${path}/adjudications`, { method: 'POST', body: adj })); }}><h2>{t('Ayrı uzlaştırma / kural önerisi kararı', 'Separate adjudication / proposal decision')}</h2><p>{t('Ham uzman yanıtları ve ontoloji otomatik değiştirilmez.', 'Original expert responses and the ontology are preserved.')}</p><div className="ev-grid">
        <SelectField label={t('Tür', 'Type')} value={adj.kind} onChange={v => setAdj(a => ({ ...a, kind: v, subject: '' }))} options={['rules', 'specimens']} />
        <SelectField label={t('Kayıt', 'Record')} value={adj.subject} onChange={v => setAdj(a => ({ ...a, subject: v }))} options={adj.kind === 'rules' ? study.rules.map(r => r.rule_key) : study.specimens.map(p => p.id)} required />
        <SelectField label={t('Karar', 'Resolution')} value={adj.resolution} onChange={v => setAdj(a => ({ ...a, resolution: v }))} options={['RESOLVED', 'UNRESOLVED', 'APPROVED_PROPOSAL', 'REJECTED_PROPOSAL']} />
      </div><TextField label={t('Bilimsel gerekçe / ayrı üçüncü görüş', 'Scientific rationale / separate third opinion')} value={adj.note} onChange={v => setAdj(a => ({ ...a, note: v }))} multiline required /><button disabled={busy}>{t('Ayrı kaydı ekle', 'Append separate record')}</button></form>
      <details className="ev-panel"><summary>{t('Yetkili düzeltme kaydı ekle', 'Append an authorized correction')}</summary><form onSubmit={e => { e.preventDefault(); run(async () => { let data; try { data = JSON.parse(correction.data); } catch { throw new Error(t('Geçerli form JSON verisi girin.', 'Enter valid form JSON.')); } await validationRequest(`${path}/revisions`, { method: 'POST', body: { ...correction, data } }); }); }}>
        <p>{t('Orijinal kayıt korunur. Düzeltmeler birincil analizde kullanılmaz; kilit sonrası yeni çalışma sürümü gerekir.', 'The original is retained. Corrections are excluded from the primary analysis; after lock, create a new study version.')}</p><div className="ev-grid">
          <SelectField label={t('Form türü', 'Form type')} value={correction.kind} onChange={v => setCorrection(c => ({ ...c, kind: v }))} options={['specimens', 'rules', 'summary']} />
          <TextField label={t('Kayıt ID', 'Record ID')} value={correction.subject} onChange={v => setCorrection(c => ({ ...c, subject: v }))} required />
          <SelectField label={t('Uzman', 'Expert')} value={correction.expertCode} onChange={v => setCorrection(c => ({ ...c, expertCode: v }))} options={['EXP01', 'EXP02']} /></div>
        <TextField label={t('Düzeltilmiş form verisi (JSON)', 'Amended form data (JSON)')} value={correction.data} onChange={v => setCorrection(c => ({ ...c, data: v }))} multiline required />
        <TextField label={t('Gerekçe ve uzmanın yetkilendirme kanıtı', 'Reason and evidence of expert authorization')} value={correction.reason} onChange={v => setCorrection(c => ({ ...c, reason: v }))} multiline required /><button disabled={busy}>{t('Düzeltmeyi ayrı kaydet', 'Append correction')}</button>
      </form></details>
    </>}
    <section className="ev-panel"><h2>{t('Çalışma aşaması ve veri kilidi', 'Study phase and data lock')}</h2>
      {!locked ? <>
        {preparation && <><TextField label={t('Protokol sapmaları / hedefin altında örnek sayısı gerekçesi', 'Protocol deviations / rationale for a below-target specimen count')} value={deviations} onChange={setDeviations} multiline />
          {study.cohort === 'CONFIRMATORY' && <><Check checked={pilotReviewed} onChange={setPilotReviewed}>{t('Pilot tamamlandı ve incelendi.', 'The pilot was completed and reviewed.')}</Check><Check checked={protocolFinalized} onChange={setProtocolFinalized}>{t('Protokol kesinleştirildi.', 'The protocol was finalized.')}</Check></>}
        </>}
        <p>{t('Aşama geçişi sunucuda kontrol edilir. Materyal Form B açılınca, bütün yanıt ve referanslar veri kilidinde dondurulur.', 'Phase transitions are enforced by the server. Material freezes when Form B opens; all responses and references freeze at data lock.')}</p>
        <button className="ev-primary" type="button" disabled={busy} onClick={() => run(() => validationRequest(`${path}/advance`, { method: 'POST', body: { deviations, pilotReviewed, protocolFinalized } }))}>{nextLabel}</button>
      </> : <>
        <p>{t('Veri kilitli', 'Data locked')}: {new Date(study.lockedAt).toLocaleString()}<br /><code>{study.seal}</code></p>
        <button className="ev-primary" disabled={busy} type="button" onClick={() => run(async () => setReport(await validationRequest(`${path}/report`)))}>{t('Uzman doğrulama raporu oluştur', 'Generate Expert Validation Report')}</button>
        <div className="ev-actions"><a href={`${base}/report?format=print`} target="_blank" rel="noreferrer">{t('İngilizce rapor / PDF', 'English report / PDF')}</a><a href={`${base}/report?format=csv`}>{t('Sonuç tabloları CSV', 'Results tables CSV')}</a><a href={`${base}/export?format=csv`}>{t('Formlar CSV', 'Forms CSV')}</a><a href={`${base}/export`}>S10 JSON</a><a href={`${base}/export?format=reproducible`}>{t('Özel yeniden üretim arşivi', 'Private reproduction archive')}</a></div>
        {report && <><div className="ev-notice">{report.status}</div><h3>Methods</h3><p>{report.manuscript.methods}</p><h3>Results</h3><p>{report.manuscript.results}</p><details><summary>{t('Rapor verilerini incele', 'Inspect report data')}</summary><pre>{JSON.stringify(report, null, 2)}</pre></details></>}
      </>}
    </section>
    <details className="ev-panel"><summary>{t('Sürüm, kaynak ve denetim izi', 'Version, provenance and audit trail')}</summary><pre>{JSON.stringify({ version: study.version, snapshotHash: study.snapshotHash, deviations: study.deviations, audit: study.audit, adjudications: study.adjudications, revisions: study.revisions }, null, 2)}</pre></details>
  </>;
}
