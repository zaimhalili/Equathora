import { useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';

function DismissiblePopover({ label, children, className = '', contentClassName = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const closeOnOutsideClick = (event) => {
            if (!containerRef.current?.contains(event.target)) setIsOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className={`relative shrink-0 ${className}`}>
            <button
                type="button"
                aria-label={label}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-(--mid-main-secondary) hover:bg-(--main-color)"
            >
                <FaEllipsisH aria-hidden="true" />
            </button>
            {isOpen && (
                <div
                    role="menu"
                    className={`absolute right-0 top-full z-50 flex min-w-40 flex-col gap-1 rounded-xl border border-(--french-gray)/60 bg-(--white) p-1 shadow-lg ${contentClassName}`}
                    onClick={() => setIsOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export default DismissiblePopover;
