const SITE_URL = 'https://equathora.com';
const DEFAULT_DESCRIPTION = 'Learn math online with structured practice, step-by-step math help, and Sigma AI feedback designed to improve problem solving and confidence.';

const PAGE_DESCRIPTIONS = {
    '/polynomial-practice-problems': 'Practice 12 free polynomial problems with guided hints and instant feedback. Combine, multiply, and factor polynomials across grades 8 to 10.',
};

export function getCanonicalUrl(pathname) {
    const publicPagePaths = new Set([
        '/learn',
        '/polynomial-practice-problems',
    ]);

    return publicPagePaths.has(pathname) ? `${SITE_URL}${pathname}` : `${SITE_URL}/`;
}

export function updateCanonicalUrl(documentRef, pathname) {
    const canonicalLink = documentRef?.querySelector('link[rel="canonical"]');
    const canonicalUrl = getCanonicalUrl(pathname);

    if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
    }

    return canonicalUrl;
}

export function getMetaDescription(pathname) {
    return PAGE_DESCRIPTIONS[pathname] || DEFAULT_DESCRIPTION;
}

export function updateMetaDescription(documentRef, pathname) {
    const descriptionMeta = documentRef?.querySelector('meta[name="description"]');
    const description = getMetaDescription(pathname);

    if (descriptionMeta) {
        descriptionMeta.setAttribute('content', description);
    }

    return description;
}
