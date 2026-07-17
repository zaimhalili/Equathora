const ANONYMOUS_STORAGE_KEY = 'equathora_recruitment_attribution_v1';
const USER_STORAGE_PREFIX = 'equathora_recruitment_attribution_user_v1_';
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_VALUE_LENGTH = 160;

const CAMPAIGN_FIELDS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'
];

const getBrowserStorage = () => (
    typeof window !== 'undefined' ? window.localStorage : null
);

const getStorage = (storage) => storage || getBrowserStorage();

const userStorageKey = (userId) => `${USER_STORAGE_PREFIX}${userId}`;

const normalizeValue = (value) => {
    if (typeof value !== 'string') return '';

    const withoutControlCharacters = [...value]
        .filter((character) => {
            const codePoint = character.codePointAt(0);
            return codePoint > 31 && codePoint !== 127;
        })
        .join('');

    return withoutControlCharacters
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, MAX_VALUE_LENGTH);
};

const readStoredAttribution = (storage, key, now = new Date()) => {
    if (!storage) return {};

    try {
        const storedValue = storage.getItem(key);
        if (!storedValue) return {};

        const attribution = JSON.parse(storedValue);
        const capturedAt = new Date(attribution?.recruitment_attribution_captured_at);
        const nowDate = now instanceof Date ? now : new Date(now);

        if (
            Number.isNaN(capturedAt.getTime()) ||
            Number.isNaN(nowDate.getTime()) ||
            nowDate.getTime() - capturedAt.getTime() > ATTRIBUTION_TTL_MS
        ) {
            storage.removeItem(key);
            return {};
        }

        return attribution;
    } catch {
        storage.removeItem(key);
        return {};
    }
};

export function captureRecruitmentAttribution(search, { storage, now = new Date() } = {}) {
    const targetStorage = getStorage(storage);
    if (!targetStorage || typeof search !== 'string') return {};

    const searchParams = new URLSearchParams(search);
    const attribution = {};

    CAMPAIGN_FIELDS.forEach((field) => {
        const normalizedValue = normalizeValue(searchParams.get(field));
        if (normalizedValue) {
            attribution[field] = normalizedValue;
        }
    });

    const referralCode = normalizeValue(searchParams.get('ref') || searchParams.get('referral'));
    if (referralCode) {
        attribution.referral_code = referralCode;
    }

    if (Object.keys(attribution).length === 0) {
        return readStoredAttribution(targetStorage, ANONYMOUS_STORAGE_KEY, now);
    }

    const capturedAt = now instanceof Date ? now : new Date(now);
    if (Number.isNaN(capturedAt.getTime())) return {};

    const normalizedAttribution = {
        ...attribution,
        recruitment_attribution_captured_at: capturedAt.toISOString()
    };

    targetStorage.setItem(ANONYMOUS_STORAGE_KEY, JSON.stringify(normalizedAttribution));
    return normalizedAttribution;
}

export function bindRecruitmentAttributionToUser(userId, { storage, now = new Date() } = {}) {
    const targetStorage = getStorage(storage);
    if (!targetStorage || !userId) return {};

    const existingUserAttribution = readStoredAttribution(targetStorage, userStorageKey(userId), now);
    if (Object.keys(existingUserAttribution).length > 0) {
        targetStorage.removeItem(ANONYMOUS_STORAGE_KEY);
        return existingUserAttribution;
    }

    const anonymousAttribution = readStoredAttribution(targetStorage, ANONYMOUS_STORAGE_KEY, now);
    if (Object.keys(anonymousAttribution).length === 0) return {};

    targetStorage.setItem(userStorageKey(userId), JSON.stringify(anonymousAttribution));
    targetStorage.removeItem(ANONYMOUS_STORAGE_KEY);
    return anonymousAttribution;
}

export function getRecruitmentAttribution(userId, { storage, now = new Date() } = {}) {
    const targetStorage = getStorage(storage);
    if (!targetStorage || !userId) return {};

    return readStoredAttribution(targetStorage, userStorageKey(userId), now);
}

export function clearRecruitmentAttribution(userId, { storage } = {}) {
    const targetStorage = getStorage(storage);
    if (!targetStorage) return;

    targetStorage.removeItem(userId ? userStorageKey(userId) : ANONYMOUS_STORAGE_KEY);
}

export function getRecruitmentEventProperties(eventType, userId, options = {}) {
    if (eventType !== 'signup' && eventType !== 'problem_solved') {
        return {};
    }

    return getRecruitmentAttribution(userId, options);
}
