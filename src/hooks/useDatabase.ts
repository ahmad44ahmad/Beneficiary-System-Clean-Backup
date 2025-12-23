import { useState, useEffect } from 'react';
import { supaService } from '../services/supaService';
import { Beneficiary } from '../types';
import { useAuth as useAppAuth } from '../context/AuthContext';

export const useBeneficiaries = (filters?: { status?: string }) => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useAppAuth();

    const fetchBeneficiaries = async () => {
        // if (!user && !filters?.force) return; // Optional: enforce auth
        try {
            setLoading(true);
            const data = await supaService.getBeneficiaries();
            // Filter locally for now as supaService.getBeneficiaries returns all
            const filtered = filters?.status
                ? data.filter(b => b.status === filters.status)
                : data;
            setBeneficiaries(filtered);
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
            const result = await supaService.createBeneficiary(data);
            if (!result) throw new Error("Failed to create beneficiary");
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
            await supaService.updateBeneficiary(id, data);
            return { id, ...data }; // Mock return since updateBeneficiary is void
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string) => {
        // Implement delete in supaService if needed, for now throw error or just log
        console.warn("Delete not implemented in supaService yet");
        // setLoading(true);
        // try {
        //     await deleteBeneficiary(id);
        // } catch (err) { ... }
    };

    return { create, update, remove, loading, error };
};

export const useAuth = useAppAuth;
