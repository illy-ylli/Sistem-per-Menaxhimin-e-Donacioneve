const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password, firstName, lastName, role } = req.body;
        
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = await User.create({ email, password, firstName, lastName, role: role || 'user' });
        
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);
        
        const userData = user.toJSON();
        delete userData.password;
        
        res.status(201).json({ success: true, user: userData, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }
        
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user, ipAddress, userAgent);
        
        const userData = user.toJSON();
        delete userData.password;
        
        res.json({ success: true, user: userData, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        
        const decoded = await verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        
        const user = await User.findByPk(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'User not found or inactive' });
        }
        
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user, ipAddress, userAgent);
        
        res.json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (refreshToken) {
            await RefreshToken.update({ isRevoked: true }, { where: { token: refreshToken } });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login, refreshToken, logout, getMe };