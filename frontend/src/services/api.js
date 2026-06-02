import axios from 'axios';
import Cookies from 'js-cookie';

// kijim i nje instance axios me URL baz
const api = axios.create({
    baseURL: 'http://localhost:5000/api',  
    withCredentials: true,                  // e nevojshme per cookies
    headers: {
        'Content-Type': 'application/json',
    }
});



// ky kod ekzekutohet automatikisht para cdo thirrjeje API
api.interceptors.request.use(
    (config) => {

        const token = Cookies.get('accessToken');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// response interceptor - Trajton gabimet 401

// Ky kod ekzekutohet automatikisht kur nje kerkes deshton
let isRefreshing = false;     
let failedQueue = [];         


const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);      
        } else {
            prom.resolve(token);    
        }
    });
    failedQueue = [];  
};

api.interceptors.response.use(
    (response) => {
       
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
      
        if (error.response?.status === 401 && !originalRequest._retry) {
            
           
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }
            
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
              
                const refreshToken = Cookies.get('refreshToken');
                
                if (!refreshToken) {
                    throw new Error('Nuk ka refresh token');
                }
                
                
                const response = await axios.post(
                    'http://localhost:5000/api/auth/refresh-token',
                    { refreshToken: refreshToken },
                    { withCredentials: true }
                );
                
               
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                
                
                Cookies.set('accessToken', accessToken, { 
                    secure: true,          
                    sameSite: 'strict',    
                    expires: 1/96          // 15 MINUTA
                });
                Cookies.set('refreshToken', newRefreshToken, { 
                    secure: true, 
                    sameSite: 'strict',
                    expires: 7             // 7 DIT
                });
                
               
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
               
                processQueue(null, accessToken);
                
                
                return api(originalRequest);
                
            } catch (refreshError) {
                
                processQueue(refreshError, null);
                
                
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                sessionStorage.removeItem('user');
                
                
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;  
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;