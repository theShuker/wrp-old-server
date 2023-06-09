gm.commands = {}

addCommand({
    "save": (args) => {
        let pos, rot, camrot, campos, line;
        camrot = gm.cameras.playerCamera.getRot(2);
        campos = gm.cameras.playerCamera.getCoord();
        
        pos = player.position;
        rot = player.getRotation(0);

        line = `[${args.join(' ')}] position: {x: ${pos.x.toFixed(3)}, y: ${pos.y.toFixed(3)}, z: ${pos.z.toFixed(3)}}; rotation: {x: ${rot.x.toFixed(3)}, y: ${rot.y.toFixed(3)}, z: ${rot.z.toFixed(3)}};\n`
        line += `\tcampos: {x: ${campos.x.toFixed(3)}, y: ${campos.y.toFixed(3)}, z: ${campos.z.toFixed(3)}}; camrot: {x: ${camrot.x.toFixed(3)}, y: ${camrot.y.toFixed(3)}, z: ${camrot.z.toFixed(3)}}`
        mp.events.callRemote("remoteSave", line)
    }
})


function addCommand(cmdObj){
    Object.keys(cmdObj).forEach((key) => {
        if(gm.commands[key]) console.warn(`[COMMANDS] Command overwriting detected for command ${key}! Are you sure you wanted that?`)
    });
	Object.assign(gm.commands, cmdObj);
}


mp.events.add({
    "localPlayerCommand": (command) => {
        let args = command.split(' ')
        let cmd = args[0]
        args.splice(0, 1)

        if(gm.commands[cmd]){
            gm.commands[cmd](args)
        }else{
            chat('Команда не найдена')
        }
    }
})

addCommand({
    "loadipl": (args) => {
        mp.game.streaming.requestIpl(args[0]);
        chat('loaded ipl: '+args[0])
    },
    "unloadipl": (args) => {
        mp.game.streaming.removeIpl(args[0]);
        chat('unloaded ipl: '+args[0])
    },
})