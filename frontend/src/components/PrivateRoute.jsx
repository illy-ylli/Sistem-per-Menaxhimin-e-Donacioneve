import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children }) => {
    // kqyr nese useri osht authenticated
    const isAuthenticated = authService.isAuthenticated();
    
    // nese sosht ktheje te login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // nese osht kallxoja faqen
    return children;
};

export default PrivateRoute;