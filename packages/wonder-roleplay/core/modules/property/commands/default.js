addCommand({
    "aenter": (player) => {
        if(!player.isAdmin(5)) return false
        let target = gm.property.enterable.closestInRange(player.position, 1)
        if(!target) return player.outputChatBox(utils.chat(`Не куда входить`));


        target.putPlayerIn(player)
        player.outputChatBox(utils.chat(`* Вы вошли в ${target.translateType()}`));
    },
    "aproperty": (player) => {
        if(!player.isAdmin(10)) return false
        player.outputChatBox(utils.chat(`{#ff0}[A:PROPERTY]{~} Информация о собственности на сервере`));
        player.outputChatBox(utils.chat(`{#ff0}[A:PROPERTY] Собственности всего:{~} ${gm.property.all.length}`));
        let info = []
        PropertyLoadList.forEach(function(model) {
            info.push(`${model} [${gm.property[model].length}]`)
        }, this);
        player.outputChatBox(utils.chat(`{#ff0}[A:PROPERTY] По классам:{~}<br>${info.join(', ')}`));
    }
})