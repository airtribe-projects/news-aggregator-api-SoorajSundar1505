const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validatePreferences } = require('../middleware/validation');

const router = express.Router();

// GET /preferences
router.get('/', authenticateToken, (req, res) => {
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

// PUT /preferences
router.put('/', authenticateToken, validatePreferences, (req, res) => {
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