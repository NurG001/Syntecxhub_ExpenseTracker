const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/**
 * MIDDLEWARE SETUP
 * These must come BEFORE your routes to fix the "req.body undefined" error.
 */
app.use(cors()); // Permitting the frontend to communicate with this server
app.use(express.json()); // Parses incoming JSON payloads into req.body
app.use(express.urlencoded({ extended: true }));

/**
 * ROUTE MOUNTING
 * This aligns with your frontend Axios calls.
 */
// Maps to /api/auth/register and /api/auth/login
app.use('/api/auth', authRoutes);

// Maps to /api/transactions and /api/transactions/summary
app.use('/api/transactions', transactionRoutes);

// Basic Health Check
app.get('/', (req, res) => {
    res.send('SyntecxHub API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

