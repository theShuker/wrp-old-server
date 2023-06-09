const Sequelize = require('sequelize');

global.DB = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: 'mysql',
    logging: false, //(config.debug ? console.log : false),
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    }
});

console.log(`[SEQUELIZE] Loading data models`);
fs.readdirSync(path.resolve(__dirname, './models/')).forEach(src =>
{
    require('./models/' + src);
})


console.log(`[SEQUELIZE] Syncing models...`);
gm.modelsSynced = false


gm.__tookTimeToSyncModels = Date.now()
DB.sync({alter: (config.alterTables ? config.alterTables : false)}).then(() => {
    console.log(`[SEQUELIZE] Models synced succesfully! Time taken: ${Date.now() - gm.__tookTimeToSyncModels}ms`);
    //emit dbready event
    mp.events.call('dbReady')
})
mp.events.add({
    "dbReady": () => {
        gm.modelsSynced = true
    }
})




