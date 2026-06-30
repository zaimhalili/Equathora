import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/MathLiveExample.css";
import { FaChevronDown, FaChevronUp, FaTrash, FaTimes, FaLightbulb, FaCheckCircle, FaPlus, FaArrowRight } from "react-icons/fa";
import useBodyScrollLock from "../hooks/useBodyScrollLock";
import { testGemini } from "@/lib/geminiTest";

const MAX_STEP_CHARS = 150;
const MAX_STEPS = 40;
const MAX_TOTAL_CHARS = 5000;

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

const normalize = (latex) =>
    latex
        .replace(/\s+/g, '')           // remove all whitespace
        .replace(/\{([^{}]*)\}/g, '$1') // strip single-char braces
        .toLowerCase()
        .trim();

export default function MathLiveEditor({ onSubmit, nextProblemPath, isSolved = false, isPracticeMode = false, problemDescription, acceptedSolution, onFieldsChange, onExplainMore, premium = false }) {
    const [fields, setFields] = useState([{ id: Date.now(), latex: "" }]);
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
        let cancelled = false;
        (async () => {
            try {
                await import("mathlive");
            } catch (e) {
                console.error("Failed to load MathLive.", e);
            }
        })();
        return () => { cancelled = true; };
    }, []);

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
        if (totalChars > MAX_TOTAL_CHARS) {
            const fb = { message: `Your solution is too long...`, success: false, loading: false };
            setSubmissionFeedback(fb);
            return;
        }

        setIsSubmitting(true);
        const fbLoading = { message: "Checking your answer...", success: false, loading: true };
        setSubmissionFeedback(fbLoading);

        const result = await onSubmit?.(nonEmptyFields);
        setIsSubmitting(false);

        if (!result) return;

        if (result.success) {
            const fb = { message: result.message, success: true, loading: false };
            setSubmissionFeedback(fb);
            setCanShowNext(true);
            return;
        }

        if (!premium) {
            const fb = { message: "Incorrect. Upgrade to Premium to see exactly where you went wrong.", success: false, loading: false };
            setSubmissionFeedback(fb);
            return;
        }

        try {
            const fbAi = { message: "AI Mentor is analyzing your steps...", success: false, loading: true };
            setSubmissionFeedback(fbAi);
            onFeedbackChange?.(fbAi);
            setWrongStepNumber(null);

            const formattedUserSteps = nonEmptyFields
                .map((f, index) => `Step ${index + 1}: ${f.latex}`)
                .join('\n');

            const aiResponse = await testGemini({ problemDescription, userSteps: formattedUserSteps, acceptedAnswer: acceptedSolution });

            if (aiResponse) {
                setWrongStepNumber(aiResponse.step);
                const fb = { message: aiResponse.text, success: false, loading: false };
                setSubmissionFeedback(fb);
                onFeedbackChange?.(fb);
            }
        } catch (aiError) {
            console.error("AI error:", aiError);
            const fb = { message: "Error analyzing steps. Please try again.", success: false, loading: false };
            setSubmissionFeedback(fb);
            onFeedbackChange?.(fb);
        }
    }

    const handleNextProblem = () => {
        if (!nextProblemPath) return;
        navigate(nextProblemPath);
    };

    useEffect(() => {
        if (isSolved) setCanShowNext(true);
    }, [isSolved]);

    const showNextProblem = Boolean(canShowNext && nextProblemPath);


    return (
        <>
            <DeleteAllModal
                isOpen={deleteAllPopup}
                onClose={() => setDeleteAllPopup(false)}
                onConfirm={() => { clearAll(); setDeleteAllPopup(false); }}
            />
            <div className="ml-wrapper">
                <h2 className="ml-title">Your Solution</h2>

                {/* Usage Guide */}
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

                {/* Correct banner — shown above steps when solved */}
                {submissionFeedback?.success && (
                    <div className="ml-feedback-card success" style={{ margin: '0 0 0.5rem 0', padding: '0.5rem 1rem' }}>
                        <div className="ml-feedback-header" style={{ marginBottom: 0 }}>
                            <div className="ml-feedback-icon success"><FaCheckCircle /></div>
                            <span className="ml-feedback-title">Correct</span>
                            {isPracticeMode && (
                                <span className="ml-2 text-[10px] font-medium text-emerald-500 font-[Sansation,sans-serif]">Practice Mode</span>
                            )}
                        </div>
                    </div>
                )}

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
                                                class="ml-field"
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

                                        {/* Inline AI hint directly under the wrong step */}
                                        {isThisStepWrong && submissionFeedback &&
                                            !submissionFeedback.success && (
                                                <div className="w-full pt-2 flex justify-between px-6 md:px-8 items-center pb-4 flex-wrap">
                                                    <div className="flex gap-2 py-1 items-center">
                                                        <FaArrowRight className="text-[var(--accent-color)] text-xs md:text-sm h-full hidden md:block" />
                                                        <p className="text-xs md:text-sm leading-relaxed text-[var(--secondary-color)]">
                                                            {submissionFeedback.loading ? "Analyzing your steps..." : submissionFeedback.message}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => onExplainMore?.(`Can you explain in more detail what went wrong at step ${wrongStepNumber}? The hint says: "${submissionFeedback.message}"`)}
                                                        className="bg-gradient-to-b from-amber-600 to-amber-400 px-3 md:px-4 py-1 text-[11px] font-semibold rounded-md cursor-pointer text-[var(--secondary-color)] hover:to-amber-500 active:!scale-95"
                                                    >
                                                        Explain more
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom toolbar — buttons only */}
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
                            <button className="ml-btn submit flex-1" onClick={handleSubmit} disabled={isSubmitting}>
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