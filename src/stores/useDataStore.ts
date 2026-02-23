import { create } from 'zustand';
import {
    Beneficiary,
    VisitLog,
    InventoryItem,
    SocialActivityPlan,
    SocialActivityDocumentation,
    SocialActivityFollowUp,
} from '../types';
import { UnifiedBeneficiaryProfile } from '../types/unified';
import { MedicalProfile, VaccinationRecord } from '../types/medical';
import { deriveSmartTags } from '../utils/tagEngine';
import { supaService } from '../services/supaService';
import { beneficiaries as localBeneficiaries } from '../data/beneficiaries';
import { visitLogs as initialVisitLogs } from '../data/visits';
import { inventoryItems as initialInventory } from '../data/inventory';

interface DataState {
    beneficiaries: UnifiedBeneficiaryProfile[];
    visitLogs: VisitLog[];
    inventory: InventoryItem[];
    medicalProfiles: MedicalProfile[];
    socialActivityPlans: SocialActivityPlan[];
    socialActivityDocs: SocialActivityDocumentation[];
    socialActivityFollowUps: SocialActivityFollowUp[];
    vaccinations: VaccinationRecord[];
    isolationStats: {
        totalBeds: number;
        occupiedBeds: number;
        patients: { name: string; reason: string }[];
    };
    loading: boolean;
    error: string | null;
}

interface DataActions {
    fetchData: () => Promise<void>;
    getBeneficiaryById: (id: string) => UnifiedBeneficiaryProfile | undefined;
    getBeneficiaryByNationalId: (nid: string) => Promise<UnifiedBeneficiaryProfile | null>;
    updateBeneficiary: (id: string, data: Partial<Beneficiary>) => Promise<void>;
    refreshData: () => Promise<void>;
    addVisitLog: (log: VisitLog) => void;
    addSocialActivityPlan: (plan: SocialActivityPlan) => void;
    addSocialActivityDoc: (doc: SocialActivityDocumentation) => void;
    addSocialActivityFollowUp: (followUp: SocialActivityFollowUp) => void;
    addMedicalProfile: (profile: MedicalProfile) => void;
}

const toUnifiedProfiles = (source: typeof localBeneficiaries): UnifiedBeneficiaryProfile[] => {
    return source.map(b => ({
        ...b,
        visitLogs: [],
        incidents: [],
        medicalHistory: [],
        smartTags: [],
        riskLevel: 'low' as const,
        isOrphan: b.guardianRelation?.toLowerCase().includes('يتيم') || b.guardianRelation === 'State Ward',
        hasChronicCondition: Boolean(b.medicalDiagnosis && (
            b.medicalDiagnosis.includes('سكري') ||
            b.medicalDiagnosis.includes('صرع') ||
            b.medicalDiagnosis.includes('diabetes') ||
            b.medicalDiagnosis.includes('epilepsy')
        )),
        requiresIsolation: false
    } as UnifiedBeneficiaryProfile));
};

const isDemoMode = import.meta.env.VITE_APP_MODE === 'demo';

export const useDataStore = create<DataState & DataActions>((set, get) => ({
    beneficiaries: [],
    visitLogs: initialVisitLogs,
    inventory: initialInventory,
    medicalProfiles: [],
    socialActivityPlans: [],
    socialActivityDocs: [],
    socialActivityFollowUps: [],
    vaccinations: [
        { id: '1', beneficiaryId: '101', vaccineName: 'Influenza', dueDate: '2023-11-01', status: 'Overdue' },
        { id: '2', beneficiaryId: '102', vaccineName: 'Hepatitis B', dueDate: '2023-12-15', status: 'Pending' }
    ],
    isolationStats: {
        totalBeds: 10,
        occupiedBeds: 0,
        patients: [],
    },
    loading: true,
    error: null,

    fetchData: async () => {
        set({ loading: true, error: null });
        try {
            if (isDemoMode) {
                const enrichedData = toUnifiedProfiles(localBeneficiaries).map(b => ({
                    ...b,
                    smartTags: deriveSmartTags(b)
                }));
                set({ beneficiaries: enrichedData, error: null, loading: false });
                return;
            }

            const data = await supaService.getBeneficiaries();
            let dataSource: UnifiedBeneficiaryProfile[];

            if (data && data.length > 0) {
                dataSource = data;
            } else {
                dataSource = toUnifiedProfiles(localBeneficiaries);
                set({ error: 'Supabase returned empty — using local fallback data' });
            }

            const enrichedData = dataSource.map(b => ({
                ...b,
                smartTags: deriveSmartTags(b)
            }));
            set({ beneficiaries: enrichedData, loading: false });
        } catch (err: unknown) {
            console.error("Data fetch error:", err);
            const enrichedData = toUnifiedProfiles(localBeneficiaries).map(b => ({
                ...b,
                smartTags: deriveSmartTags(b)
            }));
            set({
                beneficiaries: enrichedData,
                error: 'Using local data (Supabase unavailable)',
                loading: false,
            });
        }
    },

    getBeneficiaryById: (id) => {
        return get().beneficiaries.find(b => b.id === id);
    },

    getBeneficiaryByNationalId: async (nid) => {
        const local = get().beneficiaries.find(b => b.nationalId === nid);
        if (local) return local;
        return await supaService.getBeneficiaryByNationalId(nid);
    },

    updateBeneficiary: async (id, data) => {
        try {
            await supaService.updateBeneficiary(id, data);
            set((state) => ({
                beneficiaries: state.beneficiaries.map(b => b.id === id ? { ...b, ...data } : b),
            }));
        } catch (err: unknown) {
            console.error("Update failed:", err);
            throw err;
        }
    },

    refreshData: async () => {
        await get().fetchData();
    },

    addVisitLog: (log) => set((state) => ({ visitLogs: [log, ...state.visitLogs] })),
    addSocialActivityPlan: (plan) => set((state) => ({ socialActivityPlans: [plan, ...state.socialActivityPlans] })),
    addSocialActivityDoc: (doc) => set((state) => ({ socialActivityDocs: [doc, ...state.socialActivityDocs] })),
    addSocialActivityFollowUp: (followUp) => set((state) => ({ socialActivityFollowUps: [followUp, ...state.socialActivityFollowUps] })),
    addMedicalProfile: (profile) => set((state) => ({ medicalProfiles: [...state.medicalProfiles, profile] })),
}));
