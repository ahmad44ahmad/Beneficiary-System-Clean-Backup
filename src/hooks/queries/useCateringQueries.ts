// src/hooks/queries/useCateringQueries.ts
// TanStack Query v5 hooks for Catering (الإعاشة) domain

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cateringRepository } from '../../services/repositories';
import { queryKeys, queryConfigs } from './keys';

/**
 * Fetch daily meals for a given date, optionally filtered by meal type
 */
export function useDailyMeals(date: string, mealType?: string) {
    return useQuery({
        queryKey: queryKeys.catering.meals(date),
        queryFn: () => cateringRepository.getDailyMeals(date, mealType),
        enabled: !!date,
        ...queryConfigs.normal,
    });
}

/**
 * Mutation to update a meal's delivery status
 * Automatically invalidates the meals list on success
 */
export function useUpdateMealStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ mealId, status }: { mealId: string; status: string }) =>
            cateringRepository.updateMealStatus(mealId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.catering.all });
        },
    });
}

/**
 * Fetch the dietary plan for a specific beneficiary
 */
export function useDietaryPlan(beneficiaryId: string) {
    return useQuery({
        queryKey: queryKeys.catering.dietary(beneficiaryId),
        queryFn: () => cateringRepository.getDietaryPlan(beneficiaryId),
        enabled: !!beneficiaryId,
        ...queryConfigs.static,
    });
}
