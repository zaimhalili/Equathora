const AccentButton = ({
    text,
    onClick,
    className = '',
    title = null,
    disabled = false,
    type = 'button',
    ariaLabel,
    ariaHaspopup,
    ariaExpanded,
    role
}) => {
    return (
        <button
            type={type}
            title={title}
            aria-label={ariaLabel}
            aria-haspopup={ariaHaspopup}
            aria-expanded={ariaExpanded}
            role={role}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center gap-1 rounded-xl bg-(--accent-color) px-4 py-2 text-center text-sm font-medium text-(--white)! transition-all hover:brightness-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {text}
        </button>
    );
};

export default AccentButton;