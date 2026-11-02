import React from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';

const PrimaryButton = ({
    text,
    onClick,
    className = '',
    link = false,
    title = null,
    to,
    arrow = false,
    disabled = false,
    type = 'button'
}) => {
    return (
        <>
            {link ? (
                <Link
                    to={to}
                    title={title}
                    className={`bg-(--secondary-color) rounded-xl py-2 text-center text-(--white)! hover:brightness-95 hover:bg-(--secondary-color)/95 transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 gap-1 ${className}`}
                >
                    {text} {arrow && <FaAngleRight />}
                </Link>
            ) : (
                <button
                    type={type}
                    title={title}
                    onClick={onClick}
                    disabled={disabled}
                    className={`bg-(--secondary-color) rounded-xl py-2 text-center text-(--white)! hover:brightness-95 hover:bg-(--secondary-color)/95 transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 gap-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                >
                    {text} {arrow && <FaAngleRight />}
                </button>
            )}
        </>
    );
};

export default PrimaryButton;