import React, { useEffect, useState, useRef } from "react";
import "../components/MathLiveExample.css";

export default function MathLiveEditor() {
    const [status, setStatus] = useState("Loading...");
    const [fields, setFields] = useState([{ id: Date.now(), latex: "" }]);

    // refs to each math-field
    const fieldRefs = useRef({});

    // Dynamically load MathLive once
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                await import("mathlive");
                if (!cancelled) setStatus("MathLive loaded");
            } catch (e) {
                console.error(e);
                if (!cancelled) setStatus("Failed to load MathLive");
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

    const handleSubmit = () => {
        console.log("All steps:", fields);
        alert(fields.map((f, i) => `Step ${i + 1}: ${f.latex}`).join("\n"));
    };

    return (
        <div className="ml-wrapper">
            <h2 className="ml-title">Your Solution</h2>
            <div className="ml-status">Status: {status}</div>

            <div className="ml-card" aria-live="polite">
                <div className="ml-steps-container">
                    {fields.map((field, index) => (
                        <math-field
                            key={field.id}
                            ref={(el) => (fieldRefs.current[field.id] = el)}
                            class="ml-field"
                            virtualkeyboardmode="onfocus"
                            smartfence="true"
                            value={field.latex}
                            placeholder={`Step-${index + 1}-or-answer-here…`}
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
                    ))}

                </div>

                <div className="ml-toolbar">
                    <button className="ml-btn clear" onClick={clearAll}>
                        Clear
                    </button>
                    <button className="ml-btn addStep" onClick={addField}>
                        Add Step or Press Enter
                    </button>
                    <button className="ml-btn submit" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>

                <div className="ml-output">
                    <strong>Preview:</strong>
                    <ul className="steps-list">
                        {fields.map((f, i) => (
                            <li key={f.id}>
                                Step {i + 1}: {f.latex}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
