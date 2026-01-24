import { useState } from 'react';
import { supabase } from '../config/supabase';

interface WisdomEntry {
    id: string;
    question: string;
    answer: string;
    source?: string;
    source_role?: string;
    context?: string;
    category?: string;
    tags?: string[];
    useful_count: number;
}

export function useWisdom() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<WisdomEntry[]>([]);

    async function searchWisdom(query: string) {
        setLoading(true);

        // بحث بالكلمات المفتاحية
        const keywords = query.split(' ').filter(w => w.length > 2);

        // Construct OR query
        const orQuery = keywords.map(k => `question.ilike.%${k}%,answer.ilike.%${k}%`).join(',');

        const { data, error } = await supabase
            .from('wisdom_entries')
            .select('*')
            .or(orQuery)
            .order('useful_count', { ascending: false })
            .limit(5);

        if (data) setResults(data as WisdomEntry[]);
        if (error) {
            console.error('Error searching wisdom:', error);
            // Fallback for demo when table is empty or missing
            if (error.code === '42P01') {
                console.warn('Wisdom table missing, returning mock data');
                // Mock data fallback could go here
            }
        }
        setLoading(false);
        return data || [];
    }

    async function markUseful(entryId: string) {
        // Optimistic update
        setResults(prev => prev.map(e => e.id === entryId ? { ...e, usefulCount: e.useful_count + 1 } : e));

        await supabase.rpc('increment_wisdom_useful', { row_id: entryId });
    }

    return { searchWisdom, markUseful, results, loading };
}
