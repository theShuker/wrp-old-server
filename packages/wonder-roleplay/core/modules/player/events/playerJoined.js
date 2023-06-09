/*

    here we are checking if player with this name already registered.
    if yes -> setting player.registered to true and waiting for request from clientside

    also calling @authDataLoaded to notify modules that player data is ready to be used

*/
mp.events.add({
    "playerJoined": (player) => {
        AccountModel.findOne({
            where: {
                name: player.name
            }
        }).then(instance => {
            if (instance) {
                player.data = instance
                if (instance.ban != 0) player.banned = true
                player.registered = true
                player.loginTries = config.loginTries || 3
                if(config.debug) console.log(`Player account is found for ${player.name} with dbID = ${instance.dbID}`);

                mp.events.call("authDataLoaded", player)
            }
            player.checkedForRegistration = true
        }).catch(e => { console.error(e) })
    }
})