import { supabase } from "./supabaseClient";

const SIGMA_FUNCTION_NAME = 'ask-gemini';

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

export async function testGemini({ problemDescription, userSteps, acceptedAnswer }) {
    const prompt = `
You are a strict but encouraging math tutor reviewing a student's step-by-step solution.

PROBLEM:
${problemDescription}

CORRECT FINAL ANSWER:
${acceptedAnswer}

STUDENT'S STEPS:
${userSteps}

Find the all the wrong steps (even if the student comes close to the correct answer later) and respond ONLY with valid JSON, no markdown:
{
  "step": <integer>,
  "text": "<one sentence describing exactly what went wrong, do not reveal the answer>"
}
`.trim();

    try {
        const { data, error } = await supabase.functions.invoke(SIGMA_FUNCTION_NAME, {
            body: {
                problemDescription: String(problemDescription ?? '').slice(0, 1000),
                userSteps: String(userSteps ?? '').slice(0, 4000),
                acceptedAnswer: String(acceptedAnswer ?? '').slice(0, 500),
                prompt,
                mode: 'step-analysis',
            },
        });

        if (error) throw error;

        const raw = extractTextResponse(data).replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(raw);
        if (typeof parsed.step !== 'number' || typeof parsed.text !== 'string') throw new Error('Bad shape');
        return { step: parsed.step, text: parsed.text };
    } catch (err) {
        console.error("testGemini error:", err);
        return { step: null, text: "Something went wrong analyzing your steps. Please try again." };
    }
}