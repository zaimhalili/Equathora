export const STUDY_PARTNER_SOURCE = Object.freeze({
    utm_source: 'study_partner',
    utm_medium: 'referral',
    utm_campaign: 'problem_share',
});

export const buildStudyPartnerShareUrl = (currentUrl) => {
    const fallbackUrl = typeof window !== 'undefined' ? window.location.href : '';
    const url = new URL(currentUrl || fallbackUrl);

    Object.entries(STUDY_PARTNER_SOURCE).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    return url.toString();
};

export const shareStudyPartnerInvitation = async ({
    url,
    title,
    text,
    navigatorObject = typeof navigator !== 'undefined' ? navigator : null,
    copyFallback = null,
}) => {
    if (!url || !navigatorObject) return 'unavailable';

    if (typeof navigatorObject.share === 'function') {
        try {
            await navigatorObject.share({ title, text, url });
            return 'shared';
        } catch (error) {
            if (error?.name === 'AbortError') return 'cancelled';
        }
    }

    try {
        if (typeof navigatorObject.clipboard?.writeText === 'function') {
            await navigatorObject.clipboard.writeText(url);
            return 'copied';
        }

        if (typeof copyFallback === 'function' && copyFallback(url)) {
            return 'copied';
        }
    } catch {
        if (typeof copyFallback === 'function' && copyFallback(url)) {
            return 'copied';
        }
    }

    return 'unavailable';
};
