addKeybind('n', (player) => {
    if(player.__switchingEngine) return
    if(player.vehicle){
        if(player.seat == 0){
            if(!player.vehicle.wrapper.engine){
                player.__switchingEngine = true
                player.outputChatBox(utils.chat(`Вы вставили ключ и повернули его`));
                setTimeout(function(player){
                    player.vehicle.wrapper.engine = true
                    player.outputChatBox(utils.chat(`{#0f0}[ТС]{~} Двигатель завелся`));
                    delete player.__switchingEngine
                }, Math.floor(1000 + Math.random() * 2000), player)
            }else{
                player.vehicle.wrapper.engine = false
                player.sayInRange(config.ranges.action, utils.chat(`* ${player.getChatName()} заглушил(а) двигатель ${player.vehicle.wrapper.model.charAt(0).toUpperCase() + player.vehicle.wrapper.model.slice(1)}`, colors.me));
            }
        }
    }
})