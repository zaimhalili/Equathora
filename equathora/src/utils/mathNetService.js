import axios from 'axios';

/**
 * Sends the user answer and problem to the backend for Math.NET validation.
 * @param {string} userAnswer - The user's answer.
 * @param {object} problem - The problem object containing the correct answer and steps.
 * @returns {object} - Validation result with isCorrect, feedback, and score.
 */
export const validateExpression = async (userAnswer, problem) => {
    try {
        const response = await axios.post('/api/validate-step', {
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
        const response = await axios.post('/api/problem/validate-step', {
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