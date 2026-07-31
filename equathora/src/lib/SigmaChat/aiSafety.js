const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F-\u009F]/g;
const ZERO_WIDTH_RE = /[\u200B-\u200D\uFEFF]/g;
const BIDI_RE = /[\u202A-\u202E]/g;

export const sanitizePromptText = (value, maxChars = 4000) => {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value)
        .replace(CONTROL_CHARS_RE, ' ')
        .replace(ZERO_WIDTH_RE, '')
        .replace(BIDI_RE, '')
        .replace(/\r\n/g, '\n')
        .trim()
        .slice(0, maxChars);
};

export const sanitizePromptValue = (value, maxChars = 4000) => {
    if (Array.isArray(value)) {
        return value.map((item) => sanitizePromptValue(item, maxChars));
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [key, sanitizePromptValue(entry, maxChars)])
        );
    }

    if (typeof value === 'string') {
        return sanitizePromptText(value, maxChars);
    }

    return value;
};

export const buildSafePromptJson = (payload) => JSON.stringify(sanitizePromptValue(payload), null, 2);

export const stripModelFormatting = (value) => sanitizePromptText(String(value ?? '').replace(/```json|```/gi, ''), 8000);

export const getFriendlySigmaErrorMessage = (error) => {
    const status = error?.status ?? error?.context?.status ?? error?.error?.status;
    const rawMessage = String(
        error?.message ??
        error?.error?.message ??
        (typeof error === 'string' ? error : '')
    ).toLowerCase();

    // Catch rate limits, depleted quota, or upstream API errors
    if (
        status === 429 ||
        status === 503 ||
        rawMessage.includes('resource_exhausted') ||
        rawMessage.includes('prepayment') ||
        rawMessage.includes('quota') ||
        rawMessage.includes('high demand')
    ) {
        return 'Sigma is temporarily unavailable due to high system load. Please try again in a few moments, or reach out to equathora@gmail.com if the issue persists.';
    }

    if (status === 401 || status === 403) {
        return 'Sigma session expired. Please refresh the page and try again.';
    }

    return 'We ran into an issue connecting to Sigma. Please try again in a moment, or contact equathora@gmail.com for help.';
};