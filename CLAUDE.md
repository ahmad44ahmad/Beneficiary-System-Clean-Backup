# CLAUDE.md — Basira (نظام بصيرة) Beneficiary Management System

## Project Overview

Arabic RTL healthcare quality management system for HRSD Al-Baha Rehabilitation Center.
299 source files (219 TSX + 80 TS), 150+ routes, Supabase backend with local data fallback.

**Project root:** `C:\Users\aass1\.local\bin\Beneficiary-System-Clean-Backup`

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
cd "C:/Users/aass1/.local/bin/Beneficiary-System-Clean-Backup"
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
├── context/          # Legacy context providers (most state now in Zustand stores)
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
3. ThemeProvider (dark mode default)
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

### Environment Variables

```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_APP_MODE=demo          # optional: enables demo mode
GEMINI_API_KEY=<api-key>    # optional: AI features
```

### Build & Dev

```bash
npm run dev            # Vite dev server on port 5173
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
