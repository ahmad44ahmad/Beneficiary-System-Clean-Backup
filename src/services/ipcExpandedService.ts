// ═══════════════════════════════════════════════════════════════════════════
// IPC Expanded Service - BICSL, Occupational Exposure, Outbreaks
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../config/supabase';

const isSupabaseReady = (): boolean => !!supabase;

const logError = (context: string, error: unknown) => {
    if (import.meta.env.DEV) console.error(`[IPCExpandedService] ${context}:`, error);
};

// ═══════════════════════════════════════════════════════════════════════════
// BICSL Certifications
// ═══════════════════════════════════════════════════════════════════════════

export interface BICLSCertification {
    id: string;
    employee_name: string;
    employee_id?: string;
    department: string;
    competencies: Record<string, string | null>;
    competencies_passed: number;
    total_competencies: number;
    is_certified: boolean;
    certification_date?: string;
    expiry_date?: string;
    assessor_name?: string;
    notes?: string;
    created_at: string;
}

export const bicslService = {
    async getCertifications(): Promise<BICLSCertification[]> {
        if (!isSupabaseReady()) return [];
        try {
            const { data, error } = await supabase!
                .from('bicsl_certifications')
                .select('*')
                .order('employee_name');
            if (error) { logError('getCertifications', error); return []; }
            return data || [];
        } catch (error) { logError('getCertifications', error); return []; }
    },

    async saveCertification(cert: Partial<BICLSCertification>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            return { success: true, id: 'demo-' + Date.now() };
        }
        try {
            const { data, error } = await supabase!
                .from('bicsl_certifications')
                .upsert(cert)
                .select('id')
                .single();
            if (error) { logError('saveCertification', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveCertification', error); return { success: false }; }
    },

    async getStats(): Promise<{ total: number; certified: number; expired: number; expiringSoon: number }> {
        if (!isSupabaseReady()) return { total: 0, certified: 0, expired: 0, expiringSoon: 0 };
        try {
            const { data, error } = await supabase!.from('bicsl_certifications').select('*');
            if (error || !data) return { total: 0, certified: 0, expired: 0, expiringSoon: 0 };
            const now = new Date();
            const in90Days = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
            return {
                total: data.length,
                certified: data.filter(c => c.is_certified && (!c.expiry_date || new Date(c.expiry_date) > now)).length,
                expired: data.filter(c => c.expiry_date && new Date(c.expiry_date) <= now).length,
                expiringSoon: data.filter(c => c.expiry_date && new Date(c.expiry_date) > now && new Date(c.expiry_date) <= in90Days).length,
            };
        } catch (error) { logError('getStats', error); return { total: 0, certified: 0, expired: 0, expiringSoon: 0 }; }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// Occupational Exposures
// ═══════════════════════════════════════════════════════════════════════════

export interface OccupationalExposure {
    id: string;
    incident_code?: string;
    incident_date: string;
    incident_time?: string;
    employee_name: string;
    department?: string;
    exposure_type: string;
    body_part_affected?: string;
    source_known: boolean;
    source_status?: string;
    fluid_type?: string;
    first_aid_performed: boolean;
    first_aid_steps: string[];
    risk_assessment?: string;
    pep_recommended: boolean;
    pep_started: boolean;
    status: string;
    created_at: string;
}

export const exposureService = {
    async getExposures(): Promise<OccupationalExposure[]> {
        if (!isSupabaseReady()) return [];
        try {
            const { data, error } = await supabase!
                .from('occupational_exposures')
                .select('*')
                .order('incident_date', { ascending: false });
            if (error) { logError('getExposures', error); return []; }
            return data || [];
        } catch (error) { logError('getExposures', error); return []; }
    },

    async saveExposure(exposure: Partial<OccupationalExposure>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            return { success: true, id: 'demo-' + Date.now() };
        }
        try {
            const { data, error } = await supabase!
                .from('occupational_exposures')
                .insert(exposure)
                .select('id')
                .single();
            if (error) { logError('saveExposure', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveExposure', error); return { success: false }; }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// Outbreaks
// ═══════════════════════════════════════════════════════════════════════════

export interface Outbreak {
    id: string;
    outbreak_code: string;
    detection_date: string;
    pathogen?: string;
    severity: string;
    primary_location?: string;
    current_case_count: number;
    staff_affected: number;
    beneficiaries_affected: number;
    containment_status: string;
    containment_measures: string[];
    moh_notified: boolean;
    moh_reference_number?: string;
    created_at: string;
}

export interface OutbreakContact {
    id: string;
    outbreak_id: string;
    contact_type: string;
    contact_name: string;
    exposure_level: string;
    monitoring_status: string;
    monitoring_end_date?: string;
    created_at: string;
}

export const outbreakService = {
    async getOutbreaks(): Promise<Outbreak[]> {
        if (!isSupabaseReady()) return [];
        try {
            const { data, error } = await supabase!
                .from('outbreaks')
                .select('*')
                .order('detection_date', { ascending: false });
            if (error) { logError('getOutbreaks', error); return []; }
            return data || [];
        } catch (error) { logError('getOutbreaks', error); return []; }
    },

    async getContacts(outbreakId?: string): Promise<OutbreakContact[]> {
        if (!isSupabaseReady()) return [];
        try {
            let query = supabase!.from('outbreak_contacts').select('*');
            if (outbreakId) query = query.eq('outbreak_id', outbreakId);
            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) { logError('getContacts', error); return []; }
            return data || [];
        } catch (error) { logError('getContacts', error); return []; }
    },

    async saveOutbreak(outbreak: Partial<Outbreak>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            return { success: true, id: 'demo-' + Date.now() };
        }
        try {
            const { data, error } = await supabase!
                .from('outbreaks')
                .insert(outbreak)
                .select('id')
                .single();
            if (error) { logError('saveOutbreak', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveOutbreak', error); return { success: false }; }
    },

    async saveContact(contact: Partial<OutbreakContact>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            return { success: true, id: 'demo-' + Date.now() };
        }
        try {
            const { data, error } = await supabase!
                .from('outbreak_contacts')
                .insert(contact)
                .select('id')
                .single();
            if (error) { logError('saveContact', error); return { success: false }; }
            return { success: true, id: data.id };
        } catch (error) { logError('saveContact', error); return { success: false }; }
    }
};
