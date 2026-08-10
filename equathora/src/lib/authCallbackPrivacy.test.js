import test from 'node:test';
import assert from 'node:assert/strict';
import {
    hasSensitiveAuthCallbackLocation,
    resumeAnalyticsAfterAuthCallback,
    sanitizeAuthCallbackLocation
} from './authCallbackPrivacy.js';

test('analytics stays disabled while an OAuth callback contains URL credentials', () => {
    assert.equal(
        hasSensitiveAuthCallbackLocation({
            pathname: '/auth/callback',
            search: '',
            hash: '#access_token=synthetic-placeholder&refresh_token=synthetic-placeholder'
        }),
        true
    );

    assert.equal(
        hasSensitiveAuthCallbackLocation({
            pathname: '/auth/callback',
            search: '?code=synthetic-placeholder',
            hash: ''
        }),
        true
    );
});

test('the callback address is sanitized before analytics is enabled', () => {
    const calls = [];
    const windowObject = {
        location: {
            pathname: '/auth/callback',
            search: '',
            hash: '#access_token=synthetic-placeholder'
        },
        history: {
            state: { preserved: true },
            replaceState: (...args) => calls.push(['sanitize', ...args])
        }
    };

    assert.equal(
        resumeAnalyticsAfterAuthCallback(windowObject, () => {
            calls.push(['analytics']);
            return true;
        }),
        true
    );
    assert.deepEqual(calls, [
        ['sanitize', { preserved: true }, '', '/auth/callback'],
        ['analytics']
    ]);
    assert.equal(calls[0][3].includes('synthetic-placeholder'), false);
});

test('ordinary routes keep their addresses unchanged', () => {
    const calls = [];
    const windowObject = {
        location: {
            pathname: '/problems/example',
            search: '?ref=study-partner',
            hash: '#solution'
        },
        history: {
            state: null,
            replaceState: (...args) => calls.push(args)
        }
    };

    assert.equal(sanitizeAuthCallbackLocation(windowObject), false);
    assert.deepEqual(calls, []);
});
