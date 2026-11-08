import { useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import SecondaryButton from '../ui/Buttons/SecondaryButton';

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
            <SecondaryButton
                text={<FaEllipsisH aria-hidden="true" />}
                ariaLabel={label}
                ariaHaspopup="menu"
                ariaExpanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                className="h-9 w-9 rounded-xl p-0 text-(--mid-main-secondary)"
            />
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
