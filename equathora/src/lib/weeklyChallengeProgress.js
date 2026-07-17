const STORAGE_KEY = 'equathora_weekly_challenge_completions';

const getDefaultStorage = () => (
    typeof window !== 'undefined' && window.localStorage ? window.localStorage : null
);

export const getWeeklyChallengeCompletions = (storage = getDefaultStorage()) => {
    if (!storage) return {};

    try {
        const value = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
        return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
        return {};
    }
};

export const getWeeklyChallengeCompletion = (weekKey, storage = getDefaultStorage()) =>
    getWeeklyChallengeCompletions(storage)[weekKey] || null;

export const isWeeklyChallengeCompleted = (weekKey, storage = getDefaultStorage()) =>
    Boolean(getWeeklyChallengeCompletion(weekKey, storage));

export const markWeeklyChallengeCompleted = (challenge, storage = getDefaultStorage(), completedAt = new Date()) => {
    if (!storage || !challenge?.weekKey) return null;

    const completions = getWeeklyChallengeCompletions(storage);
    const existing = completions[challenge.weekKey];
    const completion = existing || {
        weekKey: challenge.weekKey,
        weekLabel: challenge.weekLabel,
        problemId: challenge.problemId,
        problemSlug: challenge.problemSlug,
        completedAt: completedAt.toISOString(),
    };

    storage.setItem(STORAGE_KEY, JSON.stringify({
        ...completions,
        [challenge.weekKey]: completion,
    }));

    return completion;
};

export const WEEKLY_CHALLENGE_COMPLETIONS_STORAGE_KEY = STORAGE_KEY;
