const Transaction = require('../models/Transaction');

/**
 * @desc    Get all transactions for the logged-in user
 * @route   GET /api/transactions
 * @access  Private
 */
exports.getTransactions = async (req, res) => {
    try {
        // Sort by the user-selected date instead of creation time for better accounting
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Add a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
exports.addTransaction = async (req, res) => {
    try {
        // ✅ Added 'date' to destructuring to fix "Invalid Date" frontend errors
        const { text, amount, category, date, icon } = req.body;

        // Validation: ensures all required fields are present
        if (!text || amount === undefined || !category) {
            return res.status(400).json({ message: "Please provide text, amount, and category" });
        }

        const transaction = await Transaction.create({
            text,
            amount: Number(amount), // Ensure strict numeric type for summary math
            category,
            date: date || new Date(), // Fallback to current date if none provided
            icon: icon || '💸',
            user: req.user.id 
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Delete a transaction
 */
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await transaction.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Transaction removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get summary for dashboard
 * @route   GET /api/transactions/summary
 */
exports.getTransactionSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        const amounts = transactions.map(t => t.amount);

        const totalBalance = amounts.reduce((acc, item) => acc + item, 0);

        // ✅ Income: Filters for positive numbers
        const income = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => acc + item, 0);

        // ✅ Expense: Filters for negative numbers and flips sign for UI display
        const expense = Math.abs(
            amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0)
        );

        res.status(200).json({
            totalBalance,
            income,
            expense,
            transactionCount: transactions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};