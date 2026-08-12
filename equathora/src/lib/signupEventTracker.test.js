import test from 'node:test';
import assert from 'node:assert/strict';
import { createSignupEventTracker } from './signupEventTracker.js';

const createStorage = () => {
    const values = new Map();

    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value))
    };
};

test('one successful account records one signup during concurrent activity checks', async () => {
    const calls = {
        lookups: 0,
        inserts: 0,
        captures: 0
    };
    let releaseLookup;
    const lookupGate = new Promise((resolve) => {
        releaseLookup = resolve;
    });

    const ensureSignupEvent = createSignupEventTracker({
        storage: createStorage(),
        keyForUser: (userId) => `signup-${userId}`,
        findExistingSignup: async () => {
            calls.lookups += 1;
            await lookupGate;
            return { exists: false, error: null };
        },
        insertSignup: async () => {
            calls.inserts += 1;
            return { error: null };
        },
        onExistingSignup: () => {},
        onSignupRecorded: () => {
            calls.captures += 1;
        }
    });

    const firstCheck = ensureSignupEvent('learner-1', '2026-08-10T10:00:00.000Z');
    const strictModeCheck = ensureSignupEvent('learner-1', '2026-08-10T10:00:00.000Z');
    releaseLookup();

    assert.deepEqual(await Promise.all([firstCheck, strictModeCheck]), [true, true]);
    assert.deepEqual(calls, {
        lookups: 1,
        inserts: 1,
        captures: 1
    });

    assert.equal(
        await ensureSignupEvent('learner-1', '2026-08-10T10:00:00.000Z'),
        false
    );
    assert.deepEqual(calls, {
        lookups: 1,
        inserts: 1,
        captures: 1
    });
});
