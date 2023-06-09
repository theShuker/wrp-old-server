const Sequelize = require('sequelize');

//model used for logging stuff
const LogDB = DB.define('log', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    class: {type: Sequelize.STRING(128), defaultValue: 'default'},
    message: Sequelize.TEXT
});

process.on('uncaughtException', function(err){
    LogDB.create({class: 'uncaughtException', message: err})
})

global.LogDB = LogDB