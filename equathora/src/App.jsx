import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import OverflowChecker from "./pages/OverflowChecker";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingRoute from "./components/OnboardingRoute";
import AdminRoute from "./components/AdminRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { supabase } from "./lib/supabaseClient";
import { getUserSettings } from "./lib/notificationService";
import AuthCallback from "./pages/AuthCallback";
import {
    normalizeThemePreference,
    setThemePreference,
    syncThemeWithSystemPreference
} from "./lib/theme";
import { useAuth, getOnboardingStatus } from "./hooks/useAuth";
import { trackActivityEvent, trackDailyActivity } from "./lib/activityTrackingService";
import {
    initPostHog,
    identifyPostHogUser,
    resetPostHogUser,
    capturePostHogEvent,
    capturePostHogPageView
} from "./lib/posthogClient";
import { captureRecruitmentAttribution } from "./lib/recruitmentAttribution";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Problem = lazy(() => import("./pages/Problem"));
const More = lazy(() => import("./pages/More"));
const Learn = lazy(() => import("./pages/Learn"));
const ApplyMentor = lazy(() => import("./pages/ApplyMentor"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const SystemUpdates = lazy(() => import("./pages/SystemUpdates"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));

const LeaderboardsLayout = lazy(() => import("./pages/Leaderboards/LeaderboardsLayout"));
const GlobalLeaderboard = lazy(() => import("./pages/Leaderboards/GlobalLeaderboard"));
const FriendsLeaderboard = lazy(() => import("./pages/Leaderboards/FriendsLeaderboard"));
const TopSolversLeaderboard = lazy(() => import("./pages/Leaderboards/TopSolversLeaderboard"));

const Notifications = lazy(() => import("./pages/Notifications"));
const AchievementsLayout = lazy(() => import("./pages/Achievements/AchievementsLayout"));
const RecentAchievements = lazy(() => import("./pages/Achievements/RecentAchievements"));
const Statistics = lazy(() => import("./pages/Achievements/Statistics"));
const SpecialEvents = lazy(() => import("./pages/Achievements/SpecialEvents"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Resend = lazy(() => import("./pages/Resend"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Premium = lazy(() => import("./pages/Premium/Premium"));
const Journey = lazy(() => import("./pages/Journey"));
const Feedback = lazy(() => import("./pages/Feedback"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const EquathoraBriefs = lazy(() => import("./pages/EquathoraBriefs"));

function HomeRoute() {
    const { loading, isAuth, onboardingCompleted } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (isAuth) {
        return <Navigate to={onboardingCompleted ? "/journey" : "/getStarted"} replace />;
    }

    return <Landing />;
}

function PageTitleUpdater() {
    const location = useLocation();

    useEffect(() => {
        const pageTitles = {
            '/': 'Focused Mathematics Practice | Equathora',
            '/dashboard': 'Equathora',
            '/learn': 'Practice Problems - Equathora',
            '/problems': 'Solve Challenge - Equathora',
            '/achievements': 'Your Progress - Equathora',
            '/about': 'Our Story - Equathora',
            '/helpCenter': 'Help Center - Equathora',
            '/systemupdates': 'System Updates - Equathora',
            '/feedback': 'Share Feedback - Equathora',
            '/applymentor': 'Become a Mentor - Equathora',
            '/leaderboards': 'Top Solvers - Equathora',
            '/journey': 'Your Journey - Equathora',
            '/notifications': 'Updates - Equathora',
            '/settings': 'Your Settings - Equathora',
            '/premium': 'Go Premium - Equathora',
            '/profile': 'Profile - Equathora',
            '/login': 'Sign In - Equathora',
            '/signup': 'Join Now - Equathora',
            '/verify': 'Verify Email - Equathora',
            '/equathora-briefs': 'Equathora Briefs - Equathora',
            '/resend': 'Resend Confirmation - Equathora',
            '/forgotpassword': 'Reset Password - Equathora',
            '/reset-password': 'Reset Password - Equathora',
            '/pageNotFound': '404 - Page Not Found - Equathora',
            '/blog': 'Blog - Equathora',
            '/blogs': 'All Posts - Equathora',
            '/getStarted': 'Choose Your Path - Equathora',
            '/submit-problem': 'Submit a problem - Equathora',
        };

        const matchedRoute = Object.keys(pageTitles).find(route =>
            location.pathname === route || (route !== '/' && location.pathname.startsWith(route + '/'))
        );

        document.title = pageTitles[matchedRoute] || 'Focused Mathematics Practice | Equathora';
    }, [location]);

    return null;
}

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const shouldEnableVercelAnalytics = import.meta.env.PROD || import.meta.env.VITE_ENABLE_VERCEL_ANALYTICS === "true";

    useEffect(() => {
        captureRecruitmentAttribution(location.search);
    }, [location.search]);

    const canUseSpeedInsights = useMemo(() => {
        const isEnabled =
            import.meta.env.PROD ||
            import.meta.env.VITE_ENABLE_SPEED_INSIGHTS === "true";

        if (!isEnabled || typeof window === "undefined") {
            return false;
        }

        const perf = window.performance;
        return Boolean(
            perf &&
            typeof perf.mark === "function" &&
            typeof perf.measure === "function" &&
            typeof perf.clearMarks === "function" &&
            typeof perf.clearMeasures === "function"
        );
    }, []);

    useEffect(() => {
        initPostHog();
    }, []);

    useEffect(() => {
        const cleanupSystemThemeSync = syncThemeWithSystemPreference();
        return cleanupSystemThemeSync;
    }, []);

    useEffect(() => {
        let isDisposed = false;

        const syncThemeFromSavedSettings = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const userSettings = await getUserSettings();
                if (isDisposed) return;
                const normalizedTheme = normalizeThemePreference(userSettings?.theme);
                setThemePreference(normalizedTheme, { persist: true });
            } catch (error) {
                console.error("Error syncing theme preference:", error);
            }
        };

        void syncThemeFromSavedSettings();

        return () => {
            isDisposed = true;
        };
    }, []);

    useEffect(() => {
        void capturePostHogPageView(location.pathname, {
            route: location.pathname
        });
    }, [location.pathname]);

    // Single onAuthStateChange listener. There used to be two near-identical
    // ones here (a leftover from an earlier edit) — that meant every sign-in
    // fired theme sync, PostHog events, and the onboarding redirect twice.
    // This is the merged, more complete version: it also handles
    // PASSWORD_RECOVERY and skips the auto-redirect while on the
    // reset-password/forgot-password flow.
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                navigate('/reset-password');
                return;
            }

            if (event === 'SIGNED_IN' && session) {
                void (async () => {
                    try {
                        const userSettings = await getUserSettings();
                        const normalizedTheme = normalizeThemePreference(userSettings?.theme);
                        setThemePreference(normalizedTheme, { persist: true });
                    } catch (error) {
                        console.error('Error syncing signed-in theme preference:', error);
                    }
                })();

                identifyPostHogUser(session.user);

                void capturePostHogEvent('user_signed_in', {
                    email: session.user?.email || null
                });
                void trackActivityEvent('session_start', new Date(), {
                    route: window.location.pathname
                });

                const currentPath = window.location.pathname;
                const isResetFlow = currentPath.includes('/reset-password') || currentPath.includes('/forgotpassword');

                if (!isResetFlow && (currentPath === '/' || currentPath === '/login' || currentPath === '/signup')) {
                    void (async () => {
                        const { onboardingCompleted } = await getOnboardingStatus(session.user.id);
                        navigate(onboardingCompleted ? '/dashboard' : '/getStarted', { replace: true });
                    })();
                }
            }

            if (event === 'SIGNED_OUT') {
                void capturePostHogEvent('user_signed_out');
                resetPostHogUser();
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    useEffect(() => {
        void trackDailyActivity();
    }, [location.pathname]);

    return (
        <>
            <PageTitleUpdater />
            <Suspense fallback={<LoadingSpinner />}>
                <div id="main-content" tabIndex={-1} className="outline-none">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomeRoute />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify" element={<VerifyEmail />} />
                        <Route path="/resend" element={<Resend />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/helpCenter" element={<HelpCenter />} />
                        <Route path="/system-updates" element={<Navigate to="/systemupdates" replace />} />
                        <Route path="/systemupdates" element={<SystemUpdates />} />
                        <Route path="/pageNotFound" element={<PageNotFound />} />
                        <Route path="/equathora-briefs" element={<EquathoraBriefs />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blogs" element={<BlogList />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />

                        {/* Protected Onboarding Flow — guarded by OnboardingRoute, not
                            ProtectedRoute. OnboardingRoute allows a completed user back
                            in only when navigated with state={{ retake: true }} (e.g. a
                            "redo onboarding" link from Settings), and otherwise sends
                            completed users to /dashboard while letting first-time users
                            through. Using ProtectedRoute here caused a redirect loop:
                            it sends incomplete-onboarding users to /getStarted — while
                            already ON /getStarted — so the page never actually rendered. */}
                        <Route path="/getStarted" element={<OnboardingRoute><GetStarted /></OnboardingRoute>} />
                        <Route path="/premium" element={<Premium />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/applymentor" element={<ProtectedRoute><ApplyMentor /></ProtectedRoute>} />
                        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                        <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                        {/* Protected Nested Routes */}
                        <Route path="/leaderboards" element={<ProtectedRoute><LeaderboardsLayout /></ProtectedRoute>}>
                            <Route index element={<Navigate to="global" replace />} />
                            <Route path="global" element={<GlobalLeaderboard />} />
                            <Route path="friends" element={<FriendsLeaderboard />} />
                            <Route path="top-solvers" element={<TopSolversLeaderboard />} />
                        </Route>

                        <Route path="/achievements" element={<ProtectedRoute><AchievementsLayout /></ProtectedRoute>}>
                            <Route index element={<RecentAchievements />} />
                            <Route path="recent" element={<RecentAchievements />} />
                            <Route path="stats" element={<Statistics />} />
                            <Route path="events" element={<SpecialEvents />} />
                        </Route>

                        {/* Dynamic Routes */}
                        <Route path="/problems/:slug" element={<ProtectedRoute><Problem /></ProtectedRoute>} />
                        <Route path="/profile/:profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                        {/* 404 Route */}
                        <Route path="*" element={<Navigate to="/pageNotFound" replace />} />
                    </Routes>
                </div>
            </Suspense>

            {/* Analytics */}
            {shouldEnableVercelAnalytics ? <Analytics /> : null}
            {canUseSpeedInsights ? <LazySpeedInsights /> : null}
        </>
    );
}

const LazySpeedInsights = lazy(async () => {
    const module = await import("@vercel/speed-insights/react");
    return { default: module.SpeedInsights };
});
