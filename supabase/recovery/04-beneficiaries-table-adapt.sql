-- ═══════════════════════════════════════════════════════════════════════════
-- Adapt v3 beneficiaries table for the legacy insert format
-- ═══════════════════════════════════════════════════════════════════════════
-- The basira_v3_tables_core_1 migration created `beneficiaries` with Prisma-
-- style columns and enum types (`"Gender"`, `"Section"`, `"BeneficiaryStatus"`).
-- The seed file `05-beneficiaries-seed.sql` (generated 2025-12-23, pre-v3)
-- uses legacy column names and plain-text values. This script reshapes the
-- v3 table so the legacy seed loads without transformation.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Relax NOT NULL on columns the legacy seed doesn't populate
ALTER TABLE beneficiaries ALTER COLUMN date_of_birth  DROP NOT NULL;
ALTER TABLE beneficiaries ALTER COLUMN nationality    DROP NOT NULL;
ALTER TABLE beneficiaries ALTER COLUMN admission_date DROP NOT NULL;
ALTER TABLE beneficiaries ALTER COLUMN national_id    DROP NOT NULL;

-- 2. Convert enum columns to TEXT so legacy values ('MALE', 'ACTIVE', 'A') work
ALTER TABLE beneficiaries ALTER COLUMN status DROP DEFAULT;
ALTER TABLE beneficiaries ALTER COLUMN gender  TYPE TEXT USING gender::text;
ALTER TABLE beneficiaries ALTER COLUMN section TYPE TEXT USING section::text;
ALTER TABLE beneficiaries ALTER COLUMN status  TYPE TEXT USING status::text;
ALTER TABLE beneficiaries ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE beneficiaries ALTER COLUMN gender  DROP NOT NULL;
ALTER TABLE beneficiaries ALTER COLUMN section DROP NOT NULL;

-- 3. Add legacy columns the seed file references
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS birth_date                     TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS building                       TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS emergency_contact_name         TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS emergency_contact_phone        TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- 4. Drop unique indexes that conflict with seed data
--    file_number — seed uses empty default, all 139 rows collide on ''
--    national_id — ~80% of seed rows have NULL for national_id
DROP INDEX IF EXISTS public.beneficiaries_file_number_key;
DROP INDEX IF EXISTS public.beneficiaries_national_id_key;
