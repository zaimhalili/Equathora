import React, { useEffect, useRef } from 'react';

/**
 * MathJaxRenderer - Renders text with LaTeX equations using MathJax
 * @param {string} content - Text content with LaTeX equations (e.g., "Solve $x^2 + 5x + 6 = 0$")
 * @param {string} className - Optional CSS classes to apply
 * @param {string} as - HTML element to use (default: 'div')
 */
const MathJaxRenderer = ({ content, className = '', as = 'div' }) => {
  const containerRef = useRef(null);
  const Component = as;

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // Set the content
    containerRef.current.textContent = content;

    // Typeset math expressions with MathJax
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
