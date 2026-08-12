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

test('the homepage keeps its existing preferred address', () => {
    assert.equal(getCanonicalUrl('/'), 'https://equathora.com/');
});

test('the quadratic practice page identifies its own address', () => {
    assert.equal(
        getCanonicalUrl('/quadratic-equations-practice-problems'),
        'https://equathora.com/quadratic-equations-practice-problems',
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

test('the quadratic practice page has a focused search description', () => {
    assert.equal(
        getMetaDescription('/quadratic-equations-practice-problems'),
        'Practice 14 quadratic equation problems with guided hints and instant feedback. Factor equations and model geometry, motion, and revenue.',
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

    updateMetaDescription(documentRef, '/quadratic-equations-practice-problems');

    assert.equal(attributes.content, getMetaDescription('/quadratic-equations-practice-problems'));
});
