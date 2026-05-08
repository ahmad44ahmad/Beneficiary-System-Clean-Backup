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

## Demo path (hypothesis — confirm in Session B)

Derived from briefing artifacts (`session_2026-04-28_*` memory + briefing PowerPoint title `إيجاز معالي نائب الوزير - بصيرة.pptx`):

1. `/system-entry` → splash
2. `/dashboard` → big-picture (executive measurement KPIs, "مركز التأهيل الشامل بالباحة" + ministry subtitle)
3. `/beneficiaries` → select **Karama (أبو سعد)** beneficiary
4. **DignityProfile / cup-of-water goal** → `/empowerment` or `/empowerment/dignity/:beneficiaryId`
5. **7 AI engines** → `/indicators` (SmartIndicatorsHub) or specific (`/indicators/behavioral`, `/indicators/early-warning`, etc.)
6. **Legal Shield** → `/legal-shield`
7. **Director approval / leadership-compass** → `/leadership-compass`
8. **SROI summary** → `/sroi` (1.80:1 canonical ratio)
9. **Export demo** → `/beneficiaries-list` → click "Excel" or "طباعة"

**Action item Session B:** Confirm with Ahmad which 8-12 screens are actually in the deck/script. Until confirmed, audit all 9 above.

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

## Known-issue routes (audit pending)

- **3 explicit `قريباً` placeholders** worth checking if on demo path:
  - `AssetRegistry.tsx:320` (`/operations/assets`, `/assets`)
  - `ClothingManagementPanel.tsx:421-422` (`/clothing`)
  - `LeadershipCompass.tsx:126` (`/leadership-compass` — **likely on demo path**)
- **`Discover.tsx:146`** placeholder `alert()` admitting it's a stub — within `/leadership-compass` Discover tab. Replace with toast or wire to decisions tab.
- **All other 100+ routes:** unaudited.

---

## Carry-overs from prior session (briefing 2026-05-08)

| # | Item | Where to fix | Session |
|---|---|---|---|
| C1 | Real RLS policies (replace 65 `USING(true)` with auth-aware) | Supabase migrations | E |
| C2 | Reconcile `supabase/sql/` (24 files) vs `supabase/migrations/` drift | Supabase | E or post-pitch |
| C3 | `auth_leaked_password_protection` toggle OFF | Supabase dashboard, 1 click | Ahmad does this directly |
| C4 | GitHub MCP plugin OAuth needs re-auth | MCP setting | when needed |
| C5 | `multiple_permissive_policies` × 24 on `catering_suppliers` | DB consolidation, 10 min | E |
| C6 | Verifier flagged missing "Beneficiary System Clean Backup" badge — was it removed intentionally? | Decision needed | B |
| C7 | Heading `لوحة القياس التنفيذية` ("القياس" = measurement) — is this intended? | Decision needed | B |

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

SESSION B GOAL: Demo-path bulletproofing.

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

*(written at the end of Session B)*

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

**Verifications run:** Playwright on `/dashboard`, `/emergency`, `/scheduling`, `/beneficiaries-list`, `/sroi`. lint 0 errors. tsc 0 errors. Excel + Print exports verified end-to-end (blob inspected, Arabic + structure confirmed). audit_logs 400s gone (was 2 per page-load on `/beneficiaries-list`, now 0).
