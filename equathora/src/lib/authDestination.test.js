import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildAuthCallbackUrl,
    buildAuthPath,
    getAuthDestination,
    getSafeAuthDestination,
} from './authDestination.js';

test('keeps an internal problem path with its query and hash', () => {
    assert.equal(
        getSafeAuthDestination('/problems/evaluate-455?source=learn#workspace'),
        '/problems/evaluate-455?source=learn#workspace',
    );
});

test('falls back for external, malformed, and protocol-relative destinations', () => {
    assert.equal(getSafeAuthDestination('//example.com/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('/\\example.com/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('https://example.com/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination(null), '/dashboard');
});

test('falls back for authentication destinations that could loop', () => {
    assert.equal(getSafeAuthDestination('/login?next=/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('/SIGNUP/'), '/dashboard');
    assert.equal(getSafeAuthDestination('/auth/callback?next=/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('/reset-password'), '/dashboard');
});

test('prefers a router-state destination over the next query parameter', () => {
    assert.equal(getAuthDestination('?next=%2Flearn'), '/learn');
    assert.equal(
        getAuthDestination('?next=%2Flearn', '/problems/evaluate-455'),
        '/problems/evaluate-455',
    );
    assert.equal(
        getAuthDestination('?next=https%3A%2F%2Fexample.com'),
        '/dashboard',
    );
});

test('carries the intended problem through every authentication path', () => {
    const destination = '/problems/evaluate-455?source=learn#workspace';

    for (const path of ['/login', '/signup', '/verify', '/resend', '/getStarted']) {
        const authPath = buildAuthPath(path, destination);
        const authUrl = new URL(authPath, 'https://equathora.local');

        assert.equal(
            getAuthDestination(authUrl.search),
            destination,
            `${path} should preserve the destination`,
        );
    }

    const callbackUrl = new URL(buildAuthCallbackUrl('https://www.equathora.com', destination));
    assert.equal(getAuthDestination(callbackUrl.search), destination);
});

test('keeps additional auth parameters without allowing them to replace next', () => {
    assert.equal(
        buildAuthPath('/resend', '/problems/evaluate-455', {
            email: 'learner+algebra@example.com',
            next: 'https://example.com/problems/1',
        }),
        '/resend?email=learner%2Balgebra%40example.com&next=%2Fproblems%2Fevaluate-455',
    );
});

test('uses the dashboard when building an auth path from an unsafe destination', () => {
    assert.equal(
        buildAuthPath('/login', 'https://example.com/problems/1'),
        '/login?next=%2Fdashboard',
    );
});
