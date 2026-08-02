import test from 'node:test';
import assert from 'node:assert/strict';
import {
    hasBalancedLatexBraces,
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
