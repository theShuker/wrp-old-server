mp.events.add("playerQuit", (player) => {
    mp.events.call("playerQuitting", player);
    if (config.announcePlayerJoins) mp.players.broadcast(utils.chat(`Игрок ${player.getChatName()} покинул сервер`, `#888`))
    player.save(); //loading player data and showing player register/login screen
    LogDB.create({class: 'Connections', message: "Disconnected - " + player.name + " from " + player.ip})
});