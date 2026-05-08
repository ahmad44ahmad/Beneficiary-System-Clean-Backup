# Pitch-prep route audit — 2026-05-08T05-13-48

**Source:** `scripts/route-audit.mjs`. Generated headless via Playwright/Chromium against `http://localhost:5175`.

**Routes scanned:** 51. **Demo path = first 12 entries** (per `docs/pitch-prep.md` §"Demo path").

## Aggregate counts

| Metric | Total |
|---|---|
| Console errors (across all routes) | **36** |
| White-on-white text instances (visible) | **0** |
| Same-color fg/bg invisible text (other) | **0** |
| English-fragment candidates in body text | **0** |
| Empty buttons (no text/aria-label/title/icon) | **0** |
| "قريباً" markers in body text | **0** |
| Broken images (naturalWidth=0) | **0** |
| Routes that failed to navigate | **0** |
| Routes with <50 chars body text (likely empty/skeleton) | **51** |

## Per-route summary (sorted by issue density)

Issue density score = consoleErrors×3 + whiteOnWhite×3 + invisibleText×2 + englishFragments×1 + emptyButtons×1 + qareeban×1.

| # | Tag | Route | Density | err | ww | inv | en | btn | qareeban | bodyLen | nav |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 38 | MODULE | `/handover` | **18** | 6 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 4 | DEMO | `/empowerment/dignity/172` | **12** | 4 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 26 | STRATEGY | `/basira` | **12** | 4 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 27 | STRATEGY | `/overview` | **12** | 4 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 33 | MODULE | `/ipc` | **12** | 4 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 46 | REPORTS | `/integrated-reports` | **12** | 4 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 19 | INDICATORS | `/indicators/cost` | **6** | 2 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 34 | MODULE | `/catering` | **6** | 2 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 35 | MODULE | `/operations` | **6** | 2 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 47 | ADMIN | `/admin/audit-logs` | **6** | 2 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 17 | INDICATORS | `/indicators/early-warning` | **3** | 1 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 21 | INDICATORS | `/indicators/iso` | **3** | 1 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 1 | DEMO | `/` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 2 | DEMO | `/dashboard` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 3 | DEMO | `/empowerment` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 5 | DEMO | `/family-portal` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 6 | DEMO | `/family` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 7 | DEMO | `/alerts` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 8 | DEMO | `/smart-alerts` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 9 | DEMO | `/legal-shield` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 10 | DEMO | `/quality/manual` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 11 | DEMO | `/sroi` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 12 | DEMO | `/beneficiaries-list` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 13 | CORE | `/beneficiaries` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 14 | CORE | `/timeline` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 15 | INDICATORS | `/indicators` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 16 | INDICATORS | `/indicators/behavioral` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 18 | INDICATORS | `/indicators/satisfaction` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 20 | INDICATORS | `/indicators/biological` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 22 | INDICATORS | `/indicators/strategic` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 23 | STRATEGY | `/leadership-compass` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 24 | STRATEGY | `/governance` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 25 | STRATEGY | `/strategic` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 28 | STRATEGY | `/liability` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 29 | MODULE | `/medical` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 30 | MODULE | `/social` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 31 | MODULE | `/grc` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 32 | MODULE | `/grc/excellence` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 36 | MODULE | `/operations/assets` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 37 | MODULE | `/clothing` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 39 | MODULE | `/scheduling` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 40 | MODULE | `/emergency` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 41 | MODULE | `/pulse` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 42 | MODULE | `/wellbeing` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 43 | REPORTS | `/reports` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 44 | REPORTS | `/executive-report` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 45 | REPORTS | `/aggregate` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 48 | ADMIN | `/structure` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 49 | ADMIN | `/staff` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 50 | ADMIN | `/permissions` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |
| 51 | ADMIN | `/settings` | **0** | 0 | 0 | 0 | 0 | 0 | 0 | ? | ok |

## Detail per affected route


### `/handover` — Shift Handover (density 18)

- **Console errors (6):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Error fetching shift items: {code: PGRST205, details: null, hint: Perhaps you meant the table 'public.san_martin_items', message: Could not find the table 'public.shift_handover_items' in the schema cache}`
  - `Failed to load shift data {code: PGRST205, details: null, hint: Perhaps you meant the table 'public.san_martin_items', message: Could not find the table 'public.shift_handover_items' in the schema cache}`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Error fetching shift items: {code: PGRST205, details: null, hint: Perhaps you meant the table 'public.san_martin_items', message: Could not find the table 'public.shift_handover_items' in the schema cache}`

### `/empowerment/dignity/172` — DignityFile / أبو سعد (density 12)

- **Console errors (4):**
  - `Failed to load resource: the server responded with a status of 406 ()`
  - `[EmpowermentService] getPreferences: {code: PGRST116, details: The result contains 0 rows, hint: null, message: Cannot coerce the result to a single JSON object}`
  - `Failed to load resource: the server responded with a status of 406 ()`
  - `[EmpowermentService] getPreferences: {code: PGRST116, details: The result contains 0 rows, hint: null, message: Cannot coerce the result to a single JSON object}`

### `/basira` — Executive Dashboard (alt) (density 12)

- **Console errors (4):**
  - `Failed to load resource: the server responded with a status of 400 ()`
  - `Failed to load resource: the server responded with a status of 400 ()`
  - `Failed to load resource: the server responded with a status of 400 ()`
  - `Failed to load resource: the server responded with a status of 400 ()`

### `/overview` — Cross-Module Dashboard (density 12)

- **Console errors (4):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/ipc` — IPC Dashboard (density 12)

- **Console errors (4):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/integrated-reports` — Integrated Dashboard (density 12)

- **Console errors (4):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/indicators/cost` — Cost per Beneficiary (density 6)

- **Console errors (2):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/catering` — Catering Dashboard (density 6)

- **Console errors (2):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/operations` — Operations Dashboard (density 6)

- **Console errors (2):**
  - `Failed to load resource: the server responded with a status of 404 ()`
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/admin/audit-logs` — Audit Log Viewer (density 6)

- **Console errors (2):**
  - `Failed to load resource: the server responded with a status of 400 ()`
  - `Failed to load resource: the server responded with a status of 400 ()`

### `/indicators/early-warning` — Early Warning (density 3)

- **Console errors (1):**
  - `Failed to load resource: the server responded with a status of 404 ()`

### `/indicators/iso` — ISO Compliance (density 3)

- **Console errors (1):**
  - `Failed to load resource: the server responded with a status of 404 ()`

---

_Generated automatically; commit alongside `docs/pitch-prep.md` for Session C ingestion._
