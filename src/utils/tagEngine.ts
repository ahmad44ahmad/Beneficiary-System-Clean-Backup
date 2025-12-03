import { UnifiedBeneficiaryProfile, SmartTag } from '../types/unified';

export const deriveSmartTags = (profile: UnifiedBeneficiaryProfile): SmartTag[] => {
    const tags: SmartTag[] = [];

    // 1. Social Status Tags
    if (
        profile.guardianRelation === 'State Ward' ||
        profile.socialStatus?.includes('يتيم') ||
        profile.socialStatus?.includes('تحت رعاية الدولة')
    ) {
        tags.push({
            id: 'orphan',
            label: 'Orphan / State Ward',
            color: 'purple',
            icon: 'Baby',
            description: 'Beneficiary is a ward of the state or orphan.'
        });
    }

    if (profile.socialStatus?.includes('فقير') || profile.socialStatus?.includes('دخل محدود')) {
        tags.push({
            id: 'low-income',
            label: 'Low Income',
            color: 'gray',
            icon: 'Wallet'
        });
    }

    // 2. Medical Tags
    const diagnosis = profile.medicalDiagnosis?.toLowerCase() || '';
    const notes = profile.notes?.toLowerCase() || '';

    if (diagnosis.includes('diabetes') || diagnosis.includes('سكري')) {
        tags.push({
            id: 'diabetic',
            label: 'Diabetic',
            color: 'red',
            icon: 'Activity',
            description: 'Requires insulin or sugar monitoring.'
        });
    }

    if (diagnosis.includes('epilepsy') || diagnosis.includes('seizure') || diagnosis.includes('صرع')) {
        tags.push({
            id: 'epilepsy',
            label: 'Epilepsy Risk',
            color: 'orange',
            icon: 'Zap',
            description: 'History of seizures.'
        });
    }

    if (diagnosis.includes('cp') || diagnosis.includes('cerebral palsy') || diagnosis.includes('شلل')) {
        tags.push({
            id: 'mobility',
            label: 'Mobility Assistance',
            color: 'blue',
            icon: 'Accessibility',
            description: 'Requires wheelchair or assistance moving.'
        });
    }

    if (profile.medicalProfile?.infectionStatus?.isolationRecommended) {
        tags.push({
            id: 'isolation',
            label: 'ISOLATION PROTOCOL',
            color: 'red',
            icon: 'ShieldAlert',
            description: 'Active infection risk. PPE required.'
        });
    }

    // 3. Behavioral Tags
    if (
        diagnosis.includes('aggressive') ||
        diagnosis.includes('عدواني') ||
        notes.includes('aggressive') ||
        profile.psychiatricDiagnosis?.includes('عدواني')
    ) {
        tags.push({
            id: 'aggressive',
            label: 'Behavioral Risk',
            color: 'red',
            icon: 'AlertTriangle',
            description: 'History of aggression. Approach with caution.'
        });
    }

    if (diagnosis.includes('autism') || diagnosis.includes('توحد')) {
        tags.push({
            id: 'autism',
            label: 'Autism Spectrum',
            color: 'blue',
            icon: 'Puzzle'
        });
    }

    // 4. Age/Demographic Tags
    if (profile.age >= 60) {
        tags.push({
            id: 'elderly',
            label: 'Elderly Care',
            color: 'gray',
            icon: 'UserPlus'
        });
    }

    return tags;
};

export const calculateRiskLevel = (tags: SmartTag[]): 'low' | 'medium' | 'high' | 'critical' => {
    if (tags.some(t => t.id === 'isolation')) return 'critical';
    if (tags.some(t => t.id === 'aggressive' || t.id === 'epilepsy')) return 'high';
    if (tags.some(t => t.id === 'diabetic' || t.id === 'mobility')) return 'medium';
    return 'low';
};
