import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { loading, isAuth } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <></>
        );
    }

    if (!isAuth) {
        const from = `${location.pathname}${location.search}`;
        return <Navigate to="/login" state={{ from }} replace />;
    }

    return children;
};

export default ProtectedRoute;
