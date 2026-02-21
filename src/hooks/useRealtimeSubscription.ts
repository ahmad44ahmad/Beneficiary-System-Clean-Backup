// src/hooks/useRealtimeSubscription.ts
// Real-time Supabase subscription for critical data updates
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../config/supabase';
import { queryKeys } from './queries/keys';

/**
 * Subscribes to real-time changes on critical Supabase tables.
 * Automatically invalidates relevant queries when data changes.
 * 
 * Critical tables monitored:
 * - vital_signs: الإشارات الحيوية
 * - medications: الأدوية  
 * - incidents: الحوادث
 * - grc_risks: المخاطر
 * - fall_risk_assessments: تقييم مخاطر السقوط
 */
export const useRealtimeSubscription = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        // Skip if Supabase is not configured
        if (!supabase) {
            return;
        }

        const channel = supabase
            .channel('critical-updates')
            // الإشارات الحيوية - Critical
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'vital_signs' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.medical.all });
                }
            )
            // الأدوية - Critical
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'medications' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.medical.medications() });
                }
            )
            // الحوادث - Important
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'incidents' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
                }
            )
            // المخاطر - Important
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'grc_risks' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.grc.risks() });
                    queryClient.invalidateQueries({ queryKey: queryKeys.grc.stats() });
                }
            )
            // تقييم مخاطر السقوط - Critical
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'fall_risk_assessments' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.beneficiaries.all });
                    queryClient.invalidateQueries({ queryKey: queryKeys.stats.dashboard() });
                }
            )
            // المستفيدين - Normal priority
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'beneficiaries' },
                () => {
                    queryClient.invalidateQueries({ queryKey: queryKeys.beneficiaries.all });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);
};

export default useRealtimeSubscription;
