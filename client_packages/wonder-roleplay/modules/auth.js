function playerJoined(){
    player.freezePosition(true)
    player.disableControls(true)
    mp.keys.disable(true)
    mainUI.execute(`mp.invoke('focus', true);`);

    mp.gui.chat.activate(false);

    mp.game.ui.displayRadar(false);

    mp.game.player.setHealthRechargeMultiplier(0)

    player.position = {x: -181.288, y: 900.461, z: 248}
    //gm.cameras.loginCamera = mp.cameras.new('default', new mp.Vector3(-260.0, 838.0, 340.0), new mp.Vector3(-25.0, 0.0, -160.0), 90.0);
    let loginCams = [
        mp.cameras.new('default', {x: -181.288, y: 900.461, z: 249.866}, {x: -11.853, y: 0.000, z: -170.583}, 90.0),
        mp.cameras.new('default', new mp.Vector3(-260.0, 838.0, 340.0), new mp.Vector3(-25.0, 0.0, -160.0), 90.0)
    ]
    gm.cameras.loginCamera = loginCams[Math.floor(Math.random() * loginCams.length)]
    switchToCamera(gm.cameras.loginCamera, 0)
}

function playerAuthorized(){
    mp.game.cam.doScreenFadeOut(250);
    
    mainUI.execute("$('.login, .register').remove(); mp.invoke('focus', false);");
}

function playerAuthFinished(){
    player.freezePosition(false)
    player.disableControls(false)
    mp.keys.disable(false)

    mp.game.ui.displayRadar(true);
    mp.gui.chat.activate(true);

    // reset player camera and effect
    resetCameraToPlayer()

    mp.game.cam.doScreenFadeIn(250);
}

mp.events.add({
    "cefReady": () => {
        mainUI.execute(`$('.username').text('${player.name}')`)
        mp.events.callRemote("guiReady")
    },
    "showAuthorization": (window) => {
        mainUI.execute(`$('.${window}').fadeIn(500);`)
    },
    "authQuit": () => {
        mp.events.callRemote("authQuit")
    },
    "authLogin": (pw) => {
        mp.events.callRemote("authLogin", pw)
    },
    "authRegister": (pw1, pw2, email, invite) => {
        if (pw1.length < 5 || pw2.length < 5) return mp.events.call('notify', JSON.stringify({header: `Ошибка`, text: `Длина пароля должна быть не менее 5 символов!`, color: `#f44242`}));
		if (pw1 != pw2) return mp.events.call('notify', JSON.stringify({header: `Ошибка`, text: `Пароли не совпадают`, color: `#f44242`}));
        if (email == '') return mp.events.call('notify', JSON.stringify({header: `Ошибка`, text: `Email не должен быть пустым`, color: `#f44242`}));
        
		let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if(!regex.test(email)) return mp.events.call("notify", JSON.stringify({header: 'Ошибка', text: 'Вы указали email в неверном формате. Укажите корректный email!', color: '#f44242'}));

        mp.events.callRemote("authRegister", pw1, pw2, email, invite)
    },
    "authError": (message) => {
        mp.events.call('notify', JSON.stringify({header: `Ошибка`, text: message, color: `#f44242`}));
    },
    "authSuccess": () => {
        playerAuthorized()
    },
    "authFinish": () => {
        playerAuthFinished()
    }
    ,
    "playerResurrect": () => {
        chat('ressurect')
        mp.events.callRemote("playerResurrect")
    }
})

