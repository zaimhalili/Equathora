import test from 'node:test';
import assert from 'node:assert/strict';
import { isZeroAttemptLearner } from './firstRunState.js';

test('identifies a learner with no recorded activity', () => {
    assert.equal(isZeroAttemptLearner({
        progress: { total_attempts: 0 },
        submissions: [],
        completedProblems: []
    }), true);
});

test('keeps the first-problem prompt hidden after any attempt', () => {
    assert.equal(isZeroAttemptLearner({
        progress: { total_attempts: 1 },
        submissions: [],
        completedProblems: []
    }), false);
});

test('keeps the first-problem prompt hidden when submission history exists', () => {
    assert.equal(isZeroAttemptLearner({
        progress: null,
        submissions: [{ problem_id: 211 }],
        completedProblems: []
    }), false);
});

test('keeps the first-problem prompt hidden for legacy completed-problem activity', () => {
    assert.equal(isZeroAttemptLearner({
        progress: { total_attempts: '0' },
        submissions: [],
        completedProblems: [{ problem_id: 211 }]
    }), false);
});
