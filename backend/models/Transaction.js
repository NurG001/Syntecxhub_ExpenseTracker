const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    text: { type: String, required: [true, 'Please add a description'] },
    amount: { type: Number, required: [true, 'Please add an amount'] },
    category: { type: String, required: true, enum: ['Income', 'Expense'] },
    // ✅ Add this field to store the user-selected date
    date: { type: Date, required: [true, 'Please add a date'], default: Date.now }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Transaction', transactionSchema);