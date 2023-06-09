gm.DC_POSITIONS = {};
var DC_POS_TIMEOUT = global.config.dcPosTimeout || 2 * 60 * 60 * 1000;
/*
"Sammy_Price": {
    last_ip: ,
    dcTime: ,
    z: ,
    y: ,
    z: ,
}
 */

gm.playerHasDcPosition = (player) => {
    if (!gm.DC_POSITIONS[player.name]) return false;
    let dcpos = gm.DC_POSITIONS[player.name];
    if (dcpos.last_ip != player.ip) {
        delete gm.DC_POSITIONS[player.name];
        return false;
    }

    if (Date.now() - dcpos.dcTime <= DC_POS_TIMEOUT) {
        return new mp.Vector3(dcpos.x, dcpos.y, dcpos.z);
    } else {
        delete gm.DC_POSITIONS[player.name];
        return false;
    }
}

gm.addPlayerDcPosition = (player) => {
    let pos = player.position;

    let dcpos = {
        last_ip: player.ip,
        dcTime: Date.now(),
        x: pos.x,
        y: pos.y,
        z: pos.z
    }
    gm.DC_POSITIONS[player.name] = dcpos;
}

mp.events.add("playerQuit", (player) => {
    gm.addPlayerDcPosition(player);
});