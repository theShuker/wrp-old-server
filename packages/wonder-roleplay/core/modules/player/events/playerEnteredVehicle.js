/* !!! REMOVE AFTER FIX (TRIGGERED FROM SERVER) !!! */
mp.events.add('playerEnteredVehicle', (player) => {
	if (player.vehicle && player.seat === 0 || player.seat === 255)
		player.call('playerEnteredVehicle')
})

