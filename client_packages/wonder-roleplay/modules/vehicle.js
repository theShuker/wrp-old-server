//SPEEDOMETER VARIABLES
if(!player.inCar) player.inCar = false
const SPEED_K = 3.6;

//SPEED LIMITER
addCommand({
    "limiter": (args) => {
        if(player.vehicle){
            if(!(Number(args[0]) >= 0)) return mp.gui.chat.push('//limiter [скорость 0-999] - ограничитель скорости для ТС, 0 - выключить')
            if(Number(args[0]) > 0){
                player.vehicle.Limiter = args[0]/SPEED_K
                mp.gui.chat.push(`Ограничитель скорости: ${args[0]} км/ч`)
            }else{
                player.vehicle.Limiter = false
                player.vehicle.setMaxSpeed(mp.game.vehicle.getVehicleModelMaxSpeed(player.vehicle.model))
                mp.gui.chat.push('Ограничитель скорости: выключен')
            }
        }else{
            mp.gui.chat.push('Вы должны быть в машине, чтобы включить ограничитель скорости')
        }
    }
})


//vehicle.setIndicatorLights(turnSignal, toggle); //1 - left //0 - right

mp.keys.bind(0x64, false, () => { // NUM 4
	if(!mp.keys._disabled){
		if(player.vehicle){
            player.vehicle.Lights = true
            player.vehicle.setIndicatorLights(1, true);
            player.vehicle.setIndicatorLights(0, false);
        }
	}
});
mp.keys.bind(0x65, false, () => { //NUM 5
	if(!mp.keys._disabled){
		if(player.vehicle){
            if(player.vehicle.Lights){
                player.vehicle.Lights = false
                player.vehicle.setIndicatorLights(1, false);
                player.vehicle.setIndicatorLights(0, false);
            }else{
                player.vehicle.Lights = true
                player.vehicle.setIndicatorLights(1, true);
                player.vehicle.setIndicatorLights(0, true);
            }
        }
	}
});
mp.keys.bind(0x66, false, () => { //NUM 6
	if(!mp.keys._disabled){
		if(player.vehicle){
            player.vehicle.Lights = true
            player.vehicle.setIndicatorLights(0, true);
            player.vehicle.setIndicatorLights(1, false);
        }
	}
});

mp.events.add({
	"playerEnteredVehicle": () => {
        mainUI.execute(`showSpeedo(true)`)
        player.inCar = true
    },
    "playerExitVehicle": () => {
        mainUI.execute(`showSpeedo(false)`)
        player.inCar = false
    },
    "render": () => {
        if(player.inCar && player.vehicle){
            let speed = player.vehicle.getSpeed();
            speed = Math.ceil(speed*SPEED_K);
            mainUI.execute(`updateSpeed(${speed}); updateRpm(${player.vehicle.rpm}, ${player.vehicle.gear})`);
            if(player.vehicle.Limiter){
                player.vehicle.setMaxSpeed(player.vehicle.Limiter)
                mp.game.graphics.drawText(`rpm: ${player.vehicle.rpm.toFixed(3)}}`, 0, [255,255,255,175], 0, 0.5, 1, 0.5, 0.3)
                if(player.vehicle.rpm > 0.5) player.vehicle.rpm = player.vehicle.rpm - .05
            }
        }
    },
    "recieveVehicleData": (fuel, locked, odoometer) => {
        mainUI.execute(`updateIndicators(${fuel}, ${locked}, ${odoometer})`)
    }
})