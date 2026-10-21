import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaChevronLeft,
    FaChevronRight,
    FaEllipsisV,
    FaFlag,
    FaMoon,
    FaQuestionCircle,
    FaRegStar,
    FaCog,
    FaStar,
    FaSun,
} from 'react-icons/fa';
import PremiumButton from '@/components/Premium/PremiumButton';
import Timer from '@/components/Timer';

const toolbarButtonClass = 'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-(--mid-main-secondary) px-2.5 text-xs font-medium text-(--secondary-color) transition-colors hover:border-(--accent-color) hover:bg-(--accent-color)/5 hover:text-(--accent-color) md:h-10 md:gap-2 md:px-3 md:text-sm';
const menuItemClass = 'flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-(--secondary-color) transition-colors hover:bg-(--french-gray)';

const ProblemToolbar = ({
    prevProblem,
    prevProblemSlug,
    nextProblem,
    nextProblemSlug,
    problemId,
    timerResetSeq,
    timerRunning,
    premium,
    currentTheme,
    onToggleTheme,
    onOpenHelp,
    isFavorite,
    onToggleFavorite,
}) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!isMenuOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsMenuOpen(false);
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMenuOpen]);

    const openHelp = () => {
        onOpenHelp();
        setIsMenuOpen(false);
    };

    const toggleFavorite = () => {
        onToggleFavorite();
        setIsMenuOpen(false);
    };

    const changeTheme = () => {
        onToggleTheme();
        setIsMenuOpen(false);
    };

    const currentThemeLabel = currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <header className="grid w-full max-w-600 grid-cols-[1fr_auto_1fr] items-center gap-2 bg-(--main-color) px-3 py-3 md:gap-3 md:px-6 md:py-4">
            <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
                <Link to="/learn" className={`${toolbarButtonClass} px-2 md:px-3`}>
                    <FaArrowLeft />
                    <span className="hidden md:inline">Back to Exercises</span>
                    <span className="md:hidden">Back</span>
                </Link>
                <button
                    type="button"
                    disabled={!prevProblemSlug}
                    onClick={() => prevProblemSlug && navigate(`/problems/${prevProblemSlug}`)}
                    className={`${toolbarButtonClass} w-9 px-0 md:w-10 md:px-0 disabled:cursor-not-allowed disabled:opacity-40`}
                    title={prevProblem ? `Previous: ${prevProblem.title}` : 'No previous problem'}
                    aria-label="Previous problem"
                >
                    <FaChevronLeft className="text-sm" />
                </button>
                <button
                    type="button"
                    disabled={!nextProblemSlug}
                    onClick={() => nextProblemSlug && navigate(`/problems/${nextProblemSlug}`)}
                    className={`${toolbarButtonClass} disabled:cursor-not-allowed disabled:opacity-40`}
                    title={nextProblem ? `Next: ${nextProblem.title}` : 'No next problem'}
                    aria-label="Next problem"
                >
                    <span className="hidden sm:inline">Next</span>
                    <FaChevronRight className="text-sm" />
                </button>
            </div>

            <div className="flex justify-center">
                <Timer
                    key={`${problemId}-${timerResetSeq}`}
                    problemId={problemId}
                    isRunning={timerRunning}
                />
            </div>

            <div className="flex min-w-0 items-center justify-end gap-1 md:gap-2">
                <PremiumButton premium={premium} />

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className={`${toolbarButtonClass} w-9 px-0 md:w-10`}
                        title="More options"
                        aria-label="More options"
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                    >
                        <FaEllipsisV className="text-sm" />
                    </button>

                    {isMenuOpen && (
                        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-(--mid-main-secondary) bg-(--main-color) p-1 shadow-xl">
                            <button type="button" role="menuitem" onClick={changeTheme} className={`${menuItemClass} rounded-lg`}>
                                {currentTheme === 'dark' ? <FaSun /> : <FaMoon />}
                                {currentThemeLabel}
                            </button>
                            <button type="button" role="menuitem" onClick={openHelp} className={`${menuItemClass} rounded-lg`}>
                                <FaQuestionCircle />
                                Help & Guide
                            </button>
                            <Link to="/feedback" role="menuitem" onClick={() => setIsMenuOpen(false)} className={`${menuItemClass} rounded-lg`}>
                                <FaFlag />
                                Report a problem
                            </Link>
                            <button type="button" role="menuitem" onClick={toggleFavorite} className={`${menuItemClass} rounded-lg`}>
                                {isFavorite ? <FaStar /> : <FaRegStar />}
                                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            </button>
                            <div className="my-1 border-t border-(--french-gray)" />
                            <Link to="/settings" role="menuitem" onClick={() => setIsMenuOpen(false)} className={`${menuItemClass} rounded-lg`}>
                                <FaCog />
                                Settings
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ProblemToolbar;
