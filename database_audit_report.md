# COMPREHENSIVE DATABASE AUDIT

Generated: 2026-01-31T15:48:44.524Z

## 1. ALL TABLES IN DATABASE

- accountability_gaps: 0 rows (RLS ON)
- alerts: 5 rows (RLS ON)
- audit_logs: 0 rows (RLS ON)
- benchmark_standards: 0 rows (RLS ON)
- beneficiaries: 156 rows (RLS ON)
- beneficiaries_staging: 0 rows (RLS ON)
- beneficiary_preferences: 0 rows (RLS ON)
- capas: 0 rows (RLS ON)
- catering_categories: 0 rows (RLS ON)
- catering_daily_inventory: 0 rows (RLS ON)
- catering_daily_reports: 0 rows (RLS ON)
- catering_inventory_transactions: 0 rows (RLS ON)
- catering_items: 0 rows (RLS ON)
- catering_raw_materials: 0 rows (RLS ON)
- catering_units: 0 rows (RLS ON)
- catering_violations: 0 rows (RLS ON)
- compliance_logs: 0 rows (RLS ON)
- cost_tracking: 0 rows (RLS ON)
- daily_care_logs: 20 rows (RLS ON)
- daily_meals: 0 rows (RLS ON)
- dietary_plans: 0 rows (RLS ON)
- emergency_alerts: 0 rows (RLS ON)
- employees: 0 rows (RLS ON)
- evacuation_logs: 0 rows (RLS ON)
- fall_risk_assessments: 0 rows (RLS ON)
- goal_progress_logs: 0 rows (RLS ON)
- goal_templates: 0 rows (RLS ON)
- grc_bcp_scenarios: 0 rows (RLS ON)
- grc_compliance: 18 rows (RLS ON)
- grc_compliance_requirements: 0 rows (RLS ON)
- grc_ncrs: 9 rows (RLS ON)
- grc_risk_categories: 0 rows (RLS ON)
- grc_risks: 27 rows (RLS ON)
- grc_safety_incidents: 0 rows (RLS ON)
- grc_standards: 0 rows (RLS ON)
- hr_attendance: 0 rows (RLS ON)
- human_rights_compliance: 0 rows (RLS ON)
- immunizations: 0 rows (RLS ON)
- independence_budget_analysis: 0 rows (RLS ON)
- ipc_checklist_templates: 0 rows (RLS ON)
- ipc_incidents: 0 rows (RLS ON)
- ipc_inspections: 0 rows (RLS ON)
- iso_compliance_checklist: 0 rows (RLS ON)
- locations: 0 rows (RLS ON)
- meals: 5 rows (RLS ON)
- medical_alerts: 0 rows (RLS ON)
- medical_profiles: 0 rows (RLS ON)
- medical_records: 0 rows (RLS ON)
- medication_administrations: 0 rows (RLS ON)
- medication_schedules: 0 rows (RLS ON)
- medications: 0 rows (RLS ON)
- om_asset_categories: 0 rows (RLS ON)
- om_assets: 0 rows (RLS ON)
- om_maintenance_requests: 0 rows (RLS ON)
- om_preventive_schedules: 0 rows (RLS ON)
- om_waste_records: 0 rows (RLS ON)
- process_executions: 0 rows (RLS ON)
- processes: 0 rows (RLS ON)
- rehab_goals: 0 rows (RLS ON)
- rehab_plans: 12 rows (RLS ON)
- risk_alerts: 0 rows (RLS ON)
- risk_score_log: 0 rows (RLS ON)
- services_gap_analysis: 0 rows (RLS ON)
- shift_handover_notes: 0 rows (RLS ON)
- social_research: 15 rows (RLS ON)
- staff: 8 rows (RLS ON)
- stock_alerts: 0 rows (RLS ON)
- strategic_kpis: 0 rows (RLS ON)
- vital_signs: 0 rows (RLS ON)

## 2. ALL RLS POLICIES


### accountability_gaps
- **employees_manage_accountability** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### alerts
- **public_read_alerts** (ALL): PERMISSIVE for {public}
  Condition: `true`

### audit_logs
- **authenticated_insert_access** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **authenticated_read_access** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_audit_insert** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **employees_audit_read** (SELECT): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### benchmark_standards
- **employees_manage_benchmarks** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### beneficiaries
- **Public Access** (ALL): PERMISSIVE for {public}
  Condition: `true`
- **admin_delete_beneficiaries** (DELETE): PERMISSIVE for {authenticated}
  Condition: `is_admin()`
- **allow_all_delete** (DELETE): PERMISSIVE for {authenticated}
  Condition: `true`
- **allow_all_read** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **allow_all_update** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `true`
- **allow_all_write** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **beneficiaries_delete_all** (DELETE): PERMISSIVE for {authenticated}
  Condition: `true`
- **beneficiaries_delete_by_tenant** (DELETE): PERMISSIVE for {authenticated}
  Condition: `(tenant_id = ((auth.jwt() ->> 'tenant_id'::text))::uuid)`
- **beneficiaries_delete_tenant** (DELETE): PERMISSIVE for {authenticated}
  Condition: `(tenant_id = ((auth.jwt() ->> 'tenant_id'::text))::uuid)`
- **beneficiaries_insert_all** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **beneficiaries_insert_by_tenant** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **beneficiaries_insert_tenant** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **beneficiaries_public_read** (SELECT): PERMISSIVE for {anon}
  Condition: `true`
- **beneficiaries_read_all** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **beneficiaries_read_auth** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **beneficiaries_read_tenant** (SELECT): PERMISSIVE for {authenticated}
  Condition: `(tenant_id = ((auth.jwt() ->> 'tenant_id'::text))::uuid)`
- **beneficiaries_select_all** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **beneficiaries_select_by_tenant** (SELECT): PERMISSIVE for {authenticated}
  Condition: `(tenant_id = ((auth.jwt() ->> 'tenant_id'::text))::uuid)`
- **beneficiaries_update_all** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `true`
- **beneficiaries_update_by_tenant** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `(tenant_id = ((auth.jwt() ->> 'tenant_id'::text))::uuid)`
- **beneficiaries_update_tenant** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `(tenant_id = ((auth.jwt() ->> 'tenant_id'::text))::uuid)`
- **dev_auth_all_beneficiaries** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_beneficiaries** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`
- **employees_insert_beneficiaries** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **employees_read_beneficiaries** (SELECT): PERMISSIVE for {authenticated}
  Condition: `is_employee()`
- **employees_update_beneficiaries** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### beneficiaries_staging
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### beneficiary_preferences
- **employees_beneficiary_prefs** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### capas
- **Users can delete own capas** (DELETE): PERMISSIVE for {authenticated}
  Condition: `(( SELECT auth.uid() AS uid) = owner_id)`
- **Users can insert own capas** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **Users can update own capas** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `(( SELECT auth.uid() AS uid) = owner_id)`
- **Users can view own capas** (SELECT): PERMISSIVE for {authenticated}
  Condition: `(( SELECT auth.uid() AS uid) = owner_id)`
- **capas_delete_own** (DELETE): PERMISSIVE for {authenticated}
  Condition: `(( SELECT auth.uid() AS uid) = owner_id)`
- **capas_insert_own** (INSERT): PERMISSIVE for {authenticated}
  Condition: `NONE`
- **capas_public_read** (SELECT): PERMISSIVE for {anon,authenticated}
  Condition: `true`
- **capas_select_own** (SELECT): PERMISSIVE for {authenticated}
  Condition: `(( SELECT auth.uid() AS uid) = owner_id)`
- **capas_update_own** (UPDATE): PERMISSIVE for {authenticated}
  Condition: `(( SELECT auth.uid() AS uid) = owner_id)`

### catering_categories
- **employees_catering_categories** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### catering_daily_inventory
- **employees_catering_daily_inventory** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### catering_daily_reports
- **Allow authenticated full access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### catering_inventory_transactions
- **employees_catering_inventory_trans** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### catering_items
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### catering_raw_materials
- **employees_catering_raw_materials** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### catering_violations
- **public_read_violations** (ALL): PERMISSIVE for {public}
  Condition: `true`

### compliance_logs
- **Enable read access for all users** (SELECT): PERMISSIVE for {public}
  Condition: `true`

### daily_care_logs
- **Public Access Logs** (ALL): PERMISSIVE for {public}
  Condition: `true`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### daily_meals
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### dietary_plans
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### emergency_alerts
- **employees_emergency_alerts** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### employees
- **admin_manage_employees** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_admin()`
- **auth_read_employees** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_read_authenticated** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`

### evacuation_logs
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### fall_risk_assessments
- **authenticated_can_read_fall_risk_assessments** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### goal_progress_logs
- **employees_goal_progress** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### goal_templates
- **employees_goal_templates** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### grc_bcp_scenarios
- **employees_grc_bcp** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### grc_compliance
- **anon_insert_grc_compliance** (INSERT): PERMISSIVE for {public}
  Condition: `NONE`
- **anon_update_grc_compliance** (UPDATE): PERMISSIVE for {public}
  Condition: `true`
- **public_read_grc_compliance** (ALL): PERMISSIVE for {public}
  Condition: `true`

### grc_compliance_requirements
- **employees_grc_compliance_req** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### grc_ncrs
- **anon_insert_grc_ncrs** (INSERT): PERMISSIVE for {public}
  Condition: `NONE`
- **anon_update_grc_ncrs** (UPDATE): PERMISSIVE for {public}
  Condition: `true`
- **public_read_grc_ncrs** (ALL): PERMISSIVE for {public}
  Condition: `true`

### grc_risk_categories
- **employees_grc_risk_cat** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### grc_risks
- **anon_insert_grc_risks** (INSERT): PERMISSIVE for {public}
  Condition: `NONE`
- **anon_update_grc_risks** (UPDATE): PERMISSIVE for {public}
  Condition: `true`
- **public_read_grc_risks** (ALL): PERMISSIVE for {public}
  Condition: `true`

### hr_attendance
- **employees_manage_attendance** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### human_rights_compliance
- **employees_manage_compliance** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### immunizations
- **medical_staff_immunizations** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_medical_staff()`

### independence_budget_analysis
- **employees_manage_budget** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### ipc_checklist_templates
- **employees_ipc_templates** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### ipc_incidents
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_ipc_incidents** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### ipc_inspections
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_ipc_inspections** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### iso_compliance_checklist
- **employees_iso_compliance** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### meals
- **public_read_meals** (ALL): PERMISSIVE for {public}
  Condition: `true`

### medical_alerts
- **replace_with_policy_name** (SELECT): PERMISSIVE for {authenticated}
  Condition: `true`

### medical_profiles
- **Public Access Medical** (ALL): PERMISSIVE for {public}
  Condition: `true`
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### medical_records
- **public_read_medical** (ALL): PERMISSIVE for {public}
  Condition: `true`

### medication_administrations
- **auth_access_med_admin** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **medical_staff_med_admin** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_medical_staff()`

### medication_schedules
- **auth_access_med_schedules** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **medical_staff_med_schedules** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_medical_staff()`

### medications
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **medical_access_medications** (ALL): PERMISSIVE for {authenticated}
  Condition: `(is_medical_staff() OR is_admin())`

### om_asset_categories
- **employees_om_asset_categories** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### om_assets
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_om_assets** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### om_maintenance_requests
- **authenticated_full_access** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_om_maintenance** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### om_preventive_schedules
- **om_preventive_schedules_anon_select** (SELECT): PERMISSIVE for {anon}
  Condition: `true`
- **om_preventive_schedules_authenticated_all** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### om_waste_records
- **employees_om_waste** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### process_executions
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### processes
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### rehab_goals
- **medical_staff_rehab_goals** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_medical_staff()`

### rehab_plans
- **anon_read_all** (SELECT): PERMISSIVE for {anon,authenticated}
  Condition: `true`
- **rehab_plans_anon_select** (SELECT): PERMISSIVE for {anon}
  Condition: `true`
- **rehab_plans_authenticated_all** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### risk_alerts
- **authenticated_all** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### risk_score_log
- **employees_manage_risk_log** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### services_gap_analysis
- **employees_manage_services_gap** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### shift_handover_notes
- **auth_access_handover** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`
- **employees_shift_notes** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_employee()`

### social_research
- **anon_read_all** (SELECT): PERMISSIVE for {anon,authenticated}
  Condition: `true`
- **social_research_anon_select** (SELECT): PERMISSIVE for {anon}
  Condition: `true`
- **social_research_authenticated_all** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### staff
- **public_read_staff** (ALL): PERMISSIVE for {public}
  Condition: `true`

### stock_alerts
- **Enable all access for authenticated users** (ALL): PERMISSIVE for {authenticated}
  Condition: `true`

### strategic_kpis
- **kpis_public_read** (SELECT): PERMISSIVE for {anon,authenticated}
  Condition: `true`

### vital_signs
- **medical_access_vital_signs** (ALL): PERMISSIVE for {authenticated}
  Condition: `(is_medical_staff() OR is_admin())`
- **medical_staff_vital_signs** (ALL): PERMISSIVE for {authenticated}
  Condition: `is_medical_staff()`

## 3. ROLE PERMISSIONS


## 4. ANON ROLE READ TEST

- beneficiaries: ❌ ERROR: permission denied to set role "anon"
- medication_schedules: ❌ ERROR: permission denied to set role "anon"
- vital_signs: ❌ ERROR: permission denied to set role "anon"
- locations: ❌ ERROR: permission denied to set role "anon"
- employees: ❌ ERROR: permission denied to set role "anon"
- shift_handover_notes: ❌ ERROR: permission denied to set role "anon"
