/**
 * FEATURE 8: "Opti-Staff" - AI Staff Allocation
 * Uses mock AI logic to calculate ward acuity and recommend staffing levels.
 */

export interface WardAcuity {
    wardId: string;
    totalPatients: number;
    highRiskCount: number; // Based on Risk Prediction Engine
    mediumRiskCount: number;
    lowRiskCount: number;
    totalAcuityScore: number;
    recommendedStaff: {
        rn: number; // Registered Nurses
        ca: number; // Care Assistants
        shiftLeader: boolean;
    };
    currentStaff: {
        rn: number;
        ca: number;
    };
    status: 'optimal' | 'understaffed' | 'overstaffed';
}

export const staffingOptimizerService = {
    // Simulate fetching live patient data and calculating acuity
    calculateWardAcuity: async (wardId: string): Promise<WardAcuity> => {
        // Mock data fetch delay
        await new Promise(r => setTimeout(r, 800));

        // Simulation Variables
        const totalPatients = 24; // Standard ward size
        // Simulate a "High Acuity" day
        const highRiskCount = 8;
        const mediumRiskCount = 10;
        const lowRiskCount = 6;

        // Weighting: High=3, Medium=2, Low=1
        const totalAcuityScore = (highRiskCount * 3) + (mediumRiskCount * 2) + (lowRiskCount * 1);

        // Algorithm:
        // 1 RN per 4 High Risk | 1 RN per 8 Medium | 1 RN per 12 Low
        const requiredRNs = Math.ceil(highRiskCount / 4) + Math.ceil(mediumRiskCount / 8) + Math.ceil(lowRiskCount / 12);
        // 1 CA per 3 High Risk | 1 CA per 6 Medium | 1 CA per 8 Low
        const requiredCAs = Math.ceil(highRiskCount / 3) + Math.ceil(mediumRiskCount / 6) + Math.ceil(lowRiskCount / 10);

        const currentStaff = {
            rn: 3, // Mock current shift
            ca: 4
        };

        let status: 'optimal' | 'understaffed' | 'overstaffed' = 'optimal';
        if (currentStaff.rn < requiredRNs || currentStaff.ca < requiredCAs) status = 'understaffed';
        if (currentStaff.rn > requiredRNs + 1) status = 'overstaffed';

        return {
            wardId,
            totalPatients,
            highRiskCount,
            mediumRiskCount,
            lowRiskCount,
            totalAcuityScore,
            recommendedStaff: {
                rn: requiredRNs,
                ca: requiredCAs,
                shiftLeader: true
            },
            currentStaff,
            status
        };
    }
};
