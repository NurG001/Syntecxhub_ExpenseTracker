const express = require('express');
const router = express.Router();
const { 
    getTransactions, 
    addTransaction, 
    deleteTransaction, 
    getTransactionSummary 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file require a valid JWT token
router.use(protect);

// @route   GET & POST /api/transactions
router.route('/')
    .get(getTransactions)
    .post(addTransaction);

// @route   GET /api/transactions/summary
// Note: This MUST be above the /:id route
router.get('/summary', getTransactionSummary);

// @route   DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

module.exports = router;