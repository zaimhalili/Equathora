const SectionCard = ({ children, id }) => (
    <section
        id={id}
        className={`bg-(--white) flex w-full flex-col gap-6 rounded-xl `}>
        {children}
    </section>
);

const SectionTitle = ({ children, sub }) => (
    <div className="flex flex-col gap-2">
        <h2 className="text-(--secondary-color) text-2xl font-medium">{children}</h2>
        {sub && <p className="text-sm text-(--secondary-color)/70">{sub}</p>}
    </div>
);

const InputField = ({ label, description, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-(--secondary-color)">{label}</label>
        {description && <p className="text-xs text-(--mid-main-secondary)">{description}</p>}
        <input
            {...props}
            className="w-full rounded-xl border border-(--mid-main-secondary) px-4 py-3 text-lg font-black text-(--secondary-color) transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
        />
    </div>
);

const ToggleSwitch = ({ label, description, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-sm font-semibold text-(--secondary-color)">{label}</span>
            {description && <span className="text-xs text-(--mid-main-secondary)">{description}</span>}
        </div>
        <button
            type="button"
            role="switch"
            aria-label={label}
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer overflow-hidden rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? 'bg-(--accent-color)' : 'bg-(--mid-main-secondary)'}`}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 translate-y-[1.8px] transform rounded-full bg-white shadow-black/70 ring-0 transition-transform duration-200 ${checked ? 'translate-x-[21.5px]' : 'translate-x-[2px]'}`} />
        </button>
    </div>
);

const Spinner = ({ className = 'h-4 w-4' }) => (
    <svg className={`${className} animate-spin text-current`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
);

const PrimaryButton = ({ children, onClick, disabled, loading, className = '', title = '' }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        disabled={disabled || loading}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-(--accent-color) px-4 py-2 text-sm text-white transition-all duration-200 hover:bg-(--dark-accent-color) disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
        {loading && <Spinner />}
        {children}
    </button>
);

const OutlineButton = ({ children, onClick, disabled, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`cursor-pointer rounded-xl border border-(--mid-main-secondary) px-5 py-2.5 text-sm font-semibold text-(--secondary-color) transition-all duration-200 hover:bg-(--main-color) disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
        {children}
    </button>
);

const Chip = ({ children }) => (
    <span className="rounded-full bg-(--main-color) px-3 py-1.5 text-xs font-medium text-(--secondary-color)">
        {children}
    </span>
);

export {
    Chip,
    InputField,
    OutlineButton,
    PrimaryButton,
    SectionCard,
    SectionTitle,
    Spinner,
    ToggleSwitch,
};
