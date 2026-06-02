// Importojme modelin qe krijuam me lart
const CampaignCategory = require('../models/CampaignCategory');

// ============================================
// 1. MERRI TE GJITHA KATEGORITE
// ============================================
// Perdorimi: GET /api/campaign-categories
// Kush mund ta perdore: Perdorues te autentikuar (me token)
const getAllCategories = async (req, res) => {
    try {
        const categories = await CampaignCategory.findAll({
            order: [['emertimi', 'ASC']]  // Rendit sipas emrit A-Z
        });
        
        // kthehet si json
        res.json({ 
            success: true, 
            count: categories.length,      // sa kategori u gjeten
            data: categories 
        });
    } catch (error) {
        // nqoftese ka gabim, dergo status 500 / Internal Server Error
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
        const category = await CampaignCategory.findByPk(req.params.id);
        
        // nqoftese nuk ekziston, kthe gabim 404 / Not Found
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
        // kqyre neqoftese ekziston tashme nje kategori me te njejtin emer
        const existingCategory = await CampaignCategory.findOne({
            where: { emertimi: req.body.emertimi }
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Nje kategori me kete emer tashme ekziston'
            });
        }
        
        const category = await CampaignCategory.create(req.body);
        
        // Status 201 = Created / e krijuar me sukses
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
        // gjeje kategorine qe do te perditesohet
        const category = await CampaignCategory.findByPk(req.params.id);
        
        if (!category) {
            return res.status(404).json({ 
                success: false, 
                message: 'Kategoria nuk u gjet' 
            });
        }
        
        // kqyre nese emri i ri eshte tashme ne perdorim nga nje kategori tjeter
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
        
        // para se me fshi, kontrollojme neqoftese ka fushata qe e perdorin kete kategori
        
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

// export kejt funksionet qe te perdoren ne routes
module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};