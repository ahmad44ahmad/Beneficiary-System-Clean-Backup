import axios from 'axios';
import { Beneficiary } from '../types';
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

export const getBeneficiaries = async (status?: string): Promise<Beneficiary[]> => {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/beneficiaries`, {
        params: { status },
        headers,
    });
    return response.data;
};

export const getBeneficiaryById = async (id: string): Promise<Beneficiary> => {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/beneficiaries/${id}`, { headers });
    return response.data;
};

export const createBeneficiary = async (data: Partial<Beneficiary>): Promise<Beneficiary> => {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_URL}/beneficiaries`, data, { headers });
    return response.data;
};

export const updateBeneficiary = async (id: string, data: Partial<Beneficiary>): Promise<Beneficiary> => {
    const headers = await getAuthHeader();
    const response = await axios.put(`${API_URL}/beneficiaries/${id}`, data, { headers });
    return response.data;
};

export const deleteBeneficiary = async (id: string): Promise<void> => {
    const headers = await getAuthHeader();
    await axios.delete(`${API_URL}/beneficiaries/${id}`, { headers });
};

// Statistics placeholder (to be implemented in backend)
export const getBeneficiariesStats = async () => {
    // This endpoint needs to be added to the backend
    // For now returning mock or fetching all and calculating
    const all = await getBeneficiaries();
    return {
        total: all.length,
        active: all.filter(b => b.status === 'active').length,
        male: all.filter(b => b.gender === 'male').length,
        female: all.filter(b => b.gender === 'female').length
    };
};
