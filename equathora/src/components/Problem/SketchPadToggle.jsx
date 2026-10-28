import React from 'react';
import { FaChevronDown, FaPencilAlt } from 'react-icons/fa';

const SketchPadToggle = ({ isOpen, onClick, children }) => (
    <div className="w-full rounded-2xl bg-(--french-gray)/40 px-3 md:px-4">
        <button
            type="button"
            onClick={onClick}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between gap-3 py-3 text-left"
        >
            <span className="flex items-center gap-2 text-xs font-semibold text-(--secondary-color) md:text-sm">
                <FaPencilAlt className="text-[10px] md:text-xs" />
                Sketch pad
            </span>
            <FaChevronDown className={`shrink-0 text-[10px] text-(--secondary-color) transition-transform duration-200 md:text-xs ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                {isOpen && <div className="pb-3">{children}</div>}
            </div>
        </div>
    </div>
);

export default SketchPadToggle;
