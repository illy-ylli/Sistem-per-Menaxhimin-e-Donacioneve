const Campaign = require('../models/Campaign');

const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll();
        res.json({ success: true, data: campaigns });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        res.json({ success: true, data: campaign });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCampaign = async (req, res) => {
    try {
        console.log('📥 Received campaign data:', req.body);
        const campaign = await Campaign.create(req.body);
        res.status(201).json({ success: true, data: campaign });
    } catch (error) {
        console.error('❌ Error creating campaign:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.errors ? error.errors.map(e => e.message) : error.parent?.sqlMessage
        });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

        console.log(`📝 Updating campaign ${req.params.id} with data:`, req.body);
        await campaign.update(req.body);
        res.json({ success: true, data: campaign });
    } catch (error) {
        console.error('❌ Error updating campaign:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.errors ? error.errors.map(e => e.message) : error.parent?.sqlMessage
        });
    }
};

const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
        await campaign.destroy();
        res.json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign
};