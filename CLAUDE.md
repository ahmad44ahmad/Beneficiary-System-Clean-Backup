# CLAUDE.md — Basira (نظام بصيرة) Beneficiary Management System

## Project Overview

Arabic RTL healthcare quality management system for HRSD Al-Baha Rehabilitation Center.
300 TypeScript/TSX files (~60k lines), 150+ routes, Supabase backend with local data fallback.

**Project root:** `C:\Users\aass1\.local\bin\Beneficiary-System-Clean-Backup`

---

## ABSOLUTE RULES (2025/2026) — NO EXCEPTIONS

### 1. Tech Stack — Locked Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 19 |
| Build Tool | Vite | 6 |
| Styling | Tailwind CSS | v4 |
| Client State | Zustand | v5 |
| Server State | TanStack Query | v5 |
| Forms | react-hook-form | v7+ |
| Validation | Zod | v4+ |
| Routing | React Router | v7 |
| Backend | Supabase | v2 |

- **DO NOT** introduce any state management library other than Zustand v5 (client) and TanStack Query v5 (server).
- **DO NOT** downgrade or swap any of these dependencies.
- Migrate existing React Context state to Zustand stores incrementally when touching those files.

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

#### Views Strategy (pg_ivm NOT available on Supabase)
- `pg_ivm` is **NOT available** in Supabase's extension catalog.
- Instead, use **regular views** with `security_invoker = true` (already implemented for wellbeing views).
- Regular views auto-refresh on every query — no manual refresh needed.
- For heavy aggregations, consider Supabase Edge Functions with caching.
- **DO NOT** use `pg_cron` for view refreshes.

#### BANNED Database Patterns
- **DO NOT** use `pgsodium` Transparent Column Encryption (TCE). Use Supabase Vault or application-level encryption instead.
- **DO NOT** use `pg_cron` for materialized view refreshes.
- **DO NOT** use `pg_ivm` — it is not available on Supabase. Use regular views instead.

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

> **Note:** If `npm run lint` is not configured, set up ESLint first before running.

---

## Project Architecture

### Directory Structure

```
src/
├── api/              # Supabase API client functions
├── components/       # 36+ component directories (lazy-loaded)
│   ├── admin/        # Admin panels (secretariat, audit)
│   ├── beneficiary/  # Beneficiary management
│   ├── care/         # Daily care management
│   ├── common/       # Reusable UI components
│   ├── dashboard/    # Dashboard variants
│   ├── indicators/   # Smart AI indicators
│   ├── medical/      # Medical module (dental, PT, psych, speech)
│   ├── quality/      # Quality management
│   ├── ui/           # UI component library
│   └── App.tsx       # Main router (150+ routes)
├── config/
│   ├── supabase.ts   # Supabase client init
│   └── theme/        # Dark/light theme system
├── context/          # React Context providers (8 providers)
├── data/             # Local mock/seed data
├── hooks/            # Custom hooks (TanStack Query + utilities)
├── modules/          # Feature modules (catering, GRC, IPC, etc.)
├── pages/            # Page-level components
├── services/         # Business logic (15 services)
├── styles/           # CSS (hrsd-theme, hrsd-utilities, print)
├── types/            # TypeScript types (17 files)
└── utils/            # Utilities (validation, export, Arabic)
```

### Entry Point

`index.tsx` — Provider stack order:
1. ErrorBoundary
2. ThemeProvider (dark/light, localStorage)
3. QueryProvider (TanStack Query, 5min staleTime)
4. BrowserRouter (React Router v7)
5. AppProvider (global state)
6. UnifiedDataProvider (beneficiary aggregation)
7. AuthProvider (Supabase auth + demo mode)
8. UserProvider
9. ToastProvider

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
npm run dev        # Vite dev server on port 5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run deploy     # Deploy to GitHub Pages
```

### SQL Migrations

Migration files are at project root: `001_core_schema.sql` through `011_shift_handover.sql`.
Apply via Supabase MCP `apply_migration` tool or Supabase dashboard.

---

## Conventions

- **Language:** TypeScript strict — no `any` types, no `@ts-ignore`.
- **Naming:** camelCase for variables/functions, PascalCase for components/types, snake_case for DB columns.
- **Imports:** Use `@/` path alias (maps to project root).
- **Components:** Functional components only. No class components.
- **Styling:** Tailwind utility classes. No inline styles. No CSS modules.
- **Arabic text:** Always use translation utilities from `src/utils/arabic-translations.ts`.
- **Supabase queries:** Always go through `src/services/supaService.ts` or dedicated hooks in `src/hooks/`.
