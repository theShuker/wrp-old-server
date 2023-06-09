/*

    - Property naming convention:

    Property class extender must have first letter as a capital, example: Gasstation
    Property model must be named: Classname + 'Model' -> GasstationModel
    This will ensure that everything will load as it need to

*/
global.PropertyLoadList = []

require('./classes/property')
fs.readdirSync(path.resolve(__dirname, './functions/')).forEach(src => { require('./functions/' + src) })
fs.readdirSync(path.resolve(__dirname, './commands/')).forEach(src => { require('./commands/' + src) })

gm.MODULES_TO_INIT++
mp.events.add({
    "dbReady": () => {
        console.log(`[PROPERTY] ${PropertyLoadList.length} property types to load`);
        PropertyLoadList.forEach((model, i, arr) => {
            global[model+'Model'].findAll().then(instances => {
                console.log(`[PROPERTY] ${instances.length ? `Loading ${instances.length} ${model}s` : `No ${model}s to load`}`);
                instances.forEach(instance=>{
                    let property = gm.property[model].new(instance)
                })
            })
        })
        gm.MODULES_TO_INIT--
    }
})