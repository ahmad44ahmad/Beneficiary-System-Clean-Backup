import { supabase } from '../config/supabase';

// Types
export interface WellbeingScore {
    beneficiary_id: string;
    full_name: string;
    file_number: string;
    section: string;
    room_number: string;
    mobility_type: string;
    status: string;
    health_score: number;
    nutrition_score: number;
    safety_score: number;
    mood_score: number;
    activity_score: number;
    wellbeing_score: number;
    status_color: 'أخضر' | 'أصفر' | 'أحمر';
    requires_followup: boolean;
    fall_risk_level: string;
}

export interface WellbeingStats {
    total_beneficiaries: number;
    avg_wellbeing_score: number;
    green_count: number;
    yellow_count: number;
    red_count: number;
    needs_followup_count: number;
    high_fall_risk_count: number;
    avg_health_score: number;
    avg_nutrition_score: number;
    avg_safety_score: number;
    avg_mood_score: number;
}

export interface EarlyWarning {
    beneficiary_id: string;
    full_name: string;
    file_number: string;
    section: string;
    wellbeing_score: number;
    status_color: string;
    warning_reason: string;
}

// Demo data for when database views aren't available
const DEMO_BENEFICIARIES: WellbeingScore[] = [
    { beneficiary_id: '1', full_name: 'أحمد محمد الغامدي', file_number: 'M-001', section: 'ذكور', room_number: '101', mobility_type: 'مشي_مستقل', status: 'نشط', health_score: 85, nutrition_score: 90, safety_score: 75, mood_score: 80, activity_score: 70, wellbeing_score: 82, status_color: 'أخضر', requires_followup: false, fall_risk_level: 'منخفض' },
    { beneficiary_id: '2', full_name: 'محمد سعيد الزهراني', file_number: 'M-002', section: 'ذكور', room_number: '102', mobility_type: 'كرسي_متحرك', status: 'نشط', health_score: 70, nutrition_score: 65, safety_score: 55, mood_score: 60, activity_score: 50, wellbeing_score: 62, status_color: 'أصفر', requires_followup: true, fall_risk_level: 'متوسط' },
    { beneficiary_id: '3', full_name: 'عبدالله حسن العمري', file_number: 'M-003', section: 'ذكور', room_number: '103', mobility_type: 'طريح_فراش', status: 'نشط', health_score: 45, nutrition_score: 40, safety_score: 35, mood_score: 50, activity_score: 30, wellbeing_score: 42, status_color: 'أحمر', requires_followup: true, fall_risk_level: 'عالي' },
    { beneficiary_id: '4', full_name: 'سعد فهد القرني', file_number: 'M-004', section: 'ذكور', room_number: '104', mobility_type: 'مشي_بمساعدة', status: 'نشط', health_score: 75, nutrition_score: 80, safety_score: 70, mood_score: 85, activity_score: 75, wellbeing_score: 76, status_color: 'أصفر', requires_followup: false, fall_risk_level: 'منخفض' },
    { beneficiary_id: '5', full_name: 'خالد عبدالرحمن الشمراني', file_number: 'M-005', section: 'ذكور', room_number: '105', mobility_type: 'مشي_مستقل', status: 'نشط', health_score: 90, nutrition_score: 95, safety_score: 85, mood_score: 90, activity_score: 80, wellbeing_score: 89, status_color: 'أخضر', requires_followup: false, fall_risk_level: 'منخفض' },
    { beneficiary_id: '6', full_name: 'فهد ناصر الحارثي', file_number: 'M-006', section: 'ذكور', room_number: '106', mobility_type: 'كرسي_متحرك', status: 'نشط', health_score: 55, nutrition_score: 50, safety_score: 45, mood_score: 55, activity_score: 40, wellbeing_score: 50, status_color: 'أحمر', requires_followup: true, fall_risk_level: 'عالي' },
    { beneficiary_id: '7', full_name: 'علي مسفر الغامدي', file_number: 'M-007', section: 'ذكور', room_number: '107', mobility_type: 'مشي_مستقل', status: 'نشط', health_score: 88, nutrition_score: 85, safety_score: 90, mood_score: 80, activity_score: 85, wellbeing_score: 86, status_color: 'أخضر', requires_followup: false, fall_risk_level: 'منخفض' },
    { beneficiary_id: '8', full_name: 'حسن عامر الشهري', file_number: 'M-008', section: 'ذكور', room_number: '108', mobility_type: 'مشي_بمساعدة', status: 'نشط', health_score: 68, nutrition_score: 72, safety_score: 60, mood_score: 65, activity_score: 55, wellbeing_score: 65, status_color: 'أصفر', requires_followup: false, fall_risk_level: 'متوسط' },
];

const DEMO_STATS: WellbeingStats = {
    total_beneficiaries: 145,
    avg_wellbeing_score: 72.5,
    green_count: 89,
    yellow_count: 42,
    red_count: 14,
    needs_followup_count: 23,
    high_fall_risk_count: 12,
    avg_health_score: 74.2,
    avg_nutrition_score: 78.1,
    avg_safety_score: 68.5,
    avg_mood_score: 71.3
};

// Helper for logging
const logError = (context: string, error: any) => {
    if (import.meta.env.DEV) {
        console.error(`[WellbeingService] ${context}:`, error);
    }
};

const isSupabaseReady = (): boolean => {
    return !!supabase;
};

export const wellbeingService = {

    // Get all wellbeing scores
    async getWellbeingScores(): Promise<WellbeingScore[]> {
        if (!isSupabaseReady()) {
            return DEMO_BENEFICIARIES;
        }

        try {
            const { data, error } = await supabase
                .from('v_wellbeing_index')
                .select('*')
                .order('wellbeing_score', { ascending: true });

            if (error || !data?.length) {
                if (import.meta.env.DEV) {
                    console.log('[WellbeingService] Using demo data - view may not exist');
                }
                return DEMO_BENEFICIARIES;
            }

            return data;
        } catch (error) {
            logError('getWellbeingScores', error);
            return DEMO_BENEFICIARIES;
        }
    },

    // Get statistics summary
    async getWellbeingStats(): Promise<WellbeingStats> {
        if (!isSupabaseReady()) {
            return DEMO_STATS;
        }

        try {
            const { data, error } = await supabase
                .from('v_wellbeing_stats')
                .select('*')
                .single();

            if (error || !data) {
                return DEMO_STATS;
            }

            return data;
        } catch (error) {
            logError('getWellbeingStats', error);
            return DEMO_STATS;
        }
    },

    // Get early warning list
    async getEarlyWarnings(): Promise<EarlyWarning[]> {
        if (!isSupabaseReady()) {
            return DEMO_BENEFICIARIES
                .filter(b => b.wellbeing_score < 60 || b.requires_followup)
                .map(b => ({
                    ...b,
                    warning_reason: b.wellbeing_score < 50
                        ? 'درجة رفاهية منخفضة جداً'
                        : 'يحتاج متابعة'
                }));
        }

        try {
            const { data, error } = await supabase
                .from('v_early_warning_report')
                .select('*')
                .order('wellbeing_score', { ascending: true });

            if (error || !data?.length) {
                return DEMO_BENEFICIARIES
                    .filter(b => b.wellbeing_score < 60)
                    .map(b => ({
                        ...b,
                        warning_reason: 'درجة رفاهية منخفضة'
                    }));
            }

            return data;
        } catch (error) {
            logError('getEarlyWarnings', error);
            return [];
        }
    },

    // Get single beneficiary score with details
    async getBeneficiaryScore(beneficiaryId: string): Promise<WellbeingScore | null> {
        if (!isSupabaseReady()) {
            return DEMO_BENEFICIARIES.find(b => b.beneficiary_id === beneficiaryId) || null;
        }

        try {
            const { data, error } = await supabase
                .from('v_wellbeing_index')
                .select('*')
                .eq('beneficiary_id', beneficiaryId)
                .single();

            if (error || !data) {
                return DEMO_BENEFICIARIES.find(b => b.beneficiary_id === beneficiaryId) || null;
            }

            return data;
        } catch (error) {
            logError('getBeneficiaryScore', error);
            return null;
        }
    },

    // Calculate score locally (for demo/offline)
    calculateLocalScore(
        healthScore: number,
        nutritionScore: number,
        safetyScore: number,
        moodScore: number,
        activityScore: number
    ): { score: number; color: 'أخضر' | 'أصفر' | 'أحمر' } {
        const score = Math.round(
            healthScore * 0.30 +
            nutritionScore * 0.20 +
            safetyScore * 0.20 +
            moodScore * 0.15 +
            activityScore * 0.15
        );

        const color = score >= 80 ? 'أخضر' : score >= 60 ? 'أصفر' : 'أحمر';

        return { score, color };
    },

    // Get color for score
    getScoreColor(score: number): string {
        if (score >= 80) return '#2DB473'; // Green
        if (score >= 60) return '#FAB414'; // Yellow
        return '#DC2626'; // Red
    },

    // Get score label
    getScoreLabel(score: number): string {
        if (score >= 80) return 'ممتاز';
        if (score >= 70) return 'جيد';
        if (score >= 60) return 'مقبول';
        if (score >= 50) return 'يحتاج متابعة';
        return 'حرج';
    }
};
