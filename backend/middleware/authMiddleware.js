const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Protect
 * Validates the JWT in the Authorization header.
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token using secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the database (excluding password) and attach to req
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };