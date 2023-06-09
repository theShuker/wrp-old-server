//admin commands
addCommand({
    "createproperty": (player, args) => {
        if(!player.isAdmin(10)) return false
        if(!args[0]) 

        switch(args[0]){
            case 'new':
                if(!args[1]){
                    player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/createproperty new [type]</b> - DESCR`));
                    player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} Доступные типы: ${PropertyLoadList.join(',')}`));
                    return
                }
                if(!PropertyLoadList.find(args[1])){
                    player.outputChatBox(utils.chat(`[РЕДАКТОР] Неизвестный тип собственности {#f00}${args[1]}{~}`));
                    return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} Доступные типы: ${PropertyLoadList.join(',')}`));
                }

                player.propertyEditor = {
                    model: args[1],
                    instance: global[args[1]+'Model'].build({
                        x: player.position.x,
                        y: player.position.y,
                        z: player.position.z,
                        h: player.heading || 0
                    }).then(() => {
                        player.outputChatBox(utils.chat(`[РЕДАКТОР] Instance создан`));
                        player.outputChatBox(utils.chat(`[РЕДАКТОР] Поля для редактирования: ${global[args[1]+'Model'].rawAttributes.join(',')}`));
                        player.outputChatBox(utils.chat(`[РЕДАКТОР] /createproperty edit [поле] [значение]`));
                    }),
                    fields: Object.keys(global[args[1]+'Model'].rawAttributes)
                }
                return
            
            case 'edit':
                if(!player.propertyEditor) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} Сначала создайте инстанцию: /createproperty new`))
                if(!args[1]) return player.outputChatBox(utils.chat(`[РЕДАКТОР] Поля для редактирования: ${global[args[1]+'Model'].rawAttributes.join(',')}`))
                if(!args[2]) return player.outputChatBox(utils.chat(`[РЕДАКТОР] Вы не указали значение`));
                if(player.propertyEditor.fields.find(args[1])){
                    player.propertyEditor.instance[args[1]] = args[2]
                }
                return
            
            case 'save':
                if(player.propertyEditor.model){
                    player.propertyEditor.instance.save().then((instance) => {
                        let property = gm.property[player.propertyEditor.model].new(instance)
                        player.propertyEditor.object = property
                        delete player.propertyEditor.instance
                    }).catch(e => {
                        LogDB.create({class: 'propertycreation', message: e})
                        player.outputChatBox(utils.chat(`[РЕДАКТОР] Ошибка при сохранении инстанции`));
                        player.outputChatBox(utils.chat(e));
                        console.error(e);
                    })
                    return
                }
                /*if(player.propertyEditor.object){

                    player.propertyEditor.object.save().then((instance) => {
                        let property = gm.property[player.propertyEditor.model].new(instance)
                        player.propertyEditor.object = property
                    })
                    return
                }
                return*/
            
            default:
                return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/createproperty [new, save]</b> - редактор собственности`))
        }
    },
    "newhouse": (player, args) => {
        if(!player.isAdmin(10)) return false
            console.log(`log`);
        if(args.length != 3) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/newhouse [level] [interior] [price]</b> - Создать дом на позиции`))
        if(!parseInt(args[0]) || !parseInt(args[1]) || !parseInt(args[2])) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>Неверные аргументы</b>`));;
        let pos = player.position
        let house = HouseModel.build({
            level: args[0],
            interior: args[1],
            price: args[2],
            x: pos.x,
            y: pos.y,
            z: pos.z
        })
        try{
            let h = gm.property.House.new(house)
            h.save()
            player.outputChatBox(utils.chat(`{#0f0}Дом создан!{~}`));
        }catch(e){
            player.outputChatBox(utils.chat(`{#f00}Ошибка создания дома!{~}`));
            player.outputChatBox(utils.chat(e));
            LogDB.create({class:'housecreation', message: e})
        }
    },
    "gotohouse": (player, args) => {
        if(!player.isAdmin(10)) return false
            console.log(`log`);
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/gotohouse [dbid]</b> - ТП к дому`))

        let target = gm.property.houses.findByDbId(parseInt(args[0]))
        if(!target) return player.outputChatBox(utils.chat(`{#f00}Дом с таким dbID не найден{~}`));

        player.position = target.position
        player.outputChatBox(utils.chat(`{#0f0}Вы телепортировались к дому #${args[0]}{~}`));
    } 
})