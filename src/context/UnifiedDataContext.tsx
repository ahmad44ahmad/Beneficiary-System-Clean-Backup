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
    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([
        { id: '1', beneficiaryId: '101', vaccineName: 'Influenza', dueDate: '2023-11-01', status: 'Overdue' },
        { id: '2', beneficiaryId: '102', vaccineName: 'Hepatitis B', dueDate: '2023-12-15', status: 'Pending' }
    ]);
    const isolationStats = {
        totalBeds: 10,
        occupiedBeds: 2,
        patients: [
            { name: 'محمد علي', reason: 'اشتباه عدوى تنفسية' },
            { name: 'خالد أحمد', reason: 'جدري مائي' }
        ]
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await supaService.getBeneficiaries();

            // Fallback to local data if Supabase returns empty or unavailable
            // OR if local data has MORE records (to preserve existing data)
            let dataSource: UnifiedBeneficiaryProfile[];

            // Use Supabase data if available
            if (data && data.length > 0) {
                dataSource = data;
                console.log(`✓ Loaded ${data.length} beneficiaries from Supabase`);
            } else {
                // Fallback to local data only if Supabase is empty
                dataSource = localBeneficiaries.map(b => ({
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
                console.log(`ℹ Supabase returned empty, using local fallback: ${localBeneficiaries.length} beneficiaries`);
            }

            // Enrich with smart tags
            const enrichedData = dataSource.map(b => ({
                ...b,
                smartTags: deriveSmartTags(b)
            }));

            setBeneficiaries(enrichedData);
            // In a real app, we would fetch other entities here too
            // setVisitLogs(initialVisitLogs); 
        } catch (err: any) {
            console.error("Data fetch error:", err);
            // Use local data as fallback on error
            const dataSource = localBeneficiaries.map(b => ({
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

            const enrichedData = dataSource.map(b => ({
                ...b,
                smartTags: deriveSmartTags(b)
            }));

            setBeneficiaries(enrichedData);
            console.warn(`⚠ Error occurred, using local data: ${localBeneficiaries.length} beneficiaries`);
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
