mp.events.add({
    "guiReady": (player, retry) => {
        if(!player.checkedForRegistration){
            console.warn('[AUTH] Player GUI loaded faster that gamemode. Setting interval.')
            setTimeout((p) => {mp.events.call("guiReady", p, true)}, 1000, player)
            return;
        }

        if (player.banned) {
            if (config.debug) console.log(`Showing ban window for ${player.getChatName()}`);
            player.outputChatBox(utils.chat(`{#f00}[СЕРВЕР]{~} Ваш аккаунт {#f00}забанен{~} на сервере!`));
            return player.call("showAuthorization", 'banned')
        }
        if (player.registered) {
            if (config.debug) console.log(`Showing login window for ${player.getChatName()}`);
            player.outputChatBox(utils.chat(`{#0f0}<b>[СЕРВЕР]</b>{~} Вы {#0f0}зарегистрированы{~} на сервере! Введите пароль для входа`));

            if(config.NOLOGIN){
                player.call("showAuthorization", 'login')
                mp.events.call("authLoggedIn", player)
                return
            }


            return player.call("showAuthorization", 'login')


        }
        return player.call("showAuthorization", 'register')
    },
    "authLogin": (player, pw) => {
        if(player.registered){
            if(player.data.password != utils.sha256(pw)) {
                //incorrect password
                player.loginTries--
                if(player.loginTries <= 0){
                    return player.kick('Used wrong password too many times')
                    return console.log(`[AUTH] ${player.name} kicked: wrong password too many times`)
                }
                player.call("authError", 'Пароль не верный!')
                return console.log(`[AUTH] ${player.name} entered wrong password`)
            }
            //correct password
            player.loggedIn = true
            mp.events.call("authLoggedIn", player)
        }
    },
    "authRegister": (player, pw1, pw2, email, invite) => {
        if(!player.registered){
            //server checks
            if(pw1.length < 5 || pw2.length < 5 || pw1 != pw2){
                LogDB.create({class: 'suspected', message: 'authRegister recieved "pw" params, which must be checked on client for correctness'})
                return player.call("authError", 'Пароль не соответствует требованиям')
            }
            let pw = utils.sha256(pw1)

            if(!email){
                LogDB.create({class: 'suspected', message: 'authRegister recieved "email" params, which must be checked on client for correctness'})
                return player.call("authError", 'Email не соответствует требованиям')
            }

            if(invite.length == 0) invite = 'none'
            
            //account creation

            if(!player.data) 
                AccountModel.create({
                    name: player.name,
                    password: pw,
                    email: email,
                    invite: invite
                }).then((instance) => {
                    player.data = instance
                    console.log(`[REGISTRATION] Created account for ${player.name}`);
                    
                    player.loggedIn = true
                    mp.events.call("authDataLoaded", player)
                    mp.events.call('authRegistered', player)
                }).catch(e => {
                    console.error(`[REGISTRATION] Error on creating new account model: `, e)
                    LogDB.create({class:'registration', message: e})
                    return player.call("authError", 'Ошибка создания аккаунта...')
                })
        }
    },
    "authQuit": (player) => {
        player.kick("Authorization abort")
    }
})