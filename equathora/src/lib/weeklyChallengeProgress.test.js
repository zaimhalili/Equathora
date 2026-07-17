import test from 'node:test';
import assert from 'node:assert/strict';
import { getWeeklyChallenge } from '../data/weeklyChallenge.js';
import {
    getWeeklyChallengeCompletion,
    getWeeklyChallengeCompletions,
    isWeeklyChallengeCompleted,
    markWeeklyChallengeCompleted,
} from './weeklyChallengeProgress.js';

const createStorage = () => {
    const data = new Map();
    return {
        getItem: (key) => data.get(key) ?? null,
        setItem: (key, value) => data.set(key, value),
    };
};

test('completion is stored separately for each challenge week', () => {
    const storage = createStorage();
    const weekOne = getWeeklyChallenge(new Date('2026-07-13T12:00:00Z'));
    const weekTwo = getWeeklyChallenge(new Date('2026-07-20T12:00:00Z'));

    markWeeklyChallengeCompleted(weekOne, storage, new Date('2026-07-17T12:00:00Z'));
    markWeeklyChallengeCompleted(weekTwo, storage, new Date('2026-07-24T12:00:00Z'));

    const completions = getWeeklyChallengeCompletions(storage);
    assert.equal(Object.keys(completions).length, 2);
    assert.equal(completions[weekOne.weekKey].problemId, weekOne.problemId);
    assert.equal(completions[weekTwo.weekKey].problemId, weekTwo.problemId);
    assert.equal(getWeeklyChallengeCompletion(weekOne.weekKey, storage).weekLabel, weekOne.weekLabel);
    assert.equal(isWeeklyChallengeCompleted(weekTwo.weekKey, storage), true);
});

test('replaying a completed week keeps its original completion time', () => {
    const storage = createStorage();
    const challenge = getWeeklyChallenge(new Date('2026-07-13T12:00:00Z'));

    markWeeklyChallengeCompleted(challenge, storage, new Date('2026-07-17T12:00:00Z'));
    markWeeklyChallengeCompleted(challenge, storage, new Date('2026-07-18T12:00:00Z'));

    assert.equal(
        getWeeklyChallengeCompletion(challenge.weekKey, storage).completedAt,
        '2026-07-17T12:00:00.000Z'
    );
});
