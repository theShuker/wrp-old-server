var positions = {
    "car": {
        cpos: {x: -39.346, y: -1099.057, z: 27.109},
        crot: {x: -7.591, y: 0.000, z: 37.491},
        vpos: {x: -45.969, y: -1094.709, z: 25.951},
        vrot: {x: 0.492, y: 0.014, z: -161.551},
    },
    "motorcycle": {
        cpos: {x: -39.346, y: -1099.057, z: 27.109},
        crot: {x: -7.591, y: 0.000, z: 37.491},
        vpos: {x: -45.969, y: -1094.709, z: 25.951},
        vrot: {x: 0.492, y: 0.014, z: -161.551},
    },
    "bicycle": {
        cpos: {x: -1102.959, y: -1697.830, z: 5.016},
        crot: {x: -14.687, y: 0.054, z: 135.462},
        vpos: {x: -1104.648, y: -1701.157, z: 3.761},
        vrot: {x: 0.253, y: 3.912, z: -100.837},
    },
    "plane": {
        cpos: {x: 1705.510, y: 3227.319, z: 48.924},
        crot: {x: -14.686, y: 0.000, z: -51.704},
        vpos: {x: 1718.743, y: 3248.366, z: 41.952},
        vrot: {x: -0.103, y: 0.045, z: 102.595},
    },
    "helicopter": {
        cpos: {x: -750.018, y: -1450.736, z: 10.342},
        crot: {x: -18.360, y: 0.000, z: 177.899},
        vpos: {x: -745.570, y: -1468.687, z: 4.899},
        vrot: {x: 0.001, y: 0.057, z: -37.643},
    },
    "boat": {
        cpos: {x: -836.130, y: -1432.159, z: 8.324},
        crot: {x: -18.528, y: 0.000, z: -167.988},
        vpos: {x: -824.372, y: -1449.343, z: 0.387},
        vrot: {x: 1.072, y: 0.259, z: -4.048},
    },
}

addCommand({
    veh: (args) => {
        
        let v = mp.vehicles.new(mp.game.joaat(args[0] || 'adder'), player.position, [0,0,0])
        throw v
    }
})

mp.events.add({
    "initShopByClass": (cl) => {
        switchToCamera(gm.cameras[`${cl}Shop`])

        player.position = gm.cameras[`${cl}Shop`].getCoord();
        player.freezePosition(true)
    },
    "vehicleShopUpdateVehicle": (shop, model) => {
        if(!gm.vshopVeh){
            gm.vshopVeh = mp.vehicles.new(mp.game.joaat(model), positions[shop].vpos, positions[shop].vrot)
            gm.vshopVehRotInterval = setInterval((veh) => {
                let rot = gm.vshopVeh.getRotation()
                rot.z -= 1
                gm.vshopVeh.setRotation(rot.x, rot.y, rot.z, 1, true);
            }, 100, gm.vshopVeh)
        }else{
            gm.vshopVeh.model = mp.game.joaat(model)
        }
    },
    "removeShop": () => {
        resetCameraToPlayer()
    }
})