// Client-side answer validation for static MVP
// This validates student answers against the problem's accepted answers

/**
 * Normalize answer for comparison
 * - Remove spaces
 * - Convert to lowercase
 * - Remove common variations
 * - Handle LaTeX output from MathLive
 */
const normalizeAnswer = (answer) => {
    if (!answer) return '';

    return answer
        .toString()
        .toLowerCase()
        .trim()
        // Handle fractions in various formats: (a)/(b) -> a/b
        .replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '$1/$2')
        // Handle sqrt variations
        .replace(/sqrt\(([^)]+)\)/g, 'sqrt($1)')
        .replace(/√/g, 'sqrt')
        // Handle exponents
        .replace(/\^(\d+)/g, '^$1')
        .replace(/\*\*/g, '^')
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        // Normalize spacing around operators
        .replace(/\s*\+\s*/g, '+')
        .replace(/\s*-\s*/g, '-')
        .replace(/\s*\*\s*/g, '*')
        .replace(/\s*\/\s*/g, '/')
        .replace(/\s*\^\s*/g, '^')
        // Normalize multiplication symbols
        .replace(/×|·|⋅/g, '*')
        // Normalize minus/dash symbols to hyphen
        .replace(/−|–|—/g, '-')
        // Remove spaces
        .replace(/\s+/g, '')
        // Remove commas (thousands separator)
        .replace(/,/g, '')
        // Remove dollar signs
        .replace(/\$/g, '')
        // Remove degree symbols
        .replace(/°/g, '')
        // Remove parentheses around single terms: (x) -> x
        .replace(/\(([a-z0-9]+)\)/g, '$1')
        // Handle implicit multiplication like 2x -> 2*x for comparison (optional)
        // Note: leaving as-is for now since accepted answers handle this
        ;
};

/**
 * Check if answer is within numerical tolerance
 */
const isNumericallyEqual = (userAnswer, correctAnswer, tolerance = 0.01) => {
    const userNum = parseFloat(userAnswer);
    const correctNum = parseFloat(correctAnswer);

    if (isNaN(userNum) || isNaN(correctNum)) {
        return false;
    }

    return Math.abs(userNum - correctNum) <= tolerance;
};

/**
 * Main validation function
 * Returns: { isCorrect: boolean, feedback: string, score: number }
 */
export const validateAnswer = (userAnswer, problem) => {
    if (!userAnswer || !problem) {
        return {
            isCorrect: false,
            feedback: 'Please provide an answer in the last step before submitting.',
            score: 0
        };
    }

    const normalizedUserAnswer = normalizeAnswer(userAnswer);
    const acceptedAnswers = problem.acceptedAnswers || [problem.answer];

    // Check exact matches first
    for (const accepted of acceptedAnswers) {
        const normalizedAccepted = normalizeAnswer(accepted);

        if (normalizedUserAnswer === normalizedAccepted) {
            return {
                isCorrect: true,
                feedback: 'Perfect! Your answer is correct!',
                score: 100
            };
        }
    }

    // Check numerical equality with tolerance
    for (const accepted of acceptedAnswers) {
        if (isNumericallyEqual(normalizedUserAnswer, accepted, 0.01)) {
            return {
                isCorrect: true,
                feedback: 'Correct! (Minor rounding difference, but answer is valid)',
                score: 100
            };
        }
    }

    // Check if answer is close (for partial credit)
    for (const accepted of acceptedAnswers) {
        if (isNumericallyEqual(normalizedUserAnswer, accepted, 0.5)) {
            return {
                isCorrect: false,
                feedback: 'You\'re close! Double-check your calculations. The answer is slightly off.',
                score: 50
            };
        }
    }

    // Completely wrong
    return {
        isCorrect: false,
        feedback: 'Not quite right. Review the problem and try again. Consider using a hint if you\'re stuck!',
        score: 0
    };
};

/**
 * Validate multi-step solution
 * For problems that require showing work
 */
export const validateMultiStep = (steps, problem) => {
    if (!steps || steps.length === 0) {
        return {
            isCorrect: false,
            feedback: 'Please show your work step by step',
            score: 0
        };
    }

    // Check final answer
    const finalStep = steps[steps.length - 1];
    const finalValidation = validateAnswer(finalStep, problem);

    if (!finalValidation.isCorrect) {
        return finalValidation;
    }

    // Award full points for correct final answer
    // In future, could validate Sansationmediate steps
    return {
        isCorrect: true,
        feedback: `Correct! ${steps.length} steps shown.`,
        score: 100
    };
};

/**
 * Get hint based on attempt count
 */
export const getHintForAttempt = (problem, attemptCount) => {
    if (!problem.hints || problem.hints.length === 0) {
        return null;
    }

    const hintIndex = Math.min(attemptCount - 1, problem.hints.length - 1);
    return problem.hints[hintIndex];
};

/**
 * Calculate score with penalties
 * - Deduct points for using hints
 * - Deduct points for multiple attempts
 */
export const calculateScore = (isCorrect, hintsUsed = 0, attempts = 1) => {
    if (!isCorrect) return 0;

    let score = 100;

    // Deduct 10 points per hint used (max 30 points)
    score -= Math.min(hintsUsed * 10, 30);

    // Deduct 5 points per extra attempt (max 20 points)
    score -= Math.min((attempts - 1) * 5, 20);

    // Minimum score of 50 for correct answer
    return Math.max(score, 50);
};

/**
 * Provide feedback based on common mistakes
 */
export const getSmartFeedback = (userAnswer, problem) => {
    const validation = validateAnswer(userAnswer, problem);

    if (validation.isCorrect) {
        return validation.feedback;
    }

    // Check for common mistakes based on problem type
    if (problem.topic === 'Linear Equations') {
        const userNum = parseFloat(userAnswer);
        const correctNum = parseFloat(problem.answer);

        if (!isNaN(userNum) && !isNaN(correctNum)) {
            if (Math.abs(userNum - correctNum) < 2) {
                return 'You\'re very close! Double-check your arithmetic.';
            }
            if (userNum === -correctNum) {
                return 'Check your signs! You may have a sign error.';
            }
        }
    }

    if (problem.topic === 'Area' || problem.topic === 'Volume') {
        const userNum = parseFloat(userAnswer);
        const correctNum = parseFloat(problem.answer);

        if (!isNaN(userNum) && !isNaN(correctNum)) {
            // Check if they forgot to square/cube
            if (userNum * userNum === correctNum) {
                return 'Tip: Did you remember to square the value?';
            }
            if (userNum / 2 === correctNum) {
                return 'Tip: For triangles, don\'t forget to divide by 2!';
            }
        }
    }

    return validation.feedback;
};

export default {
    validateAnswer,
    validateMultiStep,
    getHintForAttempt,
    calculateScore,
    getSmartFeedback,
    normalizeAnswer
};
