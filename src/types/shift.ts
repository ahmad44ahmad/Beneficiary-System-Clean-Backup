export type ShiftCategory = 'critical' | 'medication' | 'care' | 'pending';
export type ShiftPriority = 'high' | 'medium' | 'low';
export type ShiftType = 'morning' | 'evening' | 'night';

export interface ShiftHandoverItem {
    id: string;
    category: ShiftCategory;
    title: string;
    description: string;
    beneficiary_id?: string;
    beneficiaryName?: string; // Populated from join
    priority: ShiftPriority;
    shift_type: ShiftType;
    status: 'active' | 'completed';
    created_at: string;
    created_by: string;
}

export interface ShiftSummary {
    shiftType: ShiftType;
    startTime: string;
    endTime: string;
    staffName: string;
    totalBeneficiaries: number;
    medicationsGiven: number;
    incidentsReported: number;
    assessmentsCompleted: number;
}
