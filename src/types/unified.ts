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
}
