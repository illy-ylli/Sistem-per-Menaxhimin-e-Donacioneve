const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

router.route('/')
    .get(protect, getAllCategories)
    .post(protect, authorize('admin', 'manager'), createCategory);

router.route('/:id')
    .get(protect, getCategoryById)
    .put(protect, authorize('admin', 'manager'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;