// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProblemGroup from "./pages/ProblemGroup";
import Problem from "./pages/Problem";
import More from "./pages/More";
import Learn from "./pages/Learn";
import Discover from "./pages/Discover";
import Notifications from "./pages/Notifications";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import OverflowChecker from "./pages/OverflowChecker";

export default function App() {
  return (
    <>
      <OverflowChecker/>
      <Routes>
        {/* Static pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/more" element={<More />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/achievements" element={<Achievements />} />

        {/* Dynamic pages */}
        <Route path="/problems/:groupId" element={<ProblemGroup />} />
        <Route path="/problems/:groupId/:problemId" element={<Problem />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </>


  );
}
