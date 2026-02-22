// src/services/repositories/cateringRepository.ts
// Repository layer for Catering (الإعاشة) domain

import { supaService } from '../supaService';

export const cateringRepository = {
    /**
     * Fetch daily meals for a given date, optionally filtered by meal type
     */
    getDailyMeals(date: string, mealType?: string) {
        return supaService.getDailyMeals(date, mealType);
    },

    /**
     * Update the delivery status of a specific meal
     */
    updateMealStatus(mealId: string, status: string): Promise<boolean> {
        return supaService.updateMealStatus(mealId, status);
    },

    /**
     * Fetch the dietary plan for a specific beneficiary
     */
    getDietaryPlan(beneficiaryId: string) {
        return supaService.getDietaryPlan(beneficiaryId);
    },
};
