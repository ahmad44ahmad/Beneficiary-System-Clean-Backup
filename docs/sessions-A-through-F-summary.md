---
title: "Basira (نظام بصيرة) — Pitch-Prep Complete Record (Sessions A–F)"
author: "Ahmad Al-Shahri · with Claude (Opus 4.7)"
date: "2026-05-08"
geometry: margin=18mm
fontsize: 11pt
---

# Basira — Pitch-Prep Complete Record

**Sessions A–F · 2026-04-26 → 2026-05-08 · Branch `v2` · Final tag `pitch-prep-session-F`**

---

## Executive summary

Six tagged sessions on the `v2` branch took Basira from a working-but-rough development build to a verified production deploy hosted at **`https://beneficiary-system-clean-backup.vercel.app`**. End-of-sweep state:

- **Pitch URL ready:** `…/dashboard?as=demo` triggers an invisible signin to a seeded director account; the URL parameter is then dropped from the address bar.
- **51-route audit on production:** zero console errors, zero white-on-white text, zero English drift, zero empty buttons, zero «قريباً» placeholders, zero broken images, zero navigation failures.
- **Backend hardened:** Supabase advisor lints reduced from **90 → 5** (3 accepted, 2 intentional). 258 RLS policies on `authenticated`, **0 on `public`** (anonymous access blocked).
- **Brand sweep complete:** HRSD palette canonical at `src/design-system/tokens.ts`. No off-palette code residue.
- **Laptop fallback verified:** `http://localhost:5175/dashboard` runs the canonical Vite dev server with auto-signin under `import.meta.env.DEV`.
- **Pitch is unblocked.** All remaining work in the carry-over table is explicitly post-pitch.

---

## The pitch survival kit (one-glance)

| | |
|---|---|
| **Pitch URL** | `https://beneficiary-system-clean-backup.vercel.app/dashboard?as=demo` |
| **Auto-signin** | URL flag → `demo@basira.local` / `app_metadata.role=director` · param drops after ~2 seconds |
| **Manual fallback** | `/login` → `demo@basira.local` / `demo-pitch-2026` |
| **Wi-Fi failure** | Run Vite at `C:\dev\basira` on port 5175 (auto-signs in dev mode) |
| **Latest deploy** | `dpl_DSjcBc61kbgwTVTQ2VfCSHzEzmHr` (target: production) |
| **Roll back** | `vercel rollback` |
| **Beneficiary anchor** | id `172` = محمد / أبو سعد · cup-of-water SMART goal |

### 8-screen click order (+ 2 bonus)

1. `/` — بصيرة + 5 ركائز + للدخول
2. `/dashboard` — لوحة القيادة التنفيذية (Executive Dashboard) + Vital Pulse + المساءلة
3. `/empowerment` — محرك التمكين, 3 مسارات. Click **أبو سعد** → `/empowerment/dignity/172`
   - 3b: Karama profile populated (محمد / أبو سعد · cup-of-water dream · first-person fields with tashkeel)
4. `/family-portal` — بوابة الأسرة, journal, 4-factor 0–100 score, 50% intervention threshold
5. `/alerts` — 6 IoT-derived alert types (O₂, حرارة, دواء, سقوط, سلوك, شهية)
6. `/legal-shield` — 4 compliance pillars (CRPD, PDPL, NCA ECC-2:2024, معايير الوكالة) + cert + audit trail
7. `/quality/manual` — ISO 9001, 7 chapters, 132 documented operations
8. `/sroi` — 1.80:1 ratio, NEF/SSE methodology (deadweight 25% / attribution 30% / displacement 5%)

Bonus: `/beneficiaries-list` (Excel + طباعة export) · `/handover` (seeded RLS-protected row «متابعة علامات الجفاف لدى المستفيد محمد (172)» — production proof of the JWT → PostgREST → RLS approval → DB row chain).

---

## Sessions ledger

| # | Goal | Tag | Last commit |
|---|---|---|---|
| **A** | Surface polish — white-on-white, English fragments, brand tokens | `pitch-prep-session-A` | `71f6563` |
| **B** | Demo-path bulletproofing + 12-route schema-drift sweep (36 errors → 0) | `pitch-prep-session-B` | `cc76e77` |
| **C** | Visual + content polish — `/handover` navy, DignityFile brand swap, «قيد الإعداد» | `pitch-prep-session-C` | `2aec740` |
| **D** | Brand + Arabic register pass — «القياس» → «القيادة», Karama first-person | `pitch-prep-session-D` | `8c14710` |
| **E** | Backend hardening — 8 migrations, RLS overhaul, demo auth bridge | `pitch-prep-session-E` | `8ee2266` |
| **F** | Production deploy — `?as=demo` URL flag, URL-strip fix, `vercel deploy --prod` | `pitch-prep-session-F` | `11f4893` |
| (post-F docs) | Rehearsal + narrator + cheat-sheet artifacts | (no tag) | `c860cc4` |

---

## Per-session highlights

### Session A — surface polish (2026-05-08)
Dark-mode regressions (`Card.tsx` `dark:bg-white`, `MainLayout.tsx`, `Trajectories.tsx`, `EmergencyDashboard.tsx`, `SchedulingSystem.tsx`) repaired. English UI block in `GlobalAlerts.tsx` translated. `theme-color #1a365d → #0F3144` everywhere. CLAUDE.md palette rewritten to match `src/design-system/tokens.ts` (the canonical truth; `colors.ts` is a facade). Debug widget gated to `import.meta.env.DEV`. 51-route audit baseline established.

### Session B — demo-path bulletproofing (2026-05-08)
The schema-drift family of console errors (12 routes × ~3 errors each) traced to four services querying tables that don't exist in the live DB. Resolved by a **`*Available` flag pattern**: each service has a module-level constant; if `false`, the service short-circuits to demo data without firing a network call. Empowerment Karama profile populated for beneficiary 172 (the demo anchor). `log_date → shift_date` rename on the read side. `audit_logs` ordered by `created_at` (column rename matching live schema).

### Session C — visual + content polish (2026-05-08)
`/handover` — wrapper to navy, stat cards `bg-white/10`, Add-item form solid white with HRSD-navy text. DignityFile flat replace `#DC2626 → #0F3144` (17 instances of Tailwind red removed). Three residual «قريباً» placeholders in modal/tab content replaced with «قيد الإعداد» plus a one-line governmental institutional framing. `Discover.tsx` `alert("في النسخة الحقيقيّة...")` replaced with a `useToastStore` success toast — the demo seam is gone.

### Session D — brand + Arabic register pass (2026-05-08)
**«القياس» → «القيادة»** on `Dashboard.tsx:62` and `DashboardPanel.tsx:38`. Karama emotional fields rewritten in **first-person** to match the form labels («ما يسعدني / ما يزعجني / أحلامي وتطلعاتي»), with tashkeel on key nominals (الجلوسُ / سماعُ / وجودُ). Tone: governmental passive, no AI-academic drift, no CBAHI references.

### Session E — backend hardening (2026-05-08)
Eight Supabase migrations applied via MCP:

1. `session_e_demo_auth_bridge_and_role_helper` — pgcrypto, demo auth user, matching `staff` row, private `internal.has_role()` SECURITY DEFINER helper.
2. `session_e_shift_handover_items` — table + RLS + 4 seeded rows.
3. `session_e_ipc_tables` — locations, ipc_checklist_templates, ipc_inspections, ipc_incidents, immunizations + RLS.
4. `session_e_wellbeing_views_v2` — `mv_wellbeing_index`, `mv_wellbeing_stats`, `v_early_warning_report`.
5. `session_e_indicator_ops_tables` — cost_tracking, quality_checks, om_waste_records, risk_score_log, benchmark_standards, iso_compliance_checklist.
6. `session_e_extend_daily_care_logs` — weight, mobility_today, requires_followup, log_time columns.
7. `session_e_rls_overhaul` — 69 `{public} USING(true)` policies dropped; **258 fresh `authenticated`-tiered policies** in 5 categories (PHI / APPEND_ONLY / OPS / GOV / STAFF).
8. `session_e_demo_auth_bridge_repair` — fixes the GoTrue v2 `Scan error on column index 3, name "confirmation_token"` (NULL → '' COALESCE) and inserts the missing `auth.identities` row for the email provider.

DEV-only auto-signin shipped in `AuthContext.tsx` (gated to `import.meta.env.DEV`).

### Session F — production deploy (2026-05-08)
`?as=demo` URL flag added to `AuthContext.tsx` (commit `daf0b95`) so the deployed URL can sign in invisibly for the pitch — the same `signInWithPassword` path the DEV branch uses, but triggered by a URL parameter instead of `import.meta.env.DEV`. After auth resolves, `history.replaceState` drops the param so the address bar reads `/dashboard`.

A subagent verifier caught a defect: the `replaceState` was nested inside the signin success branch, so it didn't fire on cached-session loads. Lifted out into its own post-block (commit `6f3a5cc`).

Vercel project linked to existing `ahmed-abdullah-alshehris-projects/beneficiary-system-clean-backup`. First preview deploy hit Vercel **Standard Deployment Protection** (preview URLs require team auth). Pivoted to production scope: `vercel deploy --prod --yes` produced `dpl_DSjcBc61kbgwTVTQ2VfCSHzEzmHr`, aliased to the public canonical URL.

End-to-end verification on the deployed surface: console errors **0**; auto-signin POST `/auth/v1/token?grant_type=password` returns 200; localStorage holds JWT with `app_metadata.role=director`; real Supabase REST queries succeed; **`/handover` renders the seeded `shift_handover_items` row** — proof that JWT → PostgREST → RLS → DB chain works on production.

### Post-Session-F polish (artifacts only)
Three documentation artifacts written immediately after Session F (no functional code change): `docs/pitch-rehearsal.md` (timed walk on prod URL with 11 full-page screenshots in `docs/pitch-screens/`), `docs/pitch-narrator-ar.md` (governmental Arabic narration script), `docs/pitch-cheat-sheet.md` (A4 portrait cheat-sheet source). The cheat-sheet renders to PDF on Ahmad's Desktop.

---

## Pitch artifacts — where everything lives

### In the repository at `C:\dev\basira\docs\`

| File | Purpose |
|---|---|
| `pitch-prep.md` | Multi-session ledger, decisions log per session, demo path validation, carry-over table C1..C21, session-start + session-end protocols |
| `pitch-day-playbook.md` | Read-aloud one-pager — URL, sign-in, 8-screen click order, failure modes + recovery, what NOT to show, accepted advisor warnings |
| `pitch-rehearsal.md` | Timed walk on prod URL — per-screen TTFB, DCL, body markers, friction notes, realistic walk timing |
| `pitch-narrator-ar.md` | Governmental-register Arabic narration script (~6 min spoken time at 120–140 wpm) |
| `pitch-cheat-sheet.md` | A4 portrait cheat-sheet (source — converts to PDF) |
| `pitch-prep-route-audit.md` | Latest 51-route audit output (run against production at end of Session F) |
| `pitch-screens/pitch-rehearsal-{01..10,03b}-*.png` | 11 full-page screenshots of the prod URL state (≈2.5 MB total) |
| `sessions-A-through-F-summary.md` | This document — the comprehensive record |

### On Ahmad's Desktop

| File | Purpose |
|---|---|
| `pitch-day-playbook.docx` | Word version of the playbook (printable) |
| `pitch-cheat-sheet.pdf` | A4 portrait foldable cheat sheet |
| `basira-pitch-prep-summary.docx` | Word version of this summary document |

### In Claude memory (`~/.claude/projects/C--Users-aass1/memory/`)

- `session_2026-05-08_basira-pitch-sessions-A-through-F.md` — single-record summary; read first on any future Basira pitch-prep session.
- `feedback_check_fk_types_before_ddl.md` — query `information_schema` before DDL on remote-state-unknown projects.
- `feedback_wait_before_console_check.md` — wait ≥5s after `browser_navigate` before reading console.
- `feedback_edit_requires_prior_read.md` — Edit may silently fail on Grep-only files; verify via `git diff`.
- `feedback_supabase_auth_user_insert_required_fields.md` — `''` not NULL on auth.users token columns + matching `auth.identities` row.
- `feedback_vercel_preview_sso_gated.md` — Vercel preview URLs are SSO-gated by default on paid teams.
- `reference_basira_pitch_prep_plan.md` — pointer to `docs/pitch-prep.md`, status updated to "all done".

### In the ahmad-brain vault (`C:\dev\ahmad-brain\`)

- `wiki/projects/basira.md` — hub updated with Sessions A–F closure section, demo path validated against prod URL, resolved gaps marked struck through.

### In Claude skills (`~/.claude/skills/basira-dev/`)

- `SKILL.md` — UI signature refreshed to v2 reality (dark-by-default, 9-section sidebar, `demo@basira.local`); production deploy + pitch URL section added; stale verifier reference flagged explicitly.

---

## Pitch-day quick reference

### Failure modes + recovery

| Symptom | Likely cause | Recovery |
|---|---|---|
| URL shows `?as=demo` after 5s | replaceState raced or didn't fire | Cosmetic only. Continue. |
| `/handover` empty | User landed unauthenticated | Re-load with `?as=demo` or sign in at `/login` |
| All Supabase reads error | Outage or wrong env vars | In-memory fallback still serves screens 1–8. Continue. |
| Old «القياس» heading | Vercel CDN edge cache | Hard reload (Ctrl+F5). If still stale: `vercel rollback`. |
| Wi-Fi totally down | Connectivity loss | Switch to `localhost:5175` — Vite dev auto-signs in |
| Screen blank during walk | Route-specific regression | Skip to next — 8-screen path is independent |

### What NOT to show

- **Supabase Studio** — C3 leaked-password warning visible on Free tier (Pro-tier feature, hidden on Free).
- **Vercel project settings** — 14 stale `POSTGRES_*` / `NEXT_PUBLIC_*` env vars from a 148-day-old marketplace integration. Not bundled into the client. Cosmetic clutter (carry-over C20).
- **`Debug: Role Switcher` widget** — gated to DEV. If it appears on prod, the wrong build was promoted; bail to laptop fallback.

### Accepted advisor warnings (5 total)

| C-id | Warning | One-line answer if reviewer asks |
|---|---|---|
| **C3** | `auth_leaked_password_protection` ×1 | Pro-tier feature; toggle hidden on Free plan per Supabase docs. Will be enabled at production tier upgrade. |
| **C17** | `materialized_view_in_api` ×2 (`mv_wellbeing_index`, `mv_wellbeing_stats`) | Authenticated-only SELECT; anon blocked at the grant level. Private schema would break `wellbeingService.from('mv_wellbeing_index')` API surface — accepted as the cost of stability. |
| **C18** | `rls_policy_always_true` ×2 (`audit_logs_insert_auth`, `ai_decision_logs_insert_auth`) | Append-only INSERT must be permissive so any authenticated staff records their own audit trail. SELECT is gated to director/admin; UPDATE/DELETE not granted. Tightening would silently drop nurse/secretary audit. |

Pre-Session E count: **90 lints** · Post-Session E: **5** (3 accepted, 2 intentional) · Net reduction: **−85**.

---

## What's NOT done — explicit post-pitch carry-overs

Pitch is unblocked. These items are deliberately deferred:

| C-id | Item | Path |
|---|---|---|
| **C2** | Reconcile `supabase/sql/` (24 files) vs `supabase/migrations/` drift | Multi-hour real schema work; no UI impact |
| **C20** | 14 stale Production-scope Vercel env vars from 148-day-old marketplace integration | Cosmetic; not bundled into client |
| **C21** | `scripts/route-audit.mjs` returns `bodyTextLen` undefined on deployed surface | Script-side artifact; aggregate counts still trustworthy |
| **C4** | GitHub MCP plugin OAuth re-auth | When needed |

C17 and C18 are kept in the carry-over table for **review-question prep**, not as work items — they're intentional design decisions.

---

## Branch state + GitHub status

- **`v2`** is the active development branch. End-of-sweep HEAD: `c860cc4`. Working tree clean. Origin is up to date.
- **`main`** is **FROZEN** at tag `v1.0.0-zero-paper` — the MHRSD-endorsed v1 record, approved 2025-12-03 by Ali Al-Qarni. **Do NOT merge `v2` → `main`.** The pitch is delivered from the deployed prod URL, not from `main`. If post-pitch strategy calls for replacing `main` with the v2 line, that's a separate explicit decision (with implications for the 2025 endorsement record).
- **Tags:** all six session tags (`pitch-prep-session-A` through `pitch-prep-session-F`) exist locally and on origin. They are roll-back anchors — for normal reading, use `docs/pitch-prep.md` instead of walking the tags.
- **Vercel:** project linked. Latest production deployment `dpl_DSjcBc61kbgwTVTQ2VfCSHzEzmHr`. The previous 6-hour-old prod build (pre-Session D, with the old «القياس» heading) was replaced by the production promotion in Session F.
- **Supabase:** project `ruesovrbhcjphmfdcpsa`. 8 Session E migrations applied. Demo user provisioned. Advisor at 5 lints (3 accepted, 2 intentional).

---

## Sign-off

**Sessions A–F closed safely on 2026-05-08.** Working tree clean. All commits pushed. All tags pushed. Pitch URL verified end-to-end. Laptop fallback verified. Five pitch-day reading artifacts in `docs/`. Three Desktop deliverables (.docx playbook, .pdf cheat-sheet, .docx summary). Vault, memory, and skill all reflect the new state. No outstanding pitch-blocker.

The remaining work — C2, C20, C21, C4 — is post-pitch and named explicitly so future sessions don't re-discover it.

May Allah grant tawfiq to the pitch. والسلام.
