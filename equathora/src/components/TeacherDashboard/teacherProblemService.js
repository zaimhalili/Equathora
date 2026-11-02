import { supabase } from '../../lib/supabaseClient';

export async function getAssignableProblems() {
    const pageSize = 500;
    const problems = [];
    let offset = 0;

    while (true) {
        const { data, error } = await supabase
            .from('problems')
            .select('id, title, topic, difficulty, slug')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .order('id', { ascending: true })
            .range(offset, offset + pageSize - 1);

        if (error) {
            console.error('Unable to fetch problems for teacher assignments:', error);
            throw new Error('Exercises could not be loaded. Please try again.');
        }

        problems.push(...(data ?? []));
        if (!data || data.length < pageSize) return problems;
        offset += pageSize;
    }
}
