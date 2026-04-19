const Volunteer = require('../models/Volunteer');

const getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll();
        res.json({ success: true, data: volunteers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        res.json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.create(req.body);
        res.status(201).json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        await volunteer.update(req.body);
        res.json({ success: true, data: volunteer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
        await volunteer.destroy();
        res.json({ success: true, message: 'Volunteer deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllVolunteers,
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer
};