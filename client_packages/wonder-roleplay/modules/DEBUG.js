gm.DEBUG = true


mp.events.add({
    "render": () => {
        let pos = player.position
        let rot = player.getRotation(0)
        if(gm.DEBUG && pos){
            //let crot = gm.cameras.playerCamera.getRot(2);
            //let cpos = gm.cameras.playerCamera.getCoord();
            //if(cpos)mp.game.graphics.drawText(`campos - rx: ${cpos.x.toFixed(3)}, ry: ${cpos.y.toFixed(3)}, rz: ${cpos.z.toFixed(3)}, `, 0, [255,255,255,175], 0, 0.5, 1, 0.5, 0.7)
            //if(crot)mp.game.graphics.drawText(`camrot - rx: ${crot.x.toFixed(3)}, ry: ${crot.y.toFixed(3)}, rz: ${crot.z.toFixed(3)}, `, 0, [255,255,255,175], 0, 0.5, 1, 0.5, 0.75)
            mp.game.graphics.drawText(`x: ${pos.x.toFixed(3)}; y: ${pos.y.toFixed(3)}; z: ${pos.z.toFixed(3)};\nrx: ${rot.x.toFixed(3)}; ry: ${rot.y.toFixed(3)}; rz: ${rot.z.toFixed(3)};`, 0, [255,255,255,175], 0, 0.5, 1, 0.5, 0.8)
        }
        
    }
})

addCommand({
    "showDebug": () => {
        gm.DEBUG = !gm.DEBUG
    }
})