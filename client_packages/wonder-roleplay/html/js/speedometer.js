function showSpeedo(value) {
	if (value) { $('.speedo').show(); return}
	$('.speedo').hide()
}
function updateSpeed(speed) {
	$('.speedo .speed').html(`${speed}<span>КМ/Ч</span>`);
}

function updateRpm(rpm,gear){
	let peak = 80
	deg = rpm*peak

	$('.rpm-arrow').css({transform: `rotate(${deg}deg)`})
	$('.speedo .gear').html(`${gear}<span class="text">ПЕРЕДАЧА</span>`);
}

function updateIndicators(fuel, lock, odometer){
	if(lock){
		$('.speedo .fuel').removeClass('open').addClass('close')
	}else{
		$('.speedo .fuel').removeClass('open').addClass('close')
	}
	$('.fuel').html(`ТОПЛИВО: ${fuel}`);
	$('.odometer').html(`${odometer.toString().padStart(8, '0')}`);
}