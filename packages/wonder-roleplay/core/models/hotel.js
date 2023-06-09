const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const HotelModel = DB.define('hotels', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//main stuff
    owner: {type: Sequelize.STRING(64), defaultValue: 'none'},
    price: {type: Sequelize.INTEGER, defaultValue: 1500000},
    level: {type: Sequelize.INTEGER, defaultValue: 5},

//positioning
    x: {type: Sequelize.FLOAT, defaultValue: 0},
    y: {type: Sequelize.FLOAT, defaultValue: 0},
    z: {type: Sequelize.FLOAT, defaultValue: 0},
    h: {type: Sequelize.FLOAT, defaultValue: 0},

//type customs
    name: {type: Sequelize.STRING(64), defaultValue: 'none'},
    balance: {type: Sequelize.INTEGER, defaultValue: 0},
    dayPrice: {type: Sequelize.INTEGER, defaultValue: 100}
});

global.GasstationModel = GasstationModel