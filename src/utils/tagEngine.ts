import { UnifiedBeneficiaryProfile, SmartTag } from '../types/unified';

// =============================================================================
// TAG CONFIGURATION REGISTRY
// =============================================================================
// Each tag rule defines: what to match, and what tag to produce.
// This declarative approach makes it easy to add, remove, or modify tags.

type TagColor = 'red' | 'orange' | 'blue' | 'purple' | 'gray';

interface TagDefinition {
    id: string;
    label: string;
    color: TagColor;
    icon: string;
    description?: string;
}

interface TextMatchRule {
    type: 'text-match';
    fields: ('diagnosis' | 'notes' | 'psychiatricDiagnosis' | 'socialStatus' | 'guardianRelation')[];
    keywords: string[];
    tag: TagDefinition;
}

interface ProfileFieldRule {
    type: 'profile-field';
    condition: (profile: UnifiedBeneficiaryProfile) => boolean;
    tag: TagDefinition;
}

interface InfectionRule {
    type: 'infection';
    keywords: string[];
    isolationType: 'contact' | 'airborne' | 'droplet';
    tag: Omit<TagDefinition, 'id' | 'description'>;
}

type TagRule = TextMatchRule | ProfileFieldRule | InfectionRule;

// =============================================================================
// TAG RULES REGISTRY
// =============================================================================

const TAG_RULES: TagRule[] = [
    // --- Social Status Tags ---
    {
        type: 'text-match',
        fields: ['guardianRelation', 'socialStatus'],
        keywords: ['State Ward', 'يتيم', 'تحت رعاية الدولة'],
        tag: {
            id: 'orphan',
            label: 'Orphan / State Ward',
            color: 'purple',
            icon: 'Baby',
            description: 'Beneficiary is a ward of the state or orphan.'
        }
    },
    {
        type: 'text-match',
        fields: ['socialStatus'],
        keywords: ['فقير', 'دخل محدود'],
        tag: {
            id: 'low-income',
            label: 'Low Income',
            color: 'gray',
            icon: 'Wallet'
        }
    },

    // --- Medical Tags ---
    {
        type: 'text-match',
        fields: ['diagnosis'],
        keywords: ['diabetes', 'سكري'],
        tag: {
            id: 'diabetic',
            label: 'Diabetic',
            color: 'red',
            icon: 'Activity',
            description: 'Requires insulin or sugar monitoring.'
        }
    },
    {
        type: 'text-match',
        fields: ['diagnosis'],
        keywords: ['epilepsy', 'seizure', 'صرع'],
        tag: {
            id: 'epilepsy',
            label: 'Epilepsy Risk',
            color: 'orange',
            icon: 'Zap',
            description: 'History of seizures.'
        }
    },
    {
        type: 'text-match',
        fields: ['diagnosis'],
        keywords: ['cp', 'cerebral palsy', 'شلل'],
        tag: {
            id: 'mobility',
            label: 'Mobility Assistance',
            color: 'blue',
            icon: 'Accessibility',
            description: 'Requires wheelchair or assistance moving.'
        }
    },
    {
        type: 'profile-field',
        condition: (profile) => profile.medicalProfile?.infectionStatus?.isolationRecommended === true,
        tag: {
            id: 'isolation',
            label: 'ISOLATION PROTOCOL',
            color: 'red',
            icon: 'ShieldAlert',
            description: 'Active infection risk. PPE required.'
        }
    },

    // --- Behavioral Tags ---
    {
        type: 'text-match',
        fields: ['diagnosis', 'notes', 'psychiatricDiagnosis'],
        keywords: ['aggressive', 'عدواني'],
        tag: {
            id: 'aggressive',
            label: 'Behavioral Risk',
            color: 'red',
            icon: 'AlertTriangle',
            description: 'History of aggression. Approach with caution.'
        }
    },
    {
        type: 'text-match',
        fields: ['diagnosis'],
        keywords: ['autism', 'توحد'],
        tag: {
            id: 'autism',
            label: 'Autism Spectrum',
            color: 'blue',
            icon: 'Puzzle'
        }
    },

    // --- Age/Demographic Tags ---
    {
        type: 'profile-field',
        condition: (profile) => profile.age >= 60,
        tag: {
            id: 'elderly',
            label: 'Elderly Care',
            color: 'gray',
            icon: 'UserPlus'
        }
    },

    // --- Infection Control Tags ---
    {
        type: 'infection',
        keywords: ['scabies', 'جرب'],
        isolationType: 'contact',
        tag: { label: 'Contact Isolation (Scabies)', icon: 'ShieldAlert', color: 'red' }
    },
    {
        type: 'infection',
        keywords: ['tuberculosis', 'سل'],
        isolationType: 'airborne',
        tag: { label: 'Airborne Isolation (TB)', icon: 'Wind', color: 'red' }
    },
    {
        type: 'infection',
        keywords: ['flu', 'أنفلونزا'],
        isolationType: 'droplet',
        tag: { label: 'Droplet Isolation (Flu)', icon: 'CloudRain', color: 'orange' }
    },
    {
        type: 'infection',
        keywords: ['corona', 'كورونا'],
        isolationType: 'droplet',
        tag: { label: 'Droplet Isolation (COVID-19)', icon: 'Virus', color: 'red' }
    },

    // --- Evacuation Priority Tags ---
    {
        type: 'text-match',
        fields: ['diagnosis', 'notes'],
        keywords: ['bedridden', 'طريح فراش'],
        tag: {
            id: 'evac-stretcher',
            label: 'Evac: Stretcher Only',
            color: 'red',
            icon: 'Stretcher',
            description: 'Priority 1: Complex evacuation required.'
        }
    },
    {
        type: 'text-match',
        fields: ['diagnosis', 'notes'],
        keywords: ['wheelchair', 'مقعد'],
        tag: {
            id: 'evac-assist',
            label: 'Evac: Assist Required',
            color: 'orange',
            icon: 'AlertCircle',
            description: 'Priority 2: Needs wheelchair assistance.'
        }
    }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extracts text content from a profile field for matching
 */
function getFieldValue(
    profile: UnifiedBeneficiaryProfile,
    field: TextMatchRule['fields'][number]
): string {
    switch (field) {
        case 'diagnosis':
            return profile.medicalDiagnosis ?? '';
        case 'notes':
            return profile.notes ?? '';
        case 'psychiatricDiagnosis':
            return profile.psychiatricDiagnosis ?? '';
        case 'socialStatus':
            return profile.socialStatus ?? '';
        case 'guardianRelation':
            return profile.guardianRelation ?? '';
        default:
            return '';
    }
}

/**
 * Checks if any keyword matches any of the specified fields
 */
function matchesKeywords(
    profile: UnifiedBeneficiaryProfile,
    fields: TextMatchRule['fields'],
    keywords: string[]
): boolean {
    return fields.some(field => {
        const value = getFieldValue(profile, field).toLowerCase();
        return keywords.some(keyword => value.includes(keyword.toLowerCase()));
    });
}

/**
 * Processes a text-match rule and returns the tag if matched
 */
function processTextMatchRule(
    profile: UnifiedBeneficiaryProfile,
    rule: TextMatchRule
): SmartTag | null {
    if (matchesKeywords(profile, rule.fields, rule.keywords)) {
        return rule.tag;
    }
    return null;
}

/**
 * Processes a profile-field rule and returns the tag if condition is met
 */
function processProfileFieldRule(
    profile: UnifiedBeneficiaryProfile,
    rule: ProfileFieldRule
): SmartTag | null {
    if (rule.condition(profile)) {
        return rule.tag;
    }
    return null;
}

/**
 * Processes an infection rule and returns the tag if matched
 */
function processInfectionRule(
    profile: UnifiedBeneficiaryProfile,
    rule: InfectionRule
): SmartTag | null {
    const diagnosis = (profile.medicalDiagnosis ?? '').toLowerCase();
    const notes = (profile.notes ?? '').toLowerCase();

    const hasMatch = rule.keywords.some(
        keyword => diagnosis.includes(keyword) || notes.includes(keyword)
    );

    if (hasMatch) {
        return {
            id: `isolation-${rule.isolationType}`,
            label: rule.tag.label,
            color: rule.tag.color,
            icon: rule.tag.icon,
            description: `Requires ${rule.isolationType} precautions. Check Global Alerts.`
        };
    }
    return null;
}

// =============================================================================
// MAIN EXPORT FUNCTIONS
// =============================================================================

/**
 * Derives smart tags from a beneficiary profile based on configured rules.
 * Uses a declarative rule-based system for easy maintenance and extension.
 */
export const deriveSmartTags = (profile: UnifiedBeneficiaryProfile): SmartTag[] => {
    const tags: SmartTag[] = [];
    const addedTagIds = new Set<string>();

    // Handle evacuation priority ordering (stretcher takes precedence over wheelchair)
    let hasStretcherTag = false;

    for (const rule of TAG_RULES) {
        let tag: SmartTag | null = null;

        switch (rule.type) {
            case 'text-match':
                tag = processTextMatchRule(profile, rule);
                break;
            case 'profile-field':
                tag = processProfileFieldRule(profile, rule);
                break;
            case 'infection':
                tag = processInfectionRule(profile, rule);
                break;
        }

        if (tag && !addedTagIds.has(tag.id)) {
            // Special handling: evac-stretcher takes precedence over evac-assist
            if (tag.id === 'evac-stretcher') {
                hasStretcherTag = true;
            }
            if (tag.id === 'evac-assist' && hasStretcherTag) {
                continue; // Skip wheelchair assist if stretcher is already required
            }

            addedTagIds.add(tag.id);
            tags.push(tag);
        }
    }

    return tags;
};

/**
 * Calculates overall risk level based on derived tags.
 * Risk levels: critical > high > medium > low
 */
export const calculateRiskLevel = (tags: SmartTag[]): 'low' | 'medium' | 'high' | 'critical' => {
    const tagIds = new Set(tags.map(t => t.id));

    if (tagIds.has('isolation')) {
        return 'critical';
    }
    if (tagIds.has('aggressive') || tagIds.has('epilepsy')) {
        return 'high';
    }
    if (tagIds.has('diabetic') || tagIds.has('mobility')) {
        return 'medium';
    }
    return 'low';
};
