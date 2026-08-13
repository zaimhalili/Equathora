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
});

test('the homepage keeps its existing preferred address', () => {
    assert.equal(getCanonicalUrl('/'), 'https://equathora.com/');
});

test('comparison pages identify their own public addresses', () => {
    assert.equal(getCanonicalUrl('/ixl-alternative'), 'https://equathora.com/ixl-alternative');
    assert.equal(getCanonicalUrl('/brilliant-alternative'), 'https://equathora.com/brilliant-alternative');
});

test('comparison pages provide focused search descriptions', () => {
    assert.match(getMetaDescription('/ixl-alternative'), /IXL/);
    assert.match(getMetaDescription('/brilliant-alternative'), /Brilliant/);
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

test('route metadata updates description and open graph tags', () => {
    const attributes = {};
    const elements = {
        'meta[name="description"]': 'description',
        'meta[property="og:title"]': 'og:title',
        'meta[property="og:description"]': 'og:description',
        'meta[property="og:url"]': 'og:url',
    };
    const documentRef = {
        querySelector(selector) {
            const key = elements[selector];
            if (!key) return null;

            return {
                setAttribute(name, value) {
                    assert.equal(name, 'content');
                    attributes[key] = value;
                },
            };
        },
    };

    updateMetaDescription(documentRef, '/brilliant-alternative');
    const metadata = updateOpenGraphMetadata(documentRef, '/brilliant-alternative');

    assert.match(attributes.description, /Brilliant/);
    assert.equal(attributes['og:title'], 'Brilliant Alternative for School Math Practice | Equathora');
    assert.equal(attributes['og:url'], 'https://equathora.com/brilliant-alternative');
    assert.deepEqual(metadata, {
        title: 'Brilliant Alternative for School Math Practice | Equathora',
        description: attributes.description,
        url: 'https://equathora.com/brilliant-alternative',
    });
});
