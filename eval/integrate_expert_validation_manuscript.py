"""Add verified software-test results and the prospective human protocol to a
new DOCX copy. Keep every other ZIP part, including Word comments, unchanged.
Never inserts synthetic data as independent expert-validation results.
"""
import argparse
from copy import deepcopy
import hashlib
import json
from pathlib import Path
import re
from zipfile import ZipFile
from lxml import etree as E

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
NS = {'w': W}
tag = lambda local: '{' + W + '}' + local
text = lambda element: ''.join(element.xpath('.//w:t/text()', namespaces=NS))


def paragraph(value, template=None, bold=False):
    result = E.Element(tag('p'))
    if template is not None and template.find(tag('pPr')) is not None:
        result.append(deepcopy(template.find(tag('pPr'))))
    run = E.SubElement(result, tag('r'))
    if bold:
        E.SubElement(E.SubElement(run, tag('rPr')), tag('b'))
    node = E.SubElement(run, tag('t'))
    node.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
    node.text = value
    return result


def replace_range(element, old, new):
    """Preserve run formatting, bookmarks and comment anchors around text."""
    nodes = element.xpath('.//w:t', namespaces=NS)
    full = ''.join(n.text or '' for n in nodes)
    if old not in full:
        return False
    start = full.index(old)
    stop = start + len(old)
    position = 0
    first = True
    for node in nodes:
        value = node.text or ''
        end = position + len(value)
        if end > start and position < stop:
            before = value[:max(0, start-position)]
            after = value[max(0, stop-position):] if stop < end else ''
            node.text = before + (new if first else '') + after
            node.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
            first = False
        position = end
    return True


def table(rows):
    result = E.Element(tag('tbl'))
    props = E.SubElement(result, tag('tblPr'))
    E.SubElement(props, tag('tblStyle')).set(tag('val'), 'TableGrid')
    width = E.SubElement(props, tag('tblW')); width.set(tag('w'), '5000'); width.set(tag('type'), 'pct')
    grid = E.SubElement(result, tag('tblGrid'))
    for value in [1400, 1400, 2200]:
        E.SubElement(grid, tag('gridCol')).set(tag('w'), str(value))
    for index, values in enumerate(rows):
        row = E.SubElement(result, tag('tr'))
        for value in values:
            cell = E.SubElement(row, tag('tc'))
            cell.append(paragraph(value, bold=index == 0))
            for run in cell.xpath('.//w:r', namespaces=NS):
                rp = run.find(tag('rPr'))
                if rp is None:
                    rp = E.Element(tag('rPr')); run.insert(0, rp)
                E.SubElement(rp, tag('sz')).set(tag('val'), '16')
    return result


def integrate(source, output):
    final = json.loads((output / 'Final_Implementation_Report.json').read_text('utf-8'))
    manifest = json.loads((output / 'V32_Version_Manifest.json').read_text('utf-8'))
    verified = json.loads((output / 'Artifact_Verification_Report.json').read_text('utf-8'))
    assert verified['passed'] and final['tests']['apiPassed'] >= 69
    assert final['actualHumanSubmissions'] == 0
    sha_before = hashlib.sha256(source.read_bytes()).hexdigest()
    with ZipFile(source) as archive:
        original_xml = archive.read('word/document.xml')
        document = E.fromstring(original_xml)
        body = document.find(tag('body'))
        paragraphs = body.findall(tag('p'))
        anchor = next(p for p in paragraphs if text(p).startswith('IX. DISCUSSION'))
        assert not any('SOFTWARE VERIFICATION AND PROSPECTIVE HUMAN VALIDATION' in text(p) for p in paragraphs)
        commit = manifest['gitCommit']
        test_count = final['tests']['apiPassed']
        content = [
            'H. SOFTWARE VERIFICATION AND PROSPECTIVE HUMAN VALIDATION',
            'Implementation and provenance: A private validation extension was implemented in the existing React/Express/Neo4j application. The extension separates SOFTWARE_TEST records, AI_ASSISTED_REVIEW decisions and INDEPENDENT_HUMAN_OBSERVATION sheets. Individual invitations, server-side authorization, draft persistence, immutable final responses and a study-level data lock control the workflow. When the same specialists perform both tasks, all relevant independent Form B observations must be final before Form A rule-review proposals become available. Original AI drafts are retained separately from each human decision, correction, evidence, pseudonymous reviewer code and approval timestamp; a per-rule human confirmation is required, with no bulk-approval action.',
            f'Software-test configuration: The validation extension was frozen against source commit {commit}, with SHA-256 checksums for the 21-character vocabulary, 75 genera, 708 rule cards, OWL content, decision trees, scoring implementation and analysis configuration. The earlier V29 study preparation remains archived separately and was not relabeled as v32. Two AI simulation profiles represented a morphological-taxonomy review role and an ontology/rule-consistency role. They were separately authored role-conditioned plans from the same assistant and replayed deterministically, not two independent model samples or human experts.',
            f'Technical results: {test_count} API unit, regression and authorization tests passed. A Chromium browser test exercised the coordinator and two isolated test accounts through draft saving, resumption, Form B-to-Form A ordering, final submission, reference recording, data lock and export. A separate disposable Neo4j test verified persistence, concurrent-update protection, reproducible reports and encrypted backup/restore. Migration was executed twice in a dedicated local staging database, with identical ontology-content hashes before and after. Each AI profile completed 23 selected rule-card assessments and three explicitly synthetic 21-character schema fixtures, producing 46 simulated Form A records and six simulated Form B records. The 14 requested PDF, JSON, CSV and ZIP deliverables were generated; every simulated PDF page was labeled AI-GENERATED SOFTWARE TEST — NOT INDEPENDENT HUMAN VALIDATION, and the independent-observation package contained no AI answers, taxon labels or engine outputs.',
            'Scientific interpretation: These tests establish workflow and export behavior only. The three fixtures are not physical fossils, the generated time fields are simulated rather than human observation durations, and no independent reference genus exists for them. Consequently, they provide no classification-accuracy estimate, improvement claim, independent expert agreement or specimen-level confidence interval. Original independent human observations, AI-assisted human approvals, participant qualifications and independent reference verification are NOT CONDUCTED. Table XVII states the evidence boundary explicitly.',
            'Prospective protocol: Two actual micropaleontology specialists will independently record 21 characters from genuine coded thin-section material without AI answers, engine predictions, reference labels or each other’s responses. After all relevant Form B sheets are final, any review of AI rule proposals will be recorded separately as AI_ASSISTED_REVIEW. REF01 or another documented independent reference procedure will verify genus labels. Only complete, verified and locked human records will support scientific agreement and model-versus-reference analyses. Pilot and confirmatory cohorts will remain separate; observer results will be averaged within each physical fossil and uncertainty will resample fossils or source clusters rather than individual forms. The planned pilot of 8–10 usable cases and separate 60-fossil confirmatory cohort remain targets, not collected or evaluated material.'
        ]
        inserted = [paragraph(content[0], bold=True)] + [paragraph(value) for value in content[1:]]
        inserted += [paragraph('TABLE XVII', bold=True), paragraph('SOFTWARE VERIFICATION AND HUMAN VALIDATION STATUS', bold=True), table([
            ['Evidence category', 'Actual status', 'Permitted interpretation'],
            ['SOFTWARE_TEST', '2 AI profiles; 3 synthetic fixtures and 23 rule cards per profile', 'Workflow, storage and export checks only; no physical-fossil accuracy'],
            ['AI_ASSISTED_REVIEW', 'NOT CONDUCTED', 'Requires actual per-rule human review; not independent blinded agreement'],
            ['INDEPENDENT_HUMAN_OBSERVATION', 'NOT CONDUCTED', 'Requires original 21-character observations from real coded material'],
            ['Independent reference verification', 'NOT CONDUCTED', 'No human model-versus-reference estimate or confidence interval available']
        ])]
        for node in inserted:
            anchor.addprevious(node)
        changes = []
        def patch(p, old, new, purpose):
            before = text(p)
            if replace_range(p, old, new):
                changes.append({'purpose': purpose, 'before': before, 'after': text(p)})
        for p in paragraphs:
            value = text(p)
            if 'Runtime observations are not persisted.' in value:
                patch(p, 'Runtime observations are not persisted.', 'Routine public identification observations are not persisted in the ontology graph. The private validation extension (Section VIII-H) stores study responses in separate access-controlled records.', 'Clarify public runtime versus validation persistence')
            if value.startswith('Results: For the five core profiles') and 'The protocol of a blinded expert review of LLM-drafted observations' in value:
                start = value.index('The protocol of a blinded expert review of LLM-drafted observations')
                patch(p, value[start:], 'The revised prospective protocol separates original independent blinded specimen observations from subsequent AI-assisted rule-card review and a separately verified confirmatory study. Its software preparation is described in Section VIII-H; actual human observations and approvals remain NOT CONDUCTED (Supplementary Material S10).', 'Separate independent Form B from AI-assisted rule review')
            if value.startswith('User bias:') and 'a shared model draft can likewise anchor' in value:
                start = value.index('a shared model draft can likewise anchor')
                patch(p, value[start:], 'AI-generated rule-review proposals can also anchor later decisions, so the revised workflow withholds them until all relevant independent specimen sheets are final and labels subsequent approvals as AI-assisted rather than independent evidence.', 'Record anchoring and withholding policy')
            if value.startswith('The system is a working end-to-end prototype'):
                match = re.search(r'\(i\).*?; \(ii\)', value)
                if match:
                    patch(p, match.group(), '(i) the prospective independent blinded specimen study, followed only after the original sheets are final by separately labeled AI-assisted rule-card review and an open-set, multi-institutional evaluation with and without the system; (ii)', 'Update prospective human-validation priority')
            if value.startswith('The ontology file, character definitions'):
                patch(p, 'runs the 55 unit and regression tests', f'runs {test_count} unit, regression and validation-extension tests', 'Update verified software test count')
                current = text(p)
                old = 'V29 is the earlier repaired snapshot to which the study protocol of S10 is locked.'
                patch(p, old, 'V29 is the earlier repaired snapshot of the archived study-preparation workflow. The new validation extension has its own v32 source and content lock (Section VIII-H); V29 results are not relabeled.', 'Keep V29 and V32 source locks distinct')
                current = text(p)
                if 'S10 holds the protocol of the blinded expert review of LLM-drafted observations' in current:
                    start = current.index('S10 holds the protocol of the blinded expert review of LLM-drafted observations')
                    patch(p, current[start:], 'S10 retains the archived earlier preparation materials. The accompanying draft validation-extension package adds the revised independent-observation protocol, separately marked AI simulation outputs, source hashes, data-category boundaries and blank human review materials. No real participant responses, reference labels or human-validation results are included in the software-test package.', 'Describe draft S10 extension without claiming human data')
        updated_xml = E.tostring(document, encoding='UTF-8', xml_declaration=True, standalone=True)
        target = output / 'Foraminifer_v32_Expert_Validation_Integrated_DRAFT.docx'
        assert target.resolve() != source.resolve()
        with ZipFile(target, 'w') as destination:
            for item in archive.infolist():
                destination.writestr(item, updated_xml if item.filename == 'word/document.xml' else archive.read(item.filename))
    with ZipFile(source) as original, ZipFile(target) as revised:
        untouched = [name for name in original.namelist() if name != 'word/document.xml']
        assert all(original.read(name) == revised.read(name) for name in untouched)
        parsed = E.fromstring(revised.read('word/document.xml'))
        for name in ['commentRangeStart', 'commentRangeEnd', 'commentReference']:
            assert len(document.findall('.//w:' + name, NS)) == len(E.fromstring(original_xml).findall('.//w:' + name, NS))
        assert 'NOT CONDUCTED' in text(parsed) and 'TABLE XVII' in text(parsed)
    assert hashlib.sha256(source.read_bytes()).hexdigest() == sha_before
    log = {'source': source.name, 'sourceSha256': sha_before, 'output': target.name, 'originalUnchanged': True,
           'untouchedZipParts': len(untouched), 'commentsAndMediaPreserved': True, 'insertedSection': content,
           'targetedReplacements': changes, 'actualHumanResultsAdded': 0, 'dataCategory': 'SOFTWARE_TEST preparation / prospective human protocol'}
    (output / 'Manuscript_Integration_Change_Log.json').write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding='utf-8')
    (output / 'Manuscript_Integration_EN.md').write_text('\n\n'.join(content), encoding='utf-8')
    return log


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    result = integrate(args.source.resolve(), args.output.resolve())
    print(json.dumps({'output': result['output'], 'originalUnchanged': True, 'commentsAndMediaPreserved': True, 'actualHumanResultsAdded': 0}))
