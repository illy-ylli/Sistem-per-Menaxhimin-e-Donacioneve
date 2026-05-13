const express = require('express');
const router = express.Router();

// Importojme middlewaret per autentikim
const { protect, authorize } = require('../middleware/authMiddleware');

// Importojme funksionet e controller-it qe krijuam me lart
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
    .get(protect, getAllCategories)                    // Kushdo i autentikuar mund te shohe
    .post(protect, authorize('admin', 'manager'), createCategory);  // Vetem admin/manager krijojne

// GET /api/campaign-categories/:id - Merr nje kategori specifike
// PUT /api/campaign-categories/:id - Perditeso nje kategori (vetem admin/manager)
// DELETE /api/campaign-categories/:id - Fshi nje kategori (vetem admin)
router.route('/:id')
    .get(protect, getCategoryById)                    // Kushdo i autentikuar mund te shohe
    .put(protect, authorize('admin', 'manager'), updateCategory)  // Admin/manager perditesojne
    .delete(protect, authorize('admin'), deleteCategory);          // Vetem admin fshin

module.exports = router;