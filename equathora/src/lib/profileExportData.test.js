import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildDifficultyExportItems,
    getSolvedTopics,
    normalizeDifficultySummary
} from './profileExportData.js';

test('normalizes every configured difficulty instead of limiting exports to three', () => {
    const summary = normalizeDifficultySummary([
        { key: 'beginner', label: 'Beginner', solved: 2, total: 4 },
        { key: 'standard', label: 'Standard', solved: 1, total: 2 },
        { key: 'expert', label: 'Expert', solved: 1, total: 1 }
    ]);

    assert.deepEqual(summary.map(({ key }) => key), ['beginner', 'standard', 'expert']);
    assert.equal(summary[2].percentage, 100);
});

test('builds export rows for every available difficulty', () => {
    const rows = buildDifficultyExportItems([
        { key: 'beginner', label: 'Beginner', solved: 2, total: 4 },
        { key: 'expert', label: 'Expert', solved: 1, total: 1 }
    ]);

    assert.deepEqual(rows, [
        ['Beginner Problems Solved', '2 / 4'],
        ['Expert Problems Solved', '1 / 1'],
        ['Beginner Completion Rate', '50%'],
        ['Expert Completion Rate', '100%']
    ]);
});

test('lists every distinct topic represented by completed problems', () => {
    const topics = getSolvedTopics([
        { id: 1, topic: 'Polynomial Equations' },
        { id: 2, topic: 'Exponents Product Rule' },
        { id: 3, topic: 'Polynomial Equations' },
        { id: 4, topic: 'Unsolved Topic' }
    ], ['1', 2, 3]);

    assert.deepEqual(topics, ['Exponents Product Rule', 'Polynomial Equations']);
});
