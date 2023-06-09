mp.events.add({
    "playerDeath": (player, reason, killer) => {
        player.outputChatBox(utils.chat(`{#f00}Вы серьезно пострадали!{~}`))
        player.outputChatBox(utils.chat(`{#ff0}Вы можете дождаться медиков, или появиться в больнице через 2 минуты...{~}`))
    }
})