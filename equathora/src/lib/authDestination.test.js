import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildAuthCallbackUrl,
    buildAuthPath,
    getAuthDestination,
    getSafeAuthDestination,
} from './authDestination.js';

test('keeps an internal problem path and its filters', () => {
    assert.equal(
        getSafeAuthDestination('/problems/evaluate-455?source=learn#workspace'),
        '/problems/evaluate-455?source=learn#workspace',
    );
});

test('rejects external and authentication-loop destinations', () => {
    assert.equal(getSafeAuthDestination('//example.com/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('https://example.com/problems/1'), '/dashboard');
    assert.equal(getSafeAuthDestination('/login?next=/problems/1'), '/dashboard');
});

test('reads a destination from router state or the next query parameter', () => {
    assert.equal(getAuthDestination('?next=%2Flearn'), '/learn');
    assert.equal(getAuthDestination('?next=%2Flearn', '/problems/evaluate-455'), '/problems/evaluate-455');
});

test('carries the intended page through auth routes and callbacks', () => {
    assert.equal(
        buildAuthPath('/login', '/problems/evaluate-455'),
        '/login?next=%2Fproblems%2Fevaluate-455',
    );
    assert.equal(
        buildAuthCallbackUrl('https://www.equathora.com', '/learn?topic=algebra'),
        'https://www.equathora.com/auth/callback?next=%2Flearn%3Ftopic%3Dalgebra',
    );
    assert.equal(
        buildAuthPath('/resend', '/problems/evaluate-455', { email: 'learner+algebra@example.com' }),
        '/resend?email=learner%2Balgebra%40example.com&next=%2Fproblems%2Fevaluate-455',
    );
});
