export interface ToothStatus {
    number: number; // 1-32 (Universal Numbering System)
    status: 'Healthy' | 'Decayed' | 'Missing' | 'Filled' | 'Crown';
    notes?: string;
}

export interface DentalAssessment {
    id: string;
    beneficiaryId: string;
    date: string;
    dentistName: string;

    // Odontogram Data
    teeth: ToothStatus[];

    // Gingival Health
    gumHealth: 'Healthy' | 'Gingivitis' | 'Periodontitis';
    bleedingOnProbing: boolean;

    // Hygiene
    plaqueIndex: 'Low' | 'Moderate' | 'Heavy';
    calculusIndex: 'Low' | 'Moderate' | 'Heavy';

    recommendations: string[]; // e.g., "Cleaning", "Extraction", "Filling"
    nextVisitDate: string;
}

export interface HygieneLog {
    date: string; // YYYY-MM-DD
    morningBrush: boolean;
    eveningBrush: boolean;
    notes?: string;
}
