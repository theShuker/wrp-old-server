addCommand({
    //faction control
    "factioninvite": (player, args) => {
        if(!(player.faction && player.data.factionRank > 8)) return false
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/factioninvite [игрок]</b> - пригласить игрока в вашу фракцию`))

        let target = utils.getPlayer(args[0])
        if(target){
            player.faction.invitePlayer(target)
            player.outputChatBox(utils.chat(`[Фракция] Вы пригласили игрока ${target.getChatName()} в фракцию ${player.faction.fullName}`));
        }
    },
    "factionkick": (player, args) => {
        if(!(player.faction && player.data.factionRank > 8)) return false
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/factionkick [игрок]</b> - выгнать игрока из вашей фракции`))

        let target = utils.getPlayer(args[0])
        if(!target) return player.outputChatBox(utils.chat(`[Ошибка] Игрок '${args[0]}' не найден`))

        if(target.faction == player.faction){
            player.faction.kickPlayer(target)
            player.outputChatBox(utils.chat(`[Фракция] Вы выгнали игрока ${target.getChatName()} из фракции ${player.faction.fullName}`));
        }
    },
    "setrank": (player, args) => {
        if(!(player.faction && player.data.factionRank > 8)) return false
        if(args.length < 2) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/setrank [игрок] [ранг]</b> - установить игроку указанный ранг в фракции`))

        let target = utils.getPlayer(args[0])
        if(!target) return player.outputChatBox(utils.chat(`[Ошибка] Игрок '${args[0]}' не найден`))

        if(target.faction == player.faction){
            player.faction.kickPlayer(target)
            player.outputChatBox(utils.chat(`[Фракция] Вы выгнали игрока ${target.getChatName()} из фракции ${player.faction.fullName}`))
        }
    },
    "setrankname": (player, args) => {
        if(!(player.faction && player.data.factionRank > 8)) return false
        if(args.length < 2) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/setrankname [ранг 0-10] [название ранга]</b> - устанавливает расшифровки для ранга; например: 0 - новичок, 1 - сотрудник`))
    
        let rankid = args[0]
        args.splice(0,1)
        let name = args.join(' ')

        if(player.faction.setRankName(rankid, name)){
            player.outputChatBox(utils.chat(`[Фракция] Ранг ${rankid} теперь называется ${name}!`));
        }else{
            player.outputChatBox(utils.chat(`[Ошибка] Ошибка установки названия ранга`));
        }
    },


    //communication
    "f": (player, args) => {
        if(!player.faction) return false

        player.faction.broadcast(args.join(' '), player)
    }
})