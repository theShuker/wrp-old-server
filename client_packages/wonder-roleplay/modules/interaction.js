/*

mp.raycasting.types = { 
    map: 1, 
    vehicles: 2,
    player:  4,
    ped: 8,
    object: 16,
    unk1: 32,
    unk2: 64,
    unk3: 128,
    vegetation: 256,
    all: 7,   
}
*/

mp.events.add({
    "render": () => {
        chat(`${player.isOnFoot()}, ${player.isRagdoll()}, ${player.isBeingStunned(0)}`)
        if(!player.isOnFoot() || player.isRagdoll() || player.isBeingStunned(0)) return
        
        const DIST = 3
        let pos1 = player.position
        let pos2 = gm.cameras.playerCamera.getCoord()

        let camPlayerDist = Math.sqrt((pos1.x-pos2.x)*(pos1.x-pos2.x) + (pos1.y-pos2.y)*(pos1.y-pos2.y) + (pos1.z-pos2.z)*(pos1.z-pos2.z))

        let camRot = gm.cameras.playerCamera.getDirection()

        let startPos = {
            x: pos2.x + camRot.x * camPlayerDist,
            y: pos2.y + camRot.y * camPlayerDist,
            z: pos2.z + camRot.z * camPlayerDist,
        }
        
        let endPos = {
            x: startPos.x + camRot.x * DIST,
            y: startPos.y + camRot.y * DIST,
            z: startPos.z + camRot.z * DIST
        }

        let target = mp.raycasting.testPointToPoint(startPos, endPos, [2], player)
        raycastTargetHandler(target)

        let color = target ? [0,255,0,255] : [255,255,255,255]
        mp.game.graphics.drawText(`.`, 0, color, 0, 0.5, 1, 0.5, 0.475)

        if(gm.DEBUG) {
            mp.game.graphics.drawLine(startPos.x, startPos.y, startPos.z, endPos.x, endPos.y, endPos.z, color[0], color[1], color[2], 255)
            mp.game.graphics.drawText(`posFrom: x: ${startPos.x.toFixed(3)}, y: ${startPos.y.toFixed(3)}, z: ${startPos.z.toFixed(3)}, `, 0, [255,255,255,175], 0, 0.5, 1, 0.5, 0.75)
            mp.game.graphics.drawText(`posTo: x: ${endPos.x.toFixed(3)}, y: ${endPos.y.toFixed(3)}, z: ${endPos.z.toFixed(3)}, `, 0, [255,255,255,175], 0, 0.5, 1, 0.5, 0.65)
        }

        if(gm.INTERACTION_MENU_ACTIVE || gm.INTERACTION_MENU_CANT_BE_CALLED){
            mp.game.controls.disableControlAction(2, 14, true);
            mp.game.controls.disableControlAction(2, 15, true);
            mp.game.controls.disableControlAction(2, 16, true);
            mp.game.controls.disableControlAction(2, 17, true);
            mp.game.controls.disableControlAction(2, 24, true);	
            mp.game.controls.disableControlAction(2, 257, true);
        }
    }
})

function raycastTargetHandler(target){
    gm.RAYCASTED = target
    if(!gm.RAYCASTED) return

    /*let str = JSON.stringify(target, function(k,v){
        if(typeof v == 'number') return Number(v.toFixed(2))
        return v
    })
    str = str.replace(/"/g,``)
    chat(str)*/
}

mp.keys.bind(0x45, false, () => {
    if(!mp.keys._disabled && gm.RAYCASTED && !gm.INTERACTION_MENU_ACTIVE && !gm.INTERACTION_MENU_CANT_BE_CALLED){
	    gm.INTERACTION_MENU_ACTIVE = true
		mainUI.execute(`createInteractionMenu({
            target: 'name',
            elements: [
                ['Связать', 'tie'],
                ['Выписать штраф', 'ticket']
            ]
        })`)
	}
});

mp.events.add({
    "interactionMenuCommand": (data) => {
        if(data != false){
            mp.events.callRemote("interactionMenuCommand", data)
        }

        gm.INTERACTION_MENU_ACTIVE = false
        gm.INTERACTION_MENU_CANT_BE_CALLED = true
        setTimeout(()=>{
            gm.INTERACTION_MENU_CANT_BE_CALLED = false
        }, 500)
    }
})