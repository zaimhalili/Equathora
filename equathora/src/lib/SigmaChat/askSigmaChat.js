import { supabase } from "../supabaseClient";
import { getFriendlySigmaErrorMessage, sanitizePromptText } from "./aiSafety";

const SIGMA_FUNCTION_NAME = 'ask-gemini';
const SIGMA_MAX_RETRIES = 2;
const SIGMA_RETRY_DELAY_MS = 750;
const FOLLOWUP_HISTORY_LIMIT = 6;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractTextResponse = (data) => {
    if (typeof data === 'string') {
        if (data.trim().startsWith('{')) {
            try {
                const parsed = JSON.parse(data);
                const innerText = extractTextResponse(parsed);
                if (innerText) return innerText;
            } catch {
                // Not valid JSON, process as string below
            }
        }
        return data.trim();
    }

    if (!data || typeof data !== 'object') return '';
    const candidate = data.text ?? data.message ?? data.response ?? data.answer ?? data.output;
    return typeof candidate === 'string' ? candidate.trim() : '';
};

export async function askSigmaChat({
    problemDescription,
    userSteps,
    acceptedAnswer,
    chatHistory = [],
    userNewMessage,
    lastAnalyzedSteps = null,
}) {
    const isFreshSession = chatHistory.length === 0;
    const stepsChanged = userSteps !== lastAnalyzedSteps;
    const needsFullContext = isFreshSession || stepsChanged;

    // Client-side trimming here is a UX/payload-size convenience only —
    // NOT a security boundary. The edge function re-validates and
    // re-sanitizes every field independently, so a direct API caller
    // bypassing this file gains nothing.
    const historyPayload = chatHistory
        .filter(m => m.sender && m.text)
        .slice(needsFullContext ? -20 : -FOLLOWUP_HISTORY_LIMIT)
        .map((m) => ({
            role: m.sender === 'user' ? 'student' : 'sigma',
            content: sanitizePromptText(m.text, 500),
        }));

    // Only structured, untrusted student data goes over the wire. No system
    // prompt, no instructions, nothing that shapes Sigma's behavior — that
    // now lives entirely server-side in ask-gemini.ts and is applied by
    // Gemini itself via systemInstruction on every call, regardless of
    // what any client sends.
    const payload = {
        problemDescription: sanitizePromptText(problemDescription, 1000),
        acceptedAnswer: sanitizePromptText(acceptedAnswer, 500),
        userSteps: needsFullContext
            ? sanitizePromptText(userSteps || 'No steps submitted yet.', 4000)
            : '(unchanged since last turn — see prior analysis in conversation history)',
        chatHistory: historyPayload,
        userNewMessage: sanitizePromptText(userNewMessage, 500),
    };

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers = session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {};

        let lastError = null;

        for (let attempt = 0; attempt <= SIGMA_MAX_RETRIES; attempt += 1) {
            const { data, error } = await supabase.functions.invoke(SIGMA_FUNCTION_NAME, {
                body: payload,
                headers,
            });

            if (!error) {
                const dataString = typeof data === 'string' ? data : JSON.stringify(data);
                if (dataString.includes('RESOURCE_EXHAUSTED') || dataString.includes('prepayment credits')) {
                    throw new Error(dataString);
                }

                if (data?.error) {
                    const appError = new Error(data.text || 'Sigma could not process that request.');
                    appError.isSigmaAppError = true;
                    appError.quotaReached = Boolean(data.quota_reached);
                    appError.upgradeRequired = Boolean(data.upgrade_required);
                    throw appError;
                }

                const text = extractTextResponse(data);
                if (!text) throw new Error('Empty response from Supabase function');

                return { text, analyzedSteps: userSteps };
            }

            lastError = error;
            const retryableStatus = error?.status === 503 || error?.status === 429 || error?.context?.status === 503 || error?.context?.status === 429;
            if (!retryableStatus || attempt === SIGMA_MAX_RETRIES) throw error;

            await sleep(SIGMA_RETRY_DELAY_MS * (attempt + 1));
        }

        throw lastError ?? new Error('Sigma chat request failed');
    } catch (err) {
        console.error("askSigmaChat error:", err);

        const userMessage = err?.isSigmaAppError ? err.message : getFriendlySigmaErrorMessage(err);

        const wrappedError = new Error(userMessage);
        wrappedError.userMessage = userMessage;
        wrappedError.quotaReached = Boolean(err?.quotaReached);
        wrappedError.upgradeRequired = Boolean(err?.upgradeRequired);
        wrappedError.cause = err;
        throw wrappedError;
    }
}