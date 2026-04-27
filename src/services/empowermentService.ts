import { supabase } from '../config/supabase';

// Empowerment Service - التمكين والتأهيل

// Types
export interface RehabGoal {
    id: string;
    beneficiary_id: string;
    domain: string;
    goal_title: string;
    goal_description: string;
    measurement_type?: string;
    measurement_unit?: string;
    baseline_value?: number;
    target_value?: number;
    current_value?: number;
    quality_of_life_dimension?: string;
    start_date: string;
    target_date: string;
    assigned_to?: string;
    assigned_department?: string;
    status: 'planned' | 'in_progress' | 'achieved' | 'partially_achieved' | 'on_hold' | 'abandoned' | 'revised';
    progress_percentage: number;
    achievement_evidence?: string;
    barriers_notes?: string;
    family_involvement?: string;
    linked_national_goal?: string;
    created_at: string;
    updated_at: string;
}

export interface GoalProgressLog {
    id: string;
    goal_id: string;
    recorded_value?: number;
    previous_value?: number;
    progress_note?: string;
    session_type?: string;
    session_duration_minutes?: number;
    beneficiary_feedback?: string;
    family_feedback?: string;
    recorded_by: string;
    recorded_at: string;
}

export interface GoalTemplate {
    id: string;
    domain: string;
    goal_title: string;
    goal_description: string;
    measurement_type?: string;
    measurement_unit?: string;
    typical_duration_weeks?: number;
    difficulty_level?: string;
    age_group?: string;
    success_criteria?: string;
}

export interface BeneficiaryPreferences {
    id: string;
    beneficiary_id: string;
    preferred_name?: string;
    preferred_title?: string;
    communication_style?: string;
    preferred_activities?: string[];
    hobbies?: string[];
    strengths?: string[];
    favorite_foods?: string[];
    calming_strategies?: string[];
    motivators?: string[];
    what_makes_me_happy?: string;
    what_makes_me_upset?: string;
    my_dreams?: string;
    wake_up_time?: string;
    sleep_time?: string;
}

// Domains with Arabic labels
export const REHAB_DOMAINS = [
    { value: 'medical', label: 'طبي/صحي', icon: '🏥', color: 'red' },
    { value: 'physical', label: 'علاج طبيعي', icon: '🦿', color: 'blue' },
    { value: 'occupational', label: 'علاج وظيفي', icon: '🤲', color: 'purple' },
    { value: 'speech', label: 'نطق وتخاطب', icon: '🗣️', color: 'pink' },
    { value: 'psychological', label: 'نفسي/سلوكي', icon: '🧠', color: 'indigo' },
    { value: 'social', label: 'اجتماعي/دمج', icon: '👥', color: 'green' },
    { value: 'educational', label: 'تربية خاصة', icon: '📚', color: 'yellow' },
    { value: 'self_care', label: 'العناية الذاتية', icon: '🪥', color: 'teal' },
    { value: 'vocational', label: 'تأهيل مهني', icon: '💼', color: 'orange' },
];

// Quality of Life Dimensions
export const QOL_DIMENSIONS = [
    { value: 'physical_wellbeing', label: 'الرفاه الجسدي' },
    { value: 'emotional_wellbeing', label: 'الرفاه العاطفي' },
    { value: 'social_inclusion', label: 'الاندماج الاجتماعي' },
    { value: 'interpersonal_relations', label: 'العلاقات الشخصية' },
    { value: 'personal_development', label: 'التطور الشخصي' },
    { value: 'self_determination', label: 'تقرير المصير' },
    { value: 'material_wellbeing', label: 'الرفاه المادي' },
    { value: 'rights', label: 'الحقوق' },
];

// Demo Data
const DEMO_GOALS: RehabGoal[] = [
    {
        id: 'g0',
        beneficiary_id: '172', // محمد — أبو سعد (ربط مع ملف الكرامة)
        domain: 'self_care',
        goal_title: 'الإمساك بكوب الماء بشكل مستقل',
        goal_description: 'رفع قدرة المستفيد على الإمساك بكوب الماء بشكل مستقل من ٠٪ إلى ٨٠٪ خلال اثني عشر أسبوعاً',
        measurement_type: 'numeric',
        measurement_unit: '%',
        baseline_value: 0,
        target_value: 80,
        current_value: 35,
        quality_of_life_dimension: 'self_determination',
        start_date: '2026-01-15',
        target_date: '2026-04-09',
        assigned_to: 'أخصائي العلاج الوظيفي',
        assigned_department: 'العلاج الوظيفي',
        status: 'in_progress',
        progress_percentage: 44,
        linked_national_goal: 'تمكين ذوي الإعاقة',
        created_at: '2026-01-15',
        updated_at: '2026-04-25',
    },
    {
        id: '1',
        beneficiary_id: 'b1',
        domain: 'physical',
        goal_title: 'المشي باستقلالية لمسافة 50 متر',
        goal_description: 'تمكين المستفيد من المشي بشكل مستقل لمسافة 50 متر بدون مساعدة',
        measurement_type: 'numeric',
        measurement_unit: 'متر',
        baseline_value: 10,
        target_value: 50,
        current_value: 35,
        quality_of_life_dimension: 'physical_wellbeing',
        start_date: '2025-10-01',
        target_date: '2026-03-01',
        assigned_to: 'أخصائي العلاج الطبيعي',
        assigned_department: 'العلاج الطبيعي',
        status: 'in_progress',
        progress_percentage: 62,
        linked_national_goal: 'تمكين ذوي الإعاقة',
        created_at: '2025-10-01',
        updated_at: '2025-12-15',
    },
    {
        id: '2',
        beneficiary_id: 'b1',
        domain: 'self_care',
        goal_title: 'ارتداء الملابس العلوية باستقلالية',
        goal_description: 'تعليم المستفيد كيفية ارتداء القميص والجاكيت بشكل مستقل',
        measurement_type: 'milestone',
        quality_of_life_dimension: 'self_determination',
        start_date: '2025-11-01',
        target_date: '2026-04-01',
        assigned_to: 'أخصائي العلاج الوظيفي',
        assigned_department: 'العلاج الوظيفي',
        status: 'in_progress',
        progress_percentage: 40,
        created_at: '2025-11-01',
        updated_at: '2025-12-20',
    },
    {
        id: '3',
        beneficiary_id: 'b2',
        domain: 'speech',
        goal_title: 'نطق 20 كلمة جديدة بوضوح',
        goal_description: 'تحسين قدرة المستفيد على نطق كلمات جديدة بشكل واضح ومفهوم',
        measurement_type: 'numeric',
        measurement_unit: 'كلمة',
        baseline_value: 5,
        target_value: 20,
        current_value: 12,
        quality_of_life_dimension: 'interpersonal_relations',
        start_date: '2025-09-15',
        target_date: '2026-02-15',
        assigned_to: 'أخصائي النطق والتخاطب',
        assigned_department: 'النطق والتخاطب',
        status: 'in_progress',
        progress_percentage: 47,
        created_at: '2025-09-15',
        updated_at: '2025-12-18',
    },
];

const DEMO_TEMPLATES: GoalTemplate[] = [
    { id: '1', domain: 'physical', goal_title: 'المشي باستقلالية', goal_description: 'المشي لمسافة محددة بدون مساعدة', measurement_type: 'numeric', measurement_unit: 'متر', typical_duration_weeks: 12, difficulty_level: 'moderate', age_group: 'all' },
    { id: '2', domain: 'physical', goal_title: 'صعود الدرج', goal_description: 'صعود ونزول 10 درجات بأمان', measurement_type: 'milestone', typical_duration_weeks: 8, difficulty_level: 'challenging', age_group: 'all' },
    { id: '3', domain: 'self_care', goal_title: 'ارتداء الملابس', goal_description: 'ارتداء الملابس الخارجية باستقلالية', measurement_type: 'milestone', typical_duration_weeks: 16, difficulty_level: 'moderate', age_group: 'all' },
    { id: '4', domain: 'self_care', goal_title: 'تناول الطعام', goal_description: 'استخدام أدوات الطعام بشكل مستقل', measurement_type: 'scale', measurement_unit: 'درجة من 10', typical_duration_weeks: 12, difficulty_level: 'easy', age_group: 'all' },
    { id: '5', domain: 'speech', goal_title: 'نطق الكلمات', goal_description: 'نطق عدد محدد من الكلمات بوضوح', measurement_type: 'numeric', measurement_unit: 'كلمة', typical_duration_weeks: 24, difficulty_level: 'moderate', age_group: 'child' },
    { id: '6', domain: 'social', goal_title: 'التفاعل الاجتماعي', goal_description: 'المشاركة في نشاط جماعي', measurement_type: 'duration', measurement_unit: 'دقيقة', typical_duration_weeks: 12, difficulty_level: 'moderate', age_group: 'all' },
];

// Helper
const logError = (context: string, error: unknown) => {
    if (import.meta.env.DEV) {
        console.error(`[EmpowermentService] ${context}:`, error);
    }
};

const isSupabaseReady = (): boolean => !!supabase;

// Service

export const empowermentService = {
    // Helper to find a default beneficiary
    async getBeneficiariesLimit1() {
        if (!isSupabaseReady()) return { data: [] };
        return supabase.from('beneficiaries').select('id, full_name').limit(1);
    },

    // الأهداف التأهيلية
    async getGoals(beneficiaryId?: string): Promise<RehabGoal[]> {
        if (!isSupabaseReady()) return DEMO_GOALS;

        try {
            let query = supabase
                .from('rehab_goals')
                .select('*')
                .order('created_at', { ascending: false });

            if (beneficiaryId) {
                query = query.eq('beneficiary_id', beneficiaryId);
            }

            const { data, error } = await query;

            if (error || !data?.length) return DEMO_GOALS;
            return data;
        } catch (error) {
            logError('getGoals', error);
            return DEMO_GOALS;
        }
    },

    async saveGoal(goal: Partial<RehabGoal>): Promise<{ success: boolean; id?: string }> {
        if (!isSupabaseReady()) {
            return { success: true, id: 'demo-' + Date.now() };
        }

        try {
            const { data, error } = await supabase
                .from('rehab_goals')
                .insert(goal)
                .select('id')
                .single();

            if (error) {
                logError('saveGoal', error);
                return { success: false };
            }
            return { success: true, id: data.id };
        } catch (error) {
            logError('saveGoal', error);
            return { success: false };
        }
    },

    async updateGoalProgress(goalId: string, updates: Partial<RehabGoal>): Promise<boolean> {
        if (!isSupabaseReady()) {
            return true;
        }

        try {
            const { error } = await supabase
                .from('rehab_goals')
                .update(updates)
                .eq('id', goalId);

            if (error) {
                logError('updateGoalProgress', error);
                return false;
            }
            return true;
        } catch (error) {
            logError('updateGoalProgress', error);
            return false;
        }
    },

    // سجل التقدم
    async getProgressLogs(goalId: string): Promise<GoalProgressLog[]> {
        if (!isSupabaseReady()) return [];

        try {
            const { data, error } = await supabase
                .from('goal_progress_logs')
                .select('*')
                .eq('goal_id', goalId)
                .order('recorded_at', { ascending: false });

            if (error) {
                logError('getProgressLogs', error);
                return [];
            }
            return data || [];
        } catch (error) {
            logError('getProgressLogs', error);
            return [];
        }
    },

    async logProgress(log: Partial<GoalProgressLog>): Promise<boolean> {
        if (!isSupabaseReady()) {
            return true;
        }

        try {
            const { error } = await supabase
                .from('goal_progress_logs')
                .insert(log);

            if (error) {
                logError('logProgress', error);
                return false;
            }
            return true;
        } catch (error) {
            logError('logProgress', error);
            return false;
        }
    },

    // قوالب الأهداف
    async getGoalTemplates(domain?: string): Promise<GoalTemplate[]> {
        if (!isSupabaseReady()) {
            return domain ? DEMO_TEMPLATES.filter(t => t.domain === domain) : DEMO_TEMPLATES;
        }

        try {
            let query = supabase
                .from('goal_templates')
                .select('*')
                .eq('is_active', true);

            if (domain) {
                query = query.eq('domain', domain);
            }

            const { data, error } = await query;

            if (error || !data?.length) return DEMO_TEMPLATES;
            return data;
        } catch (error) {
            logError('getGoalTemplates', error);
            return DEMO_TEMPLATES;
        }
    },

    // تفضيلات المستفيد (ملف الكرامة)
    async getPreferences(beneficiaryId: string): Promise<BeneficiaryPreferences | null> {
        if (!isSupabaseReady()) return null;

        try {
            const { data, error } = await supabase
                .from('beneficiary_preferences')
                .select('*')
                .eq('beneficiary_id', beneficiaryId)
                .single();

            if (error) {
                logError('getPreferences', error);
                return null;
            }
            return data;
        } catch (error) {
            logError('getPreferences', error);
            return null;
        }
    },

    async savePreferences(prefs: Partial<BeneficiaryPreferences>): Promise<boolean> {
        if (!isSupabaseReady()) {
            return true;
        }

        try {
            const { error } = await supabase
                .from('beneficiary_preferences')
                .upsert(prefs, { onConflict: 'beneficiary_id' });

            if (error) {
                logError('savePreferences', error);
                return false;
            }
            return true;
        } catch (error) {
            logError('savePreferences', error);
            return false;
        }
    },

    // إحصائيات التمكين
    async getEmpowermentStats(): Promise<{
        totalGoals: number;
        achievedGoals: number;
        inProgressGoals: number;
        avgProgress: number;
    }> {
        const goals = await this.getGoals();

        return {
            totalGoals: goals.length,
            achievedGoals: goals.filter(g => g.status === 'achieved').length,
            inProgressGoals: goals.filter(g => g.status === 'in_progress').length,
            avgProgress: goals.length > 0
                ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length)
                : 0,
        };
    }
};

export default empowermentService;
