const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required',
            message: 'Please provide a valid authentication token'
        });
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                error: 'Invalid token',
                message: 'The provided token is invalid or expired'
            });
        }

        const user = User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ 
                error: 'User not found',
                message: 'The user associated with this token no longer exists'
            });
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken }; 