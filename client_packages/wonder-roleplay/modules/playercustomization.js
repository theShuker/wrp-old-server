player._setComponentVariation = player.setComponentVariation
player._setFaceFeature = player.setFaceFeature
player._setEyeColor = player.setEyeColor

player.setComponentVariation = function (comp, id, texture, pallete) {
    comp = Number(comp)
    id = Number(id)
    texture = Number(texture)
    pallete = Number(pallete)

    player._setComponentVariation(comp, id, texture, pallete)

    if (gm.customizer) {
        gm.customizer.components[comp] = [id, texture]
    }
}

player.setFaceFeature = function(part, value){
    part = Number(part) || 0
    value = Number(value) || 0

    player._setFaceFeature(part, value)

    if (gm.customizer) {
        gm.customizer.faceFeatures[part] = value
    }
}

player.setEyeColor = function(color){
    color = Number(color)
    player._setEyeColor(color)

    if (gm.customizer) {
        gm.customizer.eyeColor = color
    }
}



mp.events.add({
    "changeFace": (part, value) => {
        if (part == "eyes") return player.setEyeColor(value)
        player.setFaceFeature(part, value)
    },
    "changeSex": (sex) => {
        if (sex == 'male') {
            gm.customizer.sex = 'male'
            player.model = mp.game.joaat('mp_m_freemode_01')
            player.setComponentVariation(8, 0, 255, 2)

            player.setHeadBlendData(gm.customizer.father, gm.customizer.mother, gm.customizer.father, gm.customizer.fatherSkin, gm.customizer.motherSkin, gm.customizer.fatherSkin, gm.customizer.mix, gm.customizer.skinMix, 0.5, false)

            player.setComponentVariation(3, 0, 0, 2)
            player.setComponentVariation(11, 0, 1, 2)
            player.setComponentVariation(4, 5, 0, 2)
            player.setComponentVariation(6, 1, 0, 2)

            player.setComponentVariation(2, 2, 0, 2)
        } else {
            gm.customizer.sex = 'female'
            player.model = mp.game.joaat('mp_f_freemode_01')
            player.setComponentVariation(8, 0, 255, 2)

            player.setHeadBlendData(gm.customizer.father, gm.customizer.mother, gm.customizer.mother, gm.customizer.fatherSkin, gm.customizer.motherSkin, gm.customizer.motherSkin, gm.customizer.mix, gm.customizer.skinMix, 0.5, false)

            player.setComponentVariation(3, 0, 0, 2)
            player.setComponentVariation(11, 0, 1, 2)
            player.setComponentVariation(4, 14, 0, 2)
            player.setComponentVariation(6, 5, 0, 2)

            player.setComponentVariation(2, 2, 0, 2)
        }

    },
    "changeParent": (property, value) => {
        let daddy = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44]
        let mommy = [21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45]

        switch (property) {
            case 'mother':
                gm.customizer[property] = mommy[Number(value)]
                break
            case 'father':
                gm.customizer[property] = daddy[Number(value)]
                break
            case 'motherSkin':
                gm.customizer[property] = mommy[Number(value)]
                break
            case 'fatherSkin':
                gm.customizer[property] = daddy[Number(value)]
                break
            default:
                gm.customizer[property] = Number(value)
                break
        }


        if (gm.customizer.sex == 'male') {
            player.setHeadBlendData(gm.customizer.father, gm.customizer.mother, gm.customizer.father, gm.customizer.fatherSkin, gm.customizer.motherSkin, gm.customizer.fatherSkin, gm.customizer.mix, gm.customizer.skinMix, 0.5, false)
        } else if (gm.customizer.sex == 'female') {
            player.setHeadBlendData(gm.customizer.father, gm.customizer.mother, gm.customizer.mother, gm.customizer.fatherSkin, gm.customizer.motherSkin, gm.customizer.motherSkin, gm.customizer.mix, gm.customizer.skinMix, 0.5, false)
        }


    },
    "changeClothes": (clothData) => {
        clothData = JSON.parse(clothData)

        let compId = clothData[0]
        let clothId = clothData[1]
        let clothTexture = clothData[2]
        let torsoNeeded = clothData[3]


        if (torsoNeeded !== undefined) {
            player.setComponentVariation(8, 0, 255, 2) //вырубаем undershirt
            player.setComponentVariation(3, torsoNeeded, 0, 2) //ставим кусок тела
        }
        player.setComponentVariation(compId, clothId, clothTexture, 2);
    },
    "changeHair": (prop, value) => {
        switch (prop) {
            case 'head':
                var maleHair = [0, 1, 2, 3, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 22]
                var femaleHair = [1, 2, 3, 4, 5, 7, 10, 11, 14, 19]
                let chosen
                if (gm.customizer.sex == 'male') {
                    chosen = maleHair[Number(value)]
                } else {
                    chosen = femaleHair[Number(value)]
                }

                player.setComponentVariation(2, chosen, 0, 2)
                break

            case 'color':
                let colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 55, 56, 57, 58, 59, 60, 61]
                gm.customizer.hairColor = colors[Number(value)] || 0
                player.setHairColor(colors[Number(value)], colors[Number(value)])
                break
        }
    },
    "playerCreatorSave": () => {
        mp.events.callRemote("characterCreationFinished", JSON.stringify(gm.customizer))
        closeCustomizer()
    },
    "characterCreatorInit": () => {
        mp.game.cam.doScreenFadeOut(250)

        initCustomizer()
        startCharacterCustomizer()
    }
})

function startCharacterCustomizer() {
    player.disableControls(true)
    mainUI.execute(`createCustomizerWindow(); mp.invoke("focus", true)`)
}



function initCustomizer() {
    gm.customizer = {
        sex: 'male',
        //parenting
        mother: 21,
        father: 0,
        motherSkin: 0,
        fatherSkin: 0,
        mix: 0.5,
        skinMix: 0.5,

        //hairs
        hairColor: 0,

        //eyes
        eyes: 0,
        eyeColor: 0,

        //face customization
        faceFeatures: [],
        components: []
    }

    player.position = { x: 403.0, y: -996.5, z: -99.0 }
    player.setVelocity(0, 0, 0.5)
    player.setHeading(-180)

    switchToCamera(gm.cameras.customizerFull, 1000)

    //setting to male by default

    gm.customizer.sex = 'male'
    player.model = mp.game.joaat('mp_m_freemode_01')
    player.setComponentVariation(8, 0, 255, 2)

    player.setHeadBlendData(gm.customizer.father, gm.customizer.mother, gm.customizer.father, gm.customizer.fatherSkin, gm.customizer.motherSkin, gm.customizer.fatherSkin, gm.customizer.mix, gm.customizer.skinMix, 0.5, false)

    player.setComponentVariation(3, 0, 0, 2)
    player.setComponentVariation(11, 0, 1, 2)
    player.setComponentVariation(4, 5, 0, 2)
    player.setComponentVariation(6, 1, 0, 2)
    player.setComponentVariation(2, 2, 0, 2)

    mp.game.cam.doScreenFadeIn(500)
}

function closeCustomizer() {
    resetCameraToPlayer()
    player.disableControls(false)
}

addCommand({
    "custom": function () {
        initCustomizer()
        startCharacterCustomizer()
    }
})
