gm.MODULES_TO_INIT = 0
//add gm.MODULES_TO_INIT++ in the module index file if it needs initialization (loading houses, vehicles, etc)

var modulesToLoad
fs.readdirSync(path.resolve(__dirname, './')).forEach((src, i, arr) =>
{
    modules = arr.length - 1
    if(src == 'loader.js') return;
    if(fs.existsSync(path.resolve(__dirname, './' + src + '/index.js'))){
        process.stdout.write(`[MODULES] Loading module '${src}'`);
        try{
            require('./' + src + '/index.js');
            process.stdout.write(" - ok\n");
        }catch(e){
            throw(e)
        }
    }
});
mp.events.add({
    "dbReady": () => {
        console.log(`[MODULES INIT] ${gm.MODULES_TO_INIT} modules are waiting to init`);
    }
})
mp.events.call("modulesReady", modules)