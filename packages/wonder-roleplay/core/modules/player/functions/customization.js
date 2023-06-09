mp.events.add({
    "playerJoin": (player) => {
        player.loadSkin = () => {
            player.model = mp.joaat(player.data.skin)

            if(typeof(player.data.headBlend) == 'object' && player.data.headBlend.length){
                player.setHeadBlend(...player.data.headBlend)
            }

            if(player.data.faceFeatures.length){
                for (let i = 0; i <= 19; i++) {
                    if(!player.data.faceFeatures[i]) player.data.faceFeatures[i] = 0
                    player.setFaceFeature(i, player.data.faceFeatures[i])
                }
            }

            if(player.data.components.length){
                for (let i = 0; i < player.data.components.length; i++) {
                    if(player.data.components[i] !== null) player.setClothes(i, player.data.components[i][0], player.data.components[i][1], 2)
                }
            }

            //fix
            if(player.data.eyeColor.length){
                player.eyeColour = data.eyeColor
            }

            if(player.data.hairColor !== undefined || player.data.hairColor !== null){
                if(typeof(player.data.hairColor) == 'object'){
                    player.setHairColour(player.data.hairColor[0], player.data.hairColor[1])
                }else{
                    player.setHairColour(player.data.hairColor, player.data.hairColor)
                }
            }
        }
    },
    "characterCreationStart": (player) => {
        player.outputChatBox(utils.chat(`[СЕРВЕР] {#0f0}Создайте{~} вашего персонажа`));
        player.dimension = utils.findFreeDimensionInRange(500, 600)
        player.call("characterCreatorInit")
    },
    "characterCreationFinished": (player, data) => {
        if(typeof(data) === 'string') data = JSON.parse(data)
        console.log(data);
        //apply needed skin and parenting
        data.skinMix = 1 - data.skinMix
        if(data.sex == 'male'){
            player.model = mp.joaat('mp_m_freemode_01')
            player.data.skin = 'mp_m_freemode_01'

            player.setHeadBlend(data.mother, data.father, data.father, data.motherSkin, data.fatherSkin, data.fatherSkin, data.mix, data.skinMix, 0.5)
            player.data.headBlend = [data.mother, data.father, data.father, data.motherSkin, data.fatherSkin, data.fatherSkin, data.mix, data.skinMix, 0.5]
        } else{
            player.model = mp.joaat('mp_f_freemode_01')
            player.data.skin = 'mp_f_freemode_01'
            
            player.setHeadBlend(data.mother, data.father, data.mother, data.motherSkin, data.fatherSkin, data.motherSkin, data.mix, data.skinMix, 0.5)
            player.data.headBlend = [data.mother, data.father, data.mother, data.motherSkin, data.fatherSkin, data.motherSkin, data.mix, data.skinMix, 0.5]
        }

        //apply facefeatures
        for (let i = 0; i <= 19; i++) {
            player.setFaceFeature(i, data.faceFeatures[i] || 0)
            player.data.faceFeatures = data.faceFeatures
        }


        //apply haircolor
        player.setHairColour(data.hairColor, data.hairColor)
        player.data.hairColor = data.hairColor

        //apply eyecolor
        //NA
        //player.setEyeColor(data.eyeColor);
        player.data.eyeColor = data.eyeColor

        //apply clothing
        for(let i = 0; i < data.components.length; i++){
            if(data.components[i] !== null) player.setClothes(i, data.components[i][0], data.components[i][1], 2)
            player.data.components = data.components
        }

        player.data.save()

        mp.events.call("characterCreationEnd", player)
    },
    "characterCreationEnd": (player) => {
        player.position = {x: 0, y: 0, z: 71}
    },
    "authDataLoaded": (player) => {
        player.loadSkin()
    }
})