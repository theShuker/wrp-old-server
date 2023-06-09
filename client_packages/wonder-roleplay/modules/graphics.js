mp.events.add({
    "playScreenEffect": (name, duration, looped) => {
        mp.game.graphics.startScreenEffect(name, duration, looped);
    }
})