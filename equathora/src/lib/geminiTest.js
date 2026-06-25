import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function testGemini({ problemDescription, userSteps, acceptedAnswer }) {
    // Build a precise prompt instructing Gemini to behave like a math debugger
    const strictPrompt = `
        You are a precise mathematical instructor and debugger. Your job is to check if the student's step-by-step solution is correct based on the problem description and the accepted final answer.

        Problem Description: ${problemDescription || "No description provided."}
        Accepted Correct Answer: ${acceptedAnswer || "No static solution provided."}

        Student's Step-by-Step Solution (in LaTeX):
        ${userSteps}

        Instructions:
        1. Check each step line by line.
        2. If the student made a calculation error, syntax error, or logical error, point out exactly which line it happened on and explain why it is incorrect.
        3. If all steps are mathematically flawless and lead to a valid conclusion, reply exactly with: "Excellent! All steps are correct."
    `;

    const { data, error } = await supabase.functions.invoke('ask-gemini', {
        body: { prompt: strictPrompt },
    });

    if (error) {
        console.error("Error calling Gemini API:", error);
        return null;
    }

    console.log("Gemini Feedback: ", data.text);
    return data.text; // Return the text so your component can render it
}
