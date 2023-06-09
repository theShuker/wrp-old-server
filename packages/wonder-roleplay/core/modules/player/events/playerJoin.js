mp.events.add({
    "playerJoin": (player) => {
        player.dimension = 1

        if(gm.MODULES_TO_INIT > 0){
            player.outputChatBox(utils.chat(`Сервер загружается, пожалуйста подождите...`));
            setTimeout((player) => {
                mp.events.call("playerJoin", player)
            }, 1000, player)
            return
        }
        //setTimeout((player) => {
            
            //EXTENDING PLAYER OBJECT
            PlayerInit(player)

            //ANNOUNCING THE JOIN
            if (config.announcePlayerJoins) mp.players.broadcast(utils.chat(`Игрок ${player.getChatName()} зашел на сервер`, `#888`))
            player.outputChatBox(utils.chat(`<h3>Добро пожаловать на Wonder RolePlay, ${player.name}!</h3>`, colors.wrp));

            //RP NAME CHECK
            if(!player.name.match(/([A-Z][a-z]+)_([A-Z][a-z]+)/)){
                player.outputChatBox(utils.chat(`[СЕРВЕР] Ваш ник не соответствует RP формату, пожалуйста смените ник.`, `#f00`));
                player.outputChatBox(utils.chat(`[СЕРВЕР] Пример правильного ника: Ivan_Ivanov`, `#ffff00`));
                player.outputChatBox(utils.chat(`[СЕРВЕР] Первая буква имени и фамилии - заглавная, остальные - строчные. `, `#ffff00`));
                player.outputChatBox(utils.chat(`[СЕРВЕР] Разрешенные символы [A-z,_] `, `#ffff00`));
                player.kick('Non-rp nickname');
                return
            }

            //PROCEEDING TO CHECK IF REGISTERED OR NOT
            mp.events.call("playerJoined", player)
        //}, 500, player)
    }
})