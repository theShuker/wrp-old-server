global.config = require('./config.json') //gettin config
global.colors = require('./colors.json')

process.stdout.write(`
#########################################
#                                       #
#    ██╗    ██╗      ██████╗ ██████╗    #
#    ██║    ██║      ██╔══██╗██╔══██╗   #
#    ██║ █╗ ██║█████╗██████╔╝██████╔╝   #
#    ██║███╗██║╚════╝██╔══██╗██╔═══╝    #
#    ╚███╔███╔╝      ██║  ██║██║        #
#    ╚══╝╚══╝       ╚═╝  ╚═╝╚═╝         #
#          Starting Server              #
#           version ${global.config.version} \t\t#
#########################################
`);

/*mp.players = mp._players
mp.vehicles = mp._vehicles
mp.colshapes = mp._colshapes
mp.checkpoints = mp._checkpoints
mp.markers = mp._markers
mp.objects = mp._objects
mp.blips = mp._blips*/

require('./core/index.js'); //starting core;