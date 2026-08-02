import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FaFileDownload, FaFilePdf, FaFileCsv, FaChevronDown } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import Logo from '../assets/logo/EquathoraSymbolIcon.png';
import { useUserStats } from '../context/UserStatsContext';

const formatDuration = (totalSeconds = 0) => {
    const safeSeconds = Math.max(0, Math.round(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
};

const formatDate = (iso, includeTime = false) => {
    if (!iso) return 'N/A';
    const date = new Date(iso);
    if (includeTime) {
        return date.toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const normalizeDifficultySummary = (difficultyBreakdown) => {
    const array = Array.isArray(difficultyBreakdown) ? difficultyBreakdown : [];
    return array.reduce((acc, entry) => {
        const key = String(entry?.key || '').toLowerCase();
        if (!key) return acc;
        acc[key] = {
            solved: Number(entry.solved || 0),
            total: Number(entry.total || 0),
            percentage: entry.total > 0 ? Math.round((Number(entry.solved || 0) / Number(entry.total || 0)) * 100) : 0
        };
        return acc;
    }, {
        easy: { solved: 0, total: 0, percentage: 0 },
        medium: { solved: 0, total: 0, percentage: 0 },
        hard: { solved: 0, total: 0, percentage: 0 }
    });
};

const buildDataSnapshot = (stats = {}) => {
    const normalizedDifficulty = normalizeDifficultySummary(stats.difficultyBreakdown);
    const weeklyProgress = Array.isArray(stats.weeklyProgress) ? stats.weeklyProgress : Array(7).fill(0);
    const completedCount = Number(stats.problemsSolved || 0);
    const totalSubmissions = Number(stats.totalSubmissions || 0);
    const totalTimeSeconds = Number(stats.totalTimeSeconds || 0);
    const avgTimePerProblem = completedCount > 0 ? Math.round(totalTimeSeconds / completedCount) : 0;
    const totalSessions = weeklyProgress.reduce((sum, value) => sum + Number(value || 0), 0);
    const avgProblemsPerSession = totalSessions > 0 ? (completedCount / totalSessions).toFixed(1) : '0';

    return {
        stats: {
            username: stats.username || 'Student',
            joinDate: stats.joinDate || null,
            problemsSolved: completedCount,
            accuracy: Number(stats.accuracy || 0),
            accuracyBreakdown: {
                correct: Number(stats.accuracyBreakdown?.correct || 0),
                wrong: Number(stats.accuracyBreakdown?.wrong || 0),
                total: Number(stats.accuracyBreakdown?.total || 0)
            },
            totalAttempts: Number(stats.totalAttempts || 0),
            difficultyBreakdown: stats.difficultyBreakdown || [],
            currentStreak: Number(stats.currentStreak || 0),
            longestStreak: Number(stats.longestStreak || 0),
            reputation: Number(stats.reputation || 0),
            weeklyProgress,
            favoriteTopics: Array.isArray(stats.favoriteTopics) ? stats.favoriteTopics : [],
            totalProblems: Number(stats.totalProblems || 0)
        },
        totalSubmissions,
        totalTimeSeconds,
        latestCompletion: stats.latestSubmissionAt || null,
        firstCompletion: stats.firstSubmissionAt || stats.joinDate || null,
        difficulty: normalizedDifficulty,
        favoriteTopics: Array.isArray(stats.favoriteTopics) ? stats.favoriteTopics : [],
        avgTimePerProblem,
        totalSessions,
        avgProblemsPerSession,
        totalProblems: Number(stats.totalProblems || 0),
        easyTotal: normalizedDifficulty.easy.total,
        mediumTotal: normalizedDifficulty.medium.total,
        hardTotal: normalizedDifficulty.hard.total
    };
};

const ProfileExportButtons = () => {
    const { stats, loading } = useUserStats();
    const snapshot = useMemo(() => buildDataSnapshot(stats), [stats]);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return <div className="flex gap-2">Loading...</div>;
    }

    const {
        stats: exportStats,
        totalTimeSeconds,
        latestCompletion,
        firstCompletion,
        difficulty,
        favoriteTopics,
        avgTimePerProblem,
        totalSessions,
        avgProblemsPerSession,
        totalSubmissions,
        totalProblems,
        easyTotal,
        mediumTotal,
        hardTotal
    } = snapshot;

    const statsUsername = exportStats.username || 'Student';
    const accuracyRateLabel = exportStats.accuracy ?? 0;
    const totalAttemptsLabel = exportStats.totalAttempts ?? 0;
    const correctSubmissions = exportStats.accuracyBreakdown?.correct || 0;
    const wrongSubmissions = exportStats.accuracyBreakdown?.wrong || 0;

    const comprehensiveData = [
        {
            section: 'Account Information', items: [
                ['Account Username', statsUsername],
                ['Account Created', formatDate(exportStats.joinDate)],
                ['Account Status', 'Active'],
                ['User ID', `EQ-${exportStats.joinDate ? new Date(exportStats.joinDate).getTime().toString(36).toUpperCase() : 'GUEST'}`],
                ['Platform Access Level', 'Standard Member']
            ]
        },
        {
            section: 'Performance Metrics', items: [
                ['Problems Solved', `${exportStats.problemsSolved || 0} / ${totalProblems}`],
                ['Overall Accuracy Rate', `${accuracyRateLabel || 0}%`],
                ['Correct Submissions', correctSubmissions],
                ['Incorrect Submissions', wrongSubmissions],
                ['Total Submission Attempts', totalAttemptsLabel],
                ['Success Rate (First Attempt)', totalSubmissions > 0 ? `${Math.round(((correctSubmissions || 0) / totalSubmissions) * 100)}%` : 'N/A']
            ]
        },
        {
            section: 'Difficulty Breakdown', items: [
                ['Easy Problems Solved', `${difficulty.easy.solved || 0} / ${easyTotal}`],
                ['Medium Problems Solved', `${difficulty.medium.solved || 0} / ${mediumTotal}`],
                ['Hard Problems Solved', `${difficulty.hard.solved || 0} / ${hardTotal}`],
                ['Easy Completion Rate', `${easyTotal > 0 ? difficulty.easy.percentage : 0}%`],
                ['Medium Completion Rate', `${mediumTotal > 0 ? difficulty.medium.percentage : 0}%`],
                ['Hard Completion Rate', `${hardTotal > 0 ? difficulty.hard.percentage : 0}%`]
            ]
        },
        {
            section: 'Engagement Statistics', items: [
                ['Current Streak (Days)', stats.currentStreak || 0],
                ['Longest Streak (Days)', stats.longestStreak || 0],
                ['Reputation Points', stats.reputation || 0],
                ['Active Learning Sessions', totalSessions],
                ['Average Problems Per Session', avgProblemsPerSession]
            ]
        },
        {
            section: 'Time Investment', items: [
                ['Total Time Invested', formatDuration(totalTimeSeconds)],
                ['Average Time Per Problem', formatDuration(avgTimePerProblem)],
                ['First Problem Completed', formatDate(firstCompletion)],
                ['Most Recent Activity', formatDate(latestCompletion, true)]
            ]
        },
        {
            section: 'Learning Focus', items: [
                ['Favorite Topics', favoriteTopics.length > 0 ? favoriteTopics.join(', ') : 'Diverse Learning'],
                ['Total Topics Explored', favoriteTopics.length],
                ['Primary Skill Level', difficulty.hard.solved > 5 ? 'Advanced' : difficulty.medium.solved > 10 ? 'Intermediate' : 'Beginner']
            ]
        }
    ];

    const exportCsv = () => {
        const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const username = stats.username || 'Student';

        let csvContent = '';
        csvContent += '═══════════════════════════════════════════════════════════════\n';
        csvContent += 'EQUATHORA - OFFICIAL LEARNER ACTIVITY REPORT\n';
        csvContent += '═══════════════════════════════════════════════════════════════\n';
        csvContent += `Report Generated: ${issueDate}\n`;
        csvContent += `Account Holder: ${username}\n`;
        csvContent += 'Document Type: Comprehensive Learning Analytics\n';
        csvContent += `Report ID: EQ-${Date.now().toString(36).toUpperCase()}\n`;
        csvContent += '═══════════════════════════════════════════════════════════════\n\n';

        comprehensiveData.forEach(({ section, items }) => {
            csvContent += `\n${section.toUpperCase()}\n`;
            csvContent += '───────────────────────────────────────────────────────────────\n';
            items.forEach(([label, value]) => {
                const paddedLabel = label.padEnd(40, '.');
                csvContent += `${paddedLabel} ${value}\n`;
            });
        });

        csvContent += '\n═══════════════════════════════════════════════════════════════\n';
        csvContent += 'VERIFICATION & AUTHENTICITY\n';
        csvContent += '═══════════════════════════════════════════════════════════════\n';
        csvContent += 'This document is an official record generated by the Equathora\n';
        csvContent += 'educational platform. All data is extracted from authenticated\n';
        csvContent += 'user activity logs and performance metrics. For verification\n';
        csvContent += 'purposes, please reference the Report ID and generation date.\n\n';
        csvContent += 'Contact: equathora@gmail.com\n';
        csvContent += 'Platform: https://equathora.com\n';
        csvContent += '═══════════════════════════════════════════════════════════════\n';

        const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `EQUATHORA_LearningReport_${username}_${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        setShowMenu(false);
    };

    const exportPdf = async () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        const maxContentHeight = pageHeight - 40; // Safe zone to avoid cutting

        const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const username = stats.username || 'Student';
        const reportId = `EQ-${Date.now().toString(36).toUpperCase()}`;

        // Load and add logo
        const addLogo = (yPosition = 12) => {
            try {
                doc.addImage(Logo, 'PNG', margin, yPosition, 15, 15);
            } catch (e) {
                console.warn('Logo could not be loaded:', e);
            }
        };

        // Page 1 - Header and Data
        doc.setFillColor(217, 4, 41);
        doc.rect(0, 0, pageWidth, 35, 'F');

        addLogo(10);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('EQUATHORA', margin + 20, 15);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Learner Performance Certificate', margin + 20, 22);
        doc.text(`Report ID: ${reportId}`, margin + 20, 28);

        // Document info box
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(margin, 42, contentWidth, 28, 2, 2, 'FD');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('ISSUED TO:', margin + 5, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(username, margin + 5, 56);

        doc.setFont('helvetica', 'bold');
        doc.text('DATE ISSUED:', margin + 90, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(issueDate, margin + 90, 56);

        doc.setFont('helvetica', 'bold');
        doc.text('DOCUMENT TYPE:', margin + 5, 64);
        doc.setFont('helvetica', 'normal');
        doc.text('Comprehensive Learning Analytics', margin + 5, 68);

        let yPos = 80;
        let currentPage = 1;

        // Render sections with pagination
        comprehensiveData.forEach(({ section, items }, sectionIndex) => {
            // Check if we need a new page for section header
            if (yPos > maxContentHeight - 30) {
                doc.addPage();
                currentPage++;
                yPos = margin;
            }

            // Section header
            doc.setFillColor(240, 240, 245);
            doc.rect(margin, yPos, contentWidth, 8, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(section.toUpperCase(), margin + 3, yPos + 5.5);
            yPos += 10;

            // Section items
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            items.forEach(([label, value], idx) => {
                // Check if we need a new page
                if (yPos > maxContentHeight - 15) {
                    doc.addPage();
                    currentPage++;
                    yPos = margin;
                }

                const bgColor = idx % 2 === 0 ? [255, 255, 255] : [250, 250, 252];
                doc.setFillColor(...bgColor);
                doc.rect(margin, yPos, contentWidth, 7, 'F');

                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(label, margin + 3, yPos + 4.5);
                doc.setFont('helvetica', 'normal');
                doc.text(String(value), margin + 95, yPos + 4.5);
                yPos += 7;
            });
            yPos += 3;
        });

        // Add new page for footer if needed
        if (yPos > maxContentHeight - 35) {
            doc.addPage();
            currentPage++;
            yPos = margin;
        }

        // Footer verification box
        doc.setDrawColor(180, 180, 190);
        doc.setLineWidth(0.5);
        doc.setLineDash([2, 2]);
        doc.roundedRect(margin, yPos, contentWidth, 30, 2, 2);
        doc.setLineDash([]);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 90);
        doc.text('VERIFICATION & AUTHENTICITY', margin + 3, yPos + 5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 70);
        const verifyText = 'This document is an official record generated by the Equathora educational platform. All data is extracted from authenticated user activity logs. For verification, reference the Report ID above.';
        const splitText = doc.splitTextToSize(verifyText, contentWidth - 8);
        doc.text(splitText, margin + 3, yPos + 10);

        // Official stamp
        doc.setDrawColor(217, 4, 41);
        doc.setLineWidth(1.5);
        doc.roundedRect(margin + 3, yPos + 20, 50, 8, 2, 2);
        doc.setTextColor(217, 4, 41);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('VERIFIED BY EQUATHORA', margin + 8, yPos + 25.5);

        // Add page numbers to all pages
        const totalPages = doc.Sansationnal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(120, 120, 130);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
        }

        // Save PDF
        doc.save(`EQUATHORA_Certificate_${username}_${new Date().toISOString().split('T')[0]}.pdf`);
        setShowMenu(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[var(--white)] border border-[var(--mid-main-secondary)] rounded-md text-[var(--secondary-color)] font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Export account data"
            >
                <FaFileDownload className="text-base" />
                <span>Export Data</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
                <div className="absolute right-0 top-full pt-2 w-56 bg-[var(--white)] border border-[var(--mid-main-secondary)] rounded-md shadow-xl z-50 overflow-hidden">
                    {/* <div className="p-2 bg-[var(--french-gray)] border-b border-gray-200">
                        <p className="text-xs font-semibold text-[var(--secondary-color)] uppercase tracking-wide">Select Format</p>
                    </div> */}
                    <button
                        type="button"
                        onClick={exportPdf}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 text-left cursor-pointer border-b border-gray-300"
                    >
                        <FaFilePdf className="text-red-600 text-lg flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-[var(--secondary-color)]">PDF Certificate</p>
                            <p className="text-xs text-[var(--mid-main-secondary)]">Official A4 document</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={exportCsv}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 text-left cursor-pointer"
                    >
                        <FaFileCsv className="text-green-600 text-lg flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-[var(--secondary-color)]">Text Report</p>
                            <p className="text-xs text-gray-500">Formatted data file</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileExportButtons;
