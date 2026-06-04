#!/usr/bin/env node
/* transform-bank.js — deterministic bulk transform of the four verbose window.BANK_*
   arrays from index.html into compact QB_* rows, re-tagged to the official MoE
   (grade, unit) taxonomy in FORMAT.md. Prints the distribution, asserts validity,
   and writes banks/qb-<subject>.js. Run: node scripts/transform-bank.js          */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HTML = path.join(ROOT, "index.html");

/* ---- 1. Official MoE unit taxonomy (EXACT names from FORMAT.md) ---- */
const UNIT_TAXONOMY = {
  Physics: {
    9: ["Physics & Human Society","Physical Quantities","Motion in a Straight Line","Force, Work, Energy & Power","Simple Machines","Mechanical Oscillation & Sound Wave","Temperature & Thermometer"],
    10: ["Vector Quantities","Uniformly Accelerated Motion","Elasticity & Static Equilibrium of Rigid Body","Static & Current Electricity","Magnetism","Electromagnetic Waves & Geometrical Optics"],
    11: ["Physics & Human Society","Vectors","Motion in One and Two Dimensions","Dynamics","Heat Conduction & Calorimetry","Electrostatics & Electric Circuit","Nuclear Physics"],
    12: ["Application of Physics","Two-Dimensional Motion","Fluid Mechanics","Electromagnetism","Electronics"],
  },
  Chemistry: {
    9: ["Chemistry & Its Importance","Measurements & Scientific Methods","Structure of the Atom","Periodic Classification of Elements","Chemical Bonding"],
    10: ["Chemical Reactions & Stoichiometry","Solutions","Important Inorganic Compounds","Energy Changes & Electrochemistry","Metals & Nonmetals","Hydrocarbons"],
    11: ["Atomic Structure & Periodic Properties","Chemical Bonding","Physical States of Matter","Chemical Kinetics","Chemical Equilibrium","Oxygen-Containing Organic Compounds"],
    12: ["Acid–Base Equilibria","Electrochemistry","Industrial Chemistry","Polymers","Introduction to Environmental Chemistry"],
  },
  Biology: {
    9: ["Introduction to Biology","Characteristics & Classification of Organisms","Cells","Reproduction","Human Health, Nutrition & Disease","Ecology"],
    10: ["Sub-fields of Biology","Plants","Biochemical Molecules","Cell Reproduction","Human Biology","Ecological Interaction"],
    11: ["Biology & Technology","Characteristics of Animals","Enzymes","Genetics","The Human Body Systems","Population & Natural Resources"],
    12: ["Applications of Biology","Microorganisms","Energy Transformation","Evolution","The Human Body Systems","Climate Change"],
  },
  Mathematics: {
    9: ["Further on Sets","The Number System","Solving Equations","Solving Inequalities","Introduction to Trigonometry","Regular Polygons","Congruency & Similarity","Vectors in Two Dimensions","Statistics & Probability"],
    10: ["Relations & Functions","Polynomial Functions","Exponential & Logarithmic Functions","Trigonometric Functions","Circles","Solid Figures","Coordinate Geometry"],
    11: ["Relations & Functions","Rational Expressions & Rational Functions","Matrices","Determinants & Their Properties","Vectors","Transformations of the Plane","Statistics","Probability"],
    12: ["Sequences & Series","Introduction to Calculus","Statistics","Linear Programming","Mathematical Applications in Business"],
  },
};

/* ---- 2. Wholesale old-unit -> (grade, unit) map for the clear cases ---- */
const WHOLESALE = {
  Physics: {
    "Vectors": [11, "Vectors"],
    "Motion in One and Two Dimensions": [11, "Motion in One and Two Dimensions"],
    "Dynamics / Newton's Laws": [11, "Dynamics"],
    "Rotational Motion and Torque": [12, "Two-Dimensional Motion"],
    "Gravitation / Orbital and Escape Velocity": [12, "Two-Dimensional Motion"],
    "Elasticity and Static Equilibrium": [10, "Elasticity & Static Equilibrium of Rigid Body"],
    "Heat and Calorimetry": [11, "Heat Conduction & Calorimetry"],
    "Electrostatics and Coulomb's Law": [11, "Electrostatics & Electric Circuit"],
    "Capacitors": [11, "Electrostatics & Electric Circuit"],
    "Current Electricity and Resistor Networks": [11, "Electrostatics & Electric Circuit"],
    "Magnetism and Electromagnetism / Induction": [12, "Electromagnetism"], // overrides below for basic
    "Waves and Geometric Optics": [10, "Electromagnetic Waves & Geometrical Optics"],
    "Nuclear Physics": [11, "Nuclear Physics"],
    "Electronics (Diodes, Transistors, Logic Gates)": [12, "Electronics"],
    "AC vs DC Generators": [12, "Electromagnetism"],
  },
  Chemistry: {
    "Atomic structure & periodicity": [11, "Atomic Structure & Periodic Properties"],
    "Chemical bonding": [11, "Chemical Bonding"], // overrides below for basic
    "Stoichiometry & the mole": [10, "Chemical Reactions & Stoichiometry"],
    "States of matter": [11, "Physical States of Matter"],
    "Chemical kinetics": [11, "Chemical Kinetics"],
    "Chemical equilibrium (Le Chatelier)": [11, "Chemical Equilibrium"],
    "Acid–base equilibria & pH/Ka": [12, "Acid–Base Equilibria"],
    "Electrochemistry (cells, electrodes)": [12, "Electrochemistry"],
    "Organic chemistry": null, // fully per-id
    "Polymers": [12, "Polymers"],
    "Industrial & environmental chemistry": null, // per-id
  },
  Biology: {
    "Cell biology": null, // per-id (G9 Cells / G10 Cell Reproduction)
    "Biochemistry/enzymes": [11, "Enzymes"],
    "Genetics (Mendelian crosses, DNA/inheritance)": [11, "Genetics"],
    "Evolution": [12, "Evolution"],
    "Human body systems & physiology": [11, "The Human Body Systems"],
    "Microorganisms": [12, "Microorganisms"],
    "Energy transformation (photosynthesis/respiration)": [12, "Energy Transformation"],
    "Ecology & population": null, // per-id
    "Climate change": [12, "Climate Change"],
  },
  Mathematics: {
    "Functions & relations": null, // per-id (G10 / G11)
    "Rational expressions": [11, "Rational Expressions & Rational Functions"],
    "Matrices & determinants": [11, "Matrices"], // determinant-specific overridden below
    "Vectors": [11, "Vectors"],
    "Sequences & series": [12, "Sequences & Series"],
    "Introduction to calculus": [12, "Introduction to Calculus"],
    "Statistics": [11, "Statistics"],
    "Probability & combinatorics": [11, "Probability"],
    "Trigonometry": null, // per-id (G9 / G10)
    "Solid geometry": [10, "Solid Figures"],
    "Absolute-value inequalities": [9, "Solving Inequalities"],
    "Transformations": [11, "Transformations of the Plane"],
    "Linear programming": [12, "Linear Programming"],
  },
};

/* ---- 3. Per-id overrides for units that split across grades (judged by content) ---- */
const OVERRIDE = {
  // PHYSICS — basic magnetism item -> G10 Magnetism (rest G12 Electromagnetism)
  "phys-g12-mag-001": [10, "Magnetism"],

  // CHEMISTRY — bonding: basic ionic/covalent -> G9
  "chem-g12-bond-005": [9, "Chemical Bonding"],
  "chem-g12-bond-006": [9, "Chemical Bonding"],
  // chem bonding 104/105/215/315 keep wholesale G11

  // CHEMISTRY — organic: hydrocarbons -> G10 Hydrocarbons; oxygen-containing -> G11
  "chem-g12-org-019": [10, "Hydrocarbons"],                 // alkane general formula
  "chem-g12-org-020": [11, "Oxygen-Containing Organic Compounds"], // -OH functional group
  "chem-g12-org-021": [10, "Hydrocarbons"],                 // simplest alkene
  "chem-g12-org-119": [10, "Hydrocarbons"],                 // alkyne formula
  "chem-g12-org-120": [11, "Oxygen-Containing Organic Compounds"], // propanol IUPAC
  "chem-g12-org-121": [11, "Oxygen-Containing Organic Compounds"], // dehydration of ethanol
  "chem-g12-org-217": [10, "Hydrocarbons"],                 // C4H10 isomers
  "chem-g12-org-218": [10, "Hydrocarbons"],                 // propane combustion
  "chem-g12-org-219": [10, "Hydrocarbons"],                 // benzene
  "chem-g12-org-312": [10, "Hydrocarbons"],                 // C5H12 isomers
  "chem-g12-org-313": [10, "Hydrocarbons"],                 // hydrocarbon empirical
  "chem-g12-org-314": [10, "Hydrocarbons"],                 // cis-trans alkene
  "chem-g12-org-321": [10, "Hydrocarbons"],                 // alkane combustion

  // CHEMISTRY — industrial vs environmental
  "chem-g12-env-023": [12, "Introduction to Environmental Chemistry"], // greenhouse gas
  "chem-g12-env-123": [12, "Introduction to Environmental Chemistry"], // acid rain
  "chem-g12-env-221": [12, "Industrial Chemistry"],                    // Contact process

  // BIOLOGY — cell biology: organelles/transport -> G9 Cells; cell division -> G10 Cell Reproduction
  "bio-g11-cell-001": [9, "Cells"], "bio-g11-cell-002": [9, "Cells"], "bio-g11-cell-003": [9, "Cells"],
  "bio-g11-cell-004": [9, "Cells"], "bio-g11-cell-005": [9, "Cells"], "bio-g11-cell-006": [9, "Cells"],
  "bio-g11-cell-007": [9, "Cells"], "bio-g11-cell-009": [9, "Cells"], "bio-g11-cell-012": [9, "Cells"],
  "bio-g11-cell-008": [10, "Cell Reproduction"], // mitosis
  "bio-g11-cell-010": [10, "Cell Reproduction"], // meiosis 2n=8
  "bio-g11-cell-011": [10, "Cell Reproduction"], // spindle / cell division

  // BIOLOGY — ecology: basic definitional -> G9 Ecology; quantitative/population -> G11
  "bio-g12-eco-001": [9, "Ecology"], "bio-g12-eco-002": [9, "Ecology"], "bio-g12-eco-003": [9, "Ecology"],
  "bio-g12-eco-004": [11, "Population & Natural Resources"],
  "bio-g12-eco-005": [11, "Population & Natural Resources"],
  "bio-g12-eco-006": [11, "Population & Natural Resources"],
  "bio-g12-eco-007": [11, "Population & Natural Resources"],
  "bio-g12-eco-008": [11, "Population & Natural Resources"],

  // MATH — functions & relations: basic eval/domain -> G10; comp/inverse/quadratic -> G11
  "math-g12-func-001": [10, "Relations & Functions"], "math-g12-func-002": [10, "Relations & Functions"],
  "math-g12-func-003": [10, "Relations & Functions"], "math-g12-func-004": [10, "Relations & Functions"],
  "math-g12-func-005": [11, "Relations & Functions"], "math-g12-func-006": [11, "Relations & Functions"],
  "math-g12-func-007": [11, "Relations & Functions"], "math-g12-func-008": [11, "Relations & Functions"],
  "math-g12-func-009": [11, "Relations & Functions"], "math-g12-func-010": [11, "Relations & Functions"],

  // MATH — trigonometry: exact-value basics -> G9 Introduction to Trigonometry; identities/equations -> G10
  "math-g12-trig-001": [9, "Introduction to Trigonometry"], "math-g12-trig-002": [9, "Introduction to Trigonometry"],
  "math-g12-trig-003": [9, "Introduction to Trigonometry"], "math-g12-trig-004": [9, "Introduction to Trigonometry"],
  "math-g12-trig-005": [10, "Trigonometric Functions"], "math-g12-trig-006": [10, "Trigonometric Functions"],
  "math-g12-trig-007": [10, "Trigonometric Functions"], "math-g12-trig-008": [10, "Trigonometric Functions"],
  "math-g12-trig-009": [10, "Trigonometric Functions"],

  // MATH — "Matrices & determinants": determinant-specific items -> G11 Determinants & Their Properties
  // (matrix-entry/product items -> G11 Matrices via wholesale)
  "math-g12-mat-001": [11, "Determinants & Their Properties"], // det 2x2
  "math-g12-mat-003": [11, "Determinants & Their Properties"], // det 3x3
  "math-g12-mat-005": [11, "Determinants & Their Properties"], // det 3x3
  "math-g12-mat-006": [11, "Determinants & Their Properties"], // det(2A)
  "math-g12-mat-007": [11, "Determinants & Their Properties"], // singular via det
};

/* ---- extract the four verbose arrays from index.html ---- */
function extract(html, name) {
  const marker = "window." + name + " = ";
  const start = html.indexOf(marker + "[");
  if (start < 0) throw new Error("array not found: " + name);
  const arrStart = start + marker.length;
  const end = html.indexOf("\n];", arrStart);
  if (end < 0) throw new Error("array end not found: " + name);
  // eslint-disable-next-line no-eval
  return eval(html.slice(arrStart, end + 2));
}

const SUBJ_OF = { BANK_PHYSICS: "Physics", BANK_CHEMISTRY: "Chemistry", BANK_BIOLOGY: "Biology", BANK_MATH: "Mathematics" };
const CORRECT_IDX = { A: 0, B: 1, C: 2, D: 3 };

function retag(subject, q) {
  if (OVERRIDE[q.id]) return OVERRIDE[q.id];
  const w = WHOLESALE[subject][q.unit];
  if (w == null) throw new Error("no mapping for " + subject + " / " + q.unit + " (id " + q.id + ")");
  return w;
}

function toCompact(subject, q) {
  const [g, u] = retag(subject, q);
  if (!UNIT_TAXONOMY[subject][g] || !UNIT_TAXONOMY[subject][g].includes(u))
    throw new Error("retag produced off-taxonomy unit: " + subject + " G" + g + " \"" + u + "\" (id " + q.id + ")");
  const o = [q.options.A, q.options.B, q.options.C, q.options.D];
  const c = CORRECT_IDX[q.correct];
  return { i: q.id, g, u, d: q.difficulty, t: q.type, q: q.question, o, c, e: q.explanation };
}

function main() {
  const html = fs.readFileSync(HTML, "utf8");
  const compact = {};
  const dist = {};
  const allIds = new Set();
  let total = 0;

  for (const bankName of Object.keys(SUBJ_OF)) {
    const subject = SUBJ_OF[bankName];
    const arr = extract(html, bankName);
    const rows = arr.map((q) => toCompact(subject, q));
    compact[subject] = rows;
    total += rows.length;

    dist[subject] = {};
    for (const r of rows) {
      // assertions
      if (![9, 10, 11, 12].includes(r.g)) throw new Error("bad grade " + r.g + " on " + r.i);
      if (!Array.isArray(r.o) || r.o.length !== 4) throw new Error("o.length!=4 on " + r.i);
      if (!(r.c >= 0 && r.c <= 3)) throw new Error("c out of range on " + r.i);
      if (!UNIT_TAXONOMY[subject][r.g].includes(r.u)) throw new Error("off-taxonomy " + r.i);
      if (allIds.has(r.i)) throw new Error("duplicate id " + r.i);
      allIds.add(r.i);
      const key = "G" + r.g + " · " + r.u;
      dist[subject][key] = (dist[subject][key] || 0) + 1;
    }
  }

  // ---- print distribution + coverage gaps ----
  console.log("\n=== PER-SUBJECT × GRADE × UNIT DISTRIBUTION ===");
  const gradeTotals = {};
  for (const subject of Object.keys(UNIT_TAXONOMY)) {
    console.log("\n## " + subject + " (" + compact[subject].length + ")");
    let subjTotal = 0;
    for (const g of [9, 10, 11, 12]) {
      let gTotal = 0;
      const lines = [];
      for (const u of UNIT_TAXONOMY[subject][g]) {
        const key = "G" + g + " · " + u;
        const n = dist[subject][key] || 0;
        gTotal += n;
        lines.push("    " + String(n).padStart(3) + "  " + u + (n === 0 ? "   <-- GAP" : ""));
      }
      console.log("  G" + g + " [" + gTotal + "]");
      lines.forEach((l) => console.log(l));
      subjTotal += gTotal;
      gradeTotals[g] = (gradeTotals[g] || 0) + gTotal;
    }
    console.log("  subject total: " + subjTotal);
  }

  console.log("\n=== GRADE TOTALS (all subjects) ===");
  for (const g of [9, 10, 11, 12]) console.log("  G" + g + ": " + (gradeTotals[g] || 0));
  console.log("  TOTAL: " + total);

  console.log("\n=== ASSERTIONS ===");
  console.log("  total === 408 : " + (total === 408));
  console.log("  unique ids    : " + (allIds.size === total));
  console.log("  all g valid   : true (asserted in loop)");
  console.log("  all u in taxo : true (asserted in loop)");
  console.log("  all o.len==4  : true (asserted in loop)");
  console.log("  all c in 0..3 : true (asserted in loop)");

  if (total !== 408) throw new Error("TOTAL != 408");

  // ---- emit banks/qb-<subject>.js ----
  const FILE = { Physics: "qb-physics.js", Chemistry: "qb-chemistry.js", Biology: "qb-biology.js", Mathematics: "qb-math.js" };
  const GLOBAL = { Physics: "QB_PHYSICS", Chemistry: "QB_CHEMISTRY", Biology: "QB_BIOLOGY", Mathematics: "QB_MATH" };
  const banksDir = path.join(ROOT, "banks");
  for (const subject of Object.keys(FILE)) {
    const body = compact[subject].map((r) => "  " + JSON.stringify(r) + ",").join("\n");
    const out =
      "/* " + GLOBAL[subject] + " — compact curated bank (source of truth for the content pass).\n" +
      "   Row shape: {i,g,u,d,t,q,o[4],c,e} — see FORMAT.md. Subject implied; source implied \"curated\". */\n" +
      "window." + GLOBAL[subject] + " = [\n" + body + "\n];\n";
    fs.writeFileSync(path.join(banksDir, FILE[subject]), out);
    console.log("wrote banks/" + FILE[subject] + " (" + compact[subject].length + " rows)");
  }

  // also emit a single combined snippet for inlining into index.html
  let inline = "";
  for (const subject of Object.keys(GLOBAL)) {
    const body = compact[subject].map((r) => "  " + JSON.stringify(r) + ",").join("\n");
    inline += "window." + GLOBAL[subject] + " = [\n" + body + "\n];\n";
  }
  fs.writeFileSync(path.join("/tmp", "qb_inline.js"), inline);
  console.log("wrote /tmp/qb_inline.js for inlining");
}

main();
