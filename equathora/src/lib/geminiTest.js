import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function testGemini({ problemDescription, userSteps, acceptedAnswer }) {
    // ----------------------------------------------------
    // LOCAL DEVELOPMENT MOCK (100% FREE / NO API LIMITS)
    // ----------------------------------------------------
    console.log("Mocking AI response locally. Steps received:", userSteps);

    // Simulate a 1-second network delay so your loader text feels real
    await new Promise((resolve) => setTimeout(resolve, 10));

    // This fakes a response telling your UI that Step 2 is incorrect
    return {
        step: 2,
        text: "Look closely at Step 2. You accidentally added the number 5 instead of subtracting it from both sides."
    };
}
