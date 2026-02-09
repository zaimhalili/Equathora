import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/MathLiveExample.css";
import { FaChevronDown, FaChevronUp, FaTrash, FaTimes, FaLightbulb, FaCheckCircle } from "react-icons/fa";

const DeleteAllModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-[2px]' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-md rounded-md px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-[Sansation] text-left font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>Clear All Steps?</h2>
                    <p className='font-[Sansation] text-[var(--secondary-color)] text-sm md:text-base leading-relaxed opacity-80'>This will delete all your current steps. This action cannot be undone.</p>
                </div>

                <div className='flex w-full justify-between gap-3 pt-7'>
                    <button type="button" onClick={onClose} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-[var(--french-gray)] rounded-md bg-white text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base'>Cancel</button>

                    <button type="button" className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-md bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base' onClick={onConfirm}>Clear All</button>
                </div>
            </div>
        </div>
    );
};

export default function MathLiveEditor({ onSubmit, nextProblemPath, isSolved = false, isPracticeMode = false }) {
    const [fields, setFields] = useState([{ id: Date.now(), latex: "" }]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [deleteAllPopup, setDeleteAllPopup] = useState(false);
    const [submissionFeedback, setSubmissionFeedback] = useState(null);
    const [canShowNext, setCanShowNext] = useState(isSolved);
    const [hintsOpen, setHintsOpen] = useState(false);
    const navigate = useNavigate();

    // refs to each math-field
    const fieldRefs = useRef({});

    // Dynamically load MathLive once
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                await import("mathlive");
                if (!cancelled) {
                    // MathLive loaded successfully
                }
            } catch (e) {
                console.error("Failed to load MathLive. Check your connection.", e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const updateLatex = (id, latex) => {
        setFields((prev) =>
            prev.map((f) => (f.id === id ? { ...f, latex } : f))
        );
    };

    const addField = () => {
        const newField = { id: Date.now(), latex: "" };
        setFields((prev) => [...prev, newField]);

        // Focus the new math-field after it mounts
        setTimeout(() => {
            fieldRefs.current[newField.id]?.focus();
        }, 0);
    };

    const clearAll = () => {
        const newField = { id: Date.now(), latex: "" };
        setFields([newField]);

        setTimeout(() => {
            fieldRefs.current[newField.id]?.focus();
        }, 0);
    };

    const deleteField = (id) => {
        if (fields.length === 1) {
            // Don't delete if it's the last field, just clear it
            setFields([{ id: Date.now(), latex: "" }]);
            return;
        }
        setFields((prev) => prev.filter((f) => f.id !== id));
    };

    const handleSubmit = async () => {
        // Filter out empty fields
        const nonEmptyFields = fields.filter(f => f.latex && f.latex.trim() !== '');

        if (nonEmptyFields.length === 0) {
            alert("Please enter at least one step before submitting!");
            return;
        }

        console.log("All steps:", nonEmptyFields);

        // Call the onSubmit handler from parent if provided
        if (onSubmit) {
            try {
                const submission = await onSubmit(nonEmptyFields);
                const success = submission?.success ?? false;
                const message = submission?.message || 'Unable to validate your answer. Please try again.';
                setSubmissionFeedback({ message, success });
                if (success) setCanShowNext(true);
            } catch (error) {
                console.error('Unable to submit steps', error);
                setSubmissionFeedback({
                    message: 'Something went wrong while submitting. Please try again.',
                    success: false
                });
            }
        } else {
            setSubmissionFeedback({
                message: 'Steps captured locally.',
                success: true
            });
            setCanShowNext(true);
        }
    };

    const handleNextProblem = () => {
        if (!nextProblemPath) return;
        navigate(nextProblemPath);
    };

    useEffect(() => {
        if (isSolved) {
            setCanShowNext(true);
        }
    }, [isSolved]);

    const showNextProblem = Boolean(canShowNext && nextProblemPath);

    return (
        <>
            <DeleteAllModal
                isOpen={deleteAllPopup}
                onClose={() => setDeleteAllPopup(false)}
                onConfirm={() => {
                    clearAll();
                    setDeleteAllPopup(false);
                }}
            />
            <div className="ml-wrapper">
                <h2 className="ml-title">Your Solution</h2>

                {/* Usage Guide - Combined Instructions and Tips */}
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
                            {fields.map((field, index) => (
                                <div key={field.id} className="ml-step-wrapper">
                                    <div className="ml-step-label">{index + 1}</div>
                                    <math-field
                                        ref={(el) => (fieldRefs.current[field.id] = el)}
                                        class="ml-field"
                                        virtualkeyboardmode="off"
                                        smartfence="true"
                                        placeholder=""
                                        value={field.latex}
                                        onInput={(evt) =>
                                            updateLatex(field.id, evt.target.getValue("latex"))
                                        }
                                        onKeyDown={(e) => {
                                            const mf = fieldRefs.current[field.id];

                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addField();
                                            }

                                            if (e.key === "ArrowUp") {
                                                e.preventDefault();
                                                const prevField = fields[index - 1];
                                                if (prevField) fieldRefs.current[prevField.id]?.focus();
                                            }

                                            if (e.key === "ArrowDown") {
                                                e.preventDefault();
                                                const nextField = fields[index + 1];
                                                if (nextField) fieldRefs.current[nextField.id]?.focus();
                                            }
                                        }}
                                    ></math-field>
                                    <button
                                        className="ml-delete-btn"
                                        onClick={() => deleteField(field.id)}
                                        title="Delete this step"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="ml-toolbar-sticky">
                    {submissionFeedback && (
                        submissionFeedback.success ? (
                            <div className="ml-feedback-card success" style={{ padding: '0.5rem 1rem' }}>
                                <div className="ml-feedback-header" style={{ marginBottom: 0 }}>
                                    <div className="ml-feedback-icon success"><FaCheckCircle /></div>
                                    <span className="ml-feedback-title">Correct</span>
                                    {isPracticeMode && (
                                        <span className="ml-2 text-[10px] font-medium text-emerald-500 font-[Sansation,sans-serif]">Practice Mode</span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="ml-feedback-card error">
                                <div className="ml-feedback-header">
                                    <div className="ml-feedback-icon error"><FaTimes /></div>
                                    <span className="ml-feedback-title">Incorrect</span>
                                    {isPracticeMode && (
                                        <span className="ml-2 text-[10px] font-medium text-gray-400 font-[Sansation,sans-serif]">Practice Mode</span>
                                    )}
                                </div>
                                <p className="ml-feedback-message">{submissionFeedback.message}</p>
                            </div>
                        )
                    )}
                    <div className="ml-toolbar">
                        <button className="ml-btn clear flex gap-1 order-2 sm:order-1" onClick={() => setDeleteAllPopup(true)}>
                            <FaTrash />
                            <p>Clear All</p>
                        </button>
                        <div className="flex gap-2 w-full sm:w-auto sm:order-2">
                            <button className="ml-btn addStep" onClick={addField}>
                                + Add New Line
                            </button>
                            <button className="ml-btn submit flex-1" onClick={handleSubmit}>
                                Submit Solution
                            </button>
                            {showNextProblem && (
                                <button className="ml-btn ml-next-btn !bg-green-600 hover:!bg-green-700" onClick={handleNextProblem} title="Go to next problem">
                                    Next Problem
                                </button>
                            )}
                        </div>

                    </div>



                    <div className="ml-output-wrapper">
                        <button
                            className="ml-preview-toggle"
                            onClick={() => setPreviewOpen(!previewOpen)}
                        >
                            <strong>LaTeX</strong>
                            {previewOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {previewOpen && (
                            <div className="ml-output">
                                <ul className="steps-list">
                                    {fields.map((f, i) => (
                                        <li key={f.id}>
                                            Step {i + 1}: {f.latex}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
