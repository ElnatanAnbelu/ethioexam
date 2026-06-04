# SIGN_OFFS.md — Ethiopian Grade 9–12 Exam-Practice App

Final state: single self-contained `index.html`, **3,787 curated questions** (Physics 969, Chemistry 936,
Biology 970, Math 912), Grades 9–12, all official MoE units, plus AI English/SAT (Groq + Gemini). Offline,
no login, backup/restore, grade filter, grade-weighted mock exams. ~1.6 MB, loads on iPad Safari + laptop.

Each line: role · verdict · evidence.

## Content & accuracy
- **Curated bank (4 subjects × G9–G12)** · APPROVED · 3,787 questions; every item generated then
  **independently re-solved** by a separate examiner agent (generate→verify pipeline); 0 malformed, 0
  duplicate IDs; every official unit covered, zero gaps.
- **Independent accuracy spot-check (288 random questions)** · APPROVED · 12 independent examiner agents
  re-solved a stratified random sample across all subjects/grades/difficulties → **0 defects flagged**.
- **Orchestrator hand-check** · APPROVED · 24/24 of the hardest Physics + Math items re-computed by hand,
  all correct.

## Engineering & UX
- **Grade architecture** · APPROVED · compact format + hydration; grade filter (All/9/10/11/12) in Free
  Practice; grade-grouped unit picker with per-unit counts (0-count units dimmed). Verified live.
- **Mock-exam grade weighting** · APPROVED · `pickCuratedMock` draws G9 10% / G10 20% / G11 35% / G12 35%,
  floor+largest-remainder rounding, shortfall redistribution, dedupe, exact N. Node-simulated
  (Physics 50→10/20/36/34%, Chem 80→10/20/35/35%); mock verified live (50 Q, 150-min timer).
- **AI Extra Practice (science supplement)** · APPROVED WITH FIX (landed) · QA found the toggle was inert;
  now implemented — after curated questions it generates AI items ("AI — verify" badge), gated on a saved
  key, graceful errors, reusing the AI-subject path. M1 (grade arg dropped in a fallback) also fixed.
- **UI/UX polish** · APPROVED · subtle CSS-only refinement (motion, cards, type/spacing, depth); proven
  non-destructive (all HTML/JS/data byte-identical to pre-polish backup); reduced-motion + AA preserved.

## Security & resilience (Stage-4 QA, adversarial)
- **AppSec / XSS** · APPROVED · only `innerHTML` sinks are trusted ICONS/glyph literals (incl. the
  flag-button ternary); all bank + AI text via textContent. Re-verified after all edits.
- **localStorage resilience** · APPROVED · live test: injected broken-JSON progress + garbage
  theme/provider/key → app self-healed on reload with "Couldn't read your saved progress… reset" toast,
  **zero uncaught errors**, no data corruption.
- **Backup/restore** · APPROVED · validateBackup rejects foreign/malformed/`__proto__` input safely
  (12-case sim); confirm-gated restore; round-trip (incl. keys) verified live earlier.
- **AI error paths (Groq + Gemini)** · APPROVED · no-key / network / 401/403/404/429 / non-JSON / bad
  fields all mapped to graceful UI; both providers confirmed reaching their APIs live. Keys masked, Groq
  key in header, Gemini key URL-encoded; never logged/DOM-exposed.
- **QA verdict** · SHIP · no critical/data defects; the two found issues fixed and re-validated.

## Live verification
- **Served & driven in a real browser**: opens directly on subject grid; curated practice (correct +
  incorrect) with explanations; progress persists; grade filter + grade-grouped picker; new G9 content
  plays; weighted mock plays with timer; AI degrades gracefully; light/dark themes; `node --check` clean.

**Final gate: PASS.** No open blockers. No TODOs/stubs. Restore points: `legacy/index-prepolish.html.bak`.
