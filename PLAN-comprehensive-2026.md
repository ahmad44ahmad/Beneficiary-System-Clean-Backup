# Basira Comprehensive Improvement Plan — v1

**Date:** 2026-04-22
**Author:** Claude Opus 4.7 (1M ctx)
**Reviewer:** Ahmad bin Abdullah Al-Shahri
**Status:** Draft v1 — awaiting Ahmad's revision pass
**Horizon:** 12 months (2026-04 → 2027-04)
**Repo state at snapshot:** `main` @ `9bc6e27` (2 days stale), 66,636 LoC across 314 ts/tsx files.

---

## 0. Executive Summary

Basira today is a **well-built operational app for one rehab center** (Al-Baha) wrapped in Arabic-first RTL, React 19, Supabase, with mature pgaudit/RLS and Playwright E2E. It is already the MHRSD-endorsed "مبادرة صفر ورق" — do not break it.

But Basira today is *not* what the 2026-04-21 strategic reframe says it should be:

1. **Schema is medical-framed** (`medical_records`, `medical_profiles`, `diagnosis`, `VitalSigns`), not social-framed. The one exception — `DignityProfile` + `empowermentService.ts` — proves the other frame *can* coexist.
2. **It is a single-actor tool**, not a Trust-Ground. No federated identity, no consent graph, no cross-actor event layer.
3. **It has no Dignity Index** — just a dignity *profile* (personality + preferences). The 10-type barrier compass is not encoded anywhere.

**Strategic move (recommended):** Do **not** rewrite `main`. Freeze `main` as "Basira v1 / صفر ورق" — the already-endorsed record. Open a `v2` branch where the social-model layer is *added on top* of the existing operational spine (Q2=(b) layer-on-top, Q1=(c) hybrid). Pilot the Trust-Ground prototype at Al-Baha only (Q3=(c)) before any ministerial rollout.

**What changes in 90 days:** linguistic refactor (patient→beneficiary, diagnosis→assessment, treatment→intervention) across code + UI + types; compass-audit of every route against the 10 barrier types; decommission of duplicate migration dirs and repo hygiene; formal Dignity Index v0 spec on top of the existing `DignityProfile`.

**What is at stake:** If the rewrite happens, Ahmad repeats the 2026-04-15 9-hour "wrong version" pattern at plan-scale. If the reframe *doesn't* happen, Basira stays an EHR-flavored dashboard and collides with MoH territory — a category error the launchpad §6.2 warns against.

**What is NOT in this plan:** ministerial rollout commitments (need political cover first), PT-modeling work (different project, already has its own rules), AI-models track (separate track per `user_profile`), Habibi-TTS (unrelated). See §7.

---

## 1. Current State Assessment

### 1.1 Stack reality (declared vs. actual)

| Layer | Declared (CLAUDE.md) | Actual (package.json) | Status |
|---|---|---|---|
| React | 19.1 | **19.2.4** | ✓ (newer minor) |
| Vite | 6.2 | **6.2+** (installed 6.4.1 per memory) | ✓ |
| Tailwind | 4.2 | **4.2.1** | ✓ |
| Zustand | 5.0.11 | **5.0.11** | ✓ |
| TanStack Query | 5.90 | **5.90.21** | ✓ |
| react-hook-form | 7.71 | **7.71.2** | ✓ |
| Zod | 4.3 | **4.3.6** | ✓ |
| React Router | 7.13 | **7.13.1** | ✓ |
| Supabase | 2.98 | **2.98.0** | ✓ |

**No drift.** Stack matches declaration — this is a rare, good signal. The "locked versions" rule is being honored.

Additional installed but not in the declaration table: `@google/generative-ai` ^0.24.1, `framer-motion` ^12.34.3, `recharts` ^3.7.0, `lucide-react` ^0.575.0, `gh-pages` ^6.3.0.

### 1.2 Architecture map

```
index.tsx
  └─ StrictMode → ErrorBoundary → ThemeProvider → QueryProvider
                → BrowserRouter → AuthProvider → <App /> + ToastRenderer

src/components/App.tsx   — 110 route declarations (grep: `path=`)

Feature surface (LoC):
  modules/ipc         5,426  ← largest
  modules/grc         4,356
  components/beneficiary 3,734
  components/dashboard   3,106
  components/medical  2,908
  components/indicators 2,830
  components/social   2,393
  modules/catering    2,168
  components/quality  2,053
  modules/operations  1,726
  modules/empowerment 1,469  ← social-frame native
  components/admin    1,351
  … (smaller)

services/
  supaService.ts      629 LoC ← God-service, consolidation target
  empowermentService  395
  ipcService          394
  auditService        309
  wellbeingService    227
  riskAnalysisService  80 (small; well-scoped)
  repositories/       271 (cleaner pattern, partially adopted)
```

Provider stack is coherent; `index.tsx:1` discipline is good. The monolithic `supaService.ts` at 629 LoC is the anti-pattern — the `repositories/` folder indicates a partial migration was started but not finished.

### 1.3 Schema audit — medical framing vs. social framing

**Medical framing (entrenched):**
- `types/medical.ts` — `VitalSigns`, `MedicalHistory`, `MedicalProfile` (`primaryDiagnosis`, `secondaryDiagnoses`, `currentMedications`, `infectionStatus`) [`types/medical.ts:6-80`]
- `types/physicalTherapy.ts`, `types/psychology.ts`, `types/dental.ts`, `types/speechTherapy.ts` — all clinical assessment types
- `types/index.ts:36-42` — `Beneficiary.medicalDiagnosis`, `psychiatricDiagnosis`, `disabilityType` (`"23 أ / 23 ب"` — disability classification code)
- `supabase/sql/001_core_schema.sql:11` — `beneficiaries.medical_diagnosis` column (line 24)
- `supabase/recovery/02-missing-tables.sql:128,148,166` — `medical_records`, `rehab_plans`, `social_research`

**Social framing (nascent but real):**
- `types/dignity-profile.ts` — full `DignityProfile` interface [1-49]: personality, sensory prefs, favorites, dislikes, communication style, deeds log
- `types/index.ts:60-61` — comment already labels it "Feature 1: Ehsan Algorithm (Dignity Profile)" — naming hook already exists
- `services/empowermentService.ts` — 395 LoC of empowerment-goal logic
- `modules/empowerment/` — 5 files, 1,469 LoC: `DignityFile.tsx`, `EmpowermentDashboard.tsx`, `GoalProgressTracker.tsx`, `SmartGoalBuilder.tsx`
- `supabase/sql/007_independence_tracking.sql` — `beneficiary_classification`, `independence_budget_analysis`, `human_rights_compliance` (this migration is the bridgehead to the social model)

**🧭 بوصلة:** The `007_independence_tracking.sql` migration is the *single most important artifact* for the social-model pivot. It already encodes "independence," "human rights compliance," and budget analysis through an empowerment lens. The plan should build outward from this file rather than replacing it.

**Hit counts (indicative):**
- 372+ occurrences of `patient|diagnosis|treatment|clinical` across 20+ files (Grep truncated at 20 files; real count larger)
- 161+ occurrences of `beneficiary|barrier|intervention|dignity|empowerment` across 20+ files

**CBAHI leakage:** 2 files only — `CLAUDE.md` (meta/docs) and `src/modules/grc/QualityExcellenceHub.tsx`. Excisable in an afternoon.

**FHIR/HL7/ICD/SNOMED:** zero hits. Clean.

### 1.4 Dead code / abandoned features / hygiene issues

- **Duplicate migration dirs:** `supabase/sql/` (001–021, current) and `supabase/migrations/` (01–06 + one 2024-dated). Resolution needed: which is the single source of truth?
- **Migration number collision:** `sql/002_catering_quality.sql` and `sql/002_functions.sql` both named "002". One should be renumbered.
- **Repo-root pollution:** 7 log files tracked/untracked (`ts_errors.log`, `ts_errors_2.log`, `ts_errors_3.log`, `build_verification.log`, `diagnostics_scan.log`, `final_verification.log`, `verification_scan.log`). `basira-diagnostic.mjs` untracked.
- **Stale paths in CLAUDE.md:** repo `CLAUDE.md:115` references `"C:/Users/aass1/.local/bin/Beneficiary-System-Clean-Backup"` — dead since 2026-04-16 flatten. README.md:56 says port 5173; canonical memory + repo CLAUDE.md say 5175. One is wrong; the README is the likely culprit.
- **Partial repository-pattern migration:** `services/repositories/` exists with 6 files (271 LoC total) but `supaService.ts` still at 629 LoC — the migration was started and stalled.
- **Untracked module:** `src/modules/grc/components/` — unclear if mid-flight or abandoned.
- **Empty subdirs with 1 file:** 11 component subdirs have exactly 1 file (`crisis`, `shift`, `emergency`, `scheduling`, `medication`, `training`, `family`, `assets`, `auth`, `knowledge`, `organization`). Candidates for collapsing into parent dirs.

### 1.5 Security posture

- **pgaudit:** configured with object-level logging via `pdpl_auditor` role (CLAUDE.md:87–92). Strong — this is PDPL-aligned without over-configuring.
- **RLS policies:** explicit in migrations `019_drop_duplicate_permissive_policies.sql`, `020_add_rls_policies_bicsl_certifications.sql`. Housekeeping evidence that RLS is actively curated, not just declared.
- **Demo mode:** `VITE_APP_MODE=demo` exists (CLAUDE.md:212) — potential foot-gun in production. Need explicit guard test that demo mode refuses to run against production Supabase project.
- **Secrets:** `.env` usage via `dotenv` package; `GEMINI_API_KEY` optional. No hardcoded keys found in src/ spot-checks (not exhaustive — see Risk §5.6).
- **National ID masking:** commit `ff10dc4` ("stage-1: add national ID masking") — addressed. Good.

### 1.6 What's working well (do not mess with)

- **Stack discipline.** Zero drift from declared versions. Rare.
- **Test infra.** 49 Playwright E2E tests across login, beneficiary list, sidebar nav, daily care, catering, dashboard KPI, settings, empowerment, staff, reports, social research. Solid coverage of happy paths.
- **State migration to Zustand is complete** (commit `f6aefd5`). Seven stores, clean split. Don't re-open this.
- **Dark mode works** (commit `31e5b4e` — explicitly called out). Don't re-re-design theming.
- **Performance optimizations applied recently:** materialized views + `pg_cron` refresh (mig 014, 015), partitioning for `incident_reports` (mig 016), unused index drops (mig 018), FK indexing (mig 021). Database is being actively tended.
- **Recent `9bc6e27`** — documented data-restore recovery. Shows operational maturity.

---

## 2. Strategic Alignment Assessment

### 2.1 Distance from the Trust-Ground vision (launchpad §6)

| Layer | Vision state | Current state | Distance |
|---|---|---|---|
| **1 — Identity** (beneficiary-controlled, consent-gated) | Graph with external pointers, consent receipts, no actor-ownership | Single `beneficiaries` table, center-controlled, PII with masking | 🔴 Large |
| **2 — Events** (horizontal broadcast across actors) | Domain events published, other actors subscribe | Internal-only events (`audit_logs`, shift handovers) | 🔴 Large |
| **3 — Response** (actors keep their systems, Basira suggests) | Recommendation layer, no enforcement | Operational forms/workflows (Basira IS the system here) | 🟡 Medium — conceptually possible |
| **4 — Outcome** (Dignity Index, beneficiary-level) | Measured dignity units per barrier dissolved | `DignityProfile` exists but measures *preferences*, not barriers | 🟠 Medium-small |

**Honest read:** Basira is currently closer to *Layer 3 for one actor* than to a four-layer Trust-Ground. The plan treats Layers 1–2 as 12-month aspirations requiring external agreements, not engineering sprints.

### 2.2 Distance from Dignity Index measurement (launchpad §7.C)

The Dignity Index requires: "how many of the 10 barrier types does this feature dissolve for this beneficiary per month?"

**What Basira measures today:**
- Vital signs (medical)
- Fall risk (clinical prevention)
- Medication adherence (clinical)
- Wellbeing heatmap (`services/wellbeingService.ts`) — already cross-dimensional, closest candidate
- Independence tracking (`sql/007`) — already barrier-adjacent
- Empowerment goals (`modules/empowerment`) — already goal-oriented

**What Basira does NOT measure:**
- Barrier-type classification (the 10 types are not present in code anywhere — verified by grep)
- Cross-actor dignity events (school attendance, family visit, community participation outside the center)
- Self-reported beneficiary voice (§7.C's "Beneficiary Voice" module is aspirational)

**Implication:** A Dignity Index v0 is *reachable* by extending `wellbeingService` + `empowermentService` + `DignityProfile`, not by greenfield work. Estimated 2-4 weeks for v0 measurement surface; 3-6 months for v1 with a usable 10-barrier classifier.

### 2.3 Stewardship-instrument vs. delegation-enabler audit

Each major feature asked: "does this keep the Ministry present and accountable, or does it enable the Ministry to delegate-and-disappear?"

| Module | Stewardship or delegation? | Note |
|---|---|---|
| `modules/ipc` | Stewardship ✓ | Infection control keeps central oversight |
| `modules/grc` | Stewardship ✓ | Risk/compliance by design is ministerial |
| `modules/empowerment` | Stewardship ✓ | Beneficiary-outcome focus |
| `modules/catering` | Mixed | Could become "contractor self-reports and we trust them" = delegation |
| `components/medical` | Delegation-leaning 🟠 | EHR-style; invites "MoH owns this" response |
| `components/medication` | Delegation-leaning 🟠 | Same reasoning |
| `modules/reports` | Stewardship ✓ | Central visibility |

🤫 مسكوت: The clinical modules are exactly where the MoH will say "that's ours, give it up." The plan's Phase 1 deliberately *reframes* those modules (medication administration becomes "barrier: inability to self-administer" with a dissolution plan, not just a log). This is the category-error avoidance §6.2 warns about.

### 2.4 Compass-violation flags — where medical-model leakage shows up

**In code (by priority for refactor):**
1. `types/medical.ts:32-66` — `MedicalProfile.primaryDiagnosis`, `secondaryDiagnoses`, `currentMedications`, `infectionStatus`. Rename/reframe candidates.
2. `types/index.ts:36-42` — `Beneficiary.medicalDiagnosis`, `psychiatricDiagnosis`. Rename to `functionalAssessment` + `cognitiveAssessment`? TBD in Decision §6.3.
3. `sql/001_core_schema.sql:24` — `beneficiaries.medical_diagnosis` column. Column rename = migration + code update.
4. `components/medical/` — 17 files, 2,908 LoC. Audit file-by-file in Phase 1.
5. `services/supaService.ts` at 629 LoC — the God-service concentrates a lot of "medical" query methods.

**In UI text:** `src/utils/arabic-translations.ts` (1 hit on `patient|diagnosis|treatment` in filename scan; needs full review — suspect it has user-visible strings).

**In docs:** `CLAUDE.md` and README both use "healthcare quality management system" — wrong category. Should be "social-model rehabilitation operations."

**In language:**
- README.md:9 — "Arabic RTL **healthcare** quality management system" 🧭 reframe needed
- CLAUDE.md:4 — same
- Neither mentions "social model," "barrier," "empowerment" at the top level

---

## 3. Phased Plan

Intervention markers in this plan: 💡 ومضة: idea flagged; 🔗 دمج: fusion opportunity; ⚠️ صراحة: hard truth; 🧭 بوصلة: compass reset; 🎯 تخصيص: customization point.

### Phase 1 — Foundation Reset (next 90 days, 2026-04-22 → 2026-07-21)

**Theme:** stop the leakage; prove reframe is possible without breaking the operational app.

| # | Initiative | Strategic anchor | Effort | Risk | Success criterion | Dependencies |
|---|---|---|---|---|---|---|
| 1.1 | **Freeze `main` as Basira v1** — tag `v1.0.0-zero-paper`, document as endorsed MHRSD deliverable | Launchpad §10 rule 6 (don't break endorsed work) | 0.5d | Low | Tag exists; README section added citing approval date 2025-12-03 | None |
| 1.2 | **Open `v2` branch** — all social-model work lands here | Q1=(c) hybrid decision | 0.5d | Low | Branch exists, protected, PR flow configured | 1.1 |
| 1.3 | **Repo hygiene** — delete 7 log files, untracked `.mjs`, move to `.gitignore`; consolidate migration dirs; fix stale CLAUDE.md paths; resolve `002_*.sql` number collision; port discrepancy 5173 vs 5175 in README | §1.4 findings | 1d | Low | `git status` clean; one migration dir; CLAUDE.md references `C:\dev\basira\` only | None |
| 1.4 | **Linguistic refactor — code** — `patient/clinical/treatment` → `beneficiary/assessment/intervention` in src/ (non-schema) — UI strings, comments, TSDoc, error messages | §2.4, Compass §6.3 | 3-4d | Low | Grep count of medical terms in `src/` <20 (currently 372+) | 1.2 |
| 1.5 | **Linguistic refactor — Arabic UI strings** — audit `arabic-translations.ts` and all Arabic literal strings for "المريض" → "المستفيد", "تشخيص" → "تقييم وظيفي" where social model applies. Governmental Arabic (يتم، يُحدد، يلتزم). | `feedback_pt_project_rules.md` | 2-3d | Low | Arabic grep clean; no "المريض" in user-facing strings | 1.4 |
| 1.6 | **Schema annotation, not migration** — add SQL comments to every column in `001`, `007` etc tagging which of the 10 barrier types it touches; no column renames yet | §2.4 + launchpad §6.2 | 1d | Low | Every column has `COMMENT ON` with barrier-type tag | 1.3 |
| 1.7 | **CBAHI excision** — remove from `modules/grc/QualityExcellenceHub.tsx`, mark as "advisory reference only" if kept; remove CBAHI claim from docs | `feedback_pt_project_rules.md` | 0.5d | Low | 0 CBAHI hits in `src/`; CLAUDE.md updated | None |
| 1.8 | **Dignity Index v0 spec (document, not code)** — formal spec in `docs/dignity-index-v0.md`: 10 barriers, scoring rubric, data sources (reuse `DignityProfile` + `wellbeingService` + `empowermentService`), sample calculation for one beneficiary | Launchpad §7.C | 3-4d | Medium (philosophical alignment) | Spec reviewed by Ahmad; one worked example | 1.4 |
| 1.9 | **LoC assessment** — classify every file as: keep / consolidate / delete; write `docs/loc-reduction-plan.md` with 66k → <40k target path. NO deletions yet. | `user_profile.md` target | 2d | Medium | Plan document exists; Ahmad approves before Phase 2 | None |
| 1.10 | **Empowerment module as Layer-4 prototype** — add a `BarrierDissolution` table + UI showing which of 10 barriers each empowerment goal targets. Use existing `empowermentService.ts` as foundation. | Launchpad §7.C, §2.2 | 5-7d | Medium | One beneficiary profile shows 10-barrier bar chart | 1.6, 1.8 |
| 1.11 | **Repo documentation refresh** — update CLAUDE.md + README with new frame (Trust-Ground, Dignity Index, social model), port numbers, dev command, verification flow | AI-collaboration §4 | 1d | Low | Both docs reflect v2 direction; port = 5175 consistent | 1.3 |

**Phase 1 exit criterion:** v2 branch runs locally on 5175, shows a Dignity Index prototype for one beneficiary, and the word "patient" appears nowhere in user-visible strings. `main` still deployable, unchanged.

**Total estimated effort:** ~20 working days spread over 90 days (part-time compatible with PT modeling + career work).

### Phase 2 — Trust-Ground v1 (months 4-6, 2026-07 → 2026-10)

**Theme:** first Layer-2 (Events) + one external actor integration.

| # | Initiative | Strategic anchor | Effort | Risk | Success criterion | Dependencies |
|---|---|---|---|---|---|---|
| 2.1 | **Event ledger** — new `beneficiary_events` table: beneficiary_id, event_type, barrier_dissolved, source_actor, timestamp, dignity_units. All existing services emit events | Launchpad §6 Layer 2 | 5-7d | Medium | 5 core operations (daily care log, medication, shift handover, empowerment goal, incident) emit events; query returns per-beneficiary event stream | Phase 1 complete |
| 2.2 | **Consent receipts** — `consent_grants` table: beneficiary/guardian, grantor, grantee (actor), scope, revocation. Every cross-actor read checks this. | Launchpad §6 Layer 1 (partial) | 4-6d | Medium-high | Consent required for any read from a different-actor context | 2.1 |
| 2.3 | **First external actor integration (choose ONE)** — candidates: (a) Nafath identity verification; (b) family portal with guardian login; (c) school attendance for child beneficiaries. Recommend (b) — lowest friction, largest dignity-impact, builds on existing `modules/family` | Launchpad §7.C "Beneficiary Voice" adjacent | 8-12d | High | Guardian logs in, sees consented view, records family visit event | 2.1, 2.2 |
| 2.4 | **Dignity Index v1** — upgrade from spec to live measurement. Per-beneficiary monthly dignity score derived from events, with decomposition by barrier type. Surface on dashboard. | Launchpad §7.C | 7-10d | Medium | Dashboard shows 1 beneficiary's 10-barrier monthly trend; explanation panel ("this month we dissolved barrier-7 via X event") | 2.1 |
| 2.5 | **Beneficiary voice v0** — monthly self-report (or guardian-proxy) on dignity dimensions; gap vs staff rating becomes an "invisible barrier" signal (launchpad §7.C ومضة) | 💡 ومضة §7.C | 5-7d | Medium | One beneficiary completes one monthly review; gap visualization exists | 2.3, 2.4 |
| 2.6 | **LoC reduction — execute** — carry out the Phase 1 plan. Consolidate `modules/ipc` (5.4k → ~3k), simplify `modules/grc`, collapse single-file component dirs, finish `supaService → repositories/` migration | §1.4, user_profile target | 15-20d | Medium | `wc -l` < 50k; all tests pass | 1.9 |

**Phase 2 exit criterion:** One guardian can log in from outside the center, see a consented view of their beneficiary's life, record a family-visit event that increments the Dignity Index. LoC < 50k.

### Phase 3 — Multi-actor pilot (months 7-12, 2026-10 → 2027-04)

**Theme:** second external actor + outcome measurement at Al-Baha level → then ministerial review gate.

| # | Initiative | Strategic anchor | Effort | Risk | Success criterion | Dependencies |
|---|---|---|---|---|---|---|
| 3.1 | **Second external actor** — pick based on Phase 2 learnings. Strong candidates: school (child beneficiaries), primary-care clinic (shared medical events), social-assistance portal | §6 Layer 3 | 10-15d | High | Two-actor event stream visible per beneficiary | 2.3 |
| 3.2 | **Outcome measurement framework (Layer 4)** — Al-Baha cohort dignity trends over 6 months, with control for seasonal/operational noise | §6 Layer 4 | 8-12d | Medium | Statistical framework reviewed; baseline + 6-month delta published internally | 2.4 |
| 3.3 | **LoC target — close the loop** — reach <40k. Remove deprecated medical-framing once v2 dignity model is fully exercised | user_profile target | ongoing | Medium | `wc -l` < 40k; CI gate on size | 2.6 |
| 3.4 | **Ministerial review packet** — one-pager + demo + Dignity Index 6-month cohort data for Al-Qarni → then up-stream. NOT a rollout commitment; a decision-ready packet. | `project_career_timeline` #8 + §2.3 | 5-7d | Low technical, high political | Packet ready; meeting requested | 3.2 |
| 3.5 | **Ministerial rollout decision gate** ⚠️ صراحة: this is the go/no-go moment. If ministry says "no," Basira stays an Al-Baha pilot. If "yes," a new 12-month plan begins. | Top-level strategy | N/A | High | Decision made; next-plan triggered or parked | 3.4 |

**Phase 3 exit criterion:** Ahmad presents a Dignity Index over 6 months across two external-actor integrations to the ministry. Decision outcome documented. No unilateral ministerial commitments made.

---

## 4. AI-Collaboration Architecture (Opus 4.7 / 1M ctx suitable)

Basira needs to be **front-loadable in a single Claude session**. Today, with 66k LoC + 22 memory files, you can already fit it all at once. That capability must be preserved.

**Target end-state of repo organization:**

| Artifact | Purpose | Location | State |
|---|---|---|---|
| `CLAUDE.md` | Repo-level project rules (already exists, refresh in 1.11) | `/CLAUDE.md` | Exists, needs update |
| `SKILLS.md` (new) | Domain patterns: social model, barrier classification, governmental Arabic conventions, CBAHI exclusion | `/SKILLS.md` | New |
| `docs/architecture.md` (new) | Living four-layer diagram, maintained in markdown (not external tools) | `/docs/` | New |
| `docs/dignity-index-v0.md` (Phase 1.8) | Formal spec | `/docs/` | New |
| `docs/loc-reduction-plan.md` (Phase 1.9) | 66k → <40k path | `/docs/` | New |
| `docs/schema.md` (new) | Single source of truth for tables + barrier-type tags (auto-generated from SQL comments) | `/docs/` | New |
| `supabase/types.generated.ts` | Supabase-generated TS types — already canonical for schema shape | `/supabase/` | Exists? verify |
| Test fixtures as docs | Every Playwright test fixture is a specification of expected behavior | `/tests/` | Exists |

**Caching-friendly layout:**

The 1M cache loves stable prefixes. Reorganize repo so Claude's standard front-load is:

```
1. CLAUDE.md           (stable — project rules)
2. SKILLS.md           (stable — domain patterns)
3. docs/architecture.md (slowly changing — end-state diagram)
4. docs/dignity-index-v0.md (slowly changing)
5. docs/schema.md      (slowly changing)
6. src/ (current task area)
```

Frequent changes stay in `src/` and task-specific files. Everything above src/ stays stable → cache hits > 90% → Claude session cost drops 10× per launchpad §4.2.

**Test fixtures double as docs:** follow the pattern of labeling tests with the barrier-type they verify — `dissolves-barrier-5-fake-supporter.spec.ts`. Test names become the skill library.

**Do NOT use:** Confluence, Notion, external wikis for architecture. Markdown in-repo only. The launchpad §5.1 front-loading pattern depends on everything being `git clone`-able.

---

## 5. Risk Register (top 7)

| # | Risk | Probability | Impact | Mitigation | Early-warning signal |
|---|---|---|---|---|---|
| 5.1 | **Reframe breaks operational workflow at Al-Baha** — staff rely on current forms/labels; "patient→beneficiary" rename confuses daily users | Medium | High | Dual-label UI during transition (show both terms for 30 days); Al-Qarni briefed before rename goes live; revert plan on `main` | Support tickets mentioning "where's X?" within 48h of rollout |
| 5.2 | **Dignity Index methodology rejected as unscientific** — staff or ministry dismiss the 10-barrier framework | Medium | High | Launch as "operational signal" not "scientific measure"; reserve scientific claims for when beneficiary-voice module is live; cite UNCRPD framing | Pushback from any reviewer who holds clinical credentials |
| 5.3 | **Ministry reclassifies Basira as MoH territory** — "you're building an EHR" | Medium | Critical | Excise CBAHI, remove clinical framing aggressively, publish Trust-Ground position paper *before* ministry forms an opinion | Any memo/email from MoH referencing Basira |
| 5.4 | **LoC reduction removes in-use code** — "dead" code turns out to be live | Medium-low | Medium | Full Playwright run + manual smoke test before any delete commit; staging branch tested by Ahmad personally | E2E failure rate > 0 after a deletion commit |
| 5.5 | **Guardian/family portal introduces a data-leak surface** — consent model insufficient | Medium | High | Explicit RLS policies per consent grant; `pgaudit` coverage extended to `consent_grants`; pen-test before Phase 2 exit | Any guardian seeing any data they didn't consent to |
| 5.6 | **Secrets leak via `.env` or Git history** — standard risk | Low | High | Pre-commit hook scanning for keys; audit Git history for stray keys; rotate Supabase anon key if found | `gitleaks` or equivalent CI finding |
| 5.7 | **Last-step verification failure pattern returns at ministerial packet (3.4)** — Ahmad submits wrong version, wrong framing, or CBAHI slips in | Medium (per `feedback_final_step_failures.md`) | Critical | Dedicated `/verify` run on packet before any submission; `basira-ui-verifier` on live demo; two-person review (Ahmad + Claude) sign-off document | Any deliverable presented without verification log |

---

## 6. Decision Points Requiring Ahmad

### 6.1 — Rewrite vs. squeeze (Q1 re-asked formally)

**Decision:** freeze `main`, branch `v2`, add-on-top.
**Options reviewed:**
- (a) Full green-field rewrite — rejected: breaks endorsed work, repeats 2026-04-15 failure pattern at plan scale
- (b) In-place squeeze on `main` — rejected: carries forward medical-framing decisions
- **(c) Hybrid — recommended default** — freeze `main` (Basira v1 = صفر ورق), work on `v2`, retire `main` only after `v2` is ministerially approved
**If Ahmad overrides:** tell me "rewrite" or "squeeze" and §3 Phase 1 changes shape immediately.

### 6.2 — Dignity Index as reframe-everything vs. layer-on-top (Q2 re-asked)

**Decision:** layer-on-top.
**Options:**
- (a) Reframe every feature as barrier-dissolution
- **(b) Add Dignity Index measurement layer on top** — recommended
- (c) Two-speed (universal lang refactor, selective DI adoption)
**If Ahmad overrides to (a):** Phase 1 budget doubles, risk §5.1 goes from Medium to High.

### 6.3 — Trust-Ground scope (Q3 re-asked)

**Decision:** Al-Baha pilot.
**Options:**
- (a) Basira = the Trust-Ground (24-month commitment)
- (b) Basira = beneficiary-tool, Trust-Ground is separate
- **(c) Al-Baha pilot as Trust-Ground prototype** — recommended
**If Ahmad overrides to (a):** Phase 3 exit commits to ministerial rollout — needs political cover secured first.

### 6.4 — Schema column renames (medical → social)

Two concrete examples where the call is yours:
- `beneficiaries.medical_diagnosis` → `functional_assessment`? `primary_condition`? Keep, but relabel in UI only?
- `medical_profiles` table → `beneficiary_clinical_record` (still medical but name less dominant)? `care_profile`?
**Recommended:** keep column names for data-layer stability; change only *labels* and *TypeScript type names* in Phase 1. Do actual column renames in Phase 2 after v2 is stable.

### 6.5 — LoC target enforcement

66k → <40k is 40% reduction. That is aggressive. Two sub-decisions:
- Soft target (<50k at Phase 2 exit, <40k only if natural) — recommended
- Hard target (<40k by Phase 2 exit, even if it means cutting features)
**Recommended:** soft. A feature cut should be driven by compass-alignment, not LoC.

### 6.6 — First external-actor choice (Phase 2.3)

- (a) Nafath — highest prestige, highest integration cost, needs government sponsor
- **(b) Family/guardian portal — recommended** — highest dignity impact, uses existing `modules/family`, lowest political friction
- (c) School attendance — biggest impact for child beneficiaries but narrower cohort
**If Ahmad overrides:** Phase 2.3 effort and risk shift; event-ledger design (2.1) may need different event types.

### 6.7 — Ministerial engagement timing

- (a) Early (Phase 1 exit) — get feedback while course-correction is cheap
- **(b) Mid (Phase 2.3 live) — recommended** — bring a working demo, not a concept
- (c) Late (Phase 3.4) — ready-to-decide packet only
**Recommended:** (b). Ahmad's political read overrides this.

---

## 7. What I deliberately did NOT include

**Explicitly out of scope:**

1. **No ministerial rollout commitment.** The plan stops at "packet ready for decision" (3.4). Committing to a 36-center rollout without political cover is the exact "legislate-and-delegate" failure mode launchpad §6.2 names.

2. **No PT-modeling work.** Separate project (`project_pt_modeling.md`), separate rules (`feedback_pt_project_rules.md`). The two projects share DNA (social model, governmental Arabic, MHRSD audience) but live in separate repos and have separate stakeholder chains.

3. **No AI-models (H100) track work.** Per `user_profile.md`, this is a parallel track. If Basira's ML ambitions (launchpad §7.I predictive empowerment model) mature, they land as a Phase 3+ extension, not in the 12-month plan.

4. **No Know-Ahmad / external-brain integration.** `C:\dev\ahmad-brain\` is a separate system. If it becomes a data source for the Dignity Index (e.g., Ahmad's historical assessments fed as priors), that's a Phase 3+ fusion opportunity — not committed here. 🔗 دمج: noted but deferred.

5. **No Habibi-TTS integration.** The launchpad §7.C mentions reverse-STT for beneficiary voice (💡 ومضة). This would fuse two projects — *possible*, but adds cross-project risk. Noted as Phase 2.5 candidate only if Habibi is stable.

6. **No PST-forensic analysis of past deliverables.** Launchpad §7.E is a separate, sensitive project. Not plan-scope.

7. **No academic research partnership.** Launchpad §7.G proposes a university collaboration on family-caregiver economics. Valid but 9-12 months on its own and requires non-technical groundwork.

8. **No Figh × disability landscape (§7.J).** Launchpad itself flags this as "landscape map only, no deliverable." Not touching.

9. **No career-portfolio deliverable (§7.H).** Separate personal-strategy work; touches Basira only as one of ten achievements to narrate.

10. **No new AI engines.** The v3.0 experimental fork had Ihsan/Muruah/Nabd/etc. — those are NOT in `C:\dev\basira\` and are NOT re-introduced here. If the v2 plan needs a named service, it's named for what it does (`barrierClassifier`, `dignityScorer`), not for a personality.

**If Ahmad says "also do X":** X either gets folded into a phase with rejustified dependencies, or it becomes v2 of this plan. Not a one-off addition mid-phase.

---

## Appendix A — Intervention markers inventory for this document

Per launchpad §8, markers used in this plan:

| Marker | Count | Locations |
|---|---|---|
| 🧭 بوصلة | 3 | §1.3, §2.3, §3 (preamble) |
| 💡 ومضة | 1 | §7.5 reference |
| 🔗 دمج | 2 | §3 preamble, §7.4 |
| ⚠️ صراحة | 2 | §3.3.5, §5 preamble implied |
| 🤫 مسكوت | 1 | §2.3 |
| 🎯 تخصيص | 0 (reserved for in-session use) | — |

---

## Appendix B — Definition of "done" for this planning session

Per the mission spec Step 6:

1. ✅ Plan exists at `C:\dev\basira\PLAN-comprehensive-2026.md`
2. ⏳ All 7 sections populated (§0–§7) — **done in this draft**
3. ⏳ 3 alignment questions asked — **done in prior turn, defaults taken under goal-level autonomy per `feedback_autonomy.md`**
4. ⏳ Ahmad approval / named revisions — **pending your review**
5. ✅ §7 explicitly states what's NOT in scope

**Verification step (per Top Rule):** After Ahmad reads, I will:
- Confirm the file renders correctly (no markdown breakage).
- Re-verify file size + location.
- Report final status.

**Not yet done:**
- `basira-ui-verifier` live-check against current `C:\dev\basira\` dashboard (parked — this is a planning session, but recommend running before Phase 1 kickoff to establish baseline).
- Vercel preview URL liveness check (same — Phase 1.3 repo hygiene touches deployment docs).

---

*End of Plan v1. Ahmad: revise, approve, or reject. If approved, Phase 1.1 (tag `main` as `v1.0.0-zero-paper`) is the first move.*
