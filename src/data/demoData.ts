import { UnifiedBeneficiaryProfile } from '../types/unified';

export const demoBeneficiaries: UnifiedBeneficiaryProfile[] = [
    {
        id: '1',
        name: 'Ahmed Al-Sayed',
        dateOfBirth: '1955-04-12',
        gender: 'male',
        status: 'active',
        idNumber: '1023456789',
        guardianName: 'State Ward',
        guardianRelation: 'State Ward',
        contactNumber: 'N/A',
        medicalDiagnosis: 'Stroke (CVA), Hypertension, Diabetes Type 2',
        psychiatricDiagnosis: 'Mild Depression',
        socialStatus: 'Widower, State Ward',
        notes: 'Requires assistance with feeding and transfer. History of falls.',
        smartTags: [], // Will be populated by tagEngine
        isOrphan: true,
        hasChronicCondition: true,
        requiresIsolation: false,
        riskLevel: 'medium',

        // Medical Profile
        medicalProfile: {
            id: 'm1',
            beneficiaryId: '1',
            admissionDate: '2020-05-12',
            primaryDiagnosis: 'Other',
            secondaryDiagnoses: ['Hypertension', 'Diabetes Type 2'],
            isEpileptic: false,
            latestVitals: {
                temperature: 37.1,
                bloodPressureSystolic: 140,
                bloodPressureDiastolic: 90,
                pulse: 78,
                respiratoryRate: 18,
                oxygenSaturation: 96,
                weight: 75,
                height: 170,
                bmi: 25.9,
                measuredAt: '2023-10-25'
            },
            history: {
                chronicDiseases: ['Hypertension', 'Diabetes'],
                surgeries: [],
                allergies: ['Penicillin', 'Peanuts'],
                familyHistory: []
            },
            currentMedications: [],
            infectionStatus: {
                suspectedInfection: false,
                isolationRecommended: false,
                vaccinationStatus: 'UpToDate'
            }
        },

        // Latest Vitals
        latestMedicalExam: {
            id: 'e1',
            beneficiaryId: '1',
            beneficiaryName: 'Ahmed Al-Sayed',
            date: '2023-10-25',
            doctorName: 'Dr. Sarah',
            diagnosis: 'Stable',
            vitalSigns: {
                bloodPressure: '140/90',
                pulse: '78',
                temperature: '37.1',
                respiration: '18'
            },
            physicalExamNotes: 'Normal',
            recommendations: 'Continue physiotherapy.'
        },

        // Active Rehab Plan
        activeRehabPlan: {
            id: 'r1',
            beneficiaryId: '1',
            beneficiaryName: 'Ahmed Al-Sayed',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'Stroke', needs: ['Wheelchair'] },
            socialContext: { economicStatus: 'Low', riskLevel: 'medium' },
            approvals: [],
            goals: [
                { id: 'g1', type: 'physiotherapy', title: 'Improve arm mobility', status: 'in_progress', progress: 60, targetDate: '2023-12-01', measureOfSuccess: 'Range of motion > 90 deg', assignedTo: 'PT. John' },
                { id: 'g2', type: 'physiotherapy', title: 'Stand unassisted for 1 min', status: 'in_progress', progress: 40, targetDate: '2023-12-01', measureOfSuccess: 'Time standing > 60s', assignedTo: 'PT. John' }
            ]
        },

        // Incidents
        incidents: [
            { id: 'i1', beneficiaryId: '1', date: '2023-09-15', time: '14:30', shift: 'first', type: 'injury', location: 'Bedroom', description: 'Slipped while transferring to chair.', actionTaken: 'First aid applied, doctor notified.', cameraRecordingKept: false, staffWitnesses: [], status: 'closed' }
        ],

        visitLogs: [],
        medicalHistory: [],

        // Empowerment Profile
        empowermentProfile: {
            readinessLevel: 'contemplation',
            strengths: ['Resilient', 'Good Storyteller'],
            aspirations: ['Write a memoir'],
            hobbies: ['Reading', 'Chess'],
            skills: ['Accounting (Retired)'],
            goals: [
                { id: 'eg1', title: 'Join Chess Club', category: 'social_integration', status: 'active', startDate: '2023-11-01', targetDate: '2023-12-01', progress: 20, targetDate: '2023-12-01' }
            ],
            currentTracks: []
        },

        risks: [
            { id: 'rk1', category: 'Medical', probability: 'High', impact: 'High', mitigation: 'Daily vitals check, Insulin management', lastReview: '2023-10-01' },
            { id: 'rk2', category: 'Environmental', probability: 'Medium', impact: 'High', mitigation: 'Non-slip mats, Bed rails', lastReview: '2023-10-01' }
        ]
    },
    {
        id: '2',
        name: 'Khalid Omar',
        dateOfBirth: '1998-02-20',
        gender: 'male',
        status: 'active',
        idNumber: '1098765432',
        guardianName: 'Fatima Al-Farsi',
        guardianRelation: 'Mother',
        contactNumber: '0555555555',
        medicalDiagnosis: 'Autism Spectrum Disorder (ASD), Epilepsy',
        psychiatricDiagnosis: 'Anxiety',
        socialStatus: 'Single, Has family contact',
        notes: 'Non-verbal communication preferred. Sensitive to loud noises.',
        smartTags: [],
        isOrphan: false,
        hasChronicCondition: true,
        requiresIsolation: false,
        riskLevel: 'low',

        medicalProfile: {
            id: 'm2',
            beneficiaryId: '2',
            admissionDate: '2018-03-10',
            primaryDiagnosis: 'Autism',
            secondaryDiagnoses: ['Epilepsy'],
            isEpileptic: true,
            latestVitals: {
                temperature: 36.8,
                bloodPressureSystolic: 120,
                bloodPressureDiastolic: 80,
                pulse: 72,
                respiratoryRate: 16,
                oxygenSaturation: 98,
                weight: 65,
                height: 175,
                bmi: 21.2,
                measuredAt: '2023-10-26'
            },
            history: {
                chronicDiseases: ['Epilepsy'],
                surgeries: [],
                allergies: ['Dust'],
                familyHistory: []
            },
            currentMedications: [],
            infectionStatus: {
                suspectedInfection: false,
                isolationRecommended: false,
                vaccinationStatus: 'UpToDate'
            }
        },

        latestMedicalExam: {
            id: 'e2',
            beneficiaryId: '2',
            beneficiaryName: 'Khalid Omar',
            date: '2023-10-26',
            doctorName: 'Dr. Ali',
            diagnosis: 'Seizure free for 3 months',
            vitalSigns: {
                bloodPressure: '120/80',
                pulse: '72',
                temperature: '36.8',
                respiration: '16'
            },
            physicalExamNotes: 'Normal',
            recommendations: 'Maintain medication dosage.'
        },

        activeRehabPlan: {
            id: 'r2',
            beneficiaryId: '2',
            beneficiaryName: 'Khalid Omar',
            startDate: '2023-06-01',
            endDate: '2024-06-01',
            status: 'active',
            medicalContext: { diagnosis: 'Autism', needs: ['Sensory Tools'] },
            socialContext: { economicStatus: 'Medium', riskLevel: 'low' },
            approvals: [],
            goals: [
                { id: 'g3', type: 'social', title: 'Use picture cards for needs', status: 'achieved', progress: 100, targetDate: '2023-09-01', measureOfSuccess: 'Uses cards 90% of time', assignedTo: 'SW. Sarah' },
                { id: 'g4', type: 'social', title: 'Participate in group art', status: 'in_progress', progress: 75, targetDate: '2023-12-01', measureOfSuccess: 'Attends 3 sessions/week', assignedTo: 'SW. Sarah' }
            ]
        },

        incidents: [],
        visitLogs: [],
        medicalHistory: [],

        empowermentProfile: {
            readinessLevel: 'action',
            strengths: ['Artistic', 'Detail-oriented', 'Visual Learner'],
            aspirations: ['Become a Graphic Designer'],
            hobbies: ['Drawing', 'Puzzles'],
            skills: ['Digital Art Basics'],
            goals: [
                { id: 'eg2', title: 'Complete Photoshop Course', category: 'education', status: 'active', startDate: '2023-09-01', targetDate: '2023-12-31', progress: 60 }
            ],
            currentTracks: [
                { id: 't1', trackName: 'Graphic Design', status: 'in_progress', startDate: '2023-09-01', providerName: 'Tech Institute' }
            ]
        },

        risks: [
            { id: 'rk3', category: 'Medical', probability: 'Medium', impact: 'High', mitigation: 'Seizure protocol, Helmet available', lastReview: '2023-10-15' }
        ]
    },
    {
        id: '3',
        name: 'Sami Al-Harbi',
        dateOfBirth: '1980-01-01',
        gender: 'male',
        status: 'active',
        idNumber: '1056789012',
        guardianName: 'State Ward',
        guardianRelation: 'State Ward',
        contactNumber: 'N/A',
        medicalDiagnosis: 'Scabies (Active), Hypertension',
        psychiatricDiagnosis: 'None',
        socialStatus: 'Homeless prior to admission',
        notes: 'Admitted recently. Under strict isolation protocol.',
        smartTags: [],
        isOrphan: true,
        hasChronicCondition: true,
        requiresIsolation: true,
        riskLevel: 'high',

        medicalProfile: {
            id: 'm3',
            beneficiaryId: '3',
            admissionDate: '2023-10-20',
            primaryDiagnosis: 'Other',
            secondaryDiagnoses: ['Scabies', 'Hypertension'],
            isEpileptic: false,
            latestVitals: {
                temperature: 37.5,
                bloodPressureSystolic: 150,
                bloodPressureDiastolic: 95,
                pulse: 88,
                respiratoryRate: 20,
                oxygenSaturation: 97,
                weight: 70,
                height: 172,
                bmi: 23.6,
                measuredAt: '2023-10-27'
            },
            history: {
                chronicDiseases: ['Hypertension'],
                surgeries: [],
                allergies: [],
                familyHistory: []
            },
            currentMedications: [],
            infectionStatus: {
                suspectedInfection: true,
                isolationRecommended: true,
                isolationReason: 'Scabies',
                vaccinationStatus: 'Unknown' as any
            }
        },

        latestMedicalExam: {
            id: 'e3',
            beneficiaryId: '3',
            beneficiaryName: 'Sami Al-Harbi',
            date: '2023-10-27',
            doctorName: 'Dr. Huda',
            diagnosis: 'Active Scabies infestation',
            vitalSigns: {
                bloodPressure: '150/95',
                pulse: '88',
                temperature: '37.5',
                respiration: '20'
            },
            physicalExamNotes: 'Rash visible',
            recommendations: 'Start Permethrin treatment. Contact Isolation.'
        },

        activeRehabPlan: undefined,
        incidents: [],
        visitLogs: [],
        medicalHistory: [],

        empowermentProfile: {
            readinessLevel: 'not_ready',
            strengths: [],
            aspirations: [],
            hobbies: [],
            skills: [],
            goals: [],
            currentTracks: []
        },

        risks: [
            { id: 'rk4', category: 'Medical', probability: 'High', impact: 'Medium', mitigation: 'Contact Isolation, PPE for staff', lastReview: '2023-10-27' },
            { id: 'rk5', category: 'Social', probability: 'High', impact: 'Low', mitigation: 'Social work assessment pending', lastReview: '2023-10-27' }
        ]
    },
    {
        id: '4',
        name: 'Yousef Al-Amri',
        dateOfBirth: '2000-05-05',
        gender: 'male',
        status: 'active',
        idNumber: '1122334455',
        guardianName: 'Hassan Al-Amri',
        guardianRelation: 'Father',
        contactNumber: '0501234567',
        medicalDiagnosis: 'Cerebral Palsy (Quadriplegic), Wheelchair User',
        psychiatricDiagnosis: 'None',
        socialStatus: 'Supportive Family',
        notes: 'Highly intelligent. Uses eye-tracking software for communication.',
        smartTags: [],
        isOrphan: false,
        hasChronicCondition: true,
        requiresIsolation: false,
        riskLevel: 'low',

        medicalProfile: {
            id: 'm4',
            beneficiaryId: '4',
            admissionDate: '2015-06-15',
            primaryDiagnosis: 'CP',
            secondaryDiagnoses: [],
            isEpileptic: false,
            latestVitals: {
                temperature: 36.9,
                bloodPressureSystolic: 110,
                bloodPressureDiastolic: 70,
                pulse: 68,
                respiratoryRate: 16,
                oxygenSaturation: 99,
                weight: 50,
                height: 165,
                bmi: 18.3,
                measuredAt: '2023-10-20'
            },
            history: {
                chronicDiseases: ['Cerebral Palsy'],
                surgeries: [],
                allergies: ['Latex'],
                familyHistory: []
            },
            currentMedications: [],
            infectionStatus: {
                suspectedInfection: false,
                isolationRecommended: false,
                vaccinationStatus: 'UpToDate'
            }
        },

        latestMedicalExam: {
            id: 'e4',
            beneficiaryId: '4',
            beneficiaryName: 'Yousef Al-Amri',
            date: '2023-10-20',
            doctorName: 'Dr. Sarah',
            diagnosis: 'Healthy',
            vitalSigns: {
                bloodPressure: '110/70',
                pulse: '68',
                temperature: '36.9',
                respiration: '16'
            },
            physicalExamNotes: 'Normal',
            recommendations: 'Check wheelchair seating posture.'
        },

        activeRehabPlan: {
            id: 'r4',
            beneficiaryId: '4',
            beneficiaryName: 'Yousef Al-Amri',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'CP', needs: ['Eye Tracker'] },
            socialContext: { economicStatus: 'High', riskLevel: 'low' },
            approvals: [],
            goals: [
                { id: 'g5', type: 'occupational', title: 'Master eye-tracking typing', status: 'achieved', progress: 100, targetDate: '2023-06-01', measureOfSuccess: '40 WPM', assignedTo: 'OT. Mike' },
                { id: 'g6', type: 'occupational', title: 'Code a simple website', status: 'in_progress', progress: 80, targetDate: '2023-12-01', measureOfSuccess: 'Website deployed', assignedTo: 'OT. Mike' }
            ]
        },

        incidents: [],
        visitLogs: [],
        medicalHistory: [],

        empowermentProfile: {
            readinessLevel: 'maintenance',
            strengths: ['Tech-savvy', 'Logical Thinking', 'Determined'],
            aspirations: ['Software Developer'],
            hobbies: ['Coding', 'Video Games'],
            skills: ['HTML', 'CSS', 'JavaScript'],
            goals: [
                { id: 'eg3', title: 'Build Portfolio Website', category: 'employment', status: 'active', startDate: '2023-10-01', targetDate: '2023-11-30', progress: 80 }
            ],
            currentTracks: [
                { id: 't2', trackName: 'Web Development', status: 'in_progress', startDate: '2023-01-01', providerName: 'Online Bootcamp' }
            ]
        },

        risks: [
            { id: 'rk6', category: 'Medical', probability: 'Low', impact: 'High', mitigation: 'Pressure ulcer prevention mattress', lastReview: '2023-10-20' },
            { id: 'rk7', category: 'Environmental', probability: 'Low', impact: 'Medium', mitigation: 'Wheelchair ramp maintenance', lastReview: '2023-10-20' }
        ]
    },
    {
        id: '5',
        name: 'Fahad Al-Qahtani',
        dateOfBirth: '1985-08-15',
        gender: 'male',
        status: 'active',
        idNumber: '1077889900',
        guardianName: 'Salem Al-Qahtani',
        guardianRelation: 'Father',
        contactNumber: '0567890123',
        medicalDiagnosis: 'Schizophrenia, Obesity',
        psychiatricDiagnosis: 'Schizophrenia (Paranoid Type)',
        socialStatus: 'Divorced',
        notes: 'History of aggressive outbursts if medication is missed.',
        smartTags: [],
        isOrphan: false,
        hasChronicCondition: true,
        requiresIsolation: false,
        riskLevel: 'critical',

        medicalProfile: {
            id: 'm5',
            beneficiaryId: '5',
            admissionDate: '2021-11-11',
            primaryDiagnosis: 'Other',
            secondaryDiagnoses: ['Schizophrenia', 'Obesity'],
            isEpileptic: false,
            latestVitals: {
                temperature: 37.0,
                bloodPressureSystolic: 135,
                bloodPressureDiastolic: 85,
                pulse: 82,
                respiratoryRate: 18,
                oxygenSaturation: 97,
                weight: 110,
                height: 178,
                bmi: 34.7,
                measuredAt: '2023-10-22'
            },
            history: {
                chronicDiseases: ['Obesity'],
                surgeries: [],
                allergies: [],
                familyHistory: []
            },
            currentMedications: [],
            infectionStatus: {
                suspectedInfection: false,
                isolationRecommended: false,
                vaccinationStatus: 'UpToDate'
            }
        },

        latestMedicalExam: {
            id: 'e5',
            beneficiaryId: '5',
            beneficiaryName: 'Fahad Al-Qahtani',
            date: '2023-10-22',
            doctorName: 'Dr. Ali',
            diagnosis: 'Weight increasing',
            vitalSigns: {
                bloodPressure: '135/85',
                pulse: '82',
                temperature: '37.0',
                respiration: '18'
            },
            physicalExamNotes: 'Obese',
            recommendations: 'Dietary consultation required.'
        },

        activeRehabPlan: {
            id: 'r5',
            beneficiaryId: '5',
            beneficiaryName: 'Fahad Al-Qahtani',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'Schizophrenia', needs: ['Therapy'] },
            socialContext: { economicStatus: 'Medium', riskLevel: 'high' },
            approvals: [],
            goals: []
        },

        incidents: [],
        visitLogs: [],
        medicalHistory: [],

        empowermentProfile: {
            readinessLevel: 'preparation',
            strengths: ['Strong Physically', 'Helpful when stable'],
            aspirations: ['Work in a kitchen'],
            hobbies: ['Cooking'],
            skills: ['Basic Cooking'],
            goals: [
                { id: 'eg4', title: 'Culinary Hygiene Certificate', category: 'education', status: 'draft', startDate: '2024-01-01', targetDate: '2024-03-01', progress: 0 }
            ],
            currentTracks: []
        },

        risks: [
            { id: 'rk8', category: 'Behavioral', probability: 'High', impact: 'High', mitigation: 'Staff training, De-escalation plan, PRN medication', lastReview: '2023-10-15' },
            { id: 'rk9', category: 'Medical', probability: 'Medium', impact: 'Medium', mitigation: 'Diet plan, Exercise routine', lastReview: '2023-10-15' }
        ]
    }
];
