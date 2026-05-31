const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllAssignments,
    createAssignment,
    deleteAssignment
} = require('../controllers/campaignVolunteerController');

router.route('/')
    .get(protect, authorize('admin', 'manager'), getAllAssignments)
    .post(protect, authorize('admin', 'manager'), createAssignment);

router.route('/:id')
    .delete(protect, authorize('admin', 'manager'), deleteAssignment);

module.exports = router;