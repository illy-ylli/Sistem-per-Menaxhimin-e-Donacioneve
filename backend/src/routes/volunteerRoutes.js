const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllVolunteers,
    getVolunteerById,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer
} = require('../controllers/volunteerController');

router.route('/')
    .get(protect, getAllVolunteers)
    .post(protect, authorize('admin', 'manager'), createVolunteer);

router.route('/:id')
    .get(protect, getVolunteerById)
    .put(protect, authorize('admin', 'manager'), updateVolunteer)
    .delete(protect, authorize('admin'), deleteVolunteer);

module.exports = router;