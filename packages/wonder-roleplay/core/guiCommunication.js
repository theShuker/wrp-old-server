mp.events.add({
    "guiResponse": (player, obj) => {
        console.log(`New gui data from ${player.name}:`, obj)
        handleGuiResponse(player, obj)
    }
})

function handleGuiResponse(player, data){
    if(typeof(data) == 'string') data = JSON.parse(data)
    console.log(typeof(data))
    if(data.gui){
        if(GUI_RESPONSES[data.gui]){
            GUI_RESPONSES[data.gui](player, data)
        }
    }
}

global.GUI_RESPONSES = {}
global.addGuiResponseHandler = (guiId, func) => {
    GUI_RESPONSES[guiId] = func
}