import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaQuestionCircle, FaFlag, FaStar, FaRegStar, FaEllipsisV } from 'react-icons/fa';

const ProblemMobileMenu = ({
    showMobileMenu,
    setShowMobileMenu,
    showDrawingPad,
    setShowDrawingPad,
    setShowDescription,
    setShowSolutionPopup,
    setShowSolution,
    setShowTop,
    setShowSubmissions,
    descriptionCollapsed,
    setDescriptionCollapsed,
    setShowHelpModal,
    isFavorite,
    handleFavoriteToggle
}) => {
    return (
        <div className="md:hidden relative mobile-menu-container">
            <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 bg-transparent border border-[var(--french-gray)] text-[var(--secondary-color)] hover:bg-[var(--french-gray)] cursor-pointer"
                title="More options"
            >
                <FaEllipsisV className="text-sm" />
            </button>

            {/* Mobile dropdown menu */}
            {showMobileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--main-color)] border border-[var(--french-gray)] rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                        onClick={() => {
                            setShowDrawingPad((prev) => !prev);
                            setShowDescription(true);
                            setShowSolutionPopup(false);
                            setShowSolution(false);
                            setShowTop(false);
                            setShowSubmissions(false);
                            if (descriptionCollapsed) setDescriptionCollapsed(false);
                            setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 border-b border-[var(--french-gray)] cursor-pointer ${showDrawingPad ? 'text-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--secondary-color)] hover:bg-[var(--french-gray)]'}`}
                    >
                        <FaPencilAlt className="text-sm" />
                        <span>{showDrawingPad ? 'Hide Sketch Pad' : 'Show Sketch Pad'}</span>
                    </button>
                    <button
                        onClick={() => {
                            setShowHelpModal(true);
                            setShowMobileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--secondary-color)] transition-all duration-200 hover:bg-[var(--french-gray)] border-b border-[var(--french-gray)] cursor-pointer"
                    >
                        <FaQuestionCircle className="text-sm" />
                        <span>Help & Guide</span>
                    </button>
                    <Link
                        to="/feedback"
                        onClick={() => setShowMobileMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[var(--secondary-color)] transition-all duration-200 hover:bg-[var(--french-gray)] border-b border-[var(--french-gray)] cursor-pointer"
                    >
                        <FaFlag className="text-sm" />
                        <span>Report Problem</span>
                    </Link>
                    <button
                        onClick={() => {
                            handleFavoriteToggle();
                            setShowMobileMenu(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 cursor-pointer ${isFavorite ? 'text-[var(--accent-color)] bg-[rgba(217,4,41,0.05)]' : 'text-[var(--secondary-color)] hover:bg-[var(--french-gray)]'}`}
                    >
                        {isFavorite ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
                        <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProblemMobileMenu;
