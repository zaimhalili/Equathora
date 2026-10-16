import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const ProfileEditButton = ({ onClick, label, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={`z-10 flex h-8 w-8 items-center justify-center rounded-full bg-(--main-color) text-(--secondary-color)/70 opacity-0 transition-all duration-200 hover:brightness-95 hover:text-(--secondary-color) focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent-color) group-hover:opacity-100 group-focus-within:opacity-100 ${className}`}
    >
        <FaPencilAlt className="text-xs" aria-hidden="true" />
    </button>
);

export default ProfileEditButton;
