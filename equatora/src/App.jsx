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
import Notifications from "./pages/Notifications";
import AchievementsLayout from "./pages/Achievements/AchievementsLayout";
import RecentAchievements from "./pages/Achievements/RecentAchievements";
import Statistics from "./pages/Achievements/Statistics";
import SpecialEvents from "./pages/Achievements/SpecialEvents";
import Profile from "./pages/Profile";
import OverflowChecker from "./pages/OverflowChecker";
import Resend from "./pages/Resend";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
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

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Protected Feature Routes */}
        <Route path="/more" element={<ProtectedRoute><More /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Protected Nested Routes */}
        <Route path="/achievements" element={
          <ProtectedRoute>
            <AchievementsLayout />
          </ProtectedRoute>
        }>
          <Route index element={<RecentAchievements />} />
          <Route path="recent" element={<RecentAchievements />} />
          <Route path="stats" element={<Statistics />} />
          <Route path="events" element={<SpecialEvents />} />
        </Route>

        {/* Dynamic Routes */}
        <Route path="/problems/:groupId" element={
          <ProtectedRoute>
            <ProblemGroup />
          </ProtectedRoute>
        } />
        <Route path="/problems/:groupId/:problemId" element={
          <ProtectedRoute>
            <Problem />
          </ProtectedRoute>
        } />
        <Route path="/profile/:profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}