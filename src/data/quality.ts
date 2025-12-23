import { Risk, Incident, Audit, CorrectiveAction } from '../types/quality';

export const mockRisks: Risk[] = [
    {
        id: 'r1',
        description: 'Slippery floor in the dining area due to leakage',
        category: 'Health & Safety',
        likelihood: 4,
        impact: 4,
        score: 16,
        level: 'critical',
        mitigationPlan: 'Fix plumbing immediately; install non-slip mats.',
        owner: 'Maintenance Manager',
        lastReviewDate: '2023-10-25'
    },
    {
        id: 'r2',
        description: 'Shortage of epilepsy medication',
        category: 'Operational',
        likelihood: 2,
        impact: 5,
        score: 10,
        level: 'medium',
        mitigationPlan: 'Maintain 3-month buffer stock; alternative supplier contracts.',
        owner: 'Head Nurse',
        lastReviewDate: '2023-10-20'
    },
    {
        id: 'r3',
        description: 'Staff burnout due to double shifts',
        category: 'HR',
        likelihood: 3,
        impact: 3,
        score: 9,
        level: 'medium',
        mitigationPlan: 'Recruit part-time staff; rotate shifts fairly.',
        owner: 'HR Manager',
        lastReviewDate: '2023-10-28'
    }
];

export const mockIncidents: Incident[] = [
    {
        id: 'inc_01',
        type: 'injury_staff',
        date: '2023-10-28',
        time: '14:30',
        location: 'Kitchen',
        description: 'Chef cut finger while chopping vegetables.',
        reportedBy: 'Kitchen Supervisor',
        involvedPersons: 'Chef Ahmed',
        immediateAction: 'First aid applied; sent to clinic.',
        status: 'closed'
    },
    {
        id: 'inc_02',
        type: 'near_miss',
        date: '2023-10-29',
        time: '09:00',
        location: 'Corridor A',
        description: 'Wheelchair brake failed on ramp, but nurse caught it.',
        reportedBy: 'Nurse Sara',
        involvedPersons: 'Beneficiary 1401',
        immediateAction: 'Wheelchair sent to maintenance.',
        status: 'investigating'
    }
];

export const mockAudits: Audit[] = [
    {
        id: 'aud_2023_Q4',
        title: 'Q4 Internal Quality Audit (ISO 9001)',
        auditorName: 'Quality Officer',
        date: '2023-11-01',
        scope: 'Medical & Rehab Departments',
        status: 'in_progress',
        findings: [
            {
                id: 'f1',
                auditId: 'aud_2023_Q4',
                area: 'Clinic',
                criterion: 'Medication Storage Temperature Log',
                isCompliant: true,
                evidence: 'Logs are up to date.'
            },
            {
                id: 'f2',
                auditId: 'aud_2023_Q4',
                area: 'Rehab',
                criterion: 'Individual Plans Signed by Director',
                isCompliant: false,
                severity: 'minor',
                evidence: '3 out of 10 plans missing signature.'
            }
        ]
    }
];

export const mockCAPAs: CorrectiveAction[] = [
    {
        id: 'capa_01',
        auditId: 'aud_2023_Q4',
        description: 'Ensure all Rehab Plans are signed within 48 hours.',
        assignedTo: 'Rehab Director',
        dueDate: '2023-11-05',
        status: 'open'
    },
    {
        id: 'capa_02',
        incidentId: 'inc_02',
        description: 'Inspect all wheelchair brakes weekly.',
        assignedTo: 'Maintenance Head',
        dueDate: '2023-11-01',
        status: 'in_progress',
        rootCause: 'Wear and tear not detected in monthly check.',
        actionTaken: 'Updated checklist to weekly frequency.'
    }
];
