/**
 * useLocalDataStore - Zustand store for local-only domain data
 * Replaces UnifiedDataContext's local state (arrays not fetched from Supabase)
 *
 * For server-fetched data (beneficiaries), use TanStack Query hooks instead:
 *   - useBeneficiaries() from src/hooks/useBeneficiaries.ts
 */

import { create } from 'zustand';
import {
    VisitLog,
    InventoryItem,
    CaseStudy,
    RehabilitationPlan,
    IncidentReport,
    IndividualEducationalPlan,
    InjuryReport,
    ClothingRequest,
    FamilyCaseStudy,
    SocialActivityPlan,
    SocialActivityDocumentation,
    SocialActivityFollowUp,
    TrainingReferral,
    TrainingPlanFollowUp,
    VocationalEvaluation,
    FamilyGuidanceReferral,
    PostCareFollowUp,
} from '../types';
import { SocialResearch } from '../types/social';
import { MedicalProfile, MedicalExamination, VaccinationRecord } from '../types/medical';
import { visitLogs as initialVisitLogs } from '../data/visits';
import { inventoryItems as initialInventory } from '../data/inventory';

interface IsolationStats {
    totalBeds: number;
    occupiedBeds: number;
    patients: { name: string; reason: string }[];
}

interface LocalDataState {
    // Collections
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
    isolationStats: IsolationStats;

    // Actions
    addVisitLog: (log: VisitLog) => void;
    addSocialActivityPlan: (plan: SocialActivityPlan) => void;
    addSocialActivityDoc: (doc: SocialActivityDocumentation) => void;
    addSocialActivityFollowUp: (followUp: SocialActivityFollowUp) => void;
    addMedicalProfile: (profile: MedicalProfile) => void;
}

export const useLocalDataStore = create<LocalDataState>((set) => ({
    // Initialized from local data
    visitLogs: initialVisitLogs,
    inventory: initialInventory,

    // Empty collections (will be populated via server or user actions)
    medicalProfiles: [],
    caseStudies: [],
    socialResearchForms: [],
    rehabilitationPlans: [],
    incidents: [],
    medicalExaminations: [],
    educationalPlans: [],
    injuryReports: [],
    clothingRequests: [],
    familyCaseStudies: [],
    socialActivityPlans: [],
    socialActivityDocs: [],
    socialActivityFollowUps: [],
    trainingReferrals: [],
    trainingPlanFollowUps: [],
    vocationalEvaluations: [],
    familyGuidanceReferrals: [],
    postCareFollowUps: [],

    // Static data
    vaccinations: [
        { id: '1', beneficiaryId: '101', vaccineName: 'Influenza', dueDate: '2023-11-01', status: 'Overdue' },
        { id: '2', beneficiaryId: '102', vaccineName: 'Hepatitis B', dueDate: '2023-12-15', status: 'Pending' },
    ],
    isolationStats: {
        totalBeds: 10,
        occupiedBeds: 0,
        patients: [],
    },

    // Actions
    addVisitLog: (log) => set((s) => ({ visitLogs: [log, ...s.visitLogs] })),
    addSocialActivityPlan: (plan) => set((s) => ({ socialActivityPlans: [plan, ...s.socialActivityPlans] })),
    addSocialActivityDoc: (doc) => set((s) => ({ socialActivityDocs: [doc, ...s.socialActivityDocs] })),
    addSocialActivityFollowUp: (followUp) => set((s) => ({ socialActivityFollowUps: [followUp, ...s.socialActivityFollowUps] })),
    addMedicalProfile: (profile) => set((s) => ({ medicalProfiles: [...s.medicalProfiles, profile] })),
}));
