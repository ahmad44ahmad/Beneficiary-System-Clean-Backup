// src/hooks/queries/useIndicatorQueries.ts
// TanStack Query hooks for indicator data

import { useQuery } from '@tanstack/react-query';
import { queryKeys, queryConfigs } from './keys';
import { indicatorsRepository } from '../../services/repositories/indicatorsRepository';

export function useRiskScoreLog() {
    return useQuery({
        queryKey: queryKeys.indicators.earlyWarning(),
        queryFn: () => indicatorsRepository.fetchRiskScoreLog(),
        ...queryConfigs.normal,
    });
}

export function useBenchmarkStandards() {
    return useQuery({
        queryKey: queryKeys.indicators.benchmark(),
        queryFn: () => indicatorsRepository.fetchBenchmarkStandards(),
        ...queryConfigs.normal,
    });
}

export function useISOCompliance() {
    return useQuery({
        queryKey: queryKeys.indicators.iso(),
        queryFn: () => indicatorsRepository.fetchISOComplianceChecklist(),
        ...queryConfigs.normal,
    });
}

export function useStrategicKPIStats() {
    return useQuery({
        queryKey: queryKeys.stats.kpis(),
        queryFn: () => indicatorsRepository.fetchStrategicKPIStats(),
        ...queryConfigs.normal,
    });
}
