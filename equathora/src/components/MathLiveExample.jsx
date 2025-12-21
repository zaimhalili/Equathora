import React, { useEffect, useRef, useState } from "react";
import "../components/MathLiveExample.css";
import { FaChevronDown, FaChevronUp, FaTrash, FaTimes } from "react-icons/fa";

const DeleteAllModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-[2px]' onClick={onClose}>
            <div className='bg-white w-11/12 max-w-md rounded-2xl px-6 py-7 flex flex-col shadow-2xl' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-[Inter] text-left font-bold text-2xl md:text-3xl text-[var(--secondary-color)] leading-tight'>Clear All Steps?</h2>
                    <p className='font-[Inter] text-[var(--secondary-color)] text-sm md:text-base leading-relaxed opacity-80'>This will delete all your current steps. This action cannot be undone.</p>
                </div>

                <div className='flex w-full justify-between gap-3 pt-7'>
                    <button type="button" onClick={onClose} className='px-4 cursor-pointer py-2.5 font-semibold text-center border-2 border-[var(--french-gray)] rounded-lg bg-white text-[var(--secondary-color)] hover:bg-[var(--french-gray)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base'>Cancel</button>

                    <button type="button" className='px-4 cursor-pointer py-2.5 font-bold text-center border-2 border-[var(--accent-color)] rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--dark-accent-color)] hover:border-[var(--dark-accent-color)] shadow-md hover:shadow-lg -translate-y-1 hover:translate-y-0 transition-all duration-300 flex-1 text-sm md:text-base' onClick={onConfirm}>Clear All</button>
                </div>
            </div>
        </div>
    );
};

export default function MathLiveEditor({ onSubmit }) {
    const [fields, setFields] = useState([{ id: Date.now(), latex: "" }]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [deleteAllPopup, setDeleteAllPopup] = useState(false);
    const [submissionFeedback, setSubmissionFeedback] = useState(null);

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

    const handleSubmit = () => {
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
                const submission = onSubmit(nonEmptyFields);
                if (submission?.message) {
                    setSubmissionFeedback({
                        message: submission.message,
                        success: submission.success ?? false
                    });
                } else {
                    setSubmissionFeedback({
                        message: 'Submission sent!',
                        success: true
                    });
                }
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
        }
    };

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
                <div className="ml-status">
                    Type each step. Enter adds a step, ↑↓ move focus, and the last step counts as your final answer.
                </div>

                <div className="ml-card" aria-live="polite">
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
                                    <FaTimes />
                                </button>
                            </div>
                        ))}

                    </div>

                    <div className="ml-toolbar">
                        <button className="ml-btn clear flex gap-1" onClick={() => setDeleteAllPopup(true)}>
                            <FaTrash />
                            <p>Clear All</p>
                        </button>
                        <div className="flex gap-2">
                            <button className="ml-btn addStep" onClick={addField}>
                                + Add Step
                            </button>
                            <button className="ml-btn submit" onClick={handleSubmit}>
                                Submit Solution
                            </button>
                        </div>

                    </div>

                    {submissionFeedback && (
                        <div className={`ml-feedback ${submissionFeedback.success ? 'success' : 'error'}`}>
                            {submissionFeedback.message}
                        </div>
                    )}

                    <div className="ml-output-wrapper">
                        <button
                            className="ml-preview-toggle"
                            onClick={() => setPreviewOpen(!previewOpen)}
                        >
                            <strong>Preview</strong>
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
