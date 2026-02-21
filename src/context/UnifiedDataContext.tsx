import React, { createContext, useContext, useState, useEffect } from 'react';
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
    isolationStats: any;

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
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

    // Domain Data
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [socialResearchForms, setSocialResearchForms] = useState<SocialResearch[]>([]);
    const [rehabilitationPlans, setRehabilitationPlans] = useState<RehabilitationPlan[]>([]);
    const [incidents, setIncidents] = useState<IncidentReport[]>([]);
    const [clothingRequests, setClothingRequests] = useState<ClothingRequest[]>([]);
    const [medicalExaminations, setMedicalExaminations] = useState<MedicalExamination[]>([]);
    const [educationalPlans, setEducationalPlans] = useState<IndividualEducationalPlan[]>([]);
    const [injuryReports, setInjuryReports] = useState<InjuryReport[]>([]);
    const [familyCaseStudies, setFamilyCaseStudies] = useState<FamilyCaseStudy[]>([]);
    const [socialActivityPlans, setSocialActivityPlans] = useState<SocialActivityPlan[]>([]);
    const [socialActivityDocs, setSocialActivityDocs] = useState<SocialActivityDocumentation[]>([]);
    const [socialActivityFollowUps, setSocialActivityFollowUps] = useState<SocialActivityFollowUp[]>([]);
    const [trainingReferrals, setTrainingReferrals] = useState<TrainingReferral[]>([]);
    const [trainingPlanFollowUps, setTrainingPlanFollowUps] = useState<TrainingPlanFollowUp[]>([]);
    const [vocationalEvaluations, setVocationalEvaluations] = useState<VocationalEvaluation[]>([]);
    const [familyGuidanceReferrals, setFamilyGuidanceReferrals] = useState<FamilyGuidanceReferral[]>([]);
    const [postCareFollowUps, setPostCareFollowUps] = useState<PostCareFollowUp[]>([]);

    // Medical Data
    const [medicalProfiles, setMedicalProfiles] = useState<MedicalProfile[]>([]);
    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
    const [isolationStats] = useState({
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
        } catch (err: any) {
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

    const getBeneficiaryById = (id: string) => {
        return beneficiaries.find(b => b.id === id);
    };

    const getBeneficiaryByNationalId = async (nid: string) => {
        const local = beneficiaries.find(b => b.nationalId === nid);
        if (local) return local;
        return await supaService.getBeneficiaryByNationalId(nid);
    };

    const updateBeneficiary = async (id: string, data: Partial<Beneficiary>) => {
        try {
            await supaService.updateBeneficiary(id, data);
            setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
        } catch (err: any) {
            console.error("Update failed:", err);
            throw err;
        }
    };

    const refreshData = async () => {
        await fetchData();
    };

    // Simple setters for migration
    const addVisitLog = (log: VisitLog) => setVisitLogs(prev => [log, ...prev]);
    const addSocialActivityPlan = (plan: SocialActivityPlan) => setSocialActivityPlans(prev => [plan, ...prev]);
    const addSocialActivityDoc = (doc: SocialActivityDocumentation) => setSocialActivityDocs(prev => [doc, ...prev]);
    const addSocialActivityFollowUp = (followUp: SocialActivityFollowUp) => setSocialActivityFollowUps(prev => [followUp, ...prev]);
    const addMedicalProfile = (profile: MedicalProfile) => setMedicalProfiles(prev => [...prev, profile]);

    return (
        <UnifiedDataContext.Provider value={{
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
        }}>
            {children}
        </UnifiedDataContext.Provider>
    );
};

export const useUnifiedData = () => {
    const context = useContext(UnifiedDataContext);
    if (!context) {
        throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
    }
    return context;
};
