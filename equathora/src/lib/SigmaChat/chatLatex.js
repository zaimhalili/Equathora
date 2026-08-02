const BARE_LATEX_TOKEN_REGEX = /\\(?:dfrac|tfrac|frac)\s*\{[^{}\n]*\}\s*\{[^{}\n]*\}|\\sqrt\s*\{[^{}\n]*\}|\\(?:cdot|times|leq|geq|neq|pm|approx|infty|sum|int|alpha|beta|gamma|delta|theta|pi|sin|cos|tan|log|ln|therefore)\b/g;

// Recovers whole LaTeX *environments* (matrices, systems, cases, aligned blocks)
// that the model emitted without wrapping them in \[ \] or \( \). These are
// always rendered as display math since they're inherently block-shaped.
const BARE_ENV_REGEX = /\\begin\{(matrix|pmatrix|bmatrix|vmatrix|Vmatrix|cases|array|aligned|align\*?|gather\*?|systeme)\}[\s\S]*?\\end\{\1\}/g;

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

// Tightened: a bare digit on its own (e.g. a plain price like "$5") is NOT
// treated as math anymore. Requires an actual LaTeX command, a math operator/
// structural character, or a single bare symbol (e.g. "$x$"). This is what
// stops "between $5 and $10" from being misread as a math delimiter pair that
// swallows the dollar signs and mangles the sentence.
function isLikelyDollarMath(latex) {
    const value = latex.trim();
    if (!value) return false;

    const hasLatexCommand = /\\[A-Za-z]+/.test(value);
    const hasOperatorOrStructure = /[=+\-*/^_{}<>]/.test(value);
    const isSingleSymbol = /^[A-Za-z]$/.test(value);
    // A single bare number with nothing else ("1", "36", "3.5") is treated as
    // math — this is the dominant case in a math-tutoring context, e.g.
    // "expressing $1$ as a fraction with a denominator of $36$".
    const isSingleNumericToken = /^-?\d+(?:[.,]\d+)?%?$/.test(value);

    // Reject obvious prose spanning two unrelated $ tokens, e.g. "5 and" from
    // "between $5 and $10" — multiple plain words with no math signal at all.
    const isMultiWordProseSpan = /^[A-Za-z0-9.,]+(?:\s+[A-Za-z0-9.,]+)+$/.test(value)
        && !hasLatexCommand && !hasOperatorOrStructure;
    if (isMultiWordProseSpan) return false;

    return isSingleSymbol || isSingleNumericToken || hasLatexCommand || hasOperatorOrStructure;
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

// Recovers bare LaTeX environments (matrices, cases, systems) left
// undelimited by the model. Always emitted as display math.
function splitBareEnvironments(segment) {
    const parts = [];
    let cursor = 0;

    for (const match of segment.value.matchAll(BARE_ENV_REGEX)) {
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
            display: true,
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
 * `\\frac{1}{2}` and bare environments such as `\\begin{bmatrix}...\\end{bmatrix}`
 * are recovered conservatively.
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

    return segments
        .flatMap((segment) => (segment.type === 'text' ? splitBareEnvironments(segment) : segment))
        .flatMap((segment) => (segment.type === 'text' ? splitBareLatex(segment) : segment));
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

// Truncates an AI response to maxChars without ever cutting off in the
// middle of an open math delimiter or environment — which previously could
// leave a dangling "\[" or "\begin{bmatrix}" with no closing counterpart,
// causing the parser to give up and show raw LaTeX source to the student.
const TRUNCATION_DELIMITER_PAIRS = [
    ['$$', '$$'],
    ['\\[', '\\]'],
    ['\\(', '\\)'],
];

export function truncateAiResponseSafely(text, maxChars) {
    const value = String(text ?? '');
    if (value.length <= maxChars) return value;

    let cut = value.slice(0, maxChars);

    for (const [open, close] of TRUNCATION_DELIMITER_PAIRS) {
        let searchFrom = 0;
        while (true) {
            const openIdx = cut.indexOf(open, searchFrom);
            if (openIdx === -1) break;
            const closeIdx = cut.indexOf(close, openIdx + open.length);
            if (closeIdx === -1) {
                cut = cut.slice(0, openIdx);
                break;
            }
            searchFrom = closeIdx + close.length;
        }
    }

    for (const match of cut.matchAll(/\\begin\{([a-zA-Z*]+)\}/g)) {
        const envName = match[1];
        const endToken = `\\end{${envName}}`;
        const searchStart = (match.index ?? 0) + match[0].length;
        if (!cut.slice(searchStart).includes(endToken)) {
            cut = cut.slice(0, match.index);
            break;
        }
    }

    cut = cut.trimEnd();
    return cut.length < value.length ? `${cut}…` : cut;
}