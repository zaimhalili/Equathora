import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/MathLiveExample.css";
import { FaChevronDown, FaChevronUp, FaTrash, FaLightbulb, FaCheckCircle, FaPlus, FaGraduationCap } from "react-icons/fa";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import { testGemini } from "@/lib/geminiTest";
import { useSubscription } from "@/hooks/SubscriptionContext";

const MAX_STEP_CHARS = 150;
const MAX_STEPS = 40;
const MAX_TOTAL_CHARS = 5000;
const FREE_TRIAL_LIMIT = 3;

const DeleteAllModal = ({ isOpen, onClose, onConfirm }) => {
    useBodyScrollLock(isOpen);
    if (!isOpen) return null;
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-[var(--raisin-black)]/30 backdrop-blur-[2px]' onClick={onClose}>
            <div className='bg-[var(--white)] w-11/12 max-w-md rounded-md px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-[Sansation,sans-serif] text-left font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>Clear All Steps?</h2>
                    <p className='font-[Sansation,sans-serif] text-[var(--secondary-color)] text-sm md:text-base leading-relaxed opacity-80'>This will delete all your current steps. This action cannot be undone.</p>
                </div>
                <div className='flex w-full justify-between gap-3 pt-7'>
                    <button type="button" onClick={onClose} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-[var(--mid-main-secondary)] rounded-md bg-[var(--white)] text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base theme-lock'>Cancel</button>
                    <button type="button" className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-md bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base' onClick={onConfirm}>Clear All</button>
                </div>
            </div>
        </div>
    );
};

const loadStoredFields = (storageKey) => {
    const emptyField = { id: Date.now(), latex: '' };
    if (typeof window === 'undefined' || !storageKey) return [emptyField];
    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return [emptyField];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed) || parsed.length === 0) return [emptyField];
        return parsed.map((field, index) => ({
            id: typeof field?.id === 'number' ? field.id : Date.now() + index,
            latex: typeof field?.latex === 'string' ? field.latex : '',
        }));
    } catch {
        return [emptyField];
    }
};

export default function MathLiveEditor({
    onSubmit,
    onSubmitInitiated,
    nextProblemPath,
    isSolved = false,
    isPracticeMode = false,
    isFirstProblemSubmission = false,
    problemDescription,
    acceptedSolution,
    onFieldsChange,
    onExplainMore,
    onFeedbackChange = () => { },
    isAiBusy = false,
    storageKey = '',
}) {
    const { tier, trialMessagesUsed } = useSubscription();
    const trialExhausted = tier === 'free' && trialMessagesUsed >= FREE_TRIAL_LIMIT;

    const [fields, setFields] = useState(() => loadStoredFields(storageKey));
    const [deleteAllPopup, setDeleteAllPopup] = useState(false);
    const [submissionFeedback, setSubmissionFeedback] = useState(null);
    const [canShowNext, setCanShowNext] = useState(isSolved);
    const [hintsOpen, setHintsOpen] = useState(false);
    const [wrongStepNumber, setWrongStepNumber] = useState(null);
    const [stepLimitWarning, setStepLimitWarning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const fieldRefs = useRef({});

    useEffect(() => {
        (async () => {
            try {
                await import("mathlive");
            } catch (e) {
                console.error("Failed to load MathLive.", e);
            }
        })();
    }, []);

    useEffect(() => {
        const storedFields = loadStoredFields(storageKey);
        setFields(storedFields);
        onFieldsChange?.(storedFields);
        setWrongStepNumber(null);
        setSubmissionFeedback(null);
        setIsSubmitting(false);
    }, [storageKey]);

    useEffect(() => {
        if (typeof window === 'undefined' || !storageKey) return;
        window.localStorage.setItem(storageKey, JSON.stringify(fields));
    }, [fields, storageKey]);

    const updateLatex = (id, latex) => {
        if (latex.length > MAX_STEP_CHARS) return;
        setWrongStepNumber(null);
        setFields((prev) => {
            const updated = prev.map((f) => (f.id === id ? { ...f, latex } : f));
            onFieldsChange?.(updated);
            return updated;
        });
    };

    const addField = () => {
        if (fields.length >= MAX_STEPS) {
            setStepLimitWarning(true);
            setTimeout(() => setStepLimitWarning(false), 3000);
            return;
        }
        const newField = { id: Date.now(), latex: "" };
        setFields((prev) => {
            const updated = [...prev, newField];
            onFieldsChange?.(updated);
            return updated;
        });
        setTimeout(() => { fieldRefs.current[newField.id]?.focus(); }, 0);
    };

    const clearAll = () => {
        const newField = { id: Date.now(), latex: "" };
        setFields([newField]);
        onFieldsChange?.([newField]);
        setStepLimitWarning(false);
        setTimeout(() => { fieldRefs.current[newField.id]?.focus(); }, 0);
    };

    const deleteField = (id) => {
        if (fields.length === 1) {
            const newField = { id: Date.now(), latex: "" };
            setFields([newField]);
            onFieldsChange?.([newField]);
            return;
        }
        setFields((prev) => {
            const updated = prev.filter((f) => f.id !== id);
            onFieldsChange?.(updated);
            return updated;
        });
    };

    const handleSubmit = async () => {
        const nonEmptyFields = fields.filter(f => f.latex && f.latex.trim() !== '');

        if (nonEmptyFields.length === 0) {
            alert("Please enter at least one step before submitting!");
            return;
        }

        const totalChars = nonEmptyFields.reduce((acc, f) => acc + f.latex.length, 0);
        onSubmitInitiated?.({
            stepCount: nonEmptyFields.length,
            totalCharacters: totalChars,
        });

        if (totalChars > MAX_TOTAL_CHARS) {
            const errFb = { message: "Your solution is too long...", success: false, isCorrect: false, loading: false };
            setSubmissionFeedback(errFb);
            onFeedbackChange?.(errFb);
            return;
        }

        // 1. Reset feedback state on every submission attempt to allow repeated solves
        setWrongStepNumber(null);
        setIsSubmitting(true);
        const loadingFb = { message: "Checking your answer...", success: false, isCorrect: false, loading: true };
        setSubmissionFeedback(loadingFb);
        onFeedbackChange?.(loadingFb);

        try {
            const result = await onSubmit?.(nonEmptyFields);
            if (!result) return;

            // 2. Handle correct solution submission
            if (result.success || result.isCorrect) {
                const successFb = {
                    message: result.message || "Correct solution!",
                    success: true,
                    isCorrect: true,
                    loading: false,
                    topic: result.topic,
                    difficulty: result.difficulty,
                };
                setSubmissionFeedback(successFb);
                onFeedbackChange?.(successFb);
                setCanShowNext(true);
                return;
            }

            // 3. Handle incorrect solution submission (Check free trial limit first)
            if (trialExhausted) {
                const trialFb = {
                    message: "You've used your free trial. Upgrade to Premium to see exactly where you went wrong.",
                    success: false,
                    isCorrect: false,
                    loading: false,
                };
                setSubmissionFeedback(trialFb);
                onFeedbackChange?.(trialFb);
                return;
            }

            // 4. Run AI step analyzer for incorrect submission
            const fbAi = { message: "AI Mentor is analyzing your steps...", success: false, isCorrect: false, loading: true };
            setSubmissionFeedback(fbAi);
            onFeedbackChange?.(fbAi);

            const formattedUserSteps = nonEmptyFields
                .map((f, index) => `Step ${index + 1}: ${f.latex}`)
                .join('\n');

            const aiResponse = await testGemini({ problemDescription, userSteps: formattedUserSteps, acceptedAnswer: acceptedSolution });

            if (aiResponse) {
                // A step number outside the range of steps actually submitted
                // isn't useful to highlight — fall back to "no specific step"
                // so the message still renders via the general feedback block
                // below instead of silently matching nothing.
                const validStep = typeof aiResponse.step === 'number'
                    && aiResponse.step >= 1
                    && aiResponse.step <= nonEmptyFields.length
                    ? aiResponse.step
                    : null;

                setWrongStepNumber(validStep);
                const fb = { message: aiResponse.text, success: false, isCorrect: false, loading: false };
                setSubmissionFeedback(fb);
                onFeedbackChange?.(fb);
            }
        } catch (aiError) {
            console.error("AI error:", aiError);
            const fb = { message: "Error analyzing steps. Please try again.", success: false, isCorrect: false, loading: false };
            setSubmissionFeedback(fb);
            onFeedbackChange?.(fb);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextProblem = () => {
        if (!nextProblemPath) return;
        navigate(nextProblemPath);
    };

    const handleExplainMoreClick = () => {
        if (isAiBusy) {
            setSubmissionFeedback(prev => ({
                ...prev,
                message: (prev?.message || '') + " (Sigma is still finishing the last response — try again in a moment.)",
            }));
            return;
        }
        const stepText = wrongStepNumber != null ? `step ${wrongStepNumber}` : 'my solution';
        onExplainMore?.(`Can you explain in more detail what went wrong at ${stepText}? The hint says: "${submissionFeedback.message}"`);
    };

    useEffect(() => {
        if (isSolved) setCanShowNext(true);
    }, [isSolved]);

    const showNextProblem = Boolean(canShowNext && nextProblemPath);
    const hasEnteredAnswer = fields.some((field) => field.latex?.trim());
    const shouldDockFirstSubmit = isFirstProblemSubmission && hasEnteredAnswer && !isSolved;

    // General (non-step-specific) feedback: shown when there's an incorrect
    // submission but no valid step number to attach it to (AI error, unclear
    // response, or an out-of-range step) — so the message is never silently
    // dropped just because it didn't match a field in the loop below.
    const showGeneralFeedback = submissionFeedback
        && !submissionFeedback.success
        && !submissionFeedback.loading
        && wrongStepNumber == null;

    return (
        <>
            <DeleteAllModal
                isOpen={deleteAllPopup}
                onClose={() => setDeleteAllPopup(false)}
                onConfirm={() => { clearAll(); setDeleteAllPopup(false); }}
            />
            <div className={`ml-wrapper ${shouldDockFirstSubmit ? 'ml-wrapper--submit-docked' : ''}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="ml-title w-full">Your Solution</h2>
                    {isPracticeMode && (
                        <span className="w-full text-center flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold bg-blue-500/10 text-blue-600">
                            <FaGraduationCap />
                            Practice Mode - already solved, no points this time
                        </span>
                    )}
                </div>

                <div className="ml-format-hints" onClick={() => setHintsOpen(!hintsOpen)}>
                    <div className="ml-format-hints-toggle">
                        <div className="ml-format-hints-title">
                            <FaLightbulb />
                            How to Use This Interface
                        </div>
                        {hintsOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {hintsOpen && (
                        <div className="ml-format-hints-content">
                            <div className="ml-usage-instructions">
                                Type each step. Press <strong>Enter</strong> to add a new step, use <strong>↑↓</strong> arrows to move between steps, and the last step counts as your final answer.
                            </div>
                            <ul className="ml-format-hints-list">
                                <li>Fractions: Use <code>frac{"{numerator}"}{"{denominator}"}</code> or type "/" for quick fraction</li>
                                <li>Exponents: Use ^ symbol (e.g., x^2 for x²)</li>
                                <li>Square root: Type sqrt{"{x}"} or use √ button</li>
                                <li>Multiplication: Use * or × (times symbol)</li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="ml-card" aria-live="polite">
                    <div className="ml-steps-scrollable">
                        <div className="ml-steps-container cursor-text">
                            {fields.map((field, index) => {
                                const stepNumber = index + 1;
                                const isThisStepWrong = stepNumber === wrongStepNumber;

                                return (
                                    <div key={field.id}>
                                        <div className="ml-step-wrapper">
                                            <div className={`ml-step-label ${isThisStepWrong ? 'bg-[var(--accent-color)] text-white! animate-bounce duration-200' : ''}`}>
                                                {stepNumber}
                                            </div>

                                            <math-field
                                                ref={(el) => (fieldRefs.current[field.id] = el)}
                                                className="ml-field"
                                                virtualkeyboardmode="off"
                                                smartfence="true"
                                                placeholder=""
                                                value={field.latex}
                                                onInput={(evt) => updateLatex(field.id, evt.target.getValue("latex"))}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") { e.preventDefault(); addField(); }
                                                    if (e.key === "ArrowUp") { e.preventDefault(); const prev = fields[index - 1]; if (prev) fieldRefs.current[prev.id]?.focus(); }
                                                    if (e.key === "ArrowDown") { e.preventDefault(); const next = fields[index + 1]; if (next) fieldRefs.current[next.id]?.focus(); }
                                                }}
                                            ></math-field>

                                            <button className="ml-delete-btn" onClick={() => deleteField(field.id)} title="Delete this step">
                                                <FaTrash />
                                            </button>
                                        </div>

                                        {isThisStepWrong && submissionFeedback && !submissionFeedback.success && (
                                            <div className="w-full pt-2 flex justify-between px-6 md:px-8 items-center pb-4 flex-wrap">
                                                <div className="flex gap-2 py-1 items-center">
                                                    {submissionFeedback.loading && (
                                                        <span className="inline-block h-3 w-3 rounded-full border-2 border-[var(--accent-color)] border-t-transparent animate-spin" aria-hidden="true" />
                                                    )}
                                                    <p className="text-xs md:text-sm leading-relaxed text-[var(--secondary-color)]">
                                                        {submissionFeedback.loading ? "Analyzing your steps..." : submissionFeedback.message}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleExplainMoreClick}
                                                    disabled={isAiBusy}
                                                    className="bg-gradient-to-b from-amber-600 to-amber-400 px-3 md:px-4 py-1 text-[11px] font-semibold rounded-md cursor-pointer text-[var(--secondary-color)] hover:to-amber-500 active:!scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isAiBusy ? "Sigma is thinking…" : "Explain more"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {showGeneralFeedback && (
                        <div className="w-full pt-2 flex justify-between px-6 md:px-8 items-center pb-4 flex-wrap border-t border-[var(--mid-main-secondary)]/30">
                            <p className="text-xs md:text-sm leading-relaxed text-[var(--secondary-color)]">
                                {submissionFeedback.message}
                            </p>
                            <button
                                onClick={handleExplainMoreClick}
                                disabled={isAiBusy}
                                className="bg-gradient-to-b from-amber-600 to-amber-400 px-3 md:px-4 py-1 text-[11px] font-semibold rounded-md cursor-pointer text-[var(--secondary-color)] hover:to-amber-500 active:!scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAiBusy ? "Sigma is thinking…" : "Explain more"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="ml-toolbar-sticky">
                    <div className="ml-toolbar">
                        <button className="ml-btn clear flex gap-1 order-2 sm:order-1" onClick={() => setDeleteAllPopup(true)}>
                            <FaTrash />
                            <p>Clear All</p>
                        </button>
                        <div className="flex gap-2 w-full sm:w-auto sm:order-2">
                            <button className="ml-btn addStep flex gap-1 items-center" onClick={addField} title="Click (Enter)">
                                <FaPlus />
                                Add New Line
                            </button>
                            <button
                                className={`ml-btn submit flex-1 ${hasEnteredAnswer ? 'ml-submit-ready' : ''} ${shouldDockFirstSubmit ? 'ml-submit-docked' : ''} ${isSubmitting ? 'active:scale-100 !cursor-not-allowed active:!translate-y-0' : ''}`}
                                onClick={handleSubmit}
                                disabled={!hasEnteredAnswer || isSubmitting}
                            >
                                {isSubmitting ? "Checking..." : "Submit Solution"}
                            </button>
                            {showNextProblem && (
                                <button className="ml-btn ml-next-btn !bg-green-600 hover:!bg-green-700" onClick={handleNextProblem} title="Go to next problem">
                                    Next Problem
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
