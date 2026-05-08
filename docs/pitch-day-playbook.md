# Pitch-day playbook — Basira (نظام بصيرة)

**Owner:** Ahmad Al-Shahri · **Last updated:** Session F, 2026-05-08

One-pager you read off at pitch time. Everything pre-pitch lives in `docs/pitch-prep.md` and the Session A–F ledger.

---

## Demo URL

| | URL | Notes |
|---|---|---|
| **Primary** | `https://beneficiary-system-clean-backup.vercel.app/dashboard?as=demo` | Production deploy, Session F build. `?as=demo` triggers invisible signin → URL bar settles at `/dashboard`. |
| **Laptop fallback** | `http://localhost:5175/dashboard` | Vite dev server at `C:\dev\basira`. Auto-signs in via `import.meta.env.DEV`. Use only if Wi-Fi fails. |

**Latest prod deployment:** `dpl_DSjcBc61kbgwTVTQ2VfCSHzEzmHr` (target: production). To roll back if something regresses on the day: `vercel rollback`.

---

## Sign-in step

**Auto-signin on the primary URL.** No manual step.
- Auth fires from `AuthContext.tsx` when the URL carries `?as=demo`.
- After signin the param is dropped from the address bar (`history.replaceState`).
- After ~2 seconds the dashboard renders authenticated as `demo@basira.local`, `app_metadata.role=director`.

If you ever need to sign in manually (e.g., the auto-signin path is broken):
- Open `/login`
- email: `demo@basira.local`
- password: `demo-pitch-2026`

---

## 8-screen click order

| # | Route | Pitch concept |
|---|---|---|
| 1 | `/` | Welcome — pillars + 4 stat cards |
| 2 | `/dashboard` | «مركز التأهيل الشامل بالباحة» + «لوحة القيادة التنفيذية (Executive Dashboard)» bilingual |
| 3 | `/empowerment` → click **أبو سعد** | محرك التمكين, 3 categories, cup-of-water SMART goal renders inline |
| 4 | `/family-portal` | بوابة الأسرة, journal, 4-factor 0-100 score, 50% intervention threshold |
| 5 | `/alerts` (or `/smart-alerts`) | IoT vitals → SmartAlertsPanel, 6 alert types |
| 6 | `/legal-shield` | الدرع القانوني + 4 compliance pillars (CRPD / PDPL / NCA ECC-2:2024 / معايير الوكالة) + cert issuance + audit trail |
| 7 | `/quality/manual` | دليل الجودة الشامل, all 7 ISO 9001 chapters, 132-operations claim |
| 8 | `/sroi` | 1.80:1 SROI (NEF/SSE methodology, deadweight 25% / attribution 30% / displacement 5%) |
| **+** | `/beneficiaries-list` | Excel + طباعة export demo (both verified working). Optional bonus screen. |
| **+** | `/handover` | Optional Session E RLS proof — the seeded card titled «متابعة علامات الجفاف لدى المستفيد محمد (172)» is real Supabase data, JWT-bound, visible only because the deployed user is authenticated. Demonstrates production auth + RLS chain. |

Demo data anchor: beneficiary id **`172`** (محمد / أبو سعد) — cup-of-water SMART goal. Don't break the seeded ID.

---

## Failure modes + recovery

| Symptom | Likely cause | Recovery |
|---|---|---|
| URL bar still shows `?as=demo` after 5s | replaceState raced or didn't fire | Cosmetic only. Auth and content still work. Continue. |
| `/handover` is empty | User landed unauthenticated | Append `?as=demo` to URL and reload. Or sign in manually at `/login`. |
| All Supabase reads error in console | Supabase outage or wrong env vars on Vercel | Demo screens still render via in-memory fallback (Sessions B/C `*Available` flag pattern — see `pitch-prep.md` §"Schema-drift sweep"). Continue to next screen — most demo content is local. |
| Auth fails (toast or blank dashboard) | Auto-signin returned 5xx | Open `/login`, type creds (above), back to `/dashboard`. |
| Wrong build — old القياس heading | Vercel CDN edge cache | Hard reload (Ctrl+F5). If still stale: `vercel rollback` or contact me. |
| Page completely blank — wrong codebase loaded | Started Vite from a non-canonical path on the laptop | STOP. `cd /c/dev/basira && ./node_modules/.bin/vite --port 5175 --strictPort --host`. Verify theme-color `#0F3144` + RTL Arabic title. |
| One screen blank during walk | Route-specific regression | Skip to the next screen on the list. The 8-screen path is independent — no required order beyond narrative. |

---

## What NOT to show

- **Supabase Studio.** Carry-over C3 — the auth advisor flags `auth_leaked_password_protection` because we're on the **Free plan** and the toggle is hidden entirely (Pro-tier feature). Don't open Studio in front of a reviewer; keep the demo on the app surface. Studio inspection is optional, not part of the pitch.
- **Vercel project settings.** Stale Production-scope env vars from a 148-day-old marketplace integration are visible there (`POSTGRES_*`, `NEXT_PUBLIC_SUPABASE_*`). Not bundled into the client, but cosmetic clutter — left for post-pitch cleanup (carry-over).
- **The DEV-only `Debug: Role Switcher` widget.** Gated to `import.meta.env.DEV`; absent on the production deploy. If it appears, the deploy is wrong (means a dev build was promoted) — bail to laptop fallback.

---

## Accepted advisor warnings (5 total)

If a reviewer opens the Supabase advisor and asks about the warnings:

| C-id | Warning | One-line answer |
|---|---|---|
| **C3** | `auth_leaked_password_protection` × 1 | Pro-tier feature; the toggle is hidden on Free plan per Supabase docs. Will be enabled at production deployment when the org upgrades tier. |
| **C17** | `materialized_view_in_api` × 2 (`mv_wellbeing_index`, `mv_wellbeing_stats`) | Authenticated-only SELECT; anon blocked at the grant level. Moving to a private schema would break the `wellbeingService.from('mv_wellbeing_index')` API surface — accepted as the cost of stability. |
| **C18** | `rls_policy_always_true` × 2 (`audit_logs_insert_auth`, `ai_decision_logs_insert_auth`) | Append-only INSERT — must be permissive for any authenticated staff to record their own audit trail. SELECT is gated to director/admin; UPDATE/DELETE not granted. Tightening INSERT would silently drop nurse/secretary audit entries. |

Pre-Session E count: 90. Post-Session E: **5** (3 accepted, 2 intentional). Net reduction: **−85**.

---

## Sources

- Session ledger A–F: `docs/pitch-prep.md` §"Session ledger".
- Decisions log: `docs/pitch-prep.md` §"Decisions log".
- Demo path: `docs/pitch-prep.md` §"Demo path".
- Carry-over table (C1..C19): `docs/pitch-prep.md` §"Carry-overs".
- Session E migrations + RLS overhaul: `docs/pitch-prep.md` §"Session E — completed work archive".
- 51-route audit (most recent): `docs/pitch-prep-route-audit.md`.
