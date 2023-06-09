/*
    Connection handler allows to limit player connections from same IP
    options: config.maxconnections
*/

global.IPCONNECTIONS = {
    "127.0.0.1": 1
}

mp.events.add(
    {
        "playerJoined": (player) => {
            let ip = player.ip;
            if (IPCONNECTIONS[ip]) {
                if (IPCONNECTIONS[ip] >= config.maxconnections) {
                    player.outputChatBox(`<b style="color: red">Количество подключений с одного IP адреса превышено.</b>`);
                    player.kick('IP limit exceeded');
                    return log(`[Connections] Лимит подключений с 1 IP адреса исчерпан для ${ip}. Игрок ${player.name} кикнут.`, `connections`);
                }
                ++IPCONNECTIONS[ip];
                return;
            }
            IPCONNECTIONS[ip] = 1;
        },
        "playerQuit": (player) => {
            let ip = player.ip;
            if (IPCONNECTIONS[ip] <= 1) {
                delete IPCONNECTIONS[ip];
                return;
            }
            --IPCONNECTIONS[ip];
        }
    }
)