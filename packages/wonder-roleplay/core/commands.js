/*

    Simple player command handler

*/
global.__commands = {};

global.addCommand = (cmdObj) => {
    Object.keys(cmdObj).forEach((key) => {
        if(__commands[key]) console.warn(`[COMMANDS] Command overwriting detected for command ${key}! Are you sure you wanted that?`)
    });
	Object.assign(__commands, cmdObj);
}
global.addCommands = addCommand

mp.events.add({
	"playerCommand": (player, cmdtext) => {
        //не даем юзать команды незалогиненым и незареганым
		if(!player.loggedIn)
			return player.outputChatBox(`{#f00}<b>[СЕРВЕР]{~} Для использования команд необходимо войти!</b>`)

        //создадим массив параметров команды
		var arr = cmdtext.match(/[^ ]+/g);
        //найдем команду игрока	
		var cmd = __commands[arr[0]];

		if(cmd != null)
		{
			arr.splice(0,1); //удалим из массива 1й элемент (саму команду, ибо нах оно надо)

			arr.forEach((param, i) => {
				if(!isNaN(Number(param))){
					arr[i] = Number(param)
				}
			})

			//if (config.debug) console.log(`[ARGS]:`,arr);
			let result = cmd(player, arr, cmdtext)
			if(result == undefined || result == true) return true
		}
		return player.outputChatBox(utils.chat(`{#f00}[СЕРВЕР]{~} Команда не найдена.`));
	}
});