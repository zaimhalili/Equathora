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

test('prefers a safe router-state destination over the next query parameter', () => {
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

test('carries the intended problem through login, signup, resend, and callback paths', () => {
    const destination = '/problems/evaluate-455?source=learn#workspace';

    assert.equal(
        buildAuthPath('/login', destination),
        '/login?next=%2Fproblems%2Fevaluate-455%3Fsource%3Dlearn%23workspace',
    );
    assert.equal(
        buildAuthPath('/signup', destination),
        '/signup?next=%2Fproblems%2Fevaluate-455%3Fsource%3Dlearn%23workspace',
    );
    assert.equal(
        buildAuthCallbackUrl('https://www.equathora.com', destination),
        'https://www.equathora.com/auth/callback?next=%2Fproblems%2Fevaluate-455%3Fsource%3Dlearn%23workspace',
    );
    assert.equal(
        buildAuthPath('/resend', destination, { email: 'learner+algebra@example.com' }),
        '/resend?email=learner%2Balgebra%40example.com&next=%2Fproblems%2Fevaluate-455%3Fsource%3Dlearn%23workspace',
    );
});

test('uses the dashboard when building an auth path from an unsafe destination', () => {
    assert.equal(
        buildAuthPath('/login', 'https://example.com/problems/1'),
        '/login?next=%2Fdashboard',
    );
});
