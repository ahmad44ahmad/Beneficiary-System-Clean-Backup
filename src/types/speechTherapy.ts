export interface ArticulationScore {
    phoneme: string; // e.g., "b", "m", "f"
    position: 'Initial' | 'Medial' | 'Final';
    status: 'Correct' | 'Substitution' | 'Omission' | 'Distortion';
    details?: string;
}

export interface SwallowingStatus {
    oralPhase: 'Normal' | 'Impaired';
    pharyngealPhase: 'Normal' | 'Impaired';
    esophagealPhase: 'Normal' | 'Impaired';
    aspirationRisk: boolean;
    dietTexture: 'Regular' | 'Soft' | 'Minced' | 'Pureed';
    liquidConsistency: 'Thin' | 'Nectar' | 'Honey' | 'Pudding';
}

export interface SpeechAssessment {
    id: string;
    beneficiaryId: string;
    date: string;
    therapistName: string;

    // Language Development
    receptiveLanguageAge: string;
    expressiveLanguageAge: string;

    // Articulation
    articulationErrors: ArticulationScore[];
    intelligibility: number; // % understandable

    // Swallowing
    swallowing: SwallowingStatus;

    // Orofacial Exam
    lips: 'Normal' | 'Abnormal';
    tongue: 'Normal' | 'Abnormal';
    palate: 'Normal' | 'Abnormal';
    drooling: boolean;

    recommendations: string[];
}
