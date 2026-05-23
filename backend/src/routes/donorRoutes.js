const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllDonors,
    getDonorById,
    createDonor,
    updateDonor,
    deleteDonor
} = require('../controllers/donorController');

router.route('/')
    .get(protect, getAllDonors)
    .post(protect, authorize('admin', 'manager'), createDonor);

router.route('/:id')
    .get(protect, getDonorById)
    .put(protect, authorize('admin', 'manager'), updateDonor)
    .delete(protect, authorize('admin'), deleteDonor);

module.exports = router;