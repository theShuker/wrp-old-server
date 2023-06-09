'use strict';

window.onerror = function(error, url, line) {
	$('#console-out').prepend('<li>'+ 'ERR: '+error+' URL: '+url+' L: '+line +'</li>');
};

function pushConsole(str){
	if(str === undefined) return $('#console-out').prepend(`<li>undefined</li>`)
	if(typeof(str) != 'string') str = JSON.stringify(str)
	str = str.replace(/</g,'&lt;')
	$('#console-out').prepend(`<li>${str}</li>`)
}

window.console.__log = console.log
console.log = function (...args) {
	window.console.__log(...args)
	pushConsole(args.join(';'))
}

window.console.__error = console.error
console.error = function (...args) {
	window.console.__error(...args)
	pushConsole(args.join(';'))
}




window.ClosestPlayers = []