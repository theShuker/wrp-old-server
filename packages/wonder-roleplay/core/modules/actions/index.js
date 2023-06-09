/*gm.actions = []

class Action{
    constructor(player, options){
        this.id = Date.now()

        this.text = options.text
        this.time = options.time

        this.data = options.data
        this.onAccept = options.onAccept.bind(this)
        this.onDecline = options.onDecline.bind(this)

        gm.actions.push(this)
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
        gm.actions.some(function(cf, i){
            if(cf = this){
                gm.actions.splice(i,1)
                return true
            }
        })
    }
}

global.Confirmation = Confirmation

mp.events.add({
    "confirmationResponse": (player, data) => {
        data = JSON.parse(data)

        gm.actions.some(function(cf){
            if(cf.id = data.id){
                cf.response(data.response)
                return true
            }
        })
    }
})*/
