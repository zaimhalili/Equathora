import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getCanonicalUrl,
    getMetaDescription,
    updateCanonicalUrl,
    updateMetaDescription,
} from './seoMetadata.js';

test('the public exercise catalog identifies its own address', () => {
    assert.equal(getCanonicalUrl('/learn'), 'https://equathora.com/learn');
});

test('the polynomial practice page identifies its own address', () => {
    assert.equal(
        getCanonicalUrl('/polynomial-practice-problems'),
        'https://equathora.com/polynomial-practice-problems',
    );
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

test('the polynomial practice page has a focused search description', () => {
    assert.equal(
        getMetaDescription('/polynomial-practice-problems'),
        'Practice 12 free polynomial problems with guided hints and instant feedback. Combine, multiply, and factor polynomials across grades 8 to 10.',
    );
});

test('route metadata updates the description already present in the document head', () => {
    const attributes = {};
    const descriptionMeta = {
        setAttribute(name, value) {
            attributes[name] = value;
        },
    };
    const documentRef = {
        querySelector(selector) {
            assert.equal(selector, 'meta[name="description"]');
            return descriptionMeta;
        },
    };

    updateMetaDescription(documentRef, '/polynomial-practice-problems');

    assert.equal(attributes.content, getMetaDescription('/polynomial-practice-problems'));
});
