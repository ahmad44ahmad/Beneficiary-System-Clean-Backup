// useGrcStats - TanStack Query hook for GRC (Governance, Risk, Compliance) analytics
// Provides dashboard statistics and risk metrics

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase';

// Query keys for GRC cache management
export const grcKeys = {
    all: ['grc'] as const,
    stats: () => [...grcKeys.all, 'stats'] as const,
    risks: () => [...grcKeys.all, 'risks'] as const,
    compliance: () => [...grcKeys.all, 'compliance'] as const,
    ncrs: () => [...grcKeys.all, 'ncrs'] as const,
};

interface GrcStats {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    openRisks: number;
    mitigatingRisks: number;
    closedRisks: number;
    complianceRate: number;
    openNCRs: number;
    averageNCRProgress: number;
}

interface RiskByCategory {
    category: string;
    count: number;
    averageScore: number;
}

/**
 * Check if Supabase is ready
 */
function isSupabaseReady(): boolean {
    return !!(supabase && typeof supabase.from === 'function');
}

/**
 * Hook to fetch GRC dashboard statistics
 */
export function useGrcStats() {
    return useQuery({
        queryKey: grcKeys.stats(),
        queryFn: async (): Promise<GrcStats> => {
            // Default stats if Supabase not available
            const defaultStats: GrcStats = {
                totalRisks: 12,
                criticalRisks: 4,
                highRisks: 3,
                mediumRisks: 3,
                lowRisks: 2,
                openRisks: 1,
                mitigatingRisks: 6,
                closedRisks: 0,
                complianceRate: 67,
                openNCRs: 3,
                averageNCRProgress: 33,
            };

            if (!isSupabaseReady()) return defaultStats;

            try {
                // Try to fetch from grc_risks table if it exists
                const { data: risks, error: risksError } = await supabase
                    .from('grc_risks')
                    .select('*');

                if (risksError || !risks) {
                    return defaultStats;
                }

                // Calculate risk statistics
                const criticalRisks = risks.filter(r => r.risk_score >= 15).length;
                const highRisks = risks.filter(r => r.risk_score >= 10 && r.risk_score < 15).length;
                const mediumRisks = risks.filter(r => r.risk_score >= 5 && r.risk_score < 10).length;
                const lowRisks = risks.filter(r => r.risk_score < 5).length;
                const openRisks = risks.filter(r => r.status === 'open').length;
                const mitigatingRisks = risks.filter(r => r.status === 'mitigating').length;
                const closedRisks = risks.filter(r => r.status === 'closed').length;

                // Fetch NCRs
                const { data: ncrs } = await supabase
                    .from('grc_ncrs')
                    .select('progress, status');

                const openNCRs = ncrs?.filter(n => n.status !== 'closed').length || 0;
                const avgProgress = ncrs && ncrs.length > 0
                    ? Math.round(ncrs.reduce((sum, n) => sum + (n.progress || 0), 0) / ncrs.length)
                    : 0;

                // Fetch compliance
                const { data: compliance } = await supabase
                    .from('grc_compliance')
                    .select('status');

                const compliant = compliance?.filter(c => c.status === 'compliant').length || 0;
                const total = compliance?.length || 1;
                const complianceRate = Math.round((compliant / total) * 100);

                return {
                    totalRisks: risks.length,
                    criticalRisks,
                    highRisks,
                    mediumRisks,
                    lowRisks,
                    openRisks,
                    mitigatingRisks,
                    closedRisks,
                    complianceRate,
                    openNCRs,
                    averageNCRProgress: avgProgress,
                };
            } catch (error) {
                console.error('Error fetching GRC stats:', error);
                return defaultStats;
            }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook to fetch risk breakdown by category
 */
export function useRisksByCategory() {
    return useQuery({
        queryKey: [...grcKeys.risks(), 'byCategory'],
        queryFn: async (): Promise<RiskByCategory[]> => {
            const defaultData: RiskByCategory[] = [
                { category: 'clinical', count: 4, averageScore: 14 },
                { category: 'safety', count: 3, averageScore: 14 },
                { category: 'social', count: 3, averageScore: 11 },
                { category: 'infrastructure', count: 1, averageScore: 12 },
                { category: 'contractual', count: 2, averageScore: 9 },
            ];

            if (!isSupabaseReady()) return defaultData;

            try {
                const { data: risks } = await supabase
                    .from('grc_risks')
                    .select('category, risk_score');

                if (!risks || risks.length === 0) return defaultData;

                // Group by category
                const categoryMap = new Map<string, { count: number; totalScore: number }>();

                risks.forEach(risk => {
                    const existing = categoryMap.get(risk.category) || { count: 0, totalScore: 0 };
                    categoryMap.set(risk.category, {
                        count: existing.count + 1,
                        totalScore: existing.totalScore + (risk.risk_score || 0),
                    });
                });

                return Array.from(categoryMap.entries()).map(([category, data]) => ({
                    category,
                    count: data.count,
                    averageScore: Math.round(data.totalScore / data.count),
                }));
            } catch (error) {
                console.error('Error fetching risks by category:', error);
                return defaultData;
            }
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch compliance requirements status
 */
export function useComplianceStatus() {
    return useQuery({
        queryKey: grcKeys.compliance(),
        queryFn: async () => {
            const defaultData = {
                compliant: 4,
                partial: 3,
                nonCompliant: 1,
                inProgress: 1,
                total: 9,
            };

            if (!isSupabaseReady()) return defaultData;

            try {
                const { data: compliance } = await supabase
                    .from('grc_compliance')
                    .select('status');

                if (!compliance) return defaultData;

                return {
                    compliant: compliance.filter(c => c.status === 'compliant').length,
                    partial: compliance.filter(c => c.status === 'partial').length,
                    nonCompliant: compliance.filter(c => c.status === 'non_compliant').length,
                    inProgress: compliance.filter(c => c.status === 'in_progress').length,
                    total: compliance.length,
                };
            } catch (error) {
                console.error('Error fetching compliance status:', error);
                return defaultData;
            }
        },
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch NCR (Non-Conformance Report) list
 */
export function useNCRs() {
    return useQuery({
        queryKey: grcKeys.ncrs(),
        queryFn: async () => {
            if (!isSupabaseReady()) return [];

            try {
                const { data, error } = await supabase
                    .from('grc_ncrs')
                    .select('*')
                    .order('due_date', { ascending: true });

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Error fetching NCRs:', error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
    });
}
