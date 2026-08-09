const SITE_URL = 'https://equathora.com';

export function getCanonicalUrl(pathname) {
    return pathname === '/learn' ? `${SITE_URL}/learn` : `${SITE_URL}/`;
}

export function updateCanonicalUrl(documentRef, pathname) {
    const canonicalLink = documentRef?.querySelector('link[rel="canonical"]');
    const canonicalUrl = getCanonicalUrl(pathname);

    if (canonicalLink) {
        canonicalLink.setAttribute('href', canonicalUrl);
    }

    return canonicalUrl;
}
