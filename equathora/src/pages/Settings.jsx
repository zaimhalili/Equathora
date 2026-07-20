import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import {
    getUserSettings,
    saveUserSettings,
    changePassword,
    changeEmail,
    requestAccountDeletion,
    getCurrentSession,
    signOutAllOtherSessions,
} from '../lib/notificationService';
import {
    normalizeThemePreference,
    getStoredThemePreference,
    resolveThemePreference,
    setThemePreference,
} from '../lib/theme';
import {
    subscribeToEquathoraBriefs,
    unsubscribeFromEquathoraBriefs,
    isSubscribedToEquathoraBriefs,
} from '../lib/equathoraBriefsService';

// ============================================================================
// LABEL MAPS (mirrors the option ids used on /getStarted)
// ============================================================================

const GOAL_LABELS = {
    school: 'School & University',
    competitions: 'Math Competitions',
    'problem-solving': 'Problem Solving',
    fun: 'Learn for Fun',
};

const LEVEL_LABELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    competitive: 'Competitive',
};

const WEEKLY_LABELS = {
    'under-1': '< 1 hr / week',
    '1-3': '1–3 hrs / week',
    '3-6': '3–6 hrs / week',
    '6+': '6+ hrs / week',
};

const CHALLENGE_LABELS = {
    easy: 'Build Confidence',
    balanced: 'Balanced',
    challenging: 'Challenge Me',
    extreme: 'Push My Limits',
};

const PLAN_LABELS = {
    free: 'Free',
    scholar: 'Scholar',
    olympiad: 'Olympiad',
};

// ============================================================================
// REUSABLE UI PIECES
// ============================================================================

const SectionCard = ({ children, id }) => (
    <section
        id={id}
        className="bg-[var(--white)] rounded-md w-full flex flex-col gap-6 p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] scroll-mt-24"
    >
        {children}
    </section>
);

const SectionTitle = ({ children, sub }) => (
    <div className="flex flex-col gap-1">
        <h2 className="font-[Sansation,sans-serif] font-bold text-xl lg:text-2xl text-[var(--secondary-color)]">
            {children}
        </h2>
        {sub && <p className="text-sm text-[var(--mid-main-secondary)]">{sub}</p>}
    </div>
);

const InputField = ({ label, description, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--secondary-color)]">{label}</label>
        {description && <p className="text-xs text-[var(--mid-main-secondary)]">{description}</p>}
        <input
            {...props}
            className="text-lg font-black border rounded-md px-4 py-3 w-full border-[var(--mid-main-secondary)] bg-[var(--surface-card)] text-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all font-[Sansation,sans-serif]"
        />
    </div>
);

const ToggleSwitch = ({ label, description, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-semibold text-[var(--secondary-color)]">{label}</span>
            {description && <span className="text-xs text-[var(--mid-main-secondary)]">{description}</span>}
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer overflow-hidden rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? 'bg-[var(--accent-color)]' : 'bg-[var(--mid-main-secondary)]'}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 shadow-black/70 transform rounded-full bg-white ring-0 transition-transform duration-200 translate-y-[1.8px] ${checked ? 'translate-x-[21.5px]' : 'translate-x-[2px]'}`}
            />
        </button>
    </div>
);

const Spinner = ({ className = 'w-4 h-4' }) => (
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
        className={`cursor-pointer py-2.5 px-5 bg-[var(--accent-color)] text-white font-bold text-sm rounded-md hover:bg-[var(--dark-accent-color)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
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
        className={`cursor-pointer py-2.5 px-5 border border-[var(--mid-main-secondary)] text-[var(--secondary-color)] font-semibold text-sm rounded-md hover:bg-[var(--main-color)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

const DangerButton = ({ children, onClick, disabled, loading, title = '' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        title={title}
        className="cursor-pointer py-2.5 px-5 bg-[var(--dark-accent-color)] text-white font-bold text-sm rounded-md hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
        {loading && <Spinner />}
        {children}
    </button>
);

const Chip = ({ children }) => (
    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--main-color)] text-[var(--secondary-color)] border border-[var(--mid-main-secondary)]">
        {children}
    </span>
);

// ============================================================================
// TOAST — a single, global piece of feedback. New messages replace the old
// one instead of stacking, so only ever one banner is visible at a time.
// ============================================================================

const Toast = ({ toast }) => {
    const palette = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
        warning: 'bg-amber-600',
    };
    return (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto z-[9999] flex flex-col items-end pointer-events-none">
            <AnimatePresence mode="wait">
                {toast && (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className={`pointer-events-auto w-full sm:w-auto sm:max-w-sm text-white text-sm font-semibold px-4 py-3 rounded-md shadow-xl font-[Sansation,sans-serif] ${palette[toast.type] || palette.success}`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================================================
// CONFIRM MODAL — replaces window.confirm()/alert() everywhere in this page.
// ============================================================================

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmWord,
    confirmLabel = 'Confirm',
    loading = false,
    variant = 'danger',
}) => {
    const [typed, setTyped] = useState('');

    useEffect(() => {
        if (isOpen) setTyped('');
    }, [isOpen]);

    if (!isOpen) return null;

    const canConfirm = !confirmWord || typed.trim() === confirmWord;
    const confirmColor = variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-[var(--accent-color)] hover:bg-[var(--dark-accent-color)]';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !loading && onClose()}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-[var(--white)] rounded-md shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 font-[Sansation,sans-serif]"
                >
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-bold text-[var(--secondary-color)]">{title}</h2>
                        <button
                            onClick={() => !loading && onClose()}
                            className="text-[var(--mid-main-secondary)] hover:text-[var(--secondary-color)] p-1 rounded-md cursor-pointer transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-sm text-[var(--mid-main-secondary)]">{description}</p>

                    {confirmWord && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[var(--secondary-color)]">
                                Type <span className="font-mono">{confirmWord}</span> to confirm
                            </label>
                            <input
                                value={typed}
                                onChange={e => setTyped(e.target.value)}
                                placeholder={confirmWord}
                                autoFocus
                                className="px-4 py-2.5 border rounded-md border-[var(--mid-main-secondary)] bg-[var(--surface-card)] text-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <OutlineButton onClick={onClose} disabled={loading} className="flex-1">
                            Cancel
                        </OutlineButton>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={!canConfirm || loading}
                            className={`flex-1 px-5 py-2.5 text-white font-bold text-sm rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${confirmColor}`}
                        >
                            {loading && <Spinner />}
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// ============================================================================
// SIDEBAR NAVIGATION ICONS
// ============================================================================

const IconUser = () => (
    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
    </svg>
);

const IconLock = () => (
    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
    </svg>
);

const IconGraduation = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3L2 8l10 5 10-5-10-5z" strokeLinejoin="round" />
        <path d="M6 10.5V15c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
);

const IconBell = () => (
    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
    </svg>
);

const IconTheme = () => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M361.5 37.4c-9.3-6.3-21.5-5.7-30.1 1.5c-8.6 7.1-11.8 19.9-8 30.4c4.9 13.4 7.6 27.8 7.6 42.8c0 68.5-55.5 124-124 124c-15 0-29.4-2.7-42.8-7.6c-10.5-3.8-23.3-.6-30.4 8c-7.2 8.6-7.8 20.8-1.5 30.1C157.2 414.8 281.7 474.7 406.4 431.3c50.7-17.7 90.4-57.4 108.1-108.1C557.9 198.5 498 73.9 361.5 37.4z" />
    </svg>
);

const IconShield = () => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z" />
    </svg>
);

const IconCrown = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current" fill="currentColor">
        <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8zm2 12h14v2H5v-2z" />
    </svg>
);

const IconLaptop = () => (
    <svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z" />
    </svg>
);

const IconWarning = () => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-current">
        <path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </svg>
);

const IconSun = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-current" fill="currentColor">
        <path d="M12 4.5a1 1 0 011-1V2a1 1 0 10-2 0v1.5a1 1 0 001 1zm0 15a1 1 0 011 1V22a1 1 0 10-2 0v-1.5a1 1 0 011-1zM4.5 11H3a1 1 0 000 2h1.5a1 1 0 000-2zm16.5 0h-1.5a1 1 0 000 2H21a1 1 0 000-2zM6.34 4.93a1 1 0 00-1.41 1.41l1.06 1.06a1 1 0 001.41-1.41L6.34 4.93zm11.32 11.32a1 1 0 00-1.41 1.41l1.06 1.06a1 1 0 001.41-1.41l-1.06-1.06zM17.66 4.93l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06a1 1 0 10-1.41-1.41zM6.34 16.25l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06a1 1 0 10-1.41-1.41zM12 7a5 5 0 100 10 5 5 0 000-10z" />
    </svg>
);

const IconMoon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-current" fill="currentColor">
        <path d="M20.7 15.3a8.5 8.5 0 01-11-11 1 1 0 00-1.3-1.3A10.5 10.5 0 1022 16.6a1 1 0 00-1.3-1.3z" />
    </svg>
);

const IconSystem = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-current" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
);

const sidebarSections = [
    { id: 'profile', label: 'Profile', icon: <IconUser /> },
    { id: 'account', label: 'Account & Security', icon: <IconLock /> },
    { id: 'learning', label: 'Learning', icon: <IconGraduation /> },
    { id: 'notifications', label: 'Notifications', icon: <IconBell /> },
    { id: 'appearance', label: 'Appearance', icon: <IconTheme /> },
    { id: 'privacy', label: 'Privacy', icon: <IconShield /> },
    { id: 'subscription', label: 'Subscription', icon: <IconCrown /> },
    { id: 'sessions', label: 'Sessions', icon: <IconLaptop /> },
    // { id: 'danger', label: 'Danger Zone', icon: <IconWarning /> },
];

const THEME_OPTIONS = [
    { value: 'light', label: 'Light', icon: <IconSun /> },
    { value: 'dark', label: 'Dark', icon: <IconMoon /> },
    { value: 'system', label: 'System', icon: <IconSystem /> },
];

// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

const Settings = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);

    // Global toast (single message at a time — replaces the old per-section
    // banners that could all show the same text simultaneously)
    const [toast, setToast] = useState(null);
    const toastTimerRef = useRef(null);
    const showToast = (message, type = 'success') => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ id: Date.now(), message, type });
        toastTimerRef.current = setTimeout(() => setToast(null), 3500);
    };
    useEffect(() => () => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    }, []);

    // Read-only profile summary — editing lives on the public profile page,
    // so this page doesn't duplicate that form.
    const [profileSummary, setProfileSummary] = useState({
        full_name: '',
        username: '',
        bio: '',
        role: 'student',
        deletionRequested: false,
        deletionRequestedAt: null,
    });

    // Learning / onboarding summary
    const [learningProfile, setLearningProfile] = useState(null);
    const [showRetakeModal, setShowRetakeModal] = useState(false);
    const [retaking, setRetaking] = useState(false);

    // Subscription (defaults to free until the columns exist / billing ships)
    const [subscription, setSubscription] = useState({ tier: 'free', renewsAt: null });

    // Account state
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailSaving, setEmailSaving] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [authProvider, setAuthProvider] = useState('email');

    // Settings / preferences state
    const [settings, setSettings] = useState({
        notifications_enabled: true,
        email_notifications: false,
        achievement_notifications: true,
        streak_reminders: true,
        system_updates: true,
        friend_notifications: true,
        leaderboard_notifications: true,
        problem_notifications: true,
        privacy_profile_public: true,
        privacy_show_streak: true,
        privacy_show_leaderboard: true,
        privacy_show_achievements: true,
        theme: 'system',
        cookie_consent: 'none',
        cookie_consent_date: '',
    });
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [cookieConsent, setCookieConsent] = useState('none');

    // Session state
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionLoading, setSessionLoading] = useState(false);

    // Danger zone
    const [isResetting, setIsResetting] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isCancelingDeletion, setIsCancelingDeletion] = useState(false);

    // ========================================================================
    // LOAD USER DATA ON MOUNT
    // ========================================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    navigate('/login');
                    return;
                }

                setCurrentEmail(session.user.email || '');

                const provider = session.user.app_metadata?.provider || 'email';
                setAuthProvider(provider);

                // Profile — read-only summary, matches the real `profiles` schema
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username, bio, role, deletion_requested, deletion_requested_at')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (profile) {
                    setProfileSummary({
                        full_name: profile.full_name || session.user.user_metadata?.full_name || '',
                        username: profile.username || '',
                        bio: profile.bio || '',
                        role: profile.role || 'student',
                        deletionRequested: !!profile.deletion_requested,
                        deletionRequestedAt: profile.deletion_requested_at || null,
                    });
                }

                // Learning / onboarding summary (student_profile), best-effort
                try {
                    const { data: sp } = await supabase
                        .from('student_profile')
                        .select('goal, level, weekly_commitment, preferred_challenge')
                        .eq('id', session.user.id)
                        .maybeSingle();
                    if (sp) setLearningProfile(sp);
                } catch (e) {
                    // No student_profile row yet (e.g. teacher account) — fine.
                }

                // Subscription, best-effort — falls back to Free until the
                // billing columns exist on `profiles`.
                try {
                    const { data: sub } = await supabase
                        .from('profiles')
                        .select('subscription_tier, subscription_renews_at')
                        .eq('id', session.user.id)
                        .maybeSingle();
                    if (sub) {
                        setSubscription({
                            tier: sub.subscription_tier || 'free',
                            renewsAt: sub.subscription_renews_at || null,
                        });
                    }
                } catch (e) {
                    // subscription_tier / subscription_renews_at don't exist yet.
                }

                // Fetch user settings
                const userSettings = await getUserSettings();
                const storedPreference = getStoredThemePreference();
                const normalizedTheme = normalizeThemePreference(userSettings?.theme);
                const resolvedPreference = (normalizedTheme === 'system' && storedPreference !== 'system')
                    ? storedPreference
                    : normalizedTheme;
                const accountEmail = String(session.user.email || '').trim().toLowerCase();
                const isBriefsSubscribed = await isSubscribedToEquathoraBriefs(accountEmail);
                const legacyCookieConsent = localStorage.getItem('equathora_cookie_consent');
                const legacyCookieConsentDate = localStorage.getItem('equathora_cookie_consent_date') || '';
                const cookieConsentValue = userSettings?.cookie_consent || legacyCookieConsent || 'none';
                const cookieConsentDate = cookieConsentValue === 'none'
                    ? ''
                    : (userSettings?.cookie_consent_date || legacyCookieConsentDate || new Date().toISOString());

                if (!userSettings?.cookie_consent && (legacyCookieConsent === 'accepted' || legacyCookieConsent === 'declined')) {
                    await saveUserSettings({
                        ...userSettings,
                        cookie_consent: cookieConsentValue,
                        cookie_consent_date: cookieConsentDate || new Date().toISOString(),
                    });
                }

                setSettings(prev => ({
                    ...prev,
                    ...userSettings,
                    cookie_consent: cookieConsentValue,
                    cookie_consent_date: cookieConsentDate,
                    theme: resolvedPreference,
                    email_notifications: isBriefsSubscribed,
                }));
                setCookieConsent(cookieConsentValue);
                setThemePreference(resolvedPreference, { persist: true });

                const sess = await getCurrentSession();
                setCurrentSession(sess);
            } catch (error) {
                console.error('Error loading settings:', error);
                showToast('Could not load some of your settings. Try refreshing.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // ========================================================================
    // ACCOUNT HANDLERS
    // ========================================================================
    const handleChangeEmail = async () => {
        if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
            showToast('That email matches your current one.', 'error');
            return;
        }

        setEmailSaving(true);
        try {
            const result = await changeEmail(newEmail);
            showToast(result.message, result.success ? 'success' : 'error');
            if (result.success) setNewEmail('');
        } catch (error) {
            showToast(error.message || 'Could not update your email.', 'error');
        } finally {
            setEmailSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters.', 'error');
            return;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            showToast('Password must include uppercase, lowercase, and a number.', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        setPasswordSaving(true);
        try {
            const result = await changePassword(newPassword);
            if (result.success) {
                showToast('Password changed successfully.', 'success');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                showToast(result.message, 'error');
            }
        } catch (error) {
            showToast(error.message || 'Could not change your password.', 'error');
        } finally {
            setPasswordSaving(false);
        }
    };

    // ========================================================================
    // LEARNING / ONBOARDING
    // ========================================================================
    const handleRetakeOnboarding = async () => {
        setRetaking(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await supabase
                    .from('student_profile')
                    .update({ onboarding_completed: false })
                    .eq('id', session.user.id);
            }
            navigate('/getStarted');
        } catch (error) {
            showToast(error.message || 'Could not start the quiz. Try again.', 'error');
        } finally {
            setRetaking(false);
            setShowRetakeModal(false);
        }
    };

    // ========================================================================
    // SETTINGS HANDLERS
    // ========================================================================
    const handleSettingChange = async (key, value) => {
        const previousValue = settings[key];
        const nextSettings = { ...settings, [key]: value };

        if (key === 'theme') {
            setThemePreference(value, { persist: true });
        }

        setSettings(nextSettings);
        setSettingsSaving(true);

        try {
            const success = await saveUserSettings(nextSettings);
            if (!success) throw new Error('Failed to save preference.');
            showToast('Preferences updated.', 'success');
        } catch (error) {
            setSettings(prev => ({ ...prev, [key]: previousValue }));
            if (key === 'theme') {
                setThemePreference(previousValue, { persist: true });
            }
            showToast(error?.message || 'Could not save preference.', 'error');
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleEmailNotificationsToggle = async (enabled) => {
        const previousValue = settings.email_notifications;
        const nextSettings = { ...settings, email_notifications: enabled };

        // Optimistic UI update
        setSettings(prev => ({ ...prev, email_notifications: enabled }));
        setSettingsSaving(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Please sign in again and retry.');

            const accountEmail = String(session.user.email || '').trim().toLowerCase();

            if (enabled) {
                const fallbackName = accountEmail.split('@')[0];

                const accountName = String(
                    profileSummary?.full_name ||
                    session.user.user_metadata?.full_name ||
                    session.user.user_metadata?.name ||
                    fallbackName
                ).trim();

                // Pass both 'name' and 'full_name' for compatibility
                await subscribeToEquathoraBriefs({
                    name: accountName,
                    full_name: accountName,
                    email: accountEmail,
                    user_id: session.user.id,
                });
            } else {
                await unsubscribeFromEquathoraBriefs();
            }

            const settingsSaved = await saveUserSettings(nextSettings);

            if (!settingsSaved) {
                // Rollback optimistic update
                setSettings(prev => ({ ...prev, email_notifications: previousValue }));
                showToast(
                    enabled
                        ? 'Subscribed, but your preference could not be saved.'
                        : 'Unsubscribed, but your preference could not be saved.',
                    'warning'
                );
                return;
            }

            showToast(
                enabled
                    ? 'Subscribed to Equathora Briefs.'
                    : 'Unsubscribed from Equathora Briefs.',
                'success'
            );
        } catch (error) {
            // Rollback state on error
            setSettings(prev => ({
                ...prev,
                email_notifications: previousValue,
            }));

            showToast(
                error.message || 'Could not update email notification preference.',
                'error'
            );
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleCookieConsentToggle = async (enabled) => {
        const previousValue = cookieConsent;
        const previousDate = settings.cookie_consent_date;
        const nextCookieConsent = enabled ? 'accepted' : 'declined';
        const nextCookieConsentDate = new Date().toISOString();
        const nextSettings = {
            ...settings,
            cookie_consent: nextCookieConsent,
            cookie_consent_date: nextCookieConsentDate,
        };

        setCookieConsent(nextCookieConsent);
        setSettings(prev => ({ ...prev, cookie_consent: nextCookieConsent, cookie_consent_date: nextCookieConsentDate }));
        setSettingsSaving(true);

        try {
            const settingsSaved = await saveUserSettings(nextSettings);
            if (!settingsSaved) {
                showToast('Preference registered but could not save to your account.', 'warning');
                return;
            }
            showToast(
                enabled ? 'All cookies enabled.' : 'Optional cookies disabled — essential only.',
                'success'
            );
        } catch (error) {
            setCookieConsent(previousValue);
            setSettings(prev => ({ ...prev, cookie_consent: previousValue, cookie_consent_date: previousDate }));
            showToast(error?.message || 'Could not update cookie preference.', 'error');
        } finally {
            setSettingsSaving(false);
        }
    };

    // ========================================================================
    // SESSION HANDLERS
    // ========================================================================
    const handleSignOutOthers = async () => {
        setSessionLoading(true);
        try {
            const result = await signOutAllOtherSessions();
            showToast(result.message, result.success ? 'success' : 'error');
        } catch (error) {
            showToast(error.message || 'Could not sign out other sessions.', 'error');
        } finally {
            setSessionLoading(false);
        }
    };

    // ========================================================================
    // DANGER ZONE HANDLERS
    // ========================================================================

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const result = await requestAccountDeletion();
            if (result.success) {
                showToast(result.message || 'Deletion requested.', 'success');
                setShowDeleteModal(false);
                setTimeout(() => navigate('/'), 2000);
            } else {
                showToast(result.message || 'Could not request account deletion.', 'error');
            }
        } catch (error) {
            showToast(error.message || 'Could not request account deletion.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDeletion = async () => {
        setIsCancelingDeletion(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Please sign in again and retry.');

            const { error } = await supabase
                .from('profiles')
                .update({ deletion_requested: false, deletion_requested_at: null })
                .eq('id', session.user.id);

            if (error) throw error;

            setProfileSummary(prev => ({ ...prev, deletionRequested: false, deletionRequestedAt: null }));
            showToast('Account deletion canceled.', 'success');
        } catch (error) {
            showToast(error.message || 'Could not cancel account deletion.', 'error');
        } finally {
            setIsCancelingDeletion(false);
        }
    };

    // ========================================================================
    // SCROLL TO SECTION
    // ========================================================================
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const resolvedTheme = resolveThemePreference(settings.theme);

    const learningChips = [];
    if (learningProfile?.goal) learningChips.push(GOAL_LABELS[learningProfile.goal] || learningProfile.goal);
    if (learningProfile?.level) learningChips.push(LEVEL_LABELS[learningProfile.level] || learningProfile.level);
    if (learningProfile?.weekly_commitment) learningChips.push(WEEKLY_LABELS[learningProfile.weekly_commitment] || learningProfile.weekly_commitment);
    if (learningProfile?.preferred_challenge) learningChips.push(CHALLENGE_LABELS[learningProfile.preferred_challenge] || learningProfile.preferred_challenge);

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <>
            <Navbar />
            <main className="min-h-screen flex flex-col bg-[linear-gradient(360deg,var(--mid-main-secondary)15%,var(--main-color))] bg-fixed text-[var(--secondary-color)] font-[Sansation,sans-serif]">
                {/* Header */}
                <div className="flex flex-col items-center w-full gap-2 px-4 pt-8 pb-4">
                    <h1 className="text-4xl font-bold">Settings</h1>
                    <p className="text-md text-[var(--secondary-color)] text-center md:text-left">Manage your account, security, and preferences</p>
                </div>

                {/* Content wrapper */}
                <div className="w-full flex flex-col lg:flex-row gap-6 px-4 sm:px-8 lg:px-16 xl:px-24 pb-12 max-w-[1500px] self-center flex-1">
                    {/* Sidebar (desktop) */}
                    <nav className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24 self-start bg-[var(--white)] rounded-md">
                        {sidebarSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                title={section.label}
                                className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition-all text-left cursor-pointer ${activeSection === section.id
                                    ? 'bg-[var(--accent-color)] text-white'
                                    : 'bg-[var(--white)] text-[var(--secondary-color)] hover:bg-[var(--secondary-color)] hover:text-[var(--main-color)]'
                                    }`}
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    {/* Mobile tabs */}
                    <div className="flex gap-2 pb-2 overflow-x-auto lg:hidden scrollbar-none">
                        {sidebarSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                title={section.label}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${activeSection === section.id
                                    ? 'bg-[var(--accent-color)] text-white'
                                    : 'bg-[var(--surface-card)] text-[var(--secondary-color)] border border-[var(--mid-main-secondary)] hover:bg-[var(--secondary-color)] hover:text-[var(--main-color)]'
                                    }`}
                            >
                                {section.icon}
                                {section.label}
                            </button>
                        ))}
                    </div>

                    {/* Main sections */}
                    <div className="flex flex-col gap-6 flex-1 min-w-0 rounded-md">

                        {/* ============================================================ */}
                        {/* PROFILE (read-only summary — editing happens on the public   */}
                        {/* profile page, so this doesn't duplicate that form)            */}
                        {/* ============================================================ */}
                        <SectionCard id="profile">
                            <SectionTitle sub="Your public identity on Equathora">Profile</SectionTitle>

                            <div className="flex items-center justify-between gap-4 flex-wrap bg-[var(--main-color)] rounded-md px-4 py-4">
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-lg font-bold truncate">{profileSummary.full_name || 'Unnamed'}</span>
                                        <Chip>{profileSummary.role === 'admin' ? 'Admin' : 'Student'}</Chip>
                                    </div>
                                    <span className="text-sm text-[var(--mid-main-secondary)]">@{profileSummary.username || 'no-username'}</span>
                                    {profileSummary.bio && (
                                        <p className="text-xs text-[var(--mid-main-secondary)] line-clamp-2 pt-1">{profileSummary.bio}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <PrimaryButton onClick={() => navigate('/profile/myprofile')}>
                                        Edit Profile
                                    </PrimaryButton>
                                </div>
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* ACCOUNT & SECURITY */}
                        {/* ============================================================ */}
                        <SectionCard id="account">
                            <SectionTitle sub="Manage your email, password, and security settings">Account & Security</SectionTitle>

                            <div className="flex flex-col gap-1 bg-[var(--main-color)] rounded-md px-4 py-3">
                                <span className="text-xs font-semibold text-[var(--mid-main-secondary)]">Current email</span>
                                <span className="text-sm font-bold">{currentEmail}</span>
                                {authProvider !== 'email' && (
                                    <span className="text-xs text-[var(--mid-main-secondary)] font-semibold">
                                        Signed in via {authProvider === 'google' ? 'Google' : authProvider}
                                    </span>
                                )}
                            </div>

                            {authProvider === 'email' && (
                                <div className="flex flex-col gap-3 border-t border-[var(--mid-main-secondary)] pt-4">
                                    <h3 className="text-base font-bold">Change Email</h3>
                                    <InputField
                                        label="New Email Address"
                                        type="email"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        placeholder="newemail@example.com"
                                    />
                                    <PrimaryButton onClick={handleChangeEmail} loading={emailSaving} className="self-start">
                                        Update Email
                                    </PrimaryButton>
                                </div>
                            )}

                            {authProvider === 'email' && (
                                <div className="flex flex-col gap-3 border-t border-[var(--mid-main-secondary)] pt-4">
                                    <h3 className="text-base font-bold">Change Password</h3>
                                    <p className="text-xs text-[var(--mid-main-secondary)]">
                                        Minimum 8 characters with uppercase, lowercase, and a number.
                                    </p>
                                    <InputField
                                        label="New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    <InputField
                                        label="Confirm New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--mid-main-secondary)]">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="accent-[var(--accent-color)]"
                                        />
                                        Show passwords
                                    </label>
                                    <PrimaryButton onClick={handleChangePassword} loading={passwordSaving} className="self-start">
                                        Change Password
                                    </PrimaryButton>
                                </div>
                            )}

                            {authProvider !== 'email' && (
                                <div className="flex flex-col gap-2 border-t border-[var(--mid-main-secondary)] pt-4">
                                    <p className="text-sm text-[var(--mid-main-secondary)]">
                                        Your account is managed through {authProvider === 'google' ? 'Google' : authProvider}.
                                        Email and password changes must be made through your provider.
                                    </p>
                                </div>
                            )}
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* LEARNING / ONBOARDING */}
                        {/* ============================================================ */}
                        <SectionCard id="learning">
                            <SectionTitle sub="Retake the onboarding quiz any time your goals or level change">Learning Preferences</SectionTitle>

                            {learningChips.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {learningChips.map(chip => <Chip key={chip}>{chip}</Chip>)}
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--mid-main-secondary)]">You haven't completed the onboarding quiz yet.</p>
                            )}

                            <div>
                                <PrimaryButton onClick={() => setShowRetakeModal(true)}>
                                    Retake Onboarding Quiz
                                </PrimaryButton>
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* NOTIFICATION PREFERENCES */}
                        {/* ============================================================ */}
                        <SectionCard id="notifications">
                            <SectionTitle sub="Choose which notifications you want to receive">Notification Preferences</SectionTitle>

                            <div className="flex flex-col gap-1">
                                <ToggleSwitch
                                    label="Enable Notifications"
                                    description="Master toggle for all in-app notifications"
                                    checked={settings.notifications_enabled}
                                    onChange={v => handleSettingChange('notifications_enabled', v)}
                                />

                                <div className={`flex flex-col gap-1 transition-opacity ${!settings.notifications_enabled ? 'opacity-40 pointer-events-none' : ''}`}>
                                    <div className="border-t border-[var(--mid-main-secondary)] pt-2">
                                        <ToggleSwitch
                                            label="Achievement Alerts"
                                            description="Notified when you unlock a new achievement"
                                            checked={settings.achievement_notifications}
                                            onChange={v => handleSettingChange('achievement_notifications', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                        <ToggleSwitch
                                            label="Streak Reminders"
                                            description="Reminded to solve a problem to keep your streak"
                                            checked={settings.streak_reminders}
                                            onChange={v => handleSettingChange('streak_reminders', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                        <ToggleSwitch
                                            label="Friend Activity"
                                            description="Friend requests and social updates"
                                            checked={settings.friend_notifications}
                                            onChange={v => handleSettingChange('friend_notifications', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                        <ToggleSwitch
                                            label="Leaderboard Updates"
                                            description="Rank changes on leaderboards"
                                            checked={settings.leaderboard_notifications}
                                            onChange={v => handleSettingChange('leaderboard_notifications', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                        <ToggleSwitch
                                            label="New Problems"
                                            description="Get notified when new problems are added"
                                            checked={settings.problem_notifications}
                                            onChange={v => handleSettingChange('problem_notifications', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                        <ToggleSwitch
                                            label="System Updates"
                                            description="Platform announcements and maintenance notices"
                                            checked={settings.system_updates}
                                            onChange={v => handleSettingChange('system_updates', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                    </div>

                                    <div className="border-t border-[var(--mid-main-secondary)] pt-3">
                                        <ToggleSwitch
                                            label="Email Notifications"
                                            description="Receive important updates via email (weekly digest)"
                                            checked={settings.email_notifications}
                                            onChange={handleEmailNotificationsToggle}
                                            disabled={!settings.notifications_enabled || settingsSaving}
                                        />
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* APPEARANCE */}
                        {/* ============================================================ */}
                        <SectionCard id="appearance">
                            <SectionTitle sub="Control how Equathora looks on this device">Appearance</SectionTitle>

                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 flex-wrap">
                                    {THEME_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleSettingChange('theme', opt.value)}
                                            aria-pressed={settings.theme === opt.value}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-md border-2 text-sm font-semibold transition-all cursor-pointer ${settings.theme === opt.value
                                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)] text-white'
                                                : 'border-[var(--mid-main-secondary)] bg-[var(--surface-card)] text-[var(--secondary-color)] hover:border-[var(--accent-color)]'
                                                }`}
                                        >
                                            {opt.icon}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                {settings.theme === 'system' && (
                                    <p className="text-xs text-[var(--mid-main-secondary)]">
                                        Currently following your device preference: <span className="font-semibold text-[var(--secondary-color)]">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>.
                                    </p>
                                )}
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* PRIVACY */}
                        {/* ============================================================ */}
                        <SectionCard id="privacy">
                            <SectionTitle sub="Control what others can see about you">Privacy Controls</SectionTitle>

                            <div className="flex flex-col gap-1">
                                <ToggleSwitch
                                    label="Public Profile"
                                    description="Allow others to view your profile page"
                                    checked={settings.privacy_profile_public}
                                    onChange={v => handleSettingChange('privacy_profile_public', v)}
                                />
                                <ToggleSwitch
                                    label="Show Streak"
                                    description="Display your current streak on your public profile"
                                    checked={settings.privacy_show_streak}
                                    onChange={v => handleSettingChange('privacy_show_streak', v)}
                                />
                                <ToggleSwitch
                                    label="Show Leaderboard Rank"
                                    description="Show your rank on public leaderboards"
                                    checked={settings.privacy_show_leaderboard}
                                    onChange={v => handleSettingChange('privacy_show_leaderboard', v)}
                                />
                                <ToggleSwitch
                                    label="Show Achievements"
                                    description="Let others see your earned badges and achievements"
                                    checked={settings.privacy_show_achievements}
                                    onChange={v => handleSettingChange('privacy_show_achievements', v)}
                                />
                            </div>

                            <div className="flex flex-col gap-3 border-t border-[var(--mid-main-secondary)] pt-4">
                                <h3 className="text-base font-bold">Data & Cookies</h3>
                                <p className="text-xs text-[var(--mid-main-secondary)]">
                                    We use essential cookies for authentication and localStorage for offline progress tracking.
                                    Optional cookies are used for analytics and personalization.
                                    Read our full{' '}
                                    <Link to="/privacy-policy" className="text-[var(--accent-color)] hover:underline">Privacy Policy</Link>{' '}
                                    and{' '}
                                    <Link to="/cookie-policy" className="text-[var(--accent-color)] hover:underline">Cookie Policy</Link>.
                                </p>

                                <ToggleSwitch
                                    label="Allow Analytics & Personalization Cookies"
                                    description={
                                        cookieConsent === 'accepted'
                                            ? 'All cookies are enabled - analytics and personalization data is collected'
                                            : 'Only essential cookies are active - no analytics or personalization data is collected'
                                    }
                                    checked={cookieConsent === 'accepted'}
                                    onChange={handleCookieConsentToggle}
                                />

                                <div className="flex items-center gap-2 pt-1">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cookieConsent === 'accepted'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cookieConsent === 'accepted' ? 'bg-green-500' : 'bg-amber-500'
                                            }`} />
                                        {cookieConsent === 'accepted' ? 'All Cookies Accepted' : 'Essential Only'}
                                    </span>
                                    {cookieConsent !== 'none' && (
                                        <span className="text-[10px] text-[var(--mid-main-secondary)]">
                                            Set on {settings.cookie_consent_date ? new Date(settings.cookie_consent_date).toLocaleDateString() : 'recently'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* SUBSCRIPTION */}
                        {/* ============================================================ */}
                        <SectionCard id="subscription">
                            <SectionTitle sub="Manage your Equathora plan">Subscription</SectionTitle>

                            <div className="flex items-center justify-between gap-4 flex-wrap bg-[var(--main-color)] rounded-md px-4 py-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-[var(--mid-main-secondary)] uppercase tracking-wide">Current plan</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold">{PLAN_LABELS[subscription.tier] || 'Free'}</span>
                                        {subscription.tier !== 'free' && <IconCrown />}
                                    </div>
                                    {subscription.tier !== 'free' && subscription.renewsAt && (
                                        <span className="text-xs text-[var(--mid-main-secondary)]">
                                            Renews on {new Date(subscription.renewsAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>

                                {subscription.tier === 'free' ? (
                                    <PrimaryButton onClick={() => navigate('/premium')}>
                                        Upgrade Plan
                                    </PrimaryButton>
                                ) : (
                                    <OutlineButton onClick={() => navigate('/premium')}>
                                        Manage Billing
                                    </OutlineButton>
                                )}
                            </div>

                            <p className="text-xs text-[var(--mid-main-secondary)]">
                                Premium unlocks AI step-by-step checking, detailed explanations, and solution verification.
                            </p>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* SESSIONS */}
                        {/* ============================================================ */}
                        <SectionCard id="sessions">
                            <SectionTitle sub="View and manage your active sessions">Active Sessions</SectionTitle>

                            {currentSession ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start gap-4 bg-[var(--main-color)] rounded-md px-4 py-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full shrink-0">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0 gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">Current Session</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
                                            </div>
                                            <span className="text-xs text-[var(--mid-main-secondary)] truncate">
                                                {currentSession.user_agent?.substring(0, 80)}...
                                            </span>
                                            <span className="text-xs text-[var(--mid-main-secondary)]">
                                                Last active: {new Date(currentSession.last_active).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--mid-main-secondary)]">Unable to load session information.</p>
                            )}

                            <div className="flex items-center gap-3">
                                <PrimaryButton onClick={handleSignOutOthers} loading={sessionLoading}>
                                    Sign Out Other Sessions
                                </PrimaryButton>
                            </div>

                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                <h3 className="text-base font-bold">Security Tips</h3>
                                <ul className="text-xs text-[var(--mid-main-secondary)] flex flex-col gap-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--accent-color)] font-bold shrink-0">•</span>
                                        Use a strong, unique password for your Equathora account
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--accent-color)] font-bold shrink-0">•</span>
                                        Sign out from shared or public devices after each session
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--accent-color)] font-bold shrink-0">•</span>
                                        Regularly review your active sessions and revoke unknown ones
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--accent-color)] font-bold shrink-0">•</span>
                                        Never share your password with anyone, including mentors
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[var(--accent-color)] font-bold shrink-0">•</span>
                                        If you suspect unauthorized access, change your password immediately
                                    </li>
                                </ul>
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* DANGER ZONE */}
                        {/* ============================================================ */}
                        {1 === 0 && <SectionCard id="danger">
                            <SectionTitle sub="Irreversible actions - proceed with extreme caution">Danger Zone</SectionTitle>

                            {/* Delete Account / Cancel scheduled deletion */}
                            {profileSummary.deletionRequested ? (
                                <div className="flex flex-col gap-3 p-5 border-2 border-red-200 rounded-md bg-red-50">
                                    <h3 className="text-base font-bold text-red-800">Account Deletion Scheduled</h3>
                                    <p className="text-sm text-[var(--dark-accent-color)]">
                                        You requested to delete your account
                                        {profileSummary.deletionRequestedAt
                                            ? ` on ${new Date(profileSummary.deletionRequestedAt).toLocaleDateString()}`
                                            : ''}. Your data will be permanently removed. You can cancel this any time before then.
                                    </p>
                                    <DangerButton onClick={handleCancelDeletion} loading={isCancelingDeletion}>
                                        Cancel Deletion
                                    </DangerButton>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 p-5 border-2 border-red-200 rounded-md bg-red-50">
                                    <h3 className="text-base font-bold text-red-800">Delete Account</h3>
                                    <p className="text-sm text-red-700">
                                        This will permanently remove your account and all associated data.
                                        You will be signed out immediately and your data will be deleted within 30 days.
                                    </p>
                                    <DangerButton onClick={() => setShowDeleteModal(true)}>
                                        Delete Account
                                    </DangerButton>
                                </div>
                            )}
                        </SectionCard>}
                        
                        
                    </div>
                </div>
            </main>
            <Footer />

            <Toast toast={toast} />

            <ConfirmModal
                isOpen={showRetakeModal}
                onClose={() => setShowRetakeModal(false)}
                onConfirm={handleRetakeOnboarding}
                loading={retaking}
                variant="warning"
                title="Retake onboarding quiz?"
                description="Your current goal, level, weekly commitment, and topic preferences will be replaced once you finish the new quiz. This won't affect your solved problems or XP."
                confirmLabel="Retake Quiz"
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                loading={isDeleting}
                variant="danger"
                title="Delete your account?"
                description="This permanently removes your account and all associated data within 30 days. You'll be signed out immediately. You can cancel any time before deletion completes."
                confirmWord="DELETE"
                confirmLabel="Delete Account"
            />
        </>
    );
};

export default Settings;