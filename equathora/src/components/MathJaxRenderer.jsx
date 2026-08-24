import React, { useEffect, useRef } from 'react';
function isLikelySingleDollarMath(inner) {
    const value = inner.trim();
    if (!value) return false;

    const hasLatexCommand = /\\[A-Za-z]+/.test(value);
    const hasOperatorOrStructure = /[=+\-*/^_{}<>]/.test(value);
    const isSingleSymbol = /^[A-Za-z]$/.test(value);
    // A single bare number with nothing else ("1", "36", "3.5") is treated as
    // math - the dominant case for problem descriptions in this app.
    const isSingleNumericToken = /^-?\d+(?:[.,]\d+)?%?$/.test(value);

    // Reject prose spanning two unrelated $ tokens, e.g. "5 and" from
    // "between $5 and $10" - plain words/numbers with no math signal at all.
    const isMultiWordProseSpan = /^[A-Za-z0-9.,]+(?:\s+[A-Za-z0-9.,]+)+$/.test(value)
        && !hasLatexCommand && !hasOperatorOrStructure;
    if (isMultiWordProseSpan) return false;

    return isSingleSymbol || isSingleNumericToken || hasLatexCommand || hasOperatorOrStructure;
}

function findUnescapedDollar(text, fromIndex) {
    let idx = fromIndex;
    while (true) {
        idx = text.indexOf('$', idx);
        if (idx === -1) return -1;
        if (text[idx - 1] === '\\') {
            idx += 1;
            continue;
        }
        return idx;
    }
}

function convertSingleDollarPairs(text) {
    let result = '';
    let cursor = 0;

    while (cursor < text.length) {
        const openIdx = findUnescapedDollar(text, cursor);
        if (openIdx === -1) {
            result += text.slice(cursor);
            break;
        }

        // Copy anything before the opening $ (including any escaped \$ we skipped past)
        result += text.slice(cursor, openIdx);

        const closeIdx = findUnescapedDollar(text, openIdx + 1);
        if (closeIdx === -1) {
            // No matching close leave the rest of the text untouched.
            result += text.slice(openIdx);
            break;
        }

        const inner = text.slice(openIdx + 1, closeIdx);

        if (inner.includes('\n') || !isLikelySingleDollarMath(inner)) {
            result += text[openIdx];
            cursor = openIdx + 1;
            continue;
        }

        result += '\\(' + inner + '\\)';
        cursor = closeIdx + 1;
    }

    return result;
}

const MathJaxRenderer = ({ content, className = '', as = 'div' }) => {
    const containerRef = useRef(null);
    const Component = as;

    useEffect(() => {
        if (!containerRef.current || !content) return;

        let cancelled = false;

        // Normalize display math to inline to avoid forced line breaks in prose,
        // then recover bare single-dollar math spans into \( \) so rendering
        // never depends on whether the page's MathJax config enabled $ ... $.
        const processed = convertSingleDollarPairs(
            String(content)
                .replace(/\\\[([\s\S]*?)\\\]/g, '\\($1\\)')
                .replace(/\$\$([\s\S]*?)\$\$/g, '\\($1\\)')
        );

        // Clear previous MathJax output before re-render
        if (window.MathJax?.typesetClear) {
            window.MathJax.typesetClear([containerRef.current]);
        }

        containerRef.current.textContent = processed;

        const run = async () => {
            if (cancelled) return;
            if (window.MathJax?.typesetPromise) {
                try {
                    await window.MathJax.typesetPromise([containerRef.current]);
                } catch (err) {
                    if (!cancelled) console.error('MathJax typeset error:', err);
                }
            }
        };

        run();

        return () => { cancelled = true; };
    }, [content]);

    const cls = ['mathjax-renderer', className].filter(Boolean).join(' ');
    return <Component ref={containerRef} className={cls} />;
};

export default MathJaxRenderer;