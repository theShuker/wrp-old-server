mp.events.add({
    "authLoginFinished": (player) => {
        
        player.spawn([0,0,72])

        player.call("authFinish")
    }
})