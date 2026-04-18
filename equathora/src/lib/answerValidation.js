// Client-side answer validation for static MVP
// This validates student answers against the problem's accepted answers

import { validateExpression } from '../utils/mathNetService';
import { evaluate, parse, simplify } from 'mathjs';

const ABS_TOLERANCE = 1e-6;
const REL_TOLERANCE = 1e-6;
const NUMERIC_TEST_ITERATIONS = 12;
const NUMERIC_MIN_VALUE = 1;
const NUMERIC_MAX_VALUE = 21;

/**
 * Normalize a LaTeX or plain-text answer into a canonical comparable string.
 *
 * Pipeline:
 *  1. Strip / convert LaTeX commands to plain algebraic notation
 *  2. Normalise Unicode symbols, whitespace and operator formatting
 *  3. Result is a lowercase, space-free string suitable for ===
 */
const normalizeAnswer = (answer) => {
    if (!answer) return '';

    let s = answer.toString().trim();

    // Repair over-escaped LaTeX command prefixes (e.g. \\sqrt, \\frac) and
    // accidental control-char command starts before parsing.
    s = s
        .replace(/\t(?=(?:imes|frac|dfrac|tfrac|sqrt|cdot|ext|pi|ightarrow)\b)/g, '\\')
        .replace(/\\\\(?=(?:frac|dfrac|tfrac|sqrt|times|cdot|pi|Rightarrow|left|right|text|pm|mapsto|therefore)\b)/g, '\\');

    // ── Step 1: LaTeX → plain algebra ──────────────────────────────
    // \frac{a}{b} → a/b  (keep as fraction string, not float)
    s = s.replace(/\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)');
    // \dfrac, \tfrac same treatment
    s = s.replace(/\\[dt]frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, '($1)/($2)');
    // \sqrt[n]{x} → nroot(x,n)  |  \sqrt{x} → sqrt(x)
    s = s.replace(/\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g, 'nroot($2,$1)');
    s = s.replace(/\\sqrt\s*\{([^{}]+)\}/g, 'sqrt($1)');
    // \cdot, \times → *
    s = s.replace(/\\cdot|\\times/g, '*');
    // \left, \right, \Big etc. → remove
    s = s.replace(/\\(left|right|Big|big|Bigg|bigg)/g, '');
    // \pi → pi, \alpha → alpha, etc.
    s = s.replace(/\\([a-zA-Z]+)/g, '$1');
    // Remove remaining curly braces (after commands have been handled)
    s = s.replace(/[{}]/g, '');

    // ── Step 2: General normalisation ──────────────────────────────
    s = s.toLowerCase();
    // Parenthesised fractions: (a)/(b) → a/b
    s = s.replace(/\(([^()]+)\)\/\(([^()]+)\)/g, '$1/$2');
    // Handle sqrt symbol
    s = s.replace(/√/g, 'sqrt');
    // Python-style exponents
    s = s.replace(/\*\*/g, '^');
    // Unicode superscripts
    s = s.replace(/²/g, '^2');
    s = s.replace(/³/g, '^3');
    // Normalise spacing around operators
    s = s.replace(/\s*\+\s*/g, '+');
    s = s.replace(/\s*-\s*/g, '-');
    s = s.replace(/\s*\*\s*/g, '*');
    s = s.replace(/\s*\/\s*/g, '/');
    s = s.replace(/\s*\^\s*/g, '^');
    // Normalise multiplication symbols
    s = s.replace(/×|·|⋅/g, '*');
    // Normalise minus/dash symbols to ASCII hyphen
    s = s.replace(/−|–|—/g, '-');
    // Remove all remaining whitespace
    s = s.replace(/\s+/g, '');
    // Remove commas, dollar signs, degree symbols
    s = s.replace(/[,$°]/g, '');
    // Remove parentheses around single terms:  (x) → x
    s = s.replace(/\(([a-z0-9]+)\)/g, '$1');
    // 2x -> 2*x, 2(x+1) -> 2*(x+1)
    s = s.replace(/(\d)([a-z(])/gi, '$1*$2');
    // x(y+1) -> x*(y+1), )x -> )*x, )( -> )*(
    s = s.replace(/([a-z)])\(/gi, '$1*(');
    s = s.replace(/\)([a-z0-9])/gi, ')*$1');
    // xy -> x*y (split adjacent letter symbols)
    s = s.replace(/([a-z])([a-z])/gi, '$1*$2');
    // x2 -> x^2
    s = s.replace(/([a-z])(\d+)\b/gi, '$1^$2');

    return s;
};

const approxEqual = (left, right) => {
    const diff = Math.abs(left - right);
    const scale = Math.max(1, Math.abs(left), Math.abs(right));
    return diff <= ABS_TOLERANCE || diff <= REL_TOLERANCE * scale;
};

const generateScopeValue = (mode) => {
    if (mode === 'integer') {
        return Math.floor(Math.random() * 12) + 1;
    }

    if (mode === 'edge') {
        const edgePool = [0.5, 1, 2, 3, 5, 10];
        return edgePool[Math.floor(Math.random() * edgePool.length)];
    }

    return Math.random() * (NUMERIC_MAX_VALUE - NUMERIC_MIN_VALUE) + NUMERIC_MIN_VALUE;
};

const extractVariables = (expression) => {
    const reserved = new Set([
        'pi',
        'e',
        'sqrt',
        'sin',
        'cos',
        'tan',
        'asin',
        'acos',
        'atan',
        'log',
        'ln',
        'abs',
        'exp',
        'nroot'
    ]);

    try {
        const root = parse(expression);
        const symbols = new Set();
        root.traverse((node) => {
            if (node?.isSymbolNode && node.name && !reserved.has(node.name)) {
                symbols.add(node.name);
            }
        });

        if (symbols.size > 0) {
            return [...symbols];
        }
    } catch {
        // Fall through to regex-based extraction
    }

    const regexMatches = expression.match(/[a-z]\w*/gi) || [];
    return [...new Set(regexMatches.map((name) => name.toLowerCase()).filter((name) => !reserved.has(name)))];
};

const symbolicEqual = (leftExpression, rightExpression) => {
    try {
        const simplifiedLeft = simplify(leftExpression).toString();
        const simplifiedRight = simplify(rightExpression).toString();
        return simplifiedLeft === simplifiedRight;
    } catch {
        return false;
    }
};

const numericEqual = (leftExpression, rightExpression) => {
    const variables = [...new Set([...extractVariables(leftExpression), ...extractVariables(rightExpression)])];
    const variableNames = variables.length > 0 ? variables : ['x', 'y', 'z'];
    const modes = ['random', 'integer', 'edge'];

    for (const mode of modes) {
        for (let i = 0; i < NUMERIC_TEST_ITERATIONS; i++) {
            const scope = {};
            for (const variableName of variableNames) {
                scope[variableName] = generateScopeValue(mode);
            }

            try {
                const leftValue = evaluate(leftExpression, scope);
                const rightValue = evaluate(rightExpression, scope);

                if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
                    return false;
                }

                if (!approxEqual(leftValue, rightValue)) {
                    return false;
                }
            } catch {
                return false;
            }
        }
    }

    return true;
};

const expressionEqual = (leftExpression, rightExpression) => {
    if (symbolicEqual(leftExpression, rightExpression)) {
        return true;
    }

    return numericEqual(leftExpression, rightExpression);
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

// Proof-type placeholder values that are never valid student answers.
// These exist in the seed data for "show that..." / "prove that..." problems
// where there is no numeric/algebraic answer to match against.
// Task 1.5 audit: 43 proof problems found in seed_110_hard_problems_hallknight.sql
// IDs: 103,104,110,112,114,116,119,121-123,125-135,145-146,148-149,153-154,
//      162-163,165,168,179-180,182-183,187,189-190,192,196-197,202,205,210
const PROOF_PLACEHOLDERS = new Set([
    'proof required',
    'proof',
    'proved',
]);

/**
 * Returns true if every accepted answer for this problem is a proof placeholder.
 * These problems cannot be auto-scored by text-matching.
 */
const isProofProblem = (problem) => {
    const answers = problem.acceptedAnswers || (problem.answer ? [problem.answer] : []);
    if (answers.length === 0) return false;
    return answers.every(
        (a) => PROOF_PLACEHOLDERS.has(a.toString().toLowerCase().trim())
    );
};

/**
 * Main validation function
 * Returns: { isCorrect: boolean, feedback: string, score: number }
 */
export const validateAnswer = async (userAnswer, problem) => {
    if (!userAnswer || !problem) {
        return {
            isCorrect: false,
            feedback: 'Please provide an answer in the last step before submitting.',
            score: 0
        };
    }

    // Proof problems cannot be auto-scored — reject with an informative message
    if (isProofProblem(problem)) {
        return {
            isCorrect: false,
            feedback:
                'This is a proof problem. Automatic scoring is not supported — ' +
                'work through the proof on paper and check the solution when ready.',
            score: 0,
            isProofProblem: true,
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
                feedback: getCorrectFeedback(problem),
                score: 1
            };
        }
    }

    // Check robust algebraic / numeric equivalence (symbolic + numeric modes)
    for (const accepted of acceptedAnswers) {
        const normalizedAccepted = normalizeAnswer(accepted);

        if (expressionEqual(normalizedUserAnswer, normalizedAccepted)) {
            return {
                isCorrect: true,
                feedback: getCorrectFeedback(problem),
                score: 1
            };
        }
    }

    // Lightweight numeric fallback for plain number answers
    for (const accepted of acceptedAnswers) {
        if (isNumericallyEqual(normalizedUserAnswer, normalizeAnswer(accepted), ABS_TOLERANCE)) {
            return {
                isCorrect: true,
                feedback: getCorrectFeedback(problem),
                score: 1
            };
        }
    }

    // Try Math.NET backend validation as a last resort
    try {
        const mathNetValidation = await validateExpression(userAnswer, problem);
        if (mathNetValidation.isCorrect) {
            return {
                isCorrect: true,
                feedback: getCorrectFeedback(problem),
                score: mathNetValidation.score || 1
            };
        }
    } catch {
        // Backend unavailable — fall through to incorrect
    }

    return {
        isCorrect: false,
        feedback: getIncorrectFeedback(userAnswer, problem),
        score: 0
    };
};

/**
 * Generate smart correct-answer feedback
 */
const getCorrectFeedback = (problem) => {
    const topic = problem.topic || '';
    const difficulty = (problem.difficulty || '').toLowerCase();

    const topicInsights = {
        'Linear Equations': 'You demonstrated strong algebraic reasoning — isolating variables is a fundamental skill.',
        'Quadratic Equations': 'Solid work with quadratics. Recognizing the structure of the equation is the key insight here.',
        'Polynomials': 'Nice polynomial manipulation. Identifying terms and combining like terms shows real fluency.',
        'Trigonometry': 'Great trigonometric thinking. Understanding angle relationships is essential for advanced math.',
        'Calculus': 'Excellent calculus work. You applied differentiation/integration concepts correctly.',
        'Geometry': 'Strong geometric reasoning. Visualizing shapes and applying formulas accurately is a core skill.',
        'Area': 'You correctly identified the shape properties and applied the right formula.',
        'Volume': 'Great spatial reasoning — computing volume requires understanding 3D relationships.',
        'Probability': 'Good probabilistic thinking. You correctly identified the sample space and computed the outcome.',
        'Combinatorics': 'Nice combinatorial reasoning. Counting principles are fundamental to discrete math.',
        'Number Theory': 'Solid number theory work. Understanding divisibility and primes is a deep mathematical skill.',
        'Logic': 'Clean logical reasoning. Breaking down the problem step by step is exactly the right approach.',
        'Statistics': 'Great statistical analysis. You correctly interpreted and computed from the data.',
        'Series': 'Nice work with series. Recognizing the pattern is the critical step.',
        'Inequalities': 'Well done. Manipulating inequalities requires careful attention to direction — you nailed it.',
    };

    const insight = topicInsights[topic] || 'You applied the right approach and executed it accurately.';

    const difficultyBoost = {
        'easy': '',
        'medium': ' This was a medium-difficulty problem. Well done.',
        'hard': ' This was a hard problem. Impressive work.',
    };

    return insight + (difficultyBoost[difficulty] || '');
};

/**
 * Generate smart incorrect-answer feedback with hints toward the right thinking
 */
const getIncorrectFeedback = (userAnswer, problem) => {
    const topic = problem.topic || '';
    const correctAnswer = problem.answer || problem.acceptedAnswers?.[0] || '';
    const userNum = parseFloat(userAnswer);
    const correctNum = parseFloat(correctAnswer);

    // Check for near-miss (close numerically)
    if (!isNaN(userNum) && !isNaN(correctNum)) {
        const diff = Math.abs(userNum - correctNum);
        if (diff > 0 && diff < 2) {
            return 'Very close! Your approach seems right — double-check your arithmetic in the final step.';
        }
        if (userNum === -correctNum) {
            return 'Almost there — check your signs. A sign error flipped your answer.';
        }
        if (correctNum !== 0 && Math.abs(userNum / correctNum - 2) < 0.01) {
            return 'Your answer is exactly double the expected result. Did you forget to divide somewhere?';
        }
        if (correctNum !== 0 && Math.abs(userNum / correctNum - 0.5) < 0.01) {
            return 'Your answer is half the expected result. Check if you missed a multiplication step.';
        }
    }

    // Topic-specific guidance
    const topicHints = {
        'Linear Equations': 'Review your steps for isolating the variable. Check each operation applied to both sides.',
        'Quadratic Equations': 'Try re-examining the factoring or formula application. Common pitfalls: sign errors in the discriminant.',
        'Trigonometry': 'Verify your angle units (degrees vs radians) and trig identity usage.',
        'Geometry': 'Double-check which formula applies to this shape and that all measurements are correct.',
        'Area': 'Make sure you selected the correct area formula and applied all dimensions properly.',
        'Volume': 'Verify the 3D formula — common mistake is using area instead of volume formulas.',
        'Calculus': 'Review the differentiation/integration rules you applied, especially chain rule or substitution.',
        'Probability': 'Check your sample space and whether events are independent or dependent.',
        'Combinatorics': 'Verify whether order matters (permutation vs combination) in this problem.',
        'Number Theory': 'Re-examine divisibility rules or prime factorization steps.',
        'Logic': 'Trace through the logical steps again — check for any assumption gaps.',
        'Inequalities': 'Remember: multiplying or dividing by a negative flips the inequality direction.',
    };

    const topicHint = topicHints[topic];
    if (topicHint) {
        return 'Not quite right. ' + topicHint;
    }

    return 'Not quite right. Review your approach and try again. Focus on the key step where you set up the equation.';
};

/**
 * Validate multi-step solution
 * For problems that require showing work
 */
export const validateMultiStep = async (steps, problem) => {
    if (!steps || steps.length === 0) {
        return {
            isCorrect: false,
            feedback: 'Please show your work step by step',
            score: 0
        };
    }

    // Check final answer
    const finalStep = steps[steps.length - 1];
    const finalValidation = await validateAnswer(finalStep, problem);

    if (!finalValidation.isCorrect) {
        return finalValidation;
    }

    // Award full points for correct final answer
    // In future, could validate Intermediate steps
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
export const getSmartFeedback = async (userAnswer, problem) => {
    const validation = await validateAnswer(userAnswer, problem);
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
