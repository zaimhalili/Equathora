import React, { useMemo, useState, useRef, useEffect } from 'react';
import { FaFileDownload, FaFilePdf, FaFileCsv, FaChevronDown } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import Logo from '../assets/logo/EquathoraSymbolIcon.png';
import { getUserStats, getSubmissions } from '../lib/progressStorage';
import { getCompletedProblems, getUserProgress } from '../lib/databaseService';
import { getAllProblems } from '../lib/problemService';

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

const buildDataSnapshot = async () => {
    const stats = getUserStats();
    const [completedIds, allProblems] = await Promise.all([
        getCompletedProblems(),
        getAllProblems()
    ]);
    const completed = allProblems.filter(p => completedIds.includes(String(p.id)));
    const allSubmissions = getSubmissions();

    const totalTimeSeconds = completed.reduce((sum, item) => sum + (item.timeSpent || 0), 0);
    const latestCompletion = completed[completed.length - 1]?.completedAt || completed[completed.length - 1]?.lastAttempt;
    const firstCompletion = completed[0]?.completedAt || stats.joinDate;

    const difficulty = stats.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 };
    const favoriteTopics = Array.isArray(stats.favoriteTopics) ? stats.favoriteTopics : [];

    // Additional comprehensive data
    const avgTimePerProblem = completed.length > 0 ? Math.round(totalTimeSeconds / completed.length) : 0;
    const totalSessions = stats.weeklyProgress ? stats.weeklyProgress.reduce((a, b) => a + b, 0) : 0;
    const avgProblemsPerSession = totalSessions > 0 ? (completed.length / totalSessions).toFixed(1) : '0';

    return {
        stats,
        completed,
        completedCount: completed.length,
        totalTimeSeconds,
        latestCompletion,
        firstCompletion,
        difficulty,
        favoriteTopics,
        avgTimePerProblem,
        totalSessions,
        avgProblemsPerSession,
        totalSubmissions: allSubmissions.length,
        totalProblems: allProblems.length,
        easyTotal: allProblems.filter(p => p.difficulty === 'Easy').length,
        mediumTotal: allProblems.filter(p => p.difficulty === 'Medium').length,
        hardTotal: allProblems.filter(p => p.difficulty === 'Hard').length
    };
};

const ProfileExportButtons = () => {
    const [snapshot, setSnapshot] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await buildDataSnapshot();
            setSnapshot(data);
        };
        loadData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!snapshot) {
        return <div className="flex gap-2">Loading...</div>;
    }

    const {
        stats, completed, completedCount, totalTimeSeconds, latestCompletion, firstCompletion,
        difficulty, favoriteTopics, avgTimePerProblem, totalSessions, avgProblemsPerSession,
        totalSubmissions, totalProblems, easyTotal, mediumTotal, hardTotal
    } = snapshot;

    const comprehensiveData = [
        {
            section: 'Account Information', items: [
                ['Account Username', stats.username || 'Student'],
                ['Account Created', formatDate(stats.joinDate)],
                ['Account Status', 'Active'],
                ['User ID', `EQ-${stats.joinDate ? new Date(stats.joinDate).getTime().toString(36).toUpperCase() : 'GUEST'}`],
                ['Platform Access Level', 'Standard Member']
            ]
        },
        {
            section: 'Performance Metrics', items: [
                ['Problems Solved', `${stats.problemsSolved || 0} / ${totalProblems}`],
                ['Overall Accuracy Rate', `${stats.accuracy || 0}%`],
                ['Correct Submissions', stats.accuracyBreakdown?.correct || 0],
                ['Incorrect Submissions', stats.accuracyBreakdown?.wrong || 0],
                ['Total Submission Attempts', stats.totalAttempts || 0],
                ['Success Rate (First Attempt)', totalSubmissions > 0 ? `${Math.round(((stats.accuracyBreakdown?.correct || 0) / totalSubmissions) * 100)}%` : 'N/A']
            ]
        },
        {
            section: 'Difficulty Breakdown', items: [
                ['Easy Problems Solved', `${difficulty.easy || 0} / ${easyTotal}`],
                ['Medium Problems Solved', `${difficulty.medium || 0} / ${mediumTotal}`],
                ['Hard Problems Solved', `${difficulty.hard || 0} / ${hardTotal}`],
                ['Easy Completion Rate', `${easyTotal > 0 ? Math.round((difficulty.easy / easyTotal) * 100) : 0}%`],
                ['Medium Completion Rate', `${mediumTotal > 0 ? Math.round((difficulty.medium / mediumTotal) * 100) : 0}%`],
                ['Hard Completion Rate', `${hardTotal > 0 ? Math.round((difficulty.hard / hardTotal) * 100) : 0}%`]
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
                ['Primary Skill Level', difficulty.hard > 5 ? 'Advanced' : difficulty.medium > 10 ? 'Intermediate' : 'Beginner']
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
        const totalPages = doc.internal.pages.length - 1;
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
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[var(--french-gray)] rounded-lg text-[var(--secondary-color)] font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer"
                aria-label="Export account data"
            >
                <FaFileDownload className="text-base" />
                <span>Export Data</span>
                <FaChevronDown className={`text-xs transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[var(--french-gray)] rounded-lg shadow-xl z-50 overflow-hidden">
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
                            <p className="text-xs text-gray-500">Official A4 document</p>
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
