import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function testGemini({ problemDescription, userSteps, acceptedAnswer }) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a strict but encouraging math tutor reviewing a student's step-by-step solution.

PROBLEM:
${problemDescription}

CORRECT FINAL ANSWER:
${acceptedAnswer}

STUDENT'S STEPS:
${userSteps}

Find the FIRST wrong step and respond ONLY with valid JSON, no markdown:
{
  "step": <integer>,
  "text": "<one sentence describing exactly what went wrong, do not reveal the answer>"
}
`.trim();

    try {
        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim().replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(raw);
        if (typeof parsed.step !== 'number' || typeof parsed.text !== 'string') throw new Error('Bad shape');
        return { step: parsed.step, text: parsed.text };
    } catch (err) {
        console.error("testGemini error:", err);
        return { step: null, text: "Something went wrong analyzing your steps. Please try again." };
    }
}