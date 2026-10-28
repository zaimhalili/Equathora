import React from 'react';
import { Link } from 'react-router-dom';

const PrimaryButton = ({ text, onClick, className, link = false, title = null, to, arrow}) => {
    return (
        <>
            {link ? (
                <Link
                    to={to}
                    title={title}
                    className={`bg-(--secondary-color) rounded-xl py-1.5 text-center text-(--white)! hover:brightness-95 hover:bg-(--secondary-color)/95 transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 gap-1 ${className}`}
                >
                    {text} {arrow && <FaAngleRight />}
                </Link>
            ) : (
                <button
                    title={title}
                    onClick={onClick}
                    className={`bg-(--secondary-color) rounded-xl py1.5 text-center text-(--white)! hover:brightness-95 hover:bg-(--secondary-color)/95 transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 gap-1 ${className}`}
                >
                    {text} {arrow && <FaAngleRight />}
                </button>
            )}
        </>
    );
};

export default PrimaryButton;