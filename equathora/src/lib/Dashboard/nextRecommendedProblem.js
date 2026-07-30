// src/lib/nextRecommendedProblem.js
import {
    getCompletedProblems,
    getUserSubmissions,
    getStudentProfile,
    getStudentTopics
} from '../databaseService';
import { getProblemsAll } from '../problemService';
import { annotateProblemStates } from '../problemProgress';
import { generateProblemSlug } from '../slugify';

const DIFFICULTY_ORDER = {
    Beginner: 0,
    Easy: 1,
    Standard: 2,
    Intermediate: 3,
    Medium: 4,
    Challenging: 5,
    Hard: 6,
    Advanced: 7
};

const LEVEL_TO_DIFFICULTIES = {
    beginner: ["Beginner", "Easy", "Standard"],
    intermediate: ["Easy", "Standard", "Intermediate", "Medium"],
    advanced: ["Intermediate", "Medium", "Challenging", "Hard"],
    competitive: ["Medium", "Challenging", "Hard", "Advanced"]
};

function getSelectedSubjects(studentTopics) {
    const selectedSubjects = new Set(["Applied Mathematics"]);

    (studentTopics || []).forEach(({ topic }) => {
        switch (topic) {
            case "algebra":
                selectedSubjects.add("Algebra");
                break;
            case "geometry":
                selectedSubjects.add("Geometry");
                break;
            case "calculus":
                selectedSubjects.add("Functions");
                break;
            case "number_theory":
            case "combinatorics":
                selectedSubjects.add("Probability & Combinatorics");
                break;
            default:
                break;
        }
    });

    return selectedSubjects;
}

/**
 * Returns the same "next up" problem the Journey page's Daily Mission
 * would recommend right now (same subjects, level, and challenge
 * preference logic as Journey.jsx / DailyTrack.jsx), or null if there
 * isn't a safe recommendation yet (no profile, no problems loaded, or
 * everything eligible is already completed).
 *
 * IMPORTANT: callers must treat null as "not ready" and must NOT build
 * a /problems/:slug link from it — fall back to /journey instead, so
 * nobody ever lands on a dead or not-found problem page.
 */
export async function getNextRecommendedProblem() {
    try {
        const [problems, completedProblems, submissions, profile, topics] = await Promise.all([
            getProblemsAll(),
            getCompletedProblems(),
            getUserSubmissions(),
            getStudentProfile(),
            getStudentTopics()
        ]);

        if (!profile || !problems || problems.length === 0) return null;

        const completedSet = new Set((completedProblems || []).map(id => String(id)));
        const attemptedSet = new Set((submissions || []).map(sub => String(sub.problem_id)));

        const selectedSubjects = getSelectedSubjects(topics);
        const allowedDifficulties = LEVEL_TO_DIFFICULTIES[(profile.level ?? "").toLowerCase()] ?? [];

        let candidates = problems.filter(p => selectedSubjects.has(p.subject));

        if (allowedDifficulties.length) {
            candidates = candidates.filter(p => allowedDifficulties.includes(p.difficulty));
        }

        const annotated = annotateProblemStates(candidates, completedSet, attemptedSet);
        const uncompleted = annotated.filter(p => p.state === "current" || p.state === "unlocked");

        switch (profile.preferred_challenge) {
            case "easy":
                uncompleted.sort(
                    (a, b) => (DIFFICULTY_ORDER[a.difficulty] ?? 999) - (DIFFICULTY_ORDER[b.difficulty] ?? 999)
                );
                break;
            case "challenging":
            case "extreme":
                uncompleted.sort(
                    (a, b) => (DIFFICULTY_ORDER[b.difficulty] ?? 999) - (DIFFICULTY_ORDER[a.difficulty] ?? 999)
                );
                break;
            default:
                break;
        }

        const next = uncompleted[0];
        if (!next) return null;

        const slug = next.slug || generateProblemSlug(next.title, next.id);
        if (!slug) return null;

        return { ...next, slug };
    } catch (err) {
        console.error("[nextRecommendedProblem] getNextRecommendedProblem failed:", err);
        return null;
    }
}