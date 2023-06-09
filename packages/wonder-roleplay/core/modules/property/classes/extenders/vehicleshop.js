/* 

vehicles: [
    {
        category: 'Sport',
        model: 'Akuma',
        price: '200000',
        level: '',
        isPremium: true/false,
        limited: false || 100
    }
]
*/


class Vehicleshop extends Property{
    constructor(instance){
        super(instance)

        this.type = 'business'

        this.vehiclesClass = this.data.vehiclesClass
        
        this.blipData = {
            model: 374,
            color: 26,
            text: 'Покупка транспорта'
        }

        this.markerData = {
            model: 29,
            color: [0,255,0]
        }

        this.dimension = 2000
        this.isNearDistance = 2

        this.setupByClass()

        this.d3dtext = add3dText(`${this.classDescribe}`, this.position)

        this.createVisuals()
    }

    get vehicles(){
        return this.data.vehicles
    }

    isVehicleInArray(model){
        let res = false

        this.vehicles.some((veh, i) => {
            if(veh.model == model){
                res = veh
                return true
            }
        })
        return res
    }

    setupByClass(){
        switch(this.vehiclesClass){
            case 'car':
                this.classDescribe = 'Авто-салон'
                this.blipData.model = 225

                this.testDrivePos = {x: 1447.425, y: -1065.251, z: 54.535}
                this.testDriveRot = {x: 1.676, y: 0.509, z: -63.465}
            break

            case 'motorcycle':
                this.classDescribe = 'Мото-салон'
                this.blipData.model = 226

                this.testDrivePos = {x: 1447.425, y: -1065.251, z: 54.535}
                this.testDriveRot = {x: 1.676, y: 0.509, z: -63.465}
            break

            case 'bicycle':
                this.classDescribe = 'Вело-магазин'
                this.blipData.model = 226

                this.testDrivePos = {x: -1104.648, y: -1701.157, z: 3.761}
                this.testDriveRot = {x: 0.253, y: 3.912, z: -100.837}
            break

            case 'plane':
                this.classDescribe = 'Покупка самолета'
                this.blipData.model = 359

                this.testDrivePos = {x: 1718.743, y: 3248.366, z: 41.952}; 
                this.testDriveRot = {x: -0.103, y: 0.045, z: 102.595};
            break

            case 'helicopter':
                this.classDescribe = 'Покупка вертолета'
                this.blipData.model = 360

                this.testDrivePos = {x: -745.570, y: -1468.687, z: 4.899}; 
                this.testDriveRot = {x: 0.001, y: 0.057, z: -37.643};
            break

            case 'boat':
                this.classDescribe = 'Магазин водного транспорта'
                this.blipData.model = 356

                this.testDrivePos = {x: -849.937, y: -1543.551, z: -0.087}; 
                this.testDriveRot = {x: 5.674, y: 0.001, z: 138.322};
            break
        }
        this.blipData.text = this.classDescribe
    }

    generateVehicleListForClient(){
        console.log(this.vehicles);
        return this.vehicles
    }

    addVehicle(vehobj){
        /*{
            category: 'Sport',
            model: 'Akuma',
            price: '200000',
            level: '',
            isPremium: true/false,
            remaining: false || 100
        }*/
        if(this.vehicles == null) this.data.vehicles = []
        this.data.vehicles.push(vehobj)
    }

    enterVehicleShop(player){
        player.dimension = this.dimension
        player.call("createGui", JSON.stringify(
            {
                type: 'vehicleShop',
                shopid: this.data.dbID,
                vehiclesClass: this.vehiclesClass,
                title: this.classDescribe,
                vehicles: this.generateVehicleListForClient()
            }
        ))
    }

    exitVehicleShop(player){

    }

    removeVehicle(model){
        let found = this.isVehicleInArray(model)
        if(found !== false){
            this.vehicles.splice(found, 1)
        }
    }
}

class VehicleshopPool extends PropertyPool{
    constructor(){
        super()
        this.new = function(instance){
            let gs = new Vehicleshop(instance)
            this.push(gs)
            return gs
        }
    }
}
gm.property.vehicleshops = new VehicleshopPool()
gm.property.Vehicleshop = gm.property.vehicleshops
PropertyLoadList.push('Vehicleshop')

