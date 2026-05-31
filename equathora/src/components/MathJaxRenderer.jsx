import React, { useEffect, useRef } from 'react';

const MathJaxRenderer = ({ content, className = '', as = 'div' }) => {
    const containerRef = useRef(null);
    const Component = as;

    useEffect(() => {
        if (!containerRef.current || !content) return;

        let cancelled = false;

        // Normalize display math to inline to avoid forced line breaks in prose
        const processed = String(content)
            .replace(/\\\[([\s\S]*?)\\\]/g, '\\($1\\)')
            .replace(/\$\$([\s\S]*?)\$\$/g, '\\($1\\)');

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