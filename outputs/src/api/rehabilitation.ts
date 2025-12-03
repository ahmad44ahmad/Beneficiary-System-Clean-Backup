
import { supabase } from '../config/supabase';
import { RehabPlan, SmartGoal } from '../types/rehab';

export const getRehabilitationPlans = async (beneficiaryId?: string) => {
    let query = supabase
        .from('rehabilitation_plans')
        .select(`
            *,
            rehabilitation_goals (*)
        `);

    if (beneficiaryId) {
        query = query.eq('beneficiary_id', beneficiaryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching rehabilitation plans:', error);
        throw error;
    }

    return data;
};

export const createRehabilitationPlan = async (plan: Partial<RehabPlan>) => {
    const { data, error } = await supabase
        .from('rehabilitation_plans')
        .insert([plan])
        .select()
        .single();

    if (error) {
        console.error('Error creating rehabilitation plan:', error);
        throw error;
    }

    return data;
};

export const addGoalToPlan = async (goal: Partial<SmartGoal> & { plan_id: string }) => {
    const { data, error } = await supabase
        .from('rehabilitation_goals')
        .insert([goal])
        .select()
        .single();

    if (error) {
        console.error('Error adding goal:', error);
        throw error;
    }

    return data;
};

export const updateGoalProgress = async (goalId: string, progress: number) => {
    const { data, error } = await supabase
        .from('rehabilitation_goals')
        .update({ progress, updated_at: new Date().toISOString() })
        .eq('id', goalId)
        .select()
        .single();

    if (error) {
        console.error('Error updating goal progress:', error);
        throw error;
    }

    return data;
};

export const approvePlan = async (planId: string, userId: string) => {
    // This assumes a more complex approval logic might be needed, 
    // but for now we just update status
    const { data, error } = await supabase
        .from('rehabilitation_plans')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', planId)
        .select()
        .single();

    if (error) {
        console.error('Error approving plan:', error);
        throw error;
    }

    return data;
};
