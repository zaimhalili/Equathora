import React from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';

const SecondaryButton = ({
    text,
    onClick,
    className = '',
    link = false,
    title = null,
    to,
    arrow = false,
    disabled = false,
    type = 'button',
    ariaLabel,
    ariaCurrent,
    ariaHaspopup,
    ariaExpanded,
    role
}) => {
    return (
        <>
            {link ? (
                <Link
                    to={to}
                    title={title}
                    aria-label={ariaLabel}
                    aria-current={ariaCurrent}
                    aria-haspopup={ariaHaspopup}
                    aria-expanded={ariaExpanded}
                    role={role}
                    aria-disabled={disabled || undefined}
                    className={`bg-(--main-color) rounded-xl py-1.5 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 gap-1 ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
                >
                    {text} {arrow && <FaAngleRight />}
                </Link>
            ) : (
                <button
                    type={type}
                    title={title}
                    aria-label={ariaLabel}
                    aria-current={ariaCurrent}
                    aria-haspopup={ariaHaspopup}
                    aria-expanded={ariaExpanded}
                    role={role}
                    onClick={onClick}
                    disabled={disabled}
                    className={`bg-(--main-color) rounded-xl py-1.5 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 gap-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                >
                    {text} {arrow && <FaAngleRight />}
                </button>
            )}
        </>
    );
};

export default SecondaryButton;