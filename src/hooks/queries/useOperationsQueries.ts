// src/hooks/queries/useOperationsQueries.ts
// TanStack Query v5 hooks for Operations & Maintenance (التشغيل والصيانة) domain

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationsRepository } from '../../services/repositories';
import { queryKeys, queryConfigs } from './keys';

/**
 * Fetch maintenance requests, optionally filtered by status
 */
export function useMaintenanceRequests(status?: string) {
    return useQuery({
        queryKey: queryKeys.maintenance.requests(status),
        queryFn: () => operationsRepository.getMaintenanceRequests(status),
        ...queryConfigs.normal,
    });
}

/**
 * Mutation to create a new maintenance request
 * Automatically invalidates the requests list on success
 */
export function useCreateMaintenanceRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: Record<string, unknown>) =>
            operationsRepository.createMaintenanceRequest(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.all });
            // Also refresh dashboard stats since pending maintenance count changes
            queryClient.invalidateQueries({ queryKey: queryKeys.stats.dashboard() });
        },
    });
}

/**
 * Fetch assets inventory, optionally filtered by status
 */
export function useAssets(status?: string) {
    return useQuery({
        queryKey: queryKeys.maintenance.assets(),
        queryFn: () => operationsRepository.getAssets(status),
        ...queryConfigs.static,
    });
}

/**
 * Fetch preventive maintenance schedules
 * @param dueOnly - If true, only returns schedules that are past due
 */
export function usePreventiveSchedules(dueOnly?: boolean) {
    return useQuery({
        queryKey: queryKeys.maintenance.schedules(),
        queryFn: () => operationsRepository.getPreventiveSchedules(dueOnly),
        ...queryConfigs.normal,
    });
}
