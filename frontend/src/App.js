import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import CampaignCategories from './pages/CampaignCategories';
import Donations from './pages/Donations';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            {/* Toast lajmrimet */}
            <Toaster position="top-right" />
            
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes (nevojitet login) */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                <Route 
    path="/campaign-categories" 
    element={
        <PrivateRoute>
            <CampaignCategories />
        </PrivateRoute>
    } 
/>
<Route 
    path="/donations" 
    element={
        <PrivateRoute>
            <Donations />
        </PrivateRoute>
    } 
/>
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;