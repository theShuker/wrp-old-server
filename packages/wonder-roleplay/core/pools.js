class Pool{
    constructor(){
        this.pool = []
    }
    get length(){
        return this.pool.length
    }

    forEach(callback){
        this.pool.forEach(item => {
            callback(item)
        })
    }

    forEachInRange(position, range, callback){
        this.pool.forEach(item => {
            if(utils.getDistanceBetweenV3(item.position, position) <= range){
                callback(item)
            }
        })
    }

    findByDbId(dbid){
        let tgt = false
        this.pool.some(item => {
            if(!item.data) return
            if(item.data.dbID == dbid){
                tgt = item
                return true
            }
        })
        return tgt
    }

    closestInRange(position, range){
        let previousRange = range
        let target = false
        this.forEachInRange(position, range, (item) => {
            let newrange = utils.getDistanceBetweenV3(position, item.position)
            if(newrange <= previousRange){
                previousRange = newrange
                target = item
            }
        })
        return target
    }

    push(obj){
        this.pool.push(obj)
        return obj
    }
    destroy(obj){
        this.pool.splice(this.pool.find(obj), 1)
    }   
}
global.Pool = Pool