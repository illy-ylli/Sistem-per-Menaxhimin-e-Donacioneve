const express = require('express');
const router = express.Router();

// import
const { protect, authorize } = require('../middleware/authMiddleware');

// import
const { validateCategory } = require('../middleware/validate');

// import
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/campaignCategoryController');

// ============================================
// ROUTES PER KATEGORITE E FUSHATAVE
// ============================================

router.route('/')
    .get(protect, getAllCategories)
    .post(protect, authorize('admin', 'manager'), validateCategory, createCategory);  //  shto validateCategory 


router.route('/:id')
    .get(protect, getCategoryById)
    .put(protect, authorize('admin', 'manager'), validateCategory, updateCategory)  //  shto validateCategory 
    .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;