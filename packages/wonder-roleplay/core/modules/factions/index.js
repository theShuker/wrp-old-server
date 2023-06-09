gm.factions = {}

fs.readdirSync(path.resolve(__dirname, './models/')).forEach(src => { require('./models/' + src) })
fs.readdirSync(path.resolve(__dirname, './classes/')).forEach(src => { require('./classes/' + src) })
fs.readdirSync(path.resolve(__dirname, './functions/')).forEach(src => { require('./functions/' + src) })
fs.readdirSync(path.resolve(__dirname, './commands/')).forEach(src => { require('./commands/' + src) })


global.getFactionByName = function(name){
    if(gm.factions[name]) return gm.factions[name]
    return false
}

global.loadFactions = function() {
    FactionModel.findAll().then(factions => {
        if(!factions.length) return console.log(`[FACTIONS] No factions to load.`)

        factions.forEach(faction => {
            new Faction(faction)
        })
    })
}

mp.events.add({
    "authDataLoaded": (player) => {
        if(player.data.faction != 'none') player.faction = getFactionByName(player.data.faction)
    },
    "authSuccess": (player) => {
        if(player.faction) player.faction.addToOnline(player)
    },
    "playerQuitting": (player) => {
        if(player.faction) player.faction.removeFromOnline(player)
    },
    "dbReady": () => {
        loadFactions()
    }
})

//loading commands etc...
