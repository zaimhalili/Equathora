import React, { useState } from 'react';
import { FaFilePdf, FaCrown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { exportSolutionPDF } from '@/lib/exportSolutionPDF';
import logo from '@/assets/logo/EquathoraLogoFull.png';

export default function ExportPDFButton({ premium, problem, fields, isCorrect, studentName }) {
    const [loading, setLoading] = useState(false);

    if (!premium) {
        return (
            <Link
                to="/premium"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-amber-400/40 text-amber-500 hover:bg-amber-400/10 transition-all duration-200"
                title="Upgrade to export PDF"
            >
                <FaCrown className="text-amber-400 text-[10px]" />
                Export PDF
            </Link>
        );
    }

    const handleExport = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await exportSolutionPDF({
                problemTitle: problem?.title ?? 'Problem',
                problemDescription: problem?.description ?? '',
                difficulty: problem?.difficulty ?? '',
                topics: problem?.topics ?? problem?.tags ?? [],
                fields: fields ?? [],
                isCorrect: isCorrect ?? false,
                studentName: studentName ?? 'Student',
                logoUrl: logo,
            });
        } catch (err) {
            console.error('PDF export failed:', err);
            alert('Could not generate PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={loading}
            title="Export your solution as PDF"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--french-gray)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--white)] hover:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
            <FaFilePdf className={loading ? 'opacity-40' : 'text-rose-500'} />
            {loading ? 'Generating...' : 'Export PDF'}
        </button>
    );
}