function CreatePopup(options){
	if(!options) options = {}
	if(typeof(options) == 'string') options = JSON.parse(options);

	let notice = $('<div></div>').addClass('notice').css("display", "none");
	let header = $(`<h1>${options.header || options.title || 'Popup'}</h1>`).css({
		"background-color": options.color || "#0086cf",
		"color": options.textcolor || "#fff"
	});

	let text = $(`<p>${options.text || 'Test'}</p>`);
	notice.append(header, text);
	$('.notice-menu').append(notice);
	notice.slideDown('slow').delay(options.delay || 6000).fadeOut(1000, function(){ this.remove() });
}