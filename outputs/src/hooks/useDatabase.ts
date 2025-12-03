
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getBeneficiaries,
    getBeneficiaryById,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
} from '../api/beneficiaries';
import { Beneficiary } from '../types';

export const useBeneficiaries = (filters?: any) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['beneficiaries', filters],
        queryFn: () => getBeneficiaries(), // Filters not implemented in API yet for simplicity
    });

    return {
        beneficiaries: data || [],
        loading: isLoading,
        error
    };
};

export const useBeneficiary = (id: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['beneficiary', id],
        queryFn: () => getBeneficiaryById(id),
        enabled: !!id,
    });

    return {
        beneficiary: data,
        loading: isLoading,
        error
    };
};

export const useBeneficiaryMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createBeneficiary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Beneficiary> }) =>
            updateBeneficiary(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
            queryClient.invalidateQueries({ queryKey: ['beneficiary', data.id] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBeneficiary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['beneficiaries'] });
        },
    });

    return {
        create: createMutation.mutateAsync,
        update: updateMutation.mutateAsync,
        remove: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
