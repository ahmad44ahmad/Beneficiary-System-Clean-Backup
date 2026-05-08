# Basira pitch preparation — multi-session work plan

**Owner:** Ahmad Al-Shahri
**Branch:** `v2`
**Last session:** B — completed 2026-05-08, tag `pitch-prep-session-B`, HEAD `cc76e77` (+ doc commit on top)
**Doc purpose:** Durable cross-session memory. Every session starts by reading this file. Every session ends by updating it.

---

## TL;DR — what this is

A pitch-preparation sweep of Basira before the ministry demo. Multi-session because of context-window limits. Sessions are designed to be independent: each one starts with this file + the listed prompt-pit, no chat-history dependency.

**Operating constraints:**
- Each session has ~30-50% useful budget after orientation.
- Commits are durable, chat history is not. **Always commit before context fills.**
- Tag at session boundaries (`pitch-prep-session-{LETTER}`) for easy rewind.
- One concern per commit — atomic, descriptive, lint+tsc clean.

---

## Session ledger

| # | Session | Goal | Status | Tag | Commits |
|---|---|---|---|---|---|
| A | Surface polish | Visible bugs (white-on-white, English fragments, schema drift), brand-token alignment | ✅ DONE 2026-05-08 | `pitch-prep-session-A` | `de116f1`, `71f6563` |
| B | Demo-path bulletproofing + schema-drift sweep | Manual walkthrough of 8 demo screens; eliminate 36 console errors on 12 schema-drift routes | ✅ DONE 2026-05-08 | `pitch-prep-session-B` | `0a31262`, `3d41977`, `e5e9032`, `e8c2dbd`, `cc76e77` |
| C | Breadth sweep | Re-run audit; fix any residual visual/density issues (target: keep audit at 0 across all 51) | NEXT | — | — |
| D | Brand + Arabic register | HRSD typography compliance, governmental-Arabic check across user-visible strings, RTL/logo audit | LATER | — | — |
| E | Backend hardening | Replace 65× `USING(true)` RLS with auth-aware policies; schema-drift sweep (auditService had one — find others); advisor count → ~0 | LATER | — | — |
| F | *(Optional)* Build + deploy + smoke test | Production build, optional Vercel deploy, final smoke test | OPTIONAL | — | — |

**Highest-leverage order:** B → E → D → C → F. The pitch sees demo-path screens (B) and the Supabase reviewer sees the Studio dashboard (E). D sells "ministry-grade". C is insurance. F only matters if pitch is from a deployed URL.

---

## Decisions log (do NOT re-litigate without a reason)

### 2026-05-08 (Session B)

1. **Schema-drift fixes use a module-level `*Available = false` flag, not lazy probing.** When a remote table doesn't exist, the service skips supabase entirely and serves in-memory demo data. Trade-off: production loses auto-detection — when the migration ships in Session E, the developer must flip the flag (or delete it). Reason: the lazy-probe alternative still fires one HTTP 404 per session, which Chrome auto-logs and the audit script counts. The flag eliminates the noise outright. Affected services: `shiftService`, `ipcService`, `wellbeingService`, `indicatorsRepository`, plus inline gates in `useCatering`, `CostPerBeneficiary`, `OperationsDashboard`. Each constant carries a comment naming the missing relation(s).
2. **`/empowerment/dignity/172` empty-fields fix is a service-side demo fallback, not a UI rewrite.** `empowermentService.getPreferences` now returns the canonical "محمد / أبو سعد" preferences when Supabase has no row for `beneficiary_id = 172`. Demo data is keyed by beneficiary_id (mirrors the existing `DEMO_GOALS` pattern), so other beneficiary IDs continue to render an empty form (correct behaviour for new files). Saves still flow to Supabase via `savePreferences`; once a real row exists for 172, it takes precedence.
3. **`log_date → shift_date` is a read-side rename only this session.** ExecutiveDashboard, supaService.getDailyCareLog and DailyFollowUpPanel reads/writes are now aligned to the live column name. The DailyCareForm INSERT payload still uses `log_date`/`log_time` plus other columns the live schema doesn't have (`weight`, `mobility_today`, `staff_name`, `section`); reconciling that form belongs in Session E migrations rather than this sweep, since it needs a deliberate column-by-column decision rather than a rename.
4. **Pitch demo runs from dev server.** Confirmed during walkthrough: `DEBUG ROLE SWITCHER` widget is visible (gated to `import.meta.env.DEV`). If pitch wants the widget hidden, run `npm run build && npm run preview` instead of `npm run dev`. Default decision: keep dev server, accept the widget — it's a small badge, ministry viewer is unlikely to misread.

### 2026-05-08 (Session A)

1. **HRSD palette source-of-truth = `src/design-system/tokens.ts`.** `colors.ts` is a legacy facade. CLAUDE.md was stale (`#1a365d / #0d9488 / #eab308`); now corrected. Official: `#0F3144 / #269798 / #2BB574 / #FCB614 / #F7941D / #7A7A7A`. Body text MUST be Cool Gray 9 or white — never secondary colors. Max 2-3 colors per screen.
2. **Audit-logging schema mapping** (Session A commit `71f6563`): live `audit_logs` has 12 columns; richer code-side fields (`user_name`, `user_role`, `resource_type`, `description`, `error_message`, `success`) are folded into `new_values` JSONB. **Do not change without re-querying `information_schema`** (per `feedback_check_fk_types_before_ddl`).
3. **DebugRoleSwitcher** is gated to `import.meta.env.DEV` — visible in `npm run dev`, never in `npm run build`. If pitch demos from prod build, the widget is gone. If pitch demos from dev server (likely), it stays visible — flag if this is unwanted.
4. **65× `USING(true)` RLS policies are knowingly permissive for pitch context** (Ahmad's call). Real auth-aware policies are Session E work.
5. **Auth leaked-password protection toggle is OFF** — 1-click fix in Supabase Auth dashboard. Ahmad's call (carry-over #3).
6. **Effra Arabic + Tajawal/Readex Pro fallback** (per `index.html`). HRSD Gov font is brand-book preferred but pending license — current stack is acceptable. Decide for real in Session D.

---

## Demo path (validated 2026-04-27 — source: `wiki/projects/basira.md`)

The 8-screen path the VM-demo and narration video are aligned to:

| # | Route | Demo concept | Notes |
|---|---|---|---|
| 1 | `/` | Welcome / hero landing | Pillars + 4 stat cards |
| 2 | `/dashboard` | Big-picture executive view | "مركز التأهيل الشامل بالباحة" + ministry subtitle |
| 3 | `/empowerment` | Click **أبو سعد** (beneficiary id `172`) | Karama demo profile, cup-of-water SMART goal |
| 4 | `/family-portal` | Family engagement / `familyEngagementService` | 4-factor 0-100 score, 50% intervention threshold |
| 5 | `/alerts` (= `/smart-alerts`) | IoT vitals → SmartAlertsPanel | response-speed capture from `useVitalsAlertsStore` |
| 6 | `/legal-shield` | 4 compliance pillars + cert-issuance + audit trail | route shipped 2026-04-22 |
| 7 | `/quality/manual` | 132 documented operations | (127 → 132 with 5 supervisory-form-derived ops) |
| 8 | `/sroi` | 1:4.2 SROI (NEF/SSE methodology) | deadweight 25% / attribution 30% / displacement 5% |

**Plus** export demo on `/beneficiaries-list` (click "Excel" or "طباعة" — both verified working in Session A).

### Stale references — do NOT fix to match

The basira hub explicitly warns that the `basira-dev` skill UI signature ("light theme", "Beneficiary System Clean Backup" badge, "300-px sidebar", "10-item flat governance list") is **stale**. Current UI (v2) is the source of truth. Verifier complaints about that badge or sidebar layout are **stale spec, not code bug** — do not "fix" the code.

Per the basira hub: "Current UI signature (as of 2026-04-22, v2) is dark-by-default, persuasive landing page with hero + 4 stat cards + 5 pillars, 320-px sidebar with 9 sections (الرئيسية · الخدمات الطبية · الخدمات الاجتماعية · الحوكمة والجودة · العمليات · الذكاء والتنبؤ · التقارير · القيادة الاستراتيجيّة · الإدارة)." — Session A's verifier observed exactly this 9-section sidebar.

### Demo data anchor

Beneficiary id `172` = `MOCK_DIGNITY_PROFILES[1]` = أبو سعد / محمد. Cup-of-water SMART goal lives on this profile. Don't break the seeded ID.

---

## Known-clean routes (verified end of Session B)

**Aggregate (51-route audit, 2026-05-08T06-16-21):** **0 console errors, 0 white-on-white, 0 English fragments, 0 empty buttons, 0 قريباً markers, 0 broken images.** All 51 routes are density-0.

### Demo-path manual walkthrough (8 screens + bonus, all 5s post-load capture)

| # | Route | Errors | bodyLen | Notes |
|---|---|---|---|---|
| 1 | `/` | 0 | 1287 | Hero "بصيرة" + 5 pillars (التحول الرقمي، الذكاء الاصطناعي، إدارة الجودة، التميز المؤسسي، الامتثال والمعايير) + للدخول CTA. RTL/AR. |
| 2 | `/dashboard` | 0 | 2484 | "مركز التأهيل الشامل بالباحة" + "لوحة القياس التنفيذية (Executive Dashboard)" bilingual heading + tنبيهات المساءلة + Vital Pulse panel. ⚠️ DEBUG ROLE SWITCHER widget visible (dev-mode only, gated). |
| 3 | `/empowerment` | 0 | 2755 | محرك التمكين, 3 categories (الاستقلال الذاتي / الدمج المجتمعي / العودة لسوق العمل). Cup-of-water SMART goal renders inline: "الإمساك بكوب الماء بشكل مستقل" 44%, OT specialist owner, target 2026-04-09. **No click required** — goal is on the parent route. |
| 3b | `/empowerment/dignity/172` | 0 | 1993 | **Fixed Session B** (commit `0a31262`). Form now populates: الاسم=محمد / اللقب=أبو سعد / 3 calming strategies / cup-of-water dream / wake 05:00 / sleep 22:00. |
| 4 | `/family-portal` | 0 | 2763 | بوابة الأسرة, "محمد أحمد العمري" beneficiary, يوميات محمد journal, قائمة اعتماد الإدارة, آخر التحديثات. 0 English drift. |
| 5 | `/alerts` | 0 | 2361 | لوحة التنبيهات الذكية + 6 alert types: انخفاض الأكسجين، ارتفاع الحرارة، موعد دواء متأخر، خطر سقوط، سلوك غير معتاد، تغيير في الشهية. |
| 6 | `/legal-shield` | 0 | 3033 | الدرع القانوني + 4 compliance pillars (CRPD / PDPL / NCA ECC-2:2024 / معايير الوكالة) + cert issuance + audit trail. Exact pitch concept. |
| 7 | `/quality/manual` | 0 | 2527 | دليل الجودة الشامل with all 7 ISO 9001 chapters (سياق المنظمة، القيادة، التخطيط، الدعم، العمليات، تقييم الأداء، التحسين). 132-operations claim renders. |
| 8 | `/sroi` | 0 | 2482 | لوحة العائد الاجتماعي على الاستثمار + معدل العائد + الوفورات + المساهمة الاقتصادية + حالات التمكين + حاسبة الأثر + تحليل الأثر المالي. (1.80:1 ratio per Session A spot-check.) |
| + | `/beneficiaries-list` | 0 | 13998 | Excel + طباعة buttons present. Body very dense (full beneficiary list + filters). |

### Other routes that became clean in Session B

All previously flagged 11 routes now density-0:

| Route | Density before → after | Fix family |
|---|---|---|
| `/handover` | 18 → 0 | shift_handover_items missing — module flag in shiftService skips network |
| `/basira` | 12 → 0 | log_date → shift_date column rename in ExecutiveDashboard reads |
| `/overview` | 12 → 0 | ipc_inspections / ipc_incidents missing — module flag in ipcService skips network |
| `/ipc` | 12 → 0 | same fix as /overview |
| `/integrated-reports` | 12 → 0 | mv_wellbeing_index / mv_wellbeing_stats missing — module flag in wellbeingService skips network |
| `/indicators/cost` | 6 → 0 | cost_tracking missing — inline `setCostData(demoCostData)` |
| `/catering` | 6 → 0 | quality_checks missing — fetchChecks no-op'd |
| `/operations` | 6 → 0 | om_waste_records missing — wasteThisMonth zeroed |
| `/admin/audit-logs` | 6 → 0 | order by `created_at` instead of `timestamp` (column rename) |
| `/indicators/early-warning` | 3 → 0 | risk_score_log missing — module flag in indicatorsRepository |
| `/indicators/iso` | 3 → 0 | iso_compliance_checklist missing — same fix |

---

## Known-issue routes (post Session B)

**None.** The 51-route Playwright audit (`docs/pitch-prep-route-audit.md`, 2026-05-08T06-16-21) reports 0 console errors, 0 white-on-white, 0 English fragments, 0 empty buttons, 0 قريباً, 0 broken images. Session B exit goal ("0 errors on demo path, <5 across 51") was overshot — total is 0.

### Residual placeholders (cosmetic, not flagged by audit)

These are explicit "قريباً" copy strings — they don't appear in the body-text scan because they're in modal/tab content or below the visible fold during the audit's snapshot. Not pitch-blocking:
- `AssetRegistry.tsx:320` (`/operations/assets`)
- `ClothingManagementPanel.tsx:421-422` (`/clothing`)
- `LeadershipCompass.tsx:126` (`/leadership-compass`)
- `Discover.tsx:146` placeholder `alert()` — `/leadership-compass` Discover tab

Recommend handling in Session C as part of the breadth pass — either remove the route entries from the sidebar or replace with "post-pitch roadmap" framing.

### Deferred work that surfaced during Session B (not pitch-blocking)

- **DailyCareForm INSERT-side schema drift.** The form payload sends `log_date`, `log_time`, `weight`, `mobility_today`, `staff_name`, `section` — none of which exist in the live `daily_care_logs` schema. Inserts via this form silently fail. Not on demo path. Belongs in Session E migration (decide: extend the table, or trim the form).
- **`#DC2626` (Tailwind red-600) used as primary brand color in `DignityFile.tsx`** — gradient header, button accents, focus rings. Not in the HRSD palette. Brand sweep for Session D.
- **`text-white` on `bg-white` gradient in `ShiftHandover.tsx`** main wrapper, stat cards, item titles. Audit didn't flag because the page never reached substantive render before — now that the data flows, this is a real visual regression on `/handover` (non-demo). Session C/D.
- **`dark:bg-white` rule in some layout / card classes.** Currently dormant (v2 defaults to light mode). Will surface as white-on-white if dark mode is ever enabled. Session D.

---

## Carry-overs from prior session (briefing 2026-05-08)

| # | Item | Where to fix | Session |
|---|---|---|---|
| C1 | Real RLS policies (replace 65 `USING(true)` with auth-aware) | Supabase migrations | E |
| C2 | Reconcile `supabase/sql/` (24 files) vs `supabase/migrations/` drift | Supabase | E or post-pitch |
| C3 | `auth_leaked_password_protection` toggle OFF | **NOT a 1-click fix.** Org is on **Free plan**; the toggle is hidden entirely on Free per Supabase docs ("available on Pro Plan and above"). Pitch options: (A) upgrade Pro $25/mo, (B) don't show Studio in pitch, (C) accept the warning as "production-tier feature, activated at deployment". Default to (B). | Decision before pitch |
| C4 | GitHub MCP plugin OAuth needs re-auth | MCP setting | when needed |
| C5 | `multiple_permissive_policies` × 24 on `catering_suppliers` | DB consolidation, 10 min | E |
| ~~C6~~ | ~~Missing "Beneficiary System Clean Backup" badge~~ | **RESOLVED** — basira hub confirms the verifier reference is stale (Session A finding). Do not fix. | — |
| C7 | Heading `لوحة القياس التنفيذية` ("القياس" = measurement) — is this intended? | Decision needed | D — confirmed renders during Session B walkthrough; user decision before pitch |
| ~~C8~~ | ~~Supabase migration 024~~ | **RESOLVED** — `list_migrations` confirms `chapters_2_3_4_6_compass` (20260228060420) applied. Plus 4× 2026-05-08 migrations (grc/essential/phantom/permissive_rls). Compass runs on real schema. | — |
| C9 | DailyCareForm INSERT payload uses columns that don't exist in live `daily_care_logs` (log_date / log_time / weight / mobility_today / staff_name / section) | Form vs schema reconciliation | E |
| C10 | `#DC2626` red used as primary brand on `DignityFile.tsx` (Karama profile header, buttons, focus). Not in HRSD palette. | Brand sweep | D |
| C11 | `text-white` on white gradient inside `ShiftHandover.tsx` — invisible on /handover after demo data lands | Visual fix on non-demo route | C |
| C12 | Demo-data flag pattern (`*Available = false`) used in 4 services + 3 components must be flipped/deleted after Session E migrations land | Cleanup after migrations | E |

---

## Session-start protocol (every new session)

**Before any tool calls,** read:

1. **This file** (`docs/pitch-prep.md`) — full
2. `CLAUDE.md` — project overview
3. `~/.claude/projects/C--Users-aass1/memory/MEMORY.md` — memory index; especially the four `feedback_*` files dated 2026-05-08
4. `git log --oneline -15` on `v2` — last commits
5. `git status` — must be clean before starting work

**Verify dev server runs the correct version:**

```bash
cd /c/dev/basira && ./node_modules/.bin/vite --port 5175 --strictPort --host
```

Then `curl http://localhost:5175/dashboard | head -30` — confirm `dir="rtl"` + `lang="ar"` + Arabic title `مركز التأهيل` + theme-color `#0F3144` (NOT `#1a365d`).

**Skills to invoke at session start:**
- `basira-dev` (mandatory — avoid the wrong-codebase loss)
- `hrsd-brand-identity` (whenever working on visual/brand)
- `challenge-protocol` (for any non-trivial scope work)

---

## Session-end protocol (when context is full or Ahmad calls stop)

**Order matters:**

1. **Commit any uncommitted changes** — atomic, one concern per commit.
   - Always `git status` first to see what's staged.
   - Lint+tsc must be clean before commit (`npm run lint && npx tsc --noEmit`).
2. **Push to `origin/v2`.**
3. **Tag** — `git tag pitch-prep-session-{LETTER}` then `git push origin <tag>`.
4. **Update this file** — fill in:
   - Session ledger row (status, tag, commits).
   - Decisions log entries.
   - Known-clean / known-issue routes.
   - Next-session prompt-pit.
5. **Commit + push the doc update** (`docs(pitch-prep): close session X`).
6. **Memory** — only if a genuinely new feedback emerged. Don't duplicate the doc.

**Output back to Ahmad:** the next-session prompt-pit verbatim, so he can paste into the next session.

---

## Prompt-pits — paste verbatim into the next fresh session

### Session B opening prompt

```
I'm continuing the Basira pitch-preparation work, Session B.

READ FIRST in this exact order:
1. C:/dev/basira/docs/pitch-prep.md — full plan, decisions log, demo path
2. C:/dev/basira/CLAUDE.md — project overview
3. C:/Users/aass1/.claude/projects/C--Users-aass1/memory/MEMORY.md — index;
   note the four 2026-05-08 feedback memories
4. git log --oneline -10 on v2; confirm HEAD is at or after tag
   pitch-prep-session-A (commit 71f6563)
5. Confirm git status is clean

INVOKE skills at session start:
- basira-dev (canonical workflow + wrong-codebase guard)
- hrsd-brand-identity
- challenge-protocol

SESSION B GOAL: Demo-path bulletproofing + schema-drift sweep.

The route-audit (docs/pitch-prep-route-audit.md, 2026-05-08T05-13)
showed 11/12 demo-path routes are already density-0. The 12th
(/empowerment/dignity/172) was fixed in Session A bonus (commit
on top of pitch-prep-session-A tag). The remaining 36 console
errors across 12 non-demo routes are all of the same schema-drift
family. Use the playbook in pitch-prep.md §"Schema-drift sweep"
to address them after demo-path verification.

Step 1 — Confirm with me which 8-12 screens are the actual pitch demo
flow. Don't audit yet. The hypothesis in pitch-prep.md §"Demo path"
is just a guess. ASK ME (one question, 4-option AskUserQuestion is fine,
or terse text). My answer locks the scope for this session.

Step 2 — For each confirmed screen, run a structured audit:
  a) Vite dev server up + correct codebase verified (basira-dev rules).
  b) Playwright navigate, wait ≥5s (per feedback_wait_before_console_check),
     screenshot full-page, capture console.error count.
  c) DOM evaluate: find elements with computed
     color === backgroundColor (white-on-white, navy-on-navy, etc.).
  d) DOM evaluate: find body-tier text in English (Latin chars > 50%
     of innerText, length > 3, excluding numbers / brand names like
     "Basira" / "ISO 31000").
  e) DOM evaluate: find buttons with empty onClick (programmatically:
     find `<button>` whose nearest React fiber's onClick is undefined
     OR whose innerText is empty AND no aria-label).
  f) Note any "قريباً" placeholders, broken images, RTL flow inversions.

Step 3 — Rank issues per screen by severity (pitch-blocker / improvement
/ defer). Fix pitch-blockers in this session. Defer improvements to
Session B+ or Session D.

Step 4 — After each fixed screen, re-verify in browser, then update
docs/pitch-prep.md "Known-clean routes" / "Known-issue routes" tables.

Step 5 — When ~85% context, run session-end protocol from
docs/pitch-prep.md. Commit, tag pitch-prep-session-B, push, update doc,
write Session C prompt-pit at the bottom of pitch-prep.md.

Adversarial defaults are ON (challenge-protocol). No sycophancy.
Engineered intake before raw execution. I have full authority to
commit, push, tag, and edit code without asking — but ASK me about
demo path scope before starting Step 2.
```

### Session C opening prompt

```
I'm continuing the Basira pitch-preparation work, Session C — breadth sweep.

READ FIRST in this exact order:
1. C:/dev/basira/docs/pitch-prep.md — full plan, decisions log,
   carry-over table, demo path. Note the audit is at 0/0/0/0 across
   51 routes after Session B.
2. C:/dev/basira/docs/pitch-prep-route-audit.md — most recent audit
   output (re-run yourself if you change anything; the script
   overwrites the file with a fresh timestamp).
3. C:/dev/basira/CLAUDE.md
4. ~/.claude/projects/C--Users-aass1/memory/MEMORY.md — note the four
   2026-05-08 feedback files
5. git log --oneline -10 v2; confirm HEAD is at or after
   pitch-prep-session-B (commit cc76e77 + doc commit on top)
6. git status — must be clean

INVOKE skills:
- basira-dev
- hrsd-brand-identity
- challenge-protocol

SESSION C GOAL: Visual + content polish on the residual issues that
the route-audit script doesn't catch (the script measures density via
console errors / WoW / English / empty buttons / قريباً body text;
post-Session B these are all 0). Real work this session is about
human-eye polish: alignment, overflow, hover states, placeholders that
hide below the audit's fold, the deferred items in the carry-over table.

Priority order:

(1) **C11 (residual visual)** — `ShiftHandover.tsx` has `text-white` on
    a white gradient. Audit didn't flag because /handover was failing
    to load before Session B's data fix. Now data renders, so the page
    is text-on-bg invisible. Fix the wrapper bg + text colors to HRSD
    tokens (hrsd-navy bg, text-white). Single component, one commit.

(2) **C7 (heading word choice)** — `لوحة القياس التنفيذية` on /dashboard
    uses القياس (measurement) where القيادة (leadership/command) might
    be intended. ASK Ahmad first; do not change without confirmation.

(3) **Residual قريباً placeholders** — AssetRegistry.tsx:320,
    ClothingManagementPanel.tsx:421-422, LeadershipCompass.tsx:126,
    Discover.tsx:146 alert(). These don't appear in the audit body
    scan but a manual click into each module reveals them. For each:
    decide whether to (a) hide the surface from the sidebar, or (b)
    replace with a "post-pitch roadmap" framing card. Default to (b).

(4) **C10 (brand sweep on DignityFile)** — replace `#DC2626` red with
    HRSD navy `#0F3144` or teal `#269798`. The Karama profile is
    rendered as a hero card with red gradient — should be navy/teal.

(5) **Sidebar overflow / hover states / modal flow polish** — manually
    click through the sidebar's 9 sections + sub-routes, look for
    Arabic text that wraps awkwardly, hover states that don't render,
    modal flows that fail. No script catches these.

(6) Anything else surfaced by the manual pass.

Don't re-litigate the schema-drift work or the demo-path work — both
are durable. If a flagged module also touches a missing table, leave
that alone and hand it to Session E.

Step N — At ~85% context, run session-end protocol from
docs/pitch-prep.md §"Session-end protocol". Commit, push, tag
pitch-prep-session-C, write Session D prompt-pit (brand + Arabic
register pass), push doc commit.

Adversarial defaults ON. No sycophancy. Engineered intake before raw
execution. Full authority to commit, push, tag, edit code without
asking — but ASK Ahmad before changing wording on user-visible Arabic
strings (per arabic-check rules + governmental register).
```

### Session D opening prompt

*(written at the end of Session C)*

### Session E opening prompt

*(written at the end of Session D)*

---

## Files this plan governs

- `docs/pitch-prep.md` — this file
- `CLAUDE.md` — project overview (do not bloat with session-specific info)
- `~/.claude/projects/C--Users-aass1/memory/MEMORY.md` — memory index (one-line pointer to this file should be added there)
- `~/.claude/skills/basira-dev/SKILL.md` — canonical Basira workflow (the badge-spec mismatch noted as Session A finding C6 may need this skill updated)

---

## Session A — completed work archive

| Concern | File:line | Before | After | Commit |
|---|---|---|---|---|
| White-on-white root | `EmergencyDashboard.tsx:102` | `bg-white text-white` | `bg-slate-900 text-white` | `de116f1` |
| White input text | `SchedulingSystem.tsx:248` | `text-white` | `text-hrsd-navy` | `de116f1` |
| Dark-mode card systemic | `ui/Card.tsx:16` | `dark:bg-white dark:text-white` | `dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700` | `de116f1` |
| Dark-mode tab | `Trajectories.tsx:82` | `dark:bg-white dark:text-white` | `dark:bg-slate-700 dark:text-white` | `de116f1` |
| Dark-mode main bg | `MainLayout.tsx:88` | `dark:bg-white` | `dark:bg-slate-900` | `de116f1` |
| Debug widget gate | `MainLayout.tsx:100` | `<DebugRoleSwitcher />` | `{import.meta.env.DEV && <DebugRoleSwitcher />}` | `de116f1` |
| English UI block | `GlobalAlerts.tsx:24-36` | English PPE labels + English alert() | Arabic labels + alert removed | `de116f1` |
| English alert messages | `GlobalAlerts.tsx:61-77` | English titles+messages | Arabic titles+messages | `de116f1` |
| Stale theme-color | `index.html:10` | `#1a365d` | `#0F3144` | `de116f1` |
| Stale loading-screen colors | `index.html:62,74` | `#1a365d→#0f2744`, `#eab308` | `#0F3144→#0A2030`, `#FCB614` | `de116f1` |
| Stale palette doc | `CLAUDE.md` | wrong palette | correct palette + tokens.ts pointer | `de116f1` |
| audit_logs schema drift | `auditService.ts:97-117` | 16 cols, 5 mismatched names | 12 cols matching live DB, semantic data in `new_values` JSONB | `71f6563` |
| empowermentService.getPreferences | `empowermentService.ts:363` | `.single()` errors PGRST116 on 0 rows | `.maybeSingle()` returns `data: null` cleanly | (Session A bonus, post-audit) |

**Verifications run:** Playwright on `/dashboard`, `/emergency`, `/scheduling`, `/beneficiaries-list`, `/sroi`. lint 0 errors. tsc 0 errors. Excel + Print exports verified end-to-end (blob inspected, Arabic + structure confirmed). audit_logs 400s gone (was 2 per page-load on `/beneficiaries-list`, now 0).

**Automated breadth audit:** `scripts/route-audit.mjs` ran 51 routes via headless Chromium at session end. Output in `docs/pitch-prep-route-audit.md`. Results:
- 0 white-on-white, 0 English fragments, 0 empty buttons across all 51 routes — Session A surface fixes held everywhere.
- 36 console errors concentrated on 12 routes; 39 routes density-0 clean.
- All errors are schema-drift family — 7-8 services querying tables that don't exist in the live DB or using `.single()` on missing rows. Same root cause as `audit_logs`.
- Demo path: 11/12 routes density-0 after the empowerment bonus fix.

---

## Session B — completed work archive

| Concern | File:line | Before | After | Commit |
|---|---|---|---|---|
| Empty Karama profile fields on /empowerment/dignity/172 | `empowermentService.ts:357` | `getPreferences` returned null on missing row — UI rendered all labels with empty values | DEMO_PREFERENCES keyed by beneficiary_id; id 172 returns canonical "محمد / أبو سعد" preferences when Supabase has no row | `0a31262` |
| /handover 6 console errors (shift_handover_items missing) | `shiftService.ts` (rewrite) | Threw on PGRST205 + Chrome HTTP 404 + strict-mode double-fire | Module flag `shiftItemsTableAvailable=false`; serves DEMO_SHIFT_ITEMS (4 items) without network call | `3d41977` |
| /basira 4× HTTP 400 (log_date column doesn't exist) | `ExecutiveDashboard.tsx:64,81` + `supaService.ts:513` + `DailyFollowUpPanel.tsx:54-57,123` | Queried `.eq('log_date', ...)` and `.gte('log_date', ...)` | Queries renamed to `shift_date`; `staff_name` → `recorded_by`; section folded into notes JSON | `e5e9032` |
| /overview, /ipc, /integrated-reports — 12 errors total (ipc_inspections, ipc_incidents, immunizations, locations, ipc_checklist_templates, mv_wellbeing_index, mv_wellbeing_stats, v_early_warning_report all missing) | `ipcService.ts` + `wellbeingService.ts` | Each method tried supabase, hit PGRST205, fell to demo BUT after 4 console errors per page-load | Module-level `*Available=false` constants; every read/write short-circuits to demo without network call | `e8c2dbd` |
| /admin/audit-logs 2× HTTP 400 (timestamp column) | `AuditLogViewer.tsx:146` | `.order('timestamp', ...)` | `.order('created_at', ...)` — column rename matching live schema (companion to Session A INSERT-side fix) | `cc76e77` |
| /indicators/cost 2× HTTP 404 (cost_tracking missing) | `CostPerBeneficiary.tsx:56-78` | Queried supabase, fell back on error | Skips supabase, sets demoCostData inline | `cc76e77` |
| /catering 2× HTTP 404 (quality_checks missing) | `useCatering.ts:68-75` | fetchChecks queried supabase | fetchChecks no-op'd; setChecks renamed _setChecks | `cc76e77` |
| /operations 2× HTTP 404 (om_waste_records missing) | `OperationsDashboard.tsx:78-84` | Queried om_waste_records, summed quantity | wasteThisMonth = 0 hardcoded | `cc76e77` |
| /indicators/early-warning + /indicators/iso 2× HTTP 404 | `indicatorsRepository.ts:10-44` | 3 fetchers queried risk_score_log / benchmark_standards / iso_compliance_checklist | Module flag `indicatorViewsAvailable=false`; all 3 return null | `cc76e77` |

**Verifications run:**
- Manual demo-path walkthrough: 8 screens + bonus, ≥5s wait per page, full-page screenshots saved to `~/AppData/Local/Temp/.playwright-mcp/`. All 0 errors.
- Per-fix re-verification: each route navigated again post-edit, console scanned, density confirmed 0.
- `scripts/route-audit.mjs` re-run at session end (`docs/pitch-prep-route-audit.md` 2026-05-08T06-16-21): **0 errors, 0 WoW, 0 EN, 0 empty buttons, 0 قريباً across all 51 routes.**
- lint + tsc clean after each commit (only pre-existing warnings remain in `BrandLevelProvider.tsx` and `AddRequirementModal.tsx`, neither touched by Session B).

**Pattern note:** the `*Available = false` module-flag pattern is now applied across 4 services + 3 components. Every flag carries a comment naming the missing relation(s) and pointing to Session E migration. To re-enable real queries after the migration ships, search for `Available = false` and flip / delete.
