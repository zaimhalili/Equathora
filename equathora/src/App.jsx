import axios from "axios";
import { useEffect } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  useEffect(() => {
    axios.get("/mathproblem")
      .then(res => console.log("Math problem:", res.data))
      .catch(err => console.error(err));
  }, []);



  return (
    <>
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
        <Route path="/more" element={<More />} />
        <Route path="/about" element={<About />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/recommended" element={<Recommended />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/applymentor" element={<ApplyMentor />} />
        <Route path="/helpCenter" element={<HelpCenter />} />
        <Route path="/pageNotFound" element={<PageNotFound />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/premium" element={<Premium />} />
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