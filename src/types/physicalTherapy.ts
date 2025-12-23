export interface SkeletalAlignment {
    headAndNeck: 'Normal' | 'Tilted' | 'Rotated';
    shoulders: 'Level' | 'Uneven' | 'Protracted';
    spine: 'Normal' | 'Scoliosis' | 'Kyphosis' | 'Lordosis';
    pelvis: 'Level' | 'Tilted' | 'Rotated';
    knees: 'Normal' | 'Valgus' | 'Varus' | 'Hyperextension';
    feet: 'Normal' | 'Flat' | 'Club';
}

export interface RangeOfMotion {
    joint: string;
    left: number; // degrees
    right: number; // degrees
    normal: number; // reference
    limitation: boolean;
}

export interface MotorFunction {
    rolling: 'Independent' | 'Assist' | 'Dependent';
    sitting: 'Independent' | 'Assist' | 'Dependent';
    crawling: 'Independent' | 'Assist' | 'Dependent';
    standing: 'Independent' | 'Assist' | 'Dependent';
    walking: 'Independent' | 'Assist' | 'Dependent';
    running: 'Normal' | 'Impaired' | 'Unable';
    jumping: 'Normal' | 'Impaired' | 'Unable';
}

export interface PhysicalTherapyAssessment {
    id: string;
    beneficiaryId: string;
    assessmentDate: string;
    therapistName: string;

    // Skeletal Alignment
    alignment: SkeletalAlignment;

    // ROM
    romChecks: RangeOfMotion[];

    // Muscle Tone (Modified Ashworth Scale)
    muscleTone: {
        upperExtremities: number; // 0-4
        lowerExtremities: number; // 0-4
    };

    // Gross Motor Function
    motorFunctions: MotorFunction;

    // Balance & Coordination
    balance: {
        static: 'Good' | 'Fair' | 'Poor';
        dynamic: 'Good' | 'Fair' | 'Poor';
    };

    // Plan
    goals: string[];
    frequency: string; // e.g. "3x/week"
}

export interface PTProgressNote {
    id: string;
    beneficiaryId: string;
    date: string;
    therapistName: string;
    sessionType: 'Individual' | 'Group';
    activities: string[];
    response: 'Cooperative' | 'Resistant' | 'Passive';
    notes: string;
}
