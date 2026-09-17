const SITE_URL = 'https://equathora.com';

export function getCanonicalUrl(pathname) {
    const normalizedPath = pathname && pathname !== '/' ? pathname.replace(/\/$/, '') : '';
    return `${SITE_URL}${normalizedPath}`;
}

export function updateCanonicalUrl(documentRef, pathname) {
    const canonicalLink = documentRef?.querySelector('link[rel="canonical"]');
    const canonicalUrl = getCanonicalUrl(pathname);

    if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
    }

    return canonicalUrl;
}
