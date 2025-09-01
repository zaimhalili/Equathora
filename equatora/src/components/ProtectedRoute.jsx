import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Replace this with your actual authentication logic
    const isAuthenticated = !!localStorage.getItem("user");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;