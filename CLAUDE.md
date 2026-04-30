# CLAUDE.md — Basira (نظام بصيرة) Beneficiary Management System

## Project Overview

Arabic RTL **social-model rehabilitation operations system** for HRSD Al-Baha Comprehensive Rehabilitation Center. Not an EHR — MHRSD ≠ MoH. Framed as a **beneficiary-centric dignity instrument**, not a patient-record tool.

314 source files (.ts + .tsx), ~66k LoC, 110+ routes, Supabase backend with local data fallback. Target in the v2 rebuild: <40k LoC.

**Project root:** `C:\dev\basira\` (canonical, flattened 2026-04-16)

## Branches

**Active development branch: `v2`** — always checkout v2 for new work.

- `main` — Basira v1 / مبادرة صفر ورق — MHRSD-endorsed 2025 achievement (approved 2025-12-03 by Ali Al-Qarni). Tagged `v1.0.0-zero-paper`. Frozen as the record-of-endorsement; hotfixes only.
- `v2` — social-model / Trust-Ground / Dignity Index work. All new features land here. See `PLAN-comprehensive-2026.md` for the 12-month plan.

## Strategic frame (2026-04-21)

Per `launchpad-opus-4.7.md` §6–§7:

- Basira IS: a **Trust-Ground** + **Stewardship Instrument** + **Dignity Index in disguise**.
- Basira is NOT: an EHR, a bureaucratic dashboard, a gap-analysis tool.
- Every feature must answer: **which of the 10 social-handicap barrier types does this dissolve?** (see launchpad §6.2).
- Governmental Arabic for user-facing text (يتم، يُحدد، يلتزم). No AI-academic register.
- **No CBAHI references** — MHRSD rehab centers are social, not clinical.
- Beneficiary, not patient. Barrier, not diagnosis. Intervention, not treatment.

Bash form: `/c/dev/basira`. Old paths under `Beneficiary-System-Clean-Backup\Beneficiary-System-Clean-Backup\` or `.local\bin\` are deprecated — do not use.

## Dev server

```bash
cd /c/dev/basira && ./node_modules/.bin/vite --port 5175 --strictPort --host
```

Opens at `http://localhost:5175/dashboard`. Correct UI shows "مركز التأهيل الشامل بالباحة" in light theme. If dark theme with FHIR engine cards, STOP — wrong codebase.

### Key routes (v2)

- `/dashboard` — main dashboard (landing)
- `/leadership-compass` — بوصلة القيادة (strategic decision surface, 7 tabs, shipped 2026-04-22)

## Verification before "done"

For any UI change, use the `basira-ui-verifier` subagent (Playwright) to screenshot and confirm the signature before reporting success. Do not rely on "Vite printed ready."

---

## ABSOLUTE RULES (2025/2026) — NO EXCEPTIONS

### 1. Tech Stack — Locked Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19.1 |
| Build Tool | Vite | 6.2 |
| Styling | Tailwind CSS | v4.2 |
| Client State | Zustand | v5.0.11 |
| Server State | TanStack Query | v5.90 |
| Forms | react-hook-form | v7.71 |
| Validation | Zod | v4.3 |
| Routing | React Router | v7.13 |
| Backend | Supabase | v2.98 |

- **DO NOT** introduce any state management library other than Zustand v5 (client) and TanStack Query v5 (server).
- **DO NOT** downgrade or swap any of these dependencies.
- Context → Zustand migration is **complete** (7 stores in `src/stores/`). Use Zustand stores for all new client state.

### 2. Form Handling — Strict Pattern

All forms MUST use React 19 `useActionState` combined with `react-hook-form` and `Zod`:

```tsx
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({ /* ... */ });
type FormData = z.infer<typeof schema>;

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [state, formAction, isPending] = useActionState(
    async (_prev: State, formData: FormData) => {
      // server/supabase mutation
    },
    initialState
  );

  return (
    <form onSubmit={handleSubmit((data) => formAction(data))}>
      {/* ... */}
    </form>
  );
}
```

- **DO NOT** use plain `onSubmit` handlers without `useActionState`.
- **DO NOT** use `useFormState` (deprecated) — use `useActionState` only.
- Every form field must have a Zod schema. No unvalidated inputs.

### 3. Database Security & Performance (Supabase/Postgres)

#### pgaudit — READ Logging (PDPL Compliance) ✅ CONFIGURED
- `pgaudit` extension is enabled with **object-level logging** via the `pdpl_auditor` role.
- All SELECT queries on sensitive tables are automatically logged to Postgres logs.
- Audit role `pdpl_auditor` has SELECT grants on:
  `beneficiaries`, `medical_profiles`, `social_research`, `daily_care_logs`,
  `medications`, `medication_administrations`, `fall_risk_assessments`, `fall_incidents`, `audit_logs`.
- Both `postgres` and `authenticator` roles have `pgaudit.role = 'pdpl_auditor'`.
- View audit logs in Supabase Dashboard > Logs > Postgres Logs (filter: `AUDIT`).

#### Views Strategy — Materialized Views + pg_cron
- Use **Materialized Views** for heavy analytical queries (wellbeing index, dashboard stats).
- Use **`pg_cron`** to schedule periodic `REFRESH MATERIALIZED VIEW CONCURRENTLY` every 5 minutes.
- Lightweight views remain as **regular views** with `security_invoker = true`.
- All materialized views must have a **UNIQUE INDEX** to support `CONCURRENTLY` refresh.
- **DO NOT** use `pg_ivm` — it is not available on Supabase.

#### Table Partitioning Strategy
- Use **Declarative Range Partitioning** (by month) for high-volume tables: `incident_reports`.
- Partitions are auto-created for the current and next 6 months.
- Application queries must include partition key (`date`) in WHERE clauses for partition pruning.

#### BANNED Database Patterns
- **DO NOT** use `pgsodium` Transparent Column Encryption (TCE). Use Supabase Vault or application-level encryption instead.
- **DO NOT** use `pg_ivm` — it is not available on Supabase.

### 4. Agentic Loop — Mandatory Post-Modification Checks

After ANY code modification, ALWAYS run these commands and fix all errors autonomously:

```bash
cd /c/dev/basira
npm run lint 2>&1
npx tsc --noEmit 2>&1
```

- Read stderr output carefully.
- Fix every error and warning.
- Re-run until **0 errors** remain.
- Do NOT submit work with lint or type errors.


---

## Project Architecture

### Directory Structure

```
src/
├── api/              # Supabase API client functions
├── components/       # 34 component subdirectories (lazy-loaded)
│   ├── admin/        # Admin panels (secretariat, audit)
│   ├── alerts/       # Alert components
│   ├── assets/       # Asset management
│   ├── auth/         # Authentication
│   ├── beneficiary/  # Beneficiary management
│   ├── care/         # Daily care management
│   ├── clothing/     # Clothing management
│   ├── common/       # Reusable UI components
│   ├── crisis/       # Crisis management
│   ├── dashboard/    # Dashboard variants
│   ├── emergency/    # Emergency management
│   ├── empowerment/  # Empowerment features
│   ├── family/       # Family engagement
│   ├── indicators/   # Smart AI indicators
│   ├── knowledge/    # Knowledge base
│   ├── layout/       # Layout components
│   ├── medical/      # Medical module (dental, PT, psych, speech)
│   ├── medication/   # Medication management
│   ├── navigation/   # Navigation components
│   ├── organization/ # Organization management
│   ├── profile/      # Profile views
│   ├── pulse/        # Wellbeing heatmap
│   ├── quality/      # Quality management
│   ├── rehab/        # Rehabilitation
│   ├── reports/      # Reports
│   ├── safety/       # Safety features
│   ├── scheduling/   # Scheduling
│   ├── secretariat/  # Secretariat operations
│   ├── shift/        # Shift management
│   ├── social/       # Social services
│   ├── staff/        # Staff management
│   ├── support/      # Support services
│   ├── training/     # Training modules
│   ├── ui/           # UI component library
│   └── App.tsx       # Main router (150+ routes)
├── config/
│   ├── supabase.ts   # Supabase client init (persistSession, autoRefreshToken)
│   └── theme/        # Dark/light theme system
├── context/          # AuthContext.tsx (Supabase auth) + QueryProvider.tsx (TanStack Query)
├── stores/           # 7 Zustand stores (app, localData, notification, toast, UI, user, viewMode)
├── data/             # Local mock/seed data
├── hooks/            # 16 custom hooks (TanStack Query + utilities)
├── modules/          # 10 feature modules (catering, GRC, IPC, empowerment, family, operations, quality, reports, wisdom)
├── pages/            # Page-level components
├── services/         # 15 business logic services
├── styles/           # CSS (hrsd-theme, hrsd-utilities, print)
├── types/            # 17 TypeScript type files
└── utils/            # Utilities (validation, export, Arabic)
```

### Entry Point

`index.tsx` — Provider stack order:
1. React.StrictMode
2. ErrorBoundary
3. ThemeProvider (light mode default on v2)
4. QueryProvider (TanStack Query, 5min staleTime)
5. BrowserRouter (React Router v7)
6. AuthProvider (Supabase auth + demo mode)
7. App + ToastRenderer (sibling inside AuthProvider)

Client state (app, notifications, toast, UI, user, view mode) lives in Zustand stores (`src/stores/`), not providers.

### Key Patterns

- **TanStack Query keys:** `beneficiaryKeys.detail(id)` pattern — structured factory keys
- **Data loading:** Supabase-first with local data fallback
- **Code splitting:** `React.lazy()` + `Suspense` on all routes
- **Role-based access:** ProtectedRoute component (director, admin, doctor, social_worker, specialist, secretary, nurse, staff)
- **RTL:** Arabic-first with Tajawal/Cairo fonts
- **Theming:** HRSD branding (navy #1a365d, teal #0d9488, gold #eab308)
- **Audit trail:** `startAuditService()` runs on app initialization
- **Sidebar:** 320px wide, 9 sections including القيادة الاستراتيّة (v2)

### Environment Variables

```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_APP_MODE=demo          # optional: enables demo mode
GEMINI_API_KEY=<api-key>    # optional: AI features
```

### Build & Dev

```bash
npm run dev            # Vite dev server on port 5175 (strict)
npm run build          # Production build to dist/
npm run preview        # Preview production build
npm run lint           # ESLint (src/)
npm run setup:demo     # Seed demo data (scripts/setup-demo.js)
npm run test:e2e       # Playwright e2e tests
npm run test:e2e:ui    # Playwright UI mode
npm run test:e2e:headed # Playwright headed mode
```

### SQL Migrations

Migration files in `supabase/sql/`: `001_core_schema.sql` through `021_index_unindexed_foreign_keys.sql`.
Apply via Supabase MCP `apply_migration` tool or Supabase dashboard.
Note: `002` has two files (`002_catering_quality.sql`, `002_functions.sql`) — apply both.

---

## Conventions

- **Language:** TypeScript strict — no `any` types, no `@ts-ignore`.
- **Naming:** camelCase for variables/functions, PascalCase for components/types, snake_case for DB columns.
- **Imports:** Use `@/` path alias (maps to project root).
- **Components:** Functional components only. No class components.
- **Styling:** Tailwind utility classes. No inline styles. No CSS modules.
- **Arabic text:** Always use translation utilities from `src/utils/arabic-translations.ts`.
- **Supabase queries:** Always go through `src/services/supaService.ts` or dedicated hooks in `src/hooks/`.

---

## Security & Compliance Handover Packet (Phase 2 — 2026-04-22)

Phase 2 deliverables for the Agency handover. Every document links to the HRSD policy sections it discharges. Read `docs/handover-security-packet.md` first — it is the master index.

| Document | Path | Covered HRSD Policies |
|---|---|---|
| Master security policy | `SECURITY.md` | `DT-IS-POL-001 V4` (governance) · references every policy listed below |
| Handover packet (master index) | `docs/handover-security-packet.md` | `DT-IS-POL-001 V4` · `DT-IS-POL-400 V7` · `DT-IS-FRM-2320` · umbrella over all below |
| Risk register | `docs/risk-register.md` | `DT-IS-FRM-2320 §3` (risk management framework) |
| Incident response plan | `docs/incident-response.md` | `Emergency Management v1.0` · `DT-IS-POL-1300 V7 §3.6` · NCA ECC-2:2024 §4.2 |
| Backup & retention strategy | `docs/backup-strategy.md` | `DT-IS-POL-200 V10` · `DT-IS-POL-400 V7 §3.6` · `Data Retention and Disposal Policy v1.0` |
| Full-export script | `scripts/export-full.sh` | `DT-IS-POL-400 V7 §3.6` (cloud exit) · `DT-IS-POL-200 V10` (backup) |
| Data classification reference | `docs/data-classification.md` | `DT-IS-POL-1000 V10` · `Personal Data Protection Policy v1.0` |
| Data classification (technical) | `supabase/sql/023_data_classification.sql` | `DT-IS-POL-1000 V10` §3.1 (COMMENT ON at table + column) |
| Third-party access procedure | `docs/third-party-access.md` | `DT-IS-POL-1400 V10 §3.2.8-3.2.11` · `DT-IS-POL-400 V7 §3.3.6` |
| AI usage policy | `docs/ai-usage-policy.md` | `DT-IS-POL-2900` (acceptable AI) · `DT-IS-POL-3000` (AI governance) · `PDPL v1.0` · `CRPD` |
| Cloud-region decision paper | `docs/cloud-region-decision.md` | `DT-IS-POL-400 V7 §3.4.1` (data residency) · §3.3 (cloud services) · §3.6 (exit) |
| SoD gap acknowledgment | `docs/sod-gap-acknowledgment.md` | `DT-IS-POL-1400 V10 §3.3.2` (segregation of duties) · `DT-IS-POL-3100 V1 §3.5` (SDLC) |

### Reading order for the Agency

When the packet is handed to the Agency, recommend this sequence (keeps decisions before mechanics):

1. `docs/handover-security-packet.md` — what's done, what's pending.
2. `docs/cloud-region-decision.md` — first strategic decision.
3. `docs/sod-gap-acknowledgment.md` — the honest acknowledgment.
4. `docs/risk-register.md` — the full risk picture.
5. `docs/data-classification.md` → `docs/backup-strategy.md` → `docs/incident-response.md` — operational references.
6. `docs/third-party-access.md` → `docs/ai-usage-policy.md` — gated processes.
7. `SECURITY.md` — the formal umbrella.
8. `scripts/export-full.sh` — the exit-strategy executable.

### Handover packet house rules (when editing any file above)

- Governmental Arabic register (يتم، يُحدد، يلتزم). Not AI-academic. Not conversational.
- Beneficiary (مستفيد), not patient (مريض).
- No CBAHI references — MHRSD ≠ MoH.
- Institutional voice only — no personal name on institutional surfaces.
- No ranking between centers — best practice, not best center.
- Decisions (and failed decisions) are permanent; archive, don't delete.
- Helper-over-display: decision papers lead with the question + alternatives, not with data.
