fs.readdirSync(path.resolve(__dirname, './events/')).forEach(src => { require('./events/' + src) })
fs.readdirSync(path.resolve(__dirname, './commands/')).forEach(src => { require('./commands/' + src) })
fs.readdirSync(path.resolve(__dirname, './functions/')).forEach(src => { require('./functions/' + src) })


global.PlayerInit = (player) => {
    player.banned = false
    player.checkedForRegistration = false
    player.registered = false
    player.loggedIn = false


    player.isAdmin = (level = 1) => {
        return player.data.admin >= level ? true : false;
    }

    player.getChatName = (noid) => {
        if(player.faction){
            let color = player.faction.chatColor
            return `{${color}}${player.name} [${player.id}]{~}`
        }
        return `${player.name} [${player.id}]`
    }

    player.giveMoney = (money) => {
        if (isNaN(money)) return false;
        player.data.money += money;
        player.call('updateMoney', player.data.money);
        return player.data.money;
    }

    player.setMoney = (money) => {
        if (isNaN(money)) return false;
        player.data.money = money;
        player.call('updateMoney', player.data.money);
        return player.data.money;
    }

    Object.defineProperty(player, 'money', {
        get: function() { return this.data.money },
        set: function(v) { 
            this.data.money = v
            this.call('updateMoney', this.data.money);
        },
        enumerable: true,
        configurable: true
    });

    player.freeze = (state) => {
        player.call(`freezePlayer`, state);
    }

    player.disableControls = (state) => {
        player.call(`disableControls`, state);
    }

    player.save = () => {
        if(!player.isLoggedIn) return
        mp.events.call("playerBeforeSave", player)
        player.data.save().then(() => {
            if (config.debug) console.log(`[PLAYER SAVE] Data saved for ${player.data.name}!`);
        }).catch(e => {
            throw e
            LogDB.create({class: 'playersave', message: e})
        })
    }

    player.sayInRange = (range, text) => {
        mp.players.broadcastInRange(player.position, range, player.dimension, utils.chat(text));
    }
}

global.saveData = () => { //change to mp.players.save()
    mp.players.forEach(player => {
        if (player.loggedIn) {
            player.save()
        }
    })
}