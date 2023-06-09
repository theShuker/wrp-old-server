setInterval(() => {
    if(config.realtimesync){
        SyncTime()
    }
}, 1000);

function SyncTime(){
    if(global.config.realtimesync){
        let now = new Date();
        mp.environment.time.hour = now.getHours();
        mp.environment.time.minute = now.getMinutes();
        mp.environment.time.second = now.getSeconds();
    }
}

addCommand({
    "timesync": (player, args) => {
        if(!player.isAdmin(10)) return false
        if(!args[0]) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/timesync [bool]</b> - вкл/выкл реальное время`))
        if(args[0] == 'false'){
            config.realtimesync = false
        }else{
            config.realtimesync = true
        }
        player.outputChatBox(utils.chat(`{#ff0}[REAL TIME]{~} Синхронизация времени ${config.realtimesync ? '{#0f0}включена{~}' : '{#f00}отключена{~}'}`));
    }
})