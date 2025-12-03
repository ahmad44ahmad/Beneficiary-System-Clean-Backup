import axios from 'axios';
import { RehabPlan, SmartGoal } from '../types'; // Fixed import path
import { getAuth } from 'firebase/auth';

const API_URL = import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const getAuthHeader = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return { Authorization: `Bearer ${token}` };
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
