import jsPDF from 'jspdf';

// Converts an image URL/path to base64 for embedding in PDF
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

// Strips LaTeX commands to produce readable plain text for the PDF
// We do not use em dashes anywhere in this output
function latexToReadable(latex) {
    if (!latex) return '';
    return latex
        .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
        .replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)')
        .replace(/\\left\(/g, '(')
        .replace(/\\right\)/g, ')')
        .replace(/\\left\[/g, '[')
        .replace(/\\right\]/g, ']')
        .replace(/\\cdot/g, ' * ')
        .replace(/\\times/g, ' x ')
        .replace(/\\div/g, ' / ')
        .replace(/\\pm/g, '+/-')
        .replace(/\\leq/g, '<=')
        .replace(/\\geq/g, '>=')
        .replace(/\\neq/g, '!=')
        .replace(/\\infty/g, 'infinity')
        .replace(/\\alpha/g, 'alpha')
        .replace(/\\beta/g, 'beta')
        .replace(/\\gamma/g, 'gamma')
        .replace(/\\delta/g, 'delta')
        .replace(/\\theta/g, 'theta')
        .replace(/\\pi/g, 'pi')
        .replace(/\\sigma/g, 'sigma')
        .replace(/\\sum/g, 'sum')
        .replace(/\\int/g, 'integral')
        .replace(/\^(\{[^}]*\}|[^\s{])/g, (_, exp) => '^' + exp.replace(/[{}]/g, ''))
        .replace(/_(\{[^}]*\}|[^\s{])/g, (_, sub) => '_' + sub.replace(/[{}]/g, ''))
        .replace(/\{|\}/g, '')
        .replace(/\\/g, '')
        .trim();
}

function formatDate(date) {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Exports a student's solution as a branded Equathora PDF.
 *
 * @param {object} opts
 * @param {string} opts.problemTitle
 * @param {string} opts.problemDescription
 * @param {string} opts.difficulty
 * @param {string[]} opts.topics
 * @param {Array<{id, latex}>} opts.fields      - the student's step fields
 * @param {boolean} opts.isCorrect              - whether the final answer was accepted
 * @param {string} opts.studentName             - user's display name or email
 * @param {string} opts.logoUrl                 - import path resolved to URL, e.g. from `import logo from '...'`
 */
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
        brand: [220, 120, 20],   // amber
        dark: [30, 30, 40],   // near black
        mid: [90, 90, 110],   // muted
        light: [245, 245, 248],  // very light bg
        border: [220, 220, 228],
        green: [22, 163, 74],
        red: [220, 38, 38],
        white: [255, 255, 255],
    };

    let y = 0;

    // ---- helpers ----
    const setColor = (color) => doc.setTextColor(...color);
    const setFill = (color) => doc.setFillColor(...color);
    const setDraw = (color) => doc.setDrawColor(...color);

    const text = (str, x, cy, opts = {}) => {
        doc.text(String(str), x, cy, opts);
    };

    const wrap = (str, x, cy, maxW, lineH, opts = {}) => {
        const lines = doc.splitTextToSize(String(str), maxW);
        doc.text(lines, x, cy, opts);
        return cy + lines.length * lineH;
    };

    const checkPage = (needed = 60) => {
        if (y + needed > PAGE_H - MARGIN) {
            doc.addPage();
            y = MARGIN + 20;
        }
    };

    // ===============================================================
    // HEADER BAND
    // ===============================================================
    setFill(COLORS.light);
    doc.rect(0, 0, PAGE_W, 72, 'F');

    // Logo
    if (logoUrl) {
        try {
            const b64 = await imageToBase64(logoUrl);
            if (b64) {
                doc.addImage(b64, 'PNG', MARGIN, 16, 120, 38);
            }
        } catch {
            // fallback to text logo
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(20);
            doc.setTextColor(...COLORS.brand);
            text('Equathora', MARGIN, 46);
        }
    } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(...COLORS.brand);
        text('Equathora', MARGIN, 46);
    }

    // Header right: date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.dark);
    text(formatDate(new Date()), PAGE_W - MARGIN, 30, { align: 'right' });
    text('equathora.com', PAGE_W - MARGIN, 44, { align: 'right' });

    y = 96;

    // ===============================================================
    // PROBLEM TITLE + META
    // ===============================================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    setColor(COLORS.dark);
    y = wrap(problemTitle, MARGIN, y, CONTENT_W, 22);
    y += 6;

    // Difficulty + topics pill row
    if (difficulty || topics.length > 0) {
        const diffColor = difficulty?.toLowerCase() === 'easy' ? [22, 163, 74] :
            difficulty?.toLowerCase() === 'medium' ? [161, 98, 7] :
                difficulty?.toLowerCase() === 'hard' ? [220, 38, 38] : COLORS.mid;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        if (difficulty) {
            setFill(diffColor);
            const dw = doc.getTextWidth(difficulty.toUpperCase()) + 12;
            doc.roundedRect(MARGIN, y, dw, 14, 3, 3, 'F');
            doc.setTextColor(...COLORS.white);
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

    // Divider
    setDraw(COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 16;

    // ===============================================================
    // PROBLEM DESCRIPTION
    // ===============================================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(COLORS.mid);
    text('PROBLEM', MARGIN, y);
    y += 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    setColor(COLORS.dark);
    // Strip any HTML tags that might come from MathJax rendered content
    const cleanDesc = problemDescription.replace(/<[^>]$\{}*>/g, '').trim();
    y = wrap(cleanDesc, MARGIN, y, CONTENT_W, 14);
    y += 20;

    // ===============================================================
    // STUDENT SOLUTION STEPS
    // ===============================================================
    checkPage(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setColor(COLORS.mid);
    text('SOLUTION STEPS', MARGIN, y);
    y += 16;

    const nonEmpty = fields.filter(f => f.latex && f.latex.trim() !== '');

    if (nonEmpty.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(10);
        setColor(COLORS.mid);
        text('No steps were recorded.', MARGIN, y);
        y += 20;
    } else {
        nonEmpty.forEach((field, i) => {
            checkPage(44);

            const stepNum = i + 1;
            const readable = latexToReadable(field.latex);
            const isLast = i === nonEmpty.length - 1;
            const rowH = Math.max(32, doc.splitTextToSize(readable, CONTENT_W - 60).length * 13 + 16);

            // Step row background
            setFill(i % 2 === 0 ? COLORS.light : COLORS.white);
            setDraw(COLORS.border);
            doc.setLineWidth(0.4);
            doc.roundedRect(MARGIN, y, CONTENT_W, rowH, 4, 4, 'FD');

            // Step number badge
            const badgeColor = isLast && isCorrect ? COLORS.green : isLast && !isCorrect ? COLORS.red : COLORS.brand;
            setFill(badgeColor);
            doc.circle(MARGIN + 18, y + rowH / 2, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.white);
            text(String(stepNum), MARGIN + 18, y + rowH / 2 + 3.5, { align: 'center' });

            // Step latex raw (small, muted)
            doc.setFont('courier', 'normal');
            doc.setFontSize(7);
            setColor(COLORS.mid);
            const rawLines = doc.splitTextToSize(field.latex, CONTENT_W - 60);
            text(rawLines[0] + (rawLines.length > 1 ? ' ...' : ''), MARGIN + 36, y + rowH / 2 - 5);

            // Step readable
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            setColor(COLORS.dark);
            const readableLines = doc.splitTextToSize(readable, CONTENT_W - 60);
            doc.text(readableLines, MARGIN + 36, y + rowH / 2 + 8);

            y += rowH + 6;
        });
    }

    y += 8;

    // ===============================================================
    // RESULT BADGE
    // ===============================================================
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
    doc.setTextColor(...badgeBdr);
    text(badgeTxt, MARGIN + 14, y + 22);
    y += 50;

    // ===============================================================
    // VERIFICATION BLOCK (only if correct)
    // ===============================================================
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


    // ===============================================================
    // FOOTER on every page
    // ===============================================================
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        setFill(COLORS.dark);
        doc.rect(0, PAGE_H - 32, PAGE_W, 32, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.border);
        text('Generated by Equathora  |  equathora.com', MARGIN, PAGE_H - 13);
        text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 13, { align: 'right' });
    }

    // ===============================================================
    // SAVE
    // ===============================================================
    const safeName = problemTitle.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    doc.save(`Equathora_${safeName}.pdf`);
}