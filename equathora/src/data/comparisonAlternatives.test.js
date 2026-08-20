import test from 'node:test';
import assert from 'node:assert/strict';
import { comparisonAlternatives } from './comparisonAlternatives.js';

test('the comparison batch has one distinct route per selected competitor', () => {
    const pages = Object.values(comparisonAlternatives);

    assert.deepEqual(pages.map((page) => page.slug), ['ixl-alternative', 'brilliant-alternative']);
    assert.equal(new Set(pages.map((page) => page.title)).size, pages.length);
    assert.equal(new Set(pages.map((page) => page.introduction)).size, pages.length);
});

test('every comparison page links four real guided practice destinations with context', () => {
    for (const page of Object.values(comparisonAlternatives)) {
        assert.equal(page.problems.length, 4);

        for (const problem of page.problems) {
            assert.ok(problem.slug.length > 0);
            assert.ok(problem.title.length > 0);
            assert.ok(problem.topic.length > 0);
            assert.ok(Number.isInteger(problem.grade));
            assert.ok(['Easy', 'Medium', 'Hard'].includes(problem.difficulty));
        }
    }
});

test('comparison copy is substantial and unique across the two pages', () => {
    const pages = Object.values(comparisonAlternatives);

    for (const page of pages) {
        assert.equal(page.comparisonRows.length, 5);
        assert.equal(page.fitPoints.length, 3);
        assert.match(page.sourceNote, /checked August 2026/);
    }

    const ixlCopy = JSON.stringify(comparisonAlternatives.ixl);
    const brilliantCopy = JSON.stringify(comparisonAlternatives.brilliant);
    assert.notEqual(ixlCopy, brilliantCopy);
});
