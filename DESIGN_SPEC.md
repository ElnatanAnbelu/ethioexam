# DESIGN_SPEC.md — Ethiopian Grade 12 Exam-Practice App

> **Status:** Implementation-ready. Build to this EXACTLY. The engineer implements; they do not invent UI.
> **Source of truth for content/behavior:** `SPEC.md` (frozen). This document is the source of truth for visual design, layout, states, copy, and accessibility.
> **Scope:** One self-contained `index.html`, vanilla JS, single inline `<style>`. No frameworks, no CDN, no web fonts. Offline-first. English UI only.
> **Quality bar:** Linear / Duolingo / Notion-grade polish. Calm, modern, premium. Mobile/tablet-first (iPad portrait + laptop).

---

## 0. How to use this document

- Every CSS custom property name listed here is **normative** — use it verbatim.
- Every user-facing string in §4 is **normative** — copy it character-for-character.
- Every screen in §2 lists **four states minimum**: empty / loading / error / populated. All are mandatory; none are optional.
- Numbers are concrete. There is no "engineer decides." If you find a gap, default to the nearest token already defined here.
- Theme is toggled by setting `data-theme="light"` or `data-theme="dark"` on `<html>`. All colors resolve from CSS variables under those two scopes. Default to dark on first load only if `prefers-color-scheme: dark`; otherwise light. Persist the user's explicit choice in `localStorage` key `theme`.

---

## 1. DESIGN TOKENS

All tokens are CSS custom properties declared on `:root` (theme-agnostic) and overridden under `:root[data-theme="light"]` / `:root[data-theme="dark"]` (color only). Spacing, radius, type, motion are theme-agnostic.

### 1.1 Color — theme-agnostic anchors

These six **subject accent hues** are identical across themes (they read as brand identity); only the neutrals/semantics flip. Each subject also gets a `-soft` tint used for card wash / progress track fill and a `-on` foreground color guaranteed AA on the accent.

```css
:root{
  /* Subject accents — same hue both themes */
  --subject-physics:        #4F6BED;  /* indigo-blue */
  --subject-chemistry:      #15A398;  /* teal */
  --subject-biology:        #2FA84F;  /* leaf green */
  --subject-math:           #B8851E;  /* amber-gold */ /* darkened from raw gold for AA on white */
  --subject-english:        #8A5CF6;  /* violet */
  --subject-sat:            #E0588B;  /* rose-pink */

  /* Foreground guaranteed legible on the solid accent above */
  --subject-physics-on:     #FFFFFF;
  --subject-chemistry-on:   #FFFFFF;
  --subject-biology-on:     #FFFFFF;
  --subject-math-on:        #FFFFFF;
  --subject-english-on:     #FFFFFF;
  --subject-sat-on:         #FFFFFF;
}
```

> **Note on Math (`--subject-math`):** raw gold (#E6B422) fails AA as text on white. The token is darkened to `#B8851E` so it can also be used as text. For the *card icon chip* (accent on a soft tint, large), a brighter gold is acceptable via `--subject-math-soft`.

### 1.2 Color — LIGHT theme

```css
:root[data-theme="light"]{
  /* Neutrals */
  --bg:                 #F7F8FA;   /* app background (very light cool grey) */
  --bg-subtle:          #EEF1F5;   /* secondary background / inset areas */
  --surface:            #FFFFFF;   /* cards, panels, sheets */
  --surface-raised:     #FFFFFF;   /* modals (same fill, separated by shadow) */
  --surface-hover:      #F2F4F7;   /* pressed/active fill for tappable surfaces */
  --border:             #E3E7EC;   /* default hairline border */
  --border-strong:      #CBD2DA;   /* focused/selected outline base */

  /* Text */
  --text-primary:       #14181F;   /* headings, question text */
  --text-secondary:     #424B57;   /* body, option text */
  --text-muted:         #6B7480;   /* labels, counts, helper text */
  --text-disabled:      #A4ACB6;

  /* Brand / primary accent (app chrome, primary buttons) */
  --primary:            #3B5BDB;   /* deep blue */
  --primary-hover:      #2F4BC4;
  --primary-soft:       #E7ECFC;   /* soft fill behind primary elements */
  --primary-on:         #FFFFFF;

  /* Semantic */
  --success:            #1E9E5A;   /* correct answer */
  --success-soft:       #E2F5EA;
  --success-border:     #9BD9B6;
  --success-on:         #FFFFFF;
  --danger:             #D63B43;   /* incorrect answer */
  --danger-soft:        #FBE6E7;
  --danger-border:      #F0AAAD;
  --danger-on:          #FFFFFF;
  --warning:            #C77A12;   /* AI — verify, timer low */
  --warning-soft:       #FBEFD9;
  --warning-on:         #FFFFFF;

  /* Subject soft tints (card wash, progress track) */
  --subject-physics-soft:   #E9EDFC;
  --subject-chemistry-soft: #DEF4F1;
  --subject-biology-soft:   #E2F4E7;
  --subject-math-soft:      #FAF0D8;
  --subject-english-soft:   #EFE7FE;
  --subject-sat-soft:       #FCE6EE;

  /* Elevation */
  --shadow-sm:  0 1px 2px rgba(20,24,31,.06), 0 1px 1px rgba(20,24,31,.04);
  --shadow-md:  0 2px 8px rgba(20,24,31,.08), 0 1px 2px rgba(20,24,31,.05);
  --shadow-lg:  0 8px 28px rgba(20,24,31,.12), 0 2px 6px rgba(20,24,31,.06);
  --shadow-xl:  0 18px 50px rgba(20,24,31,.18);
  --overlay:    rgba(20,24,31,.45);  /* modal scrim */

  /* Focus ring color */
  --focus-ring: #3B5BDB;
}
```

### 1.3 Color — DARK theme

```css
:root[data-theme="dark"]{
  /* Neutrals */
  --bg:                 #0E1116;   /* near-black, slight blue */
  --bg-subtle:          #151A21;
  --surface:            #171C24;   /* cards */
  --surface-raised:     #1E242E;   /* modals, popovers */
  --surface-hover:      #222936;
  --border:             #262E39;
  --border-strong:      #39424F;

  /* Text */
  --text-primary:       #F2F4F7;
  --text-secondary:     #C2C9D2;
  --text-muted:         #8B95A1;
  --text-disabled:      #5A636E;

  /* Brand / primary */
  --primary:            #6E8BFF;   /* lifted for contrast on dark */
  --primary-hover:      #8197FF;
  --primary-soft:       #1C2742;
  --primary-on:         #0E1116;

  /* Semantic */
  --success:            #3CCB7F;
  --success-soft:       #11261C;
  --success-border:     #2C6B47;
  --success-on:         #06140C;
  --danger:             #FF6B72;
  --danger-soft:        #2A1416;
  --danger-border:      #7A2E33;
  --danger-on:          #1A0708;
  --warning:            #F0B445;
  --warning-soft:       #2A2010;
  --warning-on:         #1A1304;

  /* Subject soft tints — dark, low-chroma so cards read as surfaces, not blocks */
  --subject-physics-soft:   #18203A;
  --subject-chemistry-soft: #0F2A28;
  --subject-biology-soft:   #11281A;
  --subject-math-soft:      #2A2410;
  --subject-english-soft:   #1F1838;
  --subject-sat-soft:       #2C1620;

  /* Elevation — shadows are softer; rely more on border + raised surface */
  --shadow-sm:  0 1px 2px rgba(0,0,0,.40);
  --shadow-md:  0 2px 10px rgba(0,0,0,.45);
  --shadow-lg:  0 10px 32px rgba(0,0,0,.55);
  --shadow-xl:  0 20px 60px rgba(0,0,0,.65);
  --overlay:    rgba(0,0,0,.62);

  --focus-ring: #8197FF;
}
```

> In dark mode the brighter subject accents (§1.1) are used as-is for icons/labels on the dark soft tint — all six pass AA against `--surface` and against their `-soft` dark tints. Verified contrast in §5.4.

### 1.4 Typography

System-font stack only. No web fonts, no CDN.

```css
:root{
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
               Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: ui-monospace, "SF Mono", "SFMono-Regular", Menlo, Consolas,
               "Liberation Mono", monospace; /* used for numeric stats, timer, formula tokens */

  /* Type scale — rem-based, root font-size = 100% (16px). Tablet-readable; body ≥16px. */
  --fs-display: 2.25rem;  /* 36px — session summary score, big numbers */
  --fs-h1:      1.75rem;  /* 28px — screen titles */
  --fs-h2:      1.375rem; /* 22px — section headings, subject card title */
  --fs-h3:      1.125rem; /* 18px — sub-section, modal title */
  --fs-body:    1rem;     /* 16px — base body, option text */
  --fs-body-lg: 1.0625rem;/* 17px — question text (slightly larger for focus) */
  --fs-small:   0.875rem; /* 14px — labels, counts, helper */
  --fs-micro:   0.75rem;  /* 12px — badges, overline labels (use sparingly) */

  /* Line heights */
  --lh-tight:   1.2;   /* display, large numbers */
  --lh-heading: 1.3;   /* h1–h3 */
  --lh-body:    1.55;  /* body, questions, explanations */

  /* Weights (system fonts: 400/500/600/700 only) */
  --fw-regular: 400;
  --fw-medium:  500;
  --fw-semibold:600;
  --fw-bold:    700;

  /* Letter spacing */
  --ls-tight:  -0.01em;  /* large headings */
  --ls-normal: 0;
  --ls-wide:   0.04em;   /* overline / micro labels, uppercase */
}
```

Usage rules:
- Question text: `--fs-body-lg`, `--fw-medium`, `--lh-body`, `--text-primary`.
- Option text: `--fs-body`, `--fw-medium`, `--lh-body`, `--text-secondary` (→ `--text-primary` when selected).
- Explanation: `--fs-body`, `--fw-regular`, `--lh-body`, `--text-secondary`.
- Numeric stats / timer / streak count: `--font-mono`, tabular feel (apply `font-variant-numeric: tabular-nums;`).
- Overline labels (e.g. "DIFFICULTY", "MODE"): `--fs-micro`, `--fw-semibold`, `text-transform:uppercase`, `--ls-wide`, `--text-muted`.

### 1.5 Spacing scale

4px base grid. Use these only.

```css
:root{
  --sp-0:  0;
  --sp-1:  0.25rem;  /* 4 */
  --sp-2:  0.5rem;   /* 8 */
  --sp-3:  0.75rem;  /* 12 */
  --sp-4:  1rem;     /* 16 */
  --sp-5:  1.25rem;  /* 20 */
  --sp-6:  1.5rem;   /* 24 */
  --sp-8:  2rem;     /* 32 */
  --sp-10: 2.5rem;   /* 40 */
  --sp-12: 3rem;     /* 48 */
  --sp-16: 4rem;     /* 64 */

  /* Layout */
  --page-pad-mobile:  var(--sp-4);   /* 16 — outer page padding on phones/iPad portrait */
  --page-pad-laptop:  var(--sp-8);   /* 32 */
  --content-max:      720px;         /* reading column for session/dashboard */
  --grid-max:         960px;         /* subject grid max width */
}
```

### 1.6 Border radius

```css
:root{
  --r-xs:   6px;    /* badges, pills, chips */
  --r-sm:   10px;   /* option buttons, inputs */
  --r-md:   14px;   /* cards, stat tiles */
  --r-lg:   20px;   /* large cards, modal */
  --r-xl:   28px;   /* hero / summary panel */
  --r-pill: 999px;  /* fully rounded (toggles, progress bar) */
}
```

### 1.7 Motion

```css
:root{
  --t-fast:   120ms;
  --t-base:   200ms;
  --t-slow:   320ms;
  --ease:        cubic-bezier(.4, 0, .2, 1);     /* standard */
  --ease-out:    cubic-bezier(.16, 1, .3, 1);    /* entrances, reveals */
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);/* subtle pop on correct answer */
}
```

All transitions must be wrapped by reduced-motion handling (§5.5). Animate only `opacity`, `transform`, `background-color`, `border-color`, `color`, `box-shadow`. Never animate `width`/`height`/`top`/`left` for layout.

### 1.8 Z-index scale

```css
:root{
  --z-base:    0;
  --z-sticky:  100;  /* sticky session header / timer bar */
  --z-toast:   800;
  --z-overlay: 900;  /* modal scrim */
  --z-modal:   1000;
}
```

---

## 2. SCREEN-BY-SCREEN UX SPEC

Global app shell: a single full-height container `<main id="app">` with `max-width` per screen, centered, `padding: var(--page-pad-mobile)`; at `min-width:768px` padding becomes `--page-pad-laptop`. Background `--bg`. One screen visible at a time (vanilla JS view-swap; hide others with `hidden` attribute). A11y: each screen is a `<section role="region" aria-label="…">`; on screen change move focus to the screen's `<h1>` (which has `tabindex="-1"`).

**Persistent Settings affordance:** A fixed icon button, top-right of the viewport (top-left in RTL — N/A here, English only). 44×44px tap target, `--surface` circle, `--shadow-sm`, gear glyph (inline SVG, `currentColor`, `--text-muted`). Present on EVERY screen. `aria-label="Settings"`. It opens the Settings panel (§2.8) as a modal sheet. It never blocks entry and never appears as a gate.

**Back navigation:** Every screen except the Subject Grid shows a back affordance top-left: a 44×44 ghost icon button (chevron-left) + adjacent text label of the parent. `aria-label` describes destination (e.g. "Back to subjects").

---

### 2.1 Subject Grid (Home) — landing screen

**Purpose:** Opening the file lands here directly (no splash/login). Practicing is one tap away.

**Layout**
- Centered column, `max-width: var(--grid-max)`.
- Header row: app title "Exam Prep" (`--fs-h1`, `--fw-bold`, `--text-primary`) on the left with a one-line subtitle "Grade 12 Natural Science" (`--fs-small`, `--text-muted`); Settings gear fixed top-right (global).
- Below header: a compact **overall progress strip** (full-width card, `--surface`, `--r-md`, `--shadow-sm`): three stat tiles inline — "Answered", "Accuracy", "Day streak". (See Stat tile §3.9.)
- **Subject grid:** responsive CSS grid of 6 Subject Cards (§3.1).
  - iPad portrait / phones: `grid-template-columns: repeat(2, 1fr)`, gap `--sp-4`.
  - Laptop (`min-width:768px`): `repeat(3, 1fr)`, gap `--sp-5`.
  - Each card: subject name, subject icon chip (accent), and two micro-stats: "{n} answered" and "{x}% accuracy".
- Footer line (muted, `--fs-small`): "All progress is saved on this device." (sets expectation, no account).

**States**
- **Empty (no progress yet — first open):** Overall strip shows "0 answered", "—% accuracy", "0 day streak" with `--text-muted` and a one-line encourager below the strip: *"Pick a subject to start your first set."* Subject cards still render fully (they are the primary CTA); each card's stats read "Not started yet" in `--text-muted` (no zeros that look broken). No separate blank illustration — the grid IS the content.
- **Loading:** Not applicable in the usual sense (data is inline + localStorage, synchronous). If localStorage parse is in progress on cold open, render cards immediately with skeleton stat shimmer (`--bg-subtle` block, 1.2s reduced-motion-safe pulse) for ≤1 frame; in practice render directly. Do **not** show a spinner on home.
- **Error (corrupt localStorage):** App must not crash (SPEC §security). On parse failure, silently fall back to defaults (treat as empty state) AND surface a dismissible inline toast (§3.11): *"Couldn't read your saved progress, so it's been reset. Your questions are unaffected."* Toast auto-dismisses in 6s.
- **Populated:** Each card shows real `{n} answered` and `{x}% accuracy`. Cards with the highest accuracy get no special treatment; the weakest subject is NOT shamed here (weak-unit surfacing lives in the dashboard, framed positively).

**Interaction**
- Tap anywhere on a Subject Card → Unit Picker for that subject. Whole card is the tap target (44px+ trivially satisfied).
- Curated subjects (Physics, Chemistry, Biology, Mathematics): card is plain.
- AI subjects (English, SAT): card shows a small **"AI"** badge (§3.5) inline next to the subject name, so the student knows these need a key for content.

**Responsive**
- Portrait iPad: 2 columns, comfortable. Overall strip stacks its 3 tiles in a row that wraps to 1-per-line below 360px (rare).
- Laptop: 3 columns; overall strip tiles always inline.

---

### 2.2 Unit Picker (per subject)

**Purpose:** Choose a unit or all units before configuring the session.

**Layout**
- Back button → "Back to subjects".
- Screen title `<h1>`: the subject name, colored with the subject accent dot/underline (a 8px accent square before the title). `--fs-h1`.
- Subtitle `--fs-small --text-muted`: "{m} units · {n} questions in the bank" for curated subjects; for AI subjects: "Questions are generated with AI".
- **"All units"** as the first, full-width primary option row (a large pill/row, §3.2 but full width), visually emphasized (`--primary-soft` fill, `--primary` text, check-mark affordance when selected). It is the recommended default.
- Below: a vertical list (mobile) / two-column grid (laptop) of **Unit pills** (§3.2). Each shows unit name + a tiny accuracy chip ("{x}%") if the student has attempted it; otherwise no chip.
- Continue button is NOT here — selecting a unit advances directly to the Difficulty/Mode screen (one tap = forward). "All units" likewise advances on tap.

**States**
- **Empty (curated subject with bank loaded):** Always has units (bank is inline). No empty state for curated. If somehow zero questions match (defensive), show inline message: *"No questions found for this subject yet."* with a back button.
- **Empty (AI subject, no key):** Still show the unit list (units are known taxonomy) but pin a dismissible info banner at top: the **"add a key" note** (§4). Units remain tappable; the gating happens at generation time with a clear message, OR (preferred) units are shown disabled (`--text-disabled`) with the banner explaining why, plus a primary "Add a key" button that opens Settings. **Decision:** show units enabled-looking but route any tap to the "add key" prompt for AI subjects without a key — fewer dead-ends, clearer next action.
- **Loading:** None (taxonomy is static).
- **Error:** If subject data is missing entirely, inline error block (§3.11 inline variant) + back.
- **Populated:** Units listed; attempted units show accuracy chips. Most-attempted ordering is NOT used; keep curriculum order (matches how the student studies).

**Interaction**
- Tap "All units" or a unit → Difficulty & Mode screen, carrying {subject, unit} in JS state.
- For AI subject with no key, tap → open Settings focused on the key field, with the helper note visible.

**Responsive**
- Portrait: single-column list, each pill full width, min-height 56px.
- Laptop: 2-column grid of unit pills; "All units" spans full width above.

---

### 2.3 Difficulty & Mode Selector (session setup)

**Purpose:** Final configuration before a session: difficulty, mode, and (sciences only) AI-Extra-Practice.

**Layout** (single scrollable column, `max-width: var(--content-max)`)
- Back → "Back to units".
- `<h1>`: "Set up your session". Subtitle `--fs-small --text-muted`: "{Subject} · {Unit or 'All units'}".
- **Section: Difficulty** — overline label "DIFFICULTY". A row of 4 **Difficulty chips** (§3.3): Easy / Medium / Hard / Impossible. Single-select (radio semantics). Default selected: **Medium**. Each chip carries a tiny difficulty meaning on long labels? No — keep labels single-word; the meaning is conveyed by an escalating dot indicator (1–4 filled dots) under each label.
- **Section: Mode** — overline label "MODE". A **Mode toggle** (§3.4): two large segments, "Practice" and "Mock Exam". Default: **Practice**.
  - Under Practice (when selected): helper `--fs-small --text-muted`: "Instant feedback and an explanation after each question."
  - Under Mock Exam (when selected): helper shows the real blueprint for this subject: "{N} questions · {T} min · no feedback until the end." (Pull N/T from the SPEC mock table.) For AI subjects in Mock with no key, show inline the "add a key" note and disable the start button (see states).
- **Section: AI Extra Practice (sciences only)** — appears ONLY for Physics, Chemistry, Biology, Mathematics. Overline "AI EXTRA PRACTICE". A row containing a toggle switch (§3.4 switch variant) + label "Generate extra questions with AI" + the **"AI — verify"** badge (§3.5) inline to set expectation. Helper `--fs-small --text-muted`: "AI questions supplement the curated bank. Always double-check them." If no key: toggle is disabled with helper "Add a Gemini key in Settings to turn this on." For English/SAT this whole section is absent (they are AI-only already).
- **Primary action:** A full-width primary button pinned at the bottom of the column (sticky on mobile within safe area): label "Start practice" (Practice mode) / "Start mock exam" (Mock mode). 52px tall, `--fs-body`, `--fw-semibold`.

**States**
- **Empty:** N/A — controls always have defaults (Medium + Practice). The screen is never blank.
- **Loading:** N/A for curated. For Mock on an AI subject, loading happens after pressing Start (see Practice/Mock loading).
- **Error:** If the selected difficulty for a curated subject has zero questions (shouldn't happen given volume target, but defensive), the Start button is disabled and an inline note appears: *"No {difficulty} questions here yet — try another level."*
- **Populated/active:** Selected chip/segment shows selected state; Start button enabled and labeled per mode.
- **AI subject, no key, Mock or AI subject practice:** Start button disabled, replaced helper region shows the **"add a key" note** with an inline "Add a key" secondary button → Settings.

**Interaction**
- Difficulty chips: single select, immediate visual update, no confirm.
- Mode toggle: single select; helper text and Start label update live.
- AI toggle: flips on/off; persists per-session only (not stored globally).
- Start → builds the question set (curated: filter bank by subject/unit/difficulty, shuffle, cap at mock count or a practice cap of 15 for practice mode) and enters Practice (§2.4) or Mock (§2.5).

**Responsive**
- Portrait: sections stacked; difficulty chips wrap to 2×2 if width < 380px, else 1×4. Start button sticky-bottom, full width.
- Laptop: difficulty chips 1×4; mode toggle max-width 420px; Start button inline at column bottom (not sticky), max-width 320px, left-aligned under content.

---

### 2.4 Practice Session

**Purpose:** Answer one question at a time with instant feedback + explanation.

**Layout** (`max-width: var(--content-max)`, centered)
- **Sticky session header** (`position:sticky; top:0; z-index:var(--z-sticky)`, `--surface` with bottom `--border`, slight blur not required):
  - Left: back/exit icon (chevron) → opens "Leave session?" confirm (§3.10) if mid-session.
  - Center: subtle **progress bar** (§3.6) spanning, plus "Q {i} of {n}" text above it (`--fs-small --text-muted`).
  - Right: **live score** ("✓ {correct}/{answered}") and **streak** ("🔥 {streak}" using a flame inline SVG, NOT emoji-dependent — use SVG with `currentColor`; the count in `--font-mono`). Streak shows only when ≥2.
- **Question card** (§3.x — the centerpiece): `--surface`, `--r-lg`, `--shadow-md`, padding `--sp-6`.
  - Top meta row inside card: subject accent dot + unit name (`--fs-small --text-muted`) on the left; on the right the source **badge**: nothing extra for curated, "AI — verify" badge for science AI extra, "AI" badge for English/SAT.
  - Question text: `--fs-body-lg`, `--fw-medium`, `--text-primary`, `--lh-body`. Rendered via `textContent` (XSS-safe).
  - **Four option buttons A–D** (§3.7) stacked vertically, `--sp-3` gap, each min-height 56px, full width. Each shows a letter token (A/B/C/D in a rounded square) + option text.
- **Action zone** below options:
  - Before answering: hint line `--fs-small --text-muted`: "Tap an answer to check it." (or hidden — keep minimal).
  - After answering: **Explanation reveal** panel (§ below) animates open.
  - **Next button** (full width, primary) appears after answering: "Next question" (or "See results" on the last question).

**Answer interaction (the core moment)**
1. Tap an option → that option enters **selected** state instantly, all options become non-interactive (`aria-disabled`), the engine grades.
2. Correct option always turns **correct** (green: `--success`, `--success-soft` fill, check icon). If the chosen option was wrong, it turns **incorrect** (red: `--danger`, `--danger-soft`, x icon) AND the correct one is also revealed green.
3. A subtle pop (`--ease-spring`, scale 1→1.02→1 over `--t-base`) on the correct option; reduced-motion: no scale, just color.
4. Score + streak update in header (streak resets to 0 on wrong; increments on right).
5. Explanation panel reveals: a left-accent-bordered block (`--bg-subtle` fill, 3px left border in `--success` or `--danger` to match result), heading "Why" (`--fs-small --fw-semibold --text-muted` overline), body = explanation (`--fs-body --text-secondary`). For AI-sourced, prefix a one-line `--warning`-toned note: "AI-generated — verify against your notes."
6. "Next question" becomes the focus target.

**States**
- **Empty (no questions matched):** Should be prevented at setup, but if reached: centered message in card: *"No questions to show here. Try a different unit or difficulty."* + "Back to setup" button.
- **Loading (AI practice / generating a question):** Question card shows a **loading state**: skeleton lines for the question + four skeleton option rows (shimmer), and a centered status line: *"Writing a fresh question…"* (rotate gently between this and *"Thinking through the options…"* every 2.5s — purely cosmetic, reduced-motion shows just the first). A small spinner (CSS border-spin, paused under reduced-motion → replaced by static "…"). This appears only for AI generation, never for curated (curated is instant).
- **Error (AI generation failed):** Replace card body with an inline error block (§3.11): icon + message depending on failure type (no key / network / parse — exact strings in §4) + two buttons: "Try again" (primary) and "Use curated instead" (secondary, only for science subjects that have a curated bank; absent for English/SAT). Never crash.
- **Populated/answered:** as described in the interaction above.

**Responsive**
- Portrait iPad: card fills width minus page padding; options comfortably tappable; sticky header compact. Next button sticky to bottom safe-area.
- Laptop: card centered at `--content-max`; header stats inline; Next button inline below explanation (not sticky), full card width.

---

### 2.5 Mock Exam Session

**Purpose:** Timed, real counts, NO feedback until the end.

**Layout**
- **Sticky exam header**: 
  - Left: exit icon → "Leave the exam?" confirm (warns progress is lost).
  - Center: **Timer** (§3.8) — large, `--font-mono`, "MM:SS", with a thin time-progress bar beneath. Turns `--warning` at ≤10% time, never blinks aggressively (calm).
  - Right: "Q {i} of {n}" and a small "flag" toggle (mark for review) — optional but specified: a flag icon button, 44px, toggles a "marked" state on the current question (used in the navigator).
- **Question card**: same structure as Practice EXCEPT:
  - No source-feedback colors. Selecting an option shows **selected** state only (accent ring), NEVER correct/incorrect.
  - No explanation, no score, no streak during the exam.
  - Badges (AI / AI — verify) still shown (source labeling is honesty, not feedback).
- **Question navigator:** a horizontally scrollable strip OR a collapsible grid of numbered cells (1…n). Each cell: answered (filled `--primary-soft`), unanswered (outline), flagged (small dot), current (solid `--primary` ring). Tapping a cell jumps to that question. On laptop, show as a wrapped grid in a right rail; on portrait, a single scrollable row pinned above the nav buttons OR behind a "Questions" sheet toggle to save space.
- **Nav buttons:** "Previous" (ghost) and "Next" (primary). On the last question, primary becomes "Review & submit" → opens submit confirm (§3.10): "Submit your exam? You've answered {x} of {n}." with "Submit" / "Keep going."
- **Auto-submit:** when timer hits 0:00, auto-submit with a toast: "Time's up — here's your review." → go to Review screen.

**States**
- **Empty:** prevented; if no questions, same as Practice empty.
- **Loading (AI mock generation — English/SAT):** A dedicated **generation screen** (not the question card): centered, a progress bar (§3.6 determinate) "Generating your mock exam… {k} of {n} questions", subtext "This can take a moment. Keep this screen open." Cancel button (secondary): "Cancel". If a key is missing this screen never shows — gated earlier. Batch with visible incrementing count per SPEC.
- **Error (AI mock generation failed mid-batch):** Show inline error with counts: "Generated {k} of {n} before a problem." + "Try again" / "Start with {k} questions" (if k ≥ some sane min like 10) / "Cancel". Curated mocks never hit this.
- **Populated/in-progress:** as above; selecting answers updates navigator and answered count only.

**Responsive**
- Portrait: timer centered top; navigator as a "Questions ({answered}/{n})" button opening a bottom sheet grid; Prev/Next pinned bottom.
- Laptop: timer top-center; persistent question navigator grid in a right rail (240px); Prev/Next inline below card.

---

### 2.6 Mock Exam — Review Screen

**Purpose:** After submit (manual or auto), show EVERY question with his answer, the correct answer, and the explanation.

**Layout** (`max-width: var(--content-max)`)
- Top **summary band** (reuse End-of-Session summary block §2.7 visual): score, time used, accuracy, weakest unit.
- A filter row (chips, single-select): "All" / "Incorrect" / "Skipped" / "Flagged". Default "All". (Helps him study the misses.)
- A vertical list of **review items**, one per question:
  - Header: "Q{i}" + result tag — a small badge: "Correct" (`--success`), "Incorrect" (`--danger`), or "Skipped" (`--text-muted` neutral). Source badge (AI / AI — verify) if applicable.
  - Question text (`--fs-body`, `--text-primary`).
  - Options A–D shown statically: the **correct** option styled green (always), **his wrong choice** (if any) styled red, others neutral. A small label "Your answer" on his pick, "Correct answer" on the right one.
  - Explanation block (always shown here), "Why" overline + text. AI note if AI-sourced.
- Bottom actions: "Back to subjects" (primary) and "Retry weak ones" (secondary — builds a practice set from his incorrect questions in this exam).

**States**
- **Empty:** N/A (review always has the exam's questions). If filter yields none (e.g. "Incorrect" but he got all right), show a friendly inline note: *"Nothing here — you didn't miss any. Nice."*
- **Loading:** N/A (all data is local at submit time).
- **Error:** N/A (no network). If state is somehow lost, fallback to subjects with toast "We couldn't load that review."
- **Populated:** full list as above.

**Responsive**
- Portrait: single column; each review item is a card with generous spacing.
- Laptop: same single column at `--content-max` (long-form reading is better narrow); summary band may show stats in a 4-up row.

---

### 2.7 End-of-Session Summary (Practice)

**Purpose:** Close a practice session with an encouraging, honest recap.

**Layout**
- A centered **summary panel** (`--surface`, `--r-xl`, `--shadow-lg`, padding `--sp-8`):
  - Top: a calm result line, NOT a grade. Headline varies by accuracy band (see §4 microcopy): e.g. "Strong set." / "Solid work." / "Good practice — keep going."
  - **Big score:** "{correct} / {total}" in `--fs-display`, `--fw-bold`, `--font-mono`. Below it accuracy "{x}% accuracy" `--fs-h3 --text-muted`.
  - **Stat tiles row** (§3.9): "Time" (mm:ss), "Best streak" ({n}), "Weakest unit" (unit name or "—" if all even/too few). 
  - **Weak-unit callout** (§4): if a weakest unit is identifiable (≥ a small threshold of answers), a soft `--warning-soft` banner: "Spend a little time on {unit} — that's where the misses clustered." with a button "Practice {unit}".
  - Actions: "Practice again" (primary, same setup) and "Back to subjects" (secondary).

**States**
- **Empty:** N/A — a summary only exists after ≥1 answered question. If a session is exited before any answer, skip the summary and return to setup.
- **Loading:** N/A.
- **Error:** N/A. If localStorage write of the new stats fails, still show the summary; toast: "Couldn't save this session's progress." (rare).
- **Populated:** as above. If too few questions to name a weakest unit, hide the callout and show neutral "Keep practicing to spot your weak units."

**Responsive**
- Portrait: panel full width (minus padding); stat tiles wrap 2×2 or stack.
- Laptop: panel max-width 560px centered; stat tiles in a 3-up row.

---

### 2.8 Progress Dashboard

**Purpose:** See accuracy per subject and per unit, total answered, and where to focus.

**Entry:** From the overall progress strip on Home (tap it) and/or a "Progress" affordance. **Decision:** make the Home overall-strip tappable → opens dashboard; also add a small "View progress" text-button under the strip for discoverability.

**Layout** (`max-width: var(--content-max)`)
- Back → "Back to subjects".
- `<h1>`: "Your progress".
- **Overview tiles** (§3.9): "Total answered", "Overall accuracy", "Day streak", "Best streak".
- **Per-subject section:** a list of 6 rows, each: subject accent dot + name, a **progress bar** (§3.6) tinted with the subject accent showing accuracy, and "{x}% · {n} answered" trailing. Tapping a subject row expands (accordion) its **per-unit** bars:
  - Each unit: name, mini accuracy bar (subject accent), "{x}% ({c}/{a})". Units with accuracy below a threshold (e.g. <60% with ≥5 answered) get a **weak-unit highlight**: a `--warning` dot before the name + the bar's track tinted `--warning-soft`. A trailing "Practice" link builds a set for that unit.

**States**
- **Empty (no progress at all):** Replace the per-subject list with a centered empty state: a simple inline SVG (calm, e.g. a small bar-chart outline in `--text-muted`), headline *"No progress yet"*, body *"Answer a few questions and your accuracy will show up here."*, primary button "Start practicing" → Home/subjects. Overview tiles show "0" / "—%".
- **Partial (some subjects untouched):** Untouched subjects show "Not started" in `--text-muted` with an empty bar track (no fill), no weak highlight. Don't show 0% as red.
- **Loading:** N/A (local).
- **Error (corrupt data):** Fallback to empty state + the same reset toast as Home.
- **Populated:** full bars + weak highlights.

**Responsive**
- Portrait: single column; accordions full width.
- Laptop: overview tiles 4-up; subject list single column at `--content-max`; expanded unit bars indented.

---

### 2.9 Settings Panel

**Purpose:** Theme, reset progress (with confirm), Gemini API key. Reachable everywhere; never a gate.

**Presentation:** A modal **sheet** — on portrait it slides up from bottom (`--surface-raised`, `--r-lg` top corners, max-height 90vh, scrollable) with a drag-handle affordance (visual only). On laptop it's a centered modal dialog (max-width 480px, `--r-lg`, `--shadow-xl`). Scrim `--overlay`, dismiss on scrim tap / Esc / a close (×) button top-right. `role="dialog" aria-modal="true" aria-labelledby`. Focus trap inside; restore focus to the gear on close.

**Layout (sections, each separated by `--border` divider)**
- Title "Settings" (`--fs-h2`) + close button.
- **Appearance:** label "Theme" + a **segmented theme toggle**: "Light" / "Dark" (and optionally "System" — **Decision: include "System"** as a third segment so it can follow the device; default selection reflects current resolved choice). Changing it applies instantly and persists to `localStorage.theme`.
- **Gemini AI:** 
  - Label "Gemini API key" + helper (the **"add a key" note**, §4) shown when no key is set.
  - An input field (`type="password"`, `inputmode="text"`, `autocomplete="off"`, `--fs-body`, monospace) with a "Show"/"Hide" toggle button (reveals the value the user typed; never logs it). Placeholder: "Paste your key".
  - When a key IS saved: show a masked confirmation row "Key saved ••••{last4}" with a "Remove key" text-button (`--danger` text). Never render the full key back to the DOM.
  - A "Save key" primary button (disabled until the field is non-empty/changed). On save: store to `localStorage.gemini_api_key`, toast "Key saved.", collapse the input to the masked row.
  - A muted link-style line: "Get a free key at Google AI Studio" — **rendered as plain text, NOT a clickable link** (offline file:// + no external nav requirement; show the URL text `aistudio.google.com/apikey` as selectable text). (Keeps SPEC's no-leak/no-history rule simple.)
  - Helper under the field: "Your key stays on this device. It's only sent to Google when generating AI questions."
- **Data:** "Reset progress" — a `--danger`-outline button. Tap → **confirm dialog** (§3.10) with the exact reset copy (§4). Confirming clears progress keys from localStorage (NOT theme, NOT the API key — be explicit) and toasts "Progress reset." Then dashboard/home reflect the empty state.
- **About (small, muted):** "Offline study app · Grade 12 Natural Science" + a tiny version string.

**States**
- **Empty (no key, fresh):** key field shown with the "add a key" helper; reset button present (resetting nothing is harmless but confirm still appears). 
- **Loading:** Saving the key is synchronous (localStorage) → no spinner. If validating the key by a test call is implemented (optional), show inline "Checking…" on the Save button; on failure show the relevant Gemini error string (§4) inline below the field, key still saved locally (user may be offline now, online later).
- **Error:** localStorage write failure → inline error "Couldn't save to this device's storage." Key reveal/parse errors fall back gracefully.
- **Populated (key saved):** masked row + Remove; theme reflects choice.

**Responsive**
- Portrait: bottom sheet, full width, large tap targets, sticky title.
- Laptop: centered dialog.

---

## 3. COMPONENT SPECS

All interactive components: min tap target **44×44px** (use min-height/min-width or padding to guarantee it). All use tokens; no hardcoded colors. All have a visible `:focus-visible` ring (§5).

### 3.1 Subject Card
- **Container:** `<button>` or `<a role="button">`, full width of grid cell, `--surface`, `border:1px solid var(--border)`, `--r-md`, `--shadow-sm`, padding `--sp-5`, text-align left, min-height 132px, `display:flex; flex-direction:column; justify-content:space-between`.
- **Icon chip:** 44×44, `--r-sm`, background = `--subject-{x}-soft`, containing a subject glyph (inline SVG) colored `--subject-{x}`.
- **Title:** subject name, `--fs-h2`, `--fw-semibold`, `--text-primary`. AI subjects: trailing "AI" badge.
- **Stats:** two lines `--fs-small`: "{n} answered" (`--text-secondary`) and "{x}% accuracy" (`--text-muted`). Empty: "Not started yet".
- **States:** rest (above); active/pressed: `--surface-hover` + `transform: scale(.985)` (`--t-fast`); focus-visible: focus ring; selected: N/A (navigates immediately). No hover-only behavior; a desktop hover may lift `--shadow-md` but is purely decorative.
- **Tokens:** `--surface, --border, --r-md, --shadow-sm, --subject-*, --subject-*-soft, --fs-h2, --fs-small, --text-*`.

### 3.2 Unit Pill / Row
- **Container:** `<button>`, full width (portrait) or grid cell (laptop), `--surface`, `1px --border`, `--r-sm`, min-height 56px, padding `--sp-3 var(--sp-4)`, `display:flex; align-items:center; justify-content:space-between`.
- **Label:** unit name, `--fs-body`, `--fw-medium`, `--text-primary`.
- **Trailing:** optional accuracy chip "{x}%" (`--fs-micro`, `--fw-semibold`, `--text-muted`, `--bg-subtle` pill). For "All units": leading check affordance + `--primary-soft` fill + `--primary` text + `--fw-semibold`.
- **States:** rest; pressed `--surface-hover`+scale .99; selected (if used as toggle): `border-color:--primary; box-shadow: inset 0 0 0 1px var(--primary)`; disabled: `--text-disabled`, `--bg-subtle`, `cursor:default`, `aria-disabled`.
- **Tokens:** `--surface,--border,--r-sm,--fs-body,--bg-subtle,--primary,--primary-soft,--text-*`.

### 3.3 Difficulty Chip
- **Container:** `<button role="radio">` inside a `role="radiogroup"`, min-height 44px, padding `--sp-2 var(--sp-4)`, `--r-pill`, `1px --border`, `--surface`, `--fs-small`, `--fw-medium`.
- **Indicator:** 1–4 small dots (4px) below/after the label showing escalating difficulty; filled in `--text-muted` (rest) / accent (selected).
- **States:** rest; selected: `background:--primary-soft; border-color:--primary; color:--primary; --fw-semibold`; pressed: scale .97; disabled: muted; focus ring.
- **Labels:** "Easy", "Medium", "Hard", "Impossible".
- **Tokens:** `--surface,--border,--r-pill,--primary,--primary-soft,--fs-small,--text-muted`.

### 3.4 Mode Toggle (segmented) + Switch (AI toggle)
- **Segmented:** a `role="radiogroup"` container `--bg-subtle`, `--r-pill`, padding 4px; two segments, each `<button role="radio">`, min-height 44px, flex:1, `--fs-body`, `--fw-medium`. Selected segment: `--surface` fill + `--shadow-sm` + `--text-primary` + `--fw-semibold`; the moving fill may animate via `transform` (`--t-base --ease`), reduced-motion = instant. Unselected: `--text-muted`.
- **Switch (AI Extra Practice):** a `role="switch"` button, 52×32 track `--r-pill`, knob 24px circle. Off: track `--border`, knob `--surface`. On: track `--primary`, knob white, knob translateX. Disabled: `--text-disabled` track, no interaction. Always paired with a visible text label (not the switch alone) and a 44px hit area.
- **Tokens:** `--bg-subtle,--surface,--shadow-sm,--primary,--border,--r-pill,--text-*`.

### 3.5 Badge (AI / AI — verify / Curated)
- **Base:** inline-flex, `--fs-micro`, `--fw-semibold`, `--ls-wide`, padding `2px 8px`, `--r-xs`, line-height 1.4, non-interactive (`aria-hidden="false"` with readable text; include an `sr-only` expansion if needed).
- **"AI"** (English/SAT): background `--primary-soft`, text `--primary`. Text: "AI".
- **"AI — verify"** (science extra practice): background `--warning-soft`, text `--warning`, with a small caution glyph. Text: "AI — verify". Tooltip/`title`: "AI-generated — double-check this one."
- **Curated:** by default NO badge (per SPEC). Optional subtle "Curated" badge ONLY inside the mock review for clarity: background `--success-soft`, text `--success`, text "Curated". (Use sparingly; default to none on practice cards.)
- **Tokens:** `--primary-soft,--primary,--warning-soft,--warning,--success-soft,--success,--r-xs,--fs-micro`.

### 3.6 Progress Bar
- **Track:** full width, height 8px (session), 10px (dashboard), `--r-pill`, background `--bg-subtle`.
- **Fill:** `--r-pill`, color = `--primary` (session) or subject accent (dashboard). Width set via inline `style.width = pct%`. Transition width? No — animate via `transform: scaleX()` from a fixed-width fill to avoid layout thrash; or accept `width` transition `--t-slow --ease` for the small session bar (acceptable, single element). Reduced-motion: no transition.
- **A11y:** `role="progressbar"` with `aria-valuenow/min/max` for the determinate generation bar; the decorative session progress bar can be `aria-hidden` since "Q i of n" text conveys it.
- **Tokens:** `--bg-subtle,--primary,--subject-*,--r-pill`.

### 3.7 Option Button (A–D) — the critical component
- **Container:** `<button>`, full width, min-height 56px, padding `--sp-3 var(--sp-4)`, `--r-sm`, `1px solid --border`, `--surface`, text-align left, `display:flex; align-items:center; gap:var(--sp-3)`.
- **Letter token:** 28×28 rounded square (`--r-xs`), `--bg-subtle` bg, `--text-muted` letter (`--font-mono`, `--fw-semibold`). 
- **Option text:** `--fs-body`, `--fw-medium`, `--text-secondary`, `--lh-body`, wraps freely.
- **Result icon slot:** trailing, 20px; check or x SVG, shown only after grading.
- **States:**
  - **default:** as above; pressed feedback `--surface-hover` + scale .99.
  - **selected (pre-grade / mock):** `border-color:--primary; box-shadow: inset 0 0 0 2px var(--primary); background:--primary-soft`; letter token bg `--primary`, letter `--primary-on`.
  - **correct:** `border-color:--success; background:--success-soft; color:--text-primary`; letter token bg `--success`, letter `--success-on`; trailing check icon `--success`. Subtle spring pop.
  - **incorrect:** `border-color:--danger; background:--danger-soft`; letter token bg `--danger`, letter `--danger-on`; trailing x icon `--danger`.
  - **correct-revealed (the right answer when user chose wrong):** same as **correct** styling (so the right answer is always green), plus a tiny "Correct answer" tag.
  - **disabled (post-answer, untouched options):** `opacity:.6; cursor:default; aria-disabled="true"`; keep readable text (don't drop below AA).
- **A11y:** each option `aria-pressed` reflects selection; after grading, `aria-disabled="true"` on all; result conveyed not by color alone — the check/x icons + text tags ("Your answer", "Correct answer") carry it.
- **Tokens:** `--surface,--border,--r-sm,--bg-subtle,--primary,--primary-soft,--primary-on,--success*,--danger*,--text-*,--fs-body`.

### 3.8 Timer (Mock)
- **Display:** `--font-mono`, `--fs-h1`, `--fw-bold`, tabular-nums, `--text-primary`, "MM:SS".
- **Sub-bar:** a 4px time-progress bar beneath (track `--bg-subtle`, fill `--primary`, shrinking as time elapses).
- **Low-time state (≤10% remaining):** text + fill switch to `--warning`. At ≤60s, optionally a single gentle pulse per 10s (reduced-motion: none). Never red-flashing/anxious.
- **A11y:** `role="timer"`, `aria-live="off"` (don't spam SR every second); announce milestones via a polite live region at 5:00, 1:00, 0:30 ("Five minutes left", etc.).
- **Tokens:** `--font-mono,--fs-h1,--text-primary,--warning,--bg-subtle,--primary`.

### 3.9 Stat Tile
- **Container:** `--surface` (or transparent within a strip), `--r-md`, padding `--sp-4`, min-width 0, flex:1.
- **Value:** `--fs-h2` (or `--fs-display` in summary), `--fw-bold`, `--font-mono`, `--text-primary`, tabular-nums.
- **Label:** below, `--fs-small`, `--text-muted`, `--fw-medium`.
- **Empty value:** "—" in `--text-muted` (never a bare "0%" where it looks broken; "0" answered is fine and honest).
- **Tokens:** `--surface,--r-md,--fs-h2,--font-mono,--text-*`.

### 3.10 Modal / Confirm Dialog
- **Scrim:** fixed, `--overlay`, `z-index:--z-overlay`, fade-in `--t-base` (reduced-motion: instant).
- **Dialog:** `--surface-raised`, `--r-lg`, `--shadow-xl`, max-width 420px (confirm) / 480px (settings), padding `--sp-6`, centered (portrait confirm may also center; settings = bottom sheet portrait). Entrance: translateY(8px)+fade `--t-base --ease-out`; reduced-motion: fade only.
- **Structure:** title (`--fs-h3 --fw-semibold`), body (`--fs-body --text-secondary`), action row (right-aligned laptop, full-width stacked portrait): a secondary "Cancel"-type ghost button + a primary/danger confirm button.
- **A11y:** `role="dialog" aria-modal="true"`, labelled by title id, focus trap, Esc closes (= cancel), initial focus on the safest action (Cancel for destructive dialogs), restore focus on close.
- **Destructive variant (reset/leave):** confirm button uses `--danger` fill, `--danger-on` text.
- **Tokens:** `--surface-raised,--r-lg,--shadow-xl,--overlay,--danger,--primary,--text-*`.

### 3.11 Toast / Inline Error
- **Toast:** bottom-center (portrait) / bottom-right (laptop), `--surface-raised`, `1px --border`, `--r-md`, `--shadow-lg`, padding `--sp-3 var(--sp-4)`, max-width 360px, `--fs-small`. Slide+fade in `--t-base`; auto-dismiss 4–6s; manual dismiss × . `role="status"` (polite) for success/info, `role="alert"` (assertive) for errors. Stack vertically, gap `--sp-2`.
- **Inline error block** (used in session/setup when something fails): `--danger-soft` background, `1px --danger-border`, `--r-md`, padding `--sp-4`, with a danger icon, a `--fw-semibold --text-primary` headline, a `--fs-small --text-secondary` body, and action button(s). Lives in-flow (not floating).
- **Tokens:** `--surface-raised,--danger-soft,--danger-border,--r-md,--shadow-lg,--text-*`.

---

## 4. MICROCOPY (exact, normative strings)

Voice: calm, encouraging, plain English. Second person ("you"). No exclamation overload, no jargon, no shame. Sentence case for body; Title case only for screen titles and button labels where natural.

### 4.1 Global / navigation
- App title: **Exam Prep**
- App subtitle: **Grade 12 Natural Science**
- Settings button label (a11y): **Settings**
- Back labels: **Back to subjects** · **Back to units** · **Back to setup**
- Home footer: **All progress is saved on this device.**

### 4.2 Subject grid
- Empty encourager: **Pick a subject to start your first set.**
- Card stat (no progress): **Not started yet**
- Card stats (with progress): **{n} answered** · **{x}% accuracy**
- Overall strip labels: **Answered** · **Accuracy** · **Day streak**
- View progress button: **View progress**
- Corrupt-data toast: **Couldn't read your saved progress, so it's been reset. Your questions are unaffected.**

### 4.3 Unit picker
- "All units" row: **All units** · sublabel **Recommended**
- Curated subtitle: **{m} units · {n} questions in the bank**
- AI subtitle: **Questions are generated with AI.**
- No-questions fallback: **No questions found for this subject yet.**

### 4.4 Session setup
- Title: **Set up your session**
- Difficulty overline: **DIFFICULTY** · chips: **Easy** / **Medium** / **Hard** / **Impossible**
- Mode overline: **MODE** · segments: **Practice** / **Mock Exam**
- Practice helper: **Instant feedback and an explanation after each question.**
- Mock helper: **{N} questions · {T} min · no feedback until the end.**
- AI Extra Practice overline: **AI EXTRA PRACTICE**
- AI toggle label: **Generate extra questions with AI**
- AI toggle helper: **AI questions supplement the curated bank. Always double-check them.**
- AI toggle disabled helper: **Add a Gemini key in Settings to turn this on.**
- Start buttons: **Start practice** / **Start mock exam**
- No-questions-for-tier note: **No {difficulty} questions here yet — try another level.**

### 4.5 Practice session
- Pre-answer hint: **Tap an answer to check it.**
- Explanation overline: **Why**
- AI explanation prefix: **AI-generated — verify against your notes.**
- Next buttons: **Next question** / **See results**
- Score (a11y of header): **{correct} correct of {answered} answered**
- Streak (a11y): **{n} in a row**
- Empty: **No questions to show here. Try a different unit or difficulty.** + button **Back to setup**

### 4.6 AI generation states (Practice)
- Loading (rotating): **Writing a fresh question…** / **Thinking through the options…**
- Mock loading: **Generating your mock exam… {k} of {n} questions** · sub: **This can take a moment. Keep this screen open.**
- Buttons: **Try again** · **Use curated instead** · **Cancel**

### 4.7 Gemini error messages (exact)
- **No key:** **Add a free Gemini key in Settings to unlock unlimited AI questions.** (matches SPEC wording)
- **Network failure:** **Couldn't reach Gemini. Check your internet connection and try again.**
- **Parse failure (after one retry):** **Gemini sent something we couldn't read. Try again, or use the curated questions.**
- **Bad/expired key (401/403):** **That key didn't work. Check it in Settings and try again.**
- **Model not found (404 on model name):** **AI questions are temporarily unavailable. The curated bank still works offline.**
- **Rate limited (429):** **Too many requests right now. Wait a moment and try again.**
- **Generic fallback:** **Something went wrong generating questions. The curated bank still works offline.**

### 4.8 Mock exam
- Timer a11y milestones: **Five minutes left.** / **One minute left.** / **Thirty seconds left.**
- Flag toggle (a11y): **Mark for review** / **Unmark**
- Nav: **Previous** / **Next** / **Review & submit**
- Questions sheet button: **Questions ({answered}/{n})**
- Submit confirm title: **Submit your exam?**
- Submit confirm body: **You've answered {x} of {n} questions. You can't change answers after this.**
- Submit confirm buttons: **Submit** / **Keep going**
- Leave exam confirm title: **Leave the exam?**
- Leave exam body: **Your progress in this exam will be lost.**
- Leave exam buttons: **Leave** / **Stay**
- Auto-submit toast: **Time's up — here's your review.**

### 4.9 Mock review
- Filter chips: **All** / **Incorrect** / **Skipped** / **Flagged**
- Result tags: **Correct** / **Incorrect** / **Skipped**
- Option labels: **Your answer** / **Correct answer**
- Empty filter (no incorrect): **Nothing here — you didn't miss any. Nice.**
- Actions: **Back to subjects** / **Retry weak ones**

### 4.10 End-of-session summary (Practice)
- Headlines by accuracy band:
  - ≥90%: **Excellent set.**
  - 70–89%: **Strong work.**
  - 50–69%: **Good practice — keep going.**
  - <50%: **Tough set — that's how you learn.**
- Accuracy line: **{x}% accuracy**
- Stat labels: **Time** / **Best streak** / **Weakest unit**
- Weak-unit callout (with unit): **Spend a little time on {unit} — that's where the misses clustered.** + button **Practice {unit}**
- Weak-unit callout (too few): **Keep practicing to spot your weak units.**
- Actions: **Practice again** / **Back to subjects**
- Stats-save failure toast: **Couldn't save this session's progress.**

### 4.11 Progress dashboard
- Title: **Your progress**
- Overview labels: **Total answered** / **Overall accuracy** / **Day streak** / **Best streak**
- Subject trailing: **{x}% · {n} answered**
- Untouched subject: **Not started**
- Unit trailing: **{x}% ({c}/{a})**
- Weak unit (a11y): **Needs work**
- Per-unit action: **Practice**
- Empty headline: **No progress yet**
- Empty body: **Answer a few questions and your accuracy will show up here.**
- Empty button: **Start practicing**

### 4.12 Settings
- Title: **Settings**
- Theme label: **Theme** · segments: **Light** / **Dark** / **System**
- Gemini section label: **Gemini API key**
- "Add a key" note (no key): **Add a free Gemini key to unlock unlimited AI questions. The curated bank works without one.**
- Key input placeholder: **Paste your key**
- Show/Hide buttons: **Show** / **Hide**
- Save button: **Save key**
- Saved row: **Key saved ••••{last4}** · remove: **Remove key**
- Privacy helper: **Your key stays on this device. It's only sent to Google when generating AI questions.**
- Get-a-key line (plain text): **Get a free key at Google AI Studio: aistudio.google.com/apikey**
- Save success toast: **Key saved.**
- Remove key toast: **Key removed.**
- Storage error: **Couldn't save to this device's storage.**
- Reset button: **Reset progress**
- Reset confirm title: **Reset all progress?**
- Reset confirm body: **This clears your scores, accuracy, streaks, and weak-unit history on this device. Your theme and API key are kept. This can't be undone.**
- Reset confirm buttons: **Reset** / **Cancel**
- Reset success toast: **Progress reset.**
- About line: **Offline study app · Grade 12 Natural Science**

### 4.13 Leave-session (practice) confirm
- Title: **Leave this session?**
- Body: **Your answers so far won't be saved.**
- Buttons: **Leave** / **Stay**

---

## 5. ACCESSIBILITY

Target: WCAG 2.1 **AA**. Operable by touch and keyboard, no hover dependence, reduced-motion safe.

### 5.1 Focus-visible
- Global rule:
```css
:where(button, a, input, [role="button"], [role="radio"], [role="switch"], [tabindex]):focus-visible{
  outline: none;
  box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--focus-ring);
  border-radius: inherit;
}
```
- Never remove focus styles without replacement. `:focus:not(:focus-visible)` may suppress the ring for mouse, but keyboard/AT always shows it.
- On screen change, move focus to the new screen's `<h1 tabindex="-1">`.

### 5.2 ARIA roles & semantics
- Screens: `role="region"` + `aria-label`.
- Subject grid: a `<ul>`/`<li>` or `role="list"`; each card is a real `<button>`/`<a>`.
- Difficulty: `role="radiogroup"` with `role="radio"` + `aria-checked`.
- Mode segmented control: `role="radiogroup"` + `role="radio"`.
- AI toggle: `role="switch"` + `aria-checked`.
- Options A–D: native `<button>` with `aria-pressed`; after grade, `aria-disabled="true"`; the correct/incorrect status is announced via an `aria-live="polite"` results region ("Correct" / "Incorrect. The answer is C."), not color alone.
- Progress (determinate generation): `role="progressbar"` + `aria-valuenow/min/max/aria-valuetext`.
- Timer: `role="timer"`; milestone announcements via a separate `aria-live="polite"` region.
- Modals: `role="dialog" aria-modal="true"`, labelled by title, focus trapped, Esc = cancel.
- Toasts: info/success `role="status"` (polite); errors `role="alert"` (assertive).
- Icons that are purely decorative: `aria-hidden="true"`. Icon-only buttons: always an `aria-label`.
- Badges convey meaning in text ("AI", "AI — verify") — readable, not color-only.

### 5.3 Keyboard operability
- All actions reachable and operable via Tab/Shift+Tab + Enter/Space.
- Radio groups (difficulty/mode): Arrow keys move selection, Space/Enter selects; roving `tabindex`.
- Options A–D: also bindable to keys **A/B/C/D and 1/2/3/4** as a convenience (document but optional); Enter/Space on focus always works.
- Mock navigator cells: Tab-navigable; Enter jumps.
- Esc closes any modal/sheet (= cancel). Submit/destructive confirms default-focus the non-destructive button.
- No keyboard trap except intentional modal focus-trap (which Esc releases).

### 5.4 Color contrast (AA) — verified intent
- Body text `--text-secondary` on `--surface`: ≥ 7:1 (light), ≥ 7:1 (dark) — AAA-ish; comfortable.
- `--text-muted` on `--surface`: ≥ 4.5:1 both themes (used for ≥14px text only; never for <14px critical text below 4.5:1).
- Primary button: `--primary-on` on `--primary` ≥ 4.5:1 both themes.
- Success/danger fills with their `-on` text ≥ 4.5:1.
- Subject accents as **text/icons**: each `--subject-*` on `--surface` and on `--subject-*-soft` meets ≥ 3:1 for large/icon use; `--subject-math` is the constrained one and was darkened to `#B8851E` to clear AA-large on light and reads fine on dark.
- **Never rely on color alone:** correct/incorrect always pair with an icon (check/x) and a text tag; weak units pair the warning tint with a "Needs work" label/dot; badges carry words.
- The engineer must spot-check final values with a contrast tool; if any pair misses, deepen the text token, do not lighten background.

### 5.5 Reduced motion
```css
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
    scroll-behavior: auto !important;
  }
}
```
- Replace the answer "pop", segmented slide, toast slide, modal translate, skeleton shimmer, spinner with instant or static equivalents (e.g. spinner → static "…"; shimmer → flat `--bg-subtle`).
- The timer never blinks under reduced motion; low-time is conveyed by the `--warning` color + text milestones only.

### 5.6 Tap targets & touch
- Every interactive element ≥ 44×44px effective (use min-height/min-width + padding; expand hit area with padding, not just visual size).
- Spacing between adjacent tap targets ≥ `--sp-2` (8px) to prevent mis-taps.
- No functionality behind hover; pressed/active states give touch feedback.
- Inputs use appropriate `inputmode`/`autocomplete`; the key field is `type="password"` with a Show toggle.

### 5.7 Text & zoom
- Root font-size respects user/browser settings (rem-based scale). Layout must not break at 200% zoom: columns reflow, no clipped text, no horizontal scroll on the primary content column at iPad portrait widths.
- Line length capped via `--content-max` for readability.

---

## 6. Implementation notes (binding)
- Single inline `<style>`; all tokens in `:root` + the two `[data-theme]` blocks. No external stylesheet, no `<link>` font.
- Theme: set `document.documentElement.dataset.theme = 'light'|'dark'`; "System" stores `theme:'system'` and resolves via `matchMedia('(prefers-color-scheme: dark)')` + listener.
- All question/option/explanation text rendered with `textContent` or `createElement` + `.append` — NEVER `innerHTML` for any bank/AI string (SPEC security).
- localStorage keys used by design: `theme`, `gemini_api_key`, and the progress blob (engineer's schema). All reads wrapped in try/catch with default fallback; corrupt → empty state + the reset toast (§4.2).
- Icons: inline SVG, `fill="currentColor"`/`stroke="currentColor"`, sized via `width/height` or `em`; decorative ones `aria-hidden`.
- Use `font-variant-numeric: tabular-nums` on all live-updating numbers (timer, score, streak) to prevent width jitter.

---

*End of DESIGN_SPEC.md — every value above is concrete and normative. Build to it exactly.*
