import axios from 'axios';
import Cookies from 'js-cookie';

// kijim i nje instance axios me URL baz
const api = axios.create({
    baseURL: 'http://localhost:5000/api',  // URL e backendit
    withCredentials: true,                  // e nevojshme per cookies
    headers: {
        'Content-Type': 'application/json',
    }
});


// request interceptor - Shton token ne qdo kerkes

// ky kod ekzekutohet automatikisht para çdo thirrjeje API
api.interceptors.request.use(
    (config) => {
        // merr access token nga cookies
        const token = Cookies.get('accessToken');
        
        // nese token ekziston shtoje ne header authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// response interceptor - Trajton skadimin e token-it (gabimet 401)

// Ky kod ekzekutohet automatikisht kur nje kerkes deshton
let isRefreshing = false;     // Tregon nese po rifreskohet tokeni
let failedQueue = [];         // Rradha e kerkesav qe presin gjat rifreskimit

// Funksioni qe proceson radhen e kerkesave ne pritje
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);      // Nese ka gabim refuzo premtimin
        } else {
            prom.resolve(token);     // Nese sukse, zgjidhe premtimin me token-in e ri
        }
    });
    failedQueue = [];  // Pastro radhen
};

api.interceptors.response.use(
    (response) => {
        // nese kerkesa ishte e suksesshme thjesht kthe pergjigjen
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // nese gabimi esht 401 (Unauthorized) dhe nuk kemi provuar akoma ta rifreskojm
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            // Nese token-i po rifreskohet per momentin shtoje kete kerkes ne radhe
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
            
            // e shkrujm qe kemi provu me rifresku kerkesen
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Merr refresh token-in nga cookies
                const refreshToken = Cookies.get('refreshToken');
                
                if (!refreshToken) {
                    throw new Error('Nuk ka refresh token');
                }
                
                // Thirr endpointin per rifreskimin e token-it
                const response = await axios.post(
                    'http://localhost:5000/api/auth/refresh-token',
                    { refreshToken: refreshToken },
                    { withCredentials: true }
                );
                
                // Merr tokenat e rinj nga pergjigja
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                
                // Ruaj tokenat e rinj ne cookies
                Cookies.set('accessToken', accessToken, { 
                    secure: true,          // Dergohet permes HTTPS
                    sameSite: 'strict',    // Mbrojtje kunder CSRF
                    expires: 1/96          // Skadon pas 15 minutash
                });
                Cookies.set('refreshToken', newRefreshToken, { 
                    secure: true, 
                    sameSite: 'strict',
                    expires: 7             // Skadon pas 7 ditve
                });
                
                // Perditso headerin Authorization per kerkesen origjinale
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                // Proceso te gjitha kerkesat qe ishin ne radhe
                processQueue(null, accessToken);
                
                // Riprovo kerkesen origjinale
                return api(originalRequest);
                
            } catch (refreshError) {
                // Rifreskimi deshtoi - ridrejto per login
                processQueue(refreshError, null);
                
                // Fshij cookiet ekzistuese
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                sessionStorage.removeItem('user');
                
                // Ridrejto ne faqen e loginit
                window.location.href = '/login';
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;  // Rifreskimi ka perfunduar
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;