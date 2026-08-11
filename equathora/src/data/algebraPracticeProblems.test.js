import test from 'node:test';
import assert from 'node:assert/strict';
import { algebraGradeGroups, algebraPracticeProblems } from './algebraPracticeProblems.js';

test('the Algebra page uses 18 distinct catalog exercises', () => {
    assert.equal(algebraPracticeProblems.length, 18);
    assert.equal(new Set(algebraPracticeProblems.map(({ slug }) => slug)).size, 18);
});

test('every listed exercise includes supported discovery details', () => {
    for (const problem of algebraPracticeProblems) {
        assert.ok(problem.title);
        assert.ok(problem.topic);
        assert.ok(problem.difficulty);
        assert.match(problem.slug, /^[a-z0-9-]+$/);
        assert.ok(problem.grade >= 8 && problem.grade <= 12);
    }
});

test('the grade index covers grades 8 through 12 without empty groups', () => {
    assert.deepEqual(algebraGradeGroups.map(({ grade }) => grade), [8, 9, 10, 11, 12]);
    assert.ok(algebraGradeGroups.every(({ problems }) => problems.length > 0));
});
