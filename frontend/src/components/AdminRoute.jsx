import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
    const token = Cookies.get('accessToken');
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin' || decoded.role === 'manager') {
            return children;
        }
        return <Navigate to="/" />;
    } catch (error) {
        return <Navigate to="/login" />;
    }
};

export default AdminRoute;