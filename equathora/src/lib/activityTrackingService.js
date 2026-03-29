import { supabase } from './supabaseClient';
import { capturePostHogEvent, identifyPostHogUser } from './posthogClient';

const keyForUser = (userId) => `equathora_last_activity_ping_${userId}`;
const keyForSignup = (userId) => `equathora_signup_event_ping_${userId}`;

const todayIso = () => new Date().toISOString().split('T')[0];

const isoDateFrom = (value) => {
    if (!value) return todayIso();

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return todayIso();

    return parsed.toISOString().split('T')[0];
};

const isoTimestampFrom = (value) => {
    if (!value) return new Date().toISOString();

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return new Date().toISOString();

    return parsed.toISOString();
};

async function insertActivityEvent(userId, eventType, eventTimestamp) {
    const normalizedCreatedAt = isoTimestampFrom(eventTimestamp);

    return supabase
        .from('user_activity_events')
        .insert({
            user_id: userId,
            event_type: eventType,
            event_date: isoDateFrom(normalizedCreatedAt),
            created_at: normalizedCreatedAt
        });
}

export async function trackActivityEvent(eventType, eventTimestamp = new Date(), metadata = {}) {
    try {
        if (typeof eventType !== 'string' || eventType.trim().length === 0) {
            return false;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) return false;

        const normalizedEventType = eventType.trim().toLowerCase();
        identifyPostHogUser(session.user);
        const trackedInPostHog = capturePostHogEvent(normalizedEventType, {
            source: 'equathora_web',
            user_id: userId,
            ...metadata
        });

        const { error } = await insertActivityEvent(userId, normalizedEventType, eventTimestamp);

        if (error) {
            console.warn('Activity event tracking failed:', error.message || error);
            return trackedInPostHog;
        }

        return true;
    } catch (error) {
        console.warn('Activity event tracking error:', error);
        return false;
    }
}

async function ensureSignupEvent(userId, userCreatedAt) {
    const key = keyForSignup(userId);
    if (localStorage.getItem(key) === '1') return;

    const { data: existingSignup, error: lookupError } = await supabase
        .from('user_activity_events')
        .select('id')
        .eq('user_id', userId)
        .eq('event_type', 'signup')
        .limit(1)
        .maybeSingle();

    if (lookupError) {
        console.warn('Signup activity lookup failed:', lookupError.message || lookupError);
        return;
    }

    if (existingSignup?.id) {
        localStorage.setItem(key, '1');
        return;
    }

    const { error } = await insertActivityEvent(userId, 'signup', userCreatedAt);

    if (error) {
        // Keep this best-effort: analytics tracking must never block app usage.
        console.warn('Signup activity tracking failed:', error.message || error);
        return;
    }

    capturePostHogEvent('signup', {
        source: 'equathora_web',
        user_id: userId,
        created_at: isoTimestampFrom(userCreatedAt)
    });

    localStorage.setItem(key, '1');
}

// Track one activity event per user per day to power DAU/WAU analytics.
export async function trackDailyActivity() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        const userId = user?.id;
        if (!userId) return;

        identifyPostHogUser(user);

        await ensureSignupEvent(userId, user?.created_at);

        const today = todayIso();
        const key = keyForUser(userId);
        if (localStorage.getItem(key) === today) return;

        const { error } = await insertActivityEvent(userId, 'app_active', new Date().toISOString());

        if (error) {
            // Keep this best-effort: analytics tracking must never block app usage.
            console.warn('Activity tracking failed:', error.message || error);
            return;
        }

        capturePostHogEvent('app_active', {
            source: 'equathora_web',
            user_id: userId,
            event_date: today
        });

        localStorage.setItem(key, today);
    } catch (error) {
        console.warn('Activity tracking error:', error);
    }
}
