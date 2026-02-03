export interface OvrReport {
    id: string;
    incidentDate: string;
    description: string;
    category: 'medication_error' | 'fall' | 'behavioral' | 'equipment' | 'other';
    severity: 'near_miss' | 'minor' | 'moderate' | 'major' | 'sentinel';
    isAnonymous: boolean;
    reporterId?: string; // Optional if anonymous
    status: 'open' | 'investigating' | 'closed';
    justCultureCategory?: 'human_error' | 'at_risk_behavior' | 'reckless_behavior';
}

export interface OvrStats {
    totalReports: number;
    openReports: number;
    anonymousRate: number;
    avgResolutionTimeDays: number;
}

/**
 * FEATURE 5: JUST CULTURE & OVR
 * Service to handle incident reporting with a focus on systemic improvement not blame.
 */

// Mock in-memory store for demo purposes
let mockReports: OvrReport[] = [
    {
        id: 'OVR-2024-001',
        incidentDate: '2024-01-15',
        description: 'Medication dose missed due to emergency admission distraction',
        category: 'medication_error',
        severity: 'minor',
        isAnonymous: false,
        status: 'closed',
        justCultureCategory: 'human_error'
    },
    {
        id: 'OVR-2024-002',
        incidentDate: '2024-01-20',
        description: 'Slippery floor in dining area, no wet floor sign',
        category: 'fall',
        severity: 'near_miss',
        isAnonymous: true,
        status: 'open'
    }
];

export const submitOvrReport = async (report: Omit<OvrReport, 'id' | 'status'>): Promise<OvrReport> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newReport: OvrReport = {
        ...report,
        id: `OVR-2024-${String(mockReports.length + 1).padStart(3, '0')}`,
        status: 'open'
    };

    mockReports = [newReport, ...mockReports];
    return newReport;
};

export const getOvrReports = async (): Promise<OvrReport[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...mockReports];
};

export const getOvrStats = async (): Promise<OvrStats> => {
    const total = mockReports.length;
    const open = mockReports.filter(r => r.status === 'open' || r.status === 'investigating').length;
    const anonymous = mockReports.filter(r => r.isAnonymous).length;

    return {
        totalReports: total,
        openReports: open,
        anonymousRate: total > 0 ? Math.round((anonymous / total) * 100) : 0,
        avgResolutionTimeDays: 4.5 // Mock average
    };
};
