const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const generateRefreshToken = async (user, ipAddress, userAgent) => {
    const transaction = await sequelize.transaction();
    
    try {
        await RefreshToken.update(
            { isRevoked: true },
            { where: { userId: user.id, isRevoked: false }, transaction }
        );
        
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        await RefreshToken.create({
            token: refreshToken,
            userId: user.id,
            expiresAt,
            ipAddress,
            userAgent
        }, { transaction });
        
        await transaction.commit();
        return refreshToken;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const verifyRefreshToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const refreshToken = await RefreshToken.findOne({
            where: {
                token: token,
                isRevoked: false,
                expiresAt: { [Op.gt]: new Date() }
            }
        });
        if (!refreshToken) return null;
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };