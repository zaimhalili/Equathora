import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

// Guards /getStarted. Does NOT redirect incomplete-onboarding users back
// here (they're already here) — that's the difference from ProtectedRoute.
const OnboardingRoute = ({ children }) => {
    const { loading, isAuth, onboardingCompleted } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    const isRetake = location.state?.retake === true;

    if (onboardingCompleted && !isRetake) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default OnboardingRoute;