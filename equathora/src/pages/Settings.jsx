import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
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
    isSubscribedToEquathoraBriefs,
} from '../lib/equathoraBriefsService';
import { useSubscription } from '@/hooks/SubscriptionContext';
import { useResetDiagnostic } from '@/hooks/useResetDiagnostic';
import { useLogout } from '@/hooks/useLogout';
import { useSettingsNavigation } from '@/hooks/useSettingsNavigation';
import SettingsSidebar from '@/components/Settings/SettingsSidebar';
import { OutlineButton, Spinner } from '@/components/Settings/SettingsUI';

const AccountOverview = lazy(() => import('@/components/Settings/AccountOverview'));
const SecuritySettings = lazy(() => import('@/components/Settings/SecuritySettings'));
const LearningSettings = lazy(() => import('@/components/Settings/LearningSettings'));
const AppearanceSettings = lazy(() => import('@/components/Settings/AppearanceSettings'));
const PrivacySettings = lazy(() => import('@/components/Settings/PrivacySettings'));
const SubscriptionSettings = lazy(() => import('@/components/Settings/SubscriptionSettings'));
const SessionsSettings = lazy(() => import('@/components/Settings/SessionsSettings'));

const SETTINGS_PANELS = {
    security: SecuritySettings,
    learning: LearningSettings,
    appearance: AppearanceSettings,
    privacy: PrivacySettings,
    subscription: SubscriptionSettings,
    sessions: SessionsSettings,
};

const SettingsPanelSkeleton = () => (
    <section
        className="flex min-h-[360px] w-full flex-col gap-7 rounded-xl bg-(--white) p-5 sm:p-8"
        aria-label="Loading settings"
        aria-busy="true"
    >
        <div className="space-y-2">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-(--mid-main-secondary)/20" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded-lg bg-(--mid-main-secondary)/15" />
        </div>
        <div className="flex gap-3">
            {[1, 2, 3].map((item) => (
                <div className="h-[88px] w-[120px] animate-pulse rounded-2xl bg-(--mid-main-secondary)/15" key={item} />
            ))}
        </div>
        <div className="grid gap-3">
            {[1, 2, 3].map((item) => (
                <div className="h-12 w-full animate-pulse rounded-xl bg-(--mid-main-secondary)/10" key={item} />
            ))}
        </div>
    </section>
);

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
    '1-3': '1-3 hrs / week',
    '3-6': '3-6 hrs / week',
    '6+': '6+ hrs / week',
};

const CHALLENGE_LABELS = {
    easy: 'Build Confidence',
    balanced: 'Balanced',
    challenging: 'Challenge Me',
    extreme: 'Push My Limits',
};

// ============================================================================
// TOAST - a single, global piece of feedback. New messages replace the old
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
                    <Motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className={`pointer-events-auto w-full sm:w-auto sm:max-w-sm text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-xl  ${palette[toast.type] || palette.success}`}
                    >
                        {toast.message}
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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
        : 'bg-(--accent-color) hover:bg-(--dark-accent-color)';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <Motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !loading && onClose()}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <Motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-(--white) rounded-xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4 "
                >
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="text-xl font-medium text-(--secondary-color)">{title}</h2>
                        <button
                            onClick={() => !loading && onClose()}
                            className="text-(--mid-main-secondary) hover:text-(--secondary-color) p-1 rounded-xl cursor-pointer transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <p className="text-sm text-(--mid-main-secondary)">{description}</p>

                    {confirmWord && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-(--secondary-color)">
                                Type <span className="font-mono">{confirmWord}</span> to confirm
                            </label>
                            <input
                                value={typed}
                                onChange={e => setTyped(e.target.value)}
                                placeholder={confirmWord}
                                autoFocus
                                className="px-4 py-2.5 border rounded-xl border-(--mid-main-secondary) bg-[var(--surface-card)] text-(--secondary-color) focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
                            className={`flex-1 px-5 py-2.5 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${confirmColor}`}
                        >
                            {loading && <Spinner />}
                            {confirmLabel}
                        </button>
                    </div>
                </Motion.div>
            </div>
        </AnimatePresence>
    );
};

// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

const Settings = () => {
    const { resetDiagnosticTest, loading: diagnosticResetting } = useResetDiagnostic();
    const { premium, loading: subLoading } = useSubscription();
    const navigate = useNavigate();
    const { activeSection, selectSection } = useSettingsNavigation();
    const [pendingSettingTarget, setPendingSettingTarget] = useState(null);
    const { logout } = useLogout();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!pendingSettingTarget || pendingSettingTarget.sectionId !== activeSection) return undefined;

        let attempts = 0;
        let animationFrame;
        const scrollToTarget = () => {
            const target = document.getElementById(pendingSettingTarget.targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setPendingSettingTarget(null);
                return;
            }

            if (attempts < 120) {
                attempts += 1;
                animationFrame = requestAnimationFrame(scrollToTarget);
            } else {
                setPendingSettingTarget(null);
            }
        };

        animationFrame = requestAnimationFrame(scrollToTarget);
        return () => cancelAnimationFrame(animationFrame);
    }, [activeSection, pendingSettingTarget]);

    const handleSettingSelect = (sectionId, targetId) => {
        window.history.pushState(null, '', `${window.location.pathname}${window.location.search}#${targetId}`);
        setPendingSettingTarget({ sectionId, targetId });
        selectSection(sectionId);
    };

    const handleSectionChange = (sectionId) => {
        setPendingSettingTarget(null);
        selectSection(sectionId);
    };

    // Global toast (single message at a time - replaces the old per-section
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

    // Read-only profile summary - editing lives on the public profile page,
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

                // Profile - read-only summary, matches the real `profiles` schema
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
                } catch {
                    // No student_profile row yet (e.g. teacher account) - fine.
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
            const success = await saveUserSettings(nextSettings, {
                syncLeaderboardPrivacy: key === 'privacy_show_leaderboard',
            });
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
                enabled ? 'All cookies enabled.' : 'Optional cookies disabled - essential only.',
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
    // ACCOUNT ACTIONS
    // ========================================================================
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            showToast(error.message || 'Could not log out. Please try again.', 'error');
        }
    };

    const resolvedTheme = resolveThemePreference(settings.theme);

    const learningChips = [];
    if (learningProfile?.goal) learningChips.push(GOAL_LABELS[learningProfile.goal] || learningProfile.goal);
    if (learningProfile?.level) learningChips.push(LEVEL_LABELS[learningProfile.level] || learningProfile.level);
    if (learningProfile?.weekly_commitment) learningChips.push(WEEKLY_LABELS[learningProfile.weekly_commitment] || learningProfile.weekly_commitment);
    if (learningProfile?.preferred_challenge) learningChips.push(CHALLENGE_LABELS[learningProfile.preferred_challenge] || learningProfile.preferred_challenge);

    const handleRetakeAssessment = async () => {
        try {
            await resetDiagnosticTest();
        } catch (error) {
            showToast(error.message || 'Could not reset your skill assessment.', 'error');
        }
    };

    const panelData = {
        security: {
            currentEmail,
            authProvider,
            newEmail,
            setNewEmail,
            emailSaving,
            handleChangeEmail,
            newPassword,
            setNewPassword,
            confirmPassword,
            setConfirmPassword,
            passwordSaving,
            showPassword,
            setShowPassword,
            handleChangePassword,
        },
        learning: {
            learningChips,
            diagnosticResetting,
            onRetakeAssessment: handleRetakeAssessment,
        },
        appearance: {
            settings,
            onSettingChange: handleSettingChange,
            resolvedTheme,
            settingsSaving,
        },
        privacy: {
            settings,
            onSettingChange: handleSettingChange,
            cookieConsent,
            onCookieConsentChange: handleCookieConsentToggle,
        },
        subscription: {
            premium,
            onManagePlan: () => navigate('/premium'),
        },
        sessions: {
            currentSession,
            onSignOutOtherSessions: handleSignOutOthers,
            sessionLoading,
        },
    };
    const ActiveSettingsPanel = SETTINGS_PANELS[activeSection];

    // ========================================================================
    // RENDER
    // ========================================================================
    return (
        <>
            <Navbar />
            <main aria-busy={isLoading || settingsSaving} className="min-h-screen flex flex-col bg-(--white) bg-fixed text-(--secondary-color) ">

                {/* Content wrapper */}
                <div className="w-full flex flex-col lg:flex-row gap-8 px-4 sm:px-8 lg:px-16 xl:px-24 pb-12 max-w-375 self-center flex-1 pt-8">
                    <SettingsSidebar
                        activeSection={activeSection}
                        onSectionChange={handleSectionChange}
                        onSettingSelect={handleSettingSelect}
                    />

                    {/* Only the selected panel is rendered; each panel is code-split. */}
                    <div className="flex min-w-0 flex-1 flex-col rounded-xl" aria-busy={isLoading || settingsSaving}>
                        {isLoading ? <SettingsPanelSkeleton /> : (
                            <Suspense fallback={<SettingsPanelSkeleton />}>
                                {activeSection === 'account' ? (
                                    <AccountOverview
                                        premium={premium}
                                        subscriptionLoading={subLoading}
                                        onManagePlan={() => navigate('/premium')}
                                        onManageCookies={() => selectSection('privacy')}
                                        onLogout={handleLogout}
                                        onDeleteAccount={() => setShowDeleteModal(true)}
                                        deletionRequested={profileSummary.deletionRequested}
                                        deletionRequestedAt={profileSummary.deletionRequestedAt}
                                        onCancelDeletion={handleCancelDeletion}
                                        cancelingDeletion={isCancelingDeletion}
                                    />
                                ) : ActiveSettingsPanel ? (
                                    <ActiveSettingsPanel data={panelData[activeSection]} />
                                ) : null}
                            </Suspense>
                        )}
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