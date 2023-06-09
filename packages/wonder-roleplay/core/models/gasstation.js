const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const GasstationModel = DB.define('gasstations', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//main stuff
    owner: {type: Sequelize.STRING(64), defaultValue: 'none'},
    price: {type: Sequelize.INTEGER, defaultValue: 5000000},
    level: {type: Sequelize.INTEGER, defaultValue: 5},

//positioning
    x: {type: Sequelize.FLOAT, defaultValue: 0},
    y: {type: Sequelize.FLOAT, defaultValue: 0},
    z: {type: Sequelize.FLOAT, defaultValue: 0},
    h: {type: Sequelize.FLOAT, defaultValue: 0},

//type customs
    balance: {type: Sequelize.INTEGER, defaultValue: 0},
    fuelPrice: {type: Sequelize.INTEGER(3), defaultValue: 5},
    fuelRemaining: {type: Sequelize.INTEGER, defaultValue: 20000},
    fuelCapacity: {type: Sequelize.INTEGER, defaultValue: 20000},
});

global.GasstationModel = GasstationModel