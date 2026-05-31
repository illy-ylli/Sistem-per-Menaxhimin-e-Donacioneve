const { body, validationResult } = require('express-validator');

// ============================================
// VALIDIMI PËR KATEGORITË
// ============================================
const validateCategory = [
    // Validimi i emrit
    body('emertimi')
        .notEmpty().withMessage('Emri i kategorisë është i detyrueshëm')
        .isLength({ min: 2, max: 100 }).withMessage('Emri duhet të ketë 2-100 karaktere')
        .trim(),
    
    // Validimi i përshkrimit (opsional)
    body('pershkrimi')
        .optional()
        .isLength({ max: 500 }).withMessage('Përshkrimi nuk mund të kalojë 500 karaktere')
        .trim(),
    
    // Validimi i ikonës
    body('ikona')
        .optional()
        .isLength({ max: 10 }).withMessage('Ikona nuk mund të kalojë 10 karaktere'),
    
    // Validimi i ngjyrës (duhet të jetë hex color)
    body('ngjyra')
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Ngjyra duhet të jetë në format hex (#RRGGBB)'),
    
    // Nëse ka gabime, kthejini
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        next();
    }
];

// ============================================
// VALIDIMI PËR DONACIONET
// ============================================
const validateDonation = [
    // Validimi i campaign_id
    body('campaign_id')
        .notEmpty().withMessage('ID e fushatës është e detyrueshme')
        .isInt({ min: 1 }).withMessage('ID e fushatës duhet të jetë numër pozitiv'),
    
    // Validimi i donor_id
    body('donor_id')
        .notEmpty().withMessage('ID e donatorit është e detyrueshme')
        .isInt({ min: 1 }).withMessage('ID e donatorit duhet të jetë numër pozitiv'),
    
    // Validimi i shumës
    body('shuma')
        .notEmpty().withMessage('Shuma është e detyrueshme')
        .isFloat({ min: 0.01 }).withMessage('Shuma duhet të jetë së paku 0.01€')
        .isFloat({ max: 100000 }).withMessage('Shuma nuk mund të kalojë 100,000€'),
    
    // Validimi i metodës së pagesës
    body('metoda_pageses')
        .optional()
        .isIn(['karte_krediti', 'paypal', 'bank_transfer', 'cash', 'other'])
        .withMessage('Metoda e pagesës nuk është e vlefshme'),
    
    // Validimi i mesazhit
    body('mesazhi')
        .optional()
        .isLength({ max: 500 }).withMessage('Mesazhi nuk mund të kalojë 500 karaktere')
        .trim(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        next();
    }
];

// ============================================
// VALIDIMI PËR PËRDORUESIT (REGJISTRIM)
// ============================================
const validateUser = [
    body('email')
        .notEmpty().withMessage('Email është i detyrueshëm')
        .isEmail().withMessage('Email-i nuk është i vlefshëm')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Fjalëkalimi është i detyrueshëm')
        .isLength({ min: 6 }).withMessage('Fjalëkalimi duhet të ketë të paktën 6 karaktere')
        .matches(/[0-9]/).withMessage('Fjalëkalimi duhet të përmbajë të paktën një numër')
        .matches(/[A-Z]/).withMessage('Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe'),
    
    body('firstName')
        .notEmpty().withMessage('Emri është i detyrueshëm')
        .isLength({ min: 2, max: 50 }).withMessage('Emri duhet të ketë 2-50 karaktere')
        .trim(),
    
    body('lastName')
        .notEmpty().withMessage('Mbiemri është i detyrueshëm')
        .isLength({ min: 2, max: 50 }).withMessage('Mbiemri duhet të ketë 2-50 karaktere')
        .trim(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        next();
    }
];

module.exports = { validateCategory, validateDonation, validateUser };