// src/services/repositories/medicalRepository.ts
// Repository layer for Medical (الطبي) domain

import { supaService } from '../supaService';
import type { SocialResearch } from '../../types';

export const medicalRepository = {
    /**
     * Save a social research record
     */
    saveSocialResearch(data: SocialResearch): Promise<boolean> {
        return supaService.saveSocialResearch(data);
    },

    /**
     * Save a medical profile record
     */
    saveMedicalProfile(data: Record<string, unknown>): Promise<boolean> {
        return supaService.saveMedicalProfile(data);
    },

    /**
     * Fetch the full unified profile (beneficiary + medical + social + rehab + dietary)
     * by national ID
     */
    getFullProfile(nationalId: string): Promise<Record<string, unknown> | null> {
        return supaService.getFullProfile(nationalId);
    },
};
