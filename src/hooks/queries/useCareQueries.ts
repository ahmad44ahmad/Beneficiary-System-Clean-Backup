// src/hooks/queries/useCareQueries.ts
// TanStack Query v5 hooks for Daily Care domain

import { useQuery } from '@tanstack/react-query';
import { careRepository } from '../../services/repositories';
import { queryKeys, queryConfigs } from './keys';

/**
 * Fetch daily care log entries for a specific beneficiary and date
 */
export function useDailyCareLog(beneficiaryId: string, date: string) {
    return useQuery({
        queryKey: queryKeys.care.dailyLog(beneficiaryId, date),
        queryFn: () => careRepository.getDailyCareLog(beneficiaryId, date),
        enabled: !!beneficiaryId && !!date,
        ...queryConfigs.normal,
    });
}

/**
 * Fetch fall risk assessments, optionally filtered by beneficiary
 */
export function useFallRiskAssessments(beneficiaryId?: string) {
    return useQuery({
        queryKey: queryKeys.care.fallRiskAssessments(beneficiaryId),
        queryFn: () => careRepository.getFallRiskAssessments(beneficiaryId),
        ...queryConfigs.normal,
    });
}
