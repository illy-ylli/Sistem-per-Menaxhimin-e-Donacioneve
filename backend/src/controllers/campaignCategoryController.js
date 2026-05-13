// Importojme modelin qe krijuam me lart
const CampaignCategory = require('../models/CampaignCategory');

// ============================================
// 1. MERRI TE GJITHA KATEGORITE
// ============================================
// Perdorimi: GET /api/campaign-categories
// Kush mund ta perdore: Perdorues te autentikuar (me token)
const getAllCategories = async (req, res) => {
    try {
        // CampaignCategory.findAll() = SELECT * FROM campaign_categories
        const categories = await CampaignCategory.findAll({
            order: [['emertimi', 'ASC']]  // Rendit sipas emrit A-Z
        });
        
        // Dergo pergjigjen si JSON
        res.json({ 
            success: true, 
            count: categories.length,      // Sa kategori u gjeten
            data: categories 
        });
    } catch (error) {
        // Neqoftese ka gabim, dergo status 500 (Internal Server Error)
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 2. MERRI NJE KATEGORI ME ID
// ============================================
// Perdorimi: GET /api/campaign-categories/:id
// Shembull: GET /api/campaign-categories/5
const getCategoryById = async (req, res) => {
    try {
        // CampaignCategory.findByPk() = SELECT * FROM campaign_categories WHERE id = ?
        const category = await CampaignCategory.findByPk(req.params.id);
        
        // Neqoftese nuk ekziston, kthe gabim 404 (Not Found)
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Kategoria nuk u gjet' 
            });
        }
        
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 3. KRIJO NJE KATEGORI TE RE
// ============================================
// Perdorimi: POST /api/campaign-categories
// Kush mund ta perdore: Admin ose Manager (jo perdorues te thjeshte)
// Shembull: dergo JSON me { emertimi: "Mjedisi", pershkrimi: "...", ikona: "🌍" }
const createCategory = async (req, res) => {
    try {
        // Kontrollo neqoftese ekziston tashme nje kategori me te njejtin emer
        const existingCategory = await CampaignCategory.findOne({
            where: { emertimi: req.body.emertimi }
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Nje kategori me kete emer tashme ekziston'
            });
        }
        
        // CampaignCategory.create() = INSERT INTO campaign_categories VALUES (...)
        const category = await CampaignCategory.create(req.body);
        
        // Status 201 = Created (e krijuar me sukses)
        res.status(201).json({ 
            success: true, 
            data: category,
            message: 'Kategoria u krijua me sukses'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 4. PERDITESO NJE KATEGORI
// ============================================
// Perdorimi: PUT /api/campaign-categories/:id
// Kush mund ta perdore: Admin ose Manager
const updateCategory = async (req, res) => {
    try {
        // Gjej kategorine qe do te perditesohet
        const category = await CampaignCategory.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Kategoria nuk u gjet' 
            });
        }
        
        // Kontrollo nese emri i ri eshte tashme ne perdorim nga nje kategori tjeter
        if (req.body.emertimi && req.body.emertimi !== category.emertimi) {
            const existingCategory = await CampaignCategory.findOne({
                where: { emertimi: req.body.emertimi }
            });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Nje kategori me kete emer tashme ekziston'
                });
            }
        }
        
        // category.update() = UPDATE campaign_categories SET ... WHERE id = ?
        await category.update(req.body);
        
        res.json({ 
            success: true, 
            data: category,
            message: 'Kategoria u perditesua me sukses'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 5. FSHIJ NJE KATEGORI
// ============================================
// Perdorimi: DELETE /api/campaign-categories/:id
// Kush mund ta perdore: Vetem Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await CampaignCategory.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Kategoria nuk u gjet' 
            });
        }
        
        // Para se te fshijme, kontrollojme neqoftese ka fushata qe e perdorin kete kategori
        // (Kjo do te shtohet me vone kur te kemi modelin Campaign)
        
        // category.destroy() = DELETE FROM campaign_categories WHERE id = ?
        await category.destroy();
        
        res.json({ 
            success: true, 
            message: 'Kategoria u fshi me sukses' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Eksportojme te gjitha funksionet qe te perdoren ne routes
module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};