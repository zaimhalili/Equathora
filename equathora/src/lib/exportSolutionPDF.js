import jsPDF from 'jspdf';

async function imageToBase64(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        return null;
    }
}

function formatDate(date) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Universal LaTeX Lexer:
 * Handles raw text inside \text{...}, inline math ($...$), and \begin{vmatrix} environments.
 */
function parseUniversalLatex(latexStr) {
    if (!latexStr) return [];

    // Remove wrapping $ if present at start and end
    let cleanStr = latexStr.trim();
    if (cleanStr.startsWith('$') && cleanStr.endsWith('$')) {
        cleanStr = cleanStr.slice(1, -1).trim();
    }

    const tokens = [];
    // Tokenizer pattern: catches \text{...}, \begin{env}...\end{env}, or remaining raw text
    const regex = /(\\text\{[^}]*\}|\\begin\{(?:vmatrix|bmatrix|matrix)\}[\s\S]*?\\end\{(?:vmatrix|bmatrix|matrix)\})/g;

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanStr)) !== null) {
        if (match.index > lastIndex) {
            const leftover = cleanStr.substring(lastIndex, match.index);
            if (leftover.trim()) {
                tokens.push({ type: 'text', content: cleanMathSymbols(leftover) });
            }
        }

        const matchedStr = match[0];

        if (matchedStr.startsWith('\\text{')) {
            // Unpack \text{...} wrapper
            const textContent = matchedStr.replace(/^\\text\{/, '').replace(/\}$/, '');
            tokens.push({ type: 'text', content: textContent });
        } else if (matchedStr.startsWith('\\begin{')) {
            // Parse Matrix
            const envMatch = matchedStr.match(/\\begin\{(vmatrix|bmatrix|matrix)\}([\s\S]*?)\\end\{\1\}/);
            if (envMatch) {
                const envType = envMatch[1];
                const body = envMatch[2];
                const rows = body
                    .split('\\\\')
                    .map(r => r.split('&').map(cell => cleanMathSymbols(cell)))
                    .filter(r => r.some(c => c.length > 0));

                tokens.push({ type: 'matrix', env: envType, rows });
            }
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < cleanStr.length) {
        const leftover = cleanStr.substring(lastIndex);
        if (leftover.trim()) {
            tokens.push({ type: 'text', content: cleanMathSymbols(leftover) });
        }
    }

    return tokens;
}

function cleanMathSymbols(str) {
    if (!str) return '';
    return str
        .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
        .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
        .replace(/\\cdot/g, '·')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\pm/g, '±')
        .replace(/\\leq/g, '≤')
        .replace(/\\geq/g, '≥')
        .replace(/\\neq/g, '≠')
        .replace(/\\infty/g, '∞')
        .replace(/[\$\{\}]/g, '')
        .replace(/\\/g, '')
        .trim();
}

/**
 * Typesetting Engine: Renders tokens inline with MS Word style vector matrix brackets
 */
function renderTypesetContent(doc, tokens, startX, startY, maxW, colors) {
    let cursorX = startX;
    let cursorY = startY;

    const CELL_PADDING_X = 10;
    const ROW_HEIGHT = 14;
    const FONT_SIZE = 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(FONT_SIZE);

    // Pre-calculate total matrix heights to adjust line baseline
    let maxMatrixHeight = 0;
    tokens.forEach(t => {
        if (t.type === 'matrix') {
            const h = t.rows.length * ROW_HEIGHT;
            if (h > maxMatrixHeight) maxMatrixHeight = h;
        }
    });

    const baseLineY = maxMatrixHeight > 0 ? cursorY + maxMatrixHeight / 2 : cursorY;

    tokens.forEach(token => {
        if (token.type === 'text') {
            if (!token.content) return;

            const words = token.content.split(' ');
            words.forEach((word) => {
                const wordW = doc.getTextWidth(word + ' ');

                if (cursorX + wordW > startX + maxW) {
                    cursorX = startX;
                    cursorY += (maxMatrixHeight > 0 ? maxMatrixHeight : 16) + 6;
                    maxMatrixHeight = 0;
                }

                doc.setTextColor(...colors.dark);
                doc.text(word + ' ', cursorX, baseLineY);
                cursorX += wordW;
            });
        } else if (token.type === 'matrix') {
            const rows = token.rows;
            if (rows.length === 0) return;

            const numCols = Math.max(...rows.map(r => r.length));
            const colWidths = new Array(numCols).fill(0);

            rows.forEach(row => {
                row.forEach((cell, colIdx) => {
                    const cellW = doc.getTextWidth(cell);
                    if (cellW > colWidths[colIdx]) colWidths[colIdx] = cellW;
                });
            });

            const matrixWidth = colWidths.reduce((a, b) => a + b, 0) + (numCols - 1) * CELL_PADDING_X + 16;
            const matrixHeight = rows.length * ROW_HEIGHT;

            if (cursorX + matrixWidth > startX + maxW) {
                cursorX = startX;
                cursorY += matrixHeight + 8;
            }

            const topY = baseLineY - matrixHeight / 2 - 2;
            const bottomY = topY + matrixHeight + 4;
            const leftX = cursorX + 2;
            const rightX = cursorX + matrixWidth - 2;

            // Draw MS Word Determinant / Matrix Vertical Bars
            doc.setDrawColor(...colors.dark);
            doc.setLineWidth(1.1);

            if (token.env === 'vmatrix') {
                // Determinant |A| vertical lines
                doc.line(leftX, topY, leftX, bottomY);
                doc.line(rightX, topY, rightX, bottomY);
            } else {
                // Bracket [A] corners
                doc.line(leftX, topY, leftX, bottomY);
                doc.line(leftX, topY, leftX + 3, topY);
                doc.line(leftX, bottomY, leftX + 3, bottomY);

                doc.line(rightX, topY, rightX, bottomY);
                doc.line(rightX, topY, rightX - 3, topY);
                doc.line(rightX, bottomY, rightX - 3, bottomY);
            }

            // Render Matrix Elements Centered
            let cellY = topY + ROW_HEIGHT - 2;
            rows.forEach(row => {
                let cellX = leftX + 6;
                row.forEach((cell, colIdx) => {
                    const cellW = doc.getTextWidth(cell);
                    const colW = colWidths[colIdx];
                    const offsetX = (colW - cellW) / 2;

                    doc.setTextColor(...colors.dark);
                    doc.text(cell, cellX + offsetX, cellY);
                    cellX += colW + CELL_PADDING_X;
                });
                cellY += ROW_HEIGHT;
            });

            cursorX += matrixWidth + 6;
        }
    });

    return cursorY + (maxMatrixHeight > 0 ? maxMatrixHeight : 16);
}

export async function exportSolutionPDF({
    problemTitle = 'Untitled Problem',
    problemDescription = '',
    difficulty = '',
    topics = [],
    fields = [],
    isCorrect = false,
    studentName = 'Student',
    logoUrl = null,
}) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    const PAGE_W = doc.internal.pageSize.getWidth();
    const PAGE_H = doc.internal.pageSize.getHeight();
    const MARGIN = 48;
    const CONTENT_W = PAGE_W - MARGIN * 2;

    const COLORS = {
        brand: [220, 120, 20],
        dark: [30, 30, 40],
        mid: [90, 90, 110],
        light: [245, 245, 248],
        border: [220, 220, 228],
        green: [22, 163, 74],
        red: [220, 38, 38],
        white: [255, 255, 255],
    };

    let y = 0;

    const setColor = (color) => doc.setTextColor(...color);
    const setFill = (color) => doc.setFillColor(...color);
    const setDraw = (color) => doc.setDrawColor(...color);

    const text = (str, x, cy, opts = {}) => {
        doc.text(String(str), x, cy, opts);
    };

    const checkPage = (needed = 60) => {
        if (y + needed > PAGE_H - MARGIN) {
            doc.addPage();
            y = MARGIN + 20;
        }
    };

    // HEADER BAND
    setFill(COLORS.light);
    doc.rect(0, 0, PAGE_W, 72, 'F');

    if (logoUrl) {
        try {
            const b64 = await imageToBase64(logoUrl);
            if (b64) doc.addImage(b64, 'PNG', MARGIN, 16, 120, 38);
        } catch {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            setColor(COLORS.brand);
            text('Equathora', MARGIN, 46);
        }
    } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        setColor(COLORS.brand);
        text('Equathora', MARGIN, 46);
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(COLORS.dark);
    text(formatDate(new Date()), PAGE_W - MARGIN, 30, { align: 'right' });
    text('equathora.com', PAGE_W - MARGIN, 44, { align: 'right' });

    y = 96;

    // TITLE + META
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    setColor(COLORS.dark);
    text(problemTitle, MARGIN, y);
    y += 24;

    if (difficulty || topics.length > 0) {
        const diffColor =
            difficulty?.toLowerCase() === 'easy'
                ? COLORS.green
                : difficulty?.toLowerCase() === 'medium'
                    ? [161, 98, 7]
                    : difficulty?.toLowerCase() === 'hard'
                        ? COLORS.red
                        : COLORS.mid;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        if (difficulty) {
            setFill(diffColor);
            const dw = doc.getTextWidth(difficulty.toUpperCase()) + 12;
            doc.roundedRect(MARGIN, y, dw, 14, 3, 3, 'F');
            setColor(COLORS.white);
            text(difficulty.toUpperCase(), MARGIN + 6, y + 9.5);
        }

        if (topics.length > 0) {
            let tx = MARGIN + (difficulty ? doc.getTextWidth(difficulty.toUpperCase()) + 20 : 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            setColor(COLORS.mid);
            text(topics.slice(0, 4).join('  /  '), tx, y + 9.5);
        }
        y += 15;
    }

    setDraw(COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 16;

    // PROBLEM DESCRIPTION
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(COLORS.mid);
    text('PROBLEM', MARGIN, y);
    y += 16;

    const descTokens = parseUniversalLatex(problemDescription);
    y = renderTypesetContent(doc, descTokens, MARGIN, y, CONTENT_W, COLORS);
    y += 24;

    // SOLUTION STEPS
    checkPage(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(COLORS.mid);
    text('SOLUTION STEPS', MARGIN, y);
    y += 16;

    const nonEmpty = fields.filter((f) => f.latex && f.latex.trim() !== '');

    if (nonEmpty.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        setColor(COLORS.mid);
        text('No steps were recorded.', MARGIN, y);
        y += 20;
    } else {
        nonEmpty.forEach((field, i) => {
            checkPage(60);

            const stepNum = i + 1;
            const stepTokens = parseUniversalLatex(field.latex);
            const isLast = i === nonEmpty.length - 1;

            const hasMatrix = stepTokens.some((t) => t.type === 'matrix');
            const rowH = hasMatrix
                ? Math.max(50, stepTokens.find((t) => t.type === 'matrix').rows.length * 14 + 20)
                : 36;

            setFill(i % 2 === 0 ? COLORS.light : COLORS.white);
            setDraw(COLORS.border);
            doc.setLineWidth(0.4);
            doc.roundedRect(MARGIN, y, CONTENT_W, rowH, 4, 4, 'FD');

            const badgeColor = isLast && isCorrect ? COLORS.green : isLast && !isCorrect ? COLORS.red : COLORS.brand;
            setFill(badgeColor);
            doc.circle(MARGIN + 18, y + rowH / 2, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            setColor(COLORS.white);
            text(String(stepNum), MARGIN + 18, y + rowH / 2 + 3.5, { align: 'center' });

            renderTypesetContent(doc, stepTokens, MARGIN + 36, y + (hasMatrix ? 12 : rowH / 2 - 5), CONTENT_W - 50, COLORS);

            y += rowH + 8;
        });
    }

    y += 8;

    // RESULT BADGE
    checkPage(56);
    const badgeBg = isCorrect ? [220, 252, 231] : [254, 226, 226];
    const badgeBdr = isCorrect ? COLORS.green : COLORS.red;
    const badgeTxt = isCorrect
        ? 'Solution Accepted  -  All steps verified by Equathora'
        : 'Solution Incorrect  -  Review your steps and try again';

    setFill(badgeBg);
    setDraw(badgeBdr);
    doc.setLineWidth(1);
    doc.roundedRect(MARGIN, y, CONTENT_W, 36, 5, 5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(badgeBdr);
    text(badgeTxt, MARGIN + 14, y + 22);
    y += 50;

    // VERIFICATION BLOCK
    if (isCorrect) {
        checkPage(80);
        setFill(COLORS.light);
        setDraw(COLORS.border);
        doc.setLineWidth(0.5);
        doc.roundedRect(MARGIN, y, CONTENT_W, 64, 5, 5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        setColor(COLORS.brand);
        text('Equathora Verification Badge', MARGIN + 14, y + 18);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        setColor(COLORS.dark);
        text(`This document certifies that ${studentName} completed "${problemTitle}"`, MARGIN + 14, y + 34);
        text(`with a fully verified step-by-step solution on ${formatDate(new Date())}.`, MARGIN + 14, y + 47);
        text('Verified by the Equathora Engine  |  equathora.com', MARGIN + 14, y + 59);

        y += 78;
    }

    // FOOTER
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        setFill(COLORS.dark);
        doc.rect(0, PAGE_H - 32, PAGE_W, 32, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        setColor(COLORS.border);
        text('Generated by Equathora  |  equathora.com', MARGIN, PAGE_H - 13);
        text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 13, { align: 'right' });
    }

    const safeName = problemTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    doc.save(`Equathora_${safeName}.pdf`);
}