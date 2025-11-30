export * from './medical';
export * from './social';
export * from './assets';
export * from './rehab';
export * from './quality'; // Export Quality types

// Core Types
export interface Beneficiary {
    id: string;
    fullName: string;
    nationalId?: string;
    roomNumber?: string;
    bedNumber?: string;
    nationality: string;
    gender: string;
    dob: string;
    age: number;
    enrollmentDate: string;
    guardianName?: string;
    guardianRelation: string;
    guardianPhone: string;
    guardianResidence: string;
    visitFrequency: string;
    lastVisitDate: string;
    socialStatus: string;
    medicalDiagnosis: string;
    psychiatricDiagnosis?: string;
    iqLevel: string;
    iqScore: string;
    notes: string;
    status?: 'active' | 'exit';
}

// Inventory & Clothing Types
export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    size: string;
    quantity: number;
    minQuantity: number;
    lastUpdated: string;
}

export interface ClothingRequestItem {
    itemId: string;
    quantity: number;
}

export type ClothingSeason = 'summer' | 'winter' | 'eid' | 'other';

export interface ClothingRequest {
    id: string;
    beneficiaryId: string;
    requestDate: string;
    type: ClothingSeason;
    items: ClothingRequestItem[];
    status: 'pending' | 'approved' | 'rejected' | 'dispensed';
    notes?: string;
    receiverName?: string;
    signature?: string;
}

export interface ClothingItemEntry {
    itemId: string;
    quantity: number;
    notes?: string;
}

export interface WardrobeInventory {
    id: string;
    beneficiaryId: string;
    date: string;
    year: number;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    notes?: string;
}

export interface ClothingNeeds {
    id: string;
    year: number;
    season: ClothingSeason;
    gender: 'male' | 'female';
    items: ClothingItemEntry[];
    status: 'draft' | 'approved';
    notes?: string;
}

export interface ClothingDispensation {
    id: string;
    beneficiaryId: string;
    date: string;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    receiverName: string;
    notes?: string;
}

export interface ClothingProcurement {
    id: string;
    date: string;
    invoiceNumber?: string;
    items: ClothingItemEntry[];
    totalAmount: number;
    notes?: string;
}

// ... (Keep other shared types if any, or move them to specific domains later)

export interface RehabTeamMember {
    name: string;
    specialization: string;
}

export interface RehabMedication {
    name: string;
    dosage: string;
}

export interface TherapyPlanItem {
    need: string;
    method: string;
    duration: string;
    sessionsPerWeek: string;
}

export interface RehabilitationPlan {
    id: string;
    beneficiaryId: string;
    planDate: string;
    teamMembers: RehabTeamMember[];
    servicesSchedule: string;
    medicalInfo: {
        weight: string;
        height: string;
        appetite: string;
        digestiveIssues: string;
        hasBloodPressure: boolean;
        hasDiabetes: boolean;
        hasAnemia: boolean;
        hasHeartDisease: boolean;
        otherChronicDetails: string;
        hasVisionProblems: boolean;
        visionProblemsDetails: string;
        hasHearingProblems: boolean;
        hearingProblemsDetails: string;
        hasSurgeryHistory: boolean;
        surgeryHistoryDetails: string;
        hasEpilepsy: boolean;
        epilepsyDetails: string;
        medicalDescription: string;
        generalHealthStatus: string;
        recommendations: string;
        medications: RehabMedication[];
        doctorName: string;
    };
    occupationalTherapy: {
        caseDescription: string;
        plan: TherapyPlanItem[];
        therapistName: string;
    };
}

export interface IndividualEducationalPlan {
    id: string;
    beneficiaryId: string;
    planDate: string;
    teacherName: string;
    currentPerformanceLevel: string;
    longTermGoals: string[];
    shortTermGoals: {
        goal: string;
        criteria: string;
        evaluationMethod: string;
        targetDate: string;
    }[];
    evaluation: string;
}

export interface InjuryReport {
    id: string;
    beneficiaryId: string;
    date: string;
    time: string;
    location: string;
    injuryType: string;
    description: string;
    firstAidGiven: string;
    takenToHospital: boolean;
    witnesses: string;
    supervisorName: string;
}

export interface TrainingReferral {
    id: string;
    beneficiaryId: string;
    referralDate: string;
    goals: {
        educationalIntegration: boolean;
        socialIntegration: boolean;
        returnToFamily: boolean;
        vocationalPrep: boolean;
        skillDevelopment: boolean;
        talentDevelopment: boolean;
    };
    currentPerformance: {
        selfCare: string;
        socialSkills: string;
        cognitiveSkills: string;
        motorSkills: string;
    };
    notes: string;
}

export interface TrainingPlanFollowUp {
    id: string;
    beneficiaryId: string;
    month: string;
    teamMembers: string[];
    skills: {
        domain: string;
        skillName: string;
        status: 'mastered' | 'with_help' | 'not_mastered';
    }[];
    notes: string;
}

export interface VocationalEvaluation {
    id: string;
    beneficiaryId: string;
    profession: string;
    evaluatorName: string;
    date: string;
    scores: {
        enthusiasm: number;
        responsibility: number;
        communication: number;
        behavior: number;
        resourcefulness: number;
        relationshipWithSuperiors: number;
        acceptingDirections: number;
        executionSkill: number;
        overcomingDifficulties: number;
        timeliness: number;
        attendance: number;
        futurePotential: number;
    };
    totalScore: number;
}

export interface FamilyGuidanceReferral {
    id: string;
    beneficiaryId: string;
    referralDate: string;
    targetPrograms: string;
    targetDuration: string;
    skills: {
        independence: string;
        cognitive: string;
        social: string;
        vocational: string;
    };
    status: {
        medical: string;
        rehab: string;
        psychological: string;
        nutrition: string;
    };
    familyInteraction: 'interactive' | 'somewhat' | 'not_interactive';
    familyAcceptance: string;
    notes: string;
}

export interface PostCareFollowUp {
    id: string;
    beneficiaryId: string;
    visitDate: string;
    visitPurpose: string;
    familyMembers: string;
    visitTeam: string;
    monthlyFollowUp: {
        month1: string;
        month2: string;
        month3: string;
    };
    notes: string;
}

// Daily Follow-up Record Types
export type ShiftPeriod = 'first' | 'second' | 'third' | 'fourth';
export type GenderSection = 'male' | 'female';

export interface StaffAttendance {
    category: string; // e.g., 'Official', 'Company', 'Security', 'Drivers', 'Kitchen'
    total: number;
    present: number;
    absent: number;
    notes?: string;
}

export interface ServiceStatistics {
    serviceName: string; // e.g., 'Physical Therapy', 'Occupational Therapy'
    totalBeneficiaries: number;
    attended: number;
    absent: number;
}

export interface MealRecord {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack_am' | 'snack_pm' | 'snack_night';
    startTime: string;
    endTime: string;
    items: string;
    supervisors: string;
    diningRoomCount: number;
    roomCount: number;
    didNotEat: string[]; // List of beneficiary names or IDs
    notes?: string;
}

export interface CleaningMaintenance {
    area: 'rooms' | 'bathrooms' | 'corridors' | 'entrances';
    status: 'clean' | 'needs_attention';
    maintenanceRequests: number;
    actionTaken: string;
}

export interface DailyShiftRecord {
    id: string;
    date: string;
    day: string; // e.g., 'Sunday'
    shift: ShiftPeriod;
    section: GenderSection;
    supervisorName: string;
    startTime: string;
    endTime: string;

    // Stats
    beneficiaryStats: {
        total: number;
        internalVisits: number;
        externalVisits: number;
        admissions: number;
        appointments: number;
        emergencies: number;
        deaths: number;
        injuries: number;
        others: string;
    };

    staffAttendance: StaffAttendance[];
    serviceStats: ServiceStatistics[]; // Mainly for Shift 1 & 2

    meals: MealRecord[];

    // Hygiene & Maintenance
    showering?: {
        count: number;
        notBathedReasons: string;
    }; // Shift 1 only
    cleaningMaintenance: CleaningMaintenance[];

    // Statuses
    psychologicalStatus: string;
    socialStatus: string; // Includes rest/sleep periods
    healthStatus: string;
    nursingCare: string;

    // Handover
    handoverTime: string;
    receivingSupervisor: string;
    handingOverSupervisor: string;

    // Department Head Reviews (End of day usually, but fields exist per shift)
    socialHeadReview?: string;
    medicalHeadReview?: string;
    supportHeadReview?: string;
    centerDirectorApproval?: boolean;
}

export interface IncidentReport {
    id: string;
    date: string;
    time: string;
    shift: ShiftPeriod;
    beneficiaryId: string;
    location: string; // Room/Bed
    type: 'injury' | 'assault' | 'neglect' | 'self_harm' | 'suicide_attempt' | 'death' | 'agitation' | 'vandalism' | 'escape' | 'other';
    description: string;
    actionTaken: string;
    cameraRecordingKept: boolean;
    staffWitnesses: {
        name: string;
        role: string;
    }[];
    notes?: string;
}

// Case Study & Social Research (Legacy - to be refactored)
// Case Study & Social Research (Legacy - to be refactored)
export interface CaseStudy {
    id: string;
    beneficiaryId: string;
    beneficiaryName?: string;
    beneficiaryAge?: number;
    medicalDiagnosis?: string;
    date?: string; // Legacy
    researcherName?: string; // Legacy

    // New fields from CaseStudyForm
    interviewDate?: string;
    interviewLocation?: string;
    interviewDuration?: string;
    interviewParties?: string;
    interviewResults?: string;
    housingType?: string;
    homeOwnership?: string;
    professionalStatus?: string;
    reasonForNotWorking?: string;
    familyIncomeDetails?: string;
    socialResearchSummary?: string;

    informantName?: string;
    informantRelation?: string;
    familyStructure?: string;
    economicSituation?: string;
    housingCondition?: string;
    socialRelations?: string;
    problems?: string;
    recommendations?: string;
}

export interface SocialResearch {
    id: string;
    beneficiaryId: string;
    beneficiaryName?: string;
    date?: string; // Legacy
    researcherName: string;

    // New fields from SocialResearchForm
    researchDate?: string;
    guardianName?: string;
    guardianGender?: string;
    guardianAge?: string;
    guardianRelation?: string;
    guardianEducation?: string;
    guardianProfession?: string;
    isFatherAlive?: string;
    isMotherAlive?: string;
    guardianMobile?: string;
    familyComposition?: string;
    disabilityCause?: string;
    hasChronicIllness?: string;
    chronicIllnessDetails?: string;
    familyAdaptation?: string;
    socialResearchSummary?: string;

    reasonForResearch?: string;
    socialHistory?: string;
    familyHistory?: string;
    economicHistory?: string;
    medicalHistory?: string;
    psychologicalHistory?: string;
    educationalHistory?: string;
    currentSituation?: string;
    researcherOpinion?: string;
    recommendations?: string;
}

export interface VisitLog {
    id: string;
    beneficiaryId: string;
    type: 'internal' | 'behavioral' | 'emergency';
    date: string;
    time: string;
    visitorName?: string;
    relation?: string;
    notes: string;
    employeeName: string;
}

export interface MedicalExamination {
    id: string;
    beneficiaryId: string;
    date: string;
    doctorName: string;
    diagnosis: string;
    vitalSigns: {
        bp: string;
        pulse: string;
        temp: string;
        resp: string;
    };
    symptoms: string;
    treatment: string;
    recommendations: string;
}

export interface FamilyCaseStudy {
    id: string;
    beneficiaryId: string;
    date?: string; // Legacy
    studyDate?: string; // New
    researcherName?: string; // Legacy
    socialWorkerName?: string; // New

    familyComposition?: string;
    economicStatus?: string;
    housingStatus?: string;
    socialStatus?: string;
    healthStatus?: string;
    problems?: string;
    goals?: string;
    plan?: string;
    recommendations?: string;
}

export interface SocialActivityPlan {
    id: string;
    beneficiaryId: string;
    date: string;
    activityName: string;
    goals: string;
    procedures: string;
    evaluation: string;
}

export interface SocialActivityDocumentation {
    id: string;
    beneficiaryId: string;
    date: string;
    activityName: string;
    participationLevel: string;
    behavior: string;
    notes: string;
}

export interface SocialActivityFollowUp {
    id: string;
    beneficiaryId: string;
    date: string;
    activityName: string;
    observations: string;
    recommendations: string;
}
