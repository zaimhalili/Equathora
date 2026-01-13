import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAllProblems } from './problemService';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Gets the daily problem ID that rotates through all problems before repeating
 * Uses localStorage to track which problems have been shown
 * @returns {Promise<number>} Problem ID
 */
export async function getDailyProblemId() {
    const STORAGE_KEY = 'equathora_daily_problems';

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === dateString) {
            return data.problemId;
        }
    }

    const allProblems = await getAllProblems();
    const TOTAL_PROBLEMS = allProblems.length;

    if (TOTAL_PROBLEMS === 0) return 1;

    const shownProblems = stored ? JSON.parse(stored).shownProblems || [] : [];

    let availableProblems = [];
    if (shownProblems.length >= TOTAL_PROBLEMS) {
        availableProblems = allProblems.map(p => p.id);
    } else {
        availableProblems = allProblems.map(p => p.id).filter(id => !shownProblems.includes(id));
    }

    // Use date as seed for deterministic selection
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };

    const seed = hashCode(dateString);
    const selectedProblemId = availableProblems[seed % availableProblems.length];

    // Update localStorage with today's problem and add to shown list
    const newShownProblems = shownProblems.length >= TOTAL_PROBLEMS
        ? [selectedProblemId]
        : [...shownProblems, selectedProblemId];

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: dateString,
        problemId: selectedProblemId,
        shownProblems: newShownProblems
    }));

    return selectedProblemId;
}

/**
 * Maps problem IDs to their corresponding group IDs
 * @param {number} problemId - The problem ID
 * @returns {Promise<number>} The group ID
 */
export async function getGroupIdForProblem(problemId) {
    const allProblems = await getAllProblems();
    const problem = allProblems.find(p => p.id === problemId);
    // Handle both Supabase (group_id) and local (groupId) field naming
    return problem ? (problem.group_id ?? problem.groupId ?? 1) : 1;
}
