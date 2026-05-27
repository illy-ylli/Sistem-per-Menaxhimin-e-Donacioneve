import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminRoute from './components/AdminRoute';
import AuthRoute from './components/AuthRoute';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Donors from './pages/Donors';
import Donations from './pages/Donations';
import CampaignCategories from './pages/CampaignCategories';
import UserCampaigns from './pages/UserCampaigns';
import UserDonors from './pages/UserDonors';   // NEW import
import AdminCampaigns from './pages/AdminCampaigns';


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
                {/* REMOVE the old /donors user route – we'll replace with role‑based */}
                <Route path="/donations" element={
                    <PrivateRoute><Donations /></PrivateRoute>
                } />
                
                {/* Public user‑facing placeholders (regular users) */}
                <Route path="/user-campaigns" element={<UserCampaigns />} />
                <Route path="/user-donors" element={<UserDonors />} />   {/* NEW placeholder route */}
                
                {/* Admin‑only routes */}
                <Route path="/admin/campaign-categories" element={
                    <AdminRoute><CampaignCategories /></AdminRoute>
                } />
                <Route path="/admin/donors" element={
                    <AdminRoute><Donors /></AdminRoute>
                } />   {/* Admin full CRUD */}
                
                {/* Default route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;