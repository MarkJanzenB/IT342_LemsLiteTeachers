import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const jwtToken = localStorage.getItem("jwtToken");
    const userRole = parseInt(localStorage.getItem("userRole"));

    if (!jwtToken) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    return children;
};

export default PrivateRoute;