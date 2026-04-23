# Linguistic Refactor Inventory — Social Model Alignment

**Status:** partial — safe UI-string layer done 2026-04-22; full sweep is Phase 1.4 multi-day work
**Branch:** `v2`
**Policy source:** `launchpad-opus-4.7.md` §9.1 triggers, `CLAUDE.md` rules, `PLAN-comprehensive-2026.md` §2.4

---

## 1. What is done on `v2` (as of 2026-04-22)

### 1.1 CBAHI references purged from `src/`

- `src/modules/grc/QualityExcellenceHub.tsx:462` — "حسب CBAHI" → "حسب المعايير الوطنية للرعاية التأهيلية"
- Grep `CBAHI` across `src/` now returns 0 hits.

### 1.2 "المريض" (patient) → "المستفيد" (beneficiary) in Arabic user-visible strings

All 10 occurrences handled:

| File | Location | Change |
|---|---|---|
| `src/data/qualityProcesses.ts:133` | process name | "مرضى الصرع" → "المستفيدين المصابين بالصرع" |
| `src/hooks/useMedicalWorkflow.ts:51` | validation error | "للمرضى" → "للمستفيدين" |
| `src/components/emergency/EmergencyDashboard.tsx:43` | seizure protocol | "أمّن المريض" → "أمّن المستفيد" |
| `src/components/quality/OvrReportForm.tsx:189` | success message | "سلامة المرضى" → "سلامة المستفيدين" |
| `src/modules/ipc/PPEProtocols.tsx:51` | PPE step | "غرفة المريض" → "غرفة المستفيد" |
| `src/components/dashboard/QualityDashboard.tsx:44` | dashboard title | "سلامة المرضى" → "سلامة المستفيدين" |
| `src/modules/grc/GRCDashboard.tsx:215` | risk-mitigation plan | "سرير المريض" → "سرير المستفيد" |
| `src/services/ipcService.ts:120-124` | WHO 5 Moments | "المريض/المستفيد" unified to "المستفيد" + comment |
| `src/modules/grc/QualityExcellenceHub.tsx:518` | WHO 5 Moments banner | "المريض" → "المستفيد" + comment |
| `src/components/medication/MedicationAdministration.tsx:119` | 5 Rights of medication | "المريض الصحيح" → "المستفيد الصحيح" + comment |

Comments added where the original source is a WHO/IPC international standard, so future readers understand the adaptation was deliberate.

### 1.3 `arabic-translations.ts` — added social-model vocabulary

`src/utils/arabic-translations.ts` `ENTITY_LABELS` now exports:
- `assessment: 'تقييم وظيفي'` (preferred over `diagnosis`)
- `intervention: 'تدخّل'`
- `barrier: 'عائق اجتماعي'`
- `empowerment: 'تمكين'`

`diagnosis` retained as deprecated for back-compat (no callers found in `src/`).

### 1.4 Repo-level docs reframed

- `CLAUDE.md` header: "healthcare quality management system" → "social-model rehabilitation operations system" + new Strategic Frame section (launchpad §6–§7 summary)
- `README.md` header: same reframe + mention of Zero Paper endorsement + v1/v2 branch split

---

## 2. What is NOT done — the Phase 1.4 multi-day sweep

Doing the full sweep in one session is a bug-risk trap. The following must be done in bounded commits with type-check + lint + Playwright between each:

### 2.1 English `patient|diagnosis|treatment|clinical` — 372+ hits across 20+ files

**Top offenders from Grep count:**

| File | Hits | Priority | Notes |
|---|---:|---|---|
| `src/data/beneficiaries.ts` | 294 | 🔴 Tier 1 | Mock data — lowest risk; change as inventory |
| `src/utils/tagEngine.ts` | 12 | 🟠 Tier 2 | Review tag dictionary |
| `src/services/supaService.ts` | 10 | 🔴 Tier 1 | God-service; careful (API consumer count) |
| `src/modules/grc/GRCDashboard.tsx` | 7 | 🟠 Tier 2 | Remaining English hits |
| `src/types/medical.ts` | 5 | 🔴 Tier 1 | Type renames — coordinate with consumers |
| `src/services/riskAnalysisService.ts` | 5 | 🟠 Tier 2 | API-ish; check consumers |
| `src/types/index.ts` | 5 | 🔴 Tier 1 | Core types — consumer count high |
| `src/types/rehab.ts` | 1 | 🟢 Tier 3 | Trivial |
| `src/types/psychology.ts` | 2 | 🟢 Tier 3 | Trivial |
| (13 more files) | ~31 | 🟢 Tier 3 | One-off labels |

**Recommended order:**

1. **Tier 1 (2-3 days):** `src/data/beneficiaries.ts` (mock data, low consumer risk), `src/types/medical.ts` + `src/types/index.ts` (coordinated type-rename commit with TypeScript help), `src/services/supaService.ts` (careful — many callers).
2. **Tier 2 (1 day):** remaining files with 5–12 hits.
3. **Tier 3 (half-day):** the 13 small-touch files.

**Do NOT attempt in one commit.** Each tier = one commit minimum. Type-check after each.

### 2.2 Suggested renaming mapping (English)

| Medical frame | Social-model frame | Notes |
|---|---|---|
| `patient` | `beneficiary` | |
| `diagnosis` | `functionalAssessment` or `primaryCondition` | Choose one; stick to it |
| `treatment` | `intervention` | |
| `clinical` | `operational` or `care` | Context-dependent |
| `medical_record` | `beneficiary_record` | Table rename = Phase 2 only |
| `admission` | `enrollment` | Keep if legally required; add alias |
| `discharge` | `transition_out` | Keep if legally required; add alias |

### 2.3 Database-layer renames — PHASE 2, NOT PHASE 1

Column names like `beneficiaries.medical_diagnosis`, table `medical_profiles`, `medical_records` stay untouched through Phase 1. Why:

- Migration requires coordinated deploy
- Back-compat during transition needs dual-read/dual-write
- Risk/reward doesn't favor moving in Phase 1 — label changes in UI give 80% of the semantic benefit

See `PLAN-comprehensive-2026.md` §6.4 for the formal decision.

---

## 3. Verification hooks

After each sweep commit:
1. `npm run lint` — 0 errors
2. `npx tsc --noEmit` — 0 errors
3. `npm run test:e2e` — all 49 tests pass
4. Dev server manual check for any visible "patient/treatment/diagnosis" text in Arabic UI
5. `basira-ui-verifier` subagent on `/dashboard`, `/beneficiaries-list`, `/grc`, `/quality/manual`

---

## 4. Running tally

- **English medical-frame hits at start of Phase 1 (2026-04-22):** ~372 across 20+ files
- **Arabic "المريض" hits at start:** 10 across 10 files
- **Arabic "المريض" hits after this commit:** 1 (in a comment explaining the policy — intentional)
- **English hits after this commit:** ~372 (unchanged — sweep is Phase 1.4 future work)

---

## 5. Decision needed from Ahmad (recap)

Per `PLAN-comprehensive-2026.md` §6.4:
- Diagnosis → "تقييم وظيفي" (functional assessment) or "الحالة الأساسية" (primary condition)?
- Should `admission` / `discharge` keep legal aliases, or rename fully?
- Who signs off on type-rename commits in Tier 1 (risk-of-breakage is real)?
