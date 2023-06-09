/*

    Inventory class is used as constructor for inventory handle object (wrapper for inventory data)

*/
gm.inventories = []

class Inventory {
    constructor(parent) {
        console.log('Inventory initializing')
        this.parent = parent

        this.inventoryLink = this.parent.data.inventory
        if (this.inventoryLink === undefined) return console.error(`Object has no 'inventory field' in its model`, this.parent)
        this.size = this.parent.data.inventorySize
        if (this.size === undefined) return console.error(`Object has no 'inventorySize field' in its model`, this.parent)

        if (this.parent && this.parent.ip) {
            this.parent.canAccessInventory = function (invId) {

            }
        }

        this.id = gm.inventories.length
        gm.inventories.push(this)

        this.init()
    }

    init() {
        if (this.inventoryLink == null) this.inventoryLink = [
            {
                name: 'chocolate',
                amount: 10
            },
            {
                name: 'cocaine',
                amount: 10
            }
        ]

        this.inventory = []
        this.inventoryLink.forEach(function (item, i) {
            if (item.amount <= 0) {
                //if for some reason this item has amount
                //with which items cant exist -> destroy it
                this.inventoryLink.splice(i, 1)
                return
            }
            this.inventory.push(new Item(item, this))
        }, this);
        console.log('Inventory ready')
    }

    hasItem(itemName, amount = 1) {
        let result = false
        this.inventory.some(function (invItem) {
            if (invItem.name == itemName) {
                result = invItem
                return true
            }
        });
        return result
    }


    addItems(items) {

    }

    removeItems(items) {

    }

    useItem(item, caller, target) {
        let found = this.hasItem(item)
        if (found) {
            if (found.onUse) {
                found.onUse(caller, target)
            }
        }
    }

    dropItem(item, amount) {
        let found = this.hasItem(item)
        if (found) {
            found.drop(amount)
        }
    }

    giveItem(item, target) {

    }

    save() {

    }

    transferTo(item, targetInv) {

    }

    getFullItemData(item) {
        if (!item.name) return false
        let data = gm.definedItems[item.name]

        if (data.nameDescription != undefined) item.nameDescription = data.nameDescription
        if (data.weight != undefined) item.weight = data.weight
        if (data.description != undefined) item.description = data.description

        return item
    }

    getItemsArray() {
        var itemsObject = []

        this.inventory.forEach(item => {
            let i = item.getObjectForGuiTransmission()
            itemsObject[itemsObject.length] = i
        })

        return itemsObject
    }

    getItemsOnGround() {
        let items = []
        let dimension = this.parent.dimension
        let pos = this.parent.position
        console.log(`dimension is:`, dimension);
        if (gm.droppedItems[dimension]) {
            console.log(gm.droppedItems[dimension]);
            gm.droppedItems[dimension].forEach(function (item) {
                console.log(utils.getDistanceBetweenV3(pos, item.position));
                if (utils.getDistanceBetweenV3(pos, item.position) <= 2) {
                    items.push(this.getFullItemData(item))
                }
            }, this)
        }
        return items
    }

    pickItemFromGround(name) {

    }

    getSideInventory() {
        let sideInv
        if (this.parent) {
            if (this.parent.currentlyIn && this.parent.currentlyIn.isOwner(this.parent)) {
                sideInv = {
                    items: this.parent.currentlyIn.inventory.getItemsArray(),
                    invId: this.parent.currentlyIn.inventory.id,
                    title: 'Ваш дом'
                }
                return sideInv
            }
            if (this.parent.vehicle && this.parent.vehicle.wrapper.owner == this.parent.name) {
                sideInv = {
                    items: this.parent.vehicle.wrapper.inventory.getItemsArray(),
                    invId: this.parent.vehicle.wrapper.id,
                    title: 'Ваше авто'
                }
                return sideInv
            }
        }
    }

    sendToGui() {
        if (!this.parent) return false
        let playerinv = this.getItemsArray()
        let groundinv = this.getItemsOnGround()
        let options = {
            title: 'Инвентарь',
            "groundInv": {
                title: 'Выброшеные',
                invId: 'dropped',
                items: groundinv
            },
            "playerInv": {
                title: `Инвентарь ${this.parent.name || 'игрока'}`,
                invId: this.id,
                items: playerinv
            }
        }
        options.sideInv = this.getSideInventory() || undefined
        console.log(JSON.stringify(options));
        this.parent.call("recievePlayerInventory", JSON.stringify(options))
    }
}
global.Inventory = Inventory

addKeybind('i', player => {
    player.inventory.sendToGui()
})