
import { supabase } from '../config/supabase';
import {
    Beneficiary,
    UnifiedBeneficiaryProfile,
    VisitLog,
    InventoryItem,
    SocialResearch,
    CaseStudy,
    MedicalExamination,
    IncidentReport,
    RehabilitationPlan
} from '../types';

// Helper for consistent error logging
const logError = (context: string, error: any) => {
    if (import.meta.env.DEV) {
        console.error(`[SupaService] ${context}:`, error);
    }
};

// Helper for safe Supabase check
const isSupabaseReady = (): boolean => {
    if (!supabase) {
        if (import.meta.env.DEV) {
            console.warn('[SupaService] Supabase not configured');
        }
        return false;
    }
    return true;
};

export const supaService = {
    // ═══════════════════════════════════════════════════════════════
    // المستفيدون (Beneficiaries)
    // ═══════════════════════════════════════════════════════════════

    async getBeneficiaries(): Promise<UnifiedBeneficiaryProfile[]> {
        if (!isSupabaseReady()) return [];

        const { data, error } = await supabase
            .from('beneficiaries')
            .select('*')
            .order('full_name');

        if (error) {
            logError('getBeneficiaries', error);
            return [];
        }

        return data as UnifiedBeneficiaryProfile[];
    },

    async getBeneficiaryById(id: string): Promise<UnifiedBeneficiaryProfile | null> {
        if (!isSupabaseReady()) return null;

        const { data, error } = await supabase
            .from('beneficiaries')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            logError(`getBeneficiaryById(${id})`, error);
            return null;
        }
        return data as UnifiedBeneficiaryProfile;
    },

    async getBeneficiaryByNationalId(nationalId: string): Promise<UnifiedBeneficiaryProfile | null> {
        if (!isSupabaseReady()) return null;

        const { data, error } = await supabase
            .from('beneficiaries')
            .select('*')
            .eq('national_id', nationalId)
            .single();

        if (error) {
            logError(`getBeneficiaryByNationalId(${nationalId})`, error);
            return null;
        }
        return data as UnifiedBeneficiaryProfile;
    },

    async createBeneficiary(beneficiary: Partial<Beneficiary>): Promise<Beneficiary | null> {
        if (!beneficiary.nationalId) {
            logError('createBeneficiary', 'National ID is required');
            return null;
        }

        if (!isSupabaseReady()) return null;

        const { data, error } = await supabase
            .from('beneficiaries')
            .insert(beneficiary)
            .select()
            .single();

        if (error) {
            logError('createBeneficiary', error);
            return null;
        }
        return data;
    },

    async updateBeneficiary(id: string, updates: Partial<Beneficiary>): Promise<boolean> {
        if (!isSupabaseReady()) return false;

        const { error } = await supabase
            .from('beneficiaries')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            logError('updateBeneficiary', error);
            return false;
        }
        return true;
    },

    // ═══════════════════════════════════════════════════════════════
    // الإعاشة (Catering)
    // ═══════════════════════════════════════════════════════════════

    async getDailyMeals(date: string, mealType?: string) {
        if (!isSupabaseReady()) return [];

        let query = supabase
            .from('daily_meals')
            .select(`
                *,
                beneficiaries(id, full_name, file_number)
            `)
            .eq('meal_date', date);

        if (mealType) {
            query = query.eq('meal_type', mealType);
        }

        const { data, error } = await query;

        if (error) {
            logError('getDailyMeals', error);
            return [];
        }
        return data;
    },

    async updateMealStatus(mealId: string, status: string): Promise<boolean> {
        if (!isSupabaseReady()) return false;

        const { error } = await supabase
            .from('daily_meals')
            .update({
                status,
                updated_at: new Date().toISOString(),
                delivered_at: status === 'delivered' ? new Date().toISOString() : undefined
            })
            .eq('id', mealId);

        if (error) {
            logError('updateMealStatus', error);
            return false;
        }
        return true;
    },

    async getDietaryPlan(beneficiaryId: string) {
        if (!isSupabaseReady()) return null;

        const { data, error } = await supabase
            .from('dietary_plans')
            .select('*')
            .eq('beneficiary_id', beneficiaryId)
            .single();

        if (error) {
            logError('getDietaryPlan', error);
            return null;
        }
        return data;
    },

    // ═══════════════════════════════════════════════════════════════
    // التشغيل والصيانة (Operations & Maintenance)
    // ═══════════════════════════════════════════════════════════════

    async getMaintenanceRequests(status?: string) {
        if (!isSupabaseReady()) return [];

        let query = supabase
            .from('om_maintenance_requests')
            .select(`
                *,
                om_assets(id, name_ar, asset_code)
            `)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            logError('getMaintenanceRequests', error);
            return [];
        }
        return data;
    },

    async createMaintenanceRequest(request: any): Promise<any | null> {
        if (!isSupabaseReady()) return null;

        // Generate request number
        const requestNumber = `MR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

        const { data, error } = await supabase
            .from('om_maintenance_requests')
            .insert({ ...request, request_number: requestNumber })
            .select()
            .single();

        if (error) {
            logError('createMaintenanceRequest', error);
            return null;
        }
        return data;
    },

    async getAssets(status?: string) {
        if (!isSupabaseReady()) return [];

        let query = supabase
            .from('om_assets')
            .select(`
                *,
                om_asset_categories(id, name_ar)
            `)
            .order('name_ar');

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            logError('getAssets', error);
            return [];
        }
        return data;
    },

    async getPreventiveSchedules(dueOnly: boolean = false) {
        if (!isSupabaseReady()) return [];

        let query = supabase
            .from('om_preventive_schedules')
            .select(`
                *,
                om_assets(id, name_ar, asset_code)
            `)
            .eq('status', 'active')
            .order('next_due_date');

        if (dueOnly) {
            query = query.lte('next_due_date', new Date().toISOString().split('T')[0]);
        }

        const { data, error } = await query;

        if (error) {
            logError('getPreventiveSchedules', error);
            return [];
        }
        return data;
    },

    // ═══════════════════════════════════════════════════════════════
    // الرعاية اليومية (Daily Care)
    // ═══════════════════════════════════════════════════════════════

    async getDailyCareLog(beneficiaryId: string, date: string) {
        if (!isSupabaseReady()) return null;

        const { data, error } = await supabase
            .from('daily_care_logs')
            .select('*')
            .eq('beneficiary_id', beneficiaryId)
            .eq('log_date', date)
            .order('log_time', { ascending: false });

        if (error) {
            logError('getDailyCareLog', error);
            return null;
        }
        return data;
    },

    async getFallRiskAssessments(beneficiaryId?: string) {
        if (!isSupabaseReady()) return [];

        let query = supabase
            .from('fall_risk_assessments')
            .select(`
                *,
                beneficiaries(id, full_name, file_number)
            `)
            .order('assessment_date', { ascending: false });

        if (beneficiaryId) {
            query = query.eq('beneficiary_id', beneficiaryId);
        }

        const { data, error } = await query;

        if (error) {
            logError('getFallRiskAssessments', error);
            return [];
        }
        return data;
    },

    // ═══════════════════════════════════════════════════════════════
    // البحث الاجتماعي والملف الطبي
    // ═══════════════════════════════════════════════════════════════

    async saveSocialResearch(data: SocialResearch): Promise<boolean> {
        if (!isSupabaseReady()) return false;

        const { error } = await supabase
            .from('social_research')
            .insert(data);

        if (error) {
            logError('saveSocialResearch', error);
            return false;
        }
        return true;
    },

    async saveMedicalProfile(data: any): Promise<boolean> {
        if (!isSupabaseReady()) return false;

        const { error } = await supabase
            .from('medical_profiles')
            .insert(data);

        if (error) {
            logError('saveMedicalProfile', error);
            return false;
        }
        return true;
    },

    // ═══════════════════════════════════════════════════════════════
    // الملف الشامل (Full Profile)
    // ═══════════════════════════════════════════════════════════════

    async getFullProfile(nationalId: string): Promise<any> {
        const beneficiary = await this.getBeneficiaryByNationalId(nationalId);
        if (!beneficiary) return null;

        if (!isSupabaseReady()) return beneficiary;

        const [medical, social, rehab, dietaryPlan] = await Promise.all([
            supabase.from('medical_records').select('*').eq('national_id', nationalId),
            supabase.from('social_research').select('*').eq('national_id', nationalId),
            supabase.from('rehab_plans').select('*').eq('national_id', nationalId),
            supabase.from('dietary_plans').select('*').eq('beneficiary_id', beneficiary.id).single()
        ]);

        return {
            ...beneficiary,
            medicalHistory: medical.data || [],
            socialResearch: social.data || [],
            rehabPlans: rehab.data || [],
            dietaryPlan: dietaryPlan.data
        };
    },

    // ═══════════════════════════════════════════════════════════════
    // الإحصائيات
    // ═══════════════════════════════════════════════════════════════

    async getDashboardStats() {
        if (!isSupabaseReady()) return {
            totalBeneficiaries: 0,
            activeBeneficiaries: 0,
            pendingMaintenance: 0,
            highRiskCases: 0
        };

        const [beneficiaries, maintenance, fallRisk] = await Promise.all([
            supabase.from('beneficiaries').select('*', { count: 'exact', head: true }),
            supabase.from('om_maintenance_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('fall_risk_assessments').select('*', { count: 'exact', head: true }).gte('risk_score', 50)
        ]);

        return {
            totalBeneficiaries: beneficiaries.count || 0,
            activeBeneficiaries: beneficiaries.count || 0,
            pendingMaintenance: maintenance.count || 0,
            highRiskCases: fallRisk.count || 0
        };
    }
};
