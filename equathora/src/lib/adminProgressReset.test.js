import test from 'node:test';
import assert from 'node:assert/strict';
import {
    ADMIN_PROGRESS_RESET_CONFIRMATION,
    resetProgressCountersWithClient,
} from './adminProgressReset.js';

const createClientSpy = () => {
    const calls = [];
    const query = {
        update(patch) {
            calls.push({ method: 'update', patch });
            return query;
        },
        async eq(column, value) {
            calls.push({ method: 'eq', column, value });
            return { error: null };
        },
    };

    return {
        calls,
        client: {
            from(table) {
                calls.push({ method: 'from', table });
                return query;
            },
        },
    };
};

test('a routine or mistyped reset cannot mutate learner progress', async () => {
    const { client, calls } = createClientSpy();

    await assert.rejects(
        resetProgressCountersWithClient(client, 'learner-1', 'RESET SESSIONS'),
        /Type RESET PROGRESS/
    );

    assert.deepEqual(calls, []);
});

test('the explicit destructive reset only clears the named progress counters', async () => {
    const { client, calls } = createClientSpy();

    await resetProgressCountersWithClient(
        client,
        'learner-1',
        ADMIN_PROGRESS_RESET_CONFIRMATION
    );

    assert.deepEqual(calls, [
        { method: 'from', table: 'user_progress' },
        {
            method: 'update',
            patch: {
                total_attempts: 0,
                wrong_submissions: 0,
                correct_answers: 0,
            },
        },
        { method: 'eq', column: 'user_id', value: 'learner-1' },
    ]);
});
