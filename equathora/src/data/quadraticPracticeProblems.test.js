import test from 'node:test';
import assert from 'node:assert/strict';
import { quadraticPracticeGroups, quadraticPracticeProblems } from './quadraticPracticeProblems.js';

test('the quadratic page links to a focused set of unique catalog exercises', () => {
    const slugs = quadraticPracticeProblems.map(({ slug }) => slug);
    const difficulties = new Set(quadraticPracticeProblems.map(({ difficulty }) => difficulty));

    assert.equal(quadraticPracticeProblems.length, 14);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(quadraticPracticeProblems.every(({ grade }) => grade === 10));
    assert.deepEqual(difficulties, new Set(['Easy', 'Medium', 'Hard']));
});

test('every quadratic exercise appears in exactly one practice group', () => {
    const groupedSlugs = quadraticPracticeGroups.flatMap(({ problems }) => problems.map(({ slug }) => slug));

    assert.deepEqual(groupedSlugs, quadraticPracticeProblems.map(({ slug }) => slug));
});
