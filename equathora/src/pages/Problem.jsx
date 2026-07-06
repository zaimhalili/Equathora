import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../components/MathLiveExample.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MathLiveExample from '../components/MathLiveExample';
import MathJaxRenderer from '../components/MathJaxRenderer';
import SolutionStepsDisplay from '../components/SolutionStepsDisplay';
import Timer from '../components/Timer.jsx';
import ProblemMobileMenu from '../components/ProblemMobileMenu.jsx';
import StreakPopup from '../components/StreakPopup.jsx';
import AchievementPopup from '../components/AchievementPopup.jsx';
import InsightPanel from '../components/InsightPanel.jsx';
import MentorChat from '../components/ProblemModals/MentorChat.jsx';
import ChatPanel from '@/components/ChatAI/ChatPanel';
import PremiumButton from '@/components/Premium/PremiumButton';
import {
    ReportModal,
    HelpModal,
    ViewSolutionModal,
    SubmissionDetailModal
} from '../components/ProblemModals';
import {
    FaLink, FaCalculator, FaChevronUp, FaFlag, FaQuestionCircle, FaRegStar, FaPencilAlt, FaList, FaClock, FaCheckCircle, FaTimesCircle, FaTimes, FaStar, FaChevronDown, FaChevronRight, FaChevronLeft, FaLightbulb, FaFileAlt, FaArrowLeft, FaGraduationCap, FaCrown, FaCode
} from 'react-icons/fa';
import { getProblemBySlug, getAllProblems } from '../lib/problemService';
import { generateProblemSlug, extractIdFromSlug } from '../lib/slugify';
import { formatTopicLabel } from '../lib/utils';
import {
    getCompletedProblems as getCompletedProblemsDb,
    toggleFavorite as toggleFavoriteDb,
    getFavorites as getFavoritesDb,
    markProblemComplete as markProblemCompleteDb,
    hasViewedSolutionDb,
    markSolutionViewedDb,
    markProblemInProgressDb,
    removeProblemFromInProgressDb,
    saveSubmission,
    getUserSubmissions,
    updateStreakForCorrectSolve,
    recordProblemStats,
    getUserStats,
} from '../lib/databaseService';
import { validateAnswer } from '../lib/answerValidation';
import { trackActivityEvent } from '../lib/activityTrackingService';
import { buildAchievements } from '../data/achievements';
import {
    checkNewAchievements,
    getSeenAchievements,
    markAchievementSeen,
    notifyAchievementUnlocked,
    notifyStreakMilestone,
} from '../lib/notificationService';
import { useUserProfile } from '@/hooks/useUserProfile';
import OverflowChecker from './OverflowChecker.jsx';

const formatDurationLabel = (seconds = 0) => {
    const safeSeconds = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    if (minutes <= 0) {
        return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
};

const sanitizeLatexAnswer = (latex = '') => latex
    // Handle fractions: \frac{a}{b} -> (a)/(b)
    .replace(/\\frac\s*\{([^}]*)\}\s*\{([^}]*)\}/g, '($1)/($2)')
    // Handle square roots: \sqrt{x} -> sqrt(x)
    .replace(/\\sqrt\s*\{([^}]*)\}/g, 'sqrt($1)')
    // Handle exponents: ^{2} -> ^2
    .replace(/\^\s*\{([^}]*)\}/g, '^$1')
    // Handle subscripts: _{n} -> _n
    .replace(/_\s*\{([^}]*)\}/g, '_$1')
    // Handle \cdot multiplication -> *
    .replace(/\\cdot/g, '*')
    // Handle \times multiplication -> *
    .replace(/\\times/g, '*')
    // Handle text commands: \text{abc} -> abc
    .replace(/\\text\s*\{([^}]*)\}/g, '$1')
    // Handle \left and \right sizing commands
    .replace(/\\left|\\right/g, '')
    // Handle \therefore
    .replace(/\\therefore/g, '')
    // Remove remaining backslashes (e.g., \, spacing)
    .replace(/\\/g, '')
    // Remove curly braces
    .replace(/[{}]/g, '')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();

const hydrateStoredSubmissions = (records = []) => {
    const chronological = [...records].sort((a, b) => {
        const aTime = new Date(a.timestamp || 0).getTime();
        const bTime = new Date(b.timestamp || 0).getTime();
        return aTime - bTime;
    });

    const hydrated = chronological.map((record, index) => {
        const rawSeconds = record.metadata?.timeSpent || record.timeSpent || 0;
        return {
            ...record,
            id: record.id || `${record.problemId || 'problem'}-${record.timestamp || index}`,
            steps: record.steps || [],
            status: record.status || (record.isCorrect ? 'accepted' : 'wrong'),
            timestamp: record.timestamp || new Date().toISOString(),
            metadata: {
                attempts: record.metadata?.attempts || index + 1,
                hintsUsed: record.metadata?.hintsUsed || 0,
                timeSpent: rawSeconds,
                timeSpentLabel: record.metadata?.timeSpentLabel || formatDurationLabel(rawSeconds)
            }
        };
    });

    return hydrated.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const Problem = ({ premium = true }) => {
    const chatPanelRef = useRef(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useUserProfile();

    // Extract problem ID from slug for backwards compatibility
    const numericProblemId = extractIdFromSlug(slug);

    // State for problem data from database
    const [problem, setProblem] = useState(null);
    const [allProblems, setAllProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load problem and all problems from database
    useEffect(() => {
        const loadProblems = async () => {
            setLoading(true);
            try {
                const [problemData, problemsList] = await Promise.all([
                    getProblemBySlug(slug),
                    getAllProblems()
                ]);
                setProblem(problemData);
                setAllProblems(problemsList);

                // Mark problem as in-progress when viewing
                if (problemData) {
                    markProblemInProgressDb(problemData.id);
                }
            } catch (error) {
                console.error('Failed to load problem:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProblems();
    }, [slug]);

    useEffect(() => {
        if (!problem) return;
        getUserSubmissions(problem.id).then(data => {
            const mapped = data.map((s, index) => ({
                id: s.id,
                problemId: s.problem_id,
                steps: s.steps ?? [],
                status: s.is_correct ? 'accepted' : 'wrong',
                timestamp: s.submitted_at,
                metadata: {
                    attempts: data.length - index,
                    hintsUsed: 0,
                    timeSpent: s.time_spent_seconds,
                    timeSpentLabel: formatDurationLabel(s.time_spent_seconds)
                }
            }));
            setSubmissions(hydrateStoredSubmissions(mapped));
        });
    }, [problem]);

    // Sort all problems by group_id first, then by id for consistent navigation across all groups
    const sortedProblems = [...allProblems].sort((a, b) => {
        const aGroup = a.group_id ?? a.groupId ?? 0;
        const bGroup = b.group_id ?? b.groupId ?? 0;
        if (aGroup !== bGroup) return aGroup - bGroup;
        return a.id - b.id;
    });

    // Find current problem index in the sorted list for cross-group navigation
    const currentIndex = sortedProblems.findIndex(p => p.id === problem?.id);
    const hasProblems = sortedProblems.length > 0 && currentIndex !== -1;
    const prevProblem = hasProblems
        ? sortedProblems[(currentIndex - 1 + sortedProblems.length) % sortedProblems.length]
        : null;
    const nextProblem = hasProblems
        ? sortedProblems[(currentIndex + 1) % sortedProblems.length]
        : null;

    // Generate slug paths for navigation
    const prevProblemSlug = prevProblem ? (prevProblem.slug || generateProblemSlug(prevProblem.title, prevProblem.id)) : null;
    const nextProblemSlug = nextProblem ? (nextProblem.slug || generateProblemSlug(nextProblem.title, nextProblem.id)) : null;

    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [openHints, setOpenHints] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDescription, setShowDescription] = useState(true);
    const [showSolutionPopup, setShowSolutionPopup] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [descriptionCollapsed, setDescriptionCollapsed] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [showMentorChat, setShowMentorChat] = useState(false);
    const [chatPanel, setChatPanel] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
    const [hintsOpened, setHintsOpened] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [solutionViewed, setSolutionViewed] = useState(false);
    const [submissionFeedback, setSubmissionFeedback] = useState(null);
    const [showDrawingPad, setShowDrawingPad] = useState(false);
    const [drawingColor, setDrawingColor] = useState('var(--secondary-color)');
    const [strokes, setStrokes] = useState([]);
    const [timerResetSeq, setTimerResetSeq] = useState(0);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showStreakPopup, setShowStreakPopup] = useState(false);
    const [currentStreakValue, setCurrentStreakValue] = useState(0);
    const [showAchievementPopup, setShowAchievementPopup] = useState(false);
    const [newAchievements, setNewAchievements] = useState([]);
    const [showInsightPanel, setShowInsightPanel] = useState(false);
    const [fields, setFields] = useState([]);
    const [latexOpen, setLatexOpen] = useState(false);
    const [chatSeed, setChatSeed] = useState(null);
    const [pendingSigmaPrompt, setPendingSigmaPrompt] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);


    // Track theme dynamically from data-theme attribute
    const [currentTheme, setCurrentTheme] = useState(() =>
        typeof document !== 'undefined' ? document.documentElement.dataset.theme || 'light' : 'light'
    );

    const prevProblemIdRef = useRef(problem?.id);
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const currentStrokeRef = useRef([]);
    const sessionStartRef = useRef(Date.now());
    const strokesCacheRef = useRef({});

    const handleFieldsChange = useCallback((f) => {
        setTimeout(() => setFields(f), 0);
    }, []);

    const userStorageScope = user?.id || user?.email || 'anonymous';
    const problemStorageScope = problem?.id ? `${problem.id}:${userStorageScope}` : '';
    const mathDraftStorageKey = problemStorageScope ? `equathora:math-draft:${problemStorageScope}` : '';
    const sigmaChatStorageKey = problemStorageScope ? `equathora:sigma-chat:${problemStorageScope}` : '';

    const openSigmaChat = useCallback((message) => {
        if (!message) return;
        setShowDescription(false);
        setShowSolution(false);
        setShowSubmissions(false);
        setShowTop(false);
        setShowMentorChat(false);
        setChatPanel(true);
        setPendingSigmaPrompt(message);
        if (descriptionCollapsed) setDescriptionCollapsed(false);
    }, [descriptionCollapsed]);

    useEffect(() => {
        if (!chatPanel || !pendingSigmaPrompt) return;

        const timer = window.setTimeout(() => {
            chatPanelRef.current?.sendMessage(pendingSigmaPrompt);
            setPendingSigmaPrompt('');
        }, 0);

        return () => window.clearTimeout(timer);
    }, [chatPanel, pendingSigmaPrompt]);

    const resolveColor = useCallback((color) => {
        if (typeof color === 'string' && color.startsWith('var(')) {
            const varName = color.slice(4, -1).trim();
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || 'black';
        }
        if (color === 'var(--secondary-color)' || color === 'black') {
            return document.documentElement.dataset.theme === 'dark' ? '#ffffff' : '#000000';
        }
        return color;
    }, []);

    const redrawCanvas = useCallback((paths) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const allStrokes = paths || strokes;
        allStrokes.forEach((stroke) => {
            if (!stroke?.points?.length) return;
            ctx.strokeStyle = resolveColor(stroke.color) || 'black';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            stroke.points.slice(1).forEach((point) => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        });

        // Also draw current stroke if actively drawing
        if (isDrawingRef.current && currentStrokeRef.current.length > 0) {
            ctx.strokeStyle = resolveColor(drawingColor) || 'black';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(currentStrokeRef.current[0].x, currentStrokeRef.current[0].y);
            currentStrokeRef.current.slice(1).forEach((point) => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        }
    }, [strokes, drawingColor, resolveColor]);

    const getCanvasPoint = useCallback((event) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX ?? event.touches?.[0]?.clientX;
        const clientY = event.clientY ?? event.touches?.[0]?.clientY;
        if (clientX == null || clientY == null) return null;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }, []);

    const startDrawing = useCallback((event) => {
        const point = getCanvasPoint(event);
        if (!point) return;

        isDrawingRef.current = true;
        currentStrokeRef.current = [point];
    }, [getCanvasPoint]);

    const drawStroke = useCallback((event) => {
        if (!isDrawingRef.current) return;

        const point = getCanvasPoint(event);
        if (!point) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const lastPoint = currentStrokeRef.current[currentStrokeRef.current.length - 1];

        ctx.strokeStyle = resolveColor(drawingColor) || 'black';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();

        currentStrokeRef.current.push(point);
    }, [drawingColor, getCanvasPoint, resolveColor]);

    const endDrawing = useCallback(() => {
        if (!isDrawingRef.current) return;

        isDrawingRef.current = false;
        // Always save strokes, even single points (for quick clicks/taps)
        if (currentStrokeRef.current.length >= 1) {
            const strokeToSave = { color: drawingColor, points: [...currentStrokeRef.current] };
            setStrokes((prev) => [...prev, strokeToSave]);
        }
        currentStrokeRef.current = [];
    }, [drawingColor]);

    const clearCanvas = useCallback(() => {
        setStrokes([]);
        redrawCanvas([]);
    }, [redrawCanvas]);

    const undoStroke = useCallback(() => {
        setStrokes((prev) => prev.slice(0, -1));
    }, []);


    useEffect(() => {
        if (!problem) return;
        getCompletedProblemsDb().then(ids => {
            setIsCompleted(ids.includes(String(problem.id)));
        });
    }, [problem]);
    const [timerRunning, setTimerRunning] = useState(!isCompleted);

    useEffect(() => {
        setTimerRunning(!isCompleted);
    }, [slug, isCompleted]);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    setCurrentTheme(document.documentElement.dataset.theme || 'light');
                    // Also trigger a redraw of the canvas to update stroke colors dynamically
                    setTimerResetSeq(prev => prev + 1); // just to force an update check though redrawCanvas called below
                    const canvas = canvasRef.current;
                    if (canvas && strokesCacheRef.current[problem?.id]) {
                        // we'll rely on the existing effect for ShowDrawingPad to redraw, but let's call it softly 
                    }
                }
            }
        });
        if (typeof document !== 'undefined') {
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        }
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        sessionStartRef.current = Date.now();
        setSubmissionFeedback(null);

        // Load cached strokes for this problem if they exist
        const problemId = problem?.id;
        if (problemId && strokesCacheRef.current[problemId]) {
            setStrokes(strokesCacheRef.current[problemId]);
        } else {
            setStrokes([]);
        }

        // Only reset timer when navigating to a DIFFERENT problem
        // Don't reset on initial load (prevId is undefined) or when prevId equals current problemId
        const prevId = prevProblemIdRef.current;
        if (typeof window !== 'undefined' && problem && prevId !== undefined && prevId !== problemId) {
            const storageKey = `eq:problemTime:${problem.id}`;
            window.localStorage.setItem(storageKey, '0');
            setTimerResetSeq(prev => prev + 1);
        }
        prevProblemIdRef.current = problemId;
    }, [slug, problem]);

    // Reset transient UI state when navigating between problems
    useEffect(() => {
        setShowSolution(false);
        setShowSolutionPopup(false);
        setShowDescription(true);
        setShowSubmissions(false);
        setShowMentorChat(false);
        setChatPanel(false);
        setShowTop(false);
        setDescriptionCollapsed(false);
        setOpenHints({});
        setHintsOpened([]);
        setSelectedSubmission(null);
        setShowSubmissionDetail(false);
        setReportReason('');
        setReportDetails('');
        setShowReportModal(false);
        setShowHelpModal(false);
        setShowDrawingPad(false);
        setDrawingColor('var(--secondary-color)');
        setShowMobileMenu(false);
        setPendingSigmaPrompt('');
    }, [problem, slug]);

    useEffect(() => {
        if (problem) {
            hasViewedSolutionDb(problem.id).then(setSolutionViewed);
            getFavoritesDb().then(favs => setIsFavorite(favs.includes(String(problem.id))));
        } else {
            setSolutionViewed(false);
            setIsFavorite(false);
        }
    }, [problem]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (!showMobileMenu) return;

        const handleClickOutside = (e) => {
            if (!e.target.closest('.mobile-menu-container')) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showMobileMenu]);

    useEffect(() => {
        if (!showDrawingPad) return;

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const width = canvas.offsetWidth || 0;
            canvas.width = width;
            canvas.height = 220;
            redrawCanvas();
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [showDrawingPad, redrawCanvas]);

    useEffect(() => {
        if (showDrawingPad) {
            redrawCanvas();
        }
        // Cache strokes for this problem
        if (strokes.length > 0 && problem?.id) {
            strokesCacheRef.current[problem.id] = strokes;
        }
    }, [strokes, showDrawingPad, redrawCanvas, problem?.id, currentTheme]);

    // Warn user before refresh/close if drawings exist
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            const hasDrawings = Object.keys(strokesCacheRef.current).some(
                key => strokesCacheRef.current[key]?.length > 0
            );

            if (hasDrawings) {
                e.preventDefault();
                e.returnValue = 'You have unsaved sketches. Are you sure you want to leave? Your drawings will be lost.';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const toggleHint = (index) => {
        setOpenHints(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
        // Track hint usage
        if (!openHints[index] && !hintsOpened.includes(index)) {
            setHintsOpened(prev => [...prev, index]);
        }
    };

    const handleNewSubmission = async (steps) => {
        if (!problem) {
            return { success: false, message: 'Problem not found.' };
        }

        // Determine if this problem was already solved BEFORE this submission.
        // This is the single source of truth for "practice mode" vs "first solve".
        const alreadySolvedBefore = isCompleted;

        const safeSteps = steps || [];
        const lastStep = safeSteps[safeSteps.length - 1];
        const preparedAnswer = sanitizeLatexAnswer(lastStep?.latex || '');
        const finalAnswer = preparedAnswer || (lastStep?.latex || '');

        if (!finalAnswer.trim()) {
            const feedback = 'Please enter your final answer in the last step before submitting.';
            setSubmissionFeedback({ message: feedback, isCorrect: false });
            return { success: false, message: feedback };
        }

        // Always validate the answer — even in practice mode
        const validation = await validateAnswer(finalAnswer, problem);

        // Get actual time from localStorage (what the Timer component tracks)
        const storageKey = `eq:problemTime:${problem.id}`;
        const storedTime = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
        const timeSpentSeconds = storedTime ? Math.max(1, parseInt(storedTime, 10)) : Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 1000));
        const attemptNumber = submissions.length + 1;

        void trackActivityEvent(
            validation.isCorrect ? 'problem_solved' : 'problem_attempt',
            new Date(),
            {
                problem_id: problem.id,
                problem_topic: problem.topic || 'Unknown',
                problem_difficulty: problem.difficulty || 'Unknown',
                time_spent_seconds: timeSpentSeconds,
                attempt_number: attemptNumber,
                is_correct: validation.isCorrect
            }
        );

        // ================================================================
        // PRACTICE MODE PATH — problem was already solved before
        // Show feedback only, never touch progression/stats/achievements.
        // ================================================================
        if (alreadySolvedBefore) {
            setSubmissionFeedback({
                message: validation.isCorrect
                    ? 'Correct! (Practice mode — no additional points awarded)'
                    : validation.feedback,
                isCorrect: validation.isCorrect,
                attemptNumber,
                timeSpent: timeSpentSeconds,
                topic: problem.topic,
                difficulty: problem.difficulty,
                isPracticeMode: true
            });
            return {
                success: validation.isCorrect,
                message: validation.isCorrect
                    ? 'Correct! (Practice mode)'
                    : validation.feedback,
                isPracticeMode: true
            };
        }

        // ================================================================
        // FIRST SOLVE PATH — normal progression flow
        // This code only runs when the problem has NOT been solved before.
        // ================================================================
        await saveSubmission(problem.id, finalAnswer, validation.isCorrect, timeSpentSeconds, {
            topic: problem.topic,
            difficulty: problem.difficulty
        }, safeSteps);

        const entry = {
            id: Date.now(),
            problemId: problem.id,
            steps: safeSteps,
            status: validation.isCorrect ? 'accepted' : 'wrong',
            timestamp: new Date().toISOString(),
            metadata: {
                attempts: attemptNumber,
                hintsUsed: hintsOpened.length,
                timeSpent: timeSpentSeconds,
                timeSpentLabel: formatDurationLabel(timeSpentSeconds)
            }
        };
        setSubmissions(prev => [entry, ...prev]);


        setSubmissionFeedback({
            message: validation.feedback,
            isCorrect: validation.isCorrect,
            attemptNumber,
            timeSpent: timeSpentSeconds,
            topic: problem.topic,
            difficulty: problem.difficulty,
            isPracticeMode: false
        });

        // Submitting from the chat panel should collapse the other views 
        setChatPanel(false);
        setShowMentorChat(false);
        setShowSolution(false);
        setShowSolutionPopup(false);
        setShowInsightPanel(false);
        setShowSubmissionDetail(false);
        setSelectedSubmission(null);

        // Show the InsightPanel ribbon for correct answers
        if (validation.isCorrect) {
            setShowInsightPanel(true);
        }

        setShowSubmissions(true);
        setShowDescription(false);
        setShowTop(false);
        setShowDrawingPad(false);
        if (descriptionCollapsed) {
            setDescriptionCollapsed(false);
        }

        if (validation.isCorrect) {
            setTimerRunning(false);
            setShowSolution(true);
            setShowSolutionPopup(false);
            setSolutionViewed(true);

            await markProblemCompleteDb(problem.id, timeSpentSeconds, problem.difficulty, problem.topic || 'General');
            setIsCompleted(true);
            await removeProblemFromInProgressDb(problem.id);
        }

        // Streak should only update on a correct first-solve submission.
        let previousStreak = 0;
        let streakData = null;

        if (validation.isCorrect) {
            try {
                const streakUpdate = await updateStreakForCorrectSolve();
                previousStreak = streakUpdate.previous_streak || 0;
                streakData = {
                    current: streakUpdate.current_streak || 0,
                    longest: streakUpdate.longest_streak || 0,
                    lastDate: streakUpdate.last_activity_date || null
                };

                // Show popup if streak was incremented (first solve of the day)
                if (streakUpdate.incremented && streakData.current > previousStreak) {
                    setCurrentStreakValue(streakData.current);
                    setShowStreakPopup(true);
                }

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('equathora:streak-updated', {
                        detail: {
                            currentStreak: streakData.current,
                            longestStreak: streakData.longest
                        }
                    }));
                }
            } catch {
                // ignore background failure
            }
        }

        await recordProblemStats(problem, {
            isCorrect: validation.isCorrect,
            timeSpentSeconds,
            timestamp: entry.timestamp,
            attemptNumber,
            streakData: validation.isCorrect ? streakData : null,
            hintsUsed: hintsOpened.length,
            solutionViewed
        });

        // Check for newly unlocked achievements after stats update
        if (validation.isCorrect) {
            try {
                const seenIds = getSeenAchievements();
                const updatedStats = await getUserStats();
                const currentAchievements = buildAchievements(updatedStats);
                const freshlyUnlocked = checkNewAchievements(seenIds, currentAchievements);

                if (freshlyUnlocked.length > 0) {
                    setNewAchievements(freshlyUnlocked);
                    setShowAchievementPopup(true);

                    // Fire background notifications for each new achievement
                    freshlyUnlocked.forEach(a => {
                        void notifyAchievementUnlocked(a.title, a.description).catch(() => { });
                    });
                }

                // Also fire streak milestone notification
                if (streakData?.current > previousStreak && [7, 14, 30, 60, 90, 180, 365].includes(streakData.current)) {
                    void notifyStreakMilestone(streakData.current).catch(() => { });
                }
            } catch {
                // achievement check is non-blocking
            }
        }

        return {
            success: validation.isCorrect,
            message: validation.feedback,
            isPracticeMode: false
        };
    };

    // Handle loading state
    if (loading) {
        return <LoadingSpinner message="Loading problem..." />;
    }

    // Handle problem not found
    if (!problem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold pb-4">Problem Not Found</h2>
                    <Link to="/learn" className="text-[var(--accent-color)] hover:underline">
                        Return to Learn Page
                    </Link>
                </div>
            </div>
        );
    }

    // Get the current problem's group ID (handle both naming conventions)
    const currentGroupId = problem.group_id ?? problem.groupId;

    // Generate similar questions from the same group
    const similarQuestions = allProblems
        .filter(p => (p.group_id ?? p.groupId) === currentGroupId && p.id !== problem.id)
        .slice(0, 3)
        .map(p => ({
            id: p.id,
            groupId: p.group_id ?? p.groupId,
            title: p.title,
            difficulty: p.difficulty
        }));

    // Get hints and accepted answers from database format
    const hints = problem.hints || [];
    const acceptedAnswers = problem.accepted_answers || problem.acceptedAnswers || [problem.answer];

    const examples = Array.isArray(problem.examples) ? problem.examples : [];

    const handleFavoriteToggle = async () => {
        const newState = await toggleFavoriteDb(problem.id);
        setIsFavorite(newState);
    };

    return (
        <>
            <main className="flex flex-col text-[var(--secondary-color)] bg-[var(--mid-main-secondary)] ">
                {/* Navigation Header */}
                <header className="flex items-center justify-between gap-2 md:gap-3 font-[Sansation,sans-serif] bg-[var(--main-color)] w-full px-3 md:px-6 py-3 md:py-4 flex-shrink-0">
                    {/* Left side - Back button and Navigation */}
                    <div className="flex items-center gap-2">
                        <Link to="/learn" className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--secondary-color)] font-semibold no-underline transition-all duration-200 px-3 md:px-4 py-2 md:py-2.5 rounded-md hover:bg-[var(--french-gray)] hover:text-[var(--main-color)] h-9 md:h-10">
                            <FaArrowLeft />
                            <span className="hidden md:inline">Back to Exercises</span>
                            <span className="md:hidden">Back</span>
                        </Link>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => prevProblemSlug && navigate(`/problems/${prevProblemSlug}`)}
                                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-md transition-all duration-200 bg-transparent border border-[var(--mid-main-secondary)] text-[var(--secondary-color)] hover:bg-[var(--french-gray)] cursor-pointer"
                                title={prevProblem ? `Previous: ${prevProblem.title}` : ''}
                            >
                                <FaChevronLeft className="text-sm" />
                            </button>
                            <button
                                onClick={() => nextProblemSlug && navigate(`/problems/${nextProblemSlug}`)}
                                className="flex items-center justify-center h-9 md:h-10 gap-2 px-3 rounded-md transition-all duration-200 bg-transparent border border-[var(--mid-main-secondary)] text-[var(--secondary-color)] hover:bg-[var(--french-gray)] cursor-pointer"
                                title={nextProblem ? `Next: ${nextProblem.title}` : ''}
                            >
                                <span className="hidden sm:inline text-xs md:text-sm font-medium">Next</span>
                                <FaChevronRight className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {/* Right side - Timer and Actions */}
                    <div className="flex items-center gap-2">
                        <PremiumButton />
                        <Timer key={`${problem?.id}-${timerResetSeq}`} problemId={problem?.id} isRunning={timerRunning} />

                        {/* Desktop buttons - hidden on mobile */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setShowDrawingPad((prev) => !prev);
                                    setShowDescription(true);
                                    setShowSolutionPopup(false);
                                    setShowSolution(false);
                                    setShowTop(false);
                                    setShowSubmissions(false);
                                    setChatPanel(false);
                                    if (descriptionCollapsed) setDescriptionCollapsed(false);
                                }}
                                className={`bg-transparent border-1 px-3 lg:px-4 rounded-md cursor-pointer text-xs md:text-sm transition-all duration-200 flex items-center gap-1.5 h-9 md:h-10 ${showDrawingPad ? 'text-[var(--accent-color)] border-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--mid-main-secondary)] border-[var(--mid-main-secondary)] hover:text-[var(--accent-color)]'}`}
                                title={showDrawingPad ? "Hide sketch pad" : "Show sketch pad"}
                            >
                                <FaPencilAlt className="text-sm md:text-base" />
                                <span className="text-xs sm:text-sm font-medium">Sketch</span>
                            </button>
                            <button
                                onClick={() => setShowHelpModal(true)}
                                className="bg-transparent border-1 border-[var(--mid-main-secondary)] px-3 md:px-4 rounded-md cursor-pointer text-xs md:text-sm transition-all duration-200 hover:text-[var(--accent-color)] text-[var(--mid-main-secondary)] flex items-center gap-1.5 h-9 md:h-10"
                                title="Help & Guide"
                            >
                                <FaQuestionCircle className="text-sm md:text-base" />
                                <span className="text-xs sm:text-sm font-medium">Help</span>
                            </button>
                            <Link
                                to="/feedback"
                                className="bg-transparent border-1 border-[var(--mid-main-secondary)] px-3 rounded-md cursor-pointer text-xs md:text-sm transition-all duration-200 hover:!text-[var(--accent-color)] !text-[var(--mid-main-secondary)] flex items-center justify-center w-9 h-9 md:w-10 md:h-10"
                                title="Report Problem"
                            >
                                <FaFlag className="text-sm md:text-base" />
                            </Link>
                            <button
                                className={`bg-transparent border-1 text-xs md:text-sm px-3 rounded-md cursor-pointer transition-all duration-200 hover:text-[var(--accent-color)] flex items-center justify-center w-9 h-9 md:w-10 md:h-10 ${isFavorite ? 'text-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--mid-main-secondary)] border-[var(--mid-main-secondary)]'}`}
                                onClick={handleFavoriteToggle}
                                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                {isFavorite ? <FaStar className="text-sm md:text-base" /> : <FaRegStar className="text-sm md:text-base" />}
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <ProblemMobileMenu
                            showMobileMenu={showMobileMenu}
                            setShowMobileMenu={setShowMobileMenu}
                            showDrawingPad={showDrawingPad}
                            setShowDrawingPad={setShowDrawingPad}
                            setShowDescription={setShowDescription}
                            setShowSolutionPopup={setShowSolutionPopup}
                            setShowSolution={setShowSolution}
                            setShowTop={setShowTop}
                            setShowSubmissions={setShowSubmissions}
                            descriptionCollapsed={descriptionCollapsed}
                            setDescriptionCollapsed={setDescriptionCollapsed}
                            setShowHelpModal={setShowHelpModal}
                            isFavorite={isFavorite}
                            handleFavoriteToggle={handleFavoriteToggle}
                        />
                    </div>
                </header>

                {/* Modals */}
                <ViewSolutionModal
                    isOpen={showSolutionPopup}
                    onClose={() => {
                        setShowSolutionPopup(false);
                        setShowDescription(true);
                        setShowMentorChat(false);
                    }}
                    onConfirm={() => {
                        setShowSolution(true);
                        setShowSolutionPopup(false);
                        if (problem?.id) {
                            markSolutionViewedDb(problem.id);
                        }
                        setSolutionViewed(true);
                        setShowMentorChat(false);
                    }}
                />

                <HelpModal
                    isOpen={showHelpModal}
                    onClose={() => setShowHelpModal(false)}
                />

                <SubmissionDetailModal
                    isOpen={showSubmissionDetail}
                    onClose={() => setShowSubmissionDetail(false)}
                    submission={selectedSubmission}
                    premium={premium}
                    problem={problem}
                    studentName={user?.user_metadata?.full_name ?? user?.email ?? 'Student'}
                />

                {showStreakPopup && (
                    <StreakPopup
                        streak={currentStreakValue}
                        onClose={() => setShowStreakPopup(false)}
                    />
                )}

                {showAchievementPopup && newAchievements.length > 0 && (
                    <AchievementPopup
                        achievements={newAchievements}
                        onClose={() => {
                            setShowAchievementPopup(false);
                            setNewAchievements([]);
                        }}
                        onDismissOne={(id) => markAchievementSeen(id)}
                    />
                )}

                {/* Insight Panel - correct answer ribbon */}
                {showInsightPanel && submissionFeedback?.isCorrect && (
                    <InsightPanel
                        insight={submissionFeedback.message}
                        topic={submissionFeedback.topic}
                        difficulty={submissionFeedback.difficulty}
                        nextProblemPath={nextProblemSlug ? `/problems/${nextProblemSlug}` : null}
                        onViewSolution={() => {
                            setShowSolution(true);
                            setShowDescription(false);
                            setShowSubmissions(false);
                            setSolutionViewed(true);
                        }}
                        onDismiss={() => setShowInsightPanel(false)}
                        autoDismissSeconds={600}
                    />
                )}

                {/* Main Content */}
                <section className="flex flex-col lg:flex-row flex-1 w-full gap-2 md:gap-3 bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed pt-3 md:py-5 px-3 md:px-6 lg:px-8 lg:max-h-[calc(100vh-7.5vh)] lg:overflow-hidden">
                    {/* Description Side Left Side */}
                    <aside className={`flex flex-col w-full rounded-md bg-[var(--main-color)] p-0 font-[Sansation,sans-serif] text-[var(--secondary-color)] overflow-hidden border border-[var(--white)] h-full transition-all duration-300 ${descriptionCollapsed ? 'lg:w-12 lg:min-w-12' : 'lg:w-1/2 md:max-h-[calc(92.5vh-20px)] '}`}>
                        <div className={`w-full py-1.5 md:py-2 flex bg-[var(--french-gray)] px-2 rounded-t-lg ${descriptionCollapsed ? 'lg:flex-col lg:h-full lg:py-4 lg:px-1' : 'justify-between'}`}>
                            <div className={`flex gap-1 ${descriptionCollapsed && 'lg:flex-col lg:gap-3 lg:flex-1 lg:justify-center lg:w-full'}`}>

                                {/* Description Button */}
                                <button type="button" onClick={() => {
                                    setShowDescription(true);
                                    setShowSolutionPopup(false);
                                    setShowSolution(false);
                                    setShowTop(false);
                                    setShowSubmissions(false);
                                    setShowMentorChat(false);
                                    setChatPanel(false);
                                    if (descriptionCollapsed) setDescriptionCollapsed(false);
                                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] flex items-center gap-1.5 font-medium transition-all duration-200 ${showDescription && !showSubmissions ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Description" : ""}>
                                    <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Description</span>
                                    {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Description</span>}
                                    <FaFileAlt className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                                </button>

                                {/* Solutions Button */}
                                <button type="button" onClick={() => {
                                    setShowDescription(false);
                                    setShowTop(false);
                                    setShowSubmissions(false);
                                    setShowMentorChat(false);
                                    setChatPanel(false);
                                    if (!solutionViewed && !isCompleted) {
                                        setShowSolutionPopup(true);
                                    } else {
                                        setShowSolution(true);
                                    }
                                    if (descriptionCollapsed) setDescriptionCollapsed(false);
                                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] flex items-center gap-1.5 font-medium transition-all duration-200 ${!showDescription && showSolution && !showSubmissions ? 'bg-[var(--main-color)]' : ''} ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`} style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Solution" : ""}>
                                    <span className={descriptionCollapsed ? 'lg:hidden' : ''}>Solution</span>
                                    {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Solution</span>}
                                    <FaCalculator className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                                </button>

                                {/* Submissions Button */}
                                <button type="button" onClick={() => {
                                    setShowDescription(false);
                                    setShowSolution(false);
                                    setShowSubmissions(true);
                                    setShowTop(false);
                                    setShowMentorChat(false);
                                    setChatPanel(false);
                                    if (descriptionCollapsed) setDescriptionCollapsed(false);
                                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] flex items-center gap-1.5 font-medium transition-all duration-200 
                                ${showSubmissions && !showDescription ? 'bg-[var(--main-color)]' : ''} 
                                ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`}
                                    style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Submissions" : ""}>
                                    <span className={descriptionCollapsed ? 'lg:hidden' : ''}>
                                        Submissions
                                    </span>
                                    {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Submissions</span>}
                                    <FaList className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                                </button>

                                {/* Need Help Button / Mentorship */}
                                {/* <button type="button" onClick={() => {
                                    setShowDescription(false);
                                    setShowSolution(false);
                                    setShowSubmissions(false);
                                    setShowTop(false);
                                    setShowMentorChat(true);
                                    setChatPanel(false);
                                    if (descriptionCollapsed) setDescriptionCollapsed(false);
                                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] flex items-center gap-1.5 font-medium transition-all duration-200 
                                ${showMentorChat && !showDescription ? 'bg-[var(--main-color)]' : ''} 
                                ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`}
                                    style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Need Help" : ""}>
                                    <span className={descriptionCollapsed ? 'lg:hidden' : ''}>
                                        Need Help
                                    </span>
                                    {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Need Help</span>}
                                    <FaGraduationCap className={`text-[10px] md:text-xs text-[var(--secondary-color)] ${descriptionCollapsed ? 'lg:hidden' : ''}`} />
                                </button> */}

                                {/* AI chat panel */}
                                <button type="button" onClick={() => {
                                    setShowDescription(false);
                                    setShowSolution(false);
                                    setShowSubmissions(false);
                                    setShowTop(false);
                                    setShowMentorChat(false);
                                    setChatPanel(true);
                                    if (descriptionCollapsed) setDescriptionCollapsed(false);
                                }} className={`cursor-pointer px-2 py-1 hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] flex items-center gap-1.5 font-medium transition-all duration-200 
                                ${chatPanel && !showDescription ? 'bg-[var(--main-color)]' : ''} 
                                ${descriptionCollapsed ? 'lg:w-full lg:py-4 lg:px-3 lg:justify-center' : ''}`}
                                    style={descriptionCollapsed ? { writingMode: 'vertical-lr', textOrientation: 'mixed' } : {}} title={descriptionCollapsed ? "Ask Sigma" : ""}>
                                    <span className={descriptionCollapsed ? 'lg:hidden' : ''}>
                                        Ask Sigma
                                    </span>
                                    {descriptionCollapsed && <span className="hidden lg:inline text-xs font-semibold tracking-wider">Ask Sigma</span>}
                                    <FaCrown
                                        className={`h-3 w-3 md:h-4 md:w-4 ${descriptionCollapsed ? "lg:hidden" : ""
                                            }`}
                                        style={{
                                            fill: "url(#crownGradient)"
                                        }}
                                    />

                                    <svg width="0" height="0">
                                        <defs>
                                            <linearGradient id="crownGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#fbbf24" />
                                                <stop offset="100%" stopColor="#d97706" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </button>
                            </div>

                            {/* Mobile Only - Toggle Collapse/Expand */}
                            <button type="button" onClick={() => {
                                setShowTop(!showTop);
                            }} className={`lg:hidden cursor-pointer px-3 py-1.5 hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] flex items-center gap-2 font-medium transition-colors duration-200`}>
                                {showTop ? <FaChevronDown className="text-sm" /> : <FaChevronUp className="text-sm" />}
                            </button>

                            {/* Desktop Only - Horizontal Collapse Toggle */}
                            <button type="button" onClick={() => {
                                setDescriptionCollapsed(!descriptionCollapsed);
                            }} className={`hidden lg:flex cursor-pointer hover:bg-[var(--main-color)] rounded-md text-xs md:text-sm font-[Sansation] items-center justify-center font-medium transition-all duration-200 ${descriptionCollapsed ? 'order-first px-2 py-2 pb-3' : 'px-3 py-1.5 gap-2'}`} title={descriptionCollapsed ? "Expand" : "Collapse"}>
                                <FaChevronRight className={`text-sm transition-transform duration-200 ${descriptionCollapsed ? 'rotate-0' : 'rotate-180'}`} />
                            </button>
                        </div>

                        <article className={`transition-all duration-300 ease-in-out w-full rounded-b-lg bg-[var(--main-color)] flex flex-col p-0 font-[Sansation,sans-serif] text-[var(--secondary-color)] lg:flex ${showTop ? 'max-h-0 opacity-0 overflow-hidden' : 'h-[calc(100vh-180px)] lg:h-[calc(92.5vh-20px)] overflow-y-auto opacity-100 flex'} ${descriptionCollapsed ? 'lg:hidden' : ''}`}>

                            <div className={`w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 flex flex-col gap-4 md:gap-5 flex-1 problem-description-scroll lg:max-h-[calc(100vh-180px)] h-full`}>
                                {/* Problem Title & Badges */}
                                {!chatPanel ? (
                                    <div className="flex flex-col gap-3">
                                        <h1 className="font-[Sansation,sans-serif] text-xl sm:text-2xl md:text-3xl text-[var(--secondary-color)] font-bold m-0">{problem.title}</h1>
                                        <div className="flex gap-1.5 md:gap-2 flex-wrap font-[Sansation,sans-serif] items-center">
                                            <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium ${problem.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-500' :
                                                problem.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                                    'bg-red-500/10 text-[var(--accent-color)]'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                            {problem.premium ? (
                                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-yellow-500/10 text-yellow-700">Premium</span>
                                            ) : (
                                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-[var(--french-gray)]/40 text-[var(--secondary-color)]">Free</span>
                                            )}
                                            {problem.topic && (
                                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-[var(--mid-main-secondary)] text-white">{formatTopicLabel(problem.topic)}</span>
                                            )}
                                            {isCompleted && (
                                                <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium bg-green-500/10 text-green-600">✓ Solved</span>
                                            )}
                                        </div>
                                    </div>
                                ) : (<></>)}





                                {/* Show Description State Check */}
                                {showDescription &&
                                    <>
                                        {/* Problem Description */}
                                        <MathJaxRenderer
                                            content={problem.description}
                                            className="text-sm md:text-[0.95rem] leading-relaxed text-[var(--secondary-color)] font-[Sansation,sans-serif] m-0"
                                            as="p"
                                        />

                                        {showDrawingPad && (
                                            <div className="rounded-md border border-[var(--mid-main-secondary)] bg-[var(--french-gray)]/20 p-3 md:p-4 flex flex-col gap-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] md:text-xs font-semibold text-[var(--secondary-color)] uppercase tracking-[0.05em]">Sketch</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDrawingColor('var(--secondary-color)')}
                                                                className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${drawingColor === 'var(--secondary-color)' || drawingColor === 'black' ? 'bg-[var(--secondary-color)] text-[var(--main-color)] border-[var(--secondary-color)]' : 'text-[var(--secondary-color)] border-[var(--mid-main-secondary)] hover:border-[var(--secondary-color)]'}`}
                                                            >
                                                                {currentTheme === 'dark' ? 'White' : 'Black'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setDrawingColor('red')}
                                                                className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${drawingColor === 'red' ? 'bg-[var(--accent-color)] text-[var(--main-color)] border-[var(--accent-color)]' : 'text-[var(--secondary-color)] border-[var(--mid-main-secondary)] hover:border-[var(--accent-color)]'}`}
                                                            >
                                                                Red
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={undoStroke}
                                                            disabled={strokes.length === 0}
                                                            className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${strokes.length === 0 ? 'opacity-50 cursor-not-allowed border-[var(--mid-main-secondary)] text-[var(--french-gray)]' : 'text-[var(--secondary-color)] border-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--main-color)]'}`}
                                                        >
                                                            Undo
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={clearCanvas}
                                                            disabled={strokes.length === 0}
                                                            className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium border transition-all duration-200 ${strokes.length === 0 ? 'opacity-50 cursor-not-allowed border-[var(--mid-main-secondary)] text-[var(--french-gray)]' : 'text-[var(--accent-color)] border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-white'}`}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="rounded-md border border-[var(--mid-main-secondary)] bg-[var(--main-color)] overflow-hidden shadow-sm">
                                                    <canvas
                                                        ref={canvasRef}
                                                        className="w-full h-48 md:h-56 bg-[var(--main-color)] cursor-crosshair"
                                                        style={{ touchAction: 'none' }}
                                                        onPointerDown={(e) => { e.preventDefault(); startDrawing(e); }}
                                                        onPointerMove={(e) => { e.preventDefault(); drawStroke(e); }}
                                                        onPointerUp={(e) => { e.preventDefault(); endDrawing(); }}
                                                        onPointerLeave={(e) => { e.preventDefault(); endDrawing(); }}
                                                        onMouseDown={(e) => { e.preventDefault(); startDrawing(e); }}
                                                        onMouseMove={(e) => { e.preventDefault(); drawStroke(e); }}
                                                        onMouseUp={(e) => { e.preventDefault(); endDrawing(); }}
                                                        onMouseLeave={(e) => { e.preventDefault(); endDrawing(); }}
                                                        onTouchStart={(e) => { e.preventDefault(); startDrawing(e); }}
                                                        onTouchMove={(e) => { e.preventDefault(); drawStroke(e); }}
                                                        onTouchEnd={(e) => { e.preventDefault(); endDrawing(); }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Examples */}
                                        {examples.length > 0 && (
                                            <div>
                                                <h3 className="text-sm md:text-base pb-2 md:pb-3 text-[var(--secondary-color)] font-bold font-[Sansation,sans-serif]">Examples</h3>
                                                {examples.map((example, index) => (
                                                    <div key={index} className="p-3 md:p-4 bg-[var(--french-gray)]/40 rounded-md pb-2 md:pb-3 last:pb-0">
                                                        <div className="text-[10px] md:text-xs font-bold text-[var(--secondary-color)] pb-1.5 md:pb-2 font-[Sansation,sans-serif]">Example {index + 1}:</div>
                                                        <div className="flex flex-col gap-1.5 md:gap-2">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm font-[Sansation,sans-serif]">
                                                                <span className="font-semibold text-[var(--secondary-color)] sm:min-w-[50px]">Input:</span>
                                                                <code className="bg-[var(--secondary-color)] text-[var(--main-color)] px-2 py-1 rounded font-[Courier_New,monospace] text-[0.75rem] md:text-[0.85rem] font-semibold break-all">{example.input}</code>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs md:text-sm font-[Sansation,sans-serif]">
                                                                <span className="font-semibold text-[var(--secondary-color)] sm:min-w-[50px]">Output:</span>
                                                                <code className="bg-[var(--secondary-color)] text-[var(--main-color)] px-2 py-1 rounded font-[Courier_New,monospace] text-[0.75rem] md:text-[0.85rem] font-semibold break-all">{example.output}</code>
                                                            </div>
                                                        </div>
                                                        {example.explanation && (
                                                            <div className="pt-2 border-t border-dashed border-gray-300 text-xs md:text-[0.85rem] text-gray-600 italic leading-relaxed font-[Sansation,sans-serif]">
                                                                {example.explanation}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Hints Section - Collapsible like LeetCode */}
                                        <div>
                                            {problem.hints && problem.hints.length > 0 && (
                                                <div className="border-t border-[var(--mid-main-secondary)]">

                                                    <div className="flex flex-col">
                                                        {problem.hints.map((hint, index) => (
                                                            <div key={index} className="border-t border-[var(--mid-main-secondary)] overflow-hidden">
                                                                <button
                                                                    className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 hover:bg-[var(--french-gray)]/40 cursor-pointer text-left transition-colors duration-200"
                                                                    onClick={() => toggleHint(index)}
                                                                >
                                                                    <span className="font-medium text-xs md:text-sm text-[var(--secondary-color)] font-[Sansation] flex items-center gap-2">
                                                                        <FaLightbulb className="text-[var(--secondary-color)] text-[10px] md:text-xs" />
                                                                        Hint {index + 1}
                                                                    </span>
                                                                    <FaChevronDown className={`text-[var(--secondary-color)] text-[10px] md:text-xs transition-transform duration-300 ${openHints[index] ? 'rotate-180' : ''}`} />
                                                                </button>
                                                                <div className={`transition-all duration-300 ease-in-out ${openHints[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                                    <div className="px-3 md:px-4 py-2 md:py-3 bg-[var(--main-color)] border-t border-[var(--mid-main-secondary)]">
                                                                        <MathJaxRenderer
                                                                            content={hint}
                                                                            className="text-xs md:text-sm text-[var(--secondary-color)] leading-relaxed font-[Sansation] m-0"
                                                                            as="p"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Similar Questions Section */}
                                            {similarQuestions && similarQuestions.length > 0 && (
                                                <div className="flex flex-col">
                                                    <div className="border-t border-[var(--mid-main-secondary)] overflow-hidden">
                                                        <button
                                                            className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 hover:bg-[var(--french-gray)]/40 cursor-pointer text-left transition-colors duration-200"
                                                            onClick={() => toggleHint('similar')}
                                                        >
                                                            <span className="font-medium text-xs md:text-sm text-[var(--secondary-color)] font-[Sansation] flex items-center gap-2">
                                                                <FaLink className="text-[var(--secondary-color)] text-[10px] md:text-xs" />
                                                                Similar Questions
                                                            </span>
                                                            <FaChevronDown className={`text-[var(--secondary-color)] text-[10px] md:text-xs transition-transform duration-300 ${openHints['similar'] ? 'rotate-180' : ''}`} />
                                                        </button>
                                                        <div className={`transition-all duration-300 ease-in-out ${openHints['similar'] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                            <div className=" bg-[var(--main-color)] flex flex-col">
                                                                {similarQuestions.map((question, index) => (
                                                                    <Link
                                                                        key={index}
                                                                        to={`/problems/${question.slug || generateProblemSlug(question.title, question.id)}`}
                                                                        className="flex items-center justify-between p-2 md:p-3 rounded-md group hover:bg-[var(--white)]"
                                                                    >
                                                                        <span className="text-xs md:text-sm text-[var(--secondary-color)] font-[Sansation] group-hover:text-[var(--dark-accent-color)]">
                                                                            {question.title}
                                                                        </span>
                                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium ${question.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-600' :
                                                                            question.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-700' :
                                                                                'bg-red-500/10 text-[var(--accent-color)]'
                                                                            }`}>
                                                                            {question.difficulty}
                                                                        </span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <div className="border-t border-[var(--mid-main-secondary)] overflow-hidden">
                                                    <button
                                                        className="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-3 hover:bg-[var(--french-gray)]/40 cursor-pointer text-left transition-colors duration-200"
                                                        onClick={() => setLatexOpen(o => !o)}
                                                    >
                                                        <span className="font-medium text-xs md:text-sm text-[var(--secondary-color)] font-[Sansation] flex items-center gap-2">
                                                            <FaCode className="text-[var(--secondary-color)] text-[10px] md:text-xs" />
                                                            Your solution in LaTeX
                                                        </span>
                                                        <FaChevronDown className={`text-[var(--secondary-color)] text-[10px] md:text-xs transition-transform duration-300 ${latexOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <div className={`transition-all duration-300 ease-in-out ${latexOpen ? 'max-h-96 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
                                                        <div className="bg-[var(--main-color)] flex flex-col gap-1">
                                                            {fields.map((f, i) => (
                                                                <p key={f.id} className="text-xs md:text-sm text-[var(--secondary-color)] font-[Sansation] p-2 md:p-3 bg-[var(--white)] rounded-md">
                                                                    <span className="font-bold pr-2">Step {i + 1}: </span>{f.latex || <span className="opacity-30 italic">empty</span>}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                {/* Show Solution State Check */}
                                {showSolution && <SolutionStepsDisplay
                                    solution={problem.solution}
                                />}

                                {/* Show Submissions State Check */}
                                {showSubmissions &&
                                    <div>
                                        {/* Inline feedback for incorrect answers only */}
                                        {submissionFeedback && !submissionFeedback.isCorrect && (
                                            <div className="rounded-xl px-4 py-3 border transition-all duration-300 bg-red-500/8 border-red-500/25">
                                                <div className="flex items-center gap-2 pb-1.5">
                                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--white)] text-[10px] font-bold flex-shrink-0 bg-[var(--dark-accent-color)]">
                                                        <FaTimes className='text-white' />
                                                    </div>
                                                    <span className="text-sm font-bold font-[Sansation,sans-serif] text-[var(--accent-color)]">
                                                        Incorrect
                                                    </span>
                                                    {submissionFeedback.isPracticeMode && (
                                                        <span className="text-[10px] font-medium text-gray-400 font-[Sansation,sans-serif]">Practice Mode</span>
                                                    )}
                                                    {!submissionFeedback.isPracticeMode && submissionFeedback.attemptNumber > 1 && (
                                                        <span className="text-[10px] text-[var(--secondary-color)] font-[Sansation,sans-serif]">Attempt {submissionFeedback.attemptNumber}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs md:text-[0.82rem] leading-relaxed font-[Sansation,sans-serif] text-[var(--accent-color)]/85">
                                                    {submissionFeedback.message}
                                                </p>
                                            </div>
                                        )}
                                        <h2 className="text-lg md:text-xl font-bold text-[var(--secondary-color)] font-[Sansation,sans-serif] py-4">Your Submissions</h2>
                                        <div className="flex flex-col gap-2">
                                            {submissions.map((submission) => (
                                                <div
                                                    key={submission.id}
                                                    onClick={() => {
                                                        setSelectedSubmission(submission);
                                                        setShowSubmissionDetail(true);
                                                        setChatPanel(false);
                                                    }}
                                                    className={`bg-[var(--french-gray)]/20 px-4 py-2.5 rounded-md border-l-4 cursor-pointer transition-all duration-200 ${submission.status === 'accepted' ? 'border-green-500 hover:bg-[var(--french-gray)]/70' :
                                                        submission.status === 'wrong' ? 'border-[var(--accent-color)] hover:bg-[var(--french-gray)]/30' :
                                                            'border-yellow-500 hover:bg-[var(--french-gray)]/30'
                                                        }`}
                                                >
                                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            {submission.status === 'accepted' && <FaCheckCircle className="text-green-600 text-xs flex-shrink-0" />}
                                                            {submission.status === 'wrong' && <FaTimesCircle className="text-red-600 text-xs flex-shrink-0" />}
                                                            <span className={`text-xs font-semibold truncate ${submission.status === 'accepted' ? 'text-green-600' :
                                                                submission.status === 'wrong' ? 'text-[var(--accent-color)]' :
                                                                    'text-yellow-600'
                                                                }`}>
                                                                {submission.status === 'accepted' ? 'Accepted' : submission.status === 'wrong' ? 'Wrong' : 'Pending'}
                                                            </span>
                                                            <span className="text-[10px] text-[vvar(--mid-main-secondary)] hidden sm:inline">•</span>
                                                            <span className="text-[10px] text-[vvar(--mid-main-secondary)] hidden sm:inline">{submission.steps.length} steps</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[10px] text-[vvar(--mid-main-secondary)] flex-shrink-0">
                                                            {typeof submission.metadata?.hintsUsed === 'number' && (
                                                                <span>{submission.metadata.hintsUsed} hints</span>
                                                            )}
                                                            {submission.metadata?.timeSpentLabel && (
                                                                <span>{submission.metadata.timeSpentLabel}</span>
                                                            )}
                                                            <div className="flex items-center gap-1">
                                                                <FaClock className="text-[8px]" />
                                                                <span>{new Date(submission.timestamp).toLocaleString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    hour: 'numeric',
                                                                    minute: '2-digit'
                                                                })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {submissions.length === 0 && (
                                                <p className="text-center text-sm text-[vvar(--mid-main-secondary)] py-8">No submissions yet. Start solving to see your history!</p>
                                            )}
                                        </div>
                                    </div>
                                }

                                {/* Show Mentor Chat State Check
                                {showMentorChat && <MentorChat />} */}

                                {/* Show AI chat panel */}
                                {chatPanel && <ChatPanel ref={chatPanelRef}
                                    premium={premium}
                                    problemDescription={problem.description}
                                    acceptedSolution={problem.solution}
                                    fields={fields}
                                    storageKey={sigmaChatStorageKey} />}
                            </div>
                        </article>
                    </aside>


                    {/* Solving Side - Math Live*/}
                    {/* We also pass the problem description and accepted solution to be checked by the AI */}
                    <article className={`flex justify-start items-stretch flex-col w-full min-h-[500px] lg:h-full overflow-hidden rounded-md transition-all duration-300 ${descriptionCollapsed ? 'lg:w-full' : 'lg:w-1/2'}`}>
                        <MathLiveExample
                            key={`ml-${problem?.id}-${timerResetSeq}`}
                            onSubmit={handleNewSubmission}
                            nextProblemPath={nextProblemSlug ? `/problems/${nextProblemSlug}` : null}
                            isSolved={isCompleted}
                            isPracticeMode={isCompleted}
                            problemDescription={problem.description}
                            acceptedSolution={problem.solution}
                            onFieldsChange={handleFieldsChange}
                            onExplainMore={openSigmaChat}
                            storageKey={mathDraftStorageKey}
                            premium={premium}
                        />
                    </article>
                </section>
            </main>
        </>
    );
};

export default Problem;
