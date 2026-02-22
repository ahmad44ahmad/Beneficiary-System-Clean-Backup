-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة | رأس الحربة - الدوال والإجراءات المخزنة
-- الإصدار: 1.0 | التاريخ: 2025-12-23
-- ═══════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              دوال التقرير الآلي (Automated Handover Logic)                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- دالة لتوليد تقرير التسليم تلقائياً بناءً على سجلات الرعاية
CREATE OR REPLACE FUNCTION generate_handover_report(
    p_shift_date DATE,
    p_outgoing_shift TEXT,
    p_section TEXT
) RETURNS JSONB AS $$
DECLARE
    v_report_id UUID;
    v_total_beneficiaries INTEGER;
    v_stable_count INTEGER;
    v_critical_count INTEGER;
    v_summary_incidents TEXT;
BEGIN
    -- 1. حساب الإحصائيات
    SELECT COUNT(*) INTO v_total_beneficiaries 
    FROM beneficiaries 
    WHERE section = p_section AND status = 'نشط';

    SELECT COUNT(*) INTO v_critical_count
    FROM daily_care_logs l
    JOIN beneficiaries b ON l.beneficiary_id = b.id
    WHERE l.log_date = p_shift_date 
      AND l.shift = p_outgoing_shift
      AND b.section = p_section
      AND l.requires_followup = true;

    v_stable_count := v_total_beneficiaries - v_critical_count;

    -- 2. تجميع ملخص الحوادث
    SELECT STRING_AGG(l.incidents, E'\n') INTO v_summary_incidents
    FROM daily_care_logs l
    JOIN beneficiaries b ON l.beneficiary_id = b.id
    WHERE l.log_date = p_shift_date 
      AND l.shift = p_outgoing_shift
      AND b.section = p_section
      AND l.incidents IS NOT NULL;

    -- 3. إنشاء أو تحديث التقرير
    INSERT INTO shift_handover_reports (
        shift_date, outgoing_shift, incoming_shift, section,
        total_beneficiaries, stable_count, critical_count,
        summary_incidents, status
    ) VALUES (
        p_shift_date, 
        p_outgoing_shift,
        CASE 
            WHEN p_outgoing_shift = 'صباحي' THEN 'مسائي'
            WHEN p_outgoing_shift = 'مسائي' THEN 'ليلي'
            ELSE 'صباحي'
        END,
        p_section,
        v_total_beneficiaries, v_stable_count, v_critical_count,
        COALESCE(v_summary_incidents, 'لا توجد حوادث مسجلة'),
        'draft'
    )
    ON CONFLICT (shift_date, outgoing_shift, section) 
    DO UPDATE SET 
        total_beneficiaries = EXCLUDED.total_beneficiaries,
        critical_count = EXCLUDED.critical_count,
        summary_incidents = EXCLUDED.summary_incidents,
        generated_at = NOW()
    RETURNING id INTO v_report_id;

    RETURN jsonb_build_object(
        'success', true, 
        'report_id', v_report_id,
        'message', 'تم توليد تقرير التسليم بنجاح'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              دوال المؤشرات الاستراتيجية (Strategic KPIs Logic)               │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- دالة لحساب المؤشرات اليومية (تُستدعى في نهاية اليوم أو كل ساعة)
CREATE OR REPLACE FUNCTION calculate_daily_kpis() RETURNS VOID AS $$
DECLARE
    v_total_capacity CONSTANT INTEGER := 200; -- الطاقة الاستيعابية الثابتة للمثال
    v_current_occupancy INTEGER;
    v_active_alerts INTEGER;
    v_care_logs_count INTEGER;
    v_high_risk_count INTEGER;
BEGIN
    -- حساب الإشغال
    SELECT COUNT(*) INTO v_current_occupancy FROM beneficiaries WHERE status = 'نشط';
    
    -- حساب التنبيهات النشطة
    SELECT COUNT(*) INTO v_active_alerts FROM risk_alerts WHERE status = 'نشط';
    
    -- حساب نسبة اكتمال السجلات (لليوم الحالي)
    SELECT COUNT(*) INTO v_care_logs_count FROM daily_care_logs WHERE log_date = CURRENT_DATE;
    
    -- حساب ذوي الخطورة العالية
    SELECT COUNT(*) INTO v_high_risk_count 
    FROM fall_risk_assessments 
    WHERE risk_level IN ('عالي', 'حرج');

    -- إدخال المؤشرات
    INSERT INTO strategic_kpis (
        kpi_date, section,
        total_capacity, current_occupancy, occupancy_rate,
        active_alerts_count, high_risk_beneficiaries,
        care_logs_completion_rate,
        paper_forms_eliminated, -- كل سجل رقمي يلغي نموذجين ورقيين (افتراض)
        staff_hours_saved -- توفير 5 دقائق لكل سجل
    ) VALUES (
        CURRENT_DATE, NULL, -- المركز ككل
        v_total_capacity,
        v_current_occupancy,
        ROUND((v_current_occupancy::DECIMAL / v_total_capacity) * 100, 2),
        v_active_alerts,
        v_high_risk_count,
        ROUND((v_care_logs_count::DECIMAL / GREATEST(v_current_occupancy * 3, 1)) * 100, 2), -- 3 ورديات
        v_care_logs_count * 2,
        ROUND((v_care_logs_count * 5) / 60.0, 2)
    )
    ON CONFLICT (kpi_date, section)
    DO UPDATE SET
        current_occupancy = EXCLUDED.current_occupancy,
        active_alerts_count = EXCLUDED.active_alerts_count,
        care_logs_completion_rate = EXCLUDED.care_logs_completion_rate,
        paper_forms_eliminated = EXCLUDED.paper_forms_eliminated,
        staff_hours_saved = EXCLUDED.staff_hours_saved,
        calculated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              دوال مساعدة (Helper Functions)                                  │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق التحديث الآلي على الجداول الرئيسية
CREATE TRIGGER update_beneficiaries_modtime
    BEFORE UPDATE ON beneficiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_assessments_modtime
    BEFORE UPDATE ON fall_risk_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
