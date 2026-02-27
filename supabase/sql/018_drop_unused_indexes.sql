BEGIN;

-- Migration 018: Drop 44 unused indexes identified by Supabase Performance Advisor
-- These indexes have negligible scan activity and waste storage + slow writes.

DROP INDEX IF EXISTS public.idx_bicsl_employee;
DROP INDEX IF EXISTS public.idx_bicsl_expiry;
DROP INDEX IF EXISTS public.idx_bicsl_certified;
DROP INDEX IF EXISTS public.idx_capas_process_id;
DROP INDEX IF EXISTS public.idx_catering_inv_txn_material_id;
DROP INDEX IF EXISTS public.idx_catering_raw_mat_category_id;
DROP INDEX IF EXISTS public.idx_daily_meals_beneficiary_id;
DROP INDEX IF EXISTS public.idx_daily_meals_delivered_by;
DROP INDEX IF EXISTS public.idx_catering_raw_mat_unit_id;
DROP INDEX IF EXISTS public.idx_compliance_logs_beneficiary_id;
DROP INDEX IF EXISTS public.idx_contractor_eval_evaluator_id;
DROP INDEX IF EXISTS public.idx_contractor_eval_supplier_id;
DROP INDEX IF EXISTS public.idx_cost_tracking_entered_by;
DROP INDEX IF EXISTS public.idx_daily_care_logs_recorded_by;
DROP INDEX IF EXISTS public.idx_dietary_plans_nutritionist_id;
DROP INDEX IF EXISTS public.idx_evacuation_logs_beneficiary_id;
DROP INDEX IF EXISTS public.idx_evacuation_logs_emergency_id;
DROP INDEX IF EXISTS public.idx_eval_answers_criteria_id;
DROP INDEX IF EXISTS public.idx_eval_answers_evaluation_id;
DROP INDEX IF EXISTS public.idx_fall_incidents_beneficiary_id;
DROP INDEX IF EXISTS public.idx_fall_incidents_reported_by;
DROP INDEX IF EXISTS public.idx_fall_risk_beneficiary;
DROP INDEX IF EXISTS public.idx_fall_risk_assessed_by;
DROP INDEX IF EXISTS public.idx_grc_audits_standard_id;
DROP INDEX IF EXISTS public.idx_grc_bcp_tests_scenario_id;
DROP INDEX IF EXISTS public.idx_grc_compliance_req_standard_id;
DROP INDEX IF EXISTS public.idx_grc_risk_categories_parent_id;
DROP INDEX IF EXISTS public.idx_medical_alerts_beneficiary_id;
DROP INDEX IF EXISTS public.idx_om_asset_categories_parent_id;
DROP INDEX IF EXISTS public.idx_om_assets_category_id;
DROP INDEX IF EXISTS public.idx_med_schedules_beneficiary;
DROP INDEX IF EXISTS public.idx_med_admin_beneficiary;
DROP INDEX IF EXISTS public.idx_preventive_schedules_asset;
DROP INDEX IF EXISTS public.idx_om_maint_eval_approved_by;
DROP INDEX IF EXISTS public.idx_om_maint_eval_contractor_id;
DROP INDEX IF EXISTS public.idx_om_maint_eval_evaluated_by;
DROP INDEX IF EXISTS public.idx_om_maint_req_asset_id;
DROP INDEX IF EXISTS public.idx_process_executions_process_id;
DROP INDEX IF EXISTS public.idx_risk_alerts_beneficiary_id;
DROP INDEX IF EXISTS public.idx_shift_items_beneficiary_id;
DROP INDEX IF EXISTS public.idx_shift_reports_incoming_staff;
DROP INDEX IF EXISTS public.idx_shift_reports_outgoing_staff;
DROP INDEX IF EXISTS public.idx_stock_alerts_capa_id;
DROP INDEX IF EXISTS public.idx_stock_alerts_medication_id;

COMMIT;
