// src/services/repositories/careRepository.ts
// Repository layer for Daily Care domain

import { supaService } from '../supaService';

export const careRepository = {
    /**
     * Fetch daily care log entries for a beneficiary on a specific date
     */
    getDailyCareLog(beneficiaryId: string, date: string) {
        return supaService.getDailyCareLog(beneficiaryId, date);
    },

    /**
     * Fetch fall risk assessments, optionally filtered by beneficiary
     */
    getFallRiskAssessments(beneficiaryId?: string) {
        return supaService.getFallRiskAssessments(beneficiaryId);
    },
};
