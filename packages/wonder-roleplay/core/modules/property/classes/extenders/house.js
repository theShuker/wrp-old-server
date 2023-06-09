class House extends Property{
    constructor(instance){
        super(instance)

        this.type = 'house'
        
        this.dimension = 9000

        this.blipData = {
            model: 40,
            color: (this.data.owner == 'none' ? 2 : 1),
            text: (this.data.owner == 'none' ? 'Дом продаётся' : 'Дом куплен')
        }

        this.markerData = {
            model: 0,
            color: [255,255,0,175]
        }

        this.inventory = new Inventory(this)

        this.d3dtext = add3dText('Дом', this.position)

        this.createVisuals()
    }

    setOwner(player){
        this.data.owner = player.name
        this.blipData = {
            model: 40,
            color: 1,
            text: 'Дом куплен'
        }
        this.save()
        return this
    }
}

class HousePool extends PropertyPool{
    constructor(){
        super()
        this.new = function(instance){
            let house = new House(instance)
            this.push(house)
            return house
        }
    }
}
gm.property.houses = new HousePool()
gm.property.House = gm.property.houses
PropertyLoadList.push('House')


mp.events.add({
    "authDataLoaded": (player) => {
        if(player.data.houses != null && player.data.houses.length){
            player.houses = []
            player.data.houses.forEach((houseid, i) => {
                player.houses[i] = gm.property.houses.findByDbId(houseid)
            })
        }
    }
})