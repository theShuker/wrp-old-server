const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const VehicleshopModel = DB.define('vehicleshops', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//main stuff
    owner: {type: Sequelize.STRING(64), defaultValue: 'none'},
    price: {type: Sequelize.INTEGER, defaultValue: 10000000},
    level: {type: Sequelize.INTEGER, defaultValue: 5},
    name: {type: Sequelize.STRING(64), defaultValue: 'Авто-Салон'},

//positioning
    x: {type: Sequelize.FLOAT, defaultValue: 0},
    y: {type: Sequelize.FLOAT, defaultValue: 0},
    z: {type: Sequelize.FLOAT, defaultValue: 0},
    h: {type: Sequelize.FLOAT, defaultValue: 0},

//type customs
    balance: {type: Sequelize.INTEGER, defaultValue: 0},
    vehiclesClass: {type: Sequelize.STRING(16), defaultValue: 'car'},
    vehiclesStock: {type: Sequelize.INTEGER, defaultValue: 100}, //type: car, motorcycle, bicycle, helicopter, plane
    vehicles: JsonField(DB, 'vehicleshops', 'vehicles')
});

global.VehicleshopModel = VehicleshopModel