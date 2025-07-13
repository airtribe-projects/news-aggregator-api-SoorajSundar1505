const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateLogin } = require('../middleware/validation');
const config = require('../config/config');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '24h' });
};

// POST /login
router.post('/', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid credentials',
                message: 'Email or password is incorrect'
            });
        }

        // Generate token
        const token = generateToken(user.id);

        res.status(200).json({
            message: 'Login successful',
            user: user.toJSON(),
            token
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to authenticate user'
        });
    }
});

module.exports = router; 