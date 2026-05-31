const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getDonationsPerCampaign,
    getTopDonors,
    getExpensesPerCampaign,
    getCampaignSummary
} = require('../controllers/reportController');

// All report endpoints are protected and only for admin/manager (optional)
router.get('/donations-per-campaign', protect, authorize('admin', 'manager'), getDonationsPerCampaign);
router.get('/top-donors', protect, authorize('admin', 'manager'), getTopDonors);
router.get('/expenses-per-campaign', protect, authorize('admin', 'manager'), getExpensesPerCampaign);
router.get('/campaign-summary', protect, authorize('admin', 'manager'), getCampaignSummary);

module.exports = router;