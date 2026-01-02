import axios from "axios";
import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import OverflowChecker from "./pages/OverflowChecker";
import ProtectedRoute from "./components/ProtectedRoute";
import { supabase } from "./lib/supabaseClient";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
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
const Premium = lazy(() => import("./pages/Premium"));
const Recommended = lazy(() => import("./pages/Recommended"));
const Feedback = lazy(() => import("./pages/Feedback"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Waitlist = lazy(() => import("./pages/Waitlist"));

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
      '/recommended': 'For You - Equathora',
      '/notifications': 'Updates - Equathora',
      '/settings': 'Your Settings - Equathora',
      '/premium': 'Go Premium - Equathora',
      '/profile': 'Profile - Equathora',
      '/login': 'Sign In - Equathora',
      '/signup': 'Join Now - Equathora',
      '/waitlist': 'Join Waitlist - Equathora',
      '/resend': 'Resend Confirmation - Equathora',
      '/forgotpassword': 'Reset Password - Equathora',
      '/pageNotFound': '404 - Page Not Found - Equathora',
      '/blog': 'Blog - Equathora',
      '/blogs': 'All Posts - Equathora',

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

  // Handle OAuth callback and redirect to dashboard
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if we're not already on dashboard or a protected route
        const currentPath = window.location.pathname;
        if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
          navigate('/dashboard', { replace: true });
        }
      }
    });
  }, [navigate]);



  return (
    <>
      <PageTitleUpdater />
      <OverflowChecker />
      <Analytics />
      <SpeedInsights />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-[var(--secondary-color)] font-[Inter]">
          Loading next experience...
        </div>
      }>
        <div id="main-content" tabIndex={-1} className="outline-none">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/resend" element={<Resend />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/helpCenter" element={<HelpCenter />} />
            <Route path="/systemupdates" element={<SystemUpdates />} />
            <Route path="/pageNotFound" element={<PageNotFound />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />


            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
            <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
            <Route path="/applymentor" element={<ProtectedRoute><ApplyMentor /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            {/* <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} /> */}
            {/* <Route path="/recommended" element={<ProtectedRoute><Recommended /></ProtectedRoute>} /> */}
            {/* <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} /> */}
            {/* <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}
            {/* <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} /> */}



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
            <Route path="/problems/:groupId" element={<ProtectedRoute><ProblemGroup /></ProtectedRoute>} />
            <Route path="/problems/:groupId/:problemId" element={<ProtectedRoute><Problem /></ProtectedRoute>} />
            <Route path="/profile/:profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/pageNotFound" replace />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}