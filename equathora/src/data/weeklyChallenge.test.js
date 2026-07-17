import test from 'node:test';
import assert from 'node:assert/strict';
import {
    WEEKLY_CHALLENGE_PROBLEMS,
    getIsoWeek,
    getWeeklyChallenge,
    getWeeklyChallengeByKey,
    getWeeklyChallengeFromProblemParams,
    getWeeklyChallengeProblemPath,
    getWeeklyChallengeSummaryPath,
} from './weeklyChallenge.js';

test('dates in the same ISO week resolve to the same Algebra problem', () => {
    const monday = getWeeklyChallenge(new Date('2026-07-13T00:01:00Z'));
    const sunday = getWeeklyChallenge(new Date('2026-07-19T23:59:00Z'));

    assert.equal(monday.weekKey, '2026-W29');
    assert.equal(monday.weekKey, sunday.weekKey);
    assert.equal(monday.problemId, sunday.problemId);
    assert.ok(WEEKLY_CHALLENGE_PROBLEMS.some(({ problemId }) => problemId === monday.problemId));
});

test('adjacent calendar weeks rotate to different problems', () => {
    const current = getWeeklyChallenge(new Date('2026-07-13T12:00:00Z'));
    const next = getWeeklyChallenge(new Date('2026-07-20T12:00:00Z'));

    assert.notEqual(current.weekKey, next.weekKey);
    assert.notEqual(current.problemId, next.problemId);
});

test('rotation remains sequential across the ISO year boundary', () => {
    const finalWeek = getWeeklyChallenge(new Date('2025-12-28T12:00:00Z'));
    const firstWeek = getWeeklyChallenge(new Date('2025-12-29T12:00:00Z'));

    assert.equal(finalWeek.weekKey, '2025-W52');
    assert.equal(firstWeek.weekKey, '2026-W01');
    assert.notEqual(finalWeek.problemId, firstWeek.problemId);
    assert.equal(getIsoWeek(new Date('2026-01-01T12:00:00Z')).weekKey, '2026-W01');
});

test('week keys recreate the same challenge and reject invalid weeks', () => {
    const challenge = getWeeklyChallengeByKey('2026-W29');

    assert.equal(challenge.weekKey, '2026-W29');
    assert.equal(getWeeklyChallengeByKey('2026-W54'), null);
    assert.equal(getWeeklyChallengeByKey('not-a-week'), null);
});

test('problem and summary routes preserve the exact challenge week', () => {
    const challenge = getWeeklyChallenge(new Date('2026-07-13T12:00:00Z'));
    const problemPath = getWeeklyChallengeProblemPath(challenge);
    const summaryPath = getWeeklyChallengeSummaryPath(challenge, true);
    const problemParams = new URLSearchParams(problemPath.split('?')[1]);

    assert.equal(problemPath, `/problems/${challenge.problemSlug}?challenge=weekly&week=2026-W29`);
    assert.equal(summaryPath, '/challenge/weekly?week=2026-W29&completed=1');
    assert.equal(
        getWeeklyChallengeFromProblemParams(challenge.problemSlug, problemParams)?.weekKey,
        challenge.weekKey
    );
    assert.equal(getWeeklyChallengeFromProblemParams('wrong-problem', problemParams), null);
});
