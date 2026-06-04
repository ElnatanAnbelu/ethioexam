# FORMAT.md — Compact bank format + official MoE unit taxonomy (Grades 9–12)

This is the FROZEN contract for the grade-expansion pass. Both the app (hydration + filters) and
every content-generation agent use these exact unit names and this exact compact row shape.

## Compact question row (short keys — for file-size on iPad)
Each subject's curated bank is a JS array assigned to a global, e.g. `window.QB_PHYSICS = [ ...rows... ];`
Subject is implied by which array the row lives in (so it is NOT stored per row).

Each row is an object with SHORT keys:
```
{ i:"phys-g9-mot-001", g:9, u:"Motion in a Straight Line", d:"easy", t:"calculation",
  q:"…question…", o:["optA","optB","optC","optD"], c:2, e:"…worked explanation…" }
```
- `i` = unique id, kebab: `<subjcode>-g<grade>-<unitcode>-<seq>` (subjcode: phys|chem|bio|math).
- `g` = grade ∈ 9 | 10 | 11 | 12 (number).
- `u` = unit — MUST be one of the official unit names for that subject+grade below (exact string).
- `d` = difficulty ∈ "easy" | "medium" | "hard" | "impossible".
- `t` = type, short string ("calculation" | "conceptual" | "definition" | "application").
- `q` = question text.
- `o` = array of EXACTLY 4 options [A,B,C,D], all non-empty, mutually distinct.
- `c` = index of the correct option in `o`: 0=A, 1=B, 2=C, 3=D.
- `e` = 1–3 sentence worked explanation of why the correct option is right.
- `source` is implied "curated" (not stored).

## Hydration (app side)
At load, each compact row hydrates to the full object the app already uses:
```
{ id:i, subject:<from array>, grade:g, unit:u, difficulty:d, type:t,
  question:q, options:{A:o[0],B:o[1],C:o[2],D:o[3]}, correct:["A","B","C","D"][c],
  explanation:e, source:"curated" }
```
`CURATED_BANK` = concat of hydrated QB_PHYSICS, QB_CHEMISTRY, QB_BIOLOGY, QB_MATH.
Hydration must be defensive: skip any row missing fields / with o.length≠4 / c out of range (do not crash).

## Official MoE new-curriculum unit taxonomy (use these EXACT unit names)

### PHYSICS  (subjcode `phys`)
- **G9:** Physics & Human Society · Physical Quantities · Motion in a Straight Line · Force, Work, Energy & Power · Simple Machines · Mechanical Oscillation & Sound Wave · Temperature & Thermometer
- **G10:** Vector Quantities · Uniformly Accelerated Motion · Elasticity & Static Equilibrium of Rigid Body · Static & Current Electricity · Magnetism · Electromagnetic Waves & Geometrical Optics
- **G11:** Physics & Human Society · Vectors · Motion in One and Two Dimensions · Dynamics · Heat Conduction & Calorimetry · Electrostatics & Electric Circuit · Nuclear Physics
- **G12:** Application of Physics · Two-Dimensional Motion · Fluid Mechanics · Electromagnetism · Electronics
- Concentrate volume on mechanics (kinematics, Newton's laws, momentum, rotational motion, gravitation) and electricity/magnetism.

### CHEMISTRY  (subjcode `chem`)
- **G9:** Chemistry & Its Importance · Measurements & Scientific Methods · Structure of the Atom · Periodic Classification of Elements · Chemical Bonding
- **G10:** Chemical Reactions & Stoichiometry · Solutions · Important Inorganic Compounds · Energy Changes & Electrochemistry · Metals & Nonmetals · Hydrocarbons
- **G11:** Atomic Structure & Periodic Properties · Chemical Bonding · Physical States of Matter · Chemical Kinetics · Chemical Equilibrium · Oxygen-Containing Organic Compounds
- **G12:** Acid–Base Equilibria · Electrochemistry · Industrial Chemistry · Polymers · Introduction to Environmental Chemistry
- Concentrate volume on stoichiometry/mole, atomic structure & bonding, equilibrium & acid–base, electrochemistry, organic.

### BIOLOGY  (subjcode `bio`)
- **G9:** Introduction to Biology · Characteristics & Classification of Organisms · Cells · Reproduction · Human Health, Nutrition & Disease · Ecology
- **G10:** Sub-fields of Biology · Plants · Biochemical Molecules · Cell Reproduction · Human Biology · Ecological Interaction
- **G11:** Biology & Technology · Characteristics of Animals · Enzymes · Genetics · The Human Body Systems · Population & Natural Resources
- **G12:** Applications of Biology · Microorganisms · Energy Transformation · Evolution · The Human Body Systems · Climate Change
- Concentrate volume on cell biology, genetics, human body systems, microbiology/biotechnology, ecology, evolution.

### MATHEMATICS (Natural Science)  (subjcode `math`)
- **G9:** Further on Sets · The Number System · Solving Equations · Solving Inequalities · Introduction to Trigonometry · Regular Polygons · Congruency & Similarity · Vectors in Two Dimensions · Statistics & Probability
- **G10:** Relations & Functions · Polynomial Functions · Exponential & Logarithmic Functions · Trigonometric Functions · Circles · Solid Figures · Coordinate Geometry
- **G11:** Relations & Functions · Rational Expressions & Rational Functions · Matrices · Determinants & Their Properties · Vectors · Transformations of the Plane · Statistics · Probability
- **G12:** Sequences & Series · Introduction to Calculus · Statistics · Linear Programming · Mathematical Applications in Business
- Concentrate volume on functions, algebra, trigonometry, calculus, statistics/probability, geometry.

## Target distribution per subject (1,000 each)
- By grade: **G9 ≈ 100 · G10 ≈ 200 · G11 ≈ 350 · G12 ≈ 350.**
- By difficulty (within each grade, roughly): **easy 30% · medium 35% · hard 25% · impossible 10%.**
- Spread evenly-ish across the units within each grade. Flag any unit that comes up short.

## Non-negotiables (content)
- Ethiopian MoE new-curriculum ONLY. No US/UK/international/generic syllabus framing. SI units. Ethiopian
  context where natural (Ethiopian minerals, industries, places) but never forced.
- Accuracy gate: generate → independently re-solve → keep ONLY if the re-solved answer matches. A
  confidently-wrong key is worse than no question. Discard anything uncertain or ambiguous.
- 4 options, exactly one correct, worked explanation, no duplicates/near-duplicates.
