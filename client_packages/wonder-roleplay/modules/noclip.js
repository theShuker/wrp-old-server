mp.events.add({
    "enableNoclip": (speed) => {
        speed = Number(speed)
        if(!player._noclip){
            popup(`noclip`, `вкл ${typeof(speed)}`)
            player.freezePosition(true)
            player._noclip = speed
            return true
        }
        player.freezePosition(false)
        popup(`noclip`, `выкл`)
        return player._noclip = false
    },
    "render": () => {
        if(player && player._noclip){
            let crot = gm.cameras.playerCamera.getRot(2)
            player.setHeading(crot.z+180)
            let pos = player.position
            let realspeed = player._noclip

            if(mp.keys.isDown(16)){ //shift
                realspeed *= 2;
            }
            if(mp.keys.isDown(87)){ //W
                let ax = -Math.sin(crot.z * Math.PI / 180)
                let ay = Math.cos(crot.z * Math.PI / 180)
                let az = Math.sin(crot.x * Math.PI / 180)

                pos.x += realspeed * ax;
                pos.y += realspeed * ay;
                pos.z += realspeed * az;
            }
            if(mp.keys.isDown(65)){ //A
                crot.z-=90
                let ax = Math.sin(crot.z * Math.PI / 180)
                let ay = -Math.cos(crot.z * Math.PI / 180)

                pos.x += realspeed * ax;
                pos.y += realspeed * ay;
            }
            if(mp.keys.isDown(83)){ //S
                let ax = Math.sin(crot.z * Math.PI / 180)
                let ay = -Math.cos(crot.z * Math.PI / 180)
                let az = -Math.sin(crot.x * Math.PI / 180)

                pos.x += realspeed * ax;
                pos.y += realspeed * ay;
                pos.z += realspeed * az;
            }
            if(mp.keys.isDown(68)){ //D
                crot.z+=90
                let ax = Math.sin(crot.z * Math.PI / 180)
                let ay = -Math.cos(crot.z * Math.PI / 180)

                pos.x += realspeed * ax;
                pos.y += realspeed * ay;
            }
            if(mp.keys.isDown(32)){ //space
                pos.z += 0.5 * realspeed;
            }
            if(mp.keys.isDown(17)){ //ctrl
                pos.z -= 0.5 * realspeed;
            }

            player.position = pos;
        }
    }
})