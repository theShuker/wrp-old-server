function getAdminPrefix(player) {
    let lvl = player._admin;

    if (lvl > 10) return "Гл.Админ";
    if (lvl >= 8) return "Зам.Гл.Админа";
    if (lvl >= 6) return "Ст.Админ";
    if (lvl >= 4) return "Админ";
    if (lvl >= 2) return "Модератор";
    if (lvl >= 1) return "Хелпер";
}

global.tempVehicles = [];

addCommand({
    "a": (player, args) => {
        if (!player.isAdmin())  return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /a [текст] - сообщение в админ-чат', '#ffff00'));

        mp.players.forEach((target) => {
            if (target.isAdmin()) {
                target.outputChatBox(utils.chat("> [" + getAdminPrefix(player) + "] " + player.name + " (" + player.id + "): " + args.join(" "), "#ffff00"));
            }
        });
    },
    "asay": (player, args) => {
        if (!player.isAdmin())  return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /asay [игрок] [текст] - сообщение игроку', '#ffff00'));

        let target = utils.getPlayer(args[0]);

        let msg = utils.joinFrom(args, 1);

        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        player.outputChatBox(utils.chat('> ' + player.name + ' -> ' + target.name + ': ' + msg, '#ffff00'));
        target.outputChatBox(utils.chat('> ' + player.name + ' -> ' + target.name + ': ' + msg, '#ffff00'));
    },
    "goto": (player, args) => {
        if (!player.isAdmin())  return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /goto [игрок] - телепорт к игроку', '#ffff00'));

        let target = utils.getPlayer(args[0]);
        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        let tpos = target.position;
        tpos.x += 1;
        player.position = tpos;
        player.outputChatBox(utils.chat('[GOTO] Вы телепортировались к ' + target.name));
    },
    "tp": (player, args) => {
        if (!player.isAdmin())  return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /tp [игрок1] [игрок2] - телепортировать 1 к 2', '#ffff00'));

        let target1 = utils.getPlayer(args[0]);
        let target2 = utils.getPlayer(args[1]);

        if (!target1 || !target2) return player.outputChatBox(utils.chat('Игроки (или 1 из) не найдены', 'err'));

        target1.position = target2.position;
    },
    "broadcast": (player, args) => {
        if (!player.isAdmin()) return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /broadcast [text] - сообщение всем', '#ffff00'));

        mp.players.broadcast(utils.chat('[ADMIN]: ' + args.join(' '), "#0000ff"));
    },
    "veh": (player, args) => {
        if (!player.isAdmin(5)) return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /veh [model] - создает vehicle; /cleartempvehicles - очистка', '#ffff00'));
        let pos = player.position;
        let vehobj = new Vehicle(args[0], pos, player.heading, player.dimension);
        global.tempVehicles.push(vehobj);
        player.putIntoVehicle(vehobj.obj, 0)
    },
    "cleartempvehicles": (player, args) => {
        if (!player.isAdmin(10))  return false;
        global.tempVehicles.forEach((veh) => {
            veh.destroy();
            veh = undefined;
        })
        player.outputChatBox(utils.chat('[DONE!] Удалено ' + global.tempVehicles.length + ' транспортных средств.', '#00ff00'));
        global.tempVehicles = [];
    },
    "setweather": (player, args) => {
        if (!player.isAdmin())  return false;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /setweather [weathertype]', '#ffff00'));
        mp.enviroment.weather = args[0];
        player.outputChatBox(utils.chat('Изменили погоду на ' + args[1], 'succ'));
    },
    "fixcar": (player, args) => {
        if (!player.isAdmin())  return false;
        player.vehicle.repair()
        player.outputChatBox(utils.chat('Vehicle fixed.', 'succ'));
    },
    "save": (player, args) => {
        if (!player.isAdmin())  return false;
        let pos, rot;
        let name = args.join(" ");
        if (player.vehicle) {
            pos = player.vehicle.position;
            rot = player.vehicle.rotation;
        }else{
             pos = player.position;
            rot = { x: 0, y: 0, z: player.heading };
        }
        utils.saveToFile(`[${name}] position: {x: ${pos.x.toFixed(3)}, y: ${pos.y.toFixed(3)}, z: ${pos.z.toFixed(3)}}; rotation: {x: ${rot.x.toFixed(3)}, y: ${rot.y.toFixed(3)}, z: ${rot.z.toFixed(3)}};`, 'positions');
    },
    "givegun": (player, args) => {
        if (!player.isAdmin(5))  return false;
        if (!args.length) return player.outputChatBox(utils.chat('[Помощь] /givegin [id] [gun] [ammo]', '#ffff00'));

        let target = utils.getPlayer(args[0]);
        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        target.giveWeapon(mp.joaat(args[1]), args[2]);
        player.outputChatBox(utils.chat(`[GIVEGUN] Вы дали ${args[1]} с ${args[2]} патронами игроку ${target.name}`));
    },
    "flymode": (player, args) => {
        if (!player.isAdmin(10))  return false;
        if (!player._flymode) {
            player._flymode = true;
        } else {
            player._flymode = false;
        }
        player.call("setFlyMode", player._flymode, parseInt(args[0]) || 1);
    },
    "invis": (player, args) => {
        if (args.length != 0) {
            let target = utils.getPlayer(args[0]);
            if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));
            if (!target._invis) {
                target._invis = true;
                target.alpha = 0;
                target.outputChatBox(utils.chat('Invis ON', 'succ'));
            } else {
                target._invis = !target._invis;
                target.alpha = 255;
                target.outputChatBox(utils.chat('Invis OFF', 'succ'));
            }
            return;
        }
        if (!player._invis) {
            player._invis = true;
            player.alpha = 0;
            player.outputChatBox(utils.chat('Invis ON', 'succ'));
        } else {
            player._invis = !player._invis;
            player.alpha = 255;
            player.outputChatBox(utils.chat('Invis OFF', 'succ'));
        }
    },
    "arevive": (player, args) => {
        if (!player.isAdmin(6)) return;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /arevive [player] - возродить игрока на месте', '#ffff00'));

        let target = utils.getPlayer(args[0]);
        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        player.outputChatBox(utils.chat(`Вы возродили ${target.name}....`, '#ffff00'));
        target.spawn(target.position)
        target.outputChatBox('Вам помог врач...');
    },
    "sethp": (player, args) => {
        if (!player.isAdmin(6)) return;
        if (args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /arevive [player] - возродить игрока на месте', '#ffff00'));

        let target = utils.getPlayer(args[0]);
        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        player.outputChatBox(utils.chat(`Вы установили ${target.name} ${args[1]} здоровья`, '#ffff00'));
        target.health = parseInt(args[1]);
    },
    "setmoney": (player, args) => {
        if (!player.isAdmin(10)) return;
        if (args.length < 2 || isNaN(args[1])) return player.outputChatBox(utils.chat('[Помощь] /setmoney [player] [money] - устанавливает абсолютное значение денег игроку', '#ffff00'));

        let target = utils.getPlayer(args[0]);
        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        target.setMoney(parseInt(args[1]));
    },
    "givemoney": (player, args) => {
        if (!player.isAdmin(10)) return;
        if (args.length < 2 || isNaN(args[1])) return player.outputChatBox(utils.chat('[Помощь] /givemoney [player] [money] - дает заданное количество денег игроку', '#ffff00'));

        let target = utils.getPlayer(args[0]);
        if (!target) return player.outputChatBox(utils.chat('Игрок ' + args[0] + ' не найден (или найдено больше 1 игрока)', 'err'));

        target.giveMoney(parseInt(args[1]));
    },
    "savedata": (player, args) => {
        if (!player.isAdmin(5)) return;
        if(args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /save [players,vehicles,houses,all] - принудительное сохранение в базу', '#ffff00'));
        switch(args[0]){
            case "players":
                try {
                    wrp.saveAllPlayers()
                    player.outputChatBox(utils.chat('[SUCCESS] Игроки сохранены успешно!', 'succ'));
                } catch (err) {
                    utils.log(`Error while saving players...`, 'error');
                    player.outputChatBox(utils.chat('[FAILURE] Ошибка при сохранении! Логи записаны.', 'err'));
                }
            return;
            case "vehicles":
                try {
                    wrp.saveVehiclesToDB();
                    player.outputChatBox(utils.chat('[SUCCESS] Авто сохранены!', 'succ'));
                } catch (err) {
                    utils.log(`Error while saving vehicles...`, 'error');
                    player.outputChatBox(utils.chat('[FAILURE] Error occured on vehicle saving...', 'err'));
                }
            return;
            case "houses":
                try {
                    wrp.saveHousesToDB();
                    player.outputChatBox(utils.chat('[SUCCESS] Дома сохранены!', 'succ'));
                } catch (err) {
                    utils.log(`Error while saving houses...`, 'error');
                    player.outputChatBox(utils.chat('[FAILURE] Error occured on house saving...', 'err'));
                }
            return;
            case "all":
                try {
                    wrp.saveAllPlayers()
                    wrp.saveVehiclesToDB();
                    wrp.saveHousesToDB();
                    player.outputChatBox(utils.chat('[SUCCESS] Все данные сохранены!', 'succ'));
                } catch (err) {
                    utils.log(`Error while saving all data...`, 'error');
                    player.outputChatBox(utils.chat('[FAILURE] Error occured on data saving...', 'err'));
                }
            return;

            default:
                player.outputChatBox(utils.chat('[ERR] /save [players,vehicles,houses,all] - принудительное сохранение в базу', '#err'));
            return;
        }
    },
    "admins": (player) => {
        if(!player.isAdmin()) return;
        let msg = "[Админы онлайн]: ";
        wrp.adminsOnline.forEach((adm, i) => {
            if(i == wrp.adminsOnline.length - 1){
                msg += adm.name + ".";
                return;
            }
            msg += adm.name + ", ";
        })
        player.outputChatBox(utils.chat(msg, '#ffff00'))
    },
    "mute": (player, args) => {
        if(!player.isAdmin(2)) return;
        if(args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /mute [игрок] - вкл/выкл чат игроку', '#ffff00'));
        let target = utils.getPlayer(args[0]);
        if(!target) return player.outputChatBox(utils.chat(`[MUTE] Игрок '${args[0]}' не найден`, `#ffff00`));

        target._mute = !target._mute;
        player.outputChatBox(utils.chat(`[MUTE] Чат игрока {#fff}${target.name} [${target.id}]{~} был ${target._mute ? '{#f00}выключен{~}' : '{#0f0}включен{~}'}`, `#ffff00`));
        target.outputChatBox(utils.chat(`[MUTE] Ваш чат был ${target._mute ? '{#f00}выключен{~}' : '{#0f0}включен{~}'} администратором {#fff}${player.name} [${player.id}]{~}`, `#ffff00`));
    },
    "noclip": (player, args) => {
        if(!player.isAdmin(10)) return false;
        if(args.length == 0) return player.outputChatBox(utils.chat('[Помощь] /noclip [speed] - 0: выкл', '#ffff00'));
        player.call("enableNoclip", args[0])
        player.outputChatBox(utils.chat(args[0] ? `{#0f0}[NOCLIP]{~} Включен. Скорость: ${args[0]}` : `{#0f0}[NOCLIP]{~} Выключен.`));
    },
    "tpxyz": (player, args) => {
        if(!player.isAdmin(10)) return false;
        if(args.length < 3) return player.outputChatBox(utils.chat('[Помощь] /tpxyz x y z - тп по координатам', '#ffff00'));

        let pos = {
            x: args[0],
            y: args[1],
            z: args[2]
        }
        player.position = pos
    }

        /* template
    
        "": (player, args) => {
            if(!player.isAdmin()) return;
            if(args.length == 0) return player.outputChatBox(utils.chat('[Помощь] / [] - help', '#ffff00'));
    
        }
    
         */
});