import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../config/supabase';

export interface CateringKPIs {
    totalMealsServed: number;
    specialDietsCount: number;
    satisfactionRate: number;
    wasteRate: number;
}

export interface MealLog {
    id: string;
    beneficiary_name: string;
    meal_type: string;
    status: 'pending' | 'delivered' | 'consumed' | 'refused';
    consumption: number;
    time: string;
}

export const useCateringLogic = () => {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<CateringKPIs>({
        totalMealsServed: 0,
        specialDietsCount: 0,
        satisfactionRate: 0,
        wasteRate: 0
    });
    const [todaysMeals, setTodaysMeals] = useState<MealLog[]>([]);

    useEffect(() => {
        fetchDashboardData();

        // Realtime subscription
        const subscription = supabase
            .channel('catering_dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_meals' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Stats
            const { count: specialDiets } = await supabase
                .from('dietary_plans')
                .select('*', { count: 'exact', head: true })
                .neq('plan_type', 'قياسي');

            const { data: meals } = await supabase
                .from('daily_meals')
                .select(`
                    id, 
                    meal_type, 
                    status, 
                    consumption_percentage, 
                    updated_at,
                    beneficiaries ( full_name )
                `)
                .eq('meal_date', new Date().toISOString().split('T')[0]);

            const delivered = meals?.filter(m => m.status === 'delivered' || m.status === 'consumed') || [];

            // KPI Calculations
            const totalServed = delivered.length;
            const avgConsumption = delivered.reduce((acc, curr) => acc + (curr.consumption_percentage || 0), 0) / (totalServed || 1);

            setKpis({
                totalMealsServed: totalServed,
                specialDietsCount: specialDiets || 0,
                satisfactionRate: Math.round(avgConsumption), // Proxy for satisfaction
                wasteRate: Math.round(100 - avgConsumption)
            });

            // Map for Table
            const logs = meals?.map(m => ({
                id: m.id,
                beneficiary_name: Array.isArray(m.beneficiaries) ? m.beneficiaries[0]?.full_name : (m.beneficiaries as any)?.full_name || 'غير معروف',
                meal_type: m.meal_type,
                status: m.status,
                consumption: m.consumption_percentage || 0,
                time: new Date(m.updated_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
            })) || [];

            setTodaysMeals(logs);

        } catch (error) {
            console.error('Error fetching catering data:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        kpis,
        todaysMeals,
        refresh: fetchDashboardData
    };
};
