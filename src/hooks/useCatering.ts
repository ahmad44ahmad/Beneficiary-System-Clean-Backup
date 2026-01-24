import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Meal, CateringViolation, QualityCheck } from '../types/catering';

export function useCatering() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [violations, setViolations] = useState<CateringViolation[]>([]);
    const [checks, setChecks] = useState<QualityCheck[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        // Realtime subscription
        const mealsChannel = supabase
            .channel('meals-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' },
                () => fetchMeals())
            .subscribe();

        const violationsChannel = supabase
            .channel('violations-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'catering_violations' },
                () => fetchViolations())
            .subscribe();

        return () => {
            supabase.removeChannel(mealsChannel);
            supabase.removeChannel(violationsChannel);
        };
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            await Promise.all([fetchMeals(), fetchViolations(), fetchChecks()]);
        } catch (error) {
            console.error("Error fetching catering data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchMeals() {
        const { data } = await supabase
            .from('meals')
            .select('*')
            .order('scheduled_date', { ascending: true });
        if (data) setMeals(data as Meal[]);
    }

    async function fetchViolations() {
        const { data } = await supabase
            .from('catering_violations')
            .select('*')
            .order('reported_at', { ascending: false });
        if (data) setViolations(data as CateringViolation[]);
    }

    async function fetchChecks() {
        const { data } = await supabase
            .from('quality_checks')
            .select('*')
            .order('check_date', { ascending: false });
        if (data) setChecks(data as QualityCheck[]);
    }

    async function addMeal(meal: Omit<Meal, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('meals').insert(meal).select().single();
        if (error) throw error;
        return data;
    }

    async function reportViolation(violation: Omit<CateringViolation, 'id' | 'reported_at'>) {
        const { data, error } = await supabase.from('catering_violations').insert(violation).select().single();
        if (error) throw error;
        return data;
    }

    async function submitQualityCheck(check: Omit<QualityCheck, 'id' | 'created_at'>) {
        const { data, error } = await supabase.from('quality_checks').insert(check).select().single();
        if (error) throw error;
        return data;
    }

    return {
        meals,
        violations,
        checks,
        loading,
        addMeal,
        reportViolation,
        submitQualityCheck,
        refresh: fetchData,
    };
}
