# SPEC.md — Ethiopian Grade 12 Exam-Practice App (FROZEN CONTRACT)

> This is the single source of truth. Every agent builds against this. Do not deviate.
> Audience: one student (the founder's younger brother) prepping for the Ethiopian
> Grade 12 Natural Science national exam (EUEE / ESSLCE). English UI only (NOT bilingual).

## Hard constraints (non-negotiable)
1. The entire app is ONE self-contained `index.html`. All HTML, CSS, JS, and the curated
   question bank inline. No build step, no bundler, no `npm install`, no external files.
2. Vanilla JS only. No frameworks, no CDN, no `<script src>` to any URL. Must run fully
   offline by opening the file (`file://`) on iPad Safari and on a laptop.
3. The ONLY network call permitted anywhere is the optional Gemini API over HTTPS.
4. No signup / login / account / splash / welcome gate. Opening the file lands DIRECTLY on
   the subject grid. Practicing is one tap away.
5. Mobile/tablet-first. Min tap target ~44px. Works in portrait on iPad and on laptop.
   Nothing requires mouse hover to function.
6. Progress persists via `localStorage` (scores, accuracy, weak units, streaks, theme, key).

## App flow (keep this direct)
`Open file → Subject grid (6 subjects) → pick subject → pick unit (or "All units")
 → pick difficulty (Easy/Medium/Hard/Impossible) → pick mode → Practice.`

Two modes chosen before a session:
- **Practice mode:** instant feedback + explanation after each question.
- **Mock exam mode:** strict countdown timer, real question count per subject (table below),
  NO feedback until the end, then a full review screen: every question, his answer, the
  correct answer, the explanation.

A persistent **Settings** icon (top corner), always reachable, never blocks entry. Holds:
theme toggle (light/dark), "reset progress" button, Gemini API key field. App is fully
usable with ZERO setup using the curated bank.

## The six subjects
Physics, Chemistry, Biology, Mathematics → CURATED bank (verified, authoritative).
English, Scholastic Aptitude Test (SAT) → AI-GENERATED only (Gemini).
Every science subject also has an optional "AI Extra Practice" toggle (Gemini), labeled distinctly.

## Question source labeling (UI must visibly distinguish)
- `source: "curated"` → trusted. No special warning badge needed beyond normal display.
- `source: "ai"` for English/SAT → small **"AI"** badge.
- `source: "ai"` for a SCIENCE subject (AI Extra Practice) → **"AI — verify"** badge; show
  the AI explanation but never present with curated authority.

## Question data schema (EXACT shape — the frozen seam)
```json
{
  "id": "phys-g11-mech-001",
  "subject": "Physics",
  "grade": 11,
  "unit": "Motion in One and Two Dimensions",
  "difficulty": "medium",
  "type": "calculation",
  "question": "…",
  "options": { "A": "…", "B": "…", "C": "…", "D": "…" },
  "correct": "C",
  "explanation": "…",
  "source": "curated"
}
```
- `subject` ∈ "Physics" | "Chemistry" | "Biology" | "Mathematics" | "English" | "SAT"
- `grade` ∈ 9 | 10 | 11 | 12
- `difficulty` ∈ "easy" | "medium" | "hard" | "impossible"
- `type` is a short string label (e.g. "calculation", "conceptual", "definition", "application").
- `options` ALWAYS has exactly keys A, B, C, D, all non-empty, all mutually distinct, exactly
  one unambiguously correct.
- `correct` ∈ "A" | "B" | "C" | "D" and must point to the genuinely correct option.
- `explanation` is a worked, self-contained 1–3 sentence explanation of WHY the answer is correct.
- `source` ∈ "curated" | "ai".
- `id` is unique, lowercase, kebab format: `<subj>-g<grade>-<unitcode>-<seq>`.

The app exposes the curated bank as a single global: `const CURATED_BANK = [ ...all curated objects... ];`
Content agents each emit `window.BANK_<SUBJECT> = [ ... ];` arrays; the orchestrator concatenates
them inline at assembly. Use UTF-8; subscripts/superscripts as Unicode (e.g. CₙH₂ₙ, x⁶y⁴) or plain
ASCII (C_nH_2n) — be consistent and readable on a tablet.

## Curated bank volume target (per subject)
At least **20 verified questions per difficulty tier** (easy/medium/hard/impossible) → ≥80 per subject.
TARGET ~22–24 per tier to comfortably support mock exams. Spread across the subject's high-weight
units below. Every question has a worked explanation. Accuracy is the bar: a wrong "correct" answer
is a defect that fails the gate.

## Unit taxonomy (organize the bank by these; concentrate volume in high-weight units)
**Physics** (hardest nationally — strongest, heaviest bank): Vectors; Motion in 1D/2D & projectile;
Dynamics/Newton's laws; Rotational motion & torque; Gravitation/orbital & escape velocity; Elasticity
& static equilibrium; Heat & calorimetry; Electrostatics & Coulomb's law; Capacitors; Current
electricity & resistor networks (series/parallel); Magnetism & electromagnetism/induction; AC vs DC
generators; Waves & geometric optics; Nuclear physics; Electronics (diodes, transistors, logic gates).

**Chemistry** (highest national average): Atomic structure & periodicity; Chemical bonding;
Stoichiometry & the mole; States of matter; Chemical kinetics; Chemical equilibrium (Le Chatelier);
Acid–base equilibria & pH/Ka; Electrochemistry (cells, electrodes); Organic chemistry (nomenclature,
homologous series — alkanes CₙH₂ₙ₊₂ / alkenes CₙH₂ₙ / alkynes CₙH₂ₙ₋₂, functional groups, benzene,
alcohol dehydration); Polymers; Industrial & environmental chemistry.

**Biology:** Cell biology; Biochemistry/enzymes; Genetics (Mendelian crosses, DNA/inheritance);
Evolution; Human body systems & physiology; Microorganisms; Energy transformation
(photosynthesis/respiration); Ecology & population; Climate change.

**Mathematics (Natural):** Functions & relations; Rational expressions; Matrices & determinants;
Vectors; Transformations; Sequences & series; Introduction to calculus (limits, differentiation,
integration); Statistics (mean/variance/SD, range/IQR); Probability & combinatorics (binomial
expansion); Trigonometry; Solid geometry (volumes — e.g. frustum); Absolute-value inequalities;
Linear programming.

**English (AI):** vocabulary-in-context, grammar/usage (tenses, articles, prepositions, S–V
agreement), sentence completion, error identification/correction, reading comprehension w/ inference.

**SAT/Aptitude (AI):** Verbal (analogies, synonyms/antonyms, classification, sentence completion,
logical/analytical reasoning) + Quantitative (number patterns, arithmetic reasoning, data interpretation).

## Difficulty calibration (use real past-paper style as the anchor)
- **easy:** single-step recall/definition or one-line substitution. (e.g. "SI unit of torque?")
- **medium:** 2-step reasoning or a standard formula applied once. (e.g. alkene/alkyne general formula;
  simple kinematics substitution.)
- **hard:** multi-step, combines two concepts, or careful algebra. (e.g. coefficient of x⁶y⁴ in
  (x+y)¹⁰ = 210; frustum volume; resistor network reduction.)
- **impossible:** olympiad-adjacent for a strong G12 student — multi-concept synthesis, careful traps,
  non-obvious setup. Still has exactly one correct, defensible answer with a worked explanation.

## Mock exam blueprint (real counts & timing)
| Subject | Questions | Time | Notes |
|---|---|---|---|
| English | 100 | 120 min | AI-generated |
| Mathematics (Natural) | 60 | 180 min | curated |
| Scholastic Aptitude (SAT) | 60 | 120 min | 35 verbal + 25 quantitative, AI-generated |
| Physics | 50 | 150 min | curated |
| Chemistry | 80 | 150 min | curated |
| Biology | 80 | 150 min | curated (range is 60–100; use 80) |
All MCQ, four options A–D. No negative marking.
For curated subjects, mock pulls from the bank across difficulties. For AI subjects, mock batch-generates
via Gemini with a visible progress indicator; if no key, mock for English/SAT shows the "add a key" note
and is unavailable (curated subjects' mocks always work offline).

## Gemini AI integration
- API key pasted once in Settings, stored in `localStorage` (key name `gemini_api_key`). User generates
  the key (free tier, no card). If absent, AI features show: "Add a free Gemini key in Settings to unlock
  unlimited AI questions" — curated bank stays fully usable.
- Call the Gemini REST `generateContent` endpoint directly with `fetch()` over HTTPS. Model:
  `gemini-2.0-flash` (free tier; if the call 404s on model name, the code must surface a clear error, not
  crash). Key goes in the standard `?key=` query param of the request only — never logged, never shown.
- Prompt the model to return STRICT JSON ONLY (no markdown fences) matching the schema. Parse with
  try/catch. On parse failure: retry ONCE, then show a graceful error. Strip accidental ``` fences
  defensively before parsing.
- The prompt must specify: subject, unit, exact difficulty tier, Ethiopian Grade 12 curriculum context,
  MCQ with exactly four options A–D and exactly one correct answer, and a 1–2 sentence explanation.
- AI questions get `source: "ai"` and the appropriate badge ("AI" for English/SAT, "AI — verify" for
  science extra practice).

## Features
- Subject grid home with per-subject progress (accuracy % and # answered).
- Unit picker per subject + "All units".
- Difficulty selector: Easy / Medium / Hard / Impossible.
- Practice mode (instant feedback + explanation) and Mock Exam mode (timed, real counts, end review).
- Per question: highlight selected option, then mark correct/incorrect (green/red), reveal explanation.
- Live score + streak during a session; end-of-session summary (score, time, accuracy, weakest unit).
- Progress dashboard: accuracy per subject and per unit, total answered, weak-unit detection.
- Dark/light theme toggle, persisted. Settings: theme, reset progress (with confirm), Gemini key.

## Security / safety (single-file, offline)
- All question text, options, and explanations (curated AND AI) are rendered with `textContent` or
  safe DOM construction — NEVER `innerHTML` with untrusted content (XSS via AI/curated strings).
- The Gemini key lives only in `localStorage` and the outgoing request; never echoed to the DOM in full,
  never put into a link or browser history beyond the standard fetch.
- `localStorage` reads are validated/parsed defensively (try/catch, schema-guard) — a corrupt value must
  not crash the app; fall back to defaults.

## Acceptance criteria (the gate)
- Double-click `index.html` (laptop) or open in iPad Safari → lands directly on the subject grid; no
  login, no splash, no internet needed.
- A full curated practice session works offline with explanations.
- Mock exam mode matches the real counts/timing per subject and shows a full review.
- AI generation works for English/SAT when a key is set; degrades gracefully when not.
- Progress survives closing and reopening the file.
- Curated science questions are accurate and visually distinct from AI-generated ones.
