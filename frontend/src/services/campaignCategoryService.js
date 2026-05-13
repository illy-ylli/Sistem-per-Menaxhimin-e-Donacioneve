import api from './api';

const campaignCategoryService = {
    // Merr të gjitha kategoritë
    getAll: async () => {
        try {
            const response = await api.get('/campaign-categories');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Merr një kategori me ID
    getById: async (id) => {
        try {
            const response = await api.get(`/campaign-categories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Krijo një kategori të re
    create: async (data) => {
        try {
            const response = await api.post('/campaign-categories', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Përditëso një kategori
    update: async (id, data) => {
        try {
            const response = await api.put(`/campaign-categories/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Fshi një kategori
    delete: async (id) => {
        try {
            const response = await api.delete(`/campaign-categories/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default campaignCategoryService;