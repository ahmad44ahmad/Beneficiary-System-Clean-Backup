import { useState, useEffect } from 'react';
import {
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
} from '../api/beneficiaries';
import { Beneficiary } from '../types';
import { useAuth as useFirebaseAuth } from '../contexts/AuthContext';

export const useBeneficiaries = (filters?: { status?: string }) => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useFirebaseAuth();

    const fetchBeneficiaries = async () => {
        if (!user) return; // Wait for auth
        try {
            setLoading(true);
            const data = await getBeneficiaries(filters?.status);
            setBeneficiaries(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, [filters?.status, user]);

    return { beneficiaries, loading, error, refetch: fetchBeneficiaries };
};

export const useBeneficiaryMutations = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = async (data: Partial<Beneficiary>) => {
        setLoading(true);
        try {
            const result = await createBeneficiary(data);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const update = async (id: string, data: Partial<Beneficiary>) => {
        setLoading(true);
        try {
            const result = await updateBeneficiary(id, data);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        setLoading(true);
        try {
            await deleteBeneficiary(id);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, update, remove, loading, error };
};

// Re-export useAuth for compatibility
export const useAuth = useFirebaseAuth;
