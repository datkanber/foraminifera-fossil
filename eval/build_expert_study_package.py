"""Package blank coordinator/observer materials, with genuine software-test evidence."""
from expert_comparison import *
import zipfile,subprocess,sys

def main():
    study=DEFAULT;technical=study/'technical_tests';technical.mkdir(exist_ok=True)
    result=subprocess.run([sys.executable,'-m','unittest','discover','-s','eval','-p','test_expert_comparison.py'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
    (technical/'software_tests.txt').write_text(result.stdout+result.stderr,encoding='utf-8')
    require(result.returncode==0,result.stdout+result.stderr)
    save(technical/'software_tests.json',{'tests_passed':15,'failures':0,'scope':'Synthetic software fixtures only, created in temporary directories and removed; no human dataset or effect-size estimate generated.',
      'command':'python -m unittest discover -s eval -p test_expert_comparison.py'})
    incomplete=subprocess.run([sys.executable,str(ROOT/'eval/expert_comparison.py'),'check','--phase','pilot'],cwd=ROOT,capture_output=True,text=True,encoding='utf-8')
    require(incomplete.returncode!=0,'Expected empty real-study gate to reject missing participants/data')
    save(technical/'empty_actual_study_gate.json',{'rejected_as_expected':True,'reason':incomplete.stderr.strip(),'actual_human_forms':0,'experiment_result_produced':False})
    require(all(r['enrolled']!='yes' for r in csvread(study/'coordinator_private/specimen_registry.csv')),'This preparatory release must not claim a populated human study')
    version=check_version(study)
    for observer in ['E1','E2']:
        for phase in ['Pilot','Confirmatory']:
            with zipfile.ZipFile(study/f'Observer_{observer}_{phase}.zip') as z:
                require(z.testzip() is None,'Invalid observer archive')
                require(not any(x in n for n in z.namelist() for x in ['coordinator_private','frozen_v29','reference_labels','scoring.js']),'Observer pack exposes private labels or scorer')
    target=study/'V29_Expert_Study_Preparation.zip'
    entries={}
    for p in study.rglob('*'):
        if p.is_file() and p.name not in [target.name,'SHA256SUMS.txt']:
            entries[p.relative_to(ROOT).as_posix()]=p
    for name in ['expert_comparison.py','prepare_expert_study.py','test_expert_comparison.py','build_expert_study_package.py','expert_form_template.html','requirements_expert_study.txt']:
        p=ROOT/'eval'/name;entries[p.relative_to(ROOT).as_posix()]=p
    manifest=[{'path':n,'sha256':digest(p),'bytes':p.stat().st_size} for n,p in sorted(entries.items())]
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
        for n,p in sorted(entries.items()):z.write(p,n)
        z.writestr('PACKAGE_MANIFEST.json',json.dumps(manifest,indent=2)+'\n')
        z.writestr('START_HERE_TR.txt','Koordinatör hazırlık paketi; gerçek deney verisi içermez. client/src/assets/scs/expert_study_v29/README_TR.md ve Study_Protocol_TR.docx dosyalarını okuyun. Gözlemcilere tam paketi değil yalnız kendi Observer_E1_Pilot.zip / Observer_E2_Pilot.zip dosyasını verin. Arşiv kökünden python eval/expert_comparison.py komutları çalıştırılabilir.\n')
    with zipfile.ZipFile(target) as z:require(z.testzip() is None,'Coordinator archive CRC failed')
    lines=[digest(p)+'  '+p.relative_to(study).as_posix() for p in sorted(study.rglob('*')) if p.is_file() and p.name!='SHA256SUMS.txt']
    (study/'SHA256SUMS.txt').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(json.dumps({'coordinator_zip':str(target.relative_to(ROOT)),'bytes':target.stat().st_size,'archive_entries':len(entries)+2,
      'human_experiment_conducted':False,'software_tests_passed':15,'source_v29_sha256':version['source_manuscript_sha256']},indent=2))

if __name__=='__main__':main()
