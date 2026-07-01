import { supabase } from '../supabaseClient';

const CHAT_TABLE = 'sigma_chat_threads';

const DEFAULT_CHAT_STATE = {
    messages: [],
    draft: '',
};

const normalizeChatState = (state) => ({
    messages: Array.isArray(state?.messages) ? state.messages : [],
    draft: typeof state?.draft === 'string' ? state.draft : '',
});

const getCurrentUserId = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user?.id) {
        return null;
    }

    return session.user.id;
};

export async function loadSigmaChatState(storageKey) {
    if (!storageKey) {
        return DEFAULT_CHAT_STATE;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return DEFAULT_CHAT_STATE;
    }

    const { data, error } = await supabase
        .from(CHAT_TABLE)
        .select('messages, draft')
        .eq('user_id', userId)
        .eq('storage_key', storageKey)
        .maybeSingle();

    if (error) {
        console.error('loadSigmaChatState error:', error);
        return DEFAULT_CHAT_STATE;
    }

    return normalizeChatState(data);
}

export async function saveSigmaChatState(storageKey, state) {
    if (!storageKey) {
        return;
    }

    const userId = await getCurrentUserId();
    if (!userId) {
        return;
    }

    const normalizedState = normalizeChatState(state);
    const payload = {
        user_id: userId,
        storage_key: storageKey,
        messages: normalizedState.messages,
        draft: normalizedState.draft,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from(CHAT_TABLE)
        .upsert(payload, { onConflict: 'user_id,storage_key' });

    if (error) {
        console.error('saveSigmaChatState error:', error);
    }
}

export { DEFAULT_CHAT_STATE };