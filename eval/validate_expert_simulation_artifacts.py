"""Verify generated SOFTWARE_TEST artifacts; never validates human science."""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import sys
import zipfile


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest_object(value):
    raw = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(raw).hexdigest()


def validate(output, deps_dir=None):
    if deps_dir:
        sys.path.insert(0, str(Path(deps_dir).resolve()))
    import pymupdf
    read = lambda name: json.loads((output / name).read_text('utf-8-sig'))
    plan = read('Artifact_Validation_Plan.json')
    for name in plan['requiredArtifacts']:
        require((output / name).is_file() and (output / name).stat().st_size > 0, 'Missing artifact: ' + name)
    manifest = read('V32_Version_Manifest.json')
    private = read('Private_Simulation_Reproduction.json')['study']
    require(private['purpose'] == 'SOFTWARE_TEST', 'Not a software-test archive')
    require(manifest['snapshotHash'] == private['snapshot']['hash'], 'Version hashes differ')
    for name, sha in private['snapshot']['manifest']['files'].items():
        actual = hashlib.sha256(private['snapshot']['files'][name].encode('utf-8')).hexdigest()
        require(actual == sha, 'Frozen file mismatch: ' + name)
    chars = json.loads(private['snapshot']['files']['api/data/characters.json'])['characters']
    rules = json.loads(private['snapshot']['files']['api/data/rule_chr_mapping.json'])
    require(len(chars) == 21 and len(rules) == 708 and len({r['genus'] for r in rules}) == 75, 'Wrong V32 inventory')
    pdf_checks = []
    for item in plan['pdfs']:
        with pymupdf.open(output / item['file']) as pdf:
            require(len(pdf) > 0, 'Empty PDF')
            for i, page in enumerate(pdf):
                text = ' '.join(page.get_text().split())
                require(item['expectedPageLabel'] in text, f"Missing page label: {item['file']} page {i + 1}")
            pdf_checks.append({'file': item['file'], 'pages': len(pdf), 'every_page_labeled': True})
    for code in ['AI_SIM_EXP01', 'AI_SIM_EXP02']:
        data = read(code + '.json')
        require(data['dataCategory'] == 'SOFTWARE_TEST' and data['profileId'] == code, 'Wrong profile/category')
        require(data['provenance']['aiGenerated'] and not data['provenance']['humanVerified'], 'Misleading AI provenance')
        require(len(data['formB']) == 3 and len(data['formA']) == 23, 'Wrong simulation response counts')
        for record in data['formA'] + data['formB']:
            require(record['expertCode'] == code and record['dataCategory'] == 'SOFTWARE_TEST', 'Mixed response provenance')
            require('declarations' not in record['data'] and 'humanReview' not in record['data'], 'Simulated human attestation')
            require(record['timer']['simulated'] and record['timer']['humanObservationDuration'] is None, 'Unmarked timing')
            require(record['responseHash'] == digest_object(record['data']), 'Response data changed after submission')
        for record in data['formB']:
            require(set(record['data']['observations']) == {c['id'] for c in chars}, 'Incomplete Form B')
    with zipfile.ZipFile(output / 'Independent_Blinded_Observation_Package.zip') as zipped:
        require(zipped.testzip() is None, 'Corrupt blind ZIP')
        require(set(zipped.namelist()) == {'Blank_Form_B.html', 'Controlled_Character_Vocabulary.json', 'Blank_Independent_Observation.json', 'MATERIALS_NOT_ASSIGNED.txt'}, 'Unexpected file in blinded package')
        for name in zipped.namelist():
            text = zipped.read(name).decode('utf-8')
            for secret in plan['prohibitedBlindPackageContent']:
                # Instructions may legitimately say “do not view predictions”.
                # For generic engine terms, reject actual structured output keys;
                # reject profile IDs and taxon labels anywhere in the package.
                forbidden = '"' + secret + '"' if secret in {'ranking', 'predictions', 'referenceGenus'} else secret
                require(forbidden.lower() not in text.lower(), 'Blinded package leaks forbidden content: ' + secret)
    with zipfile.ZipFile(output / 'Human_Expert_Rule_Review_Package.zip') as zipped:
        require(zipped.testzip() is None and 'AI_Drafts_UNVERIFIED.json' in zipped.namelist(), 'Invalid rule-review ZIP')
        proposals = json.loads(zipped.read('AI_Drafts_UNVERIFIED.json'))['proposals']
        require(len(proposals) == 46 and all(p['provenance']['humanVerified'] is False for p in proposals), 'AI drafts mislabeled')
    for name, count in [('Rule_Review_Comparison.csv', 23), ('Specimen_Observation_Comparison.csv', 63)]:
        with (output / name).open(encoding='utf-8-sig', newline='') as stream:
            rows = list(csv.DictReader(stream))
            require(len(rows) == count and all(r['dataCategory'] == 'SOFTWARE_TEST' for r in rows), 'CSV row/category mismatch')
    report = read('Software_Test_Validation_Report.json')
    require(report['humanParticipation']['independentSpecimenObservation'] == 'NOT CONDUCTED', 'False human participation')
    require(report['formB']['analyzableSpecimens'] == 0, 'Synthetic reference counted as verified')
    require(all(x['estimate'] is None for x in report['formB']['performance']['A0'].values()), 'Accuracy generated without reference evidence')
    result = {'passed': True, 'scope': 'SOFTWARE_TEST artifact verification only; independent human validation NOT CONDUCTED',
              'required_artifacts': len(plan['requiredArtifacts']), 'pdfs': pdf_checks, 'version_file_hashes': len(private['snapshot']['manifest']['files']),
              'response_hashes': 52, 'blind_package_leak_check': 'PASS', 'zip_integrity': 'PASS', 'csv_json_provenance': 'PASS'}
    (output / 'Artifact_Verification_Report.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    parser.add_argument('--deps-dir')
    args = parser.parse_args()
    print(json.dumps(validate(args.output.resolve(), args.deps_dir)))
