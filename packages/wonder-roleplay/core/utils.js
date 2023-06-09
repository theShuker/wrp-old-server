global.utils = {}

utils.getPlayer = (idOrName) => {
    if (idOrName == parseInt(idOrName)) {
        if(mp.players.at(idOrName)) {
            return mp.players.at(idOrName);
        } else {
            return false;
        }
    } else {
        let target = false;
        let targets = 0;

        mp.players.forEach((player) => {
            if(player.name.toLowerCase().match(idOrName.toLowerCase()) != null) {
                targets++;
                target = player;
            }
        });
        if(targets > 1) return false;
        return target;
    }
}

utils.chat = (string, color) => {
    /*
        This simple function allows you to use '{#FFFFFF}text{~}' tags to color selected area of text;
        Color must be hexadecimal and have length of 3 or 6 numbers
        example: #ff0, #ff0000
    */
    if(string.length){
        let exp = /{(#[0-9abcdef]{3,6})}(.*?)({~})/gi
        string = string.replace(exp, `<span style='color: $1'>$2</span>`);
    }
    return `<span style='color: ${color || '#fff'}'>${string}</span>`;
}

utils.getPlayersInRange = (pos, range) => {
    let players = [];
    mp.players.forEachInRange(pos, range, player => {
        players.push(player);
    })
    return players;
}

utils.getClosestPlayerToPlayerInRange = (player, range) => {
    let maxDist = range;
    let target = false;
    mp.players.forEachInRange(player.position, range, player2 => {
        if(player == player2) return; //не находим сами себя

        let dist = getDistanceBetweenV3(player2.position, player.position)
        if(dist <= maxDist){
            maxDist = dist
            target = player2;
        }
    })
    return target;
}

utils.sha256 = (toHash) => {
    if(!config.salt){
        throw "utils.sha256: config.salt is not defined!"
    }
    return crypto.createHmac('sha256', global.config.salt).update(toHash).digest('hex');
}

utils.getDistanceBetweenV3 = (pos1, pos2) => {
    if(!pos1 || !pos2 || !pos1.x || !pos2.x) {console.log(`GetDistanceBetweenV3: Incorect arguments passed`); return false; }
    return Math.sqrt((pos2.x-pos1.x)*(pos2.x-pos1.x) + (pos2.y-pos1.y)*(pos2.y-pos1.y) + (pos2.z-pos1.z)*(pos2.z-pos1.z));
    //return Math.sqrt(Math.pow(pos1.x-pos2.x, 2) + Math.pow(pos1.y-pos2.y, 2) + Math.pow(pos1.z-pos2.z, 2));
}

utils.saveToFile = (line, file = "console") => {
    let path = './data-files/' + file + '.txt';
    fs.appendFile(path, line + "\n", 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(line);
    });
}
mp.events.add({
    "remoteSave": (player, line) => {
        if(!player.isAdmin()) return
        utils.saveToFile(line)
    }
})

utils.findFreeDimensionInRange = (from, to) => {
    let dlist = []
    
    mp.players.forEach(player => { //checking dimensions of each player
        if(player.dimension >= from && player.dimension <= to){ //if player dim is in range, setting that dim as occupied
            dlist[player.dimension] = true
        }
    })

    for(let i = from; i++; i <= to){
        if(!dlist[i]){
            return i
        }
    }
    return false
}

utils.isDimensionFree = (dimid) => {
    return !mp.players.toArray().some(player =>{
        if(player.dimension == dimid) return true
    })
}