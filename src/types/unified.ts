import {
    Beneficiary,
    MedicalProfile,
    SocialResearch,
    VisitLog,
    IncidentReport,
    IndividualEducationalPlan
} from './index';
import { MedicalExamination } from './medical';
import { RehabPlan } from './rehab';

export interface SmartTag {
    id: string;
    label: string;
    color: 'red' | 'orange' | 'yellow' | 'blue' | 'green' | 'gray' | 'purple';
    icon?: string; // Icon name from Lucide
    description?: string;
}

export interface UnifiedBeneficiaryProfile extends Beneficiary {
    // Aggregated Data
    medicalProfile?: MedicalProfile;
    socialResearch?: SocialResearch;
    activeRehabPlan?: RehabPlan;
    latestMedicalExam?: MedicalExamination;
    educationalPlan?: IndividualEducationalPlan;

    // Collections (Sorted by date usually)
    visitLogs: VisitLog[];
    incidents: IncidentReport[];
    medicalHistory: MedicalExamination[];

    // Computed/Derived Data
    smartTags: SmartTag[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';

    // Status Flags
    isOrphan: boolean;
    hasChronicCondition: boolean;
    requiresIsolation: boolean;

    // Empowerment Path
    empowermentProfile?: EmpowermentProfile;

    // Risk Management
    risks?: RiskEntry[];

    // Support Services
    clothingRequests?: ClothingRequestEntry[];
    nutritionPlan?: NutritionPlan;

    // Quality
    auditResults?: AuditResultEntry[];
}

export interface RiskEntry {
    id: string;
    category: 'Medical' | 'Behavioral' | 'Environmental' | 'Social';
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigation: string;
    lastReview: string;
}

export interface EmpowermentProfile {
    readinessLevel: 'not_ready' | 'contemplation' | 'preparation' | 'action' | 'maintenance';
    strengths: string[];
    aspirations: string[]; // What they want to become/do
    hobbies: string[];
    skills: string[];
    goals: EmpowermentGoal[];
    currentTracks: SkillTrack[];
}

export interface EmpowermentGoal {
    id: string;
    title: string;
    category: 'education' | 'employment' | 'social_integration' | 'health' | 'skill_development';
    status: 'draft' | 'active' | 'completed' | 'on_hold' | 'cancelled';
    progress: number; // 0-100
    startDate?: string;
    targetDate: string;
    smartCriteria?: {
        specific: string;
        measurable: string;
        achievable: string;
        relevant: string;
        timeBound: string;
    };
}

export interface SkillTrack {
    id: string;
    trackName: string;
    status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
    startDate: string;
    providerName?: string;
}

// Support Services Types
export interface ClothingRequestEntry {
    id: string;
    item: string;
    size: string;
    status: 'pending' | 'approved' | 'delivered' | 'rejected';
    requestDate: string;
    notes?: string;
}

export interface NutritionPlan {
    dietType: 'Regular' | 'Diabetic' | 'Low Sodium' | 'Soft' | 'Liquid';
    allergies: string[];
    restrictions: string[];
    hydrationGoal: string; // e.g. "2L per day"
    lastAssessmentDate: string;
}

// Quality Audit Types
export interface AuditResultEntry {
    id: string;
    auditDate: string;
    auditorName: string;
    score: number; // 0-100
    findings: string[];
    status: 'compliant' | 'non_compliant' | 'needs_improvement';
}
