const express = require('express');
const router = express.Router();

// Importojme middlewaret per autentikim
const { protect, authorize } = require('../middleware/authMiddleware');

// Importojme validimin
const { validateCategory } = require('../middleware/validate');

// Importojme funksionet e controller-it
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

// GET /api/campaign-categories - Merr te gjitha kategorite
// POST /api/campaign-categories - Krijo nje kategori te re (vetem admin/manager)
router.route('/')
    .get(protect, getAllCategories)
    .post(protect, authorize('admin', 'manager'), validateCategory, createCategory);  // ← Shto validateCategory KETU!

// GET /api/campaign-categories/:id - Merr nje kategori specifike
// PUT /api/campaign-categories/:id - Perditeso nje kategori (vetem admin/manager)
// DELETE /api/campaign-categories/:id - Fshi nje kategori (vetem admin)
router.route('/:id')
    .get(protect, getCategoryById)
    .put(protect, authorize('admin', 'manager'), validateCategory, updateCategory)  // ← Shto validateCategory KETU!
    .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;