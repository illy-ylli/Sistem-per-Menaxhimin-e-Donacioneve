const Donor = require('../models/Donor');

const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.findAll();
        res.json({ success: true, data: donors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDonor = async (req, res) => {
    try {
        const donor = await Donor.create(req.body);
        res.status(201).json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDonor = async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        await donor.update(req.body);
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDonor = async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ message: 'Donor not found' });
        await donor.destroy();
        res.json({ success: true, message: 'Donor deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllDonors,
    getDonorById,
    createDonor,
    updateDonor,
    deleteDonor
};