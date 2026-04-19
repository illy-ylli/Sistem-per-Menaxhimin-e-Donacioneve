const Expense = require('../models/Expense');

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        await expense.update(req.body);
        res.json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        await expense.destroy();
        res.json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense
};