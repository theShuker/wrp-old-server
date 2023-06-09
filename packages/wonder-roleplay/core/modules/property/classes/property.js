gm.property = {}

const INTERIORS = [
    {
        type: 'house',
        position: {
            x: 151.45108032227,
            y: -1007.9569091797,
            z: -98.999984741211
        },
        rotation:{
            x: 0,
            y: 0,
            z: 4.6173095703125
        }
    },
    {
        type: 'house',
        position: {
            x: 266.03485107422,
            y: -1007.1771850586,
            z: -101.00856018066
        },
        rotation:{
            x: 0,
            y: 0,
            z: 4.6173095703125
        }
    }
];

class PropertyPool extends Pool {
    constructor(){
        super()
    }
}

global.PropertyPool = PropertyPool
gm.property.all = new PropertyPool()
gm.property.enterable = new PropertyPool()

class Property{
    constructor(instance){
        //assigning db instance
        this.data = instance

        //distances for .isNear, .isNearExit methods
        this.isNearDistance = 1
        this.isNearExitDistance = 1

        //blip, marker data
        this.blipData = {
            model: 267,// 'P' letter.
            color: 0,
            text: 'Собственность'
        }
        this.markerData = {
            model: 2, // arrow up
            color: [255,255,255]
        }

        //has interior?
        this.dimension = 1000
        
        if(this.data.interior || this.data.interior == 0){
            gm.property.enterable.push(this)
            this.locked = true
            this.playersInside = []
        }

        //pushing to the pool
        gm.property.all.push(this)
    }


//position methods
    get position(){
        return {
            x: this.data.x,
            y: this.data.y,
            z: this.data.z
        }
    }
    set position(pos){
        this.data.x = pos.x
        this.data.y = pos.y
        this.data.z = pos.z

        if(this.blip) this.blip.position = pos
        if(this.marker) this.marker.position = pos
        return this
    }
    get rotation(){
        return {
            x: 0,
            y: 0,
            z: this.data.h
        }
    }
    set rotation(v){
        this.data.h = v
        return this
    }
    get intPosition(){
        return INTERIORS[ this.data.interior ].position
    }
    get intRotation(){
        return INTERIORS[ this.data.interior ].rotation
    }

//visuals (blips, markers)
    set blipData(v){
        if(!this._blipData) this._blipData = v

        this._blipData = {
            model: v.model || this._blipData.model,
            color: v.color || this._blipData.color,
            text: v.text || this._blipData.text
        }

        if(this.blip){
            this.blip.model = v.model || this._blipData.model
            this.blip.colour = v.color || this._blipData.color
            this.blip.text = v.text || this._blipData.text
        }
    }
    get blipData(){
        return this._blipData
    }

    set markerData(v){
        if(!this._markerData) this._markerData = v

        this._markerData = {
            model: v.model || this._markerData.model,
            colour: v.color || this._markerData.color,
            text: v.text || this._markerData.text
        }

        if(this.marker){
            this.marker.model = v.model || this._markerData.model
            this.marker.setColour(...(v.color || this._markerData.color))
        }
    }
    get markerData(){
        return this._markerData
    }
    
    createVisuals(){
        this.blip = mp.blips.newStreamed(this.blipData.model || 267, this.position, 70);
        this.marker = mp.markers.new(this.markerData.model, this.position, new mp.Vector3(0, 0, 0), new mp.Vector3(0, 0, 0), 0.5, 255, 255, 255, 175, true, 0)

        this.blip.colour = this.blipData.color || 0
        this.blip.text = this.blipData.text || 'Собственность'
    }
    destroyVisuals(){
        this.blip.destroy()
        this.marker.destroy()
    }

//interior methods
    get hasInterior(){
        if(this.data.interior || this.data.interior == 0)
            return true
        return false
    }
    get locked(){
        return this._locked
    }
    set locked(v){
        this._locked = v
        return this
    }
    putPlayerIn(player){
        if(this.hasInterior){
            player.currentlyIn = this
            player.dimension = this.dimension + player.id
            player.position = this.intPosition
            player.heading = this.intRotation.z
            this.playersInside.push(player)
            return true
        }
        return false
    }
    putPlayerOut(player){
        player.dimension = 0
        player.position = this.position
        player.heading = this.rotation.z

        let index = this.playersInside.indexOf(player)
        index != -1 ? this.playersInside.splice(index, 1) : false;

        delete player.currentlyIn
        return true
    }
    translateType(){
        switch(this.type){
            case 'house':
                return 'дом'
            case 'hotel':
                return 'отель'
            default:
                return 'собственность'
        }
    }

//property owning
    get owner(){
        return this.data.owner
    }
    set owner(v){
        this.data.owner = v
        return this
    }
    isOwner(player){
        if(player.name == this.data.owner) return true
        return false
    }
    setOwner(player){
        this.data.owner = player.name
        return this
    }

    save(){
        this.data.save()
    }

    

    isNear(player){
        let pos = player.position;
        if(utils.getDistanceBetweenV3(pos, this.position) <= (this.isNearDistance || 1)) return true;
        return false;
    }
    isNearExit(player){
        if(!this.hasInterior) return false
        let pos = player.position
        let pos2 = this.intPosition
        if(utils.getDistanceBetweenV3(pos, pos2) <= (this.isNearExitDistance || 1)) return true;
        return false;
    }

    destroy(sure){
        if(sure){
            console.log(`[PROPERTY] Removing property of type '${this.type}' with id '${this.data.dbID}'`)
            this.destroyVisuals()
            Object.keys(gm.property).forEach(pool => {
                if(gm.property[pool].length){
                    gm.property[pool].destroy(this)
                }
            })
            this.data.destroy({ force: true }).then(() => {
                console.log(`[PROPERTY] Deleted`)
            })
        }
    }
}
global.Property = Property

//load class extenders
fs.readdirSync(path.resolve(__dirname, './extenders/')).forEach(src => { require('./extenders/' + src) })