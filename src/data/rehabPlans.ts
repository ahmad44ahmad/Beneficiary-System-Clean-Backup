import { RehabPlan } from '../types/rehab';

export const rehabPlans: RehabPlan[] = [
    {
        id: 'plan_1',
        beneficiaryId: '1216',
        beneficiaryName: 'عامر موسى علي عمر ال منامس عسيري',
        startDate: '2023-10-01',
        endDate: '2024-10-01',
        status: 'active',
        medicalContext: {
            diagnosis: 'Cerebral Palsy (CP)',
            needs: ['Wheelchair']
        },
        socialContext: {
            economicStatus: 'Low Income',
            riskLevel: 'high'
        },
        goals: [
            {
                id: 'g1',
                type: 'physiotherapy',
                title: 'Improve Range of Motion (ROM)',
                measureOfSuccess: 'Increase ROM by 10 degrees',
                targetDate: '2023-12-31',
                progress: 75,
                status: 'in_progress',
                assignedTo: 'Dr. Ahmed'
            },
            {
                id: 'g2',
                type: 'social',
                title: 'Process Prosthetic Device Request',
                measureOfSuccess: 'Device delivered',
                targetDate: '2023-11-15',
                progress: 100,
                status: 'achieved',
                assignedTo: 'Social Worker Sarah'
            }
        ],
        approvals: [
            { role: 'doctor', status: 'approved', approvedBy: 'Dr. Ahmed', approvedAt: '2023-10-02' },
            { role: 'social_worker', status: 'approved', approvedBy: 'Sarah', approvedAt: '2023-10-03' },
            { role: 'director', status: 'approved', approvedBy: 'Director', approvedAt: '2023-10-04' }
        ]
    },
    {
        id: 'plan_2',
        beneficiaryId: '1401',
        beneficiaryName: 'لاحق يحيى شوعان علي جابر الحساني',
        startDate: '2023-11-01',
        endDate: '2024-11-01',
        status: 'draft',
        medicalContext: {
            diagnosis: 'Cerebral Palsy (CP)',
            needs: []
        },
        socialContext: {
            economicStatus: 'Average',
            riskLevel: 'medium'
        },
        goals: [
            {
                id: 'g3',
                type: 'medical',
                title: 'Regular Checkups',
                measureOfSuccess: 'Monthly visits',
                targetDate: '2024-11-01',
                progress: 20,
                status: 'in_progress',
                assignedTo: 'Dr. Khalid'
            }
        ],
        approvals: [
            { role: 'doctor', status: 'approved', approvedBy: 'Dr. Khalid', approvedAt: '2023-11-02' },
            { role: 'social_worker', status: 'pending' },
            { role: 'director', status: 'pending' }
        ]
    },
    {
        id: 'plan_3',
        beneficiaryId: '365',
        beneficiaryName: 'ياسر صالح سعيد بريك ال بريك الغامدي',
        startDate: '2023-09-15',
        endDate: '2024-09-15',
        status: 'active',
        medicalContext: {
            diagnosis: 'Intellectual Disability',
            needs: ['Speech Therapy']
        },
        socialContext: {
            economicStatus: 'Good',
            riskLevel: 'low'
        },
        goals: [
            {
                id: 'g4',
                type: 'psychological',
                title: 'Behavioral Therapy',
                measureOfSuccess: 'Reduce outbursts',
                targetDate: '2024-03-01',
                progress: 45,
                status: 'in_progress',
                assignedTo: 'Dr. Mona'
            },
            {
                id: 'g5',
                type: 'medical',
                title: 'Dental Care',
                measureOfSuccess: 'Cavity free',
                targetDate: '2023-12-01',
                progress: 90,
                status: 'in_progress',
                assignedTo: 'Dr. Samer'
            }
        ],
        approvals: [
            { role: 'doctor', status: 'approved', approvedBy: 'Dr. Samer', approvedAt: '2023-09-16' },
            { role: 'social_worker', status: 'approved', approvedBy: 'Layla', approvedAt: '2023-09-17' },
            { role: 'director', status: 'approved', approvedBy: 'Director', approvedAt: '2023-09-18' }
        ]
    }
];
