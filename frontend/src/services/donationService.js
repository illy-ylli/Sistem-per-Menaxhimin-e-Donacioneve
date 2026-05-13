import api from './api';

const donationService = {
    // Merr të gjitha donacionet
    getAll: async () => {
        try {
            const response = await api.get('/donations');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Merr një donacion me ID
    getById: async (id) => {
        try {
            const response = await api.get(`/donations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Krijo një donacion të ri
    create: async (data) => {
        try {
            const response = await api.post('/donations', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Përditëso statusin e donacionit (vetëm admin)
    updateStatus: async (id, statusi) => {
        try {
            const response = await api.put(`/donations/${id}`, { statusi });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Fshi një donacion (vetëm admin)
    delete: async (id) => {
        try {
            const response = await api.delete(`/donations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Merr donacionet e një fushate
    getByCampaign: async (campaignId) => {
        try {
            const response = await api.get(`/donations/campaign/${campaignId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Merr donacionet e një donatori
    getByDonor: async (donorId) => {
        try {
            const response = await api.get(`/donations/donor/${donorId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default donationService;