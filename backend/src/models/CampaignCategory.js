const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

//perfaqeson tabellen campaign_categories ne databaze
const CampaignCategory = sequelize.define('CampaignCategory', {
    id: {
        type: DataTypes.INTEGER,       
        primaryKey: true,               // PRIMARY KEY 
        autoIncrement: true            
    },
    emertimi: {
        type: DataTypes.STRING(100),    
        allowNull: false,              
        unique: true,                   
        comment: 'Emri i kategorise p.sh., "Arsim", "Shendetesi"'
    },
    pershkrimi: {
        type: DataTypes.TEXT,           
        allowNull: true,                
        comment: 'Pershkrimi i detajuar i kategorise'
    },
    ikona: {
        type: DataTypes.STRING(50),     
        defaultValue: '🎯',             // nese sjep user kurgjo osht qikjo baz
        comment: 'Emoji per paraqitje vizuale (🎓,🏥,👶)'
    },
    ngjyra: {
        type: DataTypes.STRING(20),     
        defaultValue: '#26a69a',      // nese user nuk jep ngjyre osht kjo baz 
        comment: 'Ngjyra per kategorine ne UI'
    }
}, {
    tableName: 'campaign_categories',  
    timestamps: true                    
});

module.exports = CampaignCategory;