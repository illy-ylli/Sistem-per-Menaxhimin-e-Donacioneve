// ============================================
// KY FILE VENDOS MARREDHENIET MIDIS TABELAVE
// ============================================
// VERSION I PErKOHShEM - PUNON VETEM ME MODELET EKZISTUESE

// ============================================
// IMPORTIMI I MODELEVE EKZISTUESE
// ============================================
const User = require('./User');
const RefreshToken = require('./RefreshToken');
const CampaignCategory = require('./CampaignCategory');
// const Campaign = require('./Campaign');           // KOMENTO - Krijohet me vone
// const Donor = require('./Donor');                 // KOMENTO - Krijohet me vone
const Donation = require('./Donation');
const Expense = require('./Expense');             // Ekziston
// const Beneficiary = require('./Beneficiary');     // KOMENTO - Krijohet me vone
const Volunteer = require('./Volunteer');         // Ekziston
// const CampaignVolunteer = require('./CampaignVolunteer'); // KOMENTO - Krijohet me vone
// const Update = require('./Update');               // KOMENTO - Krijohet me vone
// const Report = require('./Report');               // KOMENTO - Krijohet me vone

// ============================================
// MARREDHENIET PER USER (PERDORUESIT)
// ============================================
// Keto punojne sepse User dhe RefreshToken ekzistojne

// User -> RefreshToken (Nje user ka shume refresh token-a)
User.hasMany(RefreshToken, { 
    foreignKey: 'userId', 
    as: 'refreshTokens',
    onDelete: 'CASCADE' 
});
RefreshToken.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'user' 
});

// ============================================
// PJESET E KOMENTUARA (Do te zhbllokohen kur modelet te krijohen)
// ============================================

/*
// MARREDHENIET PER DONATION (DONACIONET)
// Do te zhbllokohet kur Campaign dhe Donor te krijohen
Donation.belongsTo(Campaign, { 
    foreignKey: 'campaign_id', 
    as: 'campaign',
    onDelete: 'CASCADE'
});
Campaign.hasMany(Donation, { 
    foreignKey: 'campaign_id', 
    as: 'donations',
    onDelete: 'CASCADE'
});
Donation.belongsTo(Donor, { 
    foreignKey: 'donor_id', 
    as: 'donor',
    onDelete: 'RESTRICT'
});
Donor.hasMany(Donation, { 
    foreignKey: 'donor_id', 
    as: 'donations',
    onDelete: 'RESTRICT'
});

// MARREDHENIET PER CAMPAIGN CATEGORY (KATEGORITE E FUSHATAVE)
// Do te zhbllokohet kur Campaign te krijohet
CampaignCategory.hasMany(Campaign, { 
    foreignKey: 'category_id', 
    as: 'campaigns',
    onDelete: 'RESTRICT'
});
Campaign.belongsTo(CampaignCategory, { 
    foreignKey: 'category_id', 
    as: 'category',
    onDelete: 'RESTRICT'
});

// User -> Donor (Nje user mund te jete nje donor)
// Do te zhbllokohet kur Donor te krijohet
User.hasOne(Donor, { 
    foreignKey: 'user_id', 
    as: 'donor',
    onDelete: 'SET NULL'
});
Donor.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
});

// User -> Volunteer (Nje user mund te jete nje vullnetar)
// Kjo pjese eshte OK sepse Volunteer ekziston, por referon User qe ekziston
User.hasOne(Volunteer, { 
    foreignKey: 'user_id', 
    as: 'volunteer',
    onDelete: 'SET NULL'
});
Volunteer.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
});

// MARREDHENIET PER EXPENSE (SHPENZIMET)
// Do te zhbllokohet kur Campaign te krijohet
Campaign.hasMany(Expense, { 
    foreignKey: 'campaign_id', 
    as: 'expenses',
    onDelete: 'CASCADE' 
});
Expense.belongsTo(Campaign, { 
    foreignKey: 'campaign_id', 
    as: 'campaign' 
});

// MARREDHENIET PER VOLUNTEER (VULLNETARET)
// Do te zhbllokohet kur Campaign dhe CampaignVolunteer te krijohen
Volunteer.hasMany(CampaignVolunteer, { 
    foreignKey: 'volunteer_id', 
    as: 'campaignAssignments',
    onDelete: 'CASCADE' 
});
CampaignVolunteer.belongsTo(Volunteer, { 
    foreignKey: 'volunteer_id', 
    as: 'volunteer' 
});
Campaign.hasMany(CampaignVolunteer, { 
    foreignKey: 'campaign_id', 
    as: 'volunteerAssignments',
    onDelete: 'CASCADE' 
});
CampaignVolunteer.belongsTo(Campaign, { 
    foreignKey: 'campaign_id', 
    as: 'campaign' 
});
*/

console.log('✅ Marredheniet e disponueshme u vendosen me sukses');
console.log('⚠️  Disa marredhenie jane komentuar derisa modelet perkatese te krijohen');