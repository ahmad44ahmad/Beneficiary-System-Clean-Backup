import { useMemo } from 'react';
import { useBeneficiaries } from './useBeneficiaries';
import { useLocalDataStore } from '../stores/useLocalDataStore';
import { UnifiedBeneficiaryProfile } from '../types/unified';
import { deriveSmartTags, calculateRiskLevel } from '../utils/tagEngine';

export const useUnifiedProfile = (beneficiaryId: string): UnifiedBeneficiaryProfile | null => {
    const { data: beneficiaries = [] } = useBeneficiaries();
    const medicalProfiles = useLocalDataStore((s) => s.medicalProfiles);
    const socialResearchForms = useLocalDataStore((s) => s.socialResearchForms);
    const rehabilitationPlans = useLocalDataStore((s) => s.rehabilitationPlans);
    const visitLogs = useLocalDataStore((s) => s.visitLogs);
    const incidents = useLocalDataStore((s) => s.incidents);
    const medicalExaminations = useLocalDataStore((s) => s.medicalExaminations);
    const educationalPlans = useLocalDataStore((s) => s.educationalPlans);

    const profile = useMemo(() => {
        const baseBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);
        if (!baseBeneficiary) return null;

        // 1. Aggregate Related Data
        const relatedMedicalProfile = medicalProfiles.find(p => p.beneficiaryId === beneficiaryId);
        const relatedSocialResearch = socialResearchForms.find(s => s.beneficiaryId === beneficiaryId);
        const activeRehabPlan = rehabilitationPlans.find(p => p.beneficiaryId === beneficiaryId && (p as unknown as { status: string }).status === 'active') as unknown as UnifiedBeneficiaryProfile['activeRehabPlan'];
        const relatedEducationalPlan = educationalPlans.find(p => p.beneficiaryId === beneficiaryId);

        // Collections
        const relatedVisits = visitLogs
            .filter(v => v.beneficiaryId === beneficiaryId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const relatedIncidents = incidents
            .filter(i => i.beneficiaryId === beneficiaryId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const relatedMedicalHistory = medicalExaminations
            .filter(m => m.beneficiaryId === beneficiaryId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const latestMedicalExam = relatedMedicalHistory[0];

        // 2. Construct Unified Object
        const unifiedProfile: UnifiedBeneficiaryProfile = {
            ...baseBeneficiary,
            medicalProfile: relatedMedicalProfile,
            socialResearch: relatedSocialResearch,
            activeRehabPlan,
            latestMedicalExam,
            educationalPlan: relatedEducationalPlan,
            visitLogs: relatedVisits,
            incidents: relatedIncidents,
            medicalHistory: relatedMedicalHistory,

            // Placeholder for computed fields (calculated below)
            smartTags: [],
            riskLevel: 'low',
            isOrphan: false,
            hasChronicCondition: false,
            requiresIsolation: false
        };

        // 3. Apply Smart Logic
        unifiedProfile.smartTags = deriveSmartTags(unifiedProfile);
        unifiedProfile.riskLevel = calculateRiskLevel(unifiedProfile.smartTags);

        // derived flags
        unifiedProfile.isOrphan = unifiedProfile.smartTags.some(t => t.id === 'orphan');
        unifiedProfile.hasChronicCondition = unifiedProfile.smartTags.some(t => t.id === 'diabetic' || t.id === 'epilepsy');
        unifiedProfile.requiresIsolation = unifiedProfile.smartTags.some(t => t.id === 'isolation');

        return unifiedProfile;

    }, [
        beneficiaryId,
        beneficiaries,
        medicalProfiles,
        socialResearchForms,
        rehabilitationPlans,
        visitLogs,
        incidents,
        medicalExaminations,
        educationalPlans
    ]);

    return profile;
};
