const { body, validationResult } = require('express-validator');

const validateCampaign = [
    body('titulli')
        .notEmpty().withMessage('Titulli eshte i detyrueshem')
        .isLength({ min: 3, max: 200 }).withMessage('Titulli duhet te kete 3-200 karaktere')
        .trim(),
    
    body('pershkrimi')
        .notEmpty().withMessage('Pershkrimi eshte i detyrueshem')
        .isLength({ min: 10 }).withMessage('Pershkrimi duhet te kete te pakten 10 karaktere')
        .trim(),
    
    body('shuma_target')
        .notEmpty().withMessage('Shuma target eshte e detyrueshme')
        .isFloat({ min: 1 }).withMessage('Shuma target duhet te jete se paku 1€')
        .isFloat({ max: 1000000 }).withMessage('Shuma target nuk mund te kaloj 1,000,000€'),
    
    body('data_fillimit')
        .notEmpty().withMessage('Data e fillimit eshte e detyrueshme')
        .isISO8601().withMessage('Data e fillimit nuk eshte e vlefshme'),
    
    body('data_perfundimit')
        .notEmpty().withMessage('Data e perfundimit eshte e detyrueshme')
        .isISO8601().withMessage('Data e perfundimit nuk eshte e vlefshme')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.data_fillimit)) {
                throw new Error('Data e perfundimit duhet te jete pas dates se fillimit');
            }
            return true;
        }),
    
    body('statusi')
        .optional()
        .isIn(['ne_progres', 'aktive', 'perfunduar', 'anuluar'])
        .withMessage('Statusi nuk eshte i vlefshem'),
    
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

module.exports = { validateCampaign };