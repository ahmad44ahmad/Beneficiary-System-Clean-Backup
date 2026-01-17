// useBeneficiaries - TanStack Query hook for beneficiary data management
// Replaces direct state management with server-state caching

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supaService } from '../services/supaService';
import { Beneficiary, UnifiedBeneficiaryProfile } from '../types';

// Query keys for cache management
export const beneficiaryKeys = {
    all: ['beneficiaries'] as const,
    lists: () => [...beneficiaryKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...beneficiaryKeys.lists(), filters] as const,
    details: () => [...beneficiaryKeys.all, 'detail'] as const,
    detail: (id: string) => [...beneficiaryKeys.details(), id] as const,
    byNationalId: (nationalId: string) => [...beneficiaryKeys.all, 'nationalId', nationalId] as const,
};

/**
 * Hook to fetch all beneficiaries with filtering support
 */
export function useBeneficiaries(filters?: {
    status?: string;
    searchTerm?: string;
    dependency?: string;
}) {
    return useQuery({
        queryKey: beneficiaryKeys.list(filters || {}),
        queryFn: async () => {
            const beneficiaries = await supaService.getBeneficiaries();

            // Apply client-side filters if provided
            if (!filters) return beneficiaries;

            return beneficiaries.filter((b) => {
                if (filters.status && b.status !== filters.status) return false;
                if (filters.searchTerm) {
                    const search = filters.searchTerm.toLowerCase();
                    const fullName = b.fullName?.toLowerCase() || '';
                    const nationalId = b.nationalId?.toLowerCase() || '';
                    if (!fullName.includes(search) && !nationalId.includes(search)) return false;
                }
                return true;
            });
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch a single beneficiary by ID
 */
export function useBeneficiary(id: string | undefined) {
    return useQuery({
        queryKey: beneficiaryKeys.detail(id || ''),
        queryFn: () => supaService.getBeneficiaryById(id!),
        enabled: !!id,
    });
}

/**
 * Hook to fetch a beneficiary by National ID
 */
export function useBeneficiaryByNationalId(nationalId: string | undefined) {
    return useQuery({
        queryKey: beneficiaryKeys.byNationalId(nationalId || ''),
        queryFn: () => supaService.getBeneficiaryByNationalId(nationalId!),
        enabled: !!nationalId,
    });
}

/**
 * Hook to create a new beneficiary with optimistic updates
 */
export function useCreateBeneficiary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (beneficiary: Partial<Beneficiary>) =>
            supaService.createBeneficiary(beneficiary),
        onSuccess: () => {
            // Invalidate and refetch beneficiary lists
            queryClient.invalidateQueries({ queryKey: beneficiaryKeys.lists() });
        },
    });
}

/**
 * Hook to update an existing beneficiary
 */
export function useUpdateBeneficiary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Beneficiary> }) =>
            supaService.updateBeneficiary(id, updates),
        onSuccess: (_, { id }) => {
            // Invalidate specific beneficiary and lists
            queryClient.invalidateQueries({ queryKey: beneficiaryKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: beneficiaryKeys.lists() });
        },
    });
}

/**
 * Hook to get dashboard stats for beneficiaries
 */
export function useBeneficiaryStats() {
    return useQuery({
        queryKey: ['beneficiaries', 'stats'],
        queryFn: async () => {
            const beneficiaries = await supaService.getBeneficiaries();
            return {
                total: beneficiaries.length,
                byStatus: {
                    active: beneficiaries.filter(b => b.status === 'active').length,
                    discharged: beneficiaries.filter(b => b.status === 'discharged').length,
                    transferred: beneficiaries.filter(b => b.status === 'transferred').length,
                },
            };
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
