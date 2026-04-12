import test from 'node:test';
import assert from 'node:assert/strict';
import {
    applyProgressStateTransition,
    buildRankedProblems,
    detectRevisionTopics,
    PROBLEM_NODE_STATUS,
} from './recommendationEngine.js';

test('ranking prioritizes easier problems for weak learners', () => {
    const problems = [
        { id: '1', title: 'Linear Basics', topic: 'Algebra', difficulty: 'Easy' },
        { id: '2', title: 'Challenging Integrals', topic: 'Calculus', difficulty: 'Hard' },
        { id: '3', title: 'Quadratic Drill', topic: 'Algebra', difficulty: 'Medium' },
    ];

    const weakPlan = buildRankedProblems({
        problems,
        learnerBand: 'weak',
        solvedProblemIds: [],
        inProgressProblemIds: [],
        preferredTopics: [],
        revisionTopics: [],
    });

    const strongPlan = buildRankedProblems({
        problems,
        learnerBand: 'strong',
        solvedProblemIds: [],
        inProgressProblemIds: [],
        preferredTopics: [],
        revisionTopics: [],
    });

    assert.equal(weakPlan[0].difficultyBucket, 'easy');
    assert.equal(strongPlan[0].difficultyBucket, 'hard');
});

test('progress transitions unlock the next problem when one is solved', () => {
    const nodes = [
        { id: 'p1', status: PROBLEM_NODE_STATUS.AVAILABLE },
        { id: 'p2', status: PROBLEM_NODE_STATUS.LOCKED },
        { id: 'p3', status: PROBLEM_NODE_STATUS.LOCKED },
    ];

    const transitioned = applyProgressStateTransition(nodes, 'p1', 1);

    assert.equal(transitioned[0].status, PROBLEM_NODE_STATUS.SOLVED);
    assert.equal(transitioned[1].status, PROBLEM_NODE_STATUS.AVAILABLE);
    assert.equal(transitioned[2].status, PROBLEM_NODE_STATUS.LOCKED);
});

test('revision detection flags topics with low accuracy and high solve time', () => {
    const insights = [
        {
            topic: 'Trigonometry',
            attempts: 6,
            correct: 2,
            wrong: 4,
            accuracy: 33,
            avgSolveSeconds: 560,
            firstTryRate: 20,
            confidenceScore: 24,
        },
        {
            topic: 'Geometry',
            attempts: 4,
            correct: 3,
            wrong: 1,
            accuracy: 75,
            avgSolveSeconds: 210,
            firstTryRate: 75,
            confidenceScore: 72,
        },
    ];

    const revision = detectRevisionTopics(insights);

    assert.equal(revision.length, 1);
    assert.equal(revision[0].topic, 'Trigonometry');
    assert.ok(revision[0].reasons.includes('low accuracy'));
    assert.ok(revision[0].reasons.includes('high solve time'));
});
