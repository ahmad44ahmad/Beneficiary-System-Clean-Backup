// src/services/repositories/beneficiaryRepository.ts
// Repository layer for Beneficiary domain — decouples components from direct Supabase calls

import { supaService } from '../supaService';
import type { Beneficiary, UnifiedBeneficiaryProfile } from '../../types';

export const beneficiaryRepository = {
    /**
     * Fetch all beneficiaries, transformed to UnifiedBeneficiaryProfile
     */
    getBeneficiaries(): Promise<UnifiedBeneficiaryProfile[]> {
        return supaService.getBeneficiaries();
    },

    /**
     * Fetch a single beneficiary by UUID
     */
    getBeneficiaryById(id: string): Promise<UnifiedBeneficiaryProfile | null> {
        return supaService.getBeneficiaryById(id);
    },

    /**
     * Fetch a single beneficiary by National ID (the "Golden Key")
     */
    getBeneficiaryByNationalId(nationalId: string): Promise<UnifiedBeneficiaryProfile | null> {
        return supaService.getBeneficiaryByNationalId(nationalId);
    },

    /**
     * Create a new beneficiary record
     */
    createBeneficiary(data: Partial<Beneficiary>): Promise<Beneficiary | null> {
        return supaService.createBeneficiary(data);
    },

    /**
     * Update an existing beneficiary by UUID
     */
    updateBeneficiary(id: string, updates: Partial<Beneficiary>): Promise<boolean> {
        return supaService.updateBeneficiary(id, updates);
    },

    /**
     * Update the Ehsan Algorithm dignity profile for a beneficiary
     */
    updateDignityProfile(id: string, profile: Record<string, unknown>): Promise<boolean> {
        return supaService.updateDignityProfile(id, profile);
    },
};
