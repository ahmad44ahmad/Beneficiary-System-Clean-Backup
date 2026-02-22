// src/hooks/queries/useRealtimeSubscription.ts
// Generic Supabase realtime subscription hook with TanStack Query cache integration
//
// This is a reusable hook for subscribing to any Supabase table's postgres_changes.
// When changes occur, it automatically invalidates the specified query key in the
// TanStack Query cache, triggering a refetch of stale data.
//
// For the pre-configured multi-table subscription used at app level,
// see src/hooks/useRealtimeSubscription.ts instead.

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../config/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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

/**
 * Subscribe to real-time Postgres changes with a custom callback handler.
 * Use this when you need to process the payload (e.g. show notifications,
 * play sounds, update local state) rather than just invalidating a query.
 *
 * @param table - The Supabase table name to listen on
 * @param event - The event type to listen for ('INSERT' | 'UPDATE' | 'DELETE' | '*')
 * @param onPayload - Callback that receives the realtime payload
 * @param channelName - Optional custom channel name (defaults to `${table}_${event}`)
 *
 * @example
 * ```tsx
 * useRealtimeCallback('incidents', 'INSERT', (payload) => {
 *   const incident = payload.new;
 *   showToast(`New incident: ${incident.type}`);
 * });
 * ```
 */
export function useRealtimeCallback<T extends Record<string, unknown> = Record<string, unknown>>(
    table: string,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
    onPayload: (payload: RealtimePostgresChangesPayload<T>) => void,
    channelName?: string
) {
    // Use a ref to keep the callback stable without re-subscribing on every render
    const callbackRef = useRef(onPayload);
    callbackRef.current = onPayload;

    const stableCallback = useCallback(
        (payload: RealtimePostgresChangesPayload<T>) => callbackRef.current(payload),
        []
    );

    useEffect(() => {
        if (!supabase) return;

        const name = channelName || `${table}_${event}`;
        const channel = supabase
            .channel(name)
            .on(
                'postgres_changes',
                { event, schema: 'public', table },
                stableCallback as (payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>) => void
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [table, event, channelName, stableCallback]);
}

/**
 * Get the Supabase client for use in service functions called from hooks.
 * Prefer using this in useQuery/useMutation queryFn callbacks rather than
 * importing supabase directly in component files.
 */
export function getSupabaseClient() {
    return supabase;
}
