import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
    const token = Cookies.get('accessToken');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    try {
        const decoded = jwtDecode(token);
        // vetem admin dhe manager mund te hyjne
        if (decoded.role === 'admin' || decoded.role === 'manager') {
            return children;
        }
        // perdoruesit normal ridrejtohen ne dashboard
        return <Navigate to="/dashboard" replace />;
    } catch (error) {
        console.error('AdminRoute error:', error);
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;