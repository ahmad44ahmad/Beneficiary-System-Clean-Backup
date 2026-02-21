# CLAUDE.md

## Project Overview

**Basira** (بصيرة) is an Arabic RTL healthcare quality management system for Al-Baha Comprehensive Rehabilitation Center. It manages beneficiaries (residents), medical care, quality assurance, GRC (Governance, Risk, Compliance), catering, operations, and more. Compliant with Ministry of Human Resources and Social Development (HRSD) branding.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 6 (dev server on port 5173)
- **Styling**: Tailwind CSS 4 with PostCSS, custom HRSD brand colors in `tailwind.config.js`
- **State/Data**: TanStack Query (React Query) for server state, React Context for app state
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **AI**: Google Generative AI (Gemini) via `@google/generative-ai`
- **Deployment**: GitHub Pages (`gh-pages`)

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build (vite build)
npm run preview   # Preview production build
npm run deploy    # Build + deploy to GitHub Pages
```

There are no test or lint commands configured.

## Project Structure

```
src/
├── api/                  # API layer (beneficiaries, rehabilitation)
├── components/           # UI components organized by domain
│   ├── admin/            # Audit logs, secretariat
│   ├── alerts/           # Fall risk, medication, incident alerts
│   ├── beneficiary/      # Beneficiary CRUD, profiles, forms
│   ├── care/             # Daily care forms
│   ├── clothing/         # Clothing management
│   ├── common/           # Shared components (ErrorBoundary, LoadingSpinner, PageHeader, etc.)
│   ├── crisis/           # Crisis mode
│   ├── dashboard/        # Executive, strategic, quality dashboards
│   ├── emergency/        # Emergency dashboard
│   ├── empowerment/      # Empowerment plan builder
│   ├── indicators/       # Smart KPI indicators (ISO, behavioral, cost, etc.)
│   ├── layout/           # MainLayout, Sidebar, Header, MobileNav
│   ├── medical/          # Medical dashboard, profiles, assessments
│   ├── medication/       # Medication administration
│   ├── pulse/            # Morning pulse, wellbeing heatmap
│   ├── quality/          # Quality manual (ISO 9001), OVR reports
│   ├── rehab/            # Rehabilitation plan builder
│   ├── reports/          # Report generation, strategic dashboard
│   ├── safety/           # Fall risk assessment
│   ├── shift/            # Shift handover
│   ├── social/           # Social overview, activities, leave requests
│   ├── staff/            # Staff profiles
│   ├── ui/               # Primitive UI components
│   └── App.tsx           # Root component with all routes
├── config/               # Supabase config, theme
├── context/              # React contexts (App, Auth, Toast, UnifiedData, etc.)
├── data/                 # Static/seed data
├── hooks/                # Custom hooks (useExport, usePrint, useBeneficiaries, etc.)
├── modules/              # Feature modules
│   ├── catering/         # Food service management
│   ├── empowerment/      # Goal setting, dignity files
│   ├── family/           # Family portal
│   ├── grc/              # GRC dashboard, risk register, compliance
│   ├── ipc/              # Infection prevention & control
│   ├── operations/       # Asset registry, maintenance, waste
│   ├── reports/          # Integrated dashboard
│   └── wisdom/           # Wisdom module
├── pages/                # Route-level page components
├── services/             # Business logic services (AI, audit, risk, shift, etc.)
├── styles/               # Global styles
├── types/                # TypeScript type definitions
└── utils/                # Helpers (Arabic translations, validation, export, etc.)
```

## Key Architecture Decisions

- **Lazy loading**: Most pages use `React.lazy()` + `Suspense` for code splitting (see `App.tsx`)
- **Role-based access**: `ProtectedRoute` component guards routes by user role (`director`, `admin`, `social_worker`, `doctor`, `specialist`, `secretary`)
- **Unified data context**: `UnifiedDataContext` provides centralized access to beneficiaries, visit logs, medical data, social data, etc.
- **Path alias**: `@/*` maps to project root (configured in `tsconfig.json` and `vite.config.ts`)
- **RTL-first**: UI is designed right-to-left for Arabic; fonts use Tajawal/Cairo

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_APP_MODE=development    # development | production | demo
VITE_DEMO_MESSAGE="نسخة تجريبية"
VITE_KNOWLEDGE_BASE_URL=
```

Gemini API key is loaded via `GEMINI_API_KEY` env var (exposed as `process.env.API_KEY` in Vite config).

## Database

- Backend is **Supabase** (PostgreSQL)
- SQL schema files in `supabase/sql/` (`001_core_schema.sql` through `011_shift_handover.sql` and more)
- Migrations in `supabase/migrations/`
- Seed scripts in `scripts/` (`.mjs` and `.sql` files)
- Supabase edge functions in `supabase/functions/`

## Conventions

- **Language**: All UI text is in Arabic. Code (variables, comments) is in English
- **Components**: Functional components with named exports
- **Styling**: Tailwind utility classes; custom HRSD brand tokens (`hrsd-navy`, `hrsd-teal`, `hrsd-gold`)
- **TypeScript**: Strict-ish config (ES2022 target, bundler module resolution, no emit)
- **No ESLint/Prettier** configured — no automated linting or formatting rules
- **Excluded from compilation**: `src/server/`, `src/_archive/` (see `tsconfig.json`)

## Git Workflow Rules

- Always work directly on the `main` branch unless explicitly asked to create a new branch
- After each group of changes: `git add -A && git commit -m "..." && git push origin main`
- Vercel auto-deploys from main — push = live update
- Never create feature branches without explicit permission
