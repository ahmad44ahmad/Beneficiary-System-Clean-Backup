import { UnifiedBeneficiaryProfile, SmartTag } from '../types/unified';
import { ALERT_TAGS } from '../data/domain-assets';

export const deriveSmartTags = (profile: UnifiedBeneficiaryProfile): SmartTag[] => {
    const tags: SmartTag[] = [];

    // ═══════════════════════════════════════════════════════════════════════════
    // 0. Database Alerts - Include any alerts stored directly in the database
    // ═══════════════════════════════════════════════════════════════════════════
    if ((profile as any).alerts && Array.isArray((profile as any).alerts)) {
        for (const alertId of (profile as any).alerts) {
            const alertDef = ALERT_TAGS.find(t => t.id === alertId);
            if (alertDef) {
                tags.push({
                    id: alertDef.id,
                    label: alertDef.label,
                    color: alertDef.color as any,
                    icon: alertDef.icon
                });
            }
        }
    }

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

    // 5. Infection Control (Safety Path)
    const infectionKeywords = {
        'scabies': { type: 'contact', label: 'Contact Isolation (Scabies)', icon: 'ShieldAlert', color: 'red' },
        'جرب': { type: 'contact', label: 'عزل تلامس (جرب)', icon: 'ShieldAlert', color: 'red' },
        'tuberculosis': { type: 'airborne', label: 'Airborne Isolation (TB)', icon: 'Wind', color: 'red' },
        'سل': { type: 'airborne', label: 'عزل هوائي (سل)', icon: 'Wind', color: 'red' },
        'flu': { type: 'droplet', label: 'Droplet Isolation (Flu)', icon: 'CloudRain', color: 'orange' },
        'أنفلونزا': { type: 'droplet', label: 'عزل رذاذ (أنفلونزا)', icon: 'CloudRain', color: 'orange' },
        'corona': { type: 'droplet', label: 'Droplet Isolation (COVID-19)', icon: 'Virus', color: 'red' },
        'كورونا': { type: 'droplet', label: 'عزل رذاذ (كورونا)', icon: 'Virus', color: 'red' }
    };

    for (const [keyword, config] of Object.entries(infectionKeywords)) {
        if (diagnosis.includes(keyword) || notes.includes(keyword)) {
            tags.push({
                id: `isolation-${config.type}`,
                label: config.label,
                color: config.color as any,
                icon: config.icon,
                description: `Requires ${config.type} precautions. Check Global Alerts.`
            });
        }
    }

    // 6. Evacuation Priority (Safety Path)
    // Assuming 'mobility' field exists or inferred from diagnosis/notes for now if not in profile type explicitly
    // In a real scenario, we'd check profile.mobilityStatus
    if (diagnosis.includes('wheelchair') || diagnosis.includes('مقعد') || notes.includes('wheelchair')) {
        tags.push({
            id: 'evac-assist',
            label: 'Evac: Assist Required',
            color: 'orange',
            icon: 'AlertCircle',
            description: 'Priority 2: Needs wheelchair assistance.'
        });
    } else if (diagnosis.includes('bedridden') || diagnosis.includes('طريح فراش') || notes.includes('bedridden')) {
        tags.push({
            id: 'evac-stretcher',
            label: 'Evac: Stretcher Only',
            color: 'red',
            icon: 'Stretcher', // Lucide icon name, might need mapping
            description: 'Priority 1: Complex evacuation required.'
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
