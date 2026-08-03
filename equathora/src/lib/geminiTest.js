import { supabase } from "./supabaseClient";
import { getFriendlySigmaErrorMessage, sanitizePromptText, stripModelFormatting } from "./SigmaChat/aiSafety";

const SIGMA_FUNCTION_NAME = 'ask-gemini';

const extractJsonObject = (value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }

    let text = String(value ?? '').trim();
    if (!text) {
        throw new Error('Empty Gemini response');
    }

    // Clean markdown code blocks if present
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    try {
        return JSON.parse(text);
    } catch {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            try {
                return JSON.parse(text.slice(start, end + 1));
            } catch {
                // proceed to error
            }
        }
    }

    console.error("Failed to parse string into JSON:", text);
    throw new Error('Could not parse Gemini JSON response');
};

export async function testGemini({ problemDescription, userSteps, acceptedAnswer }) {
    // The backend owns the system instruction and the JSON schema for this
    // mode (see ask-gemini/index.ts, mode: 'step-analysis'). We only send
    // the raw fields it expects — there is no client-supplied prompt or
    // instruction override; the server ignores those by design.
    const problemDescriptionSanitized = sanitizePromptText(problemDescription, 1000);
    const acceptedAnswerSanitized = sanitizePromptText(acceptedAnswer, 500);
    const userStepsSanitized = sanitizePromptText(userSteps, 4000);

    if (!userStepsSanitized) {
        return { step: null, text: "Please enter at least one step before submitting." };
    }

    try {
        const { data, error } = await supabase.functions.invoke(SIGMA_FUNCTION_NAME, {
            body: {
                mode: 'step-analysis',
                problemDescription: problemDescriptionSanitized,
                acceptedAnswer: acceptedAnswerSanitized,
                userSteps: userStepsSanitized,
            },
        });

        if (error) {
            // Attempt to parse response body from Supabase FunctionsHttpError
            if (error.context?.json) {
                const body = await error.context.json();
                if (body?.text) throw new Error(body.text);
            }
            throw error;
        }

        if (data?.error) {
            throw new Error(data.text || "Sigma error");
        }

        const rawText = typeof data === 'string' ? data : (data?.text ?? data);
        const cleaned = typeof rawText === 'string' ? stripModelFormatting(rawText) : rawText;
        const parsed = extractJsonObject(cleaned);

        if (typeof parsed.step !== 'number' || typeof parsed.text !== 'string') {
            throw new Error('Bad shape');
        }

        return { step: parsed.step, text: parsed.text };
    } catch (err) {
        console.error("testGemini error:", err);
        const friendlyText = getFriendlySigmaErrorMessage(err);
        return { step: null, text: friendlyText };
    }
}