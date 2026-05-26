import { supabase } from './supabaseClient';

const isMissingSupabaseResourceError = (error) => {
    const status = Number(error?.status || error?.code || 0);
    const code = String(error?.code || '').toUpperCase();
    const message = String(error?.message || '').toLowerCase();
    return status === 404
        || status === 42
        || code === 'PGRST205'
        || message.includes('does not exist')
        || message.includes('schema cache')
        || message.includes('relation') && message.includes('attempts');
};

const attemptsTableFlagKey = 'equathora_attempts_table_missing';
let attemptsTableUnavailable = false;

const readAttemptsTableFlag = () => {
    try {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem(attemptsTableFlagKey) === 'true';
    } catch {
        return false;
    }
};

const markAttemptsTableMissing = () => {
    attemptsTableUnavailable = true;
    try {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(attemptsTableFlagKey, 'true');
    } catch {
        // Ignore localStorage failures.
    }
};

attemptsTableUnavailable = readAttemptsTableFlag();

const fetchAdminProblemDetailFromSupabase = async (problemId) => {
    const { data: problem, error } = await supabase
        .from('problems')
        .select('id, group_id, title, description, answer, accepted_answers, hints, solution, is_premium, topic, display_order, slug, created_at, updated_at, difficulty')
        .eq('id', problemId)
        .single();

    if (error) {
        throw error;
    }

    let attemptRows = [];
    if (!attemptsTableUnavailable) {
        try {
            const { data: attempts, error: attemptsError } = await supabase
                .from('attempts')
                .select('is_correct')
                .eq('problem_id', problemId);

            if (attemptsError) {
                throw attemptsError;
            }

            attemptRows = Array.isArray(attempts) ? attempts : [];
        } catch (attemptsError) {
            if (isMissingSupabaseResourceError(attemptsError)) {
                markAttemptsTableMissing();
            } else {
                console.warn('Could not read attempts for problem detail; using 0 metrics.', attemptsError);
            }
        }
    }

    const solvedCount = attemptRows.filter((row) => row?.is_correct).length;
    const totalAttempts = attemptRows.length;
    const solveRate = totalAttempts === 0
        ? 0
        : Number(((solvedCount / totalAttempts) * 100).toFixed(1));

    return {
        id: problem?.id,
        group_id: problem?.group_id,
        title: problem?.title,
        description: problem?.description,
        answer: problem?.answer,
        acceptedAnswers: problem?.accepted_answers || [],
        hints: problem?.hints || [],
        solution: problem?.solution,
        premium: Boolean(problem?.is_premium),
        topic: problem?.topic,
        displayOrder: problem?.display_order,
        slug: problem?.slug,
        createdAt: problem?.created_at,
        updatedAt: problem?.updated_at,
        difficulty: problem?.difficulty,
        attempts: totalAttempts,
        solvedCount,
        solveRate
    };
};

const fetchAllAdminProblemDetailsFromSupabase = async () => {
    const { data: problems, error } = await supabase
        .from('problems')
        .select('id, group_id, title, description, answer, accepted_answers, hints, solution, is_premium, topic, display_order, slug, created_at, updated_at, difficulty')
        .eq('is_active', true)
        .order('id', { ascending: true });

    if (error) {
        throw error;
    }

    let attempts = [];
    if (!attemptsTableUnavailable) {
        try {
            const { data: attemptsData, error: attemptsError } = await supabase
                .from('attempts')
                .select('problem_id, is_correct');

            if (attemptsError) {
                throw attemptsError;
            }

            attempts = Array.isArray(attemptsData) ? attemptsData : [];
        } catch (attemptsError) {
            if (isMissingSupabaseResourceError(attemptsError)) {
                markAttemptsTableMissing();
            } else {
                console.warn('Could not read attempts for bulk details; using 0 metrics.', attemptsError);
            }
        }
    }

    const statsByProblemId = attempts.reduce((map, row) => {
        const problemId = Number(row?.problem_id);
        if (!Number.isFinite(problemId)) return map;

        if (!map.has(problemId)) {
            map.set(problemId, { attempts: 0, solvedCount: 0 });
        }

        const target = map.get(problemId);
        target.attempts += 1;
        if (row?.is_correct) {
            target.solvedCount += 1;
        }
        return map;
    }, new Map());

    return (Array.isArray(problems) ? problems : []).map((problem) => {
        const stat = statsByProblemId.get(Number(problem?.id)) || { attempts: 0, solvedCount: 0 };
        const solveRate = stat.attempts === 0
            ? 0
            : Number(((stat.solvedCount / stat.attempts) * 100).toFixed(1));

        return {
            id: problem?.id,
            group_id: problem?.group_id,
            title: problem?.title,
            description: problem?.description,
            answer: problem?.answer,
            acceptedAnswers: problem?.accepted_answers || [],
            hints: problem?.hints || [],
            solution: problem?.solution,
            premium: Boolean(problem?.is_premium),
            topic: problem?.topic,
            displayOrder: problem?.display_order,
            slug: problem?.slug,
            createdAt: problem?.created_at,
            updatedAt: problem?.updated_at,
            difficulty: problem?.difficulty,
            attempts: stat.attempts,
            solvedCount: stat.solvedCount,
            solveRate
        };
    });
};

export async function getAllAdminProblemDetails() {
    try {
        return await fetchAllAdminProblemDetailsFromSupabase();
    } catch {
        throw new Error('Failed to preload problem details right now. Please try again shortly.');
    }
}

export async function getAdminProblemDetails(problemId) {
    const numericId = Number(problemId);
    if (!Number.isFinite(numericId)) {
        throw new Error('Invalid problem id');
    }

    try {
        return await fetchAdminProblemDetailFromSupabase(numericId);
    } catch {
        throw new Error('Failed to load problem details right now. Please try again shortly.');
    }
}

const fetchSupabaseProblemsPage = async ({ page, pageSize }) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabase
        .from('problems')
        .select('id, title, description, topic, difficulty, is_premium, slug, created_at, is_active', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) {
        throw error;
    }

    return {
        data: Array.isArray(data) ? data : [],
        count: Number(count || 0),
        page,
        pageSize
    };
};

const fetchAllSupabaseAttempts = async ({ pageSize = 2000 } = {}) => {
    if (attemptsTableUnavailable) {
        return [];
    }

    let page = 1;
    const allAttempts = [];
    const maxPages = 2000;

    while (page <= maxPages) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        const { data, error } = await supabase
            .from('attempts')
            .select('problem_id, is_correct')
            .range(start, end);

        if (error) {
            if (isMissingSupabaseResourceError(error)) {
                markAttemptsTableMissing();
                return [];
            }
            throw error;
        }

        const current = Array.isArray(data) ? data : [];
        allAttempts.push(...current);

        if (current.length < pageSize) {
            break;
        }

        page += 1;
    }

    return allAttempts;
};

const attachProgressFromSupabase = async (rows) => {
    if (!rows.length) return rows;

    let attempts = [];
    try {
        attempts = await fetchAllSupabaseAttempts();
    } catch (error) {
        if (!isMissingSupabaseResourceError(error)) {
            console.warn('Could not load attempts for admin problems metrics:', error);
        }
    }

    const statsByProblem = attempts.reduce((map, row) => {
        const problemId = Number(row?.problem_id);
        if (!Number.isFinite(problemId)) return map;

        if (!map.has(problemId)) {
            map.set(problemId, { attempts: 0, correct: 0 });
        }

        const target = map.get(problemId);
        target.attempts += 1;
        if (row?.is_correct) {
            target.correct += 1;
        }
        return map;
    }, new Map());

    return rows.map((row) => {
        const problemId = Number(row?.id);
        const stat = statsByProblem.get(problemId) || { attempts: 0, correct: 0 };
        const solveRate = stat.attempts === 0
            ? 0
            : Number(((stat.correct / stat.attempts) * 100).toFixed(1));

        return {
            id: problemId,
            title: row?.title || 'Untitled',
            description: row?.description || '',
            topic: row?.topic || null,
            difficulty: row?.difficulty || null,
            premium: Boolean(row?.is_premium),
            slug: row?.slug || null,
            completed: stat.correct > 0,
            inProgress: stat.attempts > 0 && stat.correct === 0,
            createdAt: row?.created_at || null,
            attempts: stat.attempts,
            solvedCount: stat.correct,
            solveRate
        };
    });
};

const fetchAllProblemsFromSupabase = async ({ pageSize }) => {
    let page = 1;
    let totalExpected = 0;
    const maxPages = 2000;
    const allRows = [];

    while (page <= maxPages) {
        const current = await fetchSupabaseProblemsPage({ page, pageSize });

        if (page === 1) {
            totalExpected = current.count;
        }

        allRows.push(...current.data);

        if (!current.data.length || allRows.length >= totalExpected) {
            break;
        }

        page += 1;
    }

    const withProgress = await attachProgressFromSupabase(allRows);

    return {
        data: withProgress,
        count: totalExpected,
        fetched: withProgress.length,
        pageSize,
        pagesFetched: page,
        source: 'supabase'
    };
};

export async function getAllAdminProblems({ pageSize = 100 } = {}) {
    const safePageSize = Math.max(1, Math.min(100, Number(pageSize) || 100));
    try {
        return await fetchAllProblemsFromSupabase({ pageSize: safePageSize });
    } catch (supabaseError) {
        console.error('Admin problems fetch failed.', supabaseError);
        throw new Error('Failed to load problems right now. Please try again shortly.');
    }
}
