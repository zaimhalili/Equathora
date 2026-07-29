import React, { useState } from 'react';
import { FaFilePdf, FaCrown, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSubscriptionStatus} from '@/hooks/useSubscription';

export default function ExportPDFButton({ problem, fields, isCorrect, studentName }) {
    const { tier, premium, loading: subLoading } = useSubscriptionStatus();
    const [exporting, setExporting] = useState(false);

    // 1. Loading state
    if (subLoading) {
        return (
            <button
                type="button"
                disabled
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--french-gray)] text-[var(--secondary-color)] opacity-50 cursor-not-allowed"
            >
                <FaSpinner className="animate-spin text-xs" />
                Export PDF
            </button>
        );
    }

    // 2. UI Lockout for Free Tier Users
    const hasAccess = premium || tier === 'premium';
    if (!hasAccess) {
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

    // 3. Authenticated Edge Function Call
    const handleExport = async () => {
        if (exporting) return;
        setExporting(true);

        try {
            // CRITICAL FIX: Pass `responseType: 'blob'` options object so Supabase doesn't attempt JSON parsing
            const { data, error } = await supabase.functions.invoke('export-pdf', {
                body: {
                    problemTitle: problem?.title ?? 'Problem',
                    problemDescription: problem?.description ?? '',
                    difficulty: problem?.difficulty ?? '',
                    topics: problem?.topics ?? problem?.tags ?? [],
                    fields: fields ?? [],
                    isCorrect: isCorrect ?? false,
                    studentName: studentName ?? 'Student',
                },
                responseType: 'blob',
            });

            if (error) {
                console.error('Supabase function error:', error);
                if (error.status === 403) {
                    alert('Premium subscription required to export PDFs.');
                } else {
                    alert('Could not generate PDF. Please try again.');
                }
                return;
            }

            // `data` is now returned directly as a Blob
            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(problem?.title || 'solution').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error('PDF export error:', err);
            alert('An unexpected error occurred during export.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            title="Export your solution as PDF"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--french-gray)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--white)] hover:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
            <FaFilePdf className={exporting ? 'opacity-40' : 'text-[var(--accent-color)]'} />
            {exporting ? 'Generating...' : 'Export PDF'}
        </button>
    );
}