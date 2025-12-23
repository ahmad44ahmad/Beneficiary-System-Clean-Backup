export type LeaveRequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'PENDING_MEDICAL' | 'PENDING_DIRECTOR' | 'APPROVED' | 'REJECTED';
export type LeaveRequestAction = 'Approve' | 'Reject' | 'RequestClarification';

export interface LeaveRequest {
    id: string;
    beneficiaryId: string;
    beneficiaryName?: string;
    requestDate: string;
    type: 'HomeVisit' | 'Hospital' | 'Event' | 'Other';
    startDate: string;
    endDate: string;
    reason: string;
    duration?: string;
    durationDays?: number;
    status: LeaveRequestStatus;
    guardianName: string;
    guardianPhone: string;
    medicalClearance?: {
        clearedBy: string;
        clearedAt: string;
        isFit: boolean;
        precautions?: string;
    };
    history?: any[]; // Added for simplified workflow
}

export interface SocialResearch {
    id: string;
    beneficiaryId: string;
    beneficiaryName?: string;
    date?: string;
    researcherName: string;

    // New fields
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

export interface SocialCaseStudy {
    id: string;
    beneficiaryId: string;
    date: string;
    socialWorkerName: string;

    familyStructure: string;
    financialStatus: string;
    housingCondition: string;
    supportSystem: string;

    recommendations: string[];
}

export interface InventoryItem {
    id: string;
    name: string; // e.g., "Thobe", "Shoes"
    category: 'Clothing' | 'PersonalCare' | 'Bedding';
    size: string;
    quantity: number;
    condition: 'New' | 'Used' | 'Damaged';
    location: string; // e.g., "Warehouse", "Beneficiary Wardrobe"
}

export interface ClothingDistribution {
    id: string;
    beneficiaryId: string;
    date: string;
    season: 'Summer' | 'Winter' | 'Eid';
    items: {
        itemId: string;
        quantity: number;
    }[];
    status: 'Requested' | 'Approved' | 'Delivered';
}

export interface ActivityParticipation {
    id: string;
    beneficiaryId: string;
    activityName: string;
    date: string;
    participationLevel: 'Active' | 'Passive' | 'Refused';
    notes?: string;
}
