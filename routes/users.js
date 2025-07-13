const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validateSignup, validateLogin, validatePreferences } = require('../middleware/validation');
const config = require('../config/config');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '24h' });
};

// POST /users/signup
router.post('/signup', validateSignup, async (req, res) => {
    try {
        const { name, email, password, preferences = [] } = req.body;

        // Create new user
        const user = await User.create(name, email, password, preferences);
        
        // Generate token
        const token = generateToken(user.id);

        res.status(200).json({
            message: 'User created successfully',
            user: user.toJSON(),
            token
        });
    } catch (error) {
        if (error.message === 'User already exists') {
            return res.status(400).json({
                error: 'User already exists',
                message: 'A user with this email already exists'
            });
        }
        
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to create user'
        });
    }
});

// POST /users/login
router.post('/login', validateLogin, async (req, res) => {
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

// GET /users/preferences
router.get('/preferences', authenticateToken, (req, res) => {
    try {
        res.status(200).json({
            preferences: req.user.preferences
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to retrieve preferences'
        });
    }
});

// PUT /users/preferences
router.put('/preferences', authenticateToken, validatePreferences, (req, res) => {
    try {
        const { preferences } = req.body;
        
        // Update user preferences
        req.user.preferences = preferences;

        res.status(200).json({
            message: 'Preferences updated successfully',
            preferences: req.user.preferences
        });
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to update preferences'
        });
    }
});

module.exports = router; 