import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
    Beneficiary,
    VisitLog,
    InventoryItem,
    CaseStudy,
    SocialResearch,
    RehabilitationPlan,
    ClothingRequest,
    MedicalExamination,
    IndividualEducationalPlan,
    InjuryReport,
    FamilyCaseStudy,
    SocialActivityPlan,
    SocialActivityDocumentation,
    SocialActivityFollowUp,
    TrainingReferral,
    TrainingPlanFollowUp,
    VocationalEvaluation,
    FamilyGuidanceReferral,
    PostCareFollowUp,
    IncidentReport
} from '../types';
import { UnifiedBeneficiaryProfile } from '../types/unified';
import { MedicalProfile, VaccinationRecord } from '../types/medical';
import { deriveSmartTags } from '../utils/tagEngine';
import { supaService } from '../services/supaService';
import { beneficiaries as localBeneficiaries } from '../data/beneficiaries';
import { visitLogs as initialVisitLogs } from '../data/visits';
import { inventoryItems as initialInventory } from '../data/inventory';

interface UnifiedDataContextType {
    beneficiaries: UnifiedBeneficiaryProfile[];
    visitLogs: VisitLog[];
    inventory: InventoryItem[];
    medicalProfiles: MedicalProfile[];
    caseStudies: CaseStudy[];
    socialResearchForms: SocialResearch[];
    rehabilitationPlans: RehabilitationPlan[];
    incidents: IncidentReport[];
    medicalExaminations: MedicalExamination[];
    educationalPlans: IndividualEducationalPlan[];
    injuryReports: InjuryReport[];
    clothingRequests: ClothingRequest[];
    familyCaseStudies: FamilyCaseStudy[];
    socialActivityPlans: SocialActivityPlan[];
    socialActivityDocs: SocialActivityDocumentation[];
    socialActivityFollowUps: SocialActivityFollowUp[];
    trainingReferrals: TrainingReferral[];
    trainingPlanFollowUps: TrainingPlanFollowUp[];
    vocationalEvaluations: VocationalEvaluation[];
    familyGuidanceReferrals: FamilyGuidanceReferral[];
    postCareFollowUps: PostCareFollowUp[];
    vaccinations: VaccinationRecord[];
    isolationStats: {
        totalBeds: number;
        occupiedBeds: number;
        patients: { name: string; reason: string }[];
    };

    loading: boolean;
    error: string | null;

    // Actions
    getBeneficiaryById: (id: string) => UnifiedBeneficiaryProfile | undefined;
    getBeneficiaryByNationalId: (nid: string) => Promise<UnifiedBeneficiaryProfile | null>;
    updateBeneficiary: (id: string, data: Partial<Beneficiary>) => Promise<void>;
    refreshData: () => Promise<void>;

    // State Setters (Quick migration helpers)
    addVisitLog: (log: VisitLog) => void;
    addSocialActivityPlan: (plan: SocialActivityPlan) => void;
    addSocialActivityDoc: (doc: SocialActivityDocumentation) => void;
    addSocialActivityFollowUp: (followUp: SocialActivityFollowUp) => void;
    addMedicalProfile: (profile: MedicalProfile) => void;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Core Data
    const [beneficiaries, setBeneficiaries] = useState<UnifiedBeneficiaryProfile[]>([]);
    const [visitLogs, setVisitLogs] = useState<VisitLog[]>(initialVisitLogs);
    const [inventory, _setInventory] = useState<InventoryItem[]>(initialInventory);

    // Domain Data
    const [caseStudies, _setCaseStudies] = useState<CaseStudy[]>([]);
    const [socialResearchForms, _setSocialResearchForms] = useState<SocialResearch[]>([]);
    const [rehabilitationPlans, _setRehabilitationPlans] = useState<RehabilitationPlan[]>([]);
    const [incidents, _setIncidents] = useState<IncidentReport[]>([]);
    const [clothingRequests, _setClothingRequests] = useState<ClothingRequest[]>([]);
    const [medicalExaminations, _setMedicalExaminations] = useState<MedicalExamination[]>([]);
    const [educationalPlans, _setEducationalPlans] = useState<IndividualEducationalPlan[]>([]);
    const [injuryReports, _setInjuryReports] = useState<InjuryReport[]>([]);
    const [familyCaseStudies, _setFamilyCaseStudies] = useState<FamilyCaseStudy[]>([]);
    const [socialActivityPlans, setSocialActivityPlans] = useState<SocialActivityPlan[]>([]);
    const [socialActivityDocs, setSocialActivityDocs] = useState<SocialActivityDocumentation[]>([]);
    const [socialActivityFollowUps, setSocialActivityFollowUps] = useState<SocialActivityFollowUp[]>([]);
    const [trainingReferrals, _setTrainingReferrals] = useState<TrainingReferral[]>([]);
    const [trainingPlanFollowUps, _setTrainingPlanFollowUps] = useState<TrainingPlanFollowUp[]>([]);
    const [vocationalEvaluations, _setVocationalEvaluations] = useState<VocationalEvaluation[]>([]);
    const [familyGuidanceReferrals, _setFamilyGuidanceReferrals] = useState<FamilyGuidanceReferral[]>([]);
    const [postCareFollowUps, _setPostCareFollowUps] = useState<PostCareFollowUp[]>([]);

    // Medical Data
    const [medicalProfiles, setMedicalProfiles] = useState<MedicalProfile[]>([]);
    const [vaccinations, _setVaccinations] = useState<VaccinationRecord[]>([
        { id: '1', beneficiaryId: '101', vaccineName: 'Influenza', dueDate: '2023-11-01', status: 'Overdue' },
        { id: '2', beneficiaryId: '102', vaccineName: 'Hepatitis B', dueDate: '2023-12-15', status: 'Pending' }
    ]);
    const isolationStats = {
        totalBeds: 10,
        occupiedBeds: 0,
        patients: [] as { name: string; reason: string }[]
    });

    const isDemoMode = import.meta.env.VITE_APP_MODE === 'demo';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper to convert local beneficiaries to unified profiles
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

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Demo mode: use local data directly
            if (isDemoMode) {
                const enrichedData = toUnifiedProfiles(localBeneficiaries).map(b => ({
                    ...b,
                    smartTags: deriveSmartTags(b)
                }));
                setBeneficiaries(enrichedData);
                setError(null);
                return;
            }

            // Production mode: fetch from Supabase
            const data = await supaService.getBeneficiaries();

            let dataSource: UnifiedBeneficiaryProfile[];

            if (data && data.length > 0) {
                dataSource = data;
            } else {
                // Fallback to local data only if Supabase returns empty
                dataSource = toUnifiedProfiles(localBeneficiaries);
                setError('Supabase returned empty — using local fallback data');
            }

            const enrichedData = dataSource.map(b => ({
                ...b,
                smartTags: deriveSmartTags(b)
            }));

            setBeneficiaries(enrichedData);
            // In a real app, we would fetch other entities here too
            // setVisitLogs(initialVisitLogs); 
        } catch (err: unknown) {
            console.error("Data fetch error:", err);
            // Use local data as fallback on error
            const enrichedData = toUnifiedProfiles(localBeneficiaries).map(b => ({
                ...b,
                smartTags: deriveSmartTags(b)
            }));

            setBeneficiaries(enrichedData);
            setError('Using local data (Supabase unavailable)');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getBeneficiaryById = useCallback((id: string) => {
        return beneficiaries.find(b => b.id === id);
    }, [beneficiaries]);

    const getBeneficiaryByNationalId = useCallback(async (nid: string) => {
        const local = beneficiaries.find(b => b.nationalId === nid);
        if (local) return local;
        return await supaService.getBeneficiaryByNationalId(nid);
    }, [beneficiaries]);

    const updateBeneficiary = useCallback(async (id: string, data: Partial<Beneficiary>) => {
        try {
            await supaService.updateBeneficiary(id, data);
            setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
        } catch (err: unknown) {
            console.error("Update failed:", err);
            throw err;
        }
    }, []);

    const refreshData = useCallback(async () => {
        await fetchData();
    }, []);

    // Simple setters for migration
    const addVisitLog = useCallback((log: VisitLog) => setVisitLogs(prev => [log, ...prev]), []);
    const addSocialActivityPlan = useCallback((plan: SocialActivityPlan) => setSocialActivityPlans(prev => [plan, ...prev]), []);
    const addSocialActivityDoc = useCallback((doc: SocialActivityDocumentation) => setSocialActivityDocs(prev => [doc, ...prev]), []);
    const addSocialActivityFollowUp = useCallback((followUp: SocialActivityFollowUp) => setSocialActivityFollowUps(prev => [followUp, ...prev]), []);
    const addMedicalProfile = useCallback((profile: MedicalProfile) => setMedicalProfiles(prev => [...prev, profile]), []);

    const value = useMemo(() => ({
        beneficiaries,
        visitLogs,
        inventory,
        medicalProfiles,
        caseStudies,
        socialResearchForms,
        rehabilitationPlans,
        incidents,
        clothingRequests,
        medicalExaminations,
        educationalPlans,
        injuryReports,
        familyCaseStudies,
        socialActivityPlans,
        socialActivityDocs,
        socialActivityFollowUps,
        trainingReferrals,
        trainingPlanFollowUps,
        vocationalEvaluations,
        familyGuidanceReferrals,
        postCareFollowUps,
        vaccinations,
        isolationStats,
        loading,
        error,
        getBeneficiaryById,
        getBeneficiaryByNationalId,
        updateBeneficiary,
        refreshData,
        addVisitLog,
        addSocialActivityPlan,
        addSocialActivityDoc,
        addSocialActivityFollowUp,
        addMedicalProfile
    }), [
        beneficiaries, visitLogs, inventory, medicalProfiles, caseStudies,
        socialResearchForms, rehabilitationPlans, incidents, clothingRequests,
        medicalExaminations, educationalPlans, injuryReports, familyCaseStudies,
        socialActivityPlans, socialActivityDocs, socialActivityFollowUps,
        trainingReferrals, trainingPlanFollowUps, vocationalEvaluations,
        familyGuidanceReferrals, postCareFollowUps, vaccinations, isolationStats,
        loading, error, getBeneficiaryById, getBeneficiaryByNationalId,
        updateBeneficiary, refreshData, addVisitLog, addSocialActivityPlan,
        addSocialActivityDoc, addSocialActivityFollowUp, addMedicalProfile
    ]);

    return (
        <UnifiedDataContext.Provider value={value}>
            {children}
        </UnifiedDataContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUnifiedData = () => {
    const context = useContext(UnifiedDataContext);
    if (!context) {
        throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
    }
    return context;
};
