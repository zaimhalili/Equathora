const BARE_LATEX_TOKEN_REGEX = /\\(?:dfrac|tfrac|frac)\s*\{[^{}\n]*\}\s*\{[^{}\n]*\}|\\sqrt\s*\{[^{}\n]*\}|\\(?:cdot|times|leq|geq|neq|pm|approx|infty|sum|int|alpha|beta|gamma|delta|theta|pi|sin|cos|tan|log|ln|therefore)\b/g;

const DELIMITERS = [
    { open: '$$', close: '$$', display: true, dollar: true },
    { open: '\\[', close: '\\]', display: true, dollar: false },
    { open: '\\(', close: '\\)', display: false, dollar: false },
    { open: '$', close: '$', display: false, dollar: true },
];

function isEscaped(text, index) {
    let slashCount = 0;
    for (let cursor = index - 1; cursor >= 0 && text[cursor] === '\\'; cursor -= 1) {
        slashCount += 1;
    }
    return slashCount % 2 === 1;
}

function findClosingDelimiter(text, start, delimiter) {
    for (let cursor = start; cursor <= text.length - delimiter.close.length; cursor += 1) {
        if (!delimiter.display && text[cursor] === '\n') {
            return -1;
        }

        if (text.startsWith(delimiter.close, cursor) && !isEscaped(text, cursor)) {
            return cursor;
        }
    }
    return -1;
}

function isLikelyDollarMath(latex) {
    const value = latex.trim();
    if (!value) return false;

    const hasStrongMathSignal = /\\[A-Za-z]+|[=+\-*/^_{}<>]|\d/.test(value);
    const isSingleSymbol = /^[A-Za-z]$/.test(value);
    const hasMultiplePlainWords = /^[A-Za-z]+(?:\s+[A-Za-z]+)+[.!?]?$/.test(value);

    return isSingleSymbol || hasStrongMathSignal || !hasMultiplePlainWords;
}

function appendSegment(segments, segment) {
    if (!segment.value) return;

    const previous = segments.at(-1);
    if (segment.type === 'text' && previous?.type === 'text') {
        previous.value += segment.value;
        previous.source += segment.source;
        return;
    }

    segments.push(segment);
}

function splitBareLatex(segment) {
    const parts = [];
    let cursor = 0;

    for (const match of segment.value.matchAll(BARE_LATEX_TOKEN_REGEX)) {
        const matchIndex = match.index ?? 0;
        appendSegment(parts, {
            type: 'text',
            value: segment.value.slice(cursor, matchIndex),
            source: segment.value.slice(cursor, matchIndex),
        });
        appendSegment(parts, {
            type: 'math',
            value: match[0],
            source: match[0],
            display: false,
        });
        cursor = matchIndex + match[0].length;
    }

    appendSegment(parts, {
        type: 'text',
        value: segment.value.slice(cursor),
        source: segment.value.slice(cursor),
    });

    return parts;
}

/**
 * Split tutor copy into escaped text and explicit math spans. Dollar-delimited
 * prose is left alone, while MathLive-friendly bare commands such as
 * `\\frac{1}{2}` are recovered conservatively.
 */
export function parseChatLatex(input) {
    const text = String(input ?? '');
    const segments = [];
    let plainStart = 0;
    let cursor = 0;

    while (cursor < text.length) {
        const delimiter = DELIMITERS.find(({ open }) =>
            text.startsWith(open, cursor) && !isEscaped(text, cursor)
        );

        if (!delimiter) {
            cursor += 1;
            continue;
        }

        const contentStart = cursor + delimiter.open.length;
        const closingIndex = findClosingDelimiter(text, contentStart, delimiter);
        if (closingIndex === -1) {
            cursor += delimiter.open.length;
            continue;
        }

        const latex = text.slice(contentStart, closingIndex).trim();
        if (delimiter.dollar && !isLikelyDollarMath(latex)) {
            cursor += delimiter.open.length;
            continue;
        }

        const plainEnd = delimiter.display && text[cursor - 1] === '\n'
            ? cursor - 1
            : cursor;

        appendSegment(segments, {
            type: 'text',
            value: text.slice(plainStart, plainEnd),
            source: text.slice(plainStart, plainEnd),
        });
        appendSegment(segments, {
            type: 'math',
            value: latex,
            source: text.slice(cursor, closingIndex + delimiter.close.length),
            display: delimiter.display,
        });

        cursor = closingIndex + delimiter.close.length;
        if (delimiter.display && text[cursor] === '\n') {
            cursor += 1;
        }
        plainStart = cursor;
    }

    appendSegment(segments, {
        type: 'text',
        value: text.slice(plainStart),
        source: text.slice(plainStart),
    });

    return segments.flatMap((segment) =>
        segment.type === 'text' ? splitBareLatex(segment) : segment
    );
}

export function isProseHeavyLatex(latex) {
    const textSpans = latex.match(/\\text\{[^{}]*\}/g) || [];
    const textCharCount = textSpans.reduce((sum, span) => sum + span.length, 0);
    const looksLikeSentence = /[.!?]\s*(\\text\{)?[A-Z]/.test(latex)
        || /\\text\{[^{}]{25,}\}/.test(latex);

    return looksLikeSentence && textCharCount > latex.length * 0.4;
}

export function stripLatexTextCommands(latex) {
    return latex.replace(/\\text\{([^{}]*)\}/g, '$1');
}

export function hasBalancedLatexBraces(latex) {
    let depth = 0;

    for (let index = 0; index < latex.length; index += 1) {
        if (isEscaped(latex, index)) continue;
        if (latex[index] === '{') depth += 1;
        if (latex[index] === '}') depth -= 1;
        if (depth < 0) return false;
    }

    return depth === 0;
}
