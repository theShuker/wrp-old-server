const Sequelize = require('sequelize');
let JsonField = require('sequelize-json') //pass DB, accounts, fieldName

const FactionModel = DB.define('factions', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//faction stuff
    name: {type: Sequelize.STRING(64), unique: true},
    fullName: Sequelize.STRING(64),
    abbreviation: Sequelize.STRING(64),
    chatColor: Sequelize.STRING(8),

    isCriminal: Sequelize.BOOLEAN,
    isShiftable: Sequelize.BOOLEAN,
    hasCommonFund: Sequelize.BOOLEAN,
    needsRadioToCommunicate:  Sequelize.BOOLEAN, //if true - communicate only when has radio item, otherwise phone is enough

    ranks: {
        type: Sequelize.STRING(512),
        get() {
            let data = this.getDataValue('ranks');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('ranks', data);
        }
    },
    members: {
        type: Sequelize.TEXT,
        get() { 
            let data = this.getDataValue('members');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('members', data);
        }
    },
    data: {
        type: Sequelize.TEXT,
        get() {
            let data = this.getDataValue('data');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('data', data);
        }
    },
    
//spawn
    x: Sequelize.FLOAT,
    y: Sequelize.FLOAT,
    z: Sequelize.FLOAT,
    h: Sequelize.FLOAT
});

/*FactionModel.create({
    name: 'lspd',
    fullName: 'Los Santos Police Department',
    isCriminal: false,
    isShiftable: true,
    hasCommonFund: false,
    x: 456.693,
    y: -990.996,
    z: 30.690,
    h: 87.702
})*/

global.FactionModel = FactionModel