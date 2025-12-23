// Rehabilitation Domain Types

export type GoalType = 'medical' | 'social' | 'psychological' | 'physiotherapy' | 'occupational';

export interface SmartGoal {
    id: string;
    type: GoalType;
    title: string; // Specific
    description?: string;
    measureOfSuccess: string; // Measurable criteria
    targetDate: string; // Time-bound
    progress: number; // 0-100% (ISO 9001 Measurability)
    status: 'pending' | 'in_progress' | 'achieved' | 'delayed';
    assignedTo: string; // Specialist Name/ID
}

export interface Intervention {
    id: string;
    goalId: string;
    activity: string;
    frequency: string;
    duration: string;
    responsible: string;
}

export interface PlanApproval {
    role: 'doctor' | 'social_worker' | 'director';
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    date?: string; // Compatibility with legacy data
    notes?: string;
}

export interface RehabPlan {
    id: string;
    beneficiaryId: string;
    beneficiaryName: string;
    startDate: string;
    endDate: string;

    // Context (The "Why" - Fused Data)
    medicalContext: {
        diagnosis: string;
        needs: string[]; // e.g., "Wheelchair", "Hearing Aid"
    };
    socialContext: {
        economicStatus: string;
        riskLevel: 'low' | 'medium' | 'high';
    };

    // The "What"
    goals: SmartGoal[];

    // Governance
    approvals: PlanApproval[];
    status: 'draft' | 'active' | 'completed' | 'archived';
}
