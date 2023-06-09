class Faction{
    constructor(instance){
        this.data = instance
        //variables
        this.membersOnline = []

        //faction config
        this.abbreviation = instance.abbreviation || `Фракция`
        this.chatColor = instance.chatColor || `#0ff`

        this.name = instance.name || 'faction'
        this.fullName = instance.fullName || 'Фракция'

        this.isCriminal = instance.isCriminal || false
        this.isShiftable = instance.isShiftable || true
        this.hasCommonFund = instance.hasCommonFund || false


        //spawnpos
        this.spawnPosition = {
            x: instance.x,
            y: instance.y,
            z: instance.z
        }
        this.spawnHeading = instance.h

        if(instance.ranks == null) this.data.ranks = [ 'Ранг 3', 'Ранг 2', 'Ранг 1' ]
        this.ranks = instance.ranks
        console.log('ranks:',this.ranks);

        //adding to pool
        if(!gm.factions[this.name]) gm.factions[this.name] = this
    }

    init(){

    }

    save(){
        this.data.save()
    } 

    load(instance){
       
    }

    setRankName(rank, name){
        if(rank < 0 || rank > 10 || !name) return false
        return this.rank[rank] = name
    }

    isMember(player){
        if(player.data.faction == this.name) return true
        return false
    }

    addToOnline(player){
        this.membersOnline.push(player)
        player.outputChatBox(utils.chat(`Вы состоите в {${this.chatColor}}${this.fullName}{~}`));
        mp.events.call("factionPlayerOnline", player, this.name)
    }

    removeFromOnline(player){
        let ind = this.membersOnline.indexOf(player)
        if(ind != -1) this.membersOnline.splice(ind, 1)
        mp.events.call("factionPlayerOffline", player, this.name)
    }

    invitePlayer(player, initiator){
        if(player.faction) return false

        new Confirmation(player, {
            data: [this, player],
            text: `Вас приглашают в организацию \\"${this.fullName}\\". Приймите или отклоните данное предложение.`,
            title: 'Приглашение',
            onAccept: function(faction, player){
                player.outputChatBox(utils.chat(`Вы приняли приглашение в ${faction.fullName}`));
                player.faction = faction
                player.data.faction = faction.name
                console.log(`player faction now is`, player.data.faction);
                faction.addToOnline(player)
            },
            onDecline: function(faction, player){
                player.outputChatBox(utils.chat(`Вы отказались от вступления в ${faction.fullName}`));
            }
        })
    }

    kickPlayer(player){
        player.outputChatBox(utils.chat(`{${this.chatColor}}[${this.fullName}]{~} Вас попросили уйти из организации...`));
        player.faction = undefined
        player.data.faction = 'none'
        this.removeFromOnline(player)
    }

    getRank(player){
        if(player.data.factionRank >= (this.ranks.length - 1)){
            return this.ranks[this.ranks.length - 1]
        }else{
            return this.ranks[player.data.factionRank]
        }
    }

    isOnDuty(player){
        if(player.onDuty){
            return true
        }
        return false
    }

    setOnDuty(player, state){
        player.onDuty = state
    }

    broadcast(message, from){ //sends to everyone who's online in faction
        if(this.membersOnline.length){
            if(from){
                this.membersOnline.forEach(function(member){
                    member.outputChatBox(utils.chat(`{${this.chatColor}}[${this.abbreviation}] ${this.getRank(from)}{~} ${from.getChatName()}: ${message}`));
                }, this)
            }else{
                this.membersOnline.forEach(function(member){
                    member.outputChatBox(utils.chat(`{${this.chatColor}}[${this.abbreviation}]{~}: ${message}`));
                }, this)
            }
        }
    }
}

global.Faction = Faction