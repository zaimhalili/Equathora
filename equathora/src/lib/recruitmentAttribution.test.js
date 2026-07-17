import test from 'node:test';
import assert from 'node:assert/strict';
import {
    bindRecruitmentAttributionToUser,
    captureRecruitmentAttribution,
    clearRecruitmentAttribution,
    getRecruitmentAttribution,
    getRecruitmentEventProperties
} from './recruitmentAttribution.js';

const createStorage = () => {
    const values = new Map();

    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key)
    };
};

test('the same normalized recruitment source reaches signup and first solve', () => {
    const storage = createStorage();
    const capturedAt = new Date('2026-07-17T12:00:00.000Z');

    captureRecruitmentAttribution(
        '?utm_source=Exam%20Forum&utm_medium=community&utm_campaign=July%20Algebra&ref=study-group-7&email=ignored@example.com',
        { storage, now: capturedAt }
    );

    const boundAttribution = bindRecruitmentAttributionToUser('learner-1', {
        storage,
        now: capturedAt
    });

    const expectedAttribution = {
        utm_source: 'Exam Forum',
        utm_medium: 'community',
        utm_campaign: 'July Algebra',
        referral_code: 'study-group-7',
        recruitment_attribution_captured_at: capturedAt.toISOString()
    };

    assert.deepEqual(boundAttribution, expectedAttribution);
    assert.deepEqual(
        getRecruitmentEventProperties('signup', 'learner-1', { storage, now: capturedAt }),
        expectedAttribution
    );
    assert.deepEqual(
        getRecruitmentEventProperties('problem_solved', 'learner-1', { storage, now: capturedAt }),
        expectedAttribution
    );
});

test('an organic journey stays source-free', () => {
    const storage = createStorage();
    const capturedAt = new Date('2026-07-17T12:00:00.000Z');

    assert.deepEqual(
        captureRecruitmentAttribution('?next=%2Fdashboard&email=ignored@example.com', {
            storage,
            now: capturedAt
        }),
        {}
    );
    assert.deepEqual(
        bindRecruitmentAttributionToUser('organic-learner', { storage, now: capturedAt }),
        {}
    );
    assert.deepEqual(
        getRecruitmentEventProperties('signup', 'organic-learner', { storage, now: capturedAt }),
        {}
    );
    assert.deepEqual(
        getRecruitmentEventProperties('problem_solved', 'organic-learner', { storage, now: capturedAt }),
        {}
    );
});

test('recruitment context is removed after the attributed first solve', () => {
    const storage = createStorage();
    const capturedAt = new Date('2026-07-17T12:00:00.000Z');

    captureRecruitmentAttribution('?utm_source=study-partner', { storage, now: capturedAt });
    bindRecruitmentAttributionToUser('learner-2', { storage, now: capturedAt });

    clearRecruitmentAttribution('learner-2', { storage });

    assert.deepEqual(
        getRecruitmentAttribution('learner-2', { storage, now: capturedAt }),
        {}
    );
});

test('stale recruitment context expires before it can reach an event', () => {
    const storage = createStorage();
    const capturedAt = new Date('2026-06-01T12:00:00.000Z');

    captureRecruitmentAttribution('?utm_source=old-invitation', { storage, now: capturedAt });

    assert.deepEqual(
        bindRecruitmentAttributionToUser('learner-3', {
            storage,
            now: new Date('2026-07-17T12:00:00.000Z')
        }),
        {}
    );
});
