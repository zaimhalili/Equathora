import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getComparisonPageEvent,
    getComparisonProblemHandoff,
    getSafeProblemPath,
    releaseTrafficConstants,
    savePendingComparisonHandoff,
    takePendingComparisonHandoff,
} from './releaseTraffic.js';

const origin = 'https://www.equathora.com';

function createStorage() {
    const values = new Map();

    return {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: (key) => values.delete(key),
    };
}

test('each comparison route produces a distinct privacy-safe page event', () => {
    const expected = new Map([
        ['/khan-academy-alternative', 'khan_academy'],
        ['/ixl-alternative', 'ixl'],
        ['/brilliant-alternative', 'brilliant'],
    ]);

    for (const [route, comparison] of expected) {
        assert.deepEqual(getComparisonPageEvent(route, origin), {
            comparison,
            route,
            source: 'equathora_web',
            $current_url: `${origin}${route}`,
        });
    }

    assert.equal(getComparisonPageEvent('/learn', origin), null);
});

test('problem handoffs retain only allowlisted route context', () => {
    assert.deepEqual(
        getComparisonProblemHandoff(
            '/ixl-alternative',
            `${origin}/problems/combine-linear-terms?email=learner%40example.com#answer`,
            origin
        ),
        {
            comparison: 'ixl',
            source_route: '/ixl-alternative',
            destination_route: '/problems/combine-linear-terms',
            source: 'equathora_web',
            $current_url: `${origin}/ixl-alternative`,
        }
    );
});

test('external, malformed, and non-problem destinations are rejected', () => {
    assert.equal(getSafeProblemPath('https://evil.example/problems/algebra-1', origin), null);
    assert.equal(getSafeProblemPath('/auth/callback?token=secret', origin), null);
    assert.equal(getSafeProblemPath('/problems/algebra-1/extra', origin), null);
    assert.equal(getComparisonProblemHandoff('/learn', '/problems/algebra-1', origin), null);
});

test('a pending handoff survives authentication and is consumed at its selected problem', () => {
    const storage = createStorage();
    const selectedAt = 10_000;
    const handoff = getComparisonProblemHandoff(
        '/brilliant-alternative',
        '/problems/scientific-notation-1?next=%2Fauth%2Fcallback',
        origin
    );

    assert.equal(savePendingComparisonHandoff(storage, handoff, selectedAt), true);
    assert.deepEqual(
        takePendingComparisonHandoff(storage, '/problems/scientific-notation-1', origin, selectedAt + 1_000),
        {
            comparison: 'brilliant',
            source_route: '/brilliant-alternative',
            destination_route: '/problems/scientific-notation-1',
            source: 'equathora_web',
            $current_url: `${origin}/problems/scientific-notation-1`,
        }
    );
    assert.equal(
        storage.getItem(releaseTrafficConstants.pendingHandoffKey),
        null
    );
});

test('expired or mismatched handoffs are discarded', () => {
    const storage = createStorage();
    const handoff = getComparisonProblemHandoff(
        '/khan-academy-alternative',
        '/problems/algebra-1',
        origin
    );

    savePendingComparisonHandoff(storage, handoff, 1_000);
    assert.equal(
        takePendingComparisonHandoff(
            storage,
            '/problems/algebra-1',
            origin,
            1_000 + releaseTrafficConstants.handoffTtlMs + 1
        ),
        null
    );

    savePendingComparisonHandoff(storage, handoff, 1_000);
    assert.equal(
        takePendingComparisonHandoff(storage, '/problems/algebra-2', origin, 2_000),
        null
    );
});
