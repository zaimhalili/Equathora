import { supabase } from './supabaseClient';

const DEFAULT_LOCAL_BACKEND = 'http://localhost:5104';

const normalizeBase = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim().replace(/\/$/, '');
};

const isJsonContentType = (contentType) => {
    const normalized = String(contentType || '').toLowerCase();
    return normalized.includes('application/json') || normalized.includes('+json');
};

const buildApiBaseCandidates = () => {
    const explicit = normalizeBase(import.meta.env.VITE_API_URL);
    const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocalRuntime = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1';

    const candidates = [];

    if (explicit) {
        candidates.push(explicit);
    }

    candidates.push('');

    if (isLocalRuntime && !explicit) {
        candidates.push(DEFAULT_LOCAL_BACKEND);
    }

    return [...new Set(candidates)];
};

const fetchProblemsPage = async ({ page, pageSize }) => {
    const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sort: 'newest'
    });

    const endpoint = `/api/problems?${params.toString()}`;
    const baseCandidates = buildApiBaseCandidates();
    const failures = [];

    for (const apiBase of baseCandidates) {
        const requestUrl = `${apiBase}${endpoint}`;

        try {
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                },
                credentials: 'omit'
            });

            const contentType = response.headers.get('content-type') || '';

            if (!response.ok) {
                let details = '';

                if (isJsonContentType(contentType)) {
                    try {
                        const errBody = await response.json();
                        details = errBody?.error || errBody?.message || '';
                    } catch {
                        // Ignore malformed JSON errors and continue with status details.
                    }
                }

                failures.push(
                    details
                        ? `${requestUrl} -> ${response.status} ${response.statusText}: ${details}`
                        : `${requestUrl} -> ${response.status} ${response.statusText}`
                );
                continue;
            }

            if (!isJsonContentType(contentType)) {
                failures.push(`${requestUrl} -> non-JSON (${contentType || 'unknown'})`);
                continue;
            }

            const body = await response.json();
            return {
                data: Array.isArray(body?.data) ? body.data : [],
                count: Number(body?.count || 0),
                page: Number(body?.page || page),
                pageSize: Number(body?.pageSize || pageSize)
            };
        } catch (error) {
            failures.push(`${requestUrl} -> network error: ${error?.message || 'unknown error'}`);
        }
    }

    const error = new Error('Backend problems API is currently unavailable.');
    error.details = failures;
    throw error;
};

const fetchAdminProblemDetailFromBackend = async (problemId) => {
    const endpoint = `/api/admin/problems/${problemId}`;
    const baseCandidates = buildApiBaseCandidates();

    for (const apiBase of baseCandidates) {
        const requestUrl = `${apiBase}${endpoint}`;

        try {
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                },
                credentials: 'omit'
            });

            if (!response.ok) {
                continue;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!isJsonContentType(contentType)) {
                continue;
            }

            return await response.json();
        } catch {
            // Try next candidate.
        }
    }

    throw new Error('Detail endpoint unavailable');
};

const fetchAllAdminProblemDetailsFromBackend = async () => {
    const endpoint = '/api/admin/problems/details';
    const baseCandidates = buildApiBaseCandidates();

    for (const apiBase of baseCandidates) {
        const requestUrl = `${apiBase}${endpoint}`;

        try {
            const response = await fetch(requestUrl, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                },
                credentials: 'omit'
            });

            if (!response.ok) {
                continue;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!isJsonContentType(contentType)) {
                continue;
            }

            const body = await response.json();
            return Array.isArray(body?.data) ? body.data : [];
        } catch {
            // Try next candidate.
        }
    }

    throw new Error('Bulk detail endpoint unavailable');
};

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
    try {
        const { data: attempts, error: attemptsError } = await supabase
            .from('user_attempts')
            .select('is_correct')
            .eq('problem_id', problemId);

        if (attemptsError) {
            throw attemptsError;
        }

        attemptRows = Array.isArray(attempts) ? attempts : [];
    } catch (attemptsError) {
        console.warn('Could not read user_attempts for problem detail; using 0 metrics.', attemptsError);
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
    try {
        const { data: attemptsData, error: attemptsError } = await supabase
            .from('user_attempts')
            .select('problem_id, is_correct');

        if (attemptsError) {
            throw attemptsError;
        }

        attempts = Array.isArray(attemptsData) ? attemptsData : [];
    } catch (attemptsError) {
        console.warn('Could not read user_attempts for bulk details; using 0 metrics.', attemptsError);
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
        return await fetchAllAdminProblemDetailsFromBackend();
    } catch {
        try {
            return await fetchAllAdminProblemDetailsFromSupabase();
        } catch {
            throw new Error('Failed to preload problem details right now. Please try again shortly.');
        }
    }
}

export async function getAdminProblemDetails(problemId) {
    const numericId = Number(problemId);
    if (!Number.isFinite(numericId)) {
        throw new Error('Invalid problem id');
    }

    try {
        return await fetchAdminProblemDetailFromBackend(numericId);
    } catch {
        try {
            return await fetchAdminProblemDetailFromSupabase(numericId);
        } catch {
            throw new Error('Failed to load problem details right now. Please try again shortly.');
        }
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
    let page = 1;
    const allAttempts = [];
    const maxPages = 2000;

    while (page <= maxPages) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;

        const { data, error } = await supabase
            .from('user_attempts')
            .select('problem_id, is_correct')
            .range(start, end);

        if (error) {
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
        console.warn('Could not load user_attempts for admin problems metrics:', error);
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
    const allRows = [];

    let page = 1;
    let totalExpected = 0;
    const maxPages = 2000;

    try {
        while (page <= maxPages) {
            const current = await fetchProblemsPage({ page, pageSize: safePageSize });

            if (page === 1) {
                totalExpected = current.count;
            }

            allRows.push(...current.data);

            if (!current.data.length || allRows.length >= totalExpected) {
                break;
            }

            page += 1;
        }

        return {
            data: allRows,
            count: totalExpected,
            fetched: allRows.length,
            pageSize: safePageSize,
            pagesFetched: page,
            source: 'backend'
        };
    } catch (backendError) {
        console.warn('Admin problems backend fetch failed. Falling back to Supabase.', backendError);
        try {
            return await fetchAllProblemsFromSupabase({ pageSize: safePageSize });
        } catch (supabaseError) {
            console.error('Admin problems fallback also failed.', supabaseError);
            throw new Error('Failed to load problem data right now. Please try again shortly.');
        }
    }
}
