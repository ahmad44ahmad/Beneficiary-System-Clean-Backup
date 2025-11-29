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

export interface VisitLog {
    id: string;
    beneficiaryId: string;
    type: 'internal' | 'external' | 'phone' | 'behavioral' | 'emergency';
    date: string;
    time: string;
    visitorName?: string;
    relation?: string;
    notes: string;
    employeeName: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    size: string;
    quantity: number;
    category: 'clothing' | 'hygiene' | 'other';
    imageUrl?: string;
}

export interface ClothingRequestItem {
    itemId: string;
    quantity: number;
}

export interface ClothingRequest {
    id: string;
    beneficiaryId: string;
    type: 'summer' | 'winter' | 'eid' | 'other';
    requestDate: string;
    items: ClothingRequestItem[];
    receiverName: string;
    status: 'pending' | 'approved' | 'rejected' | 'delivered';
    signature?: string;
}

export interface CaseStudy {
    id: string;
    beneficiaryId: string;
    beneficiaryName: string;
    beneficiaryAge: number;
    medicalDiagnosis: string;
    interviewDate: string;
    interviewLocation: string;
    interviewDuration: string;
    interviewParties: string;
    interviewResults: string;
    housingType: string;
    homeOwnership: string;
    professionalStatus: string;
    reasonForNotWorking: string;
    familyIncomeDetails: string;
    socialResearchSummary: string;
    recommendations: string;
}

export interface SocialResearch {
    id: string;
    beneficiaryId: string;
    beneficiaryName: string;
    researchDate: string;
    researcherName: string;
    guardianName: string;
    guardianGender: string;
    guardianAge: string;
    guardianRelation: string;
    guardianEducation: string;
    guardianProfession: string;
    isFatherAlive: 'yes' | 'no' | 'unknown';
    isMotherAlive: 'yes' | 'no' | 'unknown';
    guardianMobile: string;
    familyComposition: string;
    disabilityCause: string;
    hasChronicIllness: 'yes' | 'no';
    chronicIllnessDetails: string;
    familyAdaptation: string;
    socialResearchSummary: string;
}

export interface MedicalExamination {
    id: string;
    beneficiaryId: string;
    beneficiaryName: string;
    date: string;
    doctorName: string;
    diagnosis: string;
    vitalSigns: {
        bloodPressure: string;
        pulse: string;
        temperature: string;
        respiration: string;
    };
    physicalExamNotes: string;
    recommendations: string;
}

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

// Group 1: Individual Educational Plan (IEP) - Model 9 & 46
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

// Group 2: Injury Report - Model 17
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

// Group 3: Family Case Study - Model 29
export interface FamilyCaseStudy {
    id: string;
    beneficiaryId: string;
    studyDate: string;
    socialWorkerName: string;
    familyStructure: string; // Details about parents, siblings
    economicStatus: string;
    housingCondition: string;
    familyRelationships: string;
    attitudeTowardsBeneficiary: string;
    challenges: string;
    recommendations: string;
}

// Group 4: Social Activities - Model 1, 2, 3
export interface SocialActivityPlan {
    id: string;
    year: string;
    centerName: string;
    activityType: string;
    supervisor: string;
    generalGoal: string;
    detailedGoals: string;
    targetGroup: 'employees' | 'external' | 'both';
    isLinkedToCoreGoals: boolean;
    isLinkedToOperationalPlan: boolean;
    supportSource: 'budget' | 'extra' | 'none';
    cost: string;
    expectedOutputs: string;
    executionTimeStart: string;
    executionTimeEnd: string;
}

export interface SocialActivityDocumentation {
    id: string;
    activityName: string;
    date: string;
    type: string;
    supervisor: string;
    internalParticipants: { name: string; job: string; task: string }[];
    externalParticipants: { name: string; job: string; task: string }[];
    approvalHead: boolean;
    approvalSupervisor: boolean;
    approvalDirector: boolean;
}

export interface SocialActivityFollowUp {
    id: string;
    month: string;
    activityName: string;
    type: string;
    date: string;
    responsiblePerson: string;
    status: 'achieved' | 'not_achieved';
    notes: string;
}

// Group 5: Training & Rehabilitation - Model 4, 6, 11
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

// Group 6: Family Guidance - Model 25, 26, 27, 28, 30
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

export interface FamilyGuidancePlan {
    id: string;
    beneficiaryId: string;
    phases: {
        phaseName: string; // Planning, Execution, Transition, Follow-up
        executionTimeStart: string;
        executionTimeEnd: string;
        expectedOutputs: string;
        steps: string;
    }[];
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

export interface FamilyGuidanceReport {
    id: string;
    month: string;
    achievements: {
        trainedCases: number;
        followUpVisits: number;
        interviews: number;
        calls: number;
        employedCases: number;
        programs: number;
        transferredCases: number;
    };
    notes: string;
}

export interface FamilyGuidanceEvaluation {
    id: string;
    period: string;
    satisfactionRate: number;
    followUpRate: number;
    integrationRate: number;
    programsRate: number;
    interviewsRate: number;
    initiativesRate: number;
    totalScore: number;
}

// Clothing Management Types

export type ClothingSeason = 'summer' | 'winter' | 'eid_fitr' | 'eid_adha';

export interface ClothingItemEntry {
    itemName: string;
    size?: string;
    quantity: number;
    notes?: string;
    // For Inventory (Model 1)
    damagedCount?: number;
    replacementCount?: number;
    reason?: string;
    // For Discard (Model 8, 9, 11)
    damageType?: string;
}

// Model 1: Wardrobe Inventory
export interface WardrobeInventory {
    id: string;
    beneficiaryId: string;
    year: string;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    date: string;
    socialSupervisor: string;
    servicesSupervisor: string;
}

// Model 2 & 3: Needs Assessment
export interface ClothingNeeds {
    id: string;
    beneficiaryId?: string; // Optional if aggregate
    gender: 'male' | 'female';
    year: string;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    notes: string;
    status: 'draft' | 'approved';
}

// Model 4: Procurement Record
export interface ClothingProcurement {
    id: string;
    date: string;
    invoiceNumber: string;
    items: {
        item: string;
        quantity: number;
        invoiceNo: string;
        amount: number;
    }[];
    totalAmount: number;
    committeeMembers: string[];
}

// Model 5: Warehouse Receipt
export interface ClothingWarehouseReceipt {
    id: string;
    year: string;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    invoiceImage?: string; // Placeholder for file path
    warehouseKeeper: string;
}

// Model 6 & 7: Additional Dispensation
export interface ClothingDispensation {
    id: string;
    beneficiaryId: string;
    date: string;
    year: string;
    season: ClothingSeason;
    items: ClothingItemEntry[];
    receiverName: string;
    notes: string;
}

// Model 8, 9, 11: Discard/Destruction
export interface ClothingDiscard {
    id: string;
    type: 'individual_handover' | 'monthly_inventory' | 'destruction'; // Model 8, 9, 11
    date: string;
    year: string;
    season?: ClothingSeason;
    items: ClothingItemEntry[];
    notes: string;
}

// Model 10: Warehouse Inventory
export interface WarehouseInventory {
    id: string;
    date: string;
    items: ClothingItemEntry[];
    warehouseKeeper: string;
    custodian: string;
    director: string;
}

// Model 12: Committee Formation
export interface ClothingCommittee {
    id: string;
    year: string;
    formationDate: string;
    members: {
        name: string;
        role: string;
        jobTitle: string;
    }[];
    tasks: string[];
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
