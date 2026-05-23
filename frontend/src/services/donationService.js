import api from './api';

const donationService = {
    // Merr të gjitha donacionet
    getAll: async () => {
        try {
            const response = await api.get('/donations');
            return response.data;
        } catch (error) {
            console.error('Gabim në getAll donations:', error);
            // Kthe një array bosh në vend të gabimit
            return { success: true, data: [], count: 0 };
        }
    },
    
    // Merr një donacion me ID
    getById: async (id) => {
        try {
            const response = await api.get(`/donations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Gabim në getById donation:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Krijo një donacion të ri
    create: async (data) => {
        try {
            const response = await api.post('/donations', data);
            return response.data;
        } catch (error) {
            console.error('Gabim në create donation:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Përditëso statusin e donacionit
    updateStatus: async (id, statusi) => {
        try {
            const response = await api.put(`/donations/${id}`, { statusi });
            return response.data;
        } catch (error) {
            console.error('Gabim në updateStatus donation:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Fshi një donacion
    delete: async (id) => {
        try {
            const response = await api.delete(`/donations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Gabim në delete donation:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Merr donacionet e një fushate
    getByCampaign: async (campaignId) => {
        try {
            const response = await api.get(`/donations/campaign/${campaignId}`);
            return response.data;
        } catch (error) {
            console.error('Gabim në getByCampaign donation:', error);
            return { success: true, data: [], count: 0 };
        }
    },
    
    // Merr donacionet e një donatori
    getByDonor: async (donorId) => {
        try {
            const response = await api.get(`/donations/donor/${donorId}`);
            return response.data;
        } catch (error) {
            console.error('Gabim në getByDonor donation:', error);
            return { success: true, data: [], count: 0 };
        }
    }
};

export default donationService;