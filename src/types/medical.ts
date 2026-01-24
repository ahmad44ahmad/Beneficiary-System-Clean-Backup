import { PhysicalTherapyAssessment } from './physicalTherapy';
import { SpeechAssessment } from './speechTherapy';
import { PsychologyAssessment } from './psychology';
import { DentalAssessment } from './dental';

export interface VitalSigns {
    temperature: number;
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    pulse: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    weight: number;
    height: number;
    bmi: number;
    measuredAt: string; // ISO Date
}

export interface MedicalHistory {
    chronicDiseases: string[];
    surgeries: string[];
    allergies: string[];
    familyHistory: string[];
    seizureHistory?: {
        hasSeizures: boolean;
        lastSeizureDate?: string;
        frequency?: string;
        medication?: string;
    };
}

export interface MedicalProfile {
    id: string;
    beneficiaryId: string;
    admissionDate: string;

    // Diagnosis
    primaryDiagnosis: string; // Was strict union, relaxed for integration
    secondaryDiagnoses: string[];
    bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'; // Added
    isEpileptic: boolean;

    // Current State
    latestVitals: VitalSigns;

    // History
    history: MedicalHistory;

    // Medications
    currentMedications: {
        id?: string;
        name: string;
        dosage: string;
        frequency: string;
        startDate: string;
        endDate?: string;
    }[];

    // Infection Control
    infectionStatus: {
        suspectedInfection: boolean;
        isolationRecommended: boolean;
        isolationReason?: string;
        vaccinationStatus: 'UpToDate' | 'Overdue' | 'Incomplete' | 'Pending';
        lastVaccinationDate?: string;
    };

    // Department Records
    physicalTherapy?: {
        assessments: PhysicalTherapyAssessment[];
    };
    speechTherapy?: {
        assessments: SpeechAssessment[];
    };
    psychology?: {
        assessments: PsychologyAssessment[];
    };
    dental?: {
        assessments: DentalAssessment[];
    };
}


export interface MedicalInventoryItem {
    id: string;
    name: string;
    category: 'Consumable' | 'Equipment' | 'Medication';
    size?: string;
    isSterile: boolean;
    quantity: number;
    minimumStockLevel: number;
    expiryDate?: string;
    batchNumber?: string;
    location: string;
}

export interface VaccinationRecord {
    id: string;
    beneficiaryId: string;
    vaccineName: string;
    dueDate: string;
    status: 'Pending' | 'Completed' | 'Overdue';
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
    symptoms?: string;
    treatment?: string;
    physicalExamNotes: string;
    recommendations: string;
}

// --- NURSING FORMS DIGITIZATION ---

export interface NursingAdmissionAssessment {
    id: string;
    beneficiaryId: string;
    assessmentDate: string;
    assessedBy: string;

    // Vital Signs Record (EHS-001 Page 1)
    vitals: {
        temperature: number;
        pulse: number;
        respiration: number;
        bloodPressure: string; // "120/80"
        o2Saturation: number;
        weight: number;
        height: number;
        bmi: number;
        painScore: number; // 0-10
    };

    // General & Physical (EHS-001 Page 2-3)
    generalAppearance: {
        hygiene: 'Good' | 'Fair' | 'Poor';
        mentalStatus: 'Alert' | 'Confused' | 'Drowsy' | 'Unresponsive';
    };

    physicalSystemReview: {
        heent: string; // Head, Eyes, Ears, Nose, Throat
        respiratory: string;
        cardiovascular: string;
        gastrointestinal: string;
        genitourinary: string;
        musculoskeletal: string; // Deformities, ROM
        integumentary: string; // Skin integrity, wounds
        neurological: string;
    };

    // Functional Assessment (ADLs)
    adls: {
        feeding: 'Independent' | 'Assist' | 'Dependent';
        bathing: 'Independent' | 'Assist' | 'Dependent';
        toileting: 'Independent' | 'Assist' | 'Dependent';
        mobility: 'Independent' | 'Assist' | 'Bedbound';
        transfer: 'Independent' | 'Assist' | 'Hoyer Lift';
    };

    // Risk Assessments
    risks: {
        fallRisk: boolean; // Morse Scale proxy
        pressureUlcerRisk: boolean; // Braden Scale proxy
        aspirationRisk: boolean;
        allergies: string[];
    };
}

export interface NursingCarePlan {
    id: string;
    beneficiaryId: string;
    nursingDiagnosis: string; // NANDA style or plain text
    goals: {
        description: string;
        targetDate: string;
        status: 'Pending' | 'Met' | 'Partially Met' | 'Not Met';
    }[];
    interventions: string[];
    evaluation: string;
    createdAt: string;
    updatedAt: string;
}

export interface NursingProgressNote {
    id: string;
    beneficiaryId: string;
    shift: 'Day' | 'Evening' | 'Night';
    timestamp: string;
    nurseName: string;
    focus: string; // e.g., "Wound Care", "Behavior", "Vitals"
    note: string; // SOAP or DAR format
}

export interface FluidBalanceRecord {
    id: string;
    beneficiaryId: string;
    date: string;
    intake: {
        oral: number;
        iv: number;
        tubeFeeding: number;
    };
    output: {
        urine: number;
        stool: number;
        vomitus: number;
    };
    totalIntake: number;
    totalOutput: number;
    balance: number;
}
