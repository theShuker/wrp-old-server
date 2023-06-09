mp.events.add({
    "authRegistered": (player) => {
        player.call("authSuccess", player)
        mp.events.call("authSuccess", player)
        player.outputChatBox(utils.chat(`[СЕРВЕР] Вы {#0f0}успешно{~} зарегистрировались, ${player.name}!`));

        mp.events.call("characterCreationStart", player) //starting player customization
    }
})
    