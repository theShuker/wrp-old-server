gm.LSPD = {
    lockerMarker: mp.markers.new(0, {x: 449.821, y: -991.984, z: 30.690}, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 0.5, 0, 0, 255, 175, false, 0),
    armoryMarker: mp.markers.new(0, {x: 452.058, y: -980.181, z: 30.690}, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 0.5, 0, 0, 255, 175, false, 0),
    LSPDblip: mp.blips.new(60, {x: 440.895, y: -978.052, z: 30.690})
}

gm.LSPD.LSPDblip.colour = 38
gm.LSPD.LSPDblip.name = "Отдел полиции Los Santos'a"

mp.events.add({
    "factionPlayerOnline": (player, faction) => {
        if(faction == 'lspd'){
            gm.LSPD.lockerMarker.showFor(player)
            gm.LSPD.armoryMarker.showFor(player)
        }
    },
    "factionPlayerOffline": (player, faction) => {
        if(faction == 'lspd'){
            gm.LSPD.lockerMarker.hideFor(player)
            gm.LSPD.armoryMarker.hideFor(player)
        }
    }
})

addKeybind("e", function(player){
    if(player.vehicle) return
    if(player.faction && player.faction.name == 'lspd'){
        //armory activation
        if(utils.getDistanceBetweenV3(player.position, {x: 452.058, y: -980.181, z: 30.690}) <= 1.5){
            if(player.faction.isOnDuty(player)){
                player.outputChatBox(utils.chat(`Вы взяли табельное оружие и шокер`))
                player.giveWeapon(mp.joaat("WEAPON_STUNGUN"), 1)
                player.giveWeapon(mp.joaat("WEAPON_PISTOL"), 250)
            }else{
                player.outputChatBox(utils.chat(`{${player.faction.chatColor}}[${player.faction.abbreviation}]{~} Нельзя взять что-либо из оружейной, когда {#f00}вы не на службе!{~}`));
            }
        }

        //locker action
        if(utils.getDistanceBetweenV3(player.position, {x: 449.821, y: -991.984, z: 30.690}) <= 1.5){
            if(!player.faction.isOnDuty(player)){
                player.outputChatBox(utils.chat(`{${player.faction.chatColor}}[${player.faction.abbreviation}]{~} Вы переоделись и взяли свой жетон. Ваше звание - ${player.faction.getRank(player)}`));
                player.faction.setOnDuty(player, true)
            }else{
                player.outputChatBox(utils.chat(`{${player.faction.chatColor}}[${player.faction.abbreviation}]{~} Вы сдали жетон и переоделись в гражданскую одежду.`));
                player.faction.setOnDuty(player, false)
            }
        }
    }
})