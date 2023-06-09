//CONSTANTS
const MODULE_PATH = './wonder-roleplay/modules/'
var mainUI = mp.browsers.new("package://wonder-roleplay/html/index.html")

//var chat = mp.browsers.new("package://wonder-roleplay/chat/index.html")
//chat.markAsChat()

mp.gui.execute(`window.location = "package://wonder-roleplay/html/chat.html"`)

//VARIABLES
var gm = {
    cameras: {}
}
var player = mp.players.local

//OPTIONS
mp.nametags.enabled = false
mp.gui.chat.safeMode = false
mp.game.gameplay.setFadeOutAfterDeath(false);

//REQUIRE
require(MODULE_PATH + `commands`)
require(MODULE_PATH + `controls`)
require(MODULE_PATH + `auth`)
require(MODULE_PATH + `gui`)
require(MODULE_PATH + `d3dtext`)
require(MODULE_PATH + `DEBUG`)
require(MODULE_PATH + `vehicle`)
require(MODULE_PATH + `noclip`)
require(MODULE_PATH + `vehicleshop`)
require(MODULE_PATH + `inventory`)
require(MODULE_PATH + `playercustomization`)
require(MODULE_PATH + `camera`)
require(MODULE_PATH + `doors`)
require(MODULE_PATH + `interaction`)

function chat(str){
    mp.gui.chat.push(str)
}

//auth.js
playerJoined()