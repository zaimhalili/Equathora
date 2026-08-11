import test from 'node:test';
import assert from 'node:assert/strict';

import {
    buildFirstProblemSubmitProperties,
    getAnswerLengthBand,
} from './firstProblemSubmit.js';

test('buckets answer length without retaining answer content', () => {
    assert.equal(getAnswerLengthBand(0), '1-24');
    assert.equal(getAnswerLengthBand(24), '1-24');
    assert.equal(getAnswerLengthBand(25), '25-74');
    assert.equal(getAnswerLengthBand(150), '150+');
});

test('builds non-sensitive first-problem submit context', () => {
    assert.deepEqual(buildFirstProblemSubmitProperties({
        problem: { id: 42, topic: 'Factoring', difficulty: 'Medium' },
        stepCount: 2,
        totalCharacters: 47,
        timeSpentSeconds: 46.4,
    }), {
        source: 'equathora_web',
        surface: 'problem_workspace',
        problem_id: 42,
        problem_topic: 'Factoring',
        problem_difficulty: 'Medium',
        entered_step_count: 2,
        answer_length_band: '25-74',
        time_spent_seconds: 46,
    });
});
