export const RESEND_COOLDOWN_SECONDS = 60;

export function buildVerificationPath(email) {
    return `/verify?email=${encodeURIComponent(email.trim())}`;
}

export function getResendCooldownSeconds(error) {
    const message = error?.message || '';
    const explicitDelay = message.match(/after\s+(\d+)\s+seconds?/i);

    if (explicitDelay) {
        return Math.max(Number(explicitDelay[1]), 1);
    }

    if (/rate limit|too many requests|security purposes/i.test(message)) {
        return RESEND_COOLDOWN_SECONDS;
    }

    return 0;
}

export function getResendErrorMessage(error) {
    const cooldownSeconds = getResendCooldownSeconds(error);

    if (cooldownSeconds > 0) {
        return `Please wait ${cooldownSeconds} seconds before requesting another confirmation link.`;
    }

    return 'We could not send another confirmation link. Please try again in a moment.';
}

export function getResendButtonLabel({ loading, cooldownSeconds }) {
    if (loading) {
        return 'Sending...';
    }

    if (cooldownSeconds > 0) {
        return `Resend available in ${cooldownSeconds}s`;
    }

    return 'Resend confirmation link';
}
