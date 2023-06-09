let BIND_SEQUENCE = {}

global.addKeybind = (key, func) => {
    if(BIND_SEQUENCE[key]){
        BIND_SEQUENCE[key].push(func)
    }else{
        BIND_SEQUENCE[key] = [func]
    }
}

function keybindEmit(player, key){
    if(BIND_SEQUENCE[key]){
        BIND_SEQUENCE[key].some(function(func) {
            return func(player)
        });
    }
}

mp.events.add({
    "keyPress": (player, key) => {
        keybindEmit(player, key)
    }
})
