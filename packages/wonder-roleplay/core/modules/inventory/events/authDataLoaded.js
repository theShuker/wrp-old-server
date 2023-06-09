mp.events.add({
    "authDataLoaded": (player) => {
        player.inventory = new Inventory(player)
    }
})