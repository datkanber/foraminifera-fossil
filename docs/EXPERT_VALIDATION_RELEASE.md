# V32 validation extension — staging, simulations and human review

This release implements three separate record categories. SOFTWARE_TEST records
are held under the `simulation` record type and use only AI_SIM_EXP01 and
AI_SIM_EXP02. The simulation runner has no production HTTP route and cannot
create human users, attestations or approvals. Actual Form B records are
INDEPENDENT_HUMAN_OBSERVATION. An explicitly selected AI-assisted Form A mode
records per-rule human decisions as AI_ASSISTED_REVIEW. These are not pooled
with independent blinded human agreement.

## Existing local staging

Run from the repository root:

```powershell
node api/scripts/staging-validation.js status
node api/scripts/staging-validation.js setup
```

The staging site is `http://127.0.0.1:3189/expert-validation`, with a dedicated
local database at `bolt://127.0.0.1:18689`. Setup first proves a database is empty
before invoking the legacy ontology importer. Once initialized, an ownership
marker prevents reuse of a different database on this port. Validation migrations
run through the supported CLI twice and compare ontology-content hashes.
No production connection or research submission is changed.

The local Neo4j bootstrap uses locally installed Neo4j Desktop jars and the
compiled helper for `eval/V32Neo4j.java` under `.tmp/v32_classes`. On a different
machine supply those local prerequisites or provision a separate local Neo4j
instance. This local-only setup is not a remote deployment recipe. Its database
transport authentication is disabled and all ports bind to loopback; web sessions
still require authentication. Do not expose these ports outside the machine.

Setup creates and tests `staging-coordinator` using a cryptographically random
bootstrap password kept only in memory and passed to the existing CLI through
stdin. No password or raw invitation is written to a report. Set your own
password using a hidden terminal prompt before signing in:

```powershell
node api/scripts/staging-validation.js set-password
```

The command revokes previous coordinator sessions. Never paste a password into
chat, an issue, a command-line argument or a tracked file.

## Run and verify AI simulation outputs

```powershell
$env:VALIDATION_STAGING_NEO4J_URI = 'bolt://127.0.0.1:18689'
# Point to an installed Playwright module when it is not in node resolution.
$env:PLAYWRIGHT_MODULE = 'C:/path/to/node_modules/playwright'
node api/scripts/run-validation-simulation.js deliverables/expert-validation/new-run
python eval/validate_expert_simulation_artifacts.py deliverables/expert-validation/new-run --deps-dir .tmp/v32_dependencies
```

The output directory must be new. The runner shares strict character and rule
field validators and the frozen statistical implementation with the application;
human declaration validation remains unchanged. Each profile reviews the same
23 selected difficult cards and completes three clearly synthetic fixtures.
The fixtures are not physical fossils and carry no verified reference genera.
No identification accuracy or improvement is generated from them. All duration
fields are marked SIMULATED_TEST_CLOCK and human duration is null.

The two role-conditioned plans were authored separately by the same Codex
assistant, then replayed deterministically. They are not two independently
sampled model calls. Exact model deployment ID, temperature and sampling seed
are not exposed by the assistant environment and are recorded as null rather
than invented. The role, reasoning, actual repository sources, limitations,
generation timestamp and source hashes are retained for every response.

Four completed AI form PDFs, two profile JSON datasets, comparison CSVs, an
integrity JSON, a version manifest, a marked software-test report and two human
preparation ZIPs are produced. Every simulated PDF page has the required label.
The blind package contains only blank observation material and the controlled
vocabulary. It contains no AI answers, diagnostic rule cards or reference labels.
The separate rule package must be withheld until the independent Form B stage
is complete. Artifact verification checks PDF text, response/source hashes,
JSON/CSV categories, ZIP integrity and the blind-package allowlist.

## Prepare the genuine human workflow

First commit the reviewed source so that a research study has an exact commit
and content lock. Then:

```powershell
node api/scripts/staging-validation.js prepare-human deliverables/expert-validation/new-run
```

This creates a PREPARATION-stage study with no actual participants or specimens.
It registers the immutable original AI rule proposals under their unverified
SOFTWARE_TEST provenance. It does not transfer simulated Form A/B submissions.
Invitation generation is exercised, but raw tokens are discarded. Once actual
experts and real material are available, sign in as coordinator and generate new
private links for those individuals. The tool never sends messages to experts.

The fixed `AI_ASSISTED` review mode prevents later reports from calling assisted
decisions independent. The server rejects imported AI observations in Form B,
withholds rule proposals until both experts' Form B records are final, and
requires a human action, own rationale, source locator and individual human
verification for each assisted card. Original AI drafts, original human responses
and later adjudications remain separate. There is no bulk-approval operation.

## Manuscript integration

`eval/integrate_expert_validation_manuscript.py` reads an existing V32 DOCX and
the verified output package. It creates a new draft with a software-verification
subsection, evidence-category status table, a prospective independent-observation
protocol and explicit NOT CONDUCTED status for human phases. Existing scientific
classification results are not recalculated or replaced with AI simulation
statistics. All original DOCX parts except `word/document.xml` are copied byte
for byte, retaining comments, media and relationships. The original file is
checked unchanged; a targeted change log accompanies the draft.

## Production release preparation — not yet authorized

1. Review the frozen commit, tests and downloadable artifacts. Do not push to a
   production-linked branch until a production release is explicitly authorized.
2. Restore Vercel team access to the existing project; current connector access
   returns 403 for the configured team. The Render API deployment and production
   Neo4j credentials also need verification in their own hosting environments.
3. Provision and test a dedicated remote staging database/API before production.
   Use Node 20.9+ for the API and the locked dependencies, with a full checkout
   containing the source files consumed by `createSnapshot()`.
4. Set `VALIDATION_APP_ORIGIN` to the exact HTTPS frontend origin and
   `VALIDATION_GIT_COMMIT` to the reviewed 40-character deployment commit.
   Configure the actual Neo4j credentials through the host's secret settings.
   Select the intended validation database with `VALIDATION_NEO4J_DATABASE`.
5. Preserve same-origin `/api/expert-validation` proxying. For a remote preview,
   point it to the dedicated staging API, never the production API. The tracked
   production rewrite currently names the existing Render API. Avoid CDN caching
   for private routes; production session cookies require HTTPS.
6. Take a genuine production backup before an authorized migration. Use the
   existing `validation-admin.js migrate`, then check idempotency and ontology
   hashes. Do not run the ontology importer against an existing database.
7. Create the genuine coordinator through the hidden prompt or stdin. Test
   secure cookies, CSRF, invitations, access separation and private images on the
   actual host. Test source locking, exports and rollback before promotion.

Do not restore any test backup into production. Do not copy simulated submissions
into a human study. A local staging success does not establish cloud deployment
success or independent expert validation. Real participants, qualifications,
materials and reference verification remain necessary.
