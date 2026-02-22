// src/hooks/queries/useStatsQueries.ts
// TanStack Query v5 hooks for Dashboard Statistics (الإحصائيات) domain

import { useQuery } from '@tanstack/react-query';
import { statsRepository } from '../../services/repositories';
import { queryKeys, queryConfigs } from './keys';

/**
 * Fetch aggregated dashboard statistics
 * Includes total beneficiaries, active count, pending maintenance, and high-risk cases
 */
export function useDashboardStats() {
    return useQuery({
        queryKey: queryKeys.stats.dashboard(),
        queryFn: () => statsRepository.getDashboardStats(),
        ...queryConfigs.normal,
    });
}
