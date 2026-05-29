import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

/**
 * Funksioni kryesor për trajtimin e gabimeve
 * @param {Error} error - Gabimi nga catch
 * @param {string} defaultMessage - Mesazhi default
 */
export const handleError = (error, defaultMessage = 'Ndodhi nje gabim') => {
    console.error('Gabimi:', error);
    
    // Nese gabimi ka response nga serveri
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        // 401 - Sesioni ka skaduar
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
        
        // 403 - Nuk ka leje
        if (status === 403) {
            toast.error('Nuk keni leje per te kryer kete veprim.');
            return;
        }
        
        // 400 - Gabim validimi
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
        
        // 404 - Nuk u gjet
        if (status === 404) {
            toast.error(data.message || 'Resursi nuk u gjet.');
            return;
        }
        
        // 500 - Gabim serveri
        if (status === 500) {
            toast.error('Gabim ne server. Provo me vone.');
            return;
        }
        
        // Gabime tjera
        toast.error(data.message || data.error || defaultMessage);
        return;
    }
    
    // Gabim network (nuk lidhet me serverin)
    if (error.request) {
        toast.error('Nuk mund te lidhej me serverin. Kontrollo lidhjen e internetit.');
        return;
    }
    
    // Gabim tjeter
    toast.error(error.message || defaultMessage);
};

/**
 * Shfaq mesazh suksesi
 */
export const showSuccess = (message) => {
    toast.success(message);
};

/**
 * Shfaq mesazh paralajmerimi
 */
export const showWarning = (message) => {
    toast.error(message, { icon: '⚠️' });
};