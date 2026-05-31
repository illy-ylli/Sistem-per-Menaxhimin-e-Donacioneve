const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const Donor = require('../models/Donor');

// GET /api/donors - Te gjithe perdoruesit mund te shohin donatoret (versioni i thjeshte)
router.get('/', protect, async (req, res) => {
    try {
        const donors = await Donor.findAll({
            attributes: ['id', 'emri', 'mbiemri', 'email', 'total_dhuruar', 'donation_count'],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: donors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/donors - Vetem admin/manager
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const donor = await Donor.create(req.body);
        res.status(201).json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/donors/:id - Te gjithe mund te shohin nje donor
router.get('/:id', protect, async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) {
            return res.status(404).json({ success: false, message: 'Donatori nuk u gjet' });
        }
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/donors/:id - Vetem admin/manager
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) {
            return res.status(404).json({ success: false, message: 'Donatori nuk u gjet' });
        }
        await donor.update(req.body);
        res.json({ success: true, data: donor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/donors/:id - Vetem admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) {
            return res.status(404).json({ success: false, message: 'Donatori nuk u gjet' });
        }
        await donor.destroy();
        res.json({ success: true, message: 'Donatori u fshi me sukses' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;