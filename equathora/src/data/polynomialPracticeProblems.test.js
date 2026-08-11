import test from 'node:test';
import assert from 'node:assert/strict';
import { polynomialPracticeGroups, polynomialPracticeProblems } from './polynomialPracticeProblems.js';

test('the polynomial page links to a focused set of unique live exercises', () => {
    const slugs = polynomialPracticeProblems.map(({ slug }) => slug);

    assert.equal(polynomialPracticeProblems.length, 12);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(polynomialPracticeProblems.every(({ grade }) => grade >= 8 && grade <= 10));
    assert.ok(polynomialPracticeProblems.every(({ difficulty }) => ['Easy', 'Medium'].includes(difficulty)));
});

test('every polynomial exercise appears in exactly one skill group', () => {
    const groupedSlugs = polynomialPracticeGroups.flatMap(({ problems }) => problems.map(({ slug }) => slug));

    assert.deepEqual(groupedSlugs, polynomialPracticeProblems.map(({ slug }) => slug));
});
