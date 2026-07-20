import test from 'node:test';
import assert from 'node:assert/strict';
import { convertLatexToMarkup } from 'mathlive';
import {
    hasBalancedLatexBraces,
    normalizeChatLatexEscapes,
    parseChatLatex,
} from './chatLatex.js';

test('parses common inline and display delimiters', () => {
    const segments = parseChatLatex('Use $x^2$ or \\(x+1\\). Then:\n\\[\\frac{1}{2}\\]\n$$y=3$$');

    assert.deepEqual(
        segments.filter((segment) => segment.type === 'math').map(({ value, display }) => ({ value, display })),
        [
            { value: 'x^2', display: false },
            { value: 'x+1', display: false },
            { value: '\\frac{1}{2}', display: true },
            { value: 'y=3', display: true },
        ],
    );
});

test('keeps multiline display math as one display segment', () => {
    const [segment] = parseChatLatex('$$\\begin{aligned}\nx + y &= 4 \\\\\nx - y &= 2\n\\end{aligned}$$');

    assert.equal(segment.type, 'math');
    assert.equal(segment.display, true);
    assert.match(segment.value, /begin\{aligned\}/);
    assert.match(segment.value, /end\{aligned\}/);
});

test('lets display math provide its own line without duplicate blank rows', () => {
    const segments = parseChatLatex('Before\n\\[x = 4\\]\nAfter');

    assert.deepEqual(segments, [
        { type: 'text', value: 'Before', source: 'Before' },
        { type: 'math', value: 'x = 4', source: '\\[x = 4\\]', display: true },
        { type: 'text', value: 'After', source: 'After' },
    ]);
});

test('recovers conservative bare LaTeX commands', () => {
    const segments = parseChatLatex('Divide by \\frac{2}{3}, then use \\sqrt{9}.');

    assert.deepEqual(
        segments.filter((segment) => segment.type === 'math').map((segment) => segment.value),
        ['\\frac{2}{3}', '\\sqrt{9}'],
    );
});

test('repairs JSON-escaped LaTeX in the reported Sigma response', () => {
    const input = String.raw`You're looking to combine $1 + \\frac{13}{36}$.

To add a whole number and a fraction, it helps to use the same denominator.

How can you write the number $1$ as a fraction with denominator $36$?`;
    const math = parseChatLatex(input)
        .filter((segment) => segment.type === 'math')
        .map(({ value, display }) => ({ value, display }));

    assert.deepEqual(math, [
        { value: '1 + \\frac{13}{36}', display: false },
        { value: '1', display: false },
        { value: '36', display: false },
    ]);

    for (const { value } of math) {
        assert.doesNotMatch(convertLatexToMarkup(value), /ML__error/);
    }
});

test('repairs JSON-escaped inline and display delimiters', () => {
    const input = String.raw`Use \\(x + 1\\), then show:
\\[x = \\frac{3}{4}\\]`;

    assert.deepEqual(
        parseChatLatex(input)
            .filter((segment) => segment.type === 'math')
            .map(({ value, display }) => ({ value, display })),
        [
            { value: 'x + 1', display: false },
            { value: 'x = \\frac{3}{4}', display: true },
        ],
    );
});

test('preserves legitimate LaTeX row breaks while repairing commands', () => {
    const input = String.raw`\[\begin{aligned}x &= 1 \\ y &= \\frac{1}{2}\end{aligned}\]`;
    const normalized = normalizeChatLatexEscapes(input);

    assert.match(normalized, /x &= 1 \\\\ y/);
    assert.match(normalized, /y &= \\frac\{1\}\{2\}/);
});

test('does not consume a row break immediately followed by a command', () => {
    const input = String.raw`\[\begin{aligned}x &= 1 \\\frac{1}{2}\end{aligned}\]`;

    assert.equal(normalizeChatLatexEscapes(input), input);
});

test('does not turn dollar-wrapped prose or escaped currency into math', () => {
    const input = 'Keep $this is plain prose$ and the fee is \\$5.';

    assert.deepEqual(parseChatLatex(input), [{ type: 'text', value: input, source: input }]);
});

test('leaves unmatched delimiters visible instead of dropping content', () => {
    const input = 'Incomplete $x + 1 and \\[y = 2';

    assert.deepEqual(parseChatLatex(input), [{ type: 'text', value: input, source: input }]);
});

test('detects unbalanced LaTeX braces before rendering', () => {
    assert.equal(hasBalancedLatexBraces('\\frac{1}{2}'), true);
    assert.equal(hasBalancedLatexBraces('\\frac{1}{2'), false);
    assert.equal(hasBalancedLatexBraces('x_{1}}'), false);
});
