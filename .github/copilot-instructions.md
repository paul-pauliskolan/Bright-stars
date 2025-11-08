## Bright-stars — quick instructions for AI coding agents

This is a tiny static interactive site: a single-page UI (`index.html`) that loads a dataset (`stars-data.js`) and renders a table + pictorial dots for the brightest stars. There is no build system — edits are usually direct changes to `index.html` and/or `stars-data.js` and then opening the page in a browser.

Quick architecture (big picture)

- Single-page static app: `index.html` contains all rendering logic (sorting, filtering, helpers) and loads `stars-data.js` which defines a global `const stars = [...]`.
- Data -> UI flow: `stars-data.js` (data objects) -> global `stars` -> `index.html` helpers (parseSpectralPart, mostMassiveType, displayNumStars, luminosityMultiplier, uncertaintyText, colorForSpectral, sizeForSpectral) -> `render()` -> DOM table + SVG dots.

Developer workflows (how to test/run)

- No build: either open `index.html` directly or run a local static server to avoid CSP/relative-path quirks: e.g. `python -m http.server` from the repo root, then visit http://localhost:8000.
- Make small edits (data or functions), refresh the browser to validate visual/behavioral changes.

Data contract & conventions (what to preserve)

- Each star is a JS object with fields: name, constellation, visibility, mag, distance (ly), lum (L☉), temp (K), radius (R☉), mass (M☉), age (Gyr), spectral, starType, exo (bool), exoCount, notes, sources (array), components, uncertainty (array), numStars.
- `components` can be strings (spec) or objects { name, spec, visualSize }. The UI uses `visualSize` to control dot sizes; keep values conservative.
- Units must be preserved (distance in ly, luminosity in L☉, radius in R☉, mass in M☉, age in Gyr).

Provenance & uncertainty rules (mandatory when changing data)

- Do not change numeric astrophysical values without adding `sources` (URLs) explaining why. If literature disagrees, add an `uncertainty` array with codes (see mapping below) and a short `notes` entry.
- Uncertainty legend (as implemented in `index.html` -> `uncertaintyText()`):
  1.  Distance / parallax disagreement
  2.  Multiplicity / companions disputed
  3.  Spectral / luminosity disagreement
  4.  Physical parameter variance
  5.  Tentative detection

Common edits & where to make them (examples)

- Add a star: append an object to `stars` in `stars-data.js`. Model new entries on `Sirius` or `Alpha Centauri` (those show `components`, `sources`, and `notes`).
- Represent multiples: prefer adding a `components` array (one dot per component) rather than only changing `numStars`.
- Change rendering/filters: edit `index.html` functions: `compare`, `visibleFilter`, `spectralStartsWithFilter`, `searchFilter`, `render()`.
- Adjust colors/sizes: spectral color mapping is in `index.html` `colorForSpectral()`; size heuristics live in `sizeForSpectral()` and `luminosityMultiplier()` — change cautiously and test in-browser.

Integration points & important files

- `index.html` — UI logic and helpers (see functions named above).
- `stars-data.js` — canonical dataset; keep entries self-contained with `sources` when you modify scientific values.
- `old/stars-verification-report.json` — previous verification notes; consult when changing distances/multiplicity.

Risk guidance and small PRs

- Start with low-risk edits: fix typos in `notes`, add `sources`, add `uncertainty` flags, or small rendering fixes in `index.html`.
- For any astrophysical change, include at least one reputable source (SIMBAD, peer-reviewed paper, or Wikipedia with citation) and a short rationale in `notes` or the verification JSON.

If anything is unclear or you'd like the file to include extra sections (tests, CI, or a contributor checklist), tell me which parts to expand and I will update this file.
