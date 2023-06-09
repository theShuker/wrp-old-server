addKeybind("e", player => {
    //this will be used to enter properties and show their sell menus
    if(player.vehicle) return
    //if player is in house already - let him out!
    if(player.currentlyIn){
        let house = player.currentlyIn
        if(house.isNearExit(player)){
            house.putPlayerOut(player)
            player.outputChatBox(utils.chat(`* Вы вышли на улицу`));
        }
        return true
    }

    //if hes outside lets search for house
    let target = gm.property.enterable.closestInRange(player.position, 1)
    if(!target) return

    //if found
    // 1. check if house is for sale
    if(target.owner == 'none'){
        player.call("createGui", JSON.stringify({
            type: 'houseForSale',
            price: target.data.price,
            level: target.data.level,
            houseid: target.data.dbID
        }))
        return true
    }

    // 2. if player is owner - let him in any way
    if(target.isOwner(player)) {
        target.putPlayerIn(player)
        player.outputChatBox(utils.chat(`* Вы вошли в ${target.translateType()}`));
        return true
    }

    // 3. if not owner, only let in if aint locked!
    if(target.locked){
        player.outputChatBox(utils.chat(`* Дверь {#f00}закрыта{~}.`));
        return true
    }else{
        target.putPlayerIn(player)
        player.outputChatBox(utils.chat(`* Вы вошли в ${target.translateType()}`));
        return true
    }
})

addGuiResponseHandler("houseForSale", (player, data) => {
    console.log(`houseForSale`);
    if(data.houseid){
        let house = gm.property.houses.findByDbId(data.houseid)
        if(house && house.isNear(player)){
            if(data.action == 'inspect'){
                house.putPlayerIn(player)
                player.outputChatBox(utils.chat(`* {#0f0}НЕДВИЖИМОСТЬ:{~} Вы начали осматривать дом...`))
                player.outputChatBox(utils.chat(`* {#ff0}НЕДВИЖИМОСТЬ:{~} Чтобы выйти, нажмите 'Е' возле двери `));
            }
            if(data.action == 'buy'){
                if(house.owner != 'none') return
                if(player.data.level < house.data.level) return player.outputChatBox(utils.chat(`{#f00}[НЕДВИЖИМОСТЬ]{~} Вашего уровня не достаточно для покупки дома {#ff0}${player.data.level}/${house.data.level}{~}`));
                if(player.data.money >= house.data.price){
                    console.log(`enough mone`);
                    if(player.data.houses == null){
                        console.log(`buing`);
                        player.giveMoney(-house.data.price)
                        house.setOwner(player)
                        player.data.houses = [house.data.dbID]
                        player.outputChatBox(utils.chat(`{#0f0}[НЕДВИЖИМОСТЬ]{~} Вы успешно {#0f0}купили{~} дом за {#ff0}${house.data.price}$!{~} Поздравляем!`));
                        player.data.save()
                    }else{
                        player.outputChatBox(utils.chat(`{#f00}[НЕДВИЖИМОСТЬ]{~} У вас уже есть дом!`));
                    }
                    //premium
                }else{
                    player.outputChatBox(utils.chat(`{#f00}[НЕДВИЖИМОСТЬ]{~} К сожалению, у вас не хватило денег...`));
                }
            }
        }else{
            player.outputChatBox(utils.chat(`{#f00}[ОШИБКА]{~} Возможно вы отошли от метки. Попробуйте еще раз.`));
        }
    }
})