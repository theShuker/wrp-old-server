class Gasstation extends Property{
    constructor(instance){
        super(instance)

        this.blipData = {
            model: 361,
            color: 1,
            text: 'АЗС'
        }

        this.fillDistance = 15

        this.markerData = {
            model: 0,
            color: [255,255,0]
        }

        this.d3dtext = add3dText(`АЗС\nСтоимость литра: ${this.data.fuelPrice}$\nОстаток бензина: ${this.fuel}`, this.position)

        this.createVisuals()
    }

    get fuel(){
        return this.data.fuelRemaining
    }
    set fuel(v){
        this.data.fuelRemaining = v
        update3dText(this.d3dtext, `АЗС\nСтоимость литра: ${this.data.fuelPrice}$\nОстаток бензина: ${this.fuel}`)
    }
    get fuelPrice(){
        return this.data.fuelPrice
    }
    set fuelPrice(v){
        this.data.fuelPrice = v
        update3dText(this.d3dtext, `АЗС\nСтоимость литра: ${this.data.fuelPrice}$\nОстаток бензина: ${this.fuel}`)
    }


    //filling methods
    isReadyToFill(player, vehicle){
        if(this.fuel <= 0){
            player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} На этой АЗС закончился бензин. Необходимо чтобы кто-нибудь доставил его.`));
            return false
        }
        if(!vehicle.fillData){
            if(!vehicle.engine){
                player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} Вы должны {#ff0}заглушить двигатель{~}, прежде чем заправиться!`));
                return false
            }
            if(vehicle.fuel == (vehicle.fuelMax || 100)){
                player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} Бак вашего ТС уже полон!`));
                return false
            }
            if(player.money < this.data.price){
                player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} Вам не хватает денег для заправки! Стоимость литра - {#ff0}$${this.data.price}{~}`));
                return false
            }
        }else{
            if(!vehicle.engine){
                player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} Вы завели двигатель, заправка прервана!`));
                return false
            }
            if(vehicle.fuel == (vehicle.fuelMax || 100)){
                player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} Бак вашего ТС заполнен!`));
                return false
            }
            if(player.money < vehicle.fillData.price){
                player.outputChatBox(utils.chat(`{#f00}[АЗС]{~} Вам не хватает денег для полной заправки! Заправлено {#ff0}${vehicle.fillData.amountToFill-vehicle.fillData.amountToFillRemaining} из ${vehicle.fillData.amountToFill}{~} литров`));
                return false
            }
        }
        return true
    }
    startVehicleFill(player, vehicle, amountToFill){
        if(!this.isReadyToFill(player,vehicle)) return false

        vehicle.fillData = {
            gasstation: this,
            amountToFill: amountToFill,
            amountToFillRemaining: amountToFill,
            price: this.data.price,
            interval: setInterval(function(player, vehicle, gasstation){
                gasstation.fillVehicle(player, vehicle)
            }, 200, player, vehicle, this)
        }
        return true
    }
    fillVehicle(player, vehicle){
        if(!this.isReadyToFill(player,vehicle)){
            this.removeFillData(vehicle)
        }

        if(vehicle.fillData && vehicle.fillData.amountToFill > 0){
            //money actions
            let price = vehicle.fillData.price
            player.money -= price
            this.data.balance += price

            //fuel actions
            vehicle.fuel++
            vehicle.fillData.amountToFillRemaining--
            this.fuel--
        }else{
            this.endVehicleFill(player, vehicle)
        }
    }
    endVehicleFill(player, vehicle){
        if(vehicle.fillData){
            player.outputChatBox(utils.chat(`{#0f0}[АЗС]{~} ТС заправлено на ${vehicle.fillData.amountToFill} литра(ов) за ${vehicle.fillData.amountToFill*vehicle.fillData.price}`));
            this.removeFillData(vehicle)
        }
    }
    removeFillData(vehicle){
        if(vehicle.fillData){
            clearInterval(vehicle.fillData.interval)
            delete vehicle.fillData
            return true
        }
        return false
    }
    //stock methods
    recieveGasDelivery(vehicle){

    }
}

class GasstationPool extends PropertyPool{
    constructor(){
        super()
        this.new = function(instance){
            let gs = new Gasstation(instance)
            this.push(gs)
            return gs
        }
    }
}
gm.property.gasstations = new GasstationPool()
gm.property.Gasstation = gm.property.gasstations
PropertyLoadList.push('Gasstation')

