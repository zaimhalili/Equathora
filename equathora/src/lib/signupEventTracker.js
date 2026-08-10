export function createSignupEventTracker({
    storage,
    keyForUser,
    findExistingSignup,
    insertSignup,
    onExistingSignup,
    onSignupRecorded
}) {
    const pendingByUser = new Map();

    return async function ensureSignupEvent(userId, userCreatedAt) {
        const storageKey = keyForUser(userId);
        if (storage.getItem(storageKey) === '1') return false;

        const pendingRequest = pendingByUser.get(userId);
        if (pendingRequest) return pendingRequest;

        const request = (async () => {
            const { exists, error: lookupError } = await findExistingSignup(userId);

            if (lookupError) {
                console.warn('Signup activity lookup failed:', lookupError.message || lookupError);
                return false;
            }

            if (exists) {
                onExistingSignup(userId);
                storage.setItem(storageKey, '1');
                return false;
            }

            const { error: insertError } = await insertSignup(userId, userCreatedAt);

            if (insertError) {
                console.warn('Signup activity tracking failed:', insertError.message || insertError);
                return false;
            }

            onSignupRecorded(userId, userCreatedAt);
            storage.setItem(storageKey, '1');
            return true;
        })();

        pendingByUser.set(userId, request);

        try {
            return await request;
        } finally {
            if (pendingByUser.get(userId) === request) {
                pendingByUser.delete(userId);
            }
        }
    };
}
