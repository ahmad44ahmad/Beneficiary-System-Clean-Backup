// useMedications - TanStack Query hook for medication management
// Handles medication administration tracking and alerts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';

// Query keys for medication cache management
export const medicationKeys = {
    all: ['medications'] as const,
    schedules: () => [...medicationKeys.all, 'schedules'] as const,
    schedule: (beneficiaryId: string) => [...medicationKeys.schedules(), beneficiaryId] as const,
    administrations: () => [...medicationKeys.all, 'administrations'] as const,
    administration: (date: string) => [...medicationKeys.administrations(), date] as const,
    alerts: () => [...medicationKeys.all, 'alerts'] as const,
};

interface MedicationSchedule {
    id: string;
    beneficiary_id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    times: string[];
    start_date: string;
    end_date?: string;
    notes?: string;
    status: 'active' | 'paused' | 'completed';
}

interface MedicationAdministration {
    id: string;
    schedule_id: string;
    beneficiary_id: string;
    administered_at: string;
    administered_by: string;
    status: 'given' | 'missed' | 'refused' | 'delayed';
    notes?: string;
}

/**
 * Check if Supabase is ready
 */
function isSupabaseReady(): boolean {
    return !!(supabase && typeof supabase.from === 'function');
}

/**
 * Hook to fetch medication schedules for a beneficiary
 */
export function useMedicationSchedules(beneficiaryId?: string) {
    return useQuery({
        queryKey: beneficiaryId
            ? medicationKeys.schedule(beneficiaryId)
            : medicationKeys.schedules(),
        queryFn: async (): Promise<MedicationSchedule[]> => {
            if (!isSupabaseReady()) return [];

            let query = supabase
                .from('medication_schedules')
                .select('*')
                .eq('status', 'active');

            if (beneficiaryId) {
                query = query.eq('beneficiary_id', beneficiaryId);
            }

            const { data, error } = await query;
            if (error) {
                console.error('Error fetching medication schedules:', error);
                return [];
            }
            return data || [];
        },
        staleTime: 2 * 60 * 1000, // 2 minutes for critical medication data
    });
}

/**
 * Hook to fetch medication administrations for a specific date
 */
export function useMedicationAdministrations(date: string) {
    return useQuery({
        queryKey: medicationKeys.administration(date),
        queryFn: async (): Promise<MedicationAdministration[]> => {
            if (!isSupabaseReady()) return [];

            const { data, error } = await supabase
                .from('medication_administrations')
                .select('*')
                .gte('administered_at', `${date}T00:00:00`)
                .lte('administered_at', `${date}T23:59:59`)
                .order('administered_at', { ascending: false });

            if (error) {
                console.error('Error fetching administrations:', error);
                return [];
            }
            return data || [];
        },
        staleTime: 1 * 60 * 1000, // 1 minute for real-time tracking
        refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    });
}

/**
 * Hook to record a medication administration
 */
export function useRecordAdministration() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (administration: Omit<MedicationAdministration, 'id'>) => {
            if (!isSupabaseReady()) throw new Error('Supabase not ready');

            const { data, error } = await supabase
                .from('medication_administrations')
                .insert(administration)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: medicationKeys.administrations() });
            queryClient.invalidateQueries({ queryKey: medicationKeys.alerts() });
        },
    });
}

/**
 * Hook to get medication alerts (overdue or upcoming)
 */
export function useMedicationAlerts() {
    return useQuery({
        queryKey: medicationKeys.alerts(),
        queryFn: async () => {
            if (!isSupabaseReady()) return { overdue: [], upcoming: [] };

            const now = new Date();
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

            // This would ideally be a server-side computed view
            // For now, we'll return empty arrays and let the component handle logic
            return {
                overdue: [] as MedicationSchedule[],
                upcoming: [] as MedicationSchedule[],
            };
        },
        staleTime: 1 * 60 * 1000,
        refetchInterval: 2 * 60 * 1000, // Critical alerts - refresh often
    });
}

/**
 * Hook to get medication compliance stats
 */
export function useMedicationStats(beneficiaryId?: string, days: number = 7) {
    return useQuery({
        queryKey: ['medications', 'stats', beneficiaryId, days],
        queryFn: async () => {
            if (!isSupabaseReady()) {
                return { given: 0, missed: 0, refused: 0, complianceRate: 100 };
            }

            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            let query = supabase
                .from('medication_administrations')
                .select('status')
                .gte('administered_at', startDate.toISOString());

            if (beneficiaryId) {
                query = query.eq('beneficiary_id', beneficiaryId);
            }

            const { data, error } = await query;

            if (error || !data) {
                return { given: 0, missed: 0, refused: 0, complianceRate: 100 };
            }

            const stats = {
                given: data.filter(d => d.status === 'given').length,
                missed: data.filter(d => d.status === 'missed').length,
                refused: data.filter(d => d.status === 'refused').length,
                delayed: data.filter(d => d.status === 'delayed').length,
            };

            const total = stats.given + stats.missed + stats.refused;
            const complianceRate = total > 0 ? Math.round((stats.given / total) * 100) : 100;

            return { ...stats, complianceRate };
        },
        staleTime: 5 * 60 * 1000,
    });
}
