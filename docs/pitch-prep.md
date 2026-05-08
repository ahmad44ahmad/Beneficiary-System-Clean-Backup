# Basira pitch preparation — multi-session work plan

**Owner:** Ahmad Al-Shahri
**Branch:** `v2`
**Last session:** A — completed 2026-05-08, tag `pitch-prep-session-A`, HEAD `71f6563`
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
| B | Demo-path bulletproofing | Identify the EXACT 8-12 screens of the pitch, audit each end-to-end, fix everything on path | NEXT | — | — |
| C | Breadth sweep | Automated Playwright audit of all 110 routes, fix top 20 issues by density | LATER | — | — |
| D | Brand + Arabic register | HRSD typography compliance, governmental-Arabic check across user-visible strings, RTL/logo audit | LATER | — | — |
| E | Backend hardening | Replace 65× `USING(true)` RLS with auth-aware policies; schema-drift sweep (auditService had one — find others); advisor count → ~0 | LATER | — | — |
| F | *(Optional)* Build + deploy + smoke test | Production build, optional Vercel deploy, final smoke test | OPTIONAL | — | — |

**Highest-leverage order:** B → E → D → C → F. The pitch sees demo-path screens (B) and the Supabase reviewer sees the Studio dashboard (E). D sells "ministry-grade". C is insurance. F only matters if pitch is from a deployed URL.

---

## Decisions log (do NOT re-litigate without a reason)

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

## Known-clean routes (verified Session A)

| Route | Verified | Notes |
|---|---|---|
| `/dashboard` | ✓ Playwright + verifier | Heading reads `لوحة القياس التنفيذية` (note: "القياس" not "القيادة" — confirm intent). Sidebar order: الرئيسية، الخدمات الطبية، الخدمات الاجتماعية، الحوكمة والجودة، العمليات، الذكاء والتنبؤ، التقارير، (extra: القيادة الاستراتيجيّة)، الإدارة. |
| `/emergency` | ✓ post-fix | `bg-slate-900` background, white text fully visible, "كود أزرق" + 4-step protocol + vitals card render correctly. |
| `/scheduling` | ✓ post-fix | Search input now uses `text-hrsd-navy` — typed text visible. |
| `/beneficiaries-list` | ✓ | Excel export verified end-to-end (98KB SpreadsheetML, 142 rows, Arabic, filename `قائمة_المستفيدين.xls`). Print export verified end-to-end (26KB RTL HTML, valid `<table>`, auto `window.print()`). 0 console errors. |
| `/sroi` | ✓ | Dense ministry-grade page; 1.80:1 ratio matches canonical; 0 console errors. |

---

## Known-issue routes (per `docs/pitch-prep-route-audit.md` 2026-05-08)

Automated 51-route Playwright sweep at end of Session A. **0 white-on-white, 0 English fragments, 0 empty buttons** across all 51 — Session A's surface fixes held everywhere. **39 routes are density-0 clean.** 12 routes flagged for console errors, all of the same family (schema drift — code references tables that don't exist in the live DB, same root cause as Session A's `audit_logs` bug):

| Route | Density | Errors | Diagnosis |
|---|---|---|---|
| `/handover` | 18 | 6 | Code queries `public.shift_handover_items`; live DB suggests `public.san_martin_items` (rename or migration drift) |
| `/empowerment/dignity/172` | 12 → **fixed in Session A bonus** | 4 | `getPreferences` used `.single()` when 0 rows; switched to `.maybeSingle()` |
| `/basira` (Executive Dashboard alt) | 12 | 4 × 400 | Unknown table — Session B investigates |
| `/overview` (Cross-Module Dashboard) | 12 | 4 × 404 | Missing tables |
| `/ipc` | 12 | 4 × 404 | Missing tables |
| `/integrated-reports` | 12 | 4 × 404 | Missing tables |
| `/indicators/cost` | 6 | 2 × 404 | Missing tables |
| `/catering` | 6 | 2 × 404 | Missing tables |
| `/operations` | 6 | 2 × 404 | Missing tables |
| `/admin/audit-logs` | 6 | 2 × 400 | Likely SELECT side of audit_logs (Session A fixed the INSERT side) |
| `/indicators/early-warning` | 3 | 1 × 404 | Missing table |
| `/indicators/iso` | 3 | 1 × 404 | Missing table |

**Demo path diagnosis after audit:** 11/12 demo-path routes density-0. Only `/empowerment/dignity/172` had errors → fixed in Session A bonus pass (commit see below).

**3 explicit `قريباً` placeholders** (still unfixed but now scoped):
- `AssetRegistry.tsx:320` (`/operations/assets`)
- `ClothingManagementPanel.tsx:421-422` (`/clothing`)
- `LeadershipCompass.tsx:126` (`/leadership-compass`)

**`Discover.tsx:146`** placeholder `alert()` — `/leadership-compass` Discover tab.

## Schema-drift sweep — Session B priority

Audit reveals a *systemic pattern*. Session A fixed `audit_logs`; the audit shows the same drift on at least 8 other tables/services. Recommended Session B approach:

1. For each error route, identify which Supabase query is failing.
2. Cross-reference table names against `information_schema.tables` (live DB).
3. For "table doesn't exist" — either (a) add the table via migration, (b) rename the code-side query to match the live table, or (c) gracefully fall back to local mock data via `useLocalDataStore`.
4. For "0 rows returned with .single()" — switch to `.maybeSingle()` (the empowerment fix is the model — single-line change).
5. Re-run `node scripts/route-audit.mjs` after each batch; density should monotonically drop.

The goal is **0 console errors on demo-path routes** + **<5 errors total across all 51**.

---

## Carry-overs from prior session (briefing 2026-05-08)

| # | Item | Where to fix | Session |
|---|---|---|---|
| C1 | Real RLS policies (replace 65 `USING(true)` with auth-aware) | Supabase migrations | E |
| C2 | Reconcile `supabase/sql/` (24 files) vs `supabase/migrations/` drift | Supabase | E or post-pitch |
| C3 | `auth_leaked_password_protection` toggle OFF | Supabase dashboard, 1 click | Ahmad does this directly |
| C4 | GitHub MCP plugin OAuth needs re-auth | MCP setting | when needed |
| C5 | `multiple_permissive_policies` × 24 on `catering_suppliers` | DB consolidation, 10 min | E |
| ~~C6~~ | ~~Missing "Beneficiary System Clean Backup" badge~~ | **RESOLVED** — basira hub confirms the verifier reference is stale (Session A finding). Do not fix. | — |
| C7 | Heading `لوحة القياس التنفيذية` ("القياس" = measurement) — is this intended? | Decision needed | B |
| ~~C8~~ | ~~Supabase migration 024~~ | **RESOLVED** — `list_migrations` confirms `chapters_2_3_4_6_compass` (20260228060420) applied. Plus 4× 2026-05-08 migrations (grc/essential/phantom/permissive_rls). Compass runs on real schema. | — |

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
1. C:/dev/basira/docs/pitch-prep.md — full plan, decisions log, demo path
2. C:/dev/basira/docs/pitch-prep-route-audit.md — 51-route automated
   audit generated by scripts/route-audit.mjs at end of Session A
   (or freshly re-run; see Step 1 below)
3. C:/dev/basira/CLAUDE.md
4. ~/.claude/projects/C--Users-aass1/memory/MEMORY.md — note the four
   2026-05-08 feedback files
5. git log --oneline -10 v2; confirm HEAD is at or after pitch-prep-session-B

INVOKE skills:
- basira-dev
- hrsd-brand-identity
- challenge-protocol

SESSION C GOAL: Reduce route-audit issue density to ~0 across non-demo
routes (demo routes were handled in Session B).

Step 1 — Re-run the audit if Session B touched any UI code:
  cd /c/dev/basira && npm run dev (background) ; sleep 8 ;
  node scripts/route-audit.mjs
  Inspect docs/pitch-prep-route-audit.md head — confirm density
  numbers match what Session B noted.

Step 2 — Take the top 15 routes by density (excluding demo-path routes
already addressed in Session B). For each:
  a) Re-navigate via Playwright, wait ≥5s.
  b) Cross-reference the route's affected components (App.tsx routing).
  c) Apply targeted fixes — same playbook as Session A:
     - white-on-white → swap to slate-900/text-white or hrsd-navy/text-white
     - English fragments in body → translate to governmental Arabic
       (defer to arabic-check skill if any string is uncertain)
     - empty buttons → add aria-label or wire to a real handler;
       if it's a known stub, hide behind a feature flag instead
     - "قريباً" sections → if on a route reachable from the sidebar,
       either remove the entry from the sidebar or replace the
       placeholder card with a "post-pitch roadmap" panel that frames
       the gap as roadmap, not absence
  d) Lint+tsc clean before each commit.
  e) One commit per route (or per logical batch of related routes).

Step 3 — Re-run the audit. Each fixed route's density should drop
toward 0. Update docs/pitch-prep-route-audit.md by re-running the
script (it overwrites the file with a fresh timestamp).

Step 4 — Update docs/pitch-prep.md "Known-clean routes" / "Known-issue
routes" tables to reflect new state.

Step 5 — At ~85% context, run session-end protocol. Commit, push,
tag pitch-prep-session-C, update pitch-prep.md with Session D
prompt-pit, push doc commit.

Adversarial defaults ON. No sycophancy. Engineered intake. I have
full authority to commit, push, tag, and edit code.
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
