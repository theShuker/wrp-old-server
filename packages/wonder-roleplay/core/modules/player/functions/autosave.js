let PlayerAutosaver = setInterval(() => {
    console.log(`[AUTOSAVE] Saving players data...`)
    saveData()
}, 30*60*1000)