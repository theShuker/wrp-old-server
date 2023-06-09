addCommand({
    "afinvite": (player, args) => {
        if(!player.isAdmin(5)) return false
        if(args.length < 2) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/afactioninvite [player] [factionname]</b> - инвайт в фракцию`))
        let target = utils.getPlayer(args[0])
        let faction = getFactionByName(args[1])
        if(!target || !faction) return player.outputChatBox(utils.chat(`{#f00}[Ошибка]{~} Данный игрок (или фракция) не найден`));
        if(target.faction) return player.outputChatBox(utils.chat(`{#f00}[Ошибка]{~} Данный игрок уже состоит в фракции "${target.faction.name}"`));
        faction.invitePlayer(target)
        player.outputChatBox(utils.chat(`[afaction] Вы пригласили игрока ${target.getChatName()} в фракцию ${args[1]}`));
    },
    "afkick": (player, args) => {
        if(!player.isAdmin(5)) return false
        if(args.length < 1) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/afactionkick [player]</b> - кик с фракции`))

        let target = utils.getPlayer(args[0])
        if(!target) return player.outputChatBox(utils.chat(`{#f00}[Ошибка]{~} Данный игрок не найден`));

        if(target.faction){
            target.faction.kickPlayer(target)
            player.outputChatBox(utils.chat(`[afaction] Вы выгнали игрока ${target.getChatName()} из фракции ${args[1]}`));
        }else{
            player.outputChatBox(utils.chat(`[afaction] Игрок и так не состоит ни в какой фракции`));
        }
        
    },
    "asetleader": (player, args) => {
        if(!player.isAdmin(5)) return false
        if(args.length < 2) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/asetleader [player]</b> - сделать лидером фракции`))

        let target = utils.getPlayer(args[0])
        if(!target) return player.outputChatBox(utils.chat(`{#f00}[Ошибка]{~} Данный игрок не найден`));

        if(target.faction){
            target.data.factionRank = 10
            player.outputChatBox(utils.chat(`[ADMIN] Вы дали игроку ${target.getChatName()} максимальный ранг в фракции ${target.faction.abbreviation}!`));
            target.outputChatBox(utils.chat(`[ADMIN] Вас сделали лидером фракции ${target.faction.abbreviation}! (10й ранг)`));
        }else{
            player.outputChatBox(utils.chat(`[afaction] Игрок не состоит ни в какой фракции. Сначала пусть войдет в фракцию!`));
        }
    }
})