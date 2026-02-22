// src/hooks/queries/useMedicalQueries.ts
// TanStack Query v5 hooks for Medical (الطبي) domain

import { useQuery, useMutation } from '@tanstack/react-query';
import { medicalRepository } from '../../services/repositories';
import { queryKeys, queryConfigs } from './keys';
import type { SocialResearch } from '../../types';

/**
 * Mutation to save a social research record
 */
export function useSaveSocialResearch() {
    return useMutation({
        mutationFn: (data: SocialResearch) =>
            medicalRepository.saveSocialResearch(data),
    });
}

/**
 * Mutation to save a medical profile record
 */
export function useSaveMedicalProfile() {
    return useMutation({
        mutationFn: (data: Record<string, unknown>) =>
            medicalRepository.saveMedicalProfile(data),
    });
}

/**
 * Fetch the full unified profile (beneficiary + medical + social + rehab + dietary)
 * by national ID
 */
export function useFullProfile(nationalId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.medical.fullProfile(nationalId || ''),
        queryFn: () => medicalRepository.getFullProfile(nationalId!),
        enabled: !!nationalId,
        ...queryConfigs.normal,
    });
}
