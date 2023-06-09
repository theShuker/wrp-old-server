/*new Confirmation(player, {
    data: [player, 'HEY'],
    text: 'Вы действительно хотите играть?',
    title: 'Привет',
    onAccept: function(player, text){
        player.outputChatBox(utils.chat(`ura! ${text}`));
    },
    onDecline: function(player, text){
        player.outputChatBox(utils.chat(`(((! ${text}`));
    }
})*/

gm.confirmations = []

class Confirmation{
    constructor(player, options){
        this.id = Date.now()

        this.text = options.text
        this.title = options.title

        this.data = options.data
        this.onAccept = options.onAccept.bind(this)
        this.onDecline = options.onDecline.bind(this)

        gm.confirmations.push(this)
        this.send(player)
    }

    send(player){
        player.call("createGui", JSON.stringify({
            type: 'confirmation',
            title: this.title,
            text: this.text,
            id: this.id
        }))
    }

    response(answer){
        if(answer){
            this.onAccept(...this.data)
        }else{
            this.onDecline(...this.data)
        }
        this.destroy()
    }

    destroy(){
        gm.confirmations.some(function(cf, i){
            if(cf = this){
                gm.confirmations.splice(i,1)
                return true
            }
        })
    }
}

global.Confirmation = Confirmation

mp.events.add({
    "confirmationResponse": (player, data) => {
        data = JSON.parse(data)

        gm.confirmations.some(function(cf){
            if(cf.id = data.id){
                cf.response(data.response)
                return true
            }
        })
    }
})
