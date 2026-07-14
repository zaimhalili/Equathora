import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
    const { loading, isAuth, onboardingCompleted } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    if (!onboardingCompleted) {
        return <Navigate to="/getStarted" replace />;
    }

    return children;
};

export default ProtectedRoute;