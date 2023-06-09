const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const HouseModel = DB.define('houses', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//main stuff
    owner: {type: Sequelize.STRING(64), defaultValue: 'none'},
    price: {type: Sequelize.INTEGER, defaultValue: 999999999},
    level: {type: Sequelize.INTEGER, defaultValue: 3},

//positioning
    x: {type: Sequelize.FLOAT, defaultValue: 0},
    y: {type: Sequelize.FLOAT, defaultValue: 0},
    z: {type: Sequelize.FLOAT, defaultValue: 0},
    h: {type: Sequelize.FLOAT, defaultValue: 0},

//type customs
    interior: {type: Sequelize.INTEGER, defaultValue: 0},
    name: {type: Sequelize.STRING(128), defaultValue: 'Дом'},
    inventory: JsonField(DB, 'houses', 'inventory'),
    inventorySize: Sequelize.INTEGER(4),
    renters: JsonField(DB, 'houses', 'renters')
});

global.HouseModel = HouseModel