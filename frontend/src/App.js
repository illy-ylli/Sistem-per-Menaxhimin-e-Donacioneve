import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/AdminRoute';
import AuthRoute from './components/AuthRoute';
import PrivateRoute from './components/PrivateRoute';

// ============================================
// LAZY LOADING - TE GJITHA KOMPONENTET NGARKOHEN VETEM KUR NEVOJITEN
// ============================================

// Public pages (ngarkohen kur hapet faqja)
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Dashboard
const Dashboard = lazy(() => import('./pages/Dashboard'));

// User pages
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Donations = lazy(() => import('./pages/Donations'));
const UserCampaigns = lazy(() => import('./pages/UserCampaigns'));
const UserDonors = lazy(() => import('./pages/UserDonors'));

// Admin pages
const Donors = lazy(() => import('./pages/Donors'));
const CampaignCategories = lazy(() => import('./pages/CampaignCategories'));
const AdminCampaigns = lazy(() => import('./pages/AdminCampaigns'));

// Loading Spinner
const LoadingSpinner = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
    }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Duke ngarkuar...</span>
        </div>
        <p className="mt-3" style={{ color: '#666' }}>Duke ngarkuar faqen...</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
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
            
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes - need login */}
                    <Route path="/dashboard" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />
                    
                    {/* User routes (accessible to any logged-in user) */}
                    <Route path="/campaigns" element={<AuthRoute><Campaigns /></AuthRoute>} />
                    <Route path="/donations" element={
                        <PrivateRoute><Donations /></PrivateRoute>
                    } />
                    
                    {/* Public user‑facing placeholders (regular users) */}
                    <Route path="/user-campaigns" element={<UserCampaigns />} />
                    <Route path="/user-donors" element={<UserDonors />} />
                    
                    {/* Admin‑only routes */}
                    <Route path="/admin/campaign-categories" element={
                        <AdminRoute><CampaignCategories /></AdminRoute>
                    } />
                    <Route path="/admin/donors" element={
                        <AdminRoute><Donors /></AdminRoute>
                    } />
                    <Route path="/admin/campaigns" element={
                        <AdminRoute><AdminCampaigns /></AdminRoute>
                    } />
                    
                    {/* Default route */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;