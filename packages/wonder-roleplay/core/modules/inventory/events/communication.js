mp.events.add({
    "requestPlayerInventory": (player) => {
        if(player.inventory){
            player.inventory.sendInventoryToGui()
        }
    },
    "inventoryAction": (player, data) => {
        data = JSON.parse(data)

        console.log(`recived inv action from ${player.name}:`, data);

        switch(data.action){
            case 'use':
                if(player.inventory.id == data.invId){
                    let itemfound = player.inventory.hasItem(data.item)
                    let target = data.target == 'self' ? player : utils.getPlayer(data.target)
                    if(itemfound){
                        itemfound.use(player, target)
                    }
                }
            break

            case 'give':
                
            break

            case 'drop':
                if(player.inventory.id == data.invId){
                    let itemfound = player.inventory.hasItem(data.item)
                    if(itemfound){
                        console.log(`executing drop`);
                        itemfound.drop(data.amount || 'all')
                    }
                }
            break

            case 'sell':
                
            break

            case 'transfer':
                
            break
        }
    }
}) 