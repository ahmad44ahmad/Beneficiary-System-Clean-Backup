
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

export const supaService = {
    // --- Beneficiaries ---
    async getBeneficiaries(): Promise<UnifiedBeneficiaryProfile[]> {
        if (!supabase) {
            console.warn('Supabase not configured. Returning empty list.');
            return [];
        }
        const { data, error } = await supabase
            .from('beneficiaries')
            .select('*');

        if (error) {
            console.error('Error fetching beneficiaries:', error);
            return [];
        }

        // In a real scenario, we would join other tables here. 
        // For now, we return base profiles.
        return data as UnifiedBeneficiaryProfile[];
    },

    async getBeneficiaryByNationalId(nationalId: string): Promise<UnifiedBeneficiaryProfile | null> {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('beneficiaries')
            .select('*')
            .eq('nationalId', nationalId)
            .single();

        if (error) {
            console.error(`Error fetching beneficiary ${nationalId}:`, error);
            return null;
        }
        return data as UnifiedBeneficiaryProfile;
    },

    async createBeneficiary(beneficiary: Partial<Beneficiary>): Promise<Beneficiary | null> {
        // Ensure National ID logic is enforced
        if (!beneficiary.nationalId) {
            console.error("National ID is required for unified tracking");
            return null;
        }

        if (!supabase) return null;

        const { data, error } = await supabase
            .from('beneficiaries')
            .insert(beneficiary)
            .select()
            .single();

        if (error) {
            console.error('Error creating beneficiary:', error);
            return null;
        }
        return data;
    },

    async updateBeneficiary(id: string, updates: Partial<Beneficiary>): Promise<void> {
        if (!supabase) return;
        const { error } = await supabase
            .from('beneficiaries')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    // --- Social Research ---
    async saveSocialResearch(data: SocialResearch): Promise<void> {
        if (!supabase) return;
        const { error } = await supabase
            .from('social_research')
            .insert(data);

        if (error) throw error;
    },

    // --- Medical ---
    async saveMedicalProfile(data: any): Promise<void> {
        if (!supabase) return;
        const { error } = await supabase
            .from('medical_profiles')
            .insert(data);

        if (error) throw error;
    },

    // --- Linked Modules (The "Bridge") ---

    // Example: Fetch full profile including sub-tables
    async getFullProfile(nationalId: string): Promise<any> {
        // This simulates a "join" or multiple fetches to build the master record
        const beneficiary = await this.getBeneficiaryByNationalId(nationalId);
        if (!beneficiary) return null;

        if (!supabase) return beneficiary;

        const [medical, social, rehab] = await Promise.all([
            supabase.from('medical_records').select('*').eq('national_id', nationalId),
            supabase.from('social_research').select('*').eq('national_id', nationalId),
            supabase.from('rehab_plans').select('*').eq('national_id', nationalId)
        ]);

        return {
            ...beneficiary,
            medicalHistory: medical.data || [],
            socialResearch: social.data || [],
            rehabPlans: rehab.data || []
        };
    },

    // --- Dashboard Stats ---
    async getDashboardStats() {
        if (!supabase) return { totalBeneficiaries: 0 };
        // Real unified analytics
        const { count: totalBeneficiaries } = await supabase
            .from('beneficiaries')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // Add more queries here
        return {
            totalBeneficiaries: totalBeneficiaries || 0
        };
    }
};
