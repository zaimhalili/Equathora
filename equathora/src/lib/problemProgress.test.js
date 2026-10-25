import assert from 'node:assert/strict';
import test from 'node:test';
import { getProblemBaseXp } from './problemProgress.js';

test('returns the solve reward base XP for each supported difficulty', () => {
    const rewards = {
        Beginner: 25,
        Easy: 50,
        Standard: 50,
        Intermediate: 50,
        Medium: 100,
        Challenging: 175,
        Hard: 250,
        Advanced: 400
    };

    for (const [difficulty, expectedXp] of Object.entries(rewards)) {
        assert.equal(getProblemBaseXp(difficulty), expectedXp, difficulty);
    }
});

test('normalizes difficulty and defaults unknown values to the base solve reward', () => {
    assert.equal(getProblemBaseXp('  HARD  '), 250);
    assert.equal(getProblemBaseXp('Unknown'), 50);
    assert.equal(getProblemBaseXp(undefined), 50);
});
