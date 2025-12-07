import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Gets the daily problem ID that rotates through all problems before repeating
 * Uses localStorage to track which problems have been shown
 * @returns {number} Problem ID (1-indexed)
 */
export function getDailyProblemId() {
    const TOTAL_PROBLEMS = 5; // Update this as you add more problems
    const STORAGE_KEY = 'equathora_daily_problems';

    // Get today's date string
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if we already selected today's problem
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        if (data.date === dateString) {
            return data.problemId;
        }
    }

    // Get the list of already shown problems
    const shownProblems = stored ? JSON.parse(stored).shownProblems || [] : [];

    // If all problems have been shown, reset the list
    let availableProblems = [];
    if (shownProblems.length >= TOTAL_PROBLEMS) {
        // All problems shown, start fresh
        availableProblems = Array.from({ length: TOTAL_PROBLEMS }, (_, i) => i + 1);
    } else {
        // Get problems that haven't been shown yet
        availableProblems = Array.from({ length: TOTAL_PROBLEMS }, (_, i) => i + 1)
            .filter(id => !shownProblems.includes(id));
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
