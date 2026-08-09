import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EQUATHORA_POSTHOG_PROJECT_TOKEN,
    resolvePostHogKey
} from './posthogConfig.js';

test('the production domains use the existing project when Vercel has no key', () => {
    assert.equal(
        resolvePostHogKey({
            hostname: 'www.equathora.com',
            isProduction: true
        }),
        EQUATHORA_POSTHOG_PROJECT_TOKEN
    );

    assert.equal(
        resolvePostHogKey({
            hostname: 'equathora.com',
            isProduction: true
        }),
        EQUATHORA_POSTHOG_PROJECT_TOKEN
    );
});

test('the production fallback does not send preview or localhost traffic', () => {
    assert.equal(
        resolvePostHogKey({
            hostname: 'equathora-git-fix.vercel.app',
            isProduction: true
        }),
        ''
    );

    assert.equal(
        resolvePostHogKey({
            hostname: 'localhost',
            isProduction: false
        }),
        ''
    );
});

test('an explicit environment key preserves configured development tracking', () => {
    assert.equal(
        resolvePostHogKey({
            configuredKey: ' phc_local_configured_project ',
            hostname: 'localhost',
            isProduction: false
        }),
        'phc_local_configured_project'
    );
});
