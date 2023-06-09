addCommand({
    "createvshop": (player, args) => {
        if(!player.isAdmin(10)) return false
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/createvshop [(n)ew, (e)dit, (v)ehs, (c)ancel, (s)ave] [new: car, motorcycle, bicycle, plane, helicopter, boat]</b> - создание магазина авто`));;
        
        let action = args[0]
        args.splice(0,1)

        switch(action){
            case 'n':
            case 'new':
                if(!args[0]) return player.outputChatBox(utils.chat(`Не указан класс магазина`))
                let pos = player.position
                player.vshopcreator = {
                    vehiclesClass: args[0],
                    instance: VehicleshopModel.build({
                        vehiclesClass: args[0],
                        x: pos.x,
                        y: pos.y,
                        z: pos.z,
                        h: player.heading
                    })
                }
                return player.outputChatBox(utils.chat(`[Редактор] Данные: ${player.vshopcreator.instance.toString()}`));
            break
            
            case 'e':
            case 'edit':
                if(!player.vshopcreator) return player.outputChatBox(utils.chat(`Сначала создайте редактор через параметр new`));
                if(args.length != 2) return player.outputChatBox(utils.chat(`Не указан изменяемый параметр или значение. Доступные: ${Object.keys(VehicleshopModel.rawAttributes)}`))
                let param = args[0]
                args.splice(0,1)

                if(!VehicleshopModel.rawAttributes.indexOf(args[0])) return player.outputChatBox(utils.chat(`Нет такого параметра, доступные: ${Object.keys(VehicleshopModel.rawAttributes)}`));
                
                player.vshopcreator.instance[args[0]] = args[1]
                return player.outputChatBox(utils.chat(`[Редактор] ${args[0]} -> ${args[1]}`));
            break

            case 'v':
            case 'vehs':
                if(!player.vshopcreator) return player.outputChatBox(utils.chat(`Сначала создайте редактор через параметр new`));


            break
            
            case 's':
            case 'save':
                if(!player.vshopcreator) return player.outputChatBox(utils.chat(`Сначала создайте редактор через параметр new`));
                if(args[0] != 'yes') return player.outputChatBox(utils.chat(`/createvshop (s)ave yes - подтвердите сохранение; ${player.vshopcreator.instance.toString()}`));

                let vs = gm.property.vehicleshops.new(player.vshopcreator.instance)
                vs.data.save().then((instance)=>{
                    player.outputChatBox(utils.chat(`[Редактор] Шоп создан, dbID: ${instance.dbID}`));
                    player.outputChatBox(utils.chat(`[Редактор] Добавьте список машин с помошью /editvshop ${instance.dbID}`));
                }).catch(e => {
                    player.outputChatBox(utils.chat(`[Редактор] Ошибка создания: ${e}`));
                    LogDB({class: 'vshopcreate', message: e})
                })
            break
            
            case 'c':
            case 'cancel':
                delete player.vshopcreator
                return player.outputChatBox(utils.chat(`Редактор завершен`));
            break
        }
    },
    "editvshop": (player, args) => {
        if(!player.isAdmin(10)) return false
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/editvshop [ID, (s)ave, (c)ancel]`));
        
        let action = args[0]
        args.splice(0,1)

        switch(action){
            case 'e':
            case 'edit':
                if(!player.vshopeditor) return player.outputChatBox(utils.chat(`[Редакто] Сначала выберите шоп по dbID`));
                if(args[0] === undefined) return player.outputChatBox(utils.chat(`[Редактор] Доступные действия: (a)dd(v)eh`));
                let param = args[0]
                args.splice(0,1)

                switch(param){
                    case 'av':
                    case 'addveh':
                        //category, model, price, level, ispremium, remaining
                        if(args.length < 4) return player.outputChatBox(utils.chat(`[Редактор] Нужные параметры: category, model, price, level, ispremium, remaining`));
                        let obj = {
                            category: args[0],
                            model: args[1],
                            price: args[2],
                            level: args[3],
                            isPremium: args[4] || false,
                            remaining: args[5] || false
                        }
                        player.vshopeditor.addVehicle(obj)
                        return player.outputChatBox(utils.chat(`[Редактор] Добавлено ТС: ${obj.toString()}`));
                    break

                    case 'rv':
                    case 'remveh':
                        //category, model, price, level, ispremium, remaining
                        if(args.length < 1) return player.outputChatBox(utils.chat(`[Редактор] Нужные параметры: model`));
                        player.vshopeditor.removeVehicle(args[0])
                        return player.outputChatBox(utils.chat(`[Редактор] Удалено ТС: ${args[0]}`));
                    break
                }
            break

            case 's':
            case 'save':
                if(!player.vshopeditor) return player.outputChatBox(utils.chat(`Сначала создайте редактор через параметр new`));
                player.vshopeditor.data.save().then(()=>{
                    player.outputChatBox(utils.chat(`[Редактор] Сохранено`));
                })
            break
            
            case 'c':
            case 'cancel':
                delete player.vshopcreator
                return player.outputChatBox(utils.chat(`Редактор завершен`));
            break

            default:
                let found = gm.property.vehicleshops.findByDbId(action)
                if(found){
                    player.vshopeditor = found
                    return player.outputChatBox(utils.chat(`[Редактор] Шоп ${action} перемещен в редактор`));
                }
                return player.outputChatBox(utils.chat(`[Редактор] Шоп ${action} не найден`));
            break
        }
    },
    "listvshops": (player) => {
        if(!player.isAdmin(10)) return false
        let string = ``
        gm.property.vehicleshops.pool.forEach((shop, i) => {
            string += `{#f00}[${i}]{~} -> {#ff0}dbID:{~} ${shop.data.dbID}; {#ff0}class:{~} ${shop.data.vehiclesClass} {#ff0}x:{~} ${shop.data.x.toFixed(2)}; {#ff0}y:{~} ${shop.data.y.toFixed(2)}; {#ff0}z:{~} ${shop.data.z.toFixed(2)}; <br>`
        })
        player.outputChatBox(utils.chat(`[VSHOPS] Список vehicleshops`));
        player.outputChatBox(utils.chat(string));
    }
})