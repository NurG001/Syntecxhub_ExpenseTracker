const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    updateUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import your JWT protector

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (Name/Password)
 * @access  Private
 */
// ✅ 'protect' middleware ensures req.user is populated for the controller
router.put('/profile', protect, updateUserProfile);

module.exports = router;