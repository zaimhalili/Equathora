import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildVerificationPath,
    getResendButtonLabel,
    getResendCooldownSeconds,
    getResendErrorMessage,
    RESEND_COOLDOWN_SECONDS,
} from './emailVerification.js';

test('verification path preserves the complete email address', () => {
    assert.equal(
        buildVerificationPath(' learner+algebra@example.com '),
        '/verify?email=learner%2Balgebra%40example.com',
    );
});

test('provider rate limits become a safe resend cooldown', () => {
    const error = new Error('email rate limit exceeded');

    assert.equal(getResendCooldownSeconds(error), RESEND_COOLDOWN_SECONDS);
    assert.equal(
        getResendErrorMessage(error),
        'Please wait 60 seconds before requesting another confirmation link.',
    );
});

test('an explicit provider delay is preserved for the learner', () => {
    const error = new Error('For security purposes, you can only request this after 37 seconds.');

    assert.equal(getResendCooldownSeconds(error), 37);
    assert.equal(
        getResendButtonLabel({ loading: false, cooldownSeconds: 37 }),
        'Resend available in 37s',
    );
});

test('unknown provider errors do not expose internal details', () => {
    const error = new Error('SMTP relay rejected the recipient');

    assert.equal(getResendCooldownSeconds(error), 0);
    assert.equal(
        getResendErrorMessage(error),
        'We could not send another confirmation link. Please try again in a moment.',
    );
});
