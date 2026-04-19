const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

router.route('/')
    .get(protect, getAllExpenses)
    .post(protect, authorize('admin', 'manager'), createExpense);

router.route('/:id')
    .get(protect, getExpenseById)
    .put(protect, authorize('admin', 'manager'), updateExpense)
    .delete(protect, authorize('admin'), deleteExpense);

module.exports = router;