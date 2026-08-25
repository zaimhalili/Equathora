import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { buildAuthPath } from "../lib/authDestination";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, allowRetake = false }) => {
    const { loading, isAuth, onboardingCompleted } = useAuth();
    const location = useLocation();
    const requestedDestination = `${location.pathname}${location.search}${location.hash}`;

    if (loading) {
        return <LoadingSpinner />;
    }

    // Must be logged in
    if (!isAuth) {
        return (
            <Navigate
                to={buildAuthPath('/login', requestedDestination)}
                state={{ from: requestedDestination }}
                replace
            />
        );
    }

    // If they haven't completed onboarding AND this page doesn't allow retakes,
    // force them to finish onboarding first.
    if (!onboardingCompleted && !allowRetake) {
        return (
            <Navigate
                to={buildAuthPath('/getStarted', requestedDestination)}
                state={{ from: requestedDestination }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
