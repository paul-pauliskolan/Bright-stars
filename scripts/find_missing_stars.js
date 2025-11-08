// Script: find_missing_stars.js
// Compares a hard-coded ordered list (Wikipedia "List of brightest stars")
// to the `stars` array in stars-data.js and prints the next 10 missing names.

const path = require("path");
const fs = require("fs");
const dataPath = path.join(__dirname, "..", "stars-data.js");
let stars;
try {
  const txt = fs.readFileSync(dataPath, "utf8");
  // Extract the `const stars = [ ... ];` array text
  const idx = txt.indexOf("const stars =");
  if (idx === -1) throw new Error("const stars = not found");
  const arrStart = txt.indexOf("[", idx);
  if (arrStart === -1) throw new Error("[ not found after const stars =");
  // Find matching closing bracket for the array
  let i = arrStart;
  let depth = 0;
  for (; i < txt.length; i++) {
    const ch = txt[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) break;
    }
  }
  if (depth !== 0) throw new Error("Could not find end of stars array");
  const arrText = txt.slice(arrStart, i + 1);
  // Evaluate the array text safely
  stars = eval(arrText); // eslint-disable-line no-eval
  if (!Array.isArray(stars)) throw new Error("Parsed stars is not an array");
} catch (err) {
  console.error("Could not load/parse stars-data.js:", err.message);
  process.exit(2);
}

function normalize(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s\(\)\-\.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const existing = new Set(stars.map((s) => normalize(s.name)));

// Ordered list from Wikipedia "List of brightest stars" (V <= +2.50)
// This array uses common/proper names and well-known Bayer names where suitable.
const ordered = [
  "Sun",
  "Sirius",
  "Canopus",
  "Alpha Centauri",
  "Arcturus",
  "Vega",
  "Capella",
  "Rigel",
  "Procyon",
  "Achernar",
  "Betelgeuse",
  "Hadar",
  "Altair",
  "Acrux",
  "Aldebaran",
  "Antares",
  "Spica",
  "Pollux",
  "Fomalhaut",
  "Deneb",
  "Mimosa",
  "Regulus",
  "Adhara",
  "Castor",
  "Shaula",
  "Gacrux",
  "Bellatrix",
  "Elnath",
  "Miaplacidus",
  "Alnilam",
  "Alnair",
  "Alnitak",
  "Alioth",
  "Dubhe",
  "Mirfak",
  "Wezen",
  "Gamma Velorum",
  "Sargas",
  "Kaus Australis",
  "Avior",
  "Alkaid",
  "Menkalinan",
  "Atria",
  "Alhena",
  "Peacock",
  "Alsephina",
  "Mirzam",
  "Polaris",
  "Alphard",
  "Hamal",
  "Diphda",
  "Mizar",
  "Nunki",
  "Menkent",
  "Alpheratz",
  "Mirach",
  "Rasalhague",
  "Algieba",
  "Kochab",
  "Saiph",
  "Denebola",
  "Algol",
  "Tiaki",
  "Muhlifain",
  "Aspidiske",
  "Suhail",
  "Alphecca",
  "Mintaka",
  "Sadr",
  "Eltanin",
  "Schedar",
  "Naos",
  "Almach",
  "Caph",
  "Izar",
  "Uridim",
  "Dschubba",
  "Larawag",
  "Eta Centauri",
  "Merak",
  "Ankaa",
  "Girtab",
  "Enif",
  "Scheat",
  "Sabik",
  "Phecda",
  "Aludra",
  "Alderamin",
  "Markeb",
  "Gamma Cassiopeiae",
  "Markab",
  "Aljanah",
  "Acrab",
];

// Helper to check if candidate exists among existing names by substring match
function existsInData(candidate) {
  const n = normalize(candidate);
  for (const e of existing) {
    if (e.includes(n) || n.includes(e)) return true;
    // handle known alias patterns (alpha vs proper name): check common tokens
    const et = e.replace(
      /alpha |beta |gamma |delta |epsilon |zeta |eta |theta |iota |kappa |lambda |mu |nu |xi |omicron |pi |rho |sigma |tau |upsilon |phi |chi |psi |omega /g,
      ""
    );
    const nt = n.replace(
      /alpha |beta |gamma |delta |epsilon |zeta |eta |theta |iota |kappa |lambda |mu |nu |xi |omicron |pi |rho |sigma |tau |upsilon |phi |chi |psi |omega /g,
      ""
    );
    if (et && nt && (et.includes(nt) || nt.includes(et))) return true;
  }
  return false;
}

const missing = [];
for (const name of ordered) {
  if (!existsInData(name)) {
    missing.push(name);
    if (missing.length >= 10) break;
  }
}

console.log("Next 10 missing bright-star names to add:");
missing.forEach((n, i) => console.log(`${i + 1}. ${n}`));

if (missing.length === 0) process.exit(0);
process.exit(0);
