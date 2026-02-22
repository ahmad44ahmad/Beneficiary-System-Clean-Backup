// src/hooks/queries/useRealtimeSubscription.ts
// Generic Supabase realtime subscription hook with TanStack Query cache integration
//
// This is a reusable hook for subscribing to any Supabase table's postgres_changes.
// When changes occur, it automatically invalidates the specified query key in the
// TanStack Query cache, triggering a refetch of stale data.
//
// For the pre-configured multi-table subscription used at app level,
// see src/hooks/useRealtimeSubscription.ts instead.

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../config/supabase';

/**
 * Subscribe to real-time Postgres changes on a specific table and automatically
 * invalidate a TanStack Query cache key when changes occur.
 *
 * @param table - The Supabase table name to listen on (e.g. 'beneficiaries')
 * @param queryKeyToInvalidate - The TanStack Query key to invalidate on changes
 * @param filter - Optional Supabase realtime filter (e.g. 'beneficiary_id=eq.123')
 *
 * @example
 * ```tsx
 * // Invalidate a beneficiary's care log when daily_care_logs changes
 * useRealtimeTableSubscription(
 *   'daily_care_logs',
 *   queryKeys.care.dailyLog(beneficiaryId, date),
 *   `beneficiary_id=eq.${beneficiaryId}`
 * );
 * ```
 */
export function useRealtimeTableSubscription(
    table: string,
    queryKeyToInvalidate: readonly unknown[],
    filter?: string
) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel(`${table}_changes`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table, filter },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, filter, queryClient, queryKeyToInvalidate]);
}
