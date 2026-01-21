import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { loading, isAuth } = useAuth();

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

    return children;
};

export default ProtectedRoute;