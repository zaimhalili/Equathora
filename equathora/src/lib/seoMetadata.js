const SITE_URL = 'https://equathora.com';
const DEFAULT_DESCRIPTION = 'Learn math online with structured practice, step-by-step math help, and Sigma AI feedback designed to improve problem solving and confidence.';

const PAGE_METADATA = {
    '/khan-academy-alternative': {
        title: 'Khan Academy Alternative for Focused Math Practice | Equathora',
        description: 'Compare Equathora and Khan Academy for math practice. See who each platform suits, then try real guided problems by grade and difficulty.',
    },
    '/ixl-alternative': {
        title: 'IXL Alternative for Focused Math Practice | Equathora',
        description: 'Compare Equathora and IXL for high-school math practice. See which experience fits, then try real guided problems by grade and difficulty.',
    },
    '/brilliant-alternative': {
        title: 'Brilliant Alternative for School Math Practice | Equathora',
        description: 'Compare Equathora and Brilliant for interactive math practice. Explore the differences, then try real school-math problems by grade and difficulty.',
    },
};

const PUBLIC_PAGE_PATHS = new Set([
    '/learn',
    ...Object.keys(PAGE_METADATA),
]);

export function getCanonicalUrl(pathname) {
    return PUBLIC_PAGE_PATHS.has(pathname) ? `${SITE_URL}${pathname}` : `${SITE_URL}/`;
}

export function getMetaDescription(pathname) {
    return PAGE_METADATA[pathname]?.description || DEFAULT_DESCRIPTION;
}

export function updateMetaDescription(documentRef, pathname) {
    const descriptionMeta = documentRef?.querySelector('meta[name="description"]');
    const description = getMetaDescription(pathname);

    descriptionMeta?.setAttribute('content', description);

    return description;
}

export function updateOpenGraphMetadata(documentRef, pathname) {
    const titleMeta = documentRef?.querySelector('meta[property="og:title"]');
    const descriptionMeta = documentRef?.querySelector('meta[property="og:description"]');
    const urlMeta = documentRef?.querySelector('meta[property="og:url"]');
    const title = PAGE_METADATA[pathname]?.title || 'Equathora';
    const description = getMetaDescription(pathname);
    const url = getCanonicalUrl(pathname);

    titleMeta?.setAttribute('content', title);
    descriptionMeta?.setAttribute('content', description);
    urlMeta?.setAttribute('content', url);

    return { title, description, url };
}

export function updateCanonicalUrl(documentRef, pathname) {
    const canonicalLink = documentRef?.querySelector('link[rel="canonical"]');
    const canonicalUrl = getCanonicalUrl(pathname);

    if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
    }

    return canonicalUrl;
}
