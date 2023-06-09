$("body").off()

if(!mp) var mp = false
let chat =
{
	size: 0,
	container: null,
	input: null,
	enabled: false,
	active: true,
	history: [],
	historyMax: 20
};

function enableChatInput(enable)
{
	if(chat.active == false
		&& enable == true)
		return;
	
    if (enable != (chat.input != null))
	{
        //chat_printing = enable;

        if (enable)
		{
			if (mp) mp.trigger("chatEnabled", true)
            chat.input = $("#chat").append('<div><input id="chat_msg" type="text" /></div>').children(":last");
			chat.input.children("input").focus();
        } 
		else
		{
            chat.input.fadeOut('fast', function()
			{
				if (mp) mp.trigger("chatEnabled", false)
                chat.input.remove();
                chat.input = null;
            });
		}
		
		if (mp) mp.invoke("focus", enable);
    }
}

var chatAPI =
{
	push: (text) =>
	{
		chat.container.prepend("<li>" + text + "</li>");

		chat.size++;

		if (chat.size >= 50)
		{
			chat.container.children(":last").remove();
		}
	},
	
	clear: () =>
	{
		chat.container.html("");
	},
	
	activate: (toggle) =>
	{
		if (toggle == false
			&& (chat.input != null))
			enableChatInput(false);
			
		chat.active = toggle;
	},
	
	show: (toggle) =>
	{
		if(toggle)
			$("#chat").show();
		else
			$("#chat").hide();
		
		chat.active = toggle;
	}
};

$(document).ready(function()
{
	chat.container = $("#chat ul#chat_messages");
	
    $(".ui_element").show();
    chatAPI.push("Multiplayer started");

    $("body").keydown(function(event)
	{
        if (event.which == 84 && chat.input == null && chat.active == true){
            enableChatInput(true);
            event.preventDefault();
        } 
		else if (event.which == 13 && chat.input != null){
            var value = chat.input.children("input").val();
			let full = value
            if (value.length > 0){
                if (value[0] == "/")
				{
					if(value[1] != "/"){
						value = value.substr(1);
						if (value.length > 0)
							if (mp) mp.invoke("command", value);
					}else{
						//client commands
						value = value.substr(2);
						if (value.length > 0)
							if (mp) mp.trigger("localPlayerCommand", value);
					}
                    
                }
				else{
                    if (mp) mp.invoke("chatMessage", value);
				}
				
				if(chat.history.length > chat.historyMax){
					chat.history.shift()
				}
				if(chat.historyPos != undefined){
					chat.history.pop()
				}
				chat.history.push(full)
            }else{
				if (chat.historyPos != undefined) chat.history.pop()
			}
			chat.historyPos = undefined
            enableChatInput(false);
        }else if (event.which == 38 && chat.input != null){
			event.preventDefault();
			var value = chat.input.children("input").val();

			if(chat.history.length){
				if(chat.historyPos == undefined){
					chat.historyPos = chat.history.length - 1
					chat.history.push(value)
				}else{
					if(chat.historyPos == chat.history.length - 1){
						chat.history[chat.historyPos] = value
					}
					chat.historyPos = chat.historyPos - 1 > 0 ? --chat.historyPos : 0
				}
				chat.input.children("input").val(chat.history[chat.historyPos])
			}
			
		}else if (event.which == 40 && chat.input != null){
			event.preventDefault();
			if(chat.history.length){
				if(chat.historyPos != undefined){
					chat.historyPos = chat.historyPos + 1 >= chat.history.length ? chat.history.length - 1 : ++chat.historyPos
					chat.input.children("input").val(chat.history[chat.historyPos])
				}
			}
		}
	});
});