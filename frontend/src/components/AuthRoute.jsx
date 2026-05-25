import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthRoute = ({ children }) => {
    const token = Cookies.get('accessToken');
    
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

export default AuthRoute;