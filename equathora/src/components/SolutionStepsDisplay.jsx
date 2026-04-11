import React, { useEffect, useRef } from 'react';

/**
 * SolutionStepsDisplay — renders solution text as numbered steps
 * with MathJax for LaTeX and Tailwind CSS styling.
 *
 * For each step:
 *  - Explanation text (plain words) → small label above the step box
 *  - Math content ($...$) → rendered inside the step box via MathJax
 */

/* ─── helpers ──────────────────────────────────────────────── */

/** Temporarily hide $...$ and $$...$$ blocks so splitters don't break them */
const protectLatex = (text) => {
    const blocks = [];
    const replaced = text
        .replace(/\$\$[^$]+\$\$/g, (m) => { blocks.push(m); return `⌈${blocks.length - 1}⌉`; })
        .replace(/\$[^$]+\$/g, (m) => { blocks.push(m); return `⌈${blocks.length - 1}⌉`; });
    return { replaced, blocks };
};

const restoreLatex = (text, blocks) =>
    text.replace(/⌈(\d+)⌉/g, (_, i) => blocks[+i]);

/** Split a solution string into individual step strings */
const parseSolutionIntoSteps = (solution) => {
    if (!solution) return [];

    // 1. "Step N:" / "Step N." explicit markers
    if (/(?:^|\n)\s*Step\s*\d+[\s.:)\-]+/i.test(solution)) {
        return solution
            .split(/\n?\s*Step\s*\d+[\s.:)\-]+/i)
            .map((s) => s.trim())
            .filter(Boolean);
    }

    // 2. Newline-separated
    const lines = solution.split(/\n+/).map((s) => s.trim()).filter(Boolean);
    if (lines.length > 1) return lines;

    // 3. Protect LaTeX, then split on ". " or "; "
    const { replaced, blocks } = protectLatex(solution);
    const parts = replaced
        .split(/(?:\.\s+|;\s+)/)
        .map((s) => restoreLatex(s, blocks).trim())
        .filter(Boolean);

    if (parts.length > 1) return parts;

    // 4. Single step
    return [solution.trim()];
};

/**
 * For a single step string, separate explanation text from math.
 *
 * Returns { explanation: string|null, math: string|null }
 *
 * Patterns handled:
 *   "Pair1: $a + b = c$"           → explanation="Pair1", math="$a + b = c$"
 *   "Add $x$ gives $y$"            → explanation="Add … gives", math="$x$ … $y$"
 *   "$x^2 = 4 \Rightarrow x = 2$"  → explanation=null, math (full)
 *   "Apply inclusion-exclusion..."  → explanation (full), math=null
 */
const separateTextAndMath = (step) => {
    const hasMath = /\$[^$]+\$/.test(step);

    if (!hasMath) {
        // Entire step is text – treat it as explanation only
        return { explanation: step, math: null };
    }

    // Extract all text segments (outside $...$)
    const textParts = step.split(/\$[^$]+\$/).map((t) => t.trim()).filter(Boolean);
    // Strip trailing/leading punctuation noise from text parts
    const cleanText = textParts
        .map((t) => t.replace(/^[.:;,\-–—]+\s*/, '').replace(/\s*[.:;,\-–—]+$/, ''))
        .filter(Boolean);

    const explanation = cleanText.length > 0 ? cleanText.join(' … ') : null;

    // The whole step (including $...$) is the math content for MathJax to render
    return { explanation, math: step };
};

/* ─── component ────────────────────────────────────────────── */

const SolutionStepsDisplay = ({ solution }) => {
    const containerRef = useRef(null);
    const steps = parseSolutionIntoSteps(solution);

    useEffect(() => {
        if (!containerRef.current) return;
        const typesetMath = async () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                try {
                    // Clear previous typeset so MathJax re-processes
                    window.MathJax.typesetClear?.([containerRef.current]);
                    await window.MathJax.typesetPromise([containerRef.current]);
                } catch (err) {
                    console.error('MathJax typeset error:', err);
                }
            }
        };
        const id = setTimeout(typesetMath, 60);
        return () => clearTimeout(id);
    }, [solution]);

    if (!solution) {
        return (
            <div className="w-full font-[Sansation,sans-serif] p-4 text-sm text-[var(--secondary-color)] opacity-70">
                Solution will be available soon.
            </div>
        );
    }

    const parsed = steps.map(separateTextAndMath);

    return (
        <div
            ref={containerRef}
            className="mathjax-renderer flex w-full flex-col overflow-hidden rounded-md bg-[var(--main-color)] font-[Sansation,sans-serif]"
        >
            <div className="flex flex-1 flex-col overflow-hidden py-2">
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col gap-3">
                        {parsed.map(({ explanation, math }, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                {/* Explanation label on top */}
                                {explanation && (
                                    <span className="text-xs font-semibold text-[var(--mid-main-secondary)] pl-1">
                                        {explanation}
                                    </span>
                                )}

                                {/* Math content box — rendered by MathJax */}
                                {math && (
                                    <div
                                        className="rounded-md border-2 border-[var(--french-gray)] bg-white px-3 py-2 text-[clamp(14px,2vw,18px)] leading-relaxed text-[var(--secondary-color)] overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: math }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolutionStepsDisplay;
