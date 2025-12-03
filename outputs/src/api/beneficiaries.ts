
import { supabase } from '../config/supabase';
import { Beneficiary } from '../types';

export const getBeneficiaries = async () => {
    const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .order('full_name', { ascending: true });

    if (error) {
        console.error('Error fetching beneficiaries:', error);
        throw error;
    }

    return data as Beneficiary[];
};

export const getBeneficiaryById = async (id: string) => {
    const { data, error } = await supabase
        .from('beneficiaries')
        .select(`
            *,
            medical_profiles (*),
            rehabilitation_plans (*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching beneficiary ${id}:`, error);
        throw error;
    }

    return data;
};

export const createBeneficiary = async (beneficiary: Partial<Beneficiary>) => {
    const { data, error } = await supabase
        .from('beneficiaries')
        .insert([beneficiary])
        .select()
        .single();

    if (error) {
        console.error('Error creating beneficiary:', error);
        throw error;
    }

    return data;
};

export const updateBeneficiary = async (id: string, updates: Partial<Beneficiary>) => {
    const { data, error } = await supabase
        .from('beneficiaries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error updating beneficiary ${id}:`, error);
        throw error;
    }

    return data;
};

export const deleteBeneficiary = async (id: string) => {
    // Soft delete is often preferred, but here we'll do a hard delete or status update
    // Depending on requirements. Let's do a status update to 'exit' as per schema default?
    // Or actual delete if requested. The README says "delete (soft delete)".

    const { data, error } = await supabase
        .from('beneficiaries')
        .update({ status: 'exit' }) // Soft delete by changing status
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(`Error deleting beneficiary ${id}:`, error);
        throw error;
    }

    return data;
};

export const searchBeneficiaries = async (query: string) => {
    const { data, error } = await supabase
        .from('beneficiaries')
        .select('*')
        .ilike('full_name', `%${query}%`);

    if (error) {
        console.error('Error searching beneficiaries:', error);
        throw error;
    }

    return data as Beneficiary[];
};
