# Exam Prep — Grade 12 Natural Science (Ethiopia, EUEE/ESSLCE)

An offline practice app for the six national-exam subjects. One file, no install, no account,
no internet needed for the core. Open it and start practicing in one tap.

## 📱 Install it (recommended — iPhone, iPad, and laptop)

**Open this link in Safari/Chrome:** https://elnatananbelu.github.io/ethioexam/

Then **Share → Add to Home Screen** (iPhone/iPad) — you get a real app icon that opens full-screen
and **works offline** after the first open (it caches itself on the device). On a laptop you can just
bookmark it or, in Safari, **File → Add to Dock**.

This is the easiest path on iPhone, which won't run a downloaded local `.html` file directly.

## Or use the local file (Mac only, no internet)

### On a laptop
Double-click **`EthioExam.html`**. It opens in your browser straight to the subject grid.

### On iPhone/iPad
iOS won't run a local `.html` file's JavaScript from the Files/Mail preview — use the **install link
above** instead (that's exactly why the hosted version exists).

Everything works fully offline: all 408 verified science/math questions, both practice and mock-exam
modes, scores, streaks, and the progress dashboard. Progress is saved on the device.

## The two kinds of questions
- **Curated (Physics, Chemistry, Biology, Mathematics):** hand-built and double-checked for accuracy —
  these are the trusted ones. 408 questions across all four difficulty tiers.
- **AI-generated (English & SAT, and optional "AI extra practice" for the sciences):** unlimited,
  generated live. Labeled **"AI"**, or **"AI — verify"** for science extras (always double-check those).
  AI needs a free API key (below). Without a key, the curated bank still works 100%.

## Free AI key (optional — only for English/SAT and AI extra practice)
Open **Settings** (gear icon, top corner) → **AI provider**. Pick one:

- **Groq** (recommended — free, fast): get a key at **console.groq.com/keys** (no credit card).
- **Gemini** (Google, free tier): get a key at **aistudio.google.com/apikey** (no credit card).

Both are **free**. You will not be billed — the free tiers only limit how many questions per day,
they never charge. Paste the key in Settings and it's saved on the device. You can switch providers
anytime; each remembers its own key.

## Modes
- **Practice:** instant feedback + a worked explanation after each question.
- **Mock Exam:** real national-exam question count and timer per subject, no feedback until the end,
  then a full review of every question with the correct answer and explanation.

## Settings
Theme (light/dark/system), reset progress, and the AI key — all in the gear menu. Settings never block
you from practicing.

## Adding more curated questions later
The curated bank lives in `banks/bank-*.js` (one file per subject), each a plain array of question
objects in the schema documented in `SPEC.md`. To regenerate the single file after editing a bank,
re-inline the four bank files into `EthioExam.html` at the build step described in `CLAUDE.md`.
