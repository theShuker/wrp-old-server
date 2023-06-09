mp.events.add({
    "guiDisableControls": (state, options) => {
        if(state){
            if(!options){
                player.disableControls(true) //disabling player ped controls
                mp.keys.disable(true) //disabling keybinds
                mp.gui.chat.activate(false) //disabling chat appear on T
            }else{
                /**
                 * 
                 * {
                 * if true it will disable this type of controls
                 *      player: true,
                 *      chat: true,
                 *      binds: true
                 * }
                 * 
                 */
                if(options.binds){
                    mp.keys.disable(true)
                }
                if(options.chat){
                    mp.gui.chat.activate(false)
                }
                if(options.player){
                    player.disableControls(true)
                }
            }
        }else{
            //giving control back
            player.disableControls(false)
            mp.keys.disable(false)
            mp.gui.chat.activate(true)
        }
    },
    "createGui": (options) => {
        mainUI.execute(`guiProcess('${options}')`);
    },
    "guiResponse": (options) => {
        mp.events.callRemote("guiResponse", options)
    },
    "confirmationResponse": (data) => {
        mp.events.callRemote("confirmationResponse", data)
    },
    "chatEnabled": (state) => {
        if(state){
            mp.keys.disable(true) 
        }else{
            mp.keys.disable(false)
        }
    },
    /**
     * 
     * MONEY INDICATOR CONTROLS
     * 
     */
    "showMoney": (state) => {
        mainUI.execute(`showMoney(${state})`);
    },
    "updateMoney": (amount, nosound, noAnim) => {
        if (!nosound) mp.game.audio.playSoundFrontend(-1, "PICK_UP", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
        mainUI.execute(`updateMoney(${amount}, ${noAnim})`);
    }
})

function popup(title, text){
    mainUI.execute(`CreatePopup('${JSON.stringify({
        title: title,
        text: text
    })}')`);
}

mp.events.add({
    "notify": (options) => {
        mainUI.execute(`CreatePopup('${options}')`);
    }
})