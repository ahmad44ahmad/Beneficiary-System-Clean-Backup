import { supabase } from '../config/supabase';
import axios from 'axios';
import { RehabPlan, SmartGoal } from '../types/rehab';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeader = async () => {
    if (!supabase) return {};
    const { data } = await supabase.auth.getSession();
    if (data.session) {
        return { Authorization: `Bearer ${data.session.access_token}` };
    }
    return {};
};

export const getRehabilitationPlans = async (beneficiaryId?: string): Promise<RehabPlan[]> => {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/rehabilitation`, {
        params: { beneficiary_id: beneficiaryId },
        headers
    });
    return response.data;
};

export const createRehabilitationPlan = async (plan: Partial<RehabPlan>): Promise<RehabPlan> => {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_URL}/rehabilitation`, plan, { headers });
    return response.data;
};

export const addGoalToPlan = async (goal: Partial<SmartGoal> & { plan_id: string }): Promise<SmartGoal> => {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_URL}/rehabilitation/goals`, goal, { headers });
    return response.data;
};

export const updateGoalProgress = async (goalId: string, progress: number): Promise<SmartGoal> => {
    const headers = await getAuthHeader();
    const response = await axios.put(`${API_URL}/rehabilitation/goals/${goalId}/progress`, { progress }, { headers });
    return response.data;
};

export const approvePlan = async (planId: string, userId: string): Promise<RehabPlan> => {
    const headers = await getAuthHeader();
    const response = await axios.put(`${API_URL}/rehabilitation/${planId}/approve`, { userId }, { headers });
    return response.data;
};
