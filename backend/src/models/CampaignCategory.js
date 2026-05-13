const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

//perfaqeson tabellen campaign_categories ne databaze
// Perdoret per te kategorizuar fushatat ( "Arsim", "Shendetesia", "Femije")
const CampaignCategory = sequelize.define('CampaignCategory', {
    id: {
        type: DataTypes.INTEGER,        // Numer i plote
        primaryKey: true,               // Ky eshte celesi primar
        autoIncrement: true             // Rritet automatikisht (1,2,3...)
    },
    emertimi: {
        type: DataTypes.STRING(100),    // Varg teksti deri ne 100 karaktere
        allowNull: false,               // Nuk mund te jete bosh
        unique: true,                   // Nuk mund te kete dy kategori me te njejtin emer
        comment: 'Emri i kategorise p.sh., "Arsim", "Shendetesi"'
    },
    pershkrimi: {
        type: DataTypes.TEXT,           // Tekst i gjate (pa limit karakteresh)
        allowNull: true,                // Mund te jete bosh (jo i detyrueshem)
        comment: 'Pershkrimi i detajuar i kategorise'
    },
    ikona: {
        type: DataTypes.STRING(50),     // Emoji per kategorine
        defaultValue: '🎯',             // Neqoftese nuk jepet  vendos '🎯'
        comment: 'Emoji per paraqitje vizuale (🎓,🏥,👶)'
    },
    ngjyra: {
        type: DataTypes.STRING(20),     // Kod ngjyre si '#26a69a' ose 'red'
        defaultValue: '#26a69a',        // Ngjyra e paracaktuar (teal/jeshile)
        comment: 'Ngjyra per kategorine ne UI'
    }
}, {
    tableName: 'campaign_categories',   // Emri i tabeles ne MySQL
    timestamps: true                    // Shton createdAt dhe updatedAt automatikisht
});

module.exports = CampaignCategory;