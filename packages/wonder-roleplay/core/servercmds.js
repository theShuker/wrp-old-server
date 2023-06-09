const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
    let args = line.split(' ')
    let cmd = args.slice(0, 1)
    args.splice(0,1)
    switch(cmd[0]){
        case 'eval':
            eval(args.join(' '))
        return

        case 'say':
            mp.players.broadcast(utils.chat(`{#00f}[СЕРВЕР]{~} : ${args.join(' ')}`))
        return

        case 'players':
            console.log(`Players online: ${mp.players.length}`);
            let players = []
            mp.players.forEach(function(player) {
                players.push(`${player.name} [${player.id}]`)
            });
            console.log(...players)
        return
    }
});