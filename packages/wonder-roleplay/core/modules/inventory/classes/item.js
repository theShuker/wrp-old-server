/*
    Item class is used for handling ITEMS with DATA to SAVE
    example: phone - save contacts and sms
*/

gm.droppedItems = []

class Item{
    constructor(itemObj, inventory){
        if(inventory) this.inventory = inventory

        this.name = itemObj.name
        this._amount = itemObj.amount
        this.uniqueId = itemObj.uniqueId || false

        //default settings
        this.canBeStacked = true
        this.isUnique = false

        this.init()
    }

    get weight(){
        return this._weight * this.amount
    }

    get amount(){
        return this._amount
    }

    set amount(v){
        this._amount = v
        if(this._amount <= 0){
            this.destroy()
        }
    }
    //init
    init(){
        if(gm.definedItems[this.name]){
            let ditem = gm.definedItems[this.name]
            if(ditem.nameDescription) this.nameDescription = ditem.nameDescription
            if(ditem.description) this.description = ditem.description
            if(ditem.weight) this._weight = ditem.weight
            if(ditem.model) this.model = ditem.model
            if(ditem.isUnique) this.isUnique = ditem.isUnique
            if(ditem.canBeStacked) this.canBeStacked = ditem.canBeStacked
            if(ditem.actions) this.actions = ditem.actions

            if(ditem.data) this.dataTemplate = ditem.data    

            if(ditem.onUse) this.onUse = ditem.onUse.bind(this)
        }
        if(this.uniqueId){
            this.getDataByUniqueId(this.uniqueId)
        }
    }

    destroy(){
        console.log(`removing item ${this.name}`);
        this.inventory.inventory.some((item, i) => {
            if(item == this){
                console.log(`inv lengtf before: ${this.inventory.inventory.length}`);
                this.inventory.inventory.splice(i, 1)
                console.log(`inv lengtf after: ${this.inventory.inventory.length}`);
                return true
            }
        })
    }

    //unique item shit
    getDataByUniqueId(){
        if(this.uniqueId){
            ItemModel.findOne({where: {
                itemName: this.name,
                uniqueId: this.uniqueId
            }}).then(instance => {
                if(instance != null){
                    this.dbInstance = instance
                }else{

                }
            }).catch(e=>{
                console.error('Item load error:', e)
                LogDB.create({class: 'itemget', message: e})
            })
        }
    }

    registerUniqueId(){
        if(this.isUnique){
            this.uniqueId = Date.now()
            ItemModel.create({
                name: this.name,
                uniqueId: this.uniqueId,
                data: this.dataTemplate
            }).then(function(instance){
                this.dbInstance = instance
            }).catch(e => {
                console.error('Item create error:', e)
                LogDB({class: 'itemcreation', message: e})
            })
        }
    }

    //constructors for inventory saving and sending to GUI
    getObjectForSave(){
        if(this.isUnique && this.dbInstance){
            this.dbInstance.save()
        }
        return {
            name: this.name,
            amount: this.amount,
            uniqueId: this.uniqueId || undefined
        }
    }

    getObjectForGuiTransmission(){
        let object = {
            name: this.name,
            nameDescription: this.nameDescription,
            description: this.description,
            amount: this.amount,
            uniqueId: this.uniqueId || undefined,
            weight: this.weight,
            actions: this.actions || undefined
        }
        return object
    }

    //communication with parent inventory
    alsoHas(item, amount = 1){
        return this.inventory.hasItem(item, amount)
    }

    //player actions on this item
    use(player, target){
        if(this.onUse){
            this.onUse(player, target)
        }
    }

    drop(amount = 'all'){
        if(amount == 'all') amount = this.amount
        if(amount > this.amount) amount = this.amount

        let dimension = this.inventory.parent.dimension
        let pos = this.inventory.parent.position
        //pos.x += -1 + Math.random() + 2
        //pos.y += -1 + Math.random() + 2
        pos.z -= 0.5

        let dropped = {
            __prop: mp.objects.new(mp.joaat(this.model), pos, new mp.Vector3(0,0,0), dimension),
            position: pos,

            name: this.name,
            amount: amount,
            uniqueId: this.uniqueId || undefined
        }
        if(!gm.droppedItems[dimension]) gm.droppedItems[dimension] = []
        gm.droppedItems[dimension].push(dropped)

        this.amount -= amount
        if(amount <= 0) this.destroy()
    }
}
global.Item = Item


const Sequelize = require('sequelize');
const ItemModel = DB.define('items', {
    dbID: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    uniqueId: {type: Sequelize.INTEGER},
    itemName: {type: Sequelize.STRING(32)},
    data: {
        type: Sequelize.TEXT,
        get() {
            let data = this.getDataValue('data');
            return JSON.parse(data)
        },
        set(v){
            let data = JSON.stringify(v)
            this.setDataValue('data', data);
        }
    }
})
global.ItemModel = ItemModel

