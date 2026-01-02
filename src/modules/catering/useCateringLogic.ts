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

// Demo data fallback when database is empty or not accessible
const DEMO_MEALS: MealLog[] = [
    { id: '1', beneficiary_name: 'أحمد محمد علي', meal_type: 'غداء', status: 'consumed', consumption: 85, time: '12:30' },
    { id: '2', beneficiary_name: 'فاطمة عبدالله', meal_type: 'غداء', status: 'consumed', consumption: 100, time: '12:35' },
    { id: '3', beneficiary_name: 'محمد سعيد', meal_type: 'غداء', status: 'delivered', consumption: 0, time: '12:40' },
    { id: '4', beneficiary_name: 'نورة أحمد', meal_type: 'غداء', status: 'pending', consumption: 0, time: '12:45' },
    { id: '5', beneficiary_name: 'خالد العمري', meal_type: 'غداء', status: 'refused', consumption: 0, time: '12:50' },
];

const DEMO_KPIS: CateringKPIs = {
    totalMealsServed: 127,
    specialDietsCount: 12,
    satisfactionRate: 89,
    wasteRate: 11
};

export const useCateringLogic = () => {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState<CateringKPIs>(DEMO_KPIS);
    const [todaysMeals, setTodaysMeals] = useState<MealLog[]>([]);
    const [usingDemoData, setUsingDemoData] = useState(false);

    useEffect(() => {
        fetchDashboardData();

        // Realtime subscription
        const subscription = supabase
            ?.channel('catering_dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_meals' }, () => {
                fetchDashboardData();
            })
            .subscribe();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            if (!supabase) {
                // Use demo data if no supabase
                setKpis(DEMO_KPIS);
                setTodaysMeals(DEMO_MEALS);
                setUsingDemoData(true);
                return;
            }

            // 1. Fetch Stats
            const { count: specialDiets, error: dietError } = await supabase
                .from('dietary_plans')
                .select('*', { count: 'exact', head: true })
                .neq('plan_type', 'قياسي');

            const { data: meals, error: mealsError } = await supabase
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

            // If errors or no data, use demo data
            if (dietError || mealsError || !meals?.length) {
                if (import.meta.env.DEV) {
                    console.log('[Catering] Using demo data - tables may be empty');
                }
                setKpis(DEMO_KPIS);
                setTodaysMeals(DEMO_MEALS);
                setUsingDemoData(true);
                return;
            }

            const delivered = meals?.filter(m => m.status === 'delivered' || m.status === 'consumed') || [];

            // KPI Calculations
            const totalServed = delivered.length;
            const avgConsumption = delivered.reduce((acc, curr) => acc + (curr.consumption_percentage || 0), 0) / (totalServed || 1);

            setKpis({
                totalMealsServed: totalServed,
                specialDietsCount: specialDiets || 0,
                satisfactionRate: Math.round(avgConsumption),
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
            setUsingDemoData(false);

        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('[Catering] Error, using demo data:', error);
            }
            // Fallback to demo data on any error
            setKpis(DEMO_KPIS);
            setTodaysMeals(DEMO_MEALS);
            setUsingDemoData(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        kpis,
        todaysMeals,
        usingDemoData,
        refresh: fetchDashboardData
    };
};
