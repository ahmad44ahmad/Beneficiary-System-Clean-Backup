# Basira Database Recovery — 2026-04-14

## What happened

On **2026-03-21**, a set of migrations named `basira_v3_*` were applied to the Supabase project `ruesovrbhcjphmfdcpsa`. The first of these, `basira_v3_drop_conflicts`, ran `DROP TABLE ... CASCADE` on **37 core tables** (beneficiaries, medical_profiles, daily_care_logs, audit_logs, incident_reports, and many others).

The subsequent `basira_v3_tables_*` migrations attempted to recreate the tables under a new schema (Prisma-style with quoted enums like `"Gender"`, `"Section"`, `"BeneficiaryStatus"`), but the new tables were never populated with the historical beneficiary data. The result: the deployed app at `https://ahmad44ahmad.github.io/Beneficiary-System-Clean-Backup/` queried a database with **zero rows** in every core table for **~24 days** without anyone noticing, because the production build was configured with `VITE_APP_MODE=demo` and served hardcoded demo data from the bundled `data-local-*.js` chunk.

The drift was discovered on **2026-04-14** after a routine UI commit (`422f676` — fix font sizing and sidebar contrast) triggered inspection of the live site. The UI commit itself touched only `index.css`, `src/components/layout/MainLayout.tsx`, and `src/components/layout/Sidebar.tsx` — **it did not cause the data loss**.

## What was recovered

| Item | Status |
|---|---|
| All 48 public tables rebuilt (schema replayed from `supabase_migrations.schema_migrations`) | ✅ |
| Missing tables the app expects but v3 migrations never recreated (`daily_meals`, `dietary_plans`, `medical_records`, `rehab_plans`, `social_research`, `om_*`) | ✅ |
| Beneficiaries table adapted to accept legacy insert format (columns: `birth_date`, `building`, `emergency_contact_*`) | ✅ |
| `NOT NULL` constraints relaxed on `national_id`, `date_of_birth`, `nationality`, `admission_date`, `gender`, `section` | ✅ |
| Enum columns (`gender`, `section`, `status`) converted to `TEXT` to accept legacy values (`MALE`, `ACTIVE`, etc.) | ✅ |
| Unique indexes on `file_number` and `national_id` dropped (legacy data has empty/null values) | ✅ |
| `139 beneficiary records` restored from `beneficiaries_insert.sql` (146 parsed, 7 duplicate IDs deduplicated) | ✅ |
| `GRANT ALL` to `anon`, `authenticated`, `service_role` on all public tables | ✅ |
| RLS **disabled** on all public tables (permissive mode for initial recovery) | ⚠️ |
| Auth user created: `ahmad@basira.local` | ✅ |
| GitHub secret `VITE_APP_MODE` **deleted** so production build doesn't run in demo mode | ✅ |
| CI re-run and GitHub Pages redeployed with correct env | ✅ |

## Rebuild checklist (if the schema is lost again)

1. Run `schema-rebuild.sql` in the Supabase SQL editor (uses `DO $$` to replay `schema_migrations` history).
2. Apply any missing-table stubs from `missing-tables.sql` (daily_meals, dietary_plans, medical_records, rehab_plans, social_research, om_*).
3. Apply grants + disable RLS via `grants-and-rls.sql`.
4. Load `beneficiaries-seed.sql` to restore the 139 beneficiaries.
5. Create an auth user via Supabase Dashboard → Authentication → Users → Add user.
6. Verify with `verify.sql`.

## Outstanding security debt

- **RLS is disabled on all public tables.** The anon key (embedded in the frontend bundle) can currently read and write every row. This must be fixed before the system holds real PII:
  - Enable RLS on all tables: `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;`
  - Write `SELECT`/`INSERT`/`UPDATE`/`DELETE` policies for the `authenticated` role keyed on `auth.uid()` and the employee's role.
  - Remove `GRANT ALL ... TO anon` — replace with `GRANT SELECT` only on tables the public landing page needs (or nothing at all if everything is behind auth).
- The legacy beneficiary schema stores dates as Hijri year strings (e.g. `'1419-09-24'`) in `DATE` columns. PostgreSQL parses these as Gregorian year 1419 — semantically wrong but syntactically valid. A future migration should split into `hijri_date_of_birth` and `gregorian_date_of_birth` columns.

## Backup

A full local backup of all Basira project folders was taken before any writes, at:

```
D:\basira-safety-backup-2026-04-14\
  ├── Beneficiary-System-Clean-Backup\     (41,763 files, 435 MB)
  ├── dotlocal-Beneficiary-System-Clean-Backup\  (20,825 files, 261 MB)
  ├── Basira\                              (221,015 files, 3.02 GB)
  ├── Basira-1\                            (500 files, 3.3 MB)
  └── Basira-v1.1\                         (16,954 files, 206 MB)
```

Verified with `robocopy /L` — 0 files missed, 0 failures.
