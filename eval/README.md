# Offline audit and evaluation revision

The current numerical results are in `results/revision/`. The pre-edit masters,
OWL and scorer are frozen in `archive/pre_audit_20261111/`. Original 150-panel
provider receipts and source images remain in `client/src/assets/scs/evaluation/`.
No provider requests are required by any of the following experiments.

```powershell
python eval/apply_audit_fixes.py
python eval/consistency_and_audit.py --export-paths
npm.cmd --prefix api test
python eval/sensitivity.py
python eval/monte_carlo.py
python eval/generate_ontology.py
python eval/validate_ontology.py
python -m unittest discover -s eval -p test_revision.py
python eval/revision_report.py
python eval/plot_revision.py
python eval/update_manuscript.py
```

Use `requirements_revision.txt`. Node's built-in runner and the existing API
dependencies run the API tests. HermiT is supplied by Owlready2 and requires Java;
the validator also discovers a local Neo4j Desktop Java runtime on Windows.
Matplotlib plots use 450 dpi PNG and vector PDF. No scientific dependency is
introduced into the production Node service.

`update_manuscript.py` defaults to the user's V27 in Downloads and writes a new
V28 and S10 into `client/src/assets/scs/revision_v28/`. It preserves the original.
Pass an explicit source path as its first argument to reproduce on another
computer (the ZIP contains `source_manuscript/Foraminifer_Manuscript_v27_IEEE_Access.docx`).
In V27 the legacy internal-consistency Table XIV is numbered VIII, and the old
ontology inventory is S9.6; current ontology metrics are also supplied in S10.4.

## Interpretation

The repairs eliminate the *specified* 17/10/25 audit findings. They do not
constitute a validated taxonomic revision. Three of the original 18 missing
diagnostics can be mapped from existing definitions; the remaining 15 require
new anatomical vocabulary or taxonomic curation. Removing false/repeated
diagnostic proxies leaves 28 genera without a scored diagnostic overall.

Internal unique first ranks improve 24 to 30 and shared-rank top-three retrieval
64 to 68, but excluded paths increase 17 to 19. Image-panel top-one agreement
decreases 4.9% to 3.2%; preserving promoted raw neutral states changes 8.9% to
3.9% across masters. These negative outcomes are retained, not tuned away.

The B1 comparator treats every observed M/D mismatch as eliminative and ties all
survivors. The synthetic profiles, both models and the comparison use the same
KB and known wall-composition modules. The 75 profiles satisfy their mapped M/D
constraints; missing anatomy remains unknown. Complete clean and noisy controls
are supplied. These tests demonstrate conditional synthetic behavior, not
independent field robustness or accuracy on expert inputs.

RBO_EXT follows Webber, Moffat and Zobel (2010), Eq. 32, p=0.9, on active lists.
Its extrapolation can assign 1 to unequal lists sharing the shorter complete
prefix; empty/empty also means structural agreement, not a correct diagnosis.
RBO uses the actual deterministic service tie order; Acc@k uses uniform score
ties and zero credit for abstentions. Top-three stability is supplied as both
exact prefix-set agreement and overlap of prefix sets.

The 27 threshold settings use default weights. The five weight variants use
default thresholds. The two sweeps are not a full weight-by-threshold Cartesian
product. No best setting is selected on these development observations.

The published/live Neo4j database and hosted deployment are not changed by
these offline scripts. The JSON masters and generated OWL are the revised
source artifacts; an ordinary deployment/import remains a separate operation.
The project still has no verified published Zenodo DOI.

The supplied DOCX files have structural/data checks. Word COM opened the new
manuscript but its PDF export did not return in this environment; page-by-page
PDF layout validation is therefore not claimed. The three plot PDFs are actual
vector exports, separately validated. `render_revision.ps1` is provided for a
Word environment where native export completes.
