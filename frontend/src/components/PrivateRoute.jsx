import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ children }) => {
    // kontrollo ne menyre direkte nese token ekziston
    const token = Cookies.get('accessToken');
    const isAuthenticated = !!token;
    
    console.log('PrivateRoute - Token exists:', !!token);
    
    if (!isAuthenticated) {
        console.log('PrivateRoute - No token, redirecting to login');
        return <Navigate to="/login" replace />;
    }
    
    console.log('PrivateRoute - Has token, showing page');
    return children;
};

export default PrivateRoute;