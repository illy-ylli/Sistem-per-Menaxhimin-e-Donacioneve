const { Sequelize } = require('sequelize');
require('dotenv').config();

// lidhja me MySql
const sequelize = new Sequelize(
    process.env.DB_NAME,      // charity_db
    process.env.DB_USER,      
    process.env.DB_PASSWORD,  
    {
        host: process.env.DB_HOST,  // localhost
        port: process.env.DB_PORT,  // 3306
        dialect: 'mysql',
        logging: false,  // bone true me i pa sql queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// testo per me pa lidhjen mes databazes 
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Lidhja me MySql sukses');
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log(`User: ${process.env.DB_USER}`);
        
        // boni sync gjitha modelet (krijo tabela nese ska hiq)
        await sequelize.sync({ alter: false });
        console.log('Tabelat e databazes jane bere sync');
    } catch (error) {
        console.error('Lidhja me MySQL nuk eshte bere:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };