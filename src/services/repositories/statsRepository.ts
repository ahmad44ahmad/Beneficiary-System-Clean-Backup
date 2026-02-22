// src/services/repositories/statsRepository.ts
// Repository layer for Dashboard Statistics (الإحصائيات) domain

import { supaService } from '../supaService';

export interface DashboardStats {
    totalBeneficiaries: number;
    activeBeneficiaries: number;
    pendingMaintenance: number;
    highRiskCases: number;
}

export const statsRepository = {
    /**
     * Fetch aggregated dashboard statistics
     */
    getDashboardStats(): Promise<DashboardStats> {
        return supaService.getDashboardStats();
    },
};
