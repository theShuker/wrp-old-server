gm.d3dtexts = []

global.add3dText = function(text, position, condition = false){
    let id = gm.d3dtexts.length
    gm.d3dtexts.push({
        id: id,
        text: text,
        position: position,
        condition: condition
    })
    return id
}
global.send3dTextsToPlayer = function(player){
    if(!gm.d3dtexts.length) return false
    gm.d3dtexts.forEach(function(inst) {
        if(inst.condition && !inst.condition(player)) return false

        let options = {
            text: inst.text,
            position: inst.position
        }
        
        player.call("draw3dText", JSON.stringify(options))
       // console.log(`sent d3d to player:`, options);
    }, this);
}

global.update3dText = function(id, text){
    if(gm.d3dtexts[id]){
        let inst = gm.d3dtexts[id]

        inst.text = text

        mp.players.forEach(player => {
            if(inst.condition && !inst.condition(player)) return false

            let options = {
                text: inst.text,
                position: inst.position
            }
            player.call("update3dText", JSON.stringify(options))
        })
    }
}

mp.events.add({
    "authSuccess": (player) => {
        send3dTextsToPlayer(player)
    }
})