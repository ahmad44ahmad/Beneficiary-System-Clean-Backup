export * from './medical';
export * from './social';
export * from './assets';
export * from './rehab';
export * from './quality'; // Export Quality types
export * from './unified';
export * from './secretariat'; // Export Secretariat types
export * from './dignity-profile'; // Export Dignity Profile types
export * from './support'; // Export Support types

import { SocialResearch } from './social';
import { MedicalExamination } from './medical';

// Core Types
export interface Beneficiary {
    id: string; // UUID from Supabase
    nationalId?: string; // The "Golden Key" for unification - Optional for legacy data
    fullName: string;
    roomNumber?: string;
    bedNumber?: string;
    nationality?: string;
    gender?: string;
    dob?: string;
    age?: number;
    enrollmentDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    guardianPhone?: string;
    guardianResidence?: string;
    visitFrequency?: string;
    lastVisitDate?: string;
    socialStatus?: string;
    medicalDiagnosis?: string;
    psychiatricDiagnosis?: string;
    iqLevel?: string;
    iqScore?: string;
    notes?: string;
    status?: 'active' | 'discharged' | 'deceased' | 'transferred';
}

// [NEW] The Unified "Master Record" that bridges all islands
export interface MasterRecord extends Beneficiary {
    medicalHistory: MedicalExamination[];
    socialResearch: SocialResearch[];
    rehabPlans: RehabilitationPlan[];
    incidents: IncidentReport[];
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
    // Extended fields for specific forms
    size?: string;
    amount?: number;
    invoiceNo?: string;
    damagedCount?: number;
    replacementCount?: number;
    reason?: string;
}

export interface WardrobeInventory {
    id: string;
    beneficiaryId: string;
    date: string;
    year: number;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    notes?: string;
    socialSupervisor?: string;
    servicesSupervisor?: string;
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
    committeeMembers?: string[];
}

// ... (Keep other shared types if any, or move them to specific domains later)

export interface RehabTeamMember {
    name: string;
    specialization: string;
}

export interface RehabMedication {
    id?: string;
    name: string;
    dosage: string;
    frequency?: string;
    startDate?: string;
    endDate?: string;
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
    status?: 'active' | 'completed' | 'draft'; // Added for compatibility
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
    referralDateHijri?: string; // New
    medicalDiagnosis?: string; // from Context
    psychologicalDiagnosis?: string; // from Context

    // Referral Goals (Objectives)
    goals: {
        communityIntegration: boolean; // دمج مجتمعي
        educationalIntegration: boolean; // دمج تعليمي
        returnToFamily: boolean; // عودة للأسرة
        vocationalPrep: boolean; // تهيئة مهنية
        skillDevelopment: boolean; // تطوير مهارات
        talentDevelopment: boolean; // تنمية مواهب
    };

    // Current Performance Level (مستوى الأداء الحالي)
    currentPerformance: {
        selfCare: 'good' | 'average' | 'poor'; // الاعتماد على نفسه قضاء الحاجة
        eating: 'good' | 'average' | 'poor'; // الاعتماد على نفسه في تناول الطعام
        personalHygiene: 'good' | 'average' | 'poor'; // الاعتماد على نفسه في العناية الشخصية

        communication: 'good' | 'average' | 'poor'; // التواصل مع الآخرين
        socialEtiquette: 'good' | 'average' | 'poor'; // معرفة الآداب العامة واحترام الآخرين
        cooperation: 'good' | 'average' | 'poor'; // يشارك ويبادر للتعاون مع الآخرين

        discrimination: 'good' | 'average' | 'poor'; // لديه القدرة على التمييز والتصنيف
        toolKnowledge: 'good' | 'average' | 'poor'; // لديه حصيلة معرفية للأدوات حوله
        instructionAcceptance: 'good' | 'average' | 'poor'; // يتقبل الأوامر والتوجيهات
        spatialTemporalAwareness: 'good' | 'average' | 'poor'; // يدرك المكان والزمان
        namesAwareness: 'good' | 'average' | 'poor'; // يدرك أسماء المحيطين حوله
        dangerAwareness: 'good' | 'average' | 'poor'; // يدرك المخاطر ويبتعد عنها
        writingAbility: 'good' | 'average' | 'poor'; // يمسك القلم ويحاول الكتابة
        concentration: 'good' | 'average' | 'poor'; // مستوى التركيز والانتباه لديه
    };

    specialistName?: string;
    trainerName?: string;
    supervisorName?: string;
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

// Case Study & Social Research
export interface CaseStudy {
    id: string;
    beneficiaryId: string;
    beneficiaryName?: string;
    beneficiaryAge?: number;
    medicalDiagnosis?: string;
    date?: string;
    researcherName?: string;

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



export interface VisitLog {
    id: string;
    beneficiaryId: string;
    type: 'internal' | 'behavioral' | 'emergency' | 'external' | 'phone';
    date: string;
    time: string;
    visitorName?: string;
    relation?: string;
    notes: string;
    employeeName: string;
}



export interface FamilyCaseStudy {
    id: string;
    beneficiaryId: string;
    date?: string;
    studyDate?: string; // New
    researcherName?: string;
    socialWorkerName?: string; // New

    familyComposition?: string;
    familyStructure?: string; // Added
    familyRelationships?: string; // Added
    attitudeTowardsBeneficiary?: string; // Added
    economicStatus?: string;
    housingStatus?: string;
    housingCondition?: string; // Added
    socialStatus?: string;
    healthStatus?: string;
    problems?: string;
    challenges?: string; // Added
    goals?: string;
    plan?: string;
    recommendations?: string;
}

export interface SocialActivityPlan {
    id: string;
    year: number; // Added year
    activityType: string; // was activityName, mapped to 'اسم النشاط' but better typed
    supervisor: string; // المشرف
    executionTimeStart: string; // وقت التنفيذ (من)
    executionTimeEnd: string; // وقت التنفيذ (إلى) - often a range or specific date
    targetGroup?: string; // الفئة المستهدفة
    cost?: number; // التكلفة المالية
    location?: string; // مكان التنفيذ
    notes?: string;
}

export interface SocialActivityDocumentation {
    id: string;
    date: string;
    activityName: string;
    type: string; // نوع النشاط
    supervisor: string;
    objectives?: string; // أهداف النشاط
    implementationProcedure?: string; // إجراءات التنفيذ
    budget?: number; // الميزانية
    outcomes?: string; // المخرجات

    internalParticipants?: string[]; // Beneficiary IDs
    externalParticipants?: string[]; // Names/Count

    images?: string[]; // URLs for photos
    notes?: string;
}

export interface SocialActivityFollowUp {
    id: string;
    month: string; // الشهر
    activityName: string;
    date: string;
    responsiblePerson: string; // المسؤول
    status: 'achieved' | 'not_achieved'; // الانجاز
    observations?: string; // الملاحظات
    recommendations?: string; // moved from 'recommendations'
}
