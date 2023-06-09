mp.events.add({
    "playerChat": (player, chat) => {
        if(!player.loggedIn)
            return player.outputChatBox(`{#f00}<b>[СЕРВЕР]{~} Для использования команд необходимо войти!</b>`)

        /*if(player.muted) return player.outputChatBox(utils.chat(`[СЕРВЕР] Вам отключили чат`, `#ffff00`))
        if(player.__chatTimeout && player.__chatLatestMsg == chat){
            clearTimeout(player.__chatTimer)
            player.__chatLatestMsg = chat
            player.__chatTimer = setTimeout(function(player){
                player.__chatTimeout = false
            }, 5000, player)
            return player.outputChatBox(utils.chat(`[СЕРВЕР] Не флуди.`, `#ffff00`))
        }*/
        
        chat.replace(/</g, '&lt')
        str = utils.chat(`${player.getChatName()}: ${chat}`)
        mp.players.broadcastInRange(player.position, config.ranges.defaultDist || 15, player.dimension || 0, str)

       /* player.__chatTimeout = true
        player.__chatLatestMsg = chat
        player.__chatTimer = setTimeout(function(player){
            player.__chatTimeout = false
        }, 5000, player)*/
    }
})