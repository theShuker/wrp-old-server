mp.events.add({
    "authLoggedIn": (player) => {
        player.loggedIn = true

        mp.events.call("authSuccess", player)
        player.call("authSuccess", player)
        
        player.outputChatBox(utils.chat(`{#0f0}<b>[СЕРВЕР]</b>{~} Вы {#0f0}успешно{~} вошли в свой аккаунт, {#af0}${player.name}{~}!`));

        mp.events.call("authLoginFinished", player)
    }
})