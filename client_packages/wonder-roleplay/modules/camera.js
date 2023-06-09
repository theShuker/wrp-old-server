//CAMERAS
gm.cameras.playerCamera = mp.cameras.new("gameplay");

gm.cameras.loginCam = mp.cameras.new('default', new mp.Vector3(1532.0, -525.0, 162.0), new mp.Vector3(-10.0, -10.0, 90.0), 90.0);

//SHOP CAMERAS
gm.cameras.carShop = mp.cameras.new('default', {x: -39.346, y: -1099.057, z: 27.109}, {x: -7.591, y: 0.000, z: 37.491}, 90.0);
gm.cameras.motorcycleShop = mp.cameras.new('default', {x: -39.346, y: -1099.057, z: 27.109}, {x: -7.591, y: 0.000, z: 37.491}, 90.0);
gm.cameras.bicycleShop = mp.cameras.new('default', {x: -1102.959, y: -1697.830, z: 5.016}, {x: -14.687, y: 0.054, z: 135.462}, 90.0);
gm.cameras.planeShop = mp.cameras.new('default', {x: 1705.510, y: 3227.319, z: 48.924}, {x: -14.686, y: 0.000, z: -51.704}, 90.0);
gm.cameras.boatShop = mp.cameras.new('default', {x: -836.130, y: -1432.159, z: 8.324}, {x: -18.528, y: 0.000, z: -167.988}, 90.0);
gm.cameras.helicopterShop = mp.cameras.new('default', {x: -836.130, y: -1432.159, z: 8.324}, {x: -18.360, y: 0.000, z: 177.899}, 90.0);
gm.cameras.customizerFace = mp.cameras.new('default', {x: 403.25, y: -997.25, z: -98.355}, {x: 0.0, y: 0.0, z: 20}, 35); 
gm.cameras.customizerFull = mp.cameras.new('default', {x: 403.25, y: -998, z: -98.6}, {x: 0.0, y: 0.0, z: 0}, 70);
gm.cameras.customizerClothes = mp.cameras.new('default', {x: 403.25, y: -998, z: -99.25}, {x: 0.0, y: 0.0, z: 0}, 70);




function resetCameraToPlayer(){
    setCamerasInactive()
    gm.cameras.playerCamera.setActive(true)
    mp.game.cam.renderScriptCams(false, false, 0, false, false)
}

function setCamerasInactive() {
    Object.keys(gm.cameras).forEach(function(camera){
        gm.cameras[camera].setActive(false)
    })
}

function switchToCamera(camera, interp = 0){
    setCamerasInactive()
    camera.setActive(true)
    if(interp){
        mp.game.cam.renderScriptCams(true, true, interp, false, false)
    }else{
        mp.game.cam.renderScriptCams(true, false, 0, false, false)
    }
}

addCommand({
    switchcam: function(args){
        chat(args.toString())
        if(gm.cameras[args[0]]) return switchToCamera(gm.cameras[args[0]], 1000)
        else chat('cam not found')
    },
    resetcam: ()=>{
        resetCameraToPlayer()
    }
})

mp.events.add({
    "switchToCamera": (name, interp) => {
        if(gm.cameras[name]) switchToCamera(gm.cameras[name], Number(interp))
    }
})