import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildStudyPartnerShareUrl,
    shareStudyPartnerInvitation,
    STUDY_PARTNER_SOURCE,
} from './studyPartnerShare.js';

test('buildStudyPartnerShareUrl preserves the exact problem destination', () => {
    const sharedUrl = buildStudyPartnerShareUrl(
        'https://equathora.com/problems/evaluate-212?challenge=weekly&week=2026-W30#solution'
    );
    const parsedUrl = new URL(sharedUrl);

    assert.equal(parsedUrl.pathname, '/problems/evaluate-212');
    assert.equal(parsedUrl.searchParams.get('challenge'), 'weekly');
    assert.equal(parsedUrl.searchParams.get('week'), '2026-W30');
    assert.equal(parsedUrl.hash, '#solution');
    Object.entries(STUDY_PARTNER_SOURCE).forEach(([key, value]) => {
        assert.equal(parsedUrl.searchParams.get(key), value);
    });
});

test('buildStudyPartnerShareUrl replaces older campaign values with a non-personal marker', () => {
    const sharedUrl = buildStudyPartnerShareUrl(
        'https://equathora.com/problems/evaluate-211?utm_source=exam_cohort&utm_campaign=algebra'
    );
    const parsedUrl = new URL(sharedUrl);

    Object.entries(STUDY_PARTNER_SOURCE).forEach(([key, value]) => {
        assert.equal(parsedUrl.searchParams.get(key), value);
    });
});

test('shareStudyPartnerInvitation prefers the browser share sheet', async () => {
    const calls = [];
    const result = await shareStudyPartnerInvitation({
        url: 'https://equathora.com/problems/evaluate-211',
        title: 'Try this Algebra problem',
        text: 'Want to solve it too?',
        navigatorObject: {
            share: async (payload) => calls.push(['share', payload]),
            clipboard: { writeText: async (value) => calls.push(['copy', value]) },
        },
    });

    assert.equal(result, 'shared');
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'share');
});

test('shareStudyPartnerInvitation copies the link when native sharing is unavailable', async () => {
    let copiedValue = '';
    const result = await shareStudyPartnerInvitation({
        url: 'https://equathora.com/problems/evaluate-211',
        navigatorObject: {
            clipboard: { writeText: async (value) => { copiedValue = value; } },
        },
    });

    assert.equal(result, 'copied');
    assert.equal(copiedValue, 'https://equathora.com/problems/evaluate-211');
});

test('shareStudyPartnerInvitation falls back to copying after a share failure', async () => {
    let copiedValue = '';
    const result = await shareStudyPartnerInvitation({
        url: 'https://equathora.com/problems/evaluate-211',
        navigatorObject: {
            share: async () => { throw new Error('Share service unavailable'); },
            clipboard: { writeText: async (value) => { copiedValue = value; } },
        },
    });

    assert.equal(result, 'copied');
    assert.equal(copiedValue, 'https://equathora.com/problems/evaluate-211');
});

test('shareStudyPartnerInvitation does not copy when the learner cancels sharing', async () => {
    let copied = false;
    const abortError = new Error('Cancelled');
    abortError.name = 'AbortError';

    const result = await shareStudyPartnerInvitation({
        url: 'https://equathora.com/problems/evaluate-211',
        navigatorObject: {
            share: async () => { throw abortError; },
            clipboard: { writeText: async () => { copied = true; } },
        },
    });

    assert.equal(result, 'cancelled');
    assert.equal(copied, false);
});
