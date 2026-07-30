import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, allowRetake = false }) => {
    const { loading, isAuth, onboardingCompleted } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    // Must be logged in
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    // If they haven't completed onboarding AND this page doesn't allow retakes,
    // force them to finish onboarding first.
    if (!onboardingCompleted && !allowRetake) {
        return <Navigate to="/getStarted" replace />;
    }

    return children;
};

export default ProtectedRoute;