import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { resetAllUserProgress } from '../lib/progressStorage';
import {
    getUserSettings,
    saveUserSettings,
    changePassword,
    changeEmail,
    requestAccountDeletion,
    getCurrentSession,
    signOutAllOtherSessions,
} from '../lib/notificationService';

// ============================================================================
// REUSABLE UI PIECES
// ============================================================================

const SectionCard = ({ children, id }) => (
    <section
        id={id}
        className="bg-white rounded-md w-full flex flex-col gap-6 p-6 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
    >
        {children}
    </section>
);

const SectionTitle = ({ children, sub }) => (
    <div className="flex flex-col gap-1">
        <h2 className="font-[Sansation,sans-serif] font-bold text-xl lg:text-2xl text-[var(--secondary-color)]">
            {children}
        </h2>
        {sub && <p className="text-sm text-[var(--french-gray)]">{sub}</p>}
    </div>
);

const InputField = ({ label, description, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--secondary-color)]">{label}</label>
        {description && <p className="text-xs text-[var(--french-gray)]">{description}</p>}
        <input
            {...props}
            className="text-sm border rounded-md px-4 py-3 w-full border-[var(--french-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all font-[Sansation,sans-serif]"
        />
    </div>
);

const TextArea = ({ label, description, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--secondary-color)]">{label}</label>
        {description && <p className="text-xs text-[var(--french-gray)]">{description}</p>}
        <textarea
            {...props}
            className="text-sm border rounded-md px-4 py-3 w-full border-[var(--french-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all font-[Sansation,sans-serif] resize-none h-28"
        />
    </div>
);

const SelectField = ({ label, description, options, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[var(--secondary-color)]">{label}</label>
        {description && <p className="text-xs text-[var(--french-gray)]">{description}</p>}
        <select
            {...props}
            className="text-sm cursor-pointer px-4 py-3 border rounded-md border-[var(--french-gray)] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all font-[Sansation,sans-serif] bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%23333%22%20stroke-width%3d%222%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.2em]"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const ToggleSwitch = ({ label, description, checked, onChange, disabled = false }) => (
    <div className="flex items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-semibold text-[var(--secondary-color)]">{label}</span>
            {description && <span className="text-xs text-[var(--french-gray)]">{description}</span>}
        </div>
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${checked ? 'bg-[var(--accent-color)]' : 'bg-gray-300'}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 translate-y-0.5 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
            />
        </button>
    </div>
);

const PrimaryButton = ({ children, onClick, disabled, loading, className = '' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`cursor-pointer py-2.5 px-5 bg-[var(--accent-color)] text-white font-bold text-sm rounded-md hover:bg-[var(--dark-accent-color)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
        {loading && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        )}
        {children}
    </button>
);

const DangerButton = ({ children, onClick, disabled, loading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="cursor-pointer py-2.5 px-5 bg-red-600 text-white font-bold text-sm rounded-md hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
        {loading && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        )}
        {children}
    </button>
);

const StatusBanner = ({ message, type = 'success' }) => {
    if (!message) return null;
    const colors = {
        success: 'bg-green-50 text-green-800 border-green-200',
        error: 'bg-red-50 text-red-800 border-red-200',
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`text-sm px-4 py-3 rounded-md border ${colors[type]} font-[Sansation,sans-serif]`}
        >
            {message}
        </motion.div>
    );
};

// ============================================================================
// SIDEBAR NAVIGATION
// ============================================================================

const sidebarSections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account & Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
    { id: 'sessions', label: 'Sessions', icon: '💻' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
];

// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

const Settings = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile');
    const [isLoading, setIsLoading] = useState(true);

    // Profile state
    const [profileData, setProfileData] = useState({
        full_name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        seniority: 'absBeginner',
    });
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ text: '', type: 'success' });

    // Account state
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailSaving, setEmailSaving] = useState(false);
    const [emailMessage, setEmailMessage] = useState({ text: '', type: 'success' });

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ text: '', type: 'success' });

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
        two_factor_enabled: false,
        session_timeout_minutes: 60,
    });
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [settingsMessage, setSettingsMessage] = useState({ text: '', type: 'success' });

    // Session state
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionMessage, setSessionMessage] = useState({ text: '', type: 'success' });

    // Danger zone
    const [isResetting, setIsResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState({ text: '', type: 'success' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState({ text: '', type: 'success' });
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // Password visibility
    const [showPassword, setShowPassword] = useState(false);

    // ========================================================================
    // LOAD USER DATA ON MOUNT
    // ========================================================================
    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    navigate('/login');
                    return;
                }

                setCurrentEmail(session.user.email || '');

                // Detect auth provider
                const provider = session.user.app_metadata?.provider || 'email';
                setAuthProvider(provider);

                // Fetch profile from profiles table
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, username, bio, location, website, seniority')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (profile) {
                    setProfileData({
                        full_name: profile.full_name || session.user.user_metadata?.full_name || '',
                        username: profile.username || '',
                        bio: profile.bio || '',
                        location: profile.location || '',
                        website: profile.website || '',
                        seniority: profile.seniority || 'absBeginner',
                    });
                } else {
                    setProfileData(prev => ({
                        ...prev,
                        full_name: session.user.user_metadata?.full_name || '',
                        username: session.user.user_metadata?.username || '',
                    }));
                }

                // Fetch user settings
                const userSettings = await getUserSettings();
                setSettings(prev => ({ ...prev, ...userSettings }));

                // Fetch session info
                const sess = await getCurrentSession();
                setCurrentSession(sess);
            } catch (error) {
                console.error('Error loading settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    // ========================================================================
    // PROFILE HANDLERS
    // ========================================================================
    const handleSaveProfile = async () => {
        setProfileSaving(true);
        setProfileMessage({ text: '', type: 'success' });

        if (!profileData.full_name.trim() || profileData.full_name.trim().length < 2) {
            setProfileMessage({ text: 'Name must be at least 2 characters.', type: 'error' });
            setProfileSaving(false);
            return;
        }

        if (profileData.username && !/^[a-zA-Z0-9_]{3,20}$/.test(profileData.username)) {
            setProfileMessage({ text: 'Username must be 3–20 characters, letters, numbers, and underscores only.', type: 'error' });
            setProfileSaving(false);
            return;
        }

        if (profileData.website && !/^https?:\/\/.+/i.test(profileData.website)) {
            setProfileMessage({ text: 'Website must start with http:// or https://', type: 'error' });
            setProfileSaving(false);
            return;
        }

        if (profileData.bio && profileData.bio.length > 300) {
            setProfileMessage({ text: 'Bio must be 300 characters or less.', type: 'error' });
            setProfileSaving(false);
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            // Check username uniqueness
            if (profileData.username) {
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('username', profileData.username)
                    .neq('id', session.user.id)
                    .maybeSingle();

                if (existing) {
                    setProfileMessage({ text: 'This username is already taken.', type: 'error' });
                    setProfileSaving(false);
                    return;
                }
            }

            // Update profiles table
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: session.user.id,
                    full_name: profileData.full_name.trim(),
                    username: profileData.username.trim(),
                    bio: profileData.bio.trim(),
                    location: profileData.location.trim(),
                    website: profileData.website.trim(),
                    seniority: profileData.seniority,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' });

            if (error) throw error;

            // Also update auth metadata for consistency
            await supabase.auth.updateUser({
                data: {
                    full_name: profileData.full_name.trim(),
                    username: profileData.username.trim(),
                },
            });

            setProfileMessage({ text: 'Profile saved successfully.', type: 'success' });
            setTimeout(() => setProfileMessage({ text: '', type: 'success' }), 4000);
        } catch (error) {
            setProfileMessage({ text: error.message || 'Failed to save profile.', type: 'error' });
        } finally {
            setProfileSaving(false);
        }
    };

    // ========================================================================
    // EMAIL HANDLER
    // ========================================================================
    const handleChangeEmail = async () => {
        setEmailSaving(true);
        setEmailMessage({ text: '', type: 'success' });

        if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            setEmailMessage({ text: 'Please enter a valid email address.', type: 'error' });
            setEmailSaving(false);
            return;
        }

        if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
            setEmailMessage({ text: 'New email is the same as your current email.', type: 'error' });
            setEmailSaving(false);
            return;
        }

        try {
            const result = await changeEmail(newEmail);
            if (result.success) {
                setEmailMessage({ text: result.message, type: 'success' });
                setNewEmail('');
            } else {
                setEmailMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            setEmailMessage({ text: error.message, type: 'error' });
        } finally {
            setEmailSaving(false);
        }
    };

    // ========================================================================
    // PASSWORD HANDLER
    // ========================================================================
    const handleChangePassword = async () => {
        setPasswordSaving(true);
        setPasswordMessage({ text: '', type: 'success' });

        if (newPassword.length < 8) {
            setPasswordMessage({ text: 'Password must be at least 8 characters.', type: 'error' });
            setPasswordSaving(false);
            return;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            setPasswordMessage({ text: 'Password must include uppercase, lowercase, and a number.', type: 'error' });
            setPasswordSaving(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ text: 'Passwords do not match.', type: 'error' });
            setPasswordSaving(false);
            return;
        }

        try {
            const result = await changePassword(newPassword);
            if (result.success) {
                setPasswordMessage({ text: 'Password changed successfully.', type: 'success' });
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setPasswordMessage({ text: '', type: 'success' }), 4000);
            } else {
                setPasswordMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            setPasswordMessage({ text: error.message, type: 'error' });
        } finally {
            setPasswordSaving(false);
        }
    };

    // ========================================================================
    // SETTINGS HANDLERS
    // ========================================================================
    const handleSettingChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveSettings = async () => {
        setSettingsSaving(true);
        setSettingsMessage({ text: '', type: 'success' });

        try {
            const success = await saveUserSettings(settings);
            if (success) {
                setSettingsMessage({ text: 'Preferences saved.', type: 'success' });
                setTimeout(() => setSettingsMessage({ text: '', type: 'success' }), 4000);
            } else {
                setSettingsMessage({ text: 'Failed to save preferences.', type: 'error' });
            }
        } catch (error) {
            setSettingsMessage({ text: error.message, type: 'error' });
        } finally {
            setSettingsSaving(false);
        }
    };

    // ========================================================================
    // SESSION HANDLERS
    // ========================================================================
    const handleSignOutOthers = async () => {
        setSessionLoading(true);
        setSessionMessage({ text: '', type: 'success' });

        try {
            const result = await signOutAllOtherSessions();
            setSessionMessage({ text: result.message, type: result.success ? 'success' : 'error' });
            setTimeout(() => setSessionMessage({ text: '', type: 'success' }), 4000);
        } catch (error) {
            setSessionMessage({ text: error.message, type: 'error' });
        } finally {
            setSessionLoading(false);
        }
    };

    // ========================================================================
    // DANGER ZONE HANDLERS
    // ========================================================================
    const handleResetProgress = async () => {
        if (!window.confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) return;
        if (!window.confirm('This will delete all your solved problems, streaks, XP, and achievements. Are you absolutely sure?')) return;

        setIsResetting(true);
        setResetMessage({ text: 'Resetting progress...', type: 'info' });

        try {
            const result = await resetAllUserProgress();
            if (result.success) {
                setResetMessage({ text: 'Progress reset successfully. Redirecting...', type: 'success' });
                setTimeout(() => {
                    navigate('/dashboard');
                    window.location.reload();
                }, 1500);
            } else {
                setResetMessage({ text: `Reset failed: ${result.message}`, type: 'error' });
            }
        } catch (error) {
            setResetMessage({ text: `Error: ${error.message}`, type: 'error' });
        } finally {
            setIsResetting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setDeleteMessage({ text: 'Type DELETE to confirm account deletion.', type: 'error' });
            return;
        }

        if (!window.confirm('This will permanently delete your account and all associated data. This CANNOT be undone. Continue?')) return;

        setIsDeleting(true);
        setDeleteMessage({ text: 'Processing request...', type: 'info' });

        try {
            const result = await requestAccountDeletion();
            if (result.success) {
                setDeleteMessage({ text: result.message, type: 'success' });
                setTimeout(() => navigate('/'), 3000);
            } else {
                setDeleteMessage({ text: result.message, type: 'error' });
            }
        } catch (error) {
            setDeleteMessage({ text: error.message, type: 'error' });
        } finally {
            setIsDeleting(false);
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

    // ========================================================================
    // RENDER
    // ========================================================================
    if (isLoading) {
        return (
            <div>
                <Navbar />
                <main className="min-h-screen flex items-center justify-center bg-[var(--main-color)]">
                    <div className="flex flex-col items-center gap-4">
                        <svg className="animate-spin h-10 w-10 text-[var(--accent-color)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-[var(--secondary-color)] font-[Sansation,sans-serif]">Loading settings...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main className="min-h-screen flex flex-col bg-[linear-gradient(180deg,var(--mid-main-secondary),var(--main-color)50%)] text-[var(--secondary-color)] font-[Sansation,sans-serif]">
                {/* Header */}
                <div className="w-full flex flex-col items-center gap-2 pt-8 pb-4 px-4">
                    <h1 className="font-bold text-3xl lg:text-4xl">Settings</h1>
                    <p className="text-sm text-[var(--french-gray)]">Manage your account, security, and preferences</p>
                </div>

                {/* Content wrapper */}
                <div className="w-full flex flex-col lg:flex-row gap-6 px-4 sm:px-8 lg:px-16 xl:px-24 pb-12 max-w-[1200px] self-center flex-1">
                    {/* Sidebar (desktop) */}
                    <nav className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24 self-start">
                        {sidebarSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all text-left cursor-pointer ${activeSection === section.id
                                    ? 'bg-[var(--accent-color)] text-white'
                                    : 'text-[var(--secondary-color)] hover:bg-white/60'
                                    }`}
                            >
                                <span className="text-base">{section.icon}</span>
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    {/* Mobile tabs */}
                    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {sidebarSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${activeSection === section.id
                                    ? 'bg-[var(--accent-color)] text-white'
                                    : 'bg-white text-[var(--secondary-color)] border border-[var(--french-gray)]'
                                    }`}
                            >
                                <span>{section.icon}</span>
                                {section.label}
                            </button>
                        ))}
                    </div>

                    {/* Main sections */}
                    <div className="flex flex-col gap-6 flex-1 min-w-0">

                        {/* ============================================================ */}
                        {/* PROFILE SECTION */}
                        {/* ============================================================ */}
                        <SectionCard id="profile">
                            <SectionTitle sub="Your public identity on Equathora">Profile Information</SectionTitle>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <InputField
                                            label="Full Name"
                                            type="text"
                                            value={profileData.full_name}
                                            onChange={e => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                                            placeholder="Enter your name"
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputField
                                            label="Username"
                                            description="3–20 chars, letters, numbers, underscores"
                                            type="text"
                                            value={profileData.username}
                                            onChange={e => setProfileData(prev => ({ ...prev, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') }))}
                                            placeholder="your_username"
                                            maxLength={20}
                                        />
                                    </div>
                                </div>

                                <TextArea
                                    label="Bio"
                                    description={`${profileData.bio.length}/300 characters`}
                                    value={profileData.bio}
                                    onChange={e => setProfileData(prev => ({ ...prev, bio: e.target.value.slice(0, 300) }))}
                                    placeholder="Tell the world about yourself..."
                                    maxLength={300}
                                />

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <InputField
                                            label="Location"
                                            type="text"
                                            value={profileData.location}
                                            onChange={e => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                            placeholder="City, Country"
                                            maxLength={50}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputField
                                            label="Website"
                                            type="url"
                                            value={profileData.website}
                                            onChange={e => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                                            placeholder="https://yoursite.com"
                                        />
                                    </div>
                                </div>

                                <SelectField
                                    label="Math Level"
                                    description="Helps us personalize your experience"
                                    value={profileData.seniority}
                                    onChange={e => setProfileData(prev => ({ ...prev, seniority: e.target.value }))}
                                    options={[
                                        { value: 'absBeginner', label: 'Absolute Beginner' },
                                        { value: 'beginner', label: 'Beginner' },
                                        { value: 'Intermediate', label: 'Intermediate' },
                                        { value: 'highschool', label: 'High School Student' },
                                        { value: 'undergraduate', label: 'Undergraduate Student' },
                                        { value: 'advanced', label: 'Advanced' },
                                        { value: 'graduate', label: 'Graduate Student' },
                                        { value: 'professional', label: 'Professional' },
                                        { value: 'phd', label: 'PhD' },
                                    ]}
                                />
                            </div>

                            <AnimatePresence>
                                <StatusBanner message={profileMessage.text} type={profileMessage.type} />
                            </AnimatePresence>

                            <div className="flex items-center gap-3">
                                <PrimaryButton onClick={handleSaveProfile} loading={profileSaving}>
                                    Save Profile
                                </PrimaryButton>
                                <Link to="/profile/myprofile" className="text-sm text-[var(--accent-color)] hover:underline font-semibold">
                                    View public profile →
                                </Link>
                            </div>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* ACCOUNT & SECURITY */}
                        {/* ============================================================ */}
                        <SectionCard id="account">
                            <SectionTitle sub="Manage your email, password, and security settings">Account & Security</SectionTitle>

                            {/* Current email */}
                            <div className="flex flex-col gap-1 bg-gray-50 rounded-md px-4 py-3">
                                <span className="text-xs font-semibold text-[var(--french-gray)]">Current email</span>
                                <span className="text-sm font-bold">{currentEmail}</span>
                                {authProvider !== 'email' && (
                                    <span className="text-xs text-[var(--accent-color)] font-semibold">
                                        Signed in via {authProvider === 'google' ? 'Google' : authProvider}
                                    </span>
                                )}
                            </div>

                            {/* Change email */}
                            {authProvider === 'email' && (
                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                                    <h3 className="text-base font-bold">Change Email</h3>
                                    <InputField
                                        label="New Email Address"
                                        type="email"
                                        value={newEmail}
                                        onChange={e => setNewEmail(e.target.value)}
                                        placeholder="newemail@example.com"
                                    />
                                    <AnimatePresence>
                                        <StatusBanner message={emailMessage.text} type={emailMessage.type} />
                                    </AnimatePresence>
                                    <PrimaryButton onClick={handleChangeEmail} loading={emailSaving} className="self-start">
                                        Update Email
                                    </PrimaryButton>
                                </div>
                            )}

                            {/* Change password */}
                            {authProvider === 'email' && (
                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                                    <h3 className="text-base font-bold">Change Password</h3>
                                    <p className="text-xs text-[var(--french-gray)]">
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
                                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--french-gray)]">
                                        <input
                                            type="checkbox"
                                            checked={showPassword}
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="accent-[var(--accent-color)]"
                                        />
                                        Show passwords
                                    </label>
                                    <AnimatePresence>
                                        <StatusBanner message={passwordMessage.text} type={passwordMessage.type} />
                                    </AnimatePresence>
                                    <PrimaryButton onClick={handleChangePassword} loading={passwordSaving} className="self-start">
                                        Change Password
                                    </PrimaryButton>
                                </div>
                            )}

                            {authProvider !== 'email' && (
                                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                                    <p className="text-sm text-[var(--french-gray)]">
                                        Your account is managed through {authProvider === 'google' ? 'Google' : authProvider}.
                                        Email and password changes must be made through your provider.
                                    </p>
                                </div>
                            )}
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
                                    <div className="border-t border-gray-100 pt-2">
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

                                    <div className="border-t border-gray-100 pt-3">
                                        <ToggleSwitch
                                            label="Email Notifications"
                                            description="Receive important updates via email (weekly digest)"
                                            checked={settings.email_notifications}
                                            onChange={v => handleSettingChange('email_notifications', v)}
                                            disabled={!settings.notifications_enabled}
                                        />
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                <StatusBanner message={settingsMessage.text} type={settingsMessage.type} />
                            </AnimatePresence>

                            <PrimaryButton onClick={handleSaveSettings} loading={settingsSaving} className="self-start">
                                Save Preferences
                            </PrimaryButton>
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

                            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                                <h3 className="text-base font-bold">Data & Cookies</h3>
                                <p className="text-xs text-[var(--french-gray)]">
                                    We use essential cookies for authentication and localStorage for offline progress tracking.
                                    Read our full{' '}
                                    <Link to="/privacy-policy" className="text-[var(--accent-color)] hover:underline">Privacy Policy</Link>{' '}
                                    and{' '}
                                    <Link to="/cookie-policy" className="text-[var(--accent-color)] hover:underline">Cookie Policy</Link>.
                                </p>
                            </div>

                            <AnimatePresence>
                                <StatusBanner message={settingsMessage.text} type={settingsMessage.type} />
                            </AnimatePresence>

                            <PrimaryButton onClick={handleSaveSettings} loading={settingsSaving} className="self-start">
                                Save Privacy Settings
                            </PrimaryButton>
                        </SectionCard>

                        {/* ============================================================ */}
                        {/* SESSIONS */}
                        {/* ============================================================ */}
                        <SectionCard id="sessions">
                            <SectionTitle sub="View and manage your active sessions">Active Sessions</SectionTitle>

                            {currentSession ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start gap-4 bg-gray-50 rounded-md px-4 py-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full shrink-0">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold">Current Session</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Active</span>
                                            </div>
                                            <span className="text-xs text-[var(--french-gray)] truncate">
                                                {currentSession.user_agent?.substring(0, 80)}...
                                            </span>
                                            <span className="text-xs text-[var(--french-gray)]">
                                                Last active: {new Date(currentSession.last_active).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-[var(--french-gray)]">Unable to load session information.</p>
                            )}

                            <AnimatePresence>
                                <StatusBanner message={sessionMessage.text} type={sessionMessage.type} />
                            </AnimatePresence>

                            <div className="flex items-center gap-3">
                                <PrimaryButton onClick={handleSignOutOthers} loading={sessionLoading}>
                                    Sign Out Other Sessions
                                </PrimaryButton>
                            </div>

                            <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                                <h3 className="text-base font-bold">Security Tips</h3>
                                <ul className="text-xs text-[var(--french-gray)] flex flex-col gap-1.5">
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
                        <SectionCard id="danger">
                            <SectionTitle sub="Irreversible actions — proceed with extreme caution">Danger Zone</SectionTitle>

                            {/* Reset Progress */}
                            <div className="flex flex-col gap-3 border-2 border-orange-200 bg-orange-50 rounded-md p-5">
                                <h3 className="text-base font-bold text-orange-800">Reset All Progress</h3>
                                <p className="text-sm text-orange-700">
                                    This will permanently delete all your solved problems, streaks, XP, and achievements.
                                    Your account and profile will remain intact.
                                </p>
                                <AnimatePresence>
                                    <StatusBanner message={resetMessage.text} type={resetMessage.type} />
                                </AnimatePresence>
                                <DangerButton onClick={handleResetProgress} loading={isResetting}>
                                    {isResetting ? 'Resetting...' : 'Reset All Progress'}
                                </DangerButton>
                            </div>

                            {/* Delete Account */}
                            <div className="flex flex-col gap-3 border-2 border-red-200 bg-red-50 rounded-md p-5">
                                <h3 className="text-base font-bold text-red-800">Delete Account</h3>
                                <p className="text-sm text-red-700">
                                    This will permanently remove your account and all associated data.
                                    You will be signed out immediately and your data will be deleted within 30 days.
                                </p>
                                <InputField
                                    label='Type "DELETE" to confirm'
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={e => setDeleteConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                />
                                <AnimatePresence>
                                    <StatusBanner message={deleteMessage.text} type={deleteMessage.type} />
                                </AnimatePresence>
                                <DangerButton
                                    onClick={handleDeleteAccount}
                                    loading={isDeleting}
                                    disabled={deleteConfirmText !== 'DELETE'}
                                >
                                    {isDeleting ? 'Processing...' : 'Permanently Delete Account'}
                                </DangerButton>
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Settings;
