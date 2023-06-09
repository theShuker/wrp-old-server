mp.events.add({
    "requestPlayerInventory": () => {
        mp.events.callRemote("requestPlayerInventory")
    },
    "recievePlayerInventory": (invObj) => {
        chat(invObj)
        mainUI.execute(`createInventoryWindow('${invObj}')`)
    },
    "performActionOnItem": (instructions) => {
        mp.events.callRemote("inventoryAction", instructions)
    },
    "tick": () => {
        
        gm.closestPlayers = []
        mainUI.execute(`window.ClosestPlayers = []`)
        let pos1 = player.position
        mp.players.forEach(function(target) {
            let pos2 = target.position
            let dist = Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y) + (pos1.z-pos2.z)*(pos1.z-pos2.z));
            if(dist < 10){
                gm.closestPlayers[gm.closestPlayers.length] = [target.id,target.name,dist]
                mainUI.execute(`window.ClosestPlayers[${gm.closestPlayers.length}] = [${target.id},'${target.name}',${dist}]`)
            }
        });
    }
})

gm.closestPlayers = []
gm.closestPlayersUpdate = setInterval(function(){
    gm.closestPlayers = []
    let pos1 = player.position
    mp.players.forEach(function(target) {
        let pos2 = target.position
        let dist = Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y) + (pos1.z-pos2.z)*(pos1.z-pos2.z));
        if(dist < 10){
            gm.closestPlayers.push([target.id, dist])
        }
    }, this);

    mainUI.execute(`closestPlayers = ${JSON.stringify(gm.closestPlayers)}`)
}, 250)