const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ============================================
// 1. IMPORT MODELEVE (Para associations)
// ============================================
// Modelet qe ekzistojne tashme
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');
const CampaignCategory = require('./models/CampaignCategory');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');
const Volunteer = require('./models/Volunteer');

// Modelet qe do te krijohen me vone (i komentojme tani)
// const Campaign = require('./models/Campaign');
// const Donor = require('./models/Donor');
// const Beneficiary = require('./models/Beneficiary');
// const CampaignVolunteer = require('./models/CampaignVolunteer');
// const Update = require('./models/Update');
// const Report = require('./models/Report');

// ============================================
// 2. VENOS MARREDHENIET (ASSOCIATIONS)
// ============================================
// Kjo duhet te vendoset PASI modelet jane importuar
// Por PARA se te lidhemi me databazen
require('./models/associations');

// ============================================
// 3. IMPORT ROUTES (Pas associations)
// ============================================
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const campaignCategoryRoutes = require('./routes/campaignCategoryRoutes');
const donationRoutes = require('./routes/donationRoutes');
const authRoutes = require('./routes/authRoutes');

// ============================================
// 4. LIDHUNI ME DATABAZEN
// ============================================
const { connectDB } = require('./config/database');

// ============================================
// 5. KRIJO EXPRESS APP
// ============================================
const app = express();

// ============================================
// 6. LIDHU ME DATABAZEN (PASI associations)
// ============================================
connectDB();

// ============================================
// 7. MIDDLEWARE
// ============================================
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from project root (where index.html is)
app.use(express.static(path.join(__dirname, '../../')));

// ============================================
// 8. ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/campaign-categories', campaignCategoryRoutes);
app.use('/api/donations', donationRoutes);

// ============================================
// 9. HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running with Node.js!', database: 'MySQL' });
});

// ============================================
// 10. ERROR HANDLERS
// ============================================
// Catch-all for undefined routes (must come after static and API routes)
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ============================================
// 11. START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Node.js Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️  Database: MySQL`);
});