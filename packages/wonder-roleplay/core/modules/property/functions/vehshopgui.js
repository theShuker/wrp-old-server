addKeybind("e", player => {
    if(player.vehicle) return
    //search for vshop
    let target = gm.property.vehicleshops.closestInRange(player.position, 1)
    if(!target) return

    if(target.data.vehiclesStock > 0){
        target.enterVehicleShop(player)
        return true
    }else{
        player.outputChatBox(utils.chat(`[${target.classDescribe}] В салоне не осталось транспортных средств, нужно чтобы кто-то привез их`));
        return true
    }
})

addGuiResponseHandler("vehicleShop", (player, data) => {
    console.log(`vehicleShop responce recieved`);
    if(data.model){
        let shop = gm.property.vehicleshops.findByDbId(data.shopid)
        if(shop && shop.isNear(player)){
            if(data.action == 'testdrive'){
                shop.startTestDrive(data.model, player)
                player.outputChatBox(utils.chat(`{#0f0}[${this.classDescribe}]{~} Вы начали тест-драйв '${data.model}'...`))
                player.outputChatBox(utils.chat(`{#0f0}[${this.classDescribe}]{~} Тест-драйв закончится через {#ff0}45 секунд{~}!`));
            }
            if(data.action == 'buy'){
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