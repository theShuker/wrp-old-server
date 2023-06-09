//
//  DISABLE ALL PLAYER CONTROLS
//
player._controlsDisabled = false
player.disableControls = (state) => {
    player._controlsDisabled = state
}
mp.events.add({
    "momentaryStop": () => {
        let vel = player.getVelocity()
        player.setVelocity(-vel.x, -vel.y, -vel.z)
    },
    "disableControls": (state) => {
        player._controlsDisabled = state;
    },
	"render": () => {
		if(player._controlsDisabled) mp.game.controls.disableAllControlActions(0);
	}
})

//
//  REMOTE PLAYER FREEZING
//
mp.events.add({
    "freezePlayer": (state) => {
        player.freezePosition(state)
    }
})

/**
 * 
 * KEYBINDS
 * 
 */
//mp.keys.bind(vkKeycode = 0x4C, onRelease = false, callback = () => {});
mp.keys._disabled = false;
mp.keys.disable = (state) => {
	mp.keys._disabled = state
}

//E KEY
mp.keys.bind(0x45, false, () => {
	if(gm.RAYCASTED) return
		
	if(!mp.keys._disabled){
		mp.events.callRemote("keyPress", 'e');
	}
});

//I KEY
mp.keys.bind(0x49, false, () => {
	if(!mp.keys._disabled){
		mp.events.callRemote("keyPress", 'i');
	}
});

//N KEY
mp.keys.bind(0x4E, false, () => {
	if(!mp.keys._disabled){
		mp.events.callRemote("keyPress", 'n');
	}
});