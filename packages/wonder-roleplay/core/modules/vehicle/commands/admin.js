addCommand({
    "aveh": (player, args) => {
        if(!player.isAdmin(10)) return false
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/aveh [color, mod, model, fix]</b> - установить параметры на текущее ТС`))

        let action = args[0]
        args.splice(0,1)

        switch(action){
            case 'color':
                if(args.length == 2 || args.length == 3 || args.length == 6){
                    player.vehicle.wrapper.color = args
                    return player.outputChatBox(utils.chat(`[AVEH] Цвет авто изменен на ${args.toString()}`));
                }
            break

            case 'mod':
                console.log(args);
                if(args.length == 2){
                    player.vehicle.wrapper.setMod(parseInt(args[0]), parseInt(args[1]))
                    return player.outputChatBox(utils.chat(`[AVEH] Мод в слоте ${args[0]} установлен в значение ${args[1]}`));
                }
            break

            case 'model':
                if(args.length == 1){
                    player.vehicle.wrapper.model = mp.joaat(args[0])
                    return player.outputChatBox(utils.chat(`[AVEH] Модель заменена на ${args[0]}`));
                }
            break

            case 'fix':
                player.vehicle.repair()
                return player.outputChatBox(utils.chat(`[AVEH] Vehicle fixed`));
            break

            default:
                return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/aveh [color, mod, model, fix]</b> - установить параметры на текущее ТС`))
        }
    }
})