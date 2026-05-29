const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// ============================================
// IMPORT MODELEVE
// ============================================
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');
const CampaignCategory = require('./models/CampaignCategory');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');
const Volunteer = require('./models/Volunteer');

// ============================================
// ASSOCIATIONS
// ============================================
require('./models/associations');

// ============================================
// IMPORT ROUTES
// ============================================
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const campaignCategoryRoutes = require('./routes/campaignCategoryRoutes');
const donationRoutes = require('./routes/donationRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const donorRoutes = require('./routes/donorRoutes');

// ============================================
// DATABASE
// ============================================
const { connectDB } = require('./config/database');

// ============================================
// KRIJO EXPRESS APP
// ============================================
const app = express();

// ============================================
// LIDHU ME DATABAZEN
// ============================================
connectDB();

// ============================================
// MIDDLEWARE - RENDITJA E SAKTË!
// ============================================

// 1. Middleware-t bazë
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(compression());
app.use(morgan('dev'));

// 2. ⚠️ E RËNDËSISHME: Webhook duhet të jetë PARA express.json()
//    Kjo lejon Stripe të dërgojë webhook-un si raw buffer
app.use('/api/payments', paymentRoutes);

// 3. Pastaj vijnë middleware-t për JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Static files
app.use(express.static(path.join(__dirname, '../../')));

// ============================================
// ROUTES (të tjera) - PAS express.json()
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/campaign-categories', campaignCategoryRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donors', donorRoutes);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running!', database: 'MySQL' });
});

// ============================================
// ERROR HANDLERS
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
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🗄️ Database: MySQL`);
});