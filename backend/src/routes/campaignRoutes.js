const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateCampaign } = require('../middleware/validateCampaign');
const {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign
} = require('../controllers/campaignController');

router.route('/')
    .get(protect, getAllCampaigns)
    .post(protect, authorize('admin', 'manager'), validateCampaign, createCampaign);  // ✅ Shto validimin

router.route('/:id')
    .get(protect, getCampaignById)
    .put(protect, authorize('admin', 'manager'), validateCampaign, updateCampaign)  // ✅ Shto validimin
    .delete(protect, authorize('admin'), deleteCampaign);

module.exports = router;