const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const AccountModel = DB.define('accounts', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//main
    name: Sequelize.STRING(64),
    password: Sequelize.STRING(64),
    email: Sequelize.STRING,
    invite: { type: Sequelize.STRING(64), defaultValue: 'none' },
    admin: { type: Sequelize.INTEGER, defaultValue: 0 },
    ban: { type: Sequelize.INTEGER, defaultValue: 0 },
    regIp: { type: Sequelize.STRING(15), defaultValue: '0.0.0.0' },
    regDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    

//donate things
    premium: { type: Sequelize.INTEGER, defaultValue: 0 },
    premiumExpire: { type: Sequelize.INTEGER, defaultValue: 0 },
    donate: { type: Sequelize.INTEGER, defaultValue: 0 },
    donated: { type: Sequelize.INTEGER, defaultValue: 0 },

//game data
    skin: { type: Sequelize.STRING(32), defaultValue: 'mp_m_freemode_01' },
    level: { type: Sequelize.INTEGER, defaultValue: 1 },
    xp: { type: Sequelize.INTEGER, defaultValue: 0 },
    kills: { type: Sequelize.INTEGER, defaultValue: 0 },
    deaths: { type: Sequelize.INTEGER, defaultValue: 0 },
    money: { type: Sequelize.INTEGER, defaultValue: 500 },
    bank: { type: Sequelize.INTEGER, defaultValue: 0 },
    passport: { type: Sequelize.INTEGER, defaultValue: 0 },
    spawn: { type: Sequelize.INTEGER, defaultValue: 0 },

//faction
    faction: { type: Sequelize.STRING(32), defaultValue: 'none'},
    factionRank: { type: Sequelize.INTEGER(2), defaultValue: 0 },

//hotel
    hotel: { type: Sequelize.INTEGER, defaultValue: 0 },
    hotelKickDate: { type: Sequelize.INTEGER, defaultValue: 0 },

//property
    vehicles: JsonField(DB, 'accounts', 'vehicles'),
    houses: JsonField(DB, 'accounts', 'houses'),

//customizaation of character
    headBlend:{
        type: Sequelize.STRING(512),
        defaultValue: '[]',
        get() {
            let data = this.getDataValue('headBlend');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('headBlend', data);
        }
    },
    faceFeatures: {
        type: Sequelize.STRING(512),
        defaultValue: '[]',
        get() {
            let data = this.getDataValue('faceFeatures');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('faceFeatures', data);
        }
    },
    components: {
        type: Sequelize.STRING(1024),
        defaultValue: '[]',
        get() {
            let data = this.getDataValue('components');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('components', data);
        }
    },
    eyeColor: {
        type: Sequelize.STRING(16),
        defaultValue: '[0,0]',
        get() {
            let data = this.getDataValue('eyeColor');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('eyeColor', data);
        }
    },
    hairColor: {type: Sequelize.INTEGER(2), defaultValue: 0},
    
    props: JsonField(DB, 'accounts', 'props'),   

//inventory
    inventory: JsonField(DB, 'accounts', 'inventory'),
    inventorySize: Sequelize.INTEGER(4)
});

global.AccountModel = AccountModel