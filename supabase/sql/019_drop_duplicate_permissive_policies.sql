-- Migration 019: Drop duplicate permissive RLS policies
-- Resolves 11 performance advisor warnings (multiple_permissive_policies)
-- Date: 2026-02-27

-- beneficiaries: keep admin_delete (is_admin()), drop auth_delete (true)
DROP POLICY IF EXISTS "auth_delete_beneficiaries" ON public.beneficiaries;

-- beneficiaries: keep auth_insert (true), drop employees_insert (is_employee())
DROP POLICY IF EXISTS "employees_insert_beneficiaries" ON public.beneficiaries;

-- beneficiaries: keep public_select (true), drop employees_read (is_employee())
DROP POLICY IF EXISTS "employees_read_beneficiaries" ON public.beneficiaries;

-- beneficiaries: keep auth_update (true), drop employees_update (is_employee())
DROP POLICY IF EXISTS "employees_update_beneficiaries" ON public.beneficiaries;

-- employees: drop FOR ALL admin_manage (is_admin()), per-op auth_* policies cover everything
DROP POLICY IF EXISTS "admin_manage_employees" ON public.employees;

-- employees: drop auth_read (duplicate of auth_select)
DROP POLICY IF EXISTS "auth_read_employees" ON public.employees;

-- medications: drop FOR ALL medical_access (is_medical_staff() OR is_admin()), per-op auth_* policies cover everything
DROP POLICY IF EXISTS "medical_access_medications" ON public.medications;
