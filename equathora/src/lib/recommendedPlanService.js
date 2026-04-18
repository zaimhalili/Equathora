import { supabase } from './supabaseClient';
import { getAllProblems } from './problemService';
import { generateProblemSlug } from './slugify';
import {
    buildRecommendedStudyPlan,
    normalizeQuestionnaireAnswers,
} from '../utils/recommendationEngine';

const LOCAL_ONBOARDING_KEY = 'equathora_onboarding_answers';
const LOCAL_REFLECTIONS_KEY = 'equathora_reflection_notes';
const SETTINGS_ONBOARDING_KEY = 'onboarding_profile';
const SETTINGS_RAW_ANSWERS_KEY = 'onboarding_answers';
const SETTINGS_REFLECTIONS_KEY = 'learning_reflections';

const isMissingRelationError = (error) => {
    const message = String(error?.message || '').toLowerCase();
    const code = String(error?.code || '').toUpperCase();

    return code === '42P01' || message.includes('does not exist') || message.includes('relation');
};

const safeParseJson = (value, fallback) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const getLocalStorageValue = (key, fallback) => {
    if (typeof window === 'undefined') {
        return fallback;
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
        return fallback;
    }

    return safeParseJson(raw, fallback);
};

const setLocalStorageValue = (key, value) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
};

const getWeekStartDate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    return weekStart.toISOString().split('T')[0];
};

async function getCurrentSession() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session;
}

async function readUserSettings(userId) {
    if (!userId) {
        return {};
    }

    try {
        const { data, error } = await supabase
            .from('user_settings')
            .select('settings')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data?.settings || {};
    } catch (error) {
        if (!isMissingRelationError(error)) {
            console.warn('Failed to read user settings for recommendations:', error);
        }

        return {};
    }
}

async function writeUserSettings(userId, settingsPatch) {
    if (!userId || !settingsPatch) {
        return false;
    }

    try {
        const existingSettings = await readUserSettings(userId);

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: userId,
                settings: {
                    ...existingSettings,
                    ...settingsPatch,
                },
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (error) {
            throw error;
        }

        return true;
    } catch (error) {
        if (!isMissingRelationError(error)) {
            console.warn('Failed to write user settings for recommendations:', error);
        }

        return false;
    }
}

function normalizeProblems(problems = []) {
    return problems.map((problem) => ({
        ...problem,
        id: String(problem.id),
        slug: problem.slug || generateProblemSlug(problem.title, problem.id),
    }));
}

function computeFallbackProgressFromSubmissions(submissions = []) {
    const solvedSet = new Set();
    let totalAttempts = 0;
    let wrongSubmissions = 0;
    let totalTimeMinutes = 0;

    for (const row of submissions) {
        totalAttempts += 1;
        totalTimeMinutes += Math.max(0, Number(row?.time_spent_seconds || 0)) / 60;

        if (row?.is_correct) {
            solvedSet.add(String(row.problem_id));
        } else {
            wrongSubmissions += 1;
        }
    }

    return {
        solved_problems: [...solvedSet],
        total_attempts: totalAttempts,
        wrong_submissions: wrongSubmissions,
        total_time_minutes: Math.round(totalTimeMinutes),
    };
}

function mergeProgress(progressRow, submissionRows) {
    const fallback = computeFallbackProgressFromSubmissions(submissionRows);

    return {
        solved_problems: progressRow?.solved_problems || fallback.solved_problems,
        total_attempts: Number.isFinite(Number(progressRow?.total_attempts))
            ? Number(progressRow.total_attempts)
            : fallback.total_attempts,
        wrong_submissions: Number.isFinite(Number(progressRow?.wrong_submissions))
            ? Number(progressRow.wrong_submissions)
            : fallback.wrong_submissions,
        accuracy_rate: Number(progressRow?.accuracy_rate || 0),
        total_time_minutes: Number.isFinite(Number(progressRow?.total_time_minutes))
            ? Number(progressRow.total_time_minutes)
            : fallback.total_time_minutes,
        streak_days: Number(progressRow?.streak_days || 0),
    };
}

function getDisplayName(session) {
    return session?.user?.user_metadata?.full_name
        || session?.user?.user_metadata?.name
        || session?.user?.user_metadata?.username
        || session?.user?.email?.split('@')?.[0]
        || 'Learner';
}

export async function saveOnboardingAnswers(rawAnswers = {}) {
    const normalized = normalizeQuestionnaireAnswers(rawAnswers);
    setLocalStorageValue(LOCAL_ONBOARDING_KEY, normalized);

    const session = await getCurrentSession();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            normalized,
            persistedToDatabase: false,
        };
    }

    const persistedToDatabase = await writeUserSettings(userId, {
        [SETTINGS_ONBOARDING_KEY]: normalized,
        [SETTINGS_RAW_ANSWERS_KEY]: rawAnswers,
        onboarding_completed_at: new Date().toISOString(),
    });

    return {
        normalized,
        persistedToDatabase,
    };
}

export async function loadOnboardingAnswers(routeQuestionnaire) {
    if (routeQuestionnaire && Object.keys(routeQuestionnaire).length > 0) {
        const { normalized } = await saveOnboardingAnswers(routeQuestionnaire);
        return normalized;
    }

    const session = await getCurrentSession();
    const userId = session?.user?.id;

    if (userId) {
        const settings = await readUserSettings(userId);
        const profile = settings?.[SETTINGS_ONBOARDING_KEY];
        if (profile && typeof profile === 'object') {
            return normalizeQuestionnaireAnswers(profile);
        }

        const legacyAnswers = settings?.[SETTINGS_RAW_ANSWERS_KEY];
        if (legacyAnswers && typeof legacyAnswers === 'object') {
            return normalizeQuestionnaireAnswers(legacyAnswers);
        }
    }

    const local = getLocalStorageValue(LOCAL_ONBOARDING_KEY, null);
    if (local && typeof local === 'object') {
        return normalizeQuestionnaireAnswers(local);
    }

    return normalizeQuestionnaireAnswers({});
}

export async function getReflectionNotes() {
    const session = await getCurrentSession();
    const userId = session?.user?.id;

    if (!userId) {
        return getLocalStorageValue(LOCAL_REFLECTIONS_KEY, []);
    }

    const settings = await readUserSettings(userId);
    const reflections = Array.isArray(settings?.[SETTINGS_REFLECTIONS_KEY])
        ? settings[SETTINGS_REFLECTIONS_KEY]
        : [];

    if (reflections.length === 0) {
        return getLocalStorageValue(LOCAL_REFLECTIONS_KEY, []);
    }

    return reflections;
}

export async function saveReflectionNote(note, context = {}) {
    const trimmed = String(note || '').trim();
    if (!trimmed) {
        return { success: false, message: 'Reflection note is empty.' };
    }

    const session = await getCurrentSession();
    const userId = session?.user?.id;

    const localReflections = getLocalStorageValue(LOCAL_REFLECTIONS_KEY, []);
    const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        note: trimmed,
        createdAt: new Date().toISOString(),
        ...context,
    };

    const nextLocal = [entry, ...localReflections].slice(0, 25);
    setLocalStorageValue(LOCAL_REFLECTIONS_KEY, nextLocal);

    if (!userId) {
        return { success: true, notes: nextLocal };
    }

    const settings = await readUserSettings(userId);
    const existing = Array.isArray(settings?.[SETTINGS_REFLECTIONS_KEY])
        ? settings[SETTINGS_REFLECTIONS_KEY]
        : [];

    const next = [entry, ...existing].slice(0, 25);

    const persisted = await writeUserSettings(userId, {
        [SETTINGS_REFLECTIONS_KEY]: next,
    });

    return {
        success: true,
        persisted,
        notes: next,
    };
}

async function loadRecommendationInputData(userId) {
    const weekStartDate = getWeekStartDate();

    const [problems, progressResult, streakResult, submissionsResult, weeklyResult] = await Promise.all([
        getAllProblems(),
        supabase
            .from('user_progress')
            .select('solved_problems,total_attempts,wrong_submissions,accuracy_rate,total_time_minutes,streak_days')
            .eq('user_id', userId)
            .maybeSingle(),
        supabase
            .from('user_streak_data')
            .select('current_streak,longest_streak,last_activity_date')
            .eq('user_id', userId)
            .maybeSingle(),
        supabase
            .from('user_submissions')
            .select('problem_id,is_correct,time_spent_seconds,submitted_at')
            .eq('user_id', userId)
            .order('submitted_at', { ascending: false })
            .limit(800),
        supabase
            .from('user_weekly_progress')
            .select('day_index,count')
            .eq('user_id', userId)
            .eq('week_start_date', weekStartDate),
    ]);

    if (progressResult.error) {
        console.warn('Failed to load user progress for recommendations:', progressResult.error);
    }

    if (streakResult.error) {
        console.warn('Failed to load streak data for recommendations:', streakResult.error);
    }

    if (submissionsResult.error) {
        console.warn('Failed to load submissions for recommendations:', submissionsResult.error);
    }

    if (weeklyResult.error) {
        console.warn('Failed to load weekly progress for recommendations:', weeklyResult.error);
    }

    const submissions = submissionsResult.data || [];

    return {
        problems: normalizeProblems(problems),
        progress: mergeProgress(progressResult.data, submissions),
        streak: {
            current_streak: Number(streakResult.data?.current_streak || 0),
            longest_streak: Number(streakResult.data?.longest_streak || 0),
            last_activity_date: streakResult.data?.last_activity_date || null,
        },
        submissions,
        weeklyProgress: weeklyResult.data || [],
    };
}

export async function loadRecommendedPlan({ routeQuestionnaire } = {}) {
    const session = await getCurrentSession();
    const onboarding = await loadOnboardingAnswers(routeQuestionnaire);

    const userId = session?.user?.id;
    const userDisplayName = getDisplayName(session);

    if (!userId) {
        const publicProblems = normalizeProblems(await getAllProblems());
        const plan = buildRecommendedStudyPlan({
            problems: publicProblems,
            submissions: [],
            progress: {},
            streak: {},
            onboardingAnswers: onboarding,
            userDisplayName,
        });

        return {
            plan,
            weeklyProgress: [],
            reflections: await getReflectionNotes(),
            hasSession: false,
        };
    }

    const inputData = await loadRecommendationInputData(userId);

    const plan = buildRecommendedStudyPlan({
        problems: inputData.problems,
        submissions: inputData.submissions,
        progress: inputData.progress,
        streak: inputData.streak,
        onboardingAnswers: onboarding,
        userDisplayName,
    });

    return {
        plan,
        weeklyProgress: inputData.weeklyProgress,
        reflections: await getReflectionNotes(),
        hasSession: true,
    };
}
