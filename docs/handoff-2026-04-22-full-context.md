# Handoff — 2026-04-22 — Full Session Context

> Session closeout for the Basira v2 work block that ran 2026-04-16 → 2026-04-22.
> This document exists so the next fresh Claude session can start at 100%, not 90%.

---

## 1. What shipped in this block

### Infrastructure & hygiene
- Flattened path: `Beneficiary-System-Clean-Backup\Beneficiary-System-Clean-Backup\` → `C:\dev\basira\`
- `v1.0.0-zero-paper` tag on `main` freezes MHRSD-endorsed "صفر ورق" state (2025-12-03)
- All active development on branch **`v2`** — do NOT work on `main`
- Dev server: `npm run dev` on port **5175** (strict)

### UI overhaul
- Dark theme by default (commit `31e5b4e`)
- Persuasive homepage with hero + 4 stat cards + 5 transformation pillars (`c86dd89`)
- Sidebar: 320px width, 9 sections, 4-subgroup restructure of الحوكمة والجودة
- Typography pass: section headers 13px/700, items 15px/500, `--nav-*` CSS tokens
- Arabic linguistic refactor (مريض → مستفيد throughout user-facing strings)
- Daily-care teal color (scoped CSS override, not global)
- Clothing module rebuild from ضوابط الكسوة 2020 PDF (4 phases, 4 seasons, 4-member committee, 5 damage reasons)

### Documentation
- `docs/walkthrough_basira_5.0.md` — 28-min Arabic narration script
- `docs/strategic-decision-room-proposal.md` — 417-line design rationale for Leadership Compass
- `docs/security-compliance-analysis-2026-04-22.md` — NCA ECC-2:2024 + CSCC-1:2019 gap analysis (62 HRSD policies mapped)
- `docs/risk-register.md` — 15-risk register per DT-IS-FRM-2320
- `SECURITY.md` — replaces GitHub template, maps to 12 HRSD policies
- `docs/drive-inventory-2026-04-22.md` — catalog of 46 Drive files reviewed
- `docs/codeql-workflow-template.yml` — manual-install (OAuth token lacked `workflow` scope)
- Desktop PDF: `الدليل_التعريفي_والتشغيلي_لنظام_بصيرة_v2.pdf` (526 KB, 19 pages)
- `scripts/html-to-pdf.mjs` — reusable Playwright-based converter

### Leadership Compass (بوصلة القيادة) — flagship feature
**Route:** `/leadership-compass`
**Audience:** مساعد التنمية + المدير العام فأعلى (NOT operational staff)
**Philosophy:** Helper-over-display. Every tab ends in a decision.

**7 tabs** (the قيثارة):
1. **القرارات المُعلَّقة** — pending decisions with evidence stack + 4 actions (approve/reject/delay/more_evidence)
2. **المرآة الصادقة** — structural patterns surfaced even when uncomfortable
3. **اتّجاهات 12 شهراً** — 6 KPI curves + target lines + data-quality labels (real/partial/modeled)
4. **محاكاة السيناريوهات** — budget allocation simulator with 3 strategies, side-by-side uncertainty bands
5. **اكتشف** — auto-surfaced interventions worth scaling (best practice, not best center)
6. **سجلّ القرارات** — historical decisions with outcomes at 3/6/12 months + lesson learned
7. **أفق السياسات** — weak-signal radar for policy issues 6-18 months out

**Code location:** `src/modules/leadership-compass/`
**Migration:** `supabase/sql/024_leadership_compass.sql` (NOT YET APPLIED)
**Types:** `src/types/leadership-compass.ts`

**Design principles (non-negotiable):**
1. Decision-first (data serves the decision)
2. Honest mirror (surface uncomfortable patterns)
3. Epistemic humility (declared confidence levels)
4. Time-respecting (15-min budget for busy leaders)
5. **Decision permanence** — NO DELETE policy on `strategic_decisions` table (enforced at RLS layer)
6. Barrier linkage to B1-B10 (launchpad §6.2)
7. HRSD palette + RTL throughout

---

## 2. Still open (next session candidates)

### Security / infra (unblocked by Ahmad, pending execution)
- [ ] Rotate Supabase DB password (was leaked in basira-diagnostic.mjs)
- [ ] Apply migrations 022, 023, 024 to Supabase (via dashboard or MCP)
- [ ] Close 5 Dependabot vulnerabilities
- [ ] Install CodeQL workflow via GitHub web UI (file at `docs/codeql-workflow-template.yml`)
- [ ] Build 11-document Agency handover packet (security plan Phase 2)

### Leadership Compass — v3.0
- [ ] Replace `SEED_*` imports in each tab with real Supabase hooks (shapes match migration 024 1:1)
- [ ] Tighten RLS policies (currently permissive in dev — Agency tightens at deployment)
- [ ] Mirror-finding detection queries in SQL

### UI polish candidates
- [ ] Cross-tab navigation from Decision Ledger → re-open a historical decision
- [ ] Mobile/tablet responsive pass on Leadership Compass (currently desktop-first)
- [ ] Print stylesheet for decision briefs (A4 single-page handouts)

### Code quality
- [ ] Subagent code review pass — audit the 7 Leadership Compass tabs for consistency
- [ ] Loc-reduction plan execution (`docs/loc-reduction-plan.md`)
- [ ] Storybook coverage for shared components (only if prioritized)

---

## 3. Current state — as of 2026-04-22 end-of-block

| Area | State |
|---|---|
| Branch | `v2` (ahead of origin — not pushed yet in closeout) |
| Lint | 0 errors |
| TypeScript | 0 errors |
| Build | Clean |
| Tests | Minimal coverage (not a priority this block) |
| Dev server | Runs on 5175 |
| Supabase migrations | 021 applied; 022, 023, 024 NOT applied |
| Untracked | `src/modules/grc/components/` (Governance, Risk, Compliance — to be organized next block) |

---

## 4. Working rules (Ahmad's preferences — enforced)

### Language
- Arabic for governmental content: formal register (يتم، يُحدد، يلتزم)
- Code + commit messages: English
- Conversational: mirror Ahmad
- Diacritization: full for TTS; elsewhere only when disambiguation helps
- **Never** use مريض in user-facing strings — use مستفيد

### Governance
- **Decisions are permanent** — no DELETE on strategic_decisions, ever
- **No CBAHI** in PT modeling or Basira docs
- No رankings between centers — surface best practice, not best center
- No Ahmad's name on institutional surfaces — institutional voice only

### Git
- Create new commits, don't amend
- Never push to `main` or tags without explicit Ahmad authorization
- `v2` pushes authorized by default after goal alignment
- Never `--no-verify`

### Design
- Helper-over-display (see `feedback_helper_over_display.md`)
- Aesthetic coherence matters (see `feedback_aesthetic_metaphor.md`)
- HRSD palette: navy #14415A, gold #FAB414, teal #148287, green #2DB473, orange #F5961E
- Tajawal + Readex Pro fonts
- RTL throughout

### Verification
- Before declaring done, verify user-visible outcome (not just "code ran")
- For UI: fetch URL and check signature text
- For docs: confirm the file path
- Use `basira-ui-verifier` subagent when relevant — but update its reference signature before "fixing" code that looks different

---

## 5. Key file paths (copy-paste friendly)

```
C:\dev\basira\                                           # canonical root
C:\dev\basira\src\modules\leadership-compass\            # bوصلة القيادة code
C:\dev\basira\src\types\leadership-compass.ts            # types + labels
C:\dev\basira\supabase\sql\024_leadership_compass.sql    # migration (not yet applied)
C:\dev\basira\docs\strategic-decision-room-proposal.md   # design rationale
C:\dev\basira\docs\security-compliance-analysis-2026-04-22.md
C:\dev\basira\docs\risk-register.md
C:\dev\basira\scripts\html-to-pdf.mjs                    # reusable PDF converter
C:\Users\aass1\Desktop\الدليل_التعريفي_والتشغيلي_لنظام_بصيرة_v2.pdf
```

## 6. Memory pointers (read these at session start)

The following memory files contain load-bearing context for Basira work:

- `project_basira_canonical_path.md` — path + branch + UI signature (updated 2026-04-22)
- `project_basira_leadership_compass.md` — feature reference for the 7-tab surface
- `feedback_helper_over_display.md` — design philosophy (validated 2026-04-22)
- `feedback_decisions_are_permanent.md` — governance rule (validated 2026-04-22)
- `feedback_aesthetic_metaphor.md` — Ahmad's aesthetic sensibility
- `feedback_autonomy.md` — goal-level autonomy after alignment
- `feedback_final_step_failures.md` — verify user-visible outcome

Index at `C:\Users\aass1\.claude\projects\C--Users-aass1\memory\MEMORY.md`.
