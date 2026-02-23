// src/services/repositories/operationsRepository.ts
// Repository layer for Operations & Maintenance (التشغيل والصيانة) domain

import { supaService } from '../supaService';

export const operationsRepository = {
    /**
     * Fetch maintenance requests, optionally filtered by status
     */
    getMaintenanceRequests(status?: string) {
        return supaService.getMaintenanceRequests(status);
    },

    /**
     * Create a new maintenance request
     */
    createMaintenanceRequest(request: Record<string, unknown>): Promise<Record<string, unknown> | null> {
        return supaService.createMaintenanceRequest(request);
    },

    /**
     * Fetch assets inventory, optionally filtered by status
     */
    getAssets(status?: string) {
        return supaService.getAssets(status);
    },

    /**
     * Fetch preventive maintenance schedules
     * @param dueOnly - If true, only returns schedules that are due
     */
    getPreventiveSchedules(dueOnly?: boolean) {
        return supaService.getPreventiveSchedules(dueOnly);
    },
};
