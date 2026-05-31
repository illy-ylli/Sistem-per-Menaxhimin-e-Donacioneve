import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/AdminRoute';
import AuthRoute from './components/AuthRoute';
import PrivateRoute from './components/PrivateRoute';


// ============================================
// LAZY LOADING - TE GJITHA KOMPONENTET
// ============================================

// Public pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Dashboard
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Donations
const Donations = lazy(() => import('./pages/Donations'));

// Campaign Categories (Admin only)
const CampaignCategories = lazy(() => import('./pages/CampaignCategories'));

// Campaigns - Admin version (me CRUD)
const AdminCampaigns = lazy(() => import('./pages/AdminCampaigns'));

// Campaigns - User version (vetem lexim)
const UserCampaigns = lazy(() => import('./pages/UserCampaigns'));

// Donors - Admin version (me CRUD)
const AdminDonors = lazy(() => import('./pages/Donors'));

// Donors - User version (vetem lexim)
const UserDonors = lazy(() => import('./pages/UserDonors'));

// Volunteers - Admin version (me CRUD)
const AdminVolunteers = lazy(() => import('./pages/AdminVolunteers'));

// Volunteers - User version (vetem lexim)
const UserVolunteers = lazy(() => import('./pages/UserVolunteers'));

// CampaignVolunteers - Admin version (caktimi i vullnetarëve në fushata)
const AdminCampaignVolunteers = lazy(() => import('./pages/AdminCampaignVolunteers'));

// Loading Spinner
const LoadingSpinner = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Duke ngarkuar...</span>
        </div>
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
                    {/* ============================================
                        PUBLIC ROUTES (pa login)
                    ============================================ */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* ============================================
                        PROTECTED ROUTES (ka nevoje per login)
                    ============================================ */}
                    <Route path="/dashboard" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />
                    
                    <Route path="/donations" element={
                        <PrivateRoute><Donations /></PrivateRoute>
                    } />
                    
                    {/* ============================================
                        ADMIN ROUTES (CRUD - per admin/manager)
                    ============================================ */}
                    <Route path="/admin/campaign-categories" element={
                        <AdminRoute><CampaignCategories /></AdminRoute>
                    } />
                    
                    <Route path="/admin/campaigns" element={
                        <AdminRoute><AdminCampaigns /></AdminRoute>
                    } />
                    
                    <Route path="/admin/donors" element={
                        <AdminRoute><AdminDonors /></AdminRoute>
                    } />
                    
                    <Route path="/admin/volunteers" element={
                        <AdminRoute><AdminVolunteers /></AdminRoute>
                    } />

                    {/* NEW: CampaignVolunteers admin route */}
                    <Route path="/admin/campaign-volunteers" element={
                        <AdminRoute><AdminCampaignVolunteers /></AdminRoute>
                    } />

                    {/* ============================================
                        USER ROUTES (vetem lexim - per perdoruesit normal)
                    ============================================ */}
                    <Route path="/campaigns" element={
                        <PrivateRoute><UserCampaigns /></PrivateRoute>
                    } />
                    
                    <Route path="/donors" element={
                        <PrivateRoute><UserDonors /></PrivateRoute>
                    } />
                    
                    <Route path="/user-volunteers" element={
                        <PrivateRoute><UserVolunteers /></PrivateRoute>
                    } />

                    {/* ============================================
                        DEFAULT ROUTES
                    ============================================ */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;