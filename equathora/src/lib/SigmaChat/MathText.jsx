import React from 'react';
import { convertLatexToMarkup } from 'mathlive';
import 'mathlive/static.css';
import {
    hasBalancedLatexBraces,
    isProseHeavyLatex,
    parseChatLatex,
    stripLatexTextCommands,
} from './chatLatex';

// Math rendering
//
// Splits plain text from common LaTeX delimiters and renders math spans through
// MathLive's static renderer. Only MathLive's own generated
// markup goes through dangerouslySetInnerHTML — plain-text segments stay as
// normal React children, which React escapes automatically, so raw AI/user
// text is never injected as HTML.
//
// Shared by ChatPanel (Sigma follow-up chat) and MathLiveEditor (wrong-step
// AI feedback) so any place that shows AI-authored text renders LaTeX the
// same, already-tested way instead of leaking raw backslash source.

function renderLatexSafe(latex, displayMode) {
    if (!hasBalancedLatexBraces(latex)) return null;

    try {
        const markup = convertLatexToMarkup(latex, {
            mathstyle: displayMode ? 'displaystyle' : 'textstyle',
        });

        return markup && !markup.includes('ML__error') ? markup : null;
    } catch {
        return null;
    }
}

function renderMathSegment(segment, key) {
    if (isProseHeavyLatex(segment.value)) {
        return <span key={key}>{stripLatexTextCommands(segment.value)}</span>;
    }

    const markup = renderLatexSafe(segment.value, segment.display);
    if (!markup) {
        return <span key={key}>{segment.source}</span>;
    }

    const className = segment.display
        ? 'block max-w-full overflow-x-auto py-2 text-center'
        : 'inline-block max-w-full align-middle';

    return (
        <span
            key={key}
            className={className}
            role="math"
            aria-label={segment.value}
            dangerouslySetInnerHTML={{ __html: markup }}
        />
    );
}

export function MathText({ text }) {
    return (
        <>
            {parseChatLatex(text).map((segment, index) =>
                segment.type === 'math'
                    ? renderMathSegment(segment, index)
                    : <span key={index}>{segment.value}</span>
            )}
        </>
    );
}

export default MathText;