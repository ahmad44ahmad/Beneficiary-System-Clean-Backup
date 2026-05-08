// src/services/repositories/indicatorsRepository.ts
// Repository layer for Indicators (المؤشرات) domain

import { supabase } from '../../config/supabase';

// risk_score_log, benchmark_standards, iso_compliance_checklist provisioned in
// Session E (migration `session_e_indicator_ops_tables`). Tables start empty;
// callers' `if (!data?.length)` paths still serve demo data when no rows exist.
const indicatorViewsAvailable = true;

export const indicatorsRepository = {
    /**
     * Fetch risk score log for Early Warning System
     */
    async fetchRiskScoreLog() {
        if (!supabase || !indicatorViewsAvailable) return null;
        const { data, error } = await supabase
            .from('risk_score_log')
            .select('*')
            .order('score_date', { ascending: true })
            .limit(14);
        if (error) return null;
        return data;
    },

    /**
     * Fetch benchmark standards
     */
    async fetchBenchmarkStandards() {
        if (!supabase || !indicatorViewsAvailable) return null;
        const { data, error } = await supabase
            .from('benchmark_standards')
            .select('*');
        if (error) return null;
        return data;
    },

    /**
     * Fetch ISO compliance checklist
     */
    async fetchISOComplianceChecklist() {
        if (!supabase || !indicatorViewsAvailable) return null;
        const { data, error } = await supabase
            .from('iso_compliance_checklist')
            .select('*')
            .order('iso_clause', { ascending: true });
        if (error) return null;
        return data;
    },

    /**
     * Fetch beneficiary count for Strategic KPI Dashboard
     */
    async fetchStrategicKPIStats() {
        if (!supabase) return null;
        const { count, error } = await supabase
            .from('beneficiaries')
            .select('*', { count: 'exact', head: true });
        if (error) return null;
        return { beneficiaryCount: count || 0 };
    },
};
