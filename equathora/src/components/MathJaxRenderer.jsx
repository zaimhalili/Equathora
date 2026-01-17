import React, { useEffect, useRef } from 'react';

/**
 * MathJaxRenderer - Renders text with LaTeX equations using MathJax
 * Automatically wraps mathematical expressions in $ delimiters
 */
const MathJaxRenderer = ({ content, className = '', as = 'div' }) => {
    const containerRef = useRef(null);
    const Component = as;

    /**
     * Comprehensive auto-wrap for mathematical expressions
     * Handles: exponents, parenthetical expressions, fractions, variables, etc.
     */
    const autoWrapMath = (text) => {
        if (!text) return text;

        // Normalize whitespace and invisible characters
        let clean = text.replace(/\u00A0/g, ' ').replace(/[\t\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

        // If user already included delimiters or MathJax markers, leave as-is
        if (/\$[^$]+\$|\\\(|\\\[/.test(clean)) return clean;

        // Quick check for math-like content. If not present, skip.
        const hasMathPatterns = /[a-zA-Z]\^|\d[a-zA-Z]|[a-zA-Z]\d|[+\-*/=].*[a-zA-Z]|[a-zA-Z].*[+\-*/=]|\([^)]*[a-zA-Z][^)]*\)/i.test(clean);
        if (!hasMathPatterns) return clean;

        // Wrap parenthetical mathematical expressions first
        clean = clean.replace(/\(([^()]+)\)/g, (match, inner) => {
            if (/[a-zA-Z].*[+\-*/^]|[+\-*/^].*[a-zA-Z]|[a-zA-Z]\^|\d[a-zA-Z]|[a-zA-Z]\d|\./i.test(inner)) {
                return `$(${inner})$`;
            }
            return match;
        });

        // Wrap exponent expressions (x^2, x^{10})
        clean = clean.replace(/(?<!\$)\b([a-zA-Z])\^\{?(\d+)\}?/g, (m, base, exp) => `$${base}^${exp}$`);

        // Wrap coefficient-variable tokens like 2x, 0.5xy
        clean = clean.replace(/(?<!\$)\b(\d+(?:\.\d+)?)([a-zA-Z]{1,4})\b/g, (m, coef, vars) => `$${coef}${vars}$`);

        // Wrap isolated variable sequences with operators (a + b, x - 3)
        clean = clean.replace(/(?<!\$)\b([a-zA-Z](?:[a-zA-Z0-9]*))(?:\s*[+\-*/=]\s*[a-zA-Z0-9(){}^.+-]+)+/g, (m) => `$${m}$`);

        // Merge adjacent $...$ tokens with operators into a single $...$ block
        let prev = '';
        while (prev !== clean) {
            prev = clean;
            clean = clean.replace(/\$([^$]+)\$\s*([+\-*/])\s*\$([^$]+)\$/g, '$$$1 $2 $3$$');
        }

        // If result still looks broken (e.g., "and ." near keywords), log for manual review in dev
        if (typeof window !== 'undefined' && window.location && window.location.hostname.includes('localhost')) {
            if (/\b(and|sum of|subtract the sum of|take|then)\b\s*\./i.test(clean) || /\band\s+\./i.test(clean)) {
                console.warn('MathJaxRenderer: possible missing math content:', { original: text, processed: clean });
            }
        }

        return clean;
    };

    useEffect(() => {
        if (!containerRef.current || !content) return;

        const processedContent = autoWrapMath(content);
        containerRef.current.textContent = processedContent;

        const typesetMath = async () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                try {
                    await window.MathJax.typesetPromise([containerRef.current]);
                } catch (err) {
                    console.error('MathJax typeset error:', err);
                }
            }
        };

        typesetMath();
    }, [content]);

    return <Component ref={containerRef} className={className} />;
};

export default MathJaxRenderer;
