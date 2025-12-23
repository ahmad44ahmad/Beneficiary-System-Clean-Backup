-- Fix SECURITY DEFINER Views
-- Supabase recommends enabling security_invoker for views accessing RLS tables
ALTER VIEW public.evacuation_list SET (security_invoker = true);
ALTER VIEW public.critical_low_stock SET (security_invoker = true);
ALTER VIEW public.daily_compliance_summary SET (security_invoker = true);

-- Fix Function Search Path Mutable Warnings
-- Setting search_path prevents malicious code from hijacking function execution
ALTER FUNCTION public.upsert_beneficiary_safe SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at SET search_path = public, pg_temp;
ALTER FUNCTION public.normalize_empty_strings SET search_path = public, pg_temp;
ALTER FUNCTION public.set_tenant_id_from_jwt SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at SET search_path = public, pg_temp;
ALTER FUNCTION public.calculate_evacuation_priority SET search_path = public, pg_temp;
ALTER FUNCTION public.check_vital_signs_critical SET search_path = public, pg_temp;
ALTER FUNCTION public.check_medication_stock SET search_path = public, pg_temp;

-- Add Missing RLS Policies
-- Enabling RLS without policies blocks all access. Adding standard policies for access.

-- beneficiaries_staging
ALTER TABLE public.beneficiaries_staging ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.beneficiaries_staging
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- evacuation_logs
ALTER TABLE public.evacuation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.evacuation_logs
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.medications
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- process_executions
ALTER TABLE public.process_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.process_executions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- processes
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.processes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- stock_alerts
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for authenticated users" ON public.stock_alerts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
