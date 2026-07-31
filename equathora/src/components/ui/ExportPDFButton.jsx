import React, { useState } from 'react';
import { FaFilePdf, FaCrown, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useSubscriptionStatus } from '@/hooks/useSubscription';

// NOTE: adjust these env var names to whatever your project actually uses
// (e.g. process.env.NEXT_PUBLIC_SUPABASE_URL for Next.js).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/export-pdf`;

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

    // 3. Direct fetch call — deliberately NOT using supabase.functions.invoke().
    // That client parses the response based on the Content-Type header and has
    // no reliable way to force blob handling for an "application/pdf" response,
    // which corrupts binary payloads. A plain fetch() with res.blob() sidesteps
    // that entirely.
    const handleExport = async () => {
        if (exporting) return;
        setExporting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                alert('Session expired. Please log in again.');
                return;
            }

            const response = await fetch(FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    problemTitle: problem?.title ?? 'Problem',
                    problemDescription: problem?.description ?? '',
                    difficulty: problem?.difficulty ?? '',
                    topics: problem?.topics ?? problem?.tags ?? [],
                    fields: fields ?? [],
                    isCorrect: isCorrect ?? false,
                    studentName: studentName ?? 'Student',
                }),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    alert('Premium subscription required to export PDFs.');
                } else {
                    let details = '';
                    try {
                        const errJson = await response.json();
                        details = errJson?.error ?? '';
                    } catch {
                        // response wasn't JSON, ignore
                    }
                    console.error('Export failed:', response.status, details);
                    alert('Could not generate PDF. Please try again.');
                }
                return;
            }

            const blob = await response.blob();
            if (!blob || blob.size === 0) {
                throw new Error('Received empty binary data from PDF generator.');
            }

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
            {exporting ? (
                <FaSpinner className="animate-spin text-xs" />
            ) : (
                <FaFilePdf className="text-[var(--accent-color)]" />
            )}
            {exporting ? 'Generating...' : 'Export PDF'}
        </button>
    );
}