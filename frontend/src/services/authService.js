import api from './api';
import Cookies from 'js-cookie';

const authService = {
    
    // REGJISTRIMI 
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            
           
            if (response.data.accessToken) {
               
                Cookies.set('accessToken', response.data.accessToken, {
                    secure: true,
                    sameSite: 'strict',
                    expires: 1/96  // 15 MINUTA
                });
                
                
                Cookies.set('refreshToken', response.data.refreshToken, {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7  // 7 DIT
                });
                
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    

    // IDENTIFIKIMI
    login: async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        
        if (response.data.accessToken) {
            Cookies.set('accessToken', response.data.accessToken, {
                secure: true,
                sameSite: 'strict',
                expires: 1/96
            });
            
            Cookies.set('refreshToken', response.data.refreshToken, {
                secure: true,
                sameSite: 'strict',
                expires: 7
            });
            
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
    }
},
    
    // DALJA 
    logout: async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken: refreshToken });
            }
            
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            sessionStorage.removeItem('user');
            
        } catch (error) {
            console.error('Gabim gjatë daljes:', error);
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            sessionStorage.removeItem('user');
        }
    },
    
    // MERR PERDORUESIN AKTUAL
    getCurrentUser: () => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },
    
    
    // I AUTENTIFIKUAR 
    isAuthenticated: () => {
        const token = Cookies.get('accessToken');
        return !!token; 
    }
};

export default authService;