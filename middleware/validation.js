const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed',
            message: 'Please check your input data',
            details: errors.array()
        });
    }
    next();
};

const validateSignup = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('preferences')
        .optional()
        .isArray()
        .withMessage('Preferences must be an array'),
    handleValidationErrors
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const validatePreferences = [
    body('preferences')
        .isArray()
        .withMessage('Preferences must be an array'),
    body('preferences.*')
        .isString()
        .withMessage('Each preference must be a string'),
    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validatePreferences,
    handleValidationErrors
}; 