# LoC Reduction Plan: 66k → <40k

**Status:** plan (no deletions yet)
**Author:** Claude Opus 4.7 (1M), 2026-04-22
**Branch:** `v2`
**Source for measurements:** `git ls-files src | xargs wc -l` at SHA `a34c77b`.

---

## 1. Current state

- **Total:** 66,636 LoC across 314 `.ts`/`.tsx` files in `src/`.
- **Target:** <40,000 LoC before v2 is considered production-ready (per `user_profile.md`).
- **Reduction needed:** ~26,636 LoC (~40%).

---

## 2. Distribution (largest-first)

| Area | Files | LoC | % of total | Priority |
|---|---:|---:|---:|---|
| `modules/ipc` | 11 | 5,426 | 8.1% | 🔴 High — consolidation |
| `modules/grc` | 8 | 4,356 | 6.5% | 🟠 Medium — barrier-type relabel |
| `components/beneficiary` | 17 | 3,734 | 5.6% | 🟢 Keep (core) — minor dedupe |
| `components/dashboard` | 15 | 3,106 | 4.7% | 🟠 Medium — dashboard variants likely redundant |
| `components/medical` | 17 | 2,908 | 4.4% | 🔴 High — reframe under social model |
| `components/indicators` | 10 | 2,830 | 4.2% | 🟠 Medium — overlap with modules/grc |
| `components/social` | 12 | 2,393 | 3.6% | 🟢 Keep — core social-model surface |
| `modules/catering` | 11 | 2,168 | 3.3% | 🟡 Review — scope check |
| `components/quality` | 6 | 2,053 | 3.1% | 🟠 Medium — merge with modules/grc |
| `modules/operations` | 5 | 1,726 | 2.6% | 🟡 Review |
| `modules/empowerment` | 5 | 1,469 | 2.2% | 🟢 Keep — social-model bridgehead |
| `components/admin` | 5 | 1,351 | 2.0% | 🟡 Review |
| `components/common` | 17 | 1,327 | 2.0% | 🟢 Keep — UI library |
| `components/clothing` | 7 | 1,211 | 1.8% | 🟡 Review — in-scope? |
| `components/reports` | 6 | 1,127 | 1.7% | 🟡 Review |
| `components/alerts` | 5 | 1,057 | 1.6% | 🟢 Keep |
| `components/secretariat` | 4 | 943 | 1.4% | 🟡 Review |
| `components/ui` | 8 | 777 | 1.2% | 🟢 Keep — UI library |
| `components/care` | 2 | 728 | 1.1% | 🟢 Keep |
| `components/rehab` | 2 | 659 | 1.0% | 🟢 Keep |
| `components/layout` | 4 | 610 | 0.9% | 🟢 Keep |
| `components/profile` | 2 | 475 | 0.7% | 🟢 Keep |
| `components/pulse` | 2 | 471 | 0.7% | 🟢 Keep — feeds dignity index |
| `components/support` | 3 | 441 | 0.7% | 🟢 Keep |
| `components/safety` | 2 | 441 | 0.7% | 🟢 Keep |
| (smaller component dirs) | ~15 | ~2,100 | ~3% | 🟠 Collapse single-file dirs |
| `services/` | 19 | 2,890 | 4.3% | 🟠 Consolidate (finish repositories/ migration) |
| `hooks/`, `utils/`, `stores/`, `types/`, `data/`, `api/`, `pages/`, `styles/` (balance) | — | ~18k | ~27% | 🟡 Mixed |

---

## 3. Reduction targets — four big moves

### 3.1 Consolidate `modules/ipc` — target: 5,426 → 2,500 LoC (save ~2.9k)

- IPC (Infection Prevention & Control) is **Ahmad's specialty** — endorsed achievements #5, #10. But this module has grown to 11 files.
- Hypothesis: many files were added per incident-type. Consolidation into a unified "IncidentModule" with type-driven rendering should halve the file count.
- **Do NOT do** without explicit social-model review — IPC has legitimate infection-control scope at a rehab center (B1 barrier type: physical/biological).
- **Action:** audit each file; merge similar forms; extract shared incident-form primitive.

### 3.2 Reframe + consolidate `components/medical` + `types/medical.ts` — target: 2,908 → 1,800 LoC (save ~1.1k) and rename

- The 17 medical component files include clinical dashboards, vitals cards, admission assessment, dental, etc.
- Reframe first (Phase 1.4 linguistic refactor): replace patient/diagnosis/treatment language.
- Consolidate second: dental/psychology/speechTherapy/physicalTherapy each have their own component + their own type file. Shared assessment pattern → single `assessment/` component with type-driven rendering.
- **Preserve:** vital signs, medication administration, fall risk — real operational needs.
- **Retire or move:** dental/speech/psychology assessments that don't have corresponding workflow (if no social worker or therapist uses them, they're dead).

### 3.3 Merge `modules/grc` + `components/indicators` + `components/quality` → single `modules/quality-governance/` — target: 4,356 + 2,830 + 2,053 = 9,239 → 4,500 LoC (save ~4.7k)

- Three overlapping quality/governance surfaces. This is clean redundancy.
- Unify: risk matrix, KPI tracker, compliance checklist, excellence hub, NCR management — all under one module.
- ⚠️ صراحة: This is the single biggest saving in the plan and also the highest refactor risk. Do it last in Phase 2.6, after v2 is otherwise stable. Requires Playwright coverage of every affected route before starting.

### 3.4 Collapse single-file component subdirs — target: ~2,100 LoC in place, save ~150 LoC in import paths and index files

Eleven subdirs have exactly 1 file: `crisis`, `shift`, `emergency`, `scheduling`, `medication`, `training`, `family`, `assets`, `auth`, `knowledge`, `organization`.

- **Rule:** a subdir with 1 file = the file belongs in the parent (usually `components/`) unless it is clearly a placeholder for expansion.
- Move each file up; update imports; delete empty dirs.
- Saving is small but this reduces cognitive load and file-count clutter more than LoC.

---

## 4. Small wins (quick, low-risk — can happen early)

| # | Target | Saving | Effort |
|---|---|---:|---|
| 4.1 | Delete `src/data/` mock data after Supabase-first migration is complete | ~2–3k LoC | Verify zero usage in production mode first; then delete. 1 day. |
| 4.2 | Remove unused hooks (run `ts-prune` or similar) | ~500 LoC | 2 hours. |
| 4.3 | Dead-code commit `7ec77ac` already removed ~14k LoC. Re-run the same audit to catch what accumulated since | ~1–2k LoC | 1 day. |
| 4.4 | `services/supaService.ts` (629 LoC) → finish the `services/repositories/` migration started in commit `63cd925` | No net saving (moves code), but enables 4.5 | 2 days. |
| 4.5 | After 4.4: remove duplicate query helpers scattered across hooks | ~500 LoC | 1 day. |
| 4.6 | Delete `src/modules/grc/components/AddRequirementModal.tsx` if abandoned — **confirm with Ahmad** (untracked since 2026-02-03) | ~200 LoC | 30 min (plus confirmation). |

---

## 5. What is NOT cut

**Protected from LoC-reduction knife:**

- **`components/beneficiary/`** (3,734 LoC) — core. Consolidation only where it makes the social model clearer.
- **`modules/empowerment/`** (1,469 LoC) — social-model bridgehead, foundation for Dignity Index v0.
- **`supabase/sql/007_independence_tracking.sql`** — already encodes the social model.
- **`components/pulse/`, `services/wellbeingService.ts`** — both feed the Dignity Index.
- **`tests/`** — Playwright tests are the living spec; do not remove tests for LoC reasons.
- **`components/ui/`, `components/common/`, `components/layout/`** — UI library, reused everywhere.

---

## 6. Estimated totals

| Move | Saving |
|---|---:|
| IPC consolidation | ~2,900 |
| Medical reframe + consolidate | ~1,100 |
| GRC + Indicators + Quality merge | ~4,700 |
| Single-file dir collapse | ~150 |
| Small wins (4.1–4.6) | ~5,000–6,500 |
| Dead-code sweep | ~1,000–2,000 |
| Finish repositories/ migration dedupe | ~500 |
| **Estimated total reduction** | **15,350 – 17,850 LoC** |

**66,636 − ~16,000 = ~50,600.** Short of the 40k target by ~10k.

**⚠️ صراحة:** Hitting 40k without cutting features requires one of:
1. A deeper refactor of duplicate render patterns (table/form primitives)
2. Cutting features that don't map to any barrier type (clothing inventory? certain reports?)
3. Relaxing the target to 45–50k as "soft"

Recommendation in `PLAN-comprehensive-2026.md` §6.5 is to treat 40k as **soft**. Kill a feature only if it fails the barrier-compass test, not because it happens to weigh LoC.

---

## 7. Sequence

- **Phase 1 (this 90-day window):** write this plan (done), do §4.2, §4.6 dead-code passes; no large refactors.
- **Phase 2 (months 4–6):** execute §3.1 IPC consolidation, §3.4 single-file dirs, §4.4 repository migration.
- **Phase 3 (months 7–12):** §3.3 big merge (quality-governance), §3.2 medical reframe, §4.1 data/ removal.

---

## 8. Decision needed from Ahmad

- Accept "soft" 40k target, or make it hard?
- Approve §3.3 big merge (highest-risk move) for Phase 3, or push to a post-ministerial window?
- §4.6 — delete `AddRequirementModal.tsx`? Confirm yes/no.
