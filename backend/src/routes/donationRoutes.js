const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonationStatus,
    deleteDonation,
    getDonationsByCampaign,
    getDonationsByDonor
} = require('../controllers/donationController');

// ============================================
// ROUTES PER DONACIONET
// ============================================

// GET /api/donations - Merr te gjitha donacionet
// POST /api/donations - Krijo nje donacion te ri (cdo perdorues i autentikuar)
router.route('/')
    .get(protect, getAllDonations)
    .post(protect, createDonation);

// GET /api/donations/campaign/:campaignId - Donacionet e nje fushate
router.get('/campaign/:campaignId', protect, getDonationsByCampaign);

// GET /api/donations/donor/:donorId - Donacionet e nje donatori
router.get('/donor/:donorId', protect, getDonationsByDonor);

// GET /api/donations/:id - Merr nje donacion specifik
// PUT /api/donations/:id - Perditeso statusin e donacionit (vetem admin)
// DELETE /api/donations/:id - Fshi nje donacion (vetem admin)
router.route('/:id')
    .get(protect, getDonationById)
    .put(protect, authorize('admin'), updateDonationStatus)
    .delete(protect, authorize('admin'), deleteDonation);

module.exports = router;