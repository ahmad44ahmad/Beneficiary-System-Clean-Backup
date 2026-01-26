import { supabase } from '../config/supabase';
import { ShiftHandoverItem, ShiftType, ShiftSummary } from '../types/shift';

export const shiftService = {
    async getShiftItems(shiftType?: ShiftType): Promise<ShiftHandoverItem[]> {
        let query = supabase
            .from('shift_handover_items')
            .select(`
                *,
                beneficiaries (
                    full_name
                )
            `)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (shiftType) {
            query = query.eq('shift_type', shiftType);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching shift items:', error);
            throw error;
        }

        return data.map((item: any) => ({
            ...item,
            beneficiaryName: item.beneficiaries?.full_name
        }));
    },

    async addShiftItem(item: Omit<ShiftHandoverItem, 'id' | 'created_at'>): Promise<ShiftHandoverItem> {
        const { data, error } = await supabase
            .from('shift_handover_items')
            .insert(item)
            .select()
            .single();

        if (error) {
            console.error('Error adding shift item:', error);
            throw error;
        }

        return data;
    },

    async updateShiftItem(id: string, updates: Partial<ShiftHandoverItem>): Promise<void> {
        const { error } = await supabase
            .from('shift_handover_items')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating shift item:', error);
            throw error;
        }
    },

    async deleteShiftItem(id: string): Promise<void> {
        const { error } = await supabase
            .from('shift_handover_items')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting shift item:', error);
            throw error;
        }
    },

    async getShiftSummary(shiftType: ShiftType): Promise<ShiftSummary> {
        // This is a placeholder for actual aggregation logic
        // In a real app, you might want to create a database function to calculate these stats
        return {
            shiftType,
            startTime: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            endTime: new Date(Date.now() + 8 * 3600 * 1000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            staffName: 'المستخدم الحالي', // Replace with actual logged-in user
            totalBeneficiaries: 145, // Replace with actual count query
            medicationsGiven: 48, // Replace with actual count query
            incidentsReported: 1, // Replace with actual count query
            assessmentsCompleted: 32 // Replace with actual count query
        };
    }
};
