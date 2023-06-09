const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const VehicleModel = DB.define('vehicles', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//main stuff
    model: Sequelize.STRING(64),
    owner: {type: Sequelize.STRING(64), defaultValue: 'none'},
    price: {type: Sequelize.INTEGER, defaultValue: 999666999},
    fuel: {type: Sequelize.INTEGER(3), defaultValue: 100},
    odometer: {type: Sequelize.FLOAT, defaultValue: 1000},

//positioning
    x: Sequelize.FLOAT,
    y: Sequelize.FLOAT,
    z: Sequelize.FLOAT,
    rx: Sequelize.FLOAT,
    ry: Sequelize.FLOAT,
    rz: Sequelize.FLOAT,

//visual appearance data
    plate: Sequelize.STRING(8),
    color: {
        type: Sequelize.STRING(128),
        defaultValue: '[255, 255, 255, 255, 255, 255]',
        get() {
            let data = this.getDataValue('color');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('color', data);
        }
    },
    mods: {
        type: Sequelize.STRING(256),
        defaultValue: '[]',
        get() {
            let data = this.getDataValue('mods');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('mods', data);
        }
    },

//inventory
    inventory: JsonField(DB, 'vehicles', 'inventory'),
    inventorySize: Sequelize.INTEGER(4)
});

global.VehicleModel = VehicleModel