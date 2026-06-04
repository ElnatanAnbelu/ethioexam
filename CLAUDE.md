# CLAUDE.md — Ethiopian Grade 12 Exam-Practice App

## What this is
A self-contained, offline practice/quiz app for the Ethiopian Grade 12 Natural Science national exam
(EUEE/ESSLCE), for a single student. Six subjects, four difficulty tiers, practice + timed mock-exam
modes, progress dashboard, dark/light themes. Hybrid question bank: a **verified curated bank** for the
STEM subjects (Physics, Chemistry, Biology, Mathematics) and **AI-generated** questions for English & SAT
(plus optional AI extra practice for sciences). The deliverable is one file: `EthioExam.html`.

## Tech stack
- **Pure single-file web app.** Vanilla HTML + CSS + JavaScript, all inline. No framework, no bundler,
  no build step, no CDN, no dependencies. Runs from `file://` on iPad Safari and any laptop browser.
- **Persistence:** `localStorage` (progress, streaks, theme, AI provider + per-provider API keys).
- **AI (optional):** Google **Gemini** (`gemini-2.0-flash`, key in `?key=` query param) and **Groq**
  (`llama-3.3-70b-versatile`, OpenAI-compatible, key in `Authorization: Bearer` header). Default = Groq.
  These are the only network calls; both hosts are pinned in a CSP `connect-src`.

## Key design decisions
- **Single inline file by hard constraint:** iPad Safari blocks `fetch()` of local files over `file://`,
  so the curated bank and all code must be embedded — no external JS. The four `banks/bank-*.js` files are
  intermediate source; they are inlined into `EthioExam.html` at assembly.
- **Accuracy gate on curated STEM content:** a wrong "correct" answer teaches the student wrong, so every
  curated question was generated AND independently re-solved by a separate adversarial verifier (math/physics
  keys recomputed in Node). 5 wrong keys were caught and fixed this way.
- **XSS safety:** all question/option/explanation text (curated and AI) is rendered via `textContent`/safe
  DOM (`el({text:...})`) — never `innerHTML`. The lone `innerHTML` sink takes only trusted SVG-icon literals.
- **Two AI providers, user-selectable, no lock-in:** each provider stores its own key; switching is instant.
  Provider-aware, graceful error handling for no-key / invalid-key / rate-limit / network / parse failures;
  the curated bank always works offline regardless.

## Where everything lives
```
ethio-exam-prep/
├── EthioExam.html        ← THE deliverable: complete app + 408 curated questions inlined
├── banks/            ← curated question source of truth, COMPACT format (edit here, then re-inline)
│   ├── qb-physics.js     (window.QB_PHYSICS = [...])    969 Qs
│   ├── qb-chemistry.js   (window.QB_CHEMISTRY = [...])  936 Qs
│   ├── qb-biology.js     (window.QB_BIOLOGY = [...])    970 Qs
│   └── qb-math.js        (window.QB_MATH = [...])       912 Qs   (3,787 total)
├── legacy/           ← archived original verbose bank-*.js (superseded by qb-*.js)
├── FORMAT.md         ← compact row contract + official MoE unit taxonomy (G9–G12)
├── SPEC.md           ← frozen contract: schema, units, difficulty calibration, mock blueprint
├── DESIGN_SPEC.md    ← design tokens, every screen's states, components, microcopy, a11y
├── README.md         ← end-user instructions (how to open, get a free key, put on iPad)
├── SIGN_OFFS.md      ← pipeline sign-off record
└── CLAUDE.md         ← this file
```
Inside `EthioExam.html`, the curated questions sit between the `window.BANK_PHYSICS` definition and the
`const CURATED_BANK = [].concat(...)` line, in a block headed `/* ===== CURATED BANK (injected at assembly ...) */`.

## How to run it locally
Just open the file — no server needed:
```bash
open EthioExam.html            # macOS; or double-click it
```
(For dev with live console/network inspection, any static server works, e.g. `python3 -m http.server`,
but it is NOT required and the app does no local fetches.)

## How to add/edit curated questions (re-inline step)
1. Edit the relevant `banks/bank-<subject>.js` (keep the exact schema in `SPEC.md`; `node --check` it).
2. Re-inline all four banks into `EthioExam.html`, replacing the current curated block. The original assembly
   replaced the marker `/*__CURATED_BANK_INJECTION__*/` with the concatenated bank files; to update, swap
   the existing `/* ===== CURATED BANK ... */ ... ` block with the new bank file contents (same order:
   physics, chemistry, biology, math), keeping the trailing `const CURATED_BANK = [].concat(...)` intact.
3. Validate: extract the `<script>` and run `node --check`; confirm `CURATED_BANK.length` and that every
   item has A–D options and a valid `correct`.

## Question schema (the contract)
`{ id, subject, grade, unit, difficulty, type, question, options:{A,B,C,D}, correct, explanation, source }`
- `difficulty` ∈ easy|medium|hard|impossible · `source` ∈ curated|ai · exactly one correct option.

## Status / verification (2026-06-04)
Built and verified **live in a browser** (executed, not just inspected): opens directly on the subject grid
(no login/splash); curated practice works offline with explanations (correct + incorrect paths); progress
persists across reload; mock exam shows real counts/timer (e.g. Chemistry 80 Q / 150 min) with end review;
both AI providers reach their APIs and degrade gracefully without/with a bad key; light + dark themes render;
backup/restore (incl. keys) works; zero uncaught console errors. `node --check` clean.

**Curated bank: 3,787 verified questions** (Physics 969, Chemistry 936, Biology 970, Math 912), 0 integrity
errors, 0 duplicate IDs, every official MoE unit across Grades 9–12 covered (zero gaps). Compact format
(short keys + hydration); file ~1.5 MB, loads fine on iPad Safari. Grade-aware: grade filter (All/9/10/11/12)
in Free Practice, grade-grouped unit picker showing per-unit counts. Each item was generated then
**independently re-solved** (generate→verify pipeline); orchestrator hand-checked 24/24 of the hardest
Physics + Math items correct on top of that.

## Open items / known limitations
- AI mock exams for English/SAT generate many questions live and need a valid free key + network; they are
  unavailable offline (by design). Curated-subject mocks always work offline.
- Model names (`gemini-2.0-flash`, `llama-3.3-70b-versatile`) are current as of this build; if a provider
  retires a model, update the `CONFIG` constants — the app surfaces a clear "model unavailable" error rather
  than crashing.
- Curated bank is a strong starter set (~22–30 per tier per subject); extend via the re-inline step above.

## Stage gate summary
Stage 1 (Spec + Design): PASS. Stage 2 (Content ×4 + SWE-FE): PASS (1 wrong key fixed at the verify gate;
4 more self-caught during generation). Stage 4 (AppSec + QA): PASS. AI provider extension (Groq added):
PASS, Gemini regression-clean. Final gate: PASS — see `SIGN_OFFS.md`.
