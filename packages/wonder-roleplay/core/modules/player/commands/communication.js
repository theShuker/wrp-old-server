/*
    Комумникативные команды, доступные всем.
    Настройки расстояний и цветов чата.
*/

const settings = global.config.ranges;

addCommand({
    "b": (player, args) => {
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/b [сообщение]</b> - OOC чат (нон-рп чат)`));;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, settings.default || 15, player.dimension, `<b>(( ${player.getChatName()}: ${text} ))</b>`);
    },
    "try": (player, args) => {
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/try [действие]</b> - RP: действие с вероятностью`));;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, settings.action || 10, player.dimension, `<i style='color: ${colors.action}'>* ${player.getChatName()} ${text}</i>`);
    },
    "me": (player, args) => {
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/me [действие]</b> - RP: действие от вашего лица`));;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, settings.action || 10, player.dimension, `<i style='color: ${colors.action}'>* ${player.getChatName()} ${text}</i>`);
    },
    "s": (player, args) => {
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/s [сообщение]</b> - RP: ваш персонаж кричит`));;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, settings.shout || 25, player.dimension, `<b><i style='color: ${colors.action}'>* ${player.getChatName()} кричит: ${text}</i></b>`);
    },
    "w": (player, args) => {
        if(!args.length) return player.outputChatBox(utils.chat(`{#ff0}[ПОМОЩЬ]{~} <b>/w [сообщение]</b> - RP: ваш персонаж шепчет в радиусе ${settings.whisper || 2}`));;
        let text = args.join(" ");
        mp.players.broadcastInRange(player.position, settings.whisper || 2, player.dimension, `<small style='color: ${colors.whisp}'>* ${player.getChatName()} шепчет: ${text}</small>`);
    }
})