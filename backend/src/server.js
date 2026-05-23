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
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');
const CampaignCategory = require('./models/CampaignCategory');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');
const Volunteer = require('./models/Volunteer');

// ============================================
// 2. VENOS MARREDHENIET (ASSOCIATIONS)
// ============================================
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
const paymentRoutes = require('./routes/paymentRoutes');

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
// 7. MIDDLEWARE - RENDITJA E SAKTE
// ============================================
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(compression());
app.use(morgan('dev'));

// ✅ Këto duhet të jenë PARA çdo rruge!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../../')));

// ============================================
// 8. ROUTES - VENDOSI Rrugët PAS middleware-ve
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/campaign-categories', campaignCategoryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/payments', paymentRoutes);  // <- Tani është PAS express.json()

// ============================================
// 9. HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running with Node.js!', database: 'MySQL' });
});

// ============================================
// 10. ERROR HANDLERS
// ============================================
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

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