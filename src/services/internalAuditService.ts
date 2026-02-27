// Internal Audit Service - ISO 9001:2015

import { supabase } from '../config/supabase';

const isSupabaseReady = (): boolean => !!supabase;

const logError = (context: string, error: unknown) => {
    if (import.meta.env.DEV) console.error(`[InternalAuditService] ${context}:`, error);
};

export interface AuditCycle {
    id: string;
    cycle_name: string;
    cycle_year: number;
    cycle_quarter: number;
    planned_start_date: string;
    planned_end_date: string;
    actual_start_date?: string;
    actual_end_date?: string;
    lead_auditor: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    scope?: string;
    created_at: string;
}

export interface InternalAudit {
    id: string;
    cycle_id: string;
    audit_code: string;
    iso_clause: string;
    department: string;
    auditor_name: string;
    auditee_name?: string;
    planned_date?: string;
    actual_date?: string;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    overall_result?: 'conforming' | 'minor_nc' | 'major_nc' | 'observation' | 'opportunity';
    checklist_data: Record<string, unknown>;
    summary?: string;
    strengths?: string;
    ncr_ids: string[];
    created_at: string;
}

export interface AuditFinding {
    id: string;
    audit_id: string;
    finding_code: string;
    finding_type: 'major_nc' | 'minor_nc' | 'observation' | 'opportunity' | 'strength';
    iso_clause: string;
    description: string;
    evidence?: string;
    root_cause?: string;
    corrective_action?: string;
    responsible_person?: string;
    due_date?: string;
    completion_date?: string;
    verification_date?: string;
    verification_result?: string;
    status: 'open' | 'action_planned' | 'in_progress' | 'completed' | 'verified' | 'closed';
    created_at: string;
}

export const internalAuditService = {
    async getCycles(): Promise<AuditCycle[]> {
        if (!isSupabaseReady()) return [];
        try {
            const { data, error } = await supabase
                .from('internal_audit_cycles')
                .select('*')
                .order('cycle_year', { ascending: false });
            if (error) { logError('getCycles', error); return []; }
            return data || [];
        } catch (error) { logError('getCycles', error); return []; }
    },

    async getAudits(cycleId?: string): Promise<InternalAudit[]> {
        if (!isSupabaseReady()) return [];
        try {
            let query = supabase.from('internal_audits').select('*');
            if (cycleId) query = query.eq('cycle_id', cycleId);
            const { data, error } = await query.order('planned_date');
            if (error) { logError('getAudits', error); return []; }
            return data || [];
        } catch (error) { logError('getAudits', error); return []; }
    },

    async getFindings(auditId?: string): Promise<AuditFinding[]> {
        if (!isSupabaseReady()) return [];
        try {
            let query = supabase.from('audit_findings').select('*');
            if (auditId) query = query.eq('audit_id', auditId);
            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) { logError('getFindings', error); return []; }
            return data || [];
        } catch (error) { logError('getFindings', error); return []; }
    },

    async saveCycle(cycle: Partial<AuditCycle>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) return { success: true, id: 'demo-' + Date.now() };
        try {
            const { data, error } = await supabase
                .from('internal_audit_cycles')
                .insert(cycle)
                .select('id')
                .single();
            if (error) { logError('saveCycle', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveCycle', error); return { success: false }; }
    },

    async saveAudit(audit: Partial<InternalAudit>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) return { success: true, id: 'demo-' + Date.now() };
        try {
            const { data, error } = await supabase
                .from('internal_audits')
                .insert(audit)
                .select('id')
                .single();
            if (error) { logError('saveAudit', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveAudit', error); return { success: false }; }
    },

    async saveFinding(finding: Partial<AuditFinding>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) return { success: true, id: 'demo-' + Date.now() };
        try {
            const { data, error } = await supabase
                .from('audit_findings')
                .insert(finding)
                .select('id')
                .single();
            if (error) { logError('saveFinding', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveFinding', error); return { success: false }; }
    },

    async updateFindingStatus(id: string, status: string): Promise<boolean> {
        if (!isSupabaseReady()) return true;
        try {
            const { error } = await supabase
                .from('audit_findings')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id);
            if (error) { logError('updateFindingStatus', error); return false; }
            return true;
        } catch (error) { logError('updateFindingStatus', error); return false; }
    }
};
