import api from './api';

const donationService = {
    // Merr te gjitha donacionet
    getAll: async () => {
        try {
            const response = await api.get('/donations');
            return response.data;
        } catch (error) {
            console.error('Gabim ne getAll donations:', error);
            return { success: true, data: [], count: 0 };
        }
    },
    
    // Merr nje donacion me ID
    getById: async (id) => {
        try {
            const response = await api.get(`/donations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Krijo nje donacion te ri
    create: async (data) => {
        try {
            // Sigurohu qe nuk kemi donor_id te panevojshme
            const { donor_id, ...cleanData } = data;
            const response = await api.post('/donations', cleanData);
            return response.data;
        } catch (error) {
            console.error('Gabim ne create donation:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Perditeso statusin e donacionit
    updateStatus: async (id, statusi) => {
        try {
            const response = await api.put(`/donations/${id}`, { statusi });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Fshi nje donacion
    delete: async (id) => {
        try {
            const response = await api.delete(`/donations/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    // Merr donacionet e nje fushate
    getByCampaign: async (campaignId) => {
        try {
            const response = await api.get(`/donations/campaign/${campaignId}`);
            return response.data;
        } catch (error) {
            return { success: true, data: [], count: 0 };
        }
    },
    
    // Merr donacionet e nje donatori
    getByDonor: async (donorId) => {
        try {
            const response = await api.get(`/donations/donor/${donorId}`);
            return response.data;
        } catch (error) {
            return { success: true, data: [], count: 0 };
        }
    }
};

export default donationService;