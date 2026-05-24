import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CampaignCategories from './pages/CampaignCategories';
import Donations from './pages/Donations';
import Donors from './pages/Donors';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            
            <Routes>
                {/* Public routes - accessible without login */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected routes - need login */}
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                
                <Route path="/campaign-categories" element={
                    <PrivateRoute>
                        <CampaignCategories />
                    </PrivateRoute>
                } />
                
                <Route path="/donations" element={
                    <PrivateRoute>
                        <Donations />
                    </PrivateRoute>
                } />
                
                <Route path="/donors" element={
                    <PrivateRoute>
                        <Donors />
                    </PrivateRoute>
                } />
                
                {/* IMPORTANT: Default route goes to login, not dashboard */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;