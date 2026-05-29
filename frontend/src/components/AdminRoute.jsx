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
        // Vetëm admin dhe manager mund të hyjnë
        if (decoded.role === 'admin' || decoded.role === 'manager') {
            return children;
        }
        // Përdoruesit normal ridrejtohen në dashboard
        return <Navigate to="/dashboard" replace />;
    } catch (error) {
        console.error('AdminRoute error:', error);
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;