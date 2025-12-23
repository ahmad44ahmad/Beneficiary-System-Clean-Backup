import { supabase } from '../config/supabase';
import { Beneficiary } from '../types';

export const getBeneficiaries = async (status?: string): Promise<Beneficiary[]> => {
    let query = supabase.from('beneficiaries').select('*');
    if (status) {
        query = query.eq('status', status);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};

export const getBeneficiaryById = async (id: string): Promise<Beneficiary> => {
    const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

export const createBeneficiary = async (data: Partial<Beneficiary>): Promise<Beneficiary> => {
    const { data: result, error } = await supabase
        .from('beneficiaries')
        .insert(data)
        .select()
        .single();

    if (error) throw error;
    return result;
};

export const updateBeneficiary = async (id: string, data: Partial<Beneficiary>): Promise<Beneficiary> => {
    const { data: result, error } = await supabase
        .from('beneficiaries')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return result;
};

export const deleteBeneficiary = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('beneficiaries')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const getBeneficiariesStats = async () => {
    const { count: total } = await supabase.from('beneficiaries').select('*', { count: 'exact', head: true });
    const { count: active } = await supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: male } = await supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('gender', 'MALE');
    const { count: female } = await supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('gender', 'FEMALE');

    return {
        total: total || 0,
        active: active || 0,
        male: male || 0,
        female: female || 0
    };
};
