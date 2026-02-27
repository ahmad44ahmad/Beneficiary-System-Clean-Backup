-- Migration 021: Add indexes for unindexed foreign keys
-- Resolves 41 unindexed_foreign_keys performance advisor warnings
-- Date: 2026-02-27

-- capas
CREATE INDEX IF NOT EXISTS idx_capas_process_id ON public.capas (process_id);

-- catering_inventory_transactions
CREATE INDEX IF NOT EXISTS idx_catering_inv_tx_material_id ON public.catering_inventory_transactions (material_id);

-- catering_raw_materials
CREATE INDEX IF NOT EXISTS idx_catering_raw_mat_category_id ON public.catering_raw_materials (category_id);
CREATE INDEX IF NOT EXISTS idx_catering_raw_mat_unit_id ON public.catering_raw_materials (unit_id);

-- compliance_logs
CREATE INDEX IF NOT EXISTS idx_compliance_logs_beneficiary_id ON public.compliance_logs (beneficiary_id);

-- contractor_evaluations
CREATE INDEX IF NOT EXISTS idx_contractor_eval_evaluator_id ON public.contractor_evaluations (evaluator_id);
CREATE INDEX IF NOT EXISTS idx_contractor_eval_supplier_id ON public.contractor_evaluations (supplier_id);

-- cost_tracking
CREATE INDEX IF NOT EXISTS idx_cost_tracking_entered_by ON public.cost_tracking (entered_by);

-- daily_care_logs
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_recorded_by ON public.daily_care_logs (recorded_by);

-- daily_meals
CREATE INDEX IF NOT EXISTS idx_daily_meals_beneficiary_id ON public.daily_meals (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_daily_meals_delivered_by ON public.daily_meals (delivered_by);

-- dietary_plans
CREATE INDEX IF NOT EXISTS idx_dietary_plans_nutritionist_id ON public.dietary_plans (nutritionist_id);

-- evacuation_logs
CREATE INDEX IF NOT EXISTS idx_evacuation_logs_beneficiary_id ON public.evacuation_logs (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_evacuation_logs_emergency_id ON public.evacuation_logs (emergency_id);

-- evaluation_answers
CREATE INDEX IF NOT EXISTS idx_evaluation_answers_criteria_id ON public.evaluation_answers (criteria_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_answers_evaluation_id ON public.evaluation_answers (evaluation_id);

-- fall_incidents
CREATE INDEX IF NOT EXISTS idx_fall_incidents_beneficiary_id ON public.fall_incidents (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_fall_incidents_reported_by ON public.fall_incidents (reported_by);

-- fall_risk_assessments
CREATE INDEX IF NOT EXISTS idx_fall_risk_assess_assessed_by ON public.fall_risk_assessments (assessed_by);
CREATE INDEX IF NOT EXISTS idx_fall_risk_assess_beneficiary_id ON public.fall_risk_assessments (beneficiary_id);

-- grc_audits
CREATE INDEX IF NOT EXISTS idx_grc_audits_standard_id ON public.grc_audits (standard_id);

-- grc_bcp_tests
CREATE INDEX IF NOT EXISTS idx_grc_bcp_tests_scenario_id ON public.grc_bcp_tests (scenario_id);

-- grc_compliance_requirements
CREATE INDEX IF NOT EXISTS idx_grc_compliance_req_standard_id ON public.grc_compliance_requirements (standard_id);

-- grc_risk_categories
CREATE INDEX IF NOT EXISTS idx_grc_risk_cat_parent_id ON public.grc_risk_categories (parent_id);

-- medical_alerts
CREATE INDEX IF NOT EXISTS idx_medical_alerts_beneficiary_id ON public.medical_alerts (beneficiary_id);

-- medication_administrations
CREATE INDEX IF NOT EXISTS idx_med_admin_beneficiary_id ON public.medication_administrations (beneficiary_id);

-- medication_schedules
CREATE INDEX IF NOT EXISTS idx_med_schedule_beneficiary_id ON public.medication_schedules (beneficiary_id);

-- om_asset_categories
CREATE INDEX IF NOT EXISTS idx_om_asset_cat_parent_id ON public.om_asset_categories (parent_id);

-- om_assets
CREATE INDEX IF NOT EXISTS idx_om_assets_category_id ON public.om_assets (category_id);

-- om_maintenance_evaluations
CREATE INDEX IF NOT EXISTS idx_om_maint_eval_approved_by ON public.om_maintenance_evaluations (approved_by);
CREATE INDEX IF NOT EXISTS idx_om_maint_eval_contractor_id ON public.om_maintenance_evaluations (contractor_id);
CREATE INDEX IF NOT EXISTS idx_om_maint_eval_evaluated_by ON public.om_maintenance_evaluations (evaluated_by);

-- om_maintenance_requests
CREATE INDEX IF NOT EXISTS idx_om_maint_req_asset_id ON public.om_maintenance_requests (asset_id);

-- om_preventive_schedules
CREATE INDEX IF NOT EXISTS idx_om_prev_sched_asset_id ON public.om_preventive_schedules (asset_id);

-- process_executions
CREATE INDEX IF NOT EXISTS idx_process_exec_process_id ON public.process_executions (process_id);

-- risk_alerts
CREATE INDEX IF NOT EXISTS idx_risk_alerts_beneficiary_id ON public.risk_alerts (beneficiary_id);

-- shift_handover_items
CREATE INDEX IF NOT EXISTS idx_shift_items_beneficiary_id ON public.shift_handover_items (beneficiary_id);

-- shift_handover_reports
CREATE INDEX IF NOT EXISTS idx_shift_reports_incoming_staff ON public.shift_handover_reports (incoming_staff);
CREATE INDEX IF NOT EXISTS idx_shift_reports_outgoing_staff ON public.shift_handover_reports (outgoing_staff);

-- stock_alerts
CREATE INDEX IF NOT EXISTS idx_stock_alerts_capa_id ON public.stock_alerts (capa_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_medication_id ON public.stock_alerts (medication_id);
