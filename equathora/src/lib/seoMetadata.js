const SITE_URL = 'https://equathora.com';

export const ALGEBRA_META_DESCRIPTION = 'Practice real Algebra problems by grade and difficulty with guided steps, hints, and immediate answer feedback on Equathora.';

const INDEX_META_DESCRIPTION = 'Build confidence in mathematics through guided practice, progressive hints, immediate feedback, and topic-by-topic progress on Equathora.';

const PUBLIC_CANONICAL_PATHS = new Set([
    '/learn',
    '/algebra-practice-problems',
]);

export function getCanonicalUrl(pathname) {
    return PUBLIC_CANONICAL_PATHS.has(pathname) ? `${SITE_URL}${pathname}` : `${SITE_URL}/`;
}

export function updateCanonicalUrl(documentRef, pathname) {
    const canonicalLink = documentRef?.querySelector('link[rel="canonical"]');
    const canonicalUrl = getCanonicalUrl(pathname);

    if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
    }

    return canonicalUrl;
}

function updateMetaContent(documentRef, selector, content) {
    const element = documentRef?.querySelector(selector);
    if (element) {
        element.setAttribute('content', content);
    }
}

export function updateSearchMetadata(documentRef, pathname) {
    const isAlgebraPage = pathname === '/algebra-practice-problems';
    const title = isAlgebraPage
        ? 'Algebra Practice Problems by Grade | Equathora'
        : documentRef?.title || 'Equathora - Master Math Through Practice';
    const description = isAlgebraPage ? ALGEBRA_META_DESCRIPTION : INDEX_META_DESCRIPTION;
    const canonicalUrl = getCanonicalUrl(pathname);

    updateMetaContent(documentRef, 'meta[name="description"]', description);
    updateMetaContent(documentRef, 'meta[property="og:title"]', title);
    updateMetaContent(documentRef, 'meta[property="og:description"]', description);
    updateMetaContent(documentRef, 'meta[property="og:url"]', canonicalUrl);
    updateMetaContent(documentRef, 'meta[name="twitter:title"]', title);
    updateMetaContent(documentRef, 'meta[name="twitter:description"]', description);

    return { title, description, canonicalUrl };
}
