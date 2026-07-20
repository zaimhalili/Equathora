import { supabase } from './supabaseClient';

const SUBSCRIBE_ERROR_MESSAGE = 'Something went wrong on our side. Please try again in a little while.';
const UNSUBSCRIBE_ERROR_MESSAGE = 'Could not update your email subscription right now. Please try again.';

const validateEmailOnly = (email) => {
    if (!email) {
        throw new Error('Please enter your email address.');
    }
};

export async function subscribeToEquathoraBriefs({ name, full_name, email, user_id }) {
    const rawName = name || full_name || '';
    const normalizedName = String(rawName).trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    validateEmailOnly(normalizedEmail);

    if (!normalizedName) {
        throw new Error('Name is required.');
    }

    const { error } = await supabase
        .from('equathora_briefs_list')
        .insert([
            {
                name: normalizedName,
                email: normalizedEmail,
                user_id: user_id ?? null
            }
        ]);

    if (error) {
        // 23505 = Unique constraint violation (Email already subscribed)
        if (error.code === '23505') {
            // Silently succeed so the modal shows the success state to existing subscribers
            return;
        }
        console.error('Supabase error during subscription:', error);
        throw new Error(SUBSCRIBE_ERROR_MESSAGE);
    }
}

export async function unsubscribeFromEquathoraBriefs() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        throw new Error('Please sign in to update your subscription.');
    }

    const email = session.user.email.trim().toLowerCase();
    const userId = session.user.id;

    // Delete matching either user_id OR email
    const { error } = await supabase
        .from('equathora_briefs_list')
        .delete()
        .or(`user_id.eq.${userId},email.eq.${email}`);

    if (error) {
        console.error('Supabase error during unsubscription:', error);
        throw new Error(UNSUBSCRIBE_ERROR_MESSAGE);
    }

    return true;
}

export async function isSubscribedToEquathoraBriefs(emailInput) {
    const email = String(emailInput || '').trim().toLowerCase();

    if (!email) return false;

    try {
        const { data, error } = await supabase
            .from('equathora_briefs_list')
            .select('email')
            .eq('email', email)
            .limit(1)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return Boolean(data?.email);
    } catch (error) {
        console.warn('Unable to resolve briefs subscription status', {
            email,
            reason: error?.message || 'unknown error',
        });
        return false;
    }
}