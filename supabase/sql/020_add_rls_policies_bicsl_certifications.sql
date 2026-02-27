-- Migration 020: Add RLS policies for bicsl_certifications
-- Had RLS enabled but no policies (rls_enabled_no_policy advisor warning)
-- Pattern: authenticated access for general operational tables
-- Date: 2026-02-27

CREATE POLICY "auth_select_bicsl_certifications"
  ON public.bicsl_certifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_insert_bicsl_certifications"
  ON public.bicsl_certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_bicsl_certifications"
  ON public.bicsl_certifications FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);
