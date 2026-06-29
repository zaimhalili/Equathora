import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function askSigmaChat({
    problemDescription,
    userSteps,
    acceptedAnswer,
    chatHistory = [],
    userNewMessage,
}) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const historyText = chatHistory
        .filter(m => m.sender && m.text)
        .map(m => `${m.sender === 'user' ? 'Student' : 'Sigma'}: ${m.text}`)
        .join('\n');

    const prompt = `
        You are Sigma, a precise and encouraging math tutor helping a student solve a problem step by step.
        You are concise — you never write more than 3 sentences unless the student explicitly asks for more detail.
        You never reveal the full answer. You guide, not solve.

        PROBLEM:
        ${String(problemDescription ?? '').slice(0, 1000)}

        CORRECT FINAL ANSWER (never reveal this directly):
        ${String(acceptedAnswer ?? '').slice(0, 500)}

        STUDENT'S CURRENT STEPS:
        ${userSteps || 'No steps submitted yet.'}

        CONVERSATION SO FAR:
        ${historyText || 'This is the start of the conversation.'}

        Student: ${userNewMessage}

        Sigma:`.trim();

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        if (!text) throw new Error("Empty response from Gemini");
        return text;
    } catch (err) {
        console.error("askSigmaChat error:", err);
        throw err;
    }
}