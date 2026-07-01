import { supabase } from "../supabaseClient";

const SIGMA_FUNCTION_NAME = 'ask-gemini';
const SIGMA_MAX_RETRIES = 2;
const SIGMA_RETRY_DELAY_MS = 750;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractTextResponse = (data) => {
    if (typeof data === 'string') {
        return data.trim();
    }

    if (!data || typeof data !== 'object') {
        return '';
    }

    const candidate = data.text ?? data.message ?? data.response ?? data.answer ?? data.output;
    return typeof candidate === 'string' ? candidate.trim() : '';
};

export async function askSigmaChat({
    problemDescription,
    userSteps,
    acceptedAnswer,
    chatHistory = [],
    userNewMessage,
}) {
    const historyText = chatHistory
        .filter(m => m.sender && m.text)
        .map(m => `${m.sender === 'user' ? 'Student' : 'Sigma'}: ${m.text}`)
        .join('\n');

    const prompt = `
        You are Sigma, a precise and encouraging math tutor made by Equathora.
        You are concise, you never reveal the full answer, and you guide the student step by step. Do not provide any explanations outside of the context of the student's steps and the problem at hand. Always respond in a way that encourages learning and understanding. Do not provide any code or programming-related content. Your responses should be in plain text, and you should never reveal the correct answer directly. Instead, focus on guiding the student to identify and correct their mistakes. Try not to write LaTeX unless completely necessary.

        PROBLEM:
        ${String(problemDescription ?? '').slice(0, 1000)}

        CORRECT FINAL ANSWER (never reveal this directly):
        ${String(acceptedAnswer ?? '').slice(0, 500)}

        STUDENT'S CURRENT STEPS:
        ${userSteps || 'No steps submitted yet.'}

        CONVERSATION SO FAR:
        ${historyText || 'This is the start of the conversation.'}

        Student: ${String(userNewMessage ?? '').trim()}

        Sigma:
        `.trim();

    const payload = {
        problemDescription: String(problemDescription ?? '').slice(0, 1000),
        acceptedAnswer: String(acceptedAnswer ?? '').slice(0, 500),
        userSteps: userSteps || 'No steps submitted yet.',
        chatHistory: historyText || 'This is the start of the conversation.',
        userNewMessage: String(userNewMessage ?? '').trim(),
        prompt,
    };

    try {
        let lastError = null;

        for (let attempt = 0; attempt <= SIGMA_MAX_RETRIES; attempt += 1) {
            const { data, error } = await supabase.functions.invoke(SIGMA_FUNCTION_NAME, {
                body: payload,
            });

            if (!error) {
                const text = extractTextResponse(data);
                if (!text) throw new Error('Empty response from Supabase function');
                return text;
            }

            lastError = error;
            const retryableStatus = error?.status === 503 || error?.context?.status === 503;
            if (!retryableStatus || attempt === SIGMA_MAX_RETRIES) {
                throw error;
            }

            await sleep(SIGMA_RETRY_DELAY_MS * (attempt + 1));
        }

        throw lastError ?? new Error('Sigma chat request failed');
    } catch (err) {
        console.error("askSigmaChat error:", err);
        throw err;
    }
}