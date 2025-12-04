export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AuditStatus = 'compliant' | 'non-compliant' | 'pending' | 'partial';

export interface AuditStandard {
    id: string;
    category: string;
    title: string;
    description: string;
    requirement: string;
    weight: RiskLevel;
    clause: string; // ISO Clause reference
}

export interface AuditResult {
    standardId: string;
    status: AuditStatus;
    evidence?: string; // Link or text describing evidence
    notes?: string;
    auditorName: string;
    date: string;
}

export interface QualityAudit {
    id: string;
    date: string;
    auditor: string;
    department: string;
    score: number;
    results: AuditResult[];
    status: 'completed' | 'in-progress';
}

// Legacy types kept for compatibility if needed, or can be refactored later
export type IncidentType = 'injury_beneficiary' | 'injury_staff' | 'near_miss' | 'hazard' | 'property_damage';
export type CAPAStatus = 'open' | 'in_progress' | 'verified' | 'closed';

export interface Incident {
    id: string;
    type: IncidentType;
    date: string;
    time: string;
    location: string;
    description: string;
    reportedBy: string;
    involvedPersons: string; // Names
    immediateAction: string;
    status: 'open' | 'investigating' | 'closed';
}
