import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ALGEBRA_META_DESCRIPTION,
    getCanonicalUrl,
    updateCanonicalUrl,
    updateSearchMetadata,
} from './seoMetadata.js';

test('the public exercise catalog identifies its own address', () => {
    assert.equal(getCanonicalUrl('/learn'), 'https://equathora.com/learn');
});

test('the homepage keeps its existing preferred address', () => {
    assert.equal(getCanonicalUrl('/'), 'https://equathora.com/');
});

test('the Algebra practice page identifies its own address', () => {
    assert.equal(
        getCanonicalUrl('/algebra-practice-problems'),
        'https://equathora.com/algebra-practice-problems'
    );
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

test('the Algebra route publishes a focused search description and social metadata', () => {
    const elements = new Map();
    const selectors = [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:url"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
    ];

    for (const selector of selectors) {
        const attributes = {};
        elements.set(selector, {
            attributes,
            setAttribute(name, value) {
                attributes[name] = value;
            },
        });
    }

    const documentRef = {
        title: 'Algebra Practice Problems by Grade | Equathora',
        querySelector(selector) {
            return elements.get(selector) || null;
        },
    };

    const metadata = updateSearchMetadata(documentRef, '/algebra-practice-problems');

    assert.equal(metadata.description, ALGEBRA_META_DESCRIPTION);
    assert.equal(elements.get('meta[name="description"]').attributes.content, ALGEBRA_META_DESCRIPTION);
    assert.equal(elements.get('meta[property="og:url"]').attributes.content, 'https://equathora.com/algebra-practice-problems');
});
