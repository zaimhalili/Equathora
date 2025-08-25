import React, { useEffect, useRef, useState } from "react";
import '../components/MathLiveExample.css';

export default function MathLiveEditor() {
    const mathfieldRef = useRef(null);
    const [latex, setLatex] = useState("");
    const [status, setStatus] = useState("Ready");

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

    const handleSubmit = () => {
        const mf = mathfieldRef.current;
        if (!mf) return;
        const value = mf.getValue("latex");
        setLatex(value);
    };

    const handleClear = () => {
        const mf = mathfieldRef.current;
        if (!mf) return;
        mf.setValue("");
        setLatex("");
    };

    return (
        <div className="ml-wrapper">

            <h2 className="ml-title">Your Solution</h2>
            <div className="ml-subtle">Status: {status}</div>

            <div className="ml-card" aria-live="polite">
                <math-field
                    ref={mathfieldRef}
                    className="ml-field"
                    id="answer-field"
                    virtualkeyboardmode="onfocus"
                    smartfence="true"
                    lettershapestyle="tex"
                    placeholder="Type here or use the on-screen math keyboard…"
                ></math-field>

                <div className="ml-toolbar">
                    <div className="ml-switch">
                        <input
                            id="vkToggle"
                            type="checkbox"
                            className="ml-checkbox"
                            onChange={(e) => {
                                const mf = mathfieldRef.current;
                                if (!mf) return;
                                mf.setOptions({ virtualKeyboardMode: e.target.checked ? "onfocus" : "off" });
                            }}
                            defaultChecked
                        />
                        <label htmlFor="vkToggle">On-screen keyboard</label>
                    </div>

                    <div className="ml-controls">
                        <button className="ml-btn ghost" onClick={handleClear}>Clear</button>
                        <button className="ml-btn primary" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>

                {latex && (
                    <div className="ml-output" role="status">
                        <strong>LaTeX:</strong> {latex}
                    </div>
                )}
            </div>
        </div>
    );
}
