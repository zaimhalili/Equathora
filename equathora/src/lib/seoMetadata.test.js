import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getCanonicalUrl,
    getMetaDescription,
    updateCanonicalUrl,
    updateMetaDescription,
    updateOpenGraphMetadata,
} from './seoMetadata.js';

test('the public exercise catalog identifies its own address', () => {
    assert.equal(getCanonicalUrl('/learn'), 'https://equathora.com/learn');
    assert.equal(getCanonicalUrl('/khan-academy-alternative'), 'https://equathora.com/khan-academy-alternative');
});

test('comparison page receives focused search and social metadata', () => {
    const attributes = {};
    const elements = new Map([
        ['meta[name="description"]', { setAttribute: (name, value) => { attributes.description = [name, value]; } }],
        ['meta[property="og:title"]', { setAttribute: (name, value) => { attributes.ogTitle = [name, value]; } }],
        ['meta[property="og:description"]', { setAttribute: (name, value) => { attributes.ogDescription = [name, value]; } }],
        ['meta[property="og:url"]', { setAttribute: (name, value) => { attributes.ogUrl = [name, value]; } }],
    ]);
    const documentRef = { querySelector: selector => elements.get(selector) || null };

    const description = updateMetaDescription(documentRef, '/khan-academy-alternative');
    const openGraph = updateOpenGraphMetadata(documentRef, '/khan-academy-alternative');

    assert.equal(description, getMetaDescription('/khan-academy-alternative'));
    assert.deepEqual(attributes.description, ['content', description]);
    assert.deepEqual(attributes.ogTitle, ['content', openGraph.title]);
    assert.deepEqual(attributes.ogDescription, ['content', description]);
    assert.deepEqual(attributes.ogUrl, ['content', 'https://equathora.com/khan-academy-alternative']);
});

test('the homepage keeps its existing preferred address', () => {
    assert.equal(getCanonicalUrl('/'), 'https://equathora.com/');
});

test('route metadata updates the canonical link without creating visible content', () => {
    const attributes = {};
    const canonicalLink = {
        setAttribute(name, value) {
            attributes[name] = value;
        },
    };
    const documentRef = {
        querySelector(selector) {
            assert.equal(selector, 'link[rel="canonical"]');
            return canonicalLink;
        },
    };

    updateCanonicalUrl(documentRef, '/learn');

    assert.equal(attributes.href, 'https://equathora.com/learn');
});
