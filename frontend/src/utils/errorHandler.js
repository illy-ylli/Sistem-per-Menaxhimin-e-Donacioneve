import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export const handleError = (error, defaultMessage = 'Ndodhi nje gabim') => {
    console.error('Gabimi:', error);
    
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
            toast.error('Sesioni ka skaduar. Ju lutem kyquni perseri.');
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            sessionStorage.removeItem('user');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return;
        }
        
        if (status === 403) {
            toast.error('Nuk keni leje per te kryer kete veprim.');
            return;
        }
        
        if (status === 400) {
            if (data.errors && Array.isArray(data.errors)) {
                data.errors.forEach(err => {
                    toast.error(err.msg || err.message);
                });
                return;
            }
            if (data.message) {
                toast.error(data.message);
                return;
            }
        }
        
        if (status === 404) {
            toast.error(data.message || 'Resursi nuk u gjet.');
            return;
        }
        
        if (status === 500) {
            toast.error('Gabim ne server. Provo me vone.');
            return;
        }
        
        toast.error(data.message || data.error || defaultMessage);
        return;
    }
    
    if (error.request) {
        toast.error('Nuk mund te lidhej me serverin. Kontrollo lidhjen e internetit.');
        return;
    }
    
    toast.error(error.message || defaultMessage);
};

export const showSuccess = (message) => {
    toast.success(message);
};

export const showWarning = (message) => {
    toast.error(message, { icon: '⚠️' });
};