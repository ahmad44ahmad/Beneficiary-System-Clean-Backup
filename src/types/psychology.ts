export interface MentalStatusExam {
    appearance: string;
    behavior: 'Cooperative' | 'Agitated' | 'Withdrawn' | 'Aggressive';
    mood: 'Euthymic' | 'Depressed' | 'Anxious' | 'Euphoric';
    affect: 'Congruent' | 'Flat' | 'Labile';
    thoughtProcess: 'Linear' | 'Tangential' | 'Flight of Ideas';
    perceptualDisturbances: boolean; // Hallucinations
    cognition: {
        orientation: number; // /10
        memory: string;
        attention: string;
    };
}

export interface IQTestResult {
    testName: string; // e.g., "Stanford-Binet", "WISC"
    date: string;
    fullScaleIQ: number;
    verbalIQ?: number;
    performanceIQ?: number;
    classification: string; // e.g., "Moderate Intellectual Disability"
}

export interface PsychologyAssessment {
    id: string;
    beneficiaryId: string;
    assessmentDate: string;
    psychologistName: string;

    mentalStatus: MentalStatusExam;
    iqTests: IQTestResult[];

    behavioralIssues: string[];
    diagnosis: string; // DSM-5 code or description

    treatmentPlan: {
        goals: string[];
        interventions: string[]; // e.g., "CBT", "Behavior Modification"
    };
}

export interface BehaviorIncident {
    id: string;
    beneficiaryId: string;
    date: string;
    time: string;
    antecedent: string; // What happened before
    behavior: string;   // What happened
    consequence: string;// What happened after
    intensity: 'Mild' | 'Moderate' | 'Severe';
    duration: string;
}
