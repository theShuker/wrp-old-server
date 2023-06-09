class VehiclePool extends Pool {
    constructor() {
        super()

        this.new = function (model, pos, rot) {
            let veh = new Vehicle(model, pos, rot)
            this.push(veh)
        }
    }
}
gm.vehicles = new VehiclePool()

class Vehicle {
    constructor(model, pos, rot, dimension = 0) {
        this.model = model

        //create vehicle object and link objects
        this.obj = mp.vehicles.new(mp.joaat(model), pos, rot)
        this.obj.wrapper = this
        this.obj.dimension = dimension

        //build data instance
        this.data = VehicleModel.build({
            model: model,
            fuel: 100,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            rx: rot.x,
            ry: rot.y,
            rz: rot.z,
            color: [Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255)],
            inventory: null,
            inventorySize: 50
        })

        //vehicle settings
        this.isFactionVehicle = false
        this.infiniteFuel = false

        //attach inventory
        this.inventory = new Inventory(this)

        //setting up fuel system
        this.engine = false
        this.obj.engine = false

        //generating visual appearance
        this.generatePlate()
        this.color = this.color

        return this
    }

    load(instance) {
        this.mustBeSaved = true
        this.data = instance

        this.fuel = this.data.fuel
        this.color = this.data.color
        this.numberPlate = this.data.plate
    }

    get color() {
        return this.data.color
    }
    set color(arr) {
        if (arr.length == 2) {
            this.data.color = arr
            this.obj.setColour(this.data.color[0], this.data.color[1])
        } else if (arr.length == 3) {
            let col = arr
            this.data.color = arr
            this.obj.setColourRGB(col[0], col[1], col[2], col[0], col[1], col[2])
        } else if (arr.length == 6) {
            let col = arr
            this.data.color = arr
            this.obj.setColourRGB(col[0], col[1], col[2], col[3], col[4], col[5])
        } else console.warn(`Vehicle.setColor: provided array with length != 2 || 6`)
    }

    save() {
        this.data.save()
    }

    get engine() {
        return this.obj.engine
        //return this.obj.engine
    }
    set engine(v) {
        if(v){
            if(this.fuel < 0) return false
            this.obj.engine = true

            if(this.__fuelTimer) clearInterval(this.__fuelTimer)

            this.__fuelTimer = setInterval(() => {
                //getting velocity
                let velocity = this.obj.velocity || {x: 0, y: 0, z: 0}
                velocity = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z)

                //adding distance to the odometer
                let kilometersThisSec = velocity/1000
                this.odometer += kilometersThisSec
                
                //fuel consumption calculation
                if(this.infiniteFuel !== true){
                    let toConsume = 0.01 + velocity/1000
                    toConsume = +toConsume.toFixed(2)
                    this.fuel -= toConsume
                }

                //send data if there is a driver
                if (this.driver !== undefined) {
                    this.driver.call("recieveVehicleData", this.fuel.toFixed(2), this.locked, this.odometer.toFixed(1))
                }

                if(this.fuel <= 0){
                    this.fuel = 0
                    this.engine = false
                }
            }, 1000)
        }else{
            clearInterval(this.__fuelTimer)
            this.obj.engine = false
        }
    }

    get odometer(){
        return this.data.odometer
    }
    set odometer(v){
        this.data.odometer = v
    }

    get fuel() {
        return this.data.fuel
    }
    set fuel(v) {
        this.data.fuel = v
    }

    get locked() {
        return this.obj.locked
    }
    set locked(v) {
        this.obj.locked = v
        return this
    }

    get position() {
        return this.obj.position
    }
    set position(v) {
        this.obj.position = v
        return this
    }

    get rotation() {
        return this.obj.rotation
    }
    set rotation(v) {
        this.obj.rotation = v
        return this
    }

    get spawnPosition() {
        return {
            x: this.data.x,
            y: this.data.y,
            z: this.data.z
        }
    }
    set spawnPosition(pos) {
        this.data.x = pos.x
        this.data.y = pos.y
        this.data.z = pos.z
    }

    getMod(mod) {
        return this.obj.getMod(mod)
    }
    setMod(modType, modIndex) {
        if (modType < 0 || modType > 50) return
        if (modIndex < 0 || modIndex > 255) modIndex = 0

        this.data.mods[modType] = modIndex
        this.obj.setMod(modType, modIndex)
        return this
    }

    get numberPlate() {
        return this.obj.numberPlate
    }
    set numberPlate(v) {
        this.data.plate = v
        this.obj.numberPlate = v
    }

    generatePlate() {
        let random = Math.ceil(Math.random() * 999)
        random = random.toString().padStart(3, '0')
        this.numberPlate = 'LS' + random + 'WRP'
    }
}

gm.MODULES_TO_INIT++
global.loadVehicles = () => {
    VehicleModel.findAll().then(instanceArr => {
        console.log(`[VEHICLES] ${instanceArr.length ? 'Loading ' + instanceArr.length + 'vehicles...' : 'No vehicles to load...'}`);
        instanceArr.forEach(instance => {
            let veh = gm.vehicles.new(
                instance.model,
                {
                    x: instance.x,
                    y: instance.y,
                    z: instance.z
                },
                {
                    rx: instance.rx,
                    ry: instance.ry,
                    rz: instance.rz
                }
            )
            veh.load(instance)
        })
        gm.MODULES_TO_INIT--
    })
}

global.saveVehicles = () => {
    mp.vehicles.forEach(veh => {
        if (veh.mustBeSaved) {
            veh.save()
        }
    })
}

mp.events.add({
    "dbReady": () => {
        loadVehicles()
    },
    "playerEnteredVehicle": (player, vehicle) => {
        if(player.seat == 0) {
            player.call("recieveVehicleData", vehicle.wrapper.fuel.toFixed(2), vehicle.wrapper.locked, vehicle.wrapper.odometer.toFixed(1))
            vehicle.wrapper.driver = player
        }
    },
    "playerExitVehicle": (player) => {
        if(player.seat == 0) {
            player.vehicle.wrapper.driver = undefined
        }
    },
    "playerLeftVehicle": (player, vehicle) => {

    }
})
global.Vehicle = Vehicle

require('./commands/admin')
require('./events/keybinds')