import React from "react";
import { Navigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

const AdminRoute = ({ children }) => {
    const { user, profile, loading } = useUserProfile();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-[var(--secondary-color)] font-[Sansation]">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const currentRole = String(profile?.role || '').toLowerCase();
    if (currentRole !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminRoute;
