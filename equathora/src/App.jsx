import axios from "axios";
import { lazy, Suspense, useEffect } from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import OverflowChecker from "./pages/OverflowChecker";

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
      '/signup': 'Join Now - Equathora'
    };

    const matchedRoute = Object.keys(pageTitles).find(route =>
      location.pathname === route || location.pathname.startsWith(route + '/')
    );

    document.title = pageTitles[matchedRoute] || 'Equathora - Master Math Through Practice';
  }, [location]);

  return null;
}

export default function App() {
  useEffect(() => {
    const controller = new AbortController();
    axios.get("/mathproblem", { signal: controller.signal })
      .then(res => console.log("Math problem:", res.data))
      .catch(err => {
        if (err.name !== 'CanceledError') {
          console.error(err);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);



  return (
    <>
      <PageTitleUpdater />
      <OverflowChecker />
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
            

            {/* Unprotected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/getstarted" element={<GetStarted />} /> */}
            <Route path="/more" element={<More />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn" element={<Learn />} />
            {/* <Route path="/discover" element={<Discover />} /> */}
            {/* <Route path="/recommended" element={<Recommended />} /> */}
            {/* <Route path="/notifications" element={<Notifications />} /> */}
            <Route path="/applymentor" element={<ApplyMentor />} />
            <Route path="/helpCenter" element={<HelpCenter />} />
            <Route path="/systemupdates" element={<SystemUpdates />} />
            <Route path="/pageNotFound" element={<PageNotFound />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            {/* <Route path="/premium" element={<Premium />} /> */}
            <Route path="/feedback" element={<Feedback />} />



            {/* Unprotected Nested Routes */}
            <Route path="/leaderboards" element={<LeaderboardsLayout />}>
              <Route path="global" element={<GlobalLeaderboard />} />
              <Route path="friends" element={<FriendsLeaderboard />} />
              <Route path="top-solvers" element={<TopSolversLeaderboard />} />
            </Route>


            <Route path="/achievements" element={<AchievementsLayout />}>
              <Route index element={<RecentAchievements />} />
              <Route path="recent" element={<RecentAchievements />} />
              <Route path="stats" element={<Statistics />} />
              <Route path="events" element={<SpecialEvents />} />
            </Route>

            {/* Dynamic Routes */}
            <Route path="/problems/:groupId" element={<ProblemGroup />} />
            <Route path="/problems/:groupId/:problemId" element={<Problem />} />
            <Route path="/profile/:profile" element={<Profile />} />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/pageNotFound" replace />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}