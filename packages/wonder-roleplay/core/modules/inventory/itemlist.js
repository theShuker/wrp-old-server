/*
    required fields:
    description
    nameDescription
    weight
*/

gm.definedItems = {
    "chocolate": {
        description: "Обычная шоколадка",
        nameDescription: "Шоколадка",
        weight: 0.25,

        model: 'prop_paper_bag_small',
        canBeStacked: true,
        onUse(player, target){
            if(player != target) return player.outputChatBox(utils.chat(`{#ff0}[ИНВЕНТАРЬ]{~} Этот предмет можно использовать только на себя!`));
            player.outputChatBox(utils.chat(`Вы сьели шоколадку...`));
            this.amount--
        }
    },
    "cocaine": {
        description: "Кокаин",
        nameDescription: "Кокаин",
        weight: 0.1,
        canBeStacked: true,
        onUse(player, target){
            if(player != target) return player.outputChatBox(utils.chat(`{#ff0}[ИНВЕНТАРЬ]{~} Этот предмет можно использовать только на себя!`));
            player.outputChatBox(utils.chat(`Вы употребили кокаин...`));
            this.amount--
        }
    }
}


/*

,

,
    "papers": {
        description: "Бумажки для самокруток, обычно в них заворачивают табак...",
        nameDescription: "Бумажки для самокруток",
        weight: 0.001,
        canBeStacked: true
    },
    "lighter": {
        description: "Обычная дешевая зажигалка",
        nameDescription: "Зажигалка",
        weight: 0.001,
        canBeStacked: true
    }
    "weed": {
        description: "Порезаная марихуана в пакетике. Легкий наркотик. Для использования необходимы: бумажки для самокруток x 1; зажигалка x 1",
        nameDescription: "Марихуана",
        weight: 0.001,
        canBeStacked: true,
        onUse(player, target){
            if(player != target) return player.outputChatBox(utils.chat(`{#ff0}[ИНВЕНТАРЬ]{~} Этот предмет можно использовать только на себя!`));
            let papers = this.alsoHas('papers')
            let lighter = this.alsoHas('lighter')
            if(papers && lighter){
                player.outputChatBox(utils.chat(`Вы скрутили косячок и прикурили...`));
                this.amount--
                papers.amount--
                lighter.amount--
            }else{
                player.outputChatBox(utils.chat(`У вас не хватает какого-то из необходимых предметов`));
            }
        }
    }
    "phone": {
        description: "Обычный дешёвый смартфон",
        weight: 5,
        isUnique: true,
        canBeStacked: false,
        data: {
            "phonebook": [], //[phone, name]
            "messages": [], //[from (phone or Me), message]
        },
        onUse(player, target){
            if(player != target) return player.outputChatBox(utils.chat(`{#ff0}[ИНВЕНТАРЬ]{~} Этот предмет можно использовать только на себя!`));
            player.outputChatBox(utils.chat(`Вы достали телефон, потыкали в него и убрали!`));
            this.amount--
        }
    },
    "kebab-cheesy": {
        description: "Аппетитная шаверма... В сырном лаваше...",
        nameDescription: "",
        weight: 5,
        canBeStacked: true,
        onUse(player, target){
            if(player != target) return player.outputChatBox(utils.chat(`{#ff0}[ИНВЕНТАРЬ]{~} Этот предмет можно использовать только на себя!`));
            player.outputChatBox(utils.chat(`Вы сьели вкусную шаверму в сырном лаваше!`));
            this.amount--
        }
    },



*/