import assert from 'node:assert/strict';
import test from 'node:test';
import { khanAcademyAlternativeProblems } from './khanAcademyAlternativeProblems.js';

test('comparison page exercises use complete, unique destinations', () => {
    assert.equal(khanAcademyAlternativeProblems.length, 4);
    assert.equal(new Set(khanAcademyAlternativeProblems.map(({ slug }) => slug)).size, 4);

    for (const problem of khanAcademyAlternativeProblems) {
        assert.match(problem.slug, /^[a-z0-9-]+$/);
        assert.ok(problem.title);
        assert.ok(problem.topic);
        assert.ok(Number.isInteger(problem.grade));
        assert.ok(['Easy', 'Medium', 'Hard'].includes(problem.difficulty));
    }
});
