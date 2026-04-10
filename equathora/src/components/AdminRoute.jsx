import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "halilizaim@gmail.com").toLowerCase();

const AdminRoute = ({ children }) => {
    const { loading, isAuth, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[var(--secondary-color)] font-[Sansation]">
                Loading...
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    const currentEmail = (user?.email || "").toLowerCase();
    if (currentEmail !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
