const CampaignVolunteer = require('../models/CampaignVolunteer');

const getAllAssignments = async (req, res) => {
    try {
        const assignments = await CampaignVolunteer.findAll();
        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAssignment = async (req, res) => {
    try {
        const { campaign_id, volunteer_id } = req.body;
        const assignment = await CampaignVolunteer.create({ campaign_id, volunteer_id });
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAssignment = async (req, res) => {
    try {
        const assignment = await CampaignVolunteer.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
        await assignment.destroy();
        res.json({ success: true, message: 'Assignment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllAssignments, createAssignment, deleteAssignment };