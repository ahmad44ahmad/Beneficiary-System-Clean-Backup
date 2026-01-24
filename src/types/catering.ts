export interface Meal {
    id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    meal_name: string;
    description?: string;
    calories?: number;
    scheduled_date: string;
    scheduled_time: string;
    status: 'scheduled' | 'served' | 'cancelled';
    served_count: number;
    notes?: string;
    created_at: string;
    created_by?: string;
}

export interface CateringViolation {
    id: string;
    violation_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location?: string;
    image_url?: string;
    reported_by?: string;
    reported_at: string;
    status: 'open' | 'investigating' | 'resolved' | 'escalated';
    resolved_at?: string;
    resolved_by?: string;
    resolution_notes?: string;
    contractor_id?: string;
}

export interface QualityCheck {
    id: string;
    check_date: string;
    shift: 'morning' | 'evening' | 'night';
    inspector_id?: string;
    checklist: { item: string; passed: boolean }[];
    score?: number;
    notes?: string;
    created_at: string;
}
