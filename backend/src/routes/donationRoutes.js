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

// GET /api/donations - Te gjithe perdoruesit e autentikuar mund te shohin donacionet
// POST /api/donations - Te gjithe perdoruesit mund te krijojne donacion
router.route('/')
    .get(protect, getAllDonations)
    .post(protect, createDonation);

router.get('/campaign/:campaignId', protect, getDonationsByCampaign);
router.get('/donor/:donorId', protect, getDonationsByDonor);

router.route('/:id')
    .get(protect, getDonationById)
    .put(protect, authorize('admin', 'manager'), updateDonationStatus)
    .delete(protect, authorize('admin'), deleteDonation);

module.exports = router;