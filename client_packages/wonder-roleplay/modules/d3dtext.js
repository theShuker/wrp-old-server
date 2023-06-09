var d3dtexts = []
const TEXT_SHOW_DIST = 10
mp.events.add({
    "draw3dText": options => {
        options = JSON.parse(options)
        d3dtexts.push(options)
    },
    "update3dText": options => {
        options = JSON.parse(options)
        d3dtexts.some(text => {
            if(text.position == options.position){
                text.text = options.text
                return true
            }
        })
    },
    "render": () => {
        //mp.game.graphics.drawText(`test`, 0, [255,0,0,175], 0, 0.5, 1, 0.5, 0.5)
        if(player && player.position){
            let pos1 = player.position
            d3dtexts.forEach(text => {
                let pos2 = text.position
                let dist = Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y) + (pos1.z-pos2.z)*(pos1.z-pos2.z))
                
                if(dist <= TEXT_SHOW_DIST){
                    //let scrpos = mp.game.graphics.world3dToScreen2d(pos2)
                    //if(!scrpos) return
                    mp.game.graphics.drawText(text.text, 0, [255,255,255,175], 0, (0.25 + 0.5 * ((TEXT_SHOW_DIST - dist)/TEXT_SHOW_DIST)), 1, pos2.x, pos2.y, pos2.z)
                }
            })
        }
    }
})