import api from './api';

const dashboardService = {
    getStats: async () => {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error('Gabim në dashboard stats:', error);
            return { success: false, data: null };
        }
    }
};

export default dashboardService;