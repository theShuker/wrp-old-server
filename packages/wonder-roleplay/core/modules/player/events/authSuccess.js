mp.events.add({
    "authSuccess": (player) => {
        player.call('showMoney', true)
        player.call('updateMoney', player.data.money, true, true)
    }
})