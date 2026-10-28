import React from 'react';
import { Link } from 'react-router-dom';

const SecondaryButton = ({ text, onClick, className, link = false, title = null }) => {
    return (
        <>
            {link ? (
                <Link
                    title={title}
                    onClick={onClick}
                    className={`bg-(--main-color) rounded-xl flex-1 py-1 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium ${className}`}
                >
                    {text}
                </Link>
            ) : (
                <button
                    title={title}
                    onClick={onClick}
                    className={`bg-(--main-color) rounded-xl flex-1 py-1 text-center text-(--secondary-color)/70 hover:brightness-95 hover:text-(--secondary-color) transition-all text-md font-medium ${className}`}
                >
                    {text}
                </button>
            )}
        </>
    );
};

export default SecondaryButton;