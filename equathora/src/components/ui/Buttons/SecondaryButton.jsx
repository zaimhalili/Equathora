import React from 'react';
import { Link } from 'react-router-dom';

const SecondaryButton = ({ text, onClick, className, link = false, title = null, to }) => {
    return (
        <>
            {link ? (
                <Link
                    to={to}
                    title={title}
                    className={`bg-(--main-color) rounded-xl py-1.5 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium flex items-center justify-center px-4 active:scale-95 ${className}`}
                >
                    {text}
                </Link>
            ) : (
                <button
                    title={title}
                    onClick={onClick}
                    className={`bg-(--main-color) rounded-xl py-1.5 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium flex items-center justify-center active:scale-95 ${className}`}
                >
                    {text}
                </button>
            )}
        </>
    );
};

export default SecondaryButton;