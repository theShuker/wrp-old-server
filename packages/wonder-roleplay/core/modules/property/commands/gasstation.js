addCommand({
    "newgas": (player, args) => {
        if(!player.isAdmin(10)) return false
        if(args.length != 3) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/newgas [level] [price]</b> - Создать АЗС на позиции`))
        if(!parseInt(args[0]) || !parseInt(args[1]) || !parseInt(args[2])) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>Неверные аргументы</b>`));;
        let pos = player.position
        let gs = GasstationModel.build({
            level: args[0],
            price: args[2],
            x: pos.x,
            y: pos.y,
            z: pos.z
        })
        try{
            let h = gm.property.Gasstation.new(house)
            h.save()
            player.outputChatBox(utils.chat(`{#0f0}АЗС создана!{~}`));
        }catch(e){
            player.outputChatBox(utils.chat(`{#f00}Ошибка создания АЗС!{~}`));
            player.outputChatBox(utils.chat(e));
            LogDB.create({class:'gscreation', message: e})
        }
    }
})