-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة v2 — تصنيف البيانات حسب DT-IS-POL-1000 V10
-- Migration 023 | 2026-04-22
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Purpose: Tag every table and sensitive column with its classification level
-- per the HRSD Data Classification Policy (DT-IS-POL-1000 V10).
--
-- NON-DESTRUCTIVE: COMMENT ON only — no DDL, no data changes, idempotent.
-- Re-run safe.
--
-- Classification levels (HRSD taxonomy):
--   عام (Public)          — reference data, categories, lookups
--   محدود (Restricted)    — PII: beneficiaries, employees, daily records
--   سري (Confidential)    — sensitive medical, social research, incidents
--   سري للغاية (Top Secret) — not used in Basira
--
-- Column-level labels appended for the most sensitive fields within
-- otherwise-classified tables.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- CORE PII — BENEFICIARIES (محدود/Restricted)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE beneficiaries IS
    'تصنيف: محدود (Restricted) — DT-IS-POL-1000 V10. '
    'يحتوي على بيانات شخصية لذوي الإعاقة المقيمين في المركز. '
    'الوصول مقيَّد حسب الدور. كل قراءة تُسجَّل عبر pgaudit.';

COMMENT ON COLUMN beneficiaries.national_id IS
    'حقل بالغ الحساسية — رقم الهوية الوطنية. يُخفى في الواجهة (***-***-NNNN). '
    'القراءة الكاملة متاحة لأدوار director + admin + doctor + secretary فقط.';

COMMENT ON COLUMN beneficiaries.medical_diagnosis IS
    'تصنيف: سري (Confidential) داخل جدول محدود. '
    'التشخيص الطبي — ملاحظة: بصيرة تفضّل مصطلح "التقييم الوظيفي" في v2.';

COMMENT ON COLUMN beneficiaries.guardian_phone IS
    'محدود — رقم الاتصال بولي الأمر. لا يُعرض خارج نطاق المصرَّح له.';

-- ─────────────────────────────────────────────────────────────────────────────
-- HR — EMPLOYEES (محدود/Restricted)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE employees IS
    'تصنيف: محدود (Restricted) — DT-IS-POL-1000 V10. '
    'بيانات الموظفين الوظيفية. '
    'الوصول مقيَّد بـ director + admin.';

COMMENT ON COLUMN employees.phone IS 'محدود — رقم جوال الموظف.';
COMMENT ON COLUMN employees.email IS 'محدود — البريد الإلكتروني الوظيفي.';

-- ─────────────────────────────────────────────────────────────────────────────
-- DAILY CARE — VITAL SIGNS + MOOD (محدود/Restricted)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE daily_care_logs IS
    'تصنيف: محدود (Restricted) — DT-IS-POL-1000 V10. '
    'السجلات اليومية للرعاية: علامات حيوية + مزاج + ملاحظات. '
    'الوصول: doctor + nurse + social_worker + director.';

-- ─────────────────────────────────────────────────────────────────────────────
-- SHIFT HANDOVER (محدود/Restricted)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE shift_handover_reports IS
    'تصنيف: محدود (Restricted) — DT-IS-POL-1000 V10. '
    'محاضر التسليم بين الفترات. يتضمّن ملاحظات الموظّفين المباشرين.';

-- ─────────────────────────────────────────────────────────────────────────────
-- SAFETY — FALL RISK & INCIDENTS (محدود/Restricted, trending سري)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE fall_risk_assessments IS
    'تصنيف: محدود (Restricted) — تقييم مخاطر السقوط. '
    'العَوْق الأساسي: B1 (مادي). '
    'الوصول: doctor + nurse + specialist.';

COMMENT ON TABLE fall_incidents IS
    'تصنيف: سري (Confidential) — DT-IS-POL-1000 V10. '
    'محاضر حوادث السقوط — تتضمّن تفاصيل حرجة للسلامة. '
    'الوصول مقيَّد + كل قراءة تُسجَّل.';

COMMENT ON TABLE risk_alerts IS
    'تصنيف: محدود (Restricted) — تنبيهات المخاطر المُولَّدة آلياً.';

-- ─────────────────────────────────────────────────────────────────────────────
-- KPIs + AUDIT (محدود/Restricted)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE strategic_kpis IS
    'تصنيف: محدود (Restricted) — مؤشرات الأداء الاستراتيجية. '
    'وصول director + admin + quality role.';

COMMENT ON TABLE audit_logs IS
    'تصنيف: محدود (Restricted) — DT-IS-POL-1300 V7. '
    'سجل كل عمليات الكتابة في النظام — لا يُحذف، يُؤرشف. '
    'الاحتفاظ: حسب سياسة الوكالة (Data Retention Policy v1.0). '
    'مدّة افتراضية مُقترَحة: 7 سنوات.';

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEPENDENCE & SOCIAL (محدود→سري)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE beneficiary_classification IS
    'تصنيف: محدود (Restricted) — تصنيف المستفيد حسب درجة الاستقلالية. '
    'الجسر الأساسي للنموذج الاجتماعي للإعاقة.';

COMMENT ON TABLE services_gap_analysis IS
    'تصنيف: محدود (Restricted) — تحليل فجوات الخدمات.';

COMMENT ON TABLE independence_budget_analysis IS
    'تصنيف: محدود (Restricted) — التحليل المالي للاستقلالية.';

COMMENT ON TABLE human_rights_compliance IS
    'تصنيف: محدود (Restricted) — الامتثال لحقوق الإنسان (CRPD). '
    'قد يكشف قصوراً مؤسسياً — عرضه خارجياً يتطلّب موافقة.';

COMMENT ON TABLE external_services_benchmark IS
    'تصنيف: محدود (Restricted) — مقارنات الخدمات الخارجية.';

-- ─────────────────────────────────────────────────────────────────────────────
-- GRC (محدود/Restricted)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE grc_risks IS
    'تصنيف: محدود (Restricted) — سجلّ المخاطر المؤسسية. '
    'DT-IS-FRM-2320 Risk Management Framework.';

COMMENT ON TABLE grc_safety_incidents IS
    'تصنيف: سري (Confidential) — حوادث السلامة. '
    'يتضمّن تفاصيل قد تُؤثّر على صورة المركز خارجياً.';

COMMENT ON TABLE grc_disability_codes IS
    'تصنيف: عام (Public) — رموز إدارية معيارية. '
    'لا يتضمّن بيانات شخصية.';

-- ─────────────────────────────────────────────────────────────────────────────
-- CATERING (محدود/Restricted — supplier data)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE catering_suppliers IS
    'تصنيف: محدود (Restricted) — بيانات مورّدي الإعاشة. '
    'تتضمّن بيانات تجارية حساسة.';

COMMENT ON TABLE contractor_evaluations IS
    'تصنيف: محدود (Restricted) — تقييمات المقاولين.';

-- ─────────────────────────────────────────────────────────────────────────────
-- REFERENCE TABLES (عام/Public)
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE evaluation_criteria IS
    'تصنيف: عام (Public) — معايير التقييم المرجعية. '
    'قواعد مرجعية، لا بيانات شخصية.';

COMMENT ON TABLE benchmark_standards IS
    'تصنيف: عام (Public) — المعايير المرجعية للأداء.';

COMMENT ON TABLE iso_compliance_checklist IS
    'تصنيف: محدود (Restricted) — قوائم الامتثال لـISO. '
    'داخلية للمركز — لا تُنشر خارجياً قبل الاعتماد.';

-- ═══════════════════════════════════════════════════════════════════════════════
-- الأعمدة/الجداول التي تم تجاهلها عمداً
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- 1. medications + medication_administrations: مُصنَّفة كـ"سري" ضمنياً، سنُضيف
--    COMMENTS عند تنفيذ إعادة تأطيرها في v2 Phase 2 (linguistic refactor).
--
-- 2. medical_profiles (type): التصنيف يعتمد على قرار إعادة تأطير "patient" في v2.
--
-- 3. Shift/attendance tables: محدود. تُعلَّق لاحقاً.
--
-- 4. social_research: سري (محتوى حسّاس جداً). سيُعلَّق بعد مراجعة أحمد للحقول.
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- End of migration 023
-- ═══════════════════════════════════════════════════════════════════════════════
