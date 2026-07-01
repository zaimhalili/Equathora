import axios from 'axios';

const DEFAULT_LOCAL_BACKEND = 'http://localhost:5104';

const normalizeBase = (value) => {
    if (!value || typeof value !== 'string') return '';
    return value.trim().replace(/\/$/, '');
};

const buildApiBase = () => {
    const explicit = normalizeBase(
        import.meta.env.VITE_API_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        import.meta.env.VITE_API_BASE_URL
    );

    if (explicit) {
        return explicit;
    }

    const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : '';
    const isLocalRuntime = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1';
    return isLocalRuntime ? DEFAULT_LOCAL_BACKEND : '';
};

const API_BASE = buildApiBase();

/**
 * Sends the user answer and problem to the backend for Math.NET validation.
 * @param {string} userAnswer - The user's answer.
 * @param {object} problem - The problem object containing the correct answer and steps.
 * @returns {object} - Validation result with isCorrect, feedback, and score.
 */
export const validateExpression = async (userAnswer, problem) => {
    try {
        const response = await axios.post(`${API_BASE}/api/validate-step`, {
            userAnswer,
            problem
        });

        return response.data;
    } catch (error) {
        console.error('Error validating expression with Math.NET:', error);
        return {
            isCorrect: false,
            feedback: 'An error occurred while validating your answer. Please try again.',
            score: 0
        };
    }
};

/**
 * Sends the user steps and correct steps to the backend for step-by-step validation.
 * @param {Array<string>} userSteps - The user's solution steps.
 * @param {Array<string>} correctSteps - The correct solution steps.
 * @returns {object} - Validation result with feedback for each step.
 */
export const validateSteps = async (userSteps, correctSteps) => {
    try {
        const response = await axios.post(`${API_BASE}/api/problem/validate-step`, {
            steps: userSteps,
            correctSteps
        });

        return response.data;
    } catch (error) {
        console.error('Error validating steps with Math.NET:', error);
        return {
            feedback: ['An error occurred while validating your steps. Please try again.']
        };
    }
};