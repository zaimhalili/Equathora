import axios from "axios";
import { useEffect } from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProblemGroup from "./pages/ProblemGroup";
import Problem from "./pages/Problem";
import More from "./pages/More";
import Learn from "./pages/Learn";
import Discover from "./pages/Discover";
import ApplyMentor from "./pages/ApplyMentor";
import HelpCenter from "./pages/HelpCenter";
import SystemUpdates from "./pages/SystemUpdates";
import PageNotFound from "./pages/PageNotFound";
import About from "./pages/About";

import LeaderboardsLayout from "./pages/Leaderboards/LeaderboardsLayout";
import GlobalLeaderboard from "./pages/Leaderboards/GlobalLeaderboard";
import FriendsLeaderboard from "./pages/Leaderboards/FriendsLeaderboard";
import TopSolversLeaderboard from "./pages/Leaderboards/TopSolversLeaderboard";

import Notifications from "./pages/Notifications";
import AchievementsLayout from "./pages/Achievements/AchievementsLayout";
import RecentAchievements from "./pages/Achievements/RecentAchievements";
import Statistics from "./pages/Achievements/Statistics";
import SpecialEvents from "./pages/Achievements/SpecialEvents";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import OverflowChecker from "./pages/OverflowChecker";
import Resend from "./pages/Resend";
import ForgotPassword from "./pages/ForgotPassword";
import Premium from "./pages/Premium";
import Recommended from "./pages/Recommended";
import Feedback from "./pages/Feedback";
import GetStarted from "./pages/GetStarted";

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
    axios.get("/mathproblem")
      .then(res => console.log("Math problem:", res.data))
      .catch(err => console.error(err));
  }, []);



  return (
    <>
      <PageTitleUpdater />
      <OverflowChecker />
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
    </>
  );
}