import api from './api';
import Cookies from 'js-cookie';

const authService = {
    
    // REGJISTRIMI - Krijon nje llogari te re perdoruesi
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            
            // Nese regjistrimi i suksesshem ruaj tokenat ne cookies
            if (response.data.accessToken) {
                // Ruaj access token (skadon pas 15 minutash)
                Cookies.set('accessToken', response.data.accessToken, {
                    secure: true,
                    sameSite: 'strict',
                    expires: 1/96  // 15 minuta = 1/96 e nje dite
                });
                
                // Ruaj refresh token (skadon pas 7 ditesh)
                Cookies.set('refreshToken', response.data.refreshToken, {
                    secure: true,
                    sameSite: 'strict',
                    expires: 7  // 7 dit
                });
                
                // Ruaj informacionin e perdoruesit ne sessionStorage (pastrohet kur mbyllet shfletuesi)
                // Kjo eshte e sigurt sepse nuk eshte e ndjeshme (pa fjalkalim, pa token-a)
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    

    // IDENTIFIKIMI - Autentikon përdoruesin ekzistues
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
        // nxerre mesazhin e errorit nga backendi
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
    }
},
    
    // DALJA - Përfundon sesionin e përdoruesit
    logout: async () => {
        try {
            // Merr refresh token nga cookies
            const refreshToken = Cookies.get('refreshToken');
            
            // Trego backendit te heq refresh token-in
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken: refreshToken });
            }
            
            // Pastro te gjitha te dhenat lokale
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            sessionStorage.removeItem('user');
            
        } catch (error) {
            console.error('Gabim gjatë daljes:', error);
            // pastro te dhenat lokale edhe nese thirrja API deshton
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            sessionStorage.removeItem('user');
        }
    },
    
    // MERR PERDORUESIN AKTUAL - Merr perdoruesin nga sessionStorage
    getCurrentUser: () => {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },
    
    
    // I AUTENTIFIKUAR - Kontrollon nese perdoruesi eshte i futur
    isAuthenticated: () => {
        const token = Cookies.get('accessToken');
        return !!token;  // Kthen true nese token-i ekziston
    }
};

export default authService;