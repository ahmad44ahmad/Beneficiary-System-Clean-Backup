-- =====================================================
-- Feature 1: Dignity Profile (Ehsan Algorithm)
-- Adding JSONB column to store granular preferences
-- 2026-02-02
-- =====================================================
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS dignity_profile JSONB DEFAULT '{}'::jsonb;
-- Comment on column for documentation
COMMENT ON COLUMN beneficiaries.dignity_profile IS 'Stores Ehsan Algorithm data: Preferred Name, Senses, Micro-preferences';
-- Verify
SELECT column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'beneficiaries'
    AND column_name = 'dignity_profile';