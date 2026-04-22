import React, { lazy, Suspense, useEffect, useMemo } from "react";
import { Analytics } from "@vercel/analytics/react";

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import OverflowChecker from "./pages/OverflowChecker";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import CookieConsent from "./components/CookieConsent";
import { supabase } from "./lib/supabaseClient";
import { getUserSettings } from "./lib/notificationService";
import {
    normalizeThemePreference,
    setThemePreference,
    syncThemeWithSystemPreference
} from "./lib/theme";
import { useAuth } from "./hooks/useAuth";
import { trackActivityEvent, trackDailyActivity } from "./lib/activityTrackingService";
import {
    initPostHog,
    identifyPostHogUser,
    resetPostHogUser,
    capturePostHogEvent,
    capturePostHogPageView
} from "./lib/posthogClient";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProblemGroup = lazy(() => import("./pages/ProblemGroup"));
const Problem = lazy(() => import("./pages/Problem"));
const More = lazy(() => import("./pages/More"));
const Learn = lazy(() => import("./pages/Learn"));
const Discover = lazy(() => import("./pages/Discover"));
const ApplyMentor = lazy(() => import("./pages/ApplyMentor"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const SystemUpdates = lazy(() => import("./pages/SystemUpdates"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const SubmitProblem = lazy(() => import("./pages/SubmitProblem/SubmitProblem"));
const Recommended = lazy(() => import("./pages/Recommended"));

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
const Tracks = lazy(() => import("./pages/Tracks"));
const Feedback = lazy(() => import("./pages/Feedback"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const EquathoraBriefs = lazy(() => import("./pages/EquathoraBriefs"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

function HomeRoute() {
    const { loading, isAuth } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (isAuth) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Landing />;
}

function PageTitleUpdater() {
    const location = useLocation();

    useEffect(() => {
        const pageTitles = {
            '/': 'Equathora - Master Math Through Practice',
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
            '/discover': 'Explore More - Equathora',
            '/tracks': 'Tracks - Equathora',
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
            '/adminDashboard': 'Admin Dashboard - Equathora',
            '/recommended': 'Recommended Path - Equathora',
            '/getStarted': 'Choose Your Path - Equathora',
            '/submitProblem': 'Submit a problem - Equathora',
        };

        const matchedRoute = Object.keys(pageTitles).find(route =>
            location.pathname === route || location.pathname.startsWith(route + '/')
        );

        document.title = pageTitles[matchedRoute] || 'Equathora - Master Math Through Practice';
    }, [location]);

    return null;
}

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();

    const canUseSpeedInsights = useMemo(() => {
        const isEnabled = import.meta.env.VITE_ENABLE_SPEED_INSIGHTS === "true";
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

                setThemePreference(normalizeThemePreference(userSettings?.theme), { persist: true });
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

    // Clean up old localStorage data to prevent conflicts with database
    // useEffect(() => {
    //   const cleanupOldLocalStorage = async () => {
    //     try {
    //       const { data: { session } } = await supabase.auth.getSession();
    //       if (session) {
    //         // Clear old localStorage progress data (now using database)
    //         const keysToRemove = [];
    //         for (let i = 0; i < localStorage.length; i++) {
    //           const key = localStorage.key(i);
    //           if (key && (
    //             key.includes('equathora_completed_problems') ||
    //             key.includes('COMPLETED_PROBLEMS')
    //           )) {
    //             keysToRemove.push(key);
    //           }
    //         }
    //         keysToRemove.forEach(key => {
    //           console.log('Clearing old localStorage key:', key);
    //           localStorage.removeItem(key);
    //         });
    //       }
    //     } catch (error) {
    //       console.error('Error cleaning localStorage:', error);
    //     }
    //   };

    //   cleanupOldLocalStorage();
    // }, []);

    // Handle OAuth callback and redirect to dashboard
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                void (async () => {
                    try {
                        const userSettings = await getUserSettings();
                        setThemePreference(normalizeThemePreference(userSettings?.theme), { persist: true });
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

                // Check if we're not already on dashboard or a protected route
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
                    navigate('/dashboard', { replace: true });
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
            {/* <OverflowChecker /> */}
            <Suspense fallback={<LoadingSpinner />}>
                <div id="main-content" tabIndex={-1} className="outline-none">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomeRoute />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/verify" element={<VerifyEmail />} />
                        <Route path="/resend" element={<Resend />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/helpCenter" element={<HelpCenter />} />
                        <Route path="/systemupdates" element={<SystemUpdates />} />
                        <Route path="/pageNotFound" element={<PageNotFound />} />
                        <Route path="/equathora-briefs" element={<EquathoraBriefs />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blogs" element={<BlogList />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        {/* <Route path="/recommended" element={<Recommended />} /> */}
                        {/* <Route path="/getStarted" element={<GetStarted />} /> */}
                        {/* <Route path="/premium" element={<Premium />} /> */}


                        {/* Protected Routes - Require Authentication */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/applymentor" element={<ProtectedRoute><ApplyMentor /></ProtectedRoute>} />
                        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                        {/* <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} /> */}
                        <Route path="/tracks" element={<ProtectedRoute><Tracks /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="/adminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>}></Route>
                        <Route path="/submit-problem" element={<AdminRoute><SubmitProblem /></AdminRoute>}></Route>



                        {/* Protected Nested Routes */}
                        <Route path="/leaderboards" element={<ProtectedRoute><LeaderboardsLayout /></ProtectedRoute>}>
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

                        {/* Protected Dynamic Routes */}
                        <Route path="/problem-groups/:groupId" element={<ProtectedRoute><ProblemGroup /></ProtectedRoute>} />
                        <Route path="/problems/:slug" element={<ProtectedRoute><Problem /></ProtectedRoute>} />
                        <Route path="/profile/:profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                        {/* 404 Route */}
                        <Route path="*" element={<Navigate to="/pageNotFound" replace />} />
                    </Routes>
                </div>
            </Suspense>

            {/* Cookie Consent Banner */}
            <CookieConsent />

            {/* Analytics */}
            <Analytics />
            {canUseSpeedInsights ? <LazySpeedInsights /> : null}
        </>
    );
}

const LazySpeedInsights = lazy(async () => {
    const module = await import("@vercel/speed-insights/react");
    return { default: module.SpeedInsights };
});
