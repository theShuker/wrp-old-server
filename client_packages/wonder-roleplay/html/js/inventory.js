function createInventoryWindow(options){
    console.log(options);
    options = JSON.parse(options)

    options.beforeWindowAppend = function(){
        this.windowObject.css({"min-width": "800px"})
        let container = this.windowObject.find('.container')

        container.append(`
        <div class="block s-4">
            ${
                this.options.sideInv == undefined ? '' :
                `<div class="row">
                    <div class="inventory-title">${this.options.sideInv.title}</div>
                    <div id="side-inventory" class="inventory-container item-grid"></div>
                </div>`
            }
            ${
                this.options.groundInv == undefined ? '' :
                `<div class="row">
                    <div class="inventory-title">${this.options.groundInv.title || 'Выброшеные'}</div>
                    <div ${this.options.sideInv == undefined ? `style="height:288px;"` : ''} id="ground-inventory" class="inventory-container item-grid"></div>
                </div>`
            }
        </div>
        <div class="block s-8">
            <div class="row">
                <div class="inventory-title">${this.options.playerInv.title || 'Ваш инвентарь'}</div>
                <div id="player-inventory" class="inventory-container item-grid"></div>  
            </div>
            <div class="row">
                <div class="block s-6">&nbsp;</div>
                <div class="block s-6">
                <button id="transferMoney" onclick="showItemMenu(event)"><i class="fa fa-dollar"></i> Передать деньги</button>                  
                </div>  
            </div>
            </div>
        `)

        this.sideInvContainer = this.windowObject.find('#side-inventory')
        this.groundInvContainer = this.windowObject.find('#ground-inventory')
        this.playerInvContainer = this.windowObject.find('#player-inventory')

        //making item-drop-areas
        $([this.sideInvContainer, this.groundInvContainer, this.playerInvContainer]).each(function(){
            this.droppable({
                accept: function (elem) {
                    return ($(elem).hasClass('item') && !$(this).has(elem).length);
                },
                drop: function( event, ui ) {
                    $(this).removeClass('drop-ready')
                    $(this).append(ui.draggable)

                    callGuiFunction(this, 'itemAction', ui.draggable.data('name'), {action: 'transfer', from: ui.draggable.data('from'), to: this.id})

                    ui.draggable.data('from', $(this).attr('id'))
                },
                over: function( event, ui ) {
                    $(this).addClass('drop-ready')
                },
                out: function( event, ui ) {
                    $(this).removeClass('drop-ready')
                }
                
            });
        })

        //assigning ids for easy access
        this.sideInvId = this.options.sideInv ? this.options.sideInv.invId : undefined
        this.groundInvId = this.options.groundInv ? this.options.groundInv.invId : undefined
        this.playerInvId = this.options.playerInv ? this.options.playerInv.invId : undefined
        
        //loading items
        if(this.sideInvId) appendItemsHtml(this.sideInvContainer, this.options.sideInv.items)
        if(this.groundInvId) appendItemsHtml(this.groundInvContainer, this.options.groundInv.items)
        if(this.playerInvId) appendItemsHtml(this.playerInvContainer, this.options.playerInv.items)
        
        this.options.functions = { //this, 'itemAction', '${itemname}', 'use', ${plr[0]}
            "itemAction": function(caller, item, data){
                if(item){
                    switch(data.action){
                        case 'use':
                            if(mp)mp.trigger("performActionOnItem", JSON.stringify({
                                invId: this.playerInvId,
                                action: 'use',
                                item: item,
                                target: data.target
                            }))
                            this.destroy()
                        break

                        case 'give':
                            ui.createGUI({
                                width: 250,
                                title: `Передать предмет`,
                                invId: this.playerInvId,
                                item: item,
                                target: data.target,
                                elements: [
                                    [{type: 'text', value: '<p>Укажите количество, которое хотите передать</p>', width: 12}],
                                    [
                                        {type: 'text', value: '<p>Количество:</p>', width: 6},
                                        {type: 'input-number', id: 'item-give-amount', min: '1', placeholder: 'Количество', width: 6},
                                    ],
                                    [
                                        {type: 'button', icon:'exchange', color: 'green', value: 'Передать', action: `callGuiFunction(this, 'give', $('#item-give-amount').val())`, width: 6},
                                        {type: 'button', icon:'cross', value: 'Отмена', action: `closeGuiWindow(this)`, width: 6}
                                    ]
                                ],
                                functions: {
                                    "give": function(caller, amount){
                                        if(amount == '' || amount < 1) return this.destroy()
                                        if(mp)mp.trigger("performActionOnItem", JSON.stringify({
                                            invId: this.options.invId,
                                            action: 'give',
                                            amount: amount,
                                            target: this.options.target,
                                            item: item
                                        }))
                                        this.destroy()
                                    }
                                }
                            })
                            this.destroy()
                        break

                        case 'drop':
                            ui.createGUI({
                                title: `Выбросить?`,
                                invId: this.playerInvId,
                                item: item,
                                elements: [
                                    [
                                        {type: 'text', value: 'Укажите количество, которое необходимо выбросить', width: 6},
                                        {type: 'input-number', id: 'item-drop-amount', min: '1', placeholder: 'Количество', width: 6},
                                    ],
                                    [
                                        {type: 'button', icon:'trash', value: 'Выбросить всё!', action: `callGuiFunction(this, 'drop')`, width: 4},
                                        {type: 'button', icon:'trash', value: 'Выбросить', action: `callGuiFunction(this, 'drop', $('#item-drop-amount').val())`, width: 4},
                                        {type: 'button', icon:'cross', value: 'Отмена', action: `closeGuiWindow(this)`, width: 4}
                                    ]
                                ],
                                functions: {
                                    "drop": function(caller, amount){
                                        if(amount == '' || amount < 1) return this.destroy()
                                        if(mp)mp.trigger("performActionOnItem", JSON.stringify({
                                            invId: this.options.invId,
                                            action: 'drop',
                                            amount: amount,
                                            item: item
                                        }))
                                        this.destroy()
                                    }
                                }
                            })
                            this.destroy()
                        break

                        case 'sell':
                            ui.createGUI({
                                title: `Продать предмет`,
                                invId: this.playerInvId,
                                item: item,
                                target: data.target,
                                elements: [
                                    [{type: 'text', value: '<p>Укажите количество и сумму за которую вы хотите продать предмет</p>', width: 12}],
                                    [
                                        {type: 'text', value: '<p>Количество:</p>', width: 6},
                                        {type: 'input-number', id: 'item-sell-amount', min: '1', placeholder: 'Количество', width: 6},

                                        {type: 'text', value: '<p>Стоимость:</p>', width: 6},
                                        {type: 'input-number', id: 'item-sell-price', min: '1', placeholder: 'Цена $', width: 6},
                                    ],
                                    [
                                        {type: 'button', icon:'money', color: 'green', value: 'Продать', action: `callGuiFunction(this, 'sell', $('#item-sell-amount').val(), $('#item-sell-price').val())`, width: 6},
                                        {type: 'button', icon:'cross', value: 'Отмена', action: `closeGuiWindow(this)`, width: 6}
                                    ]
                                ],
                                functions: {
                                    "sell": function(caller, amount, price){
                                        if(amount == '' || amount < 1 || price == '' || price < 1) return this.destroy()
                                        if(mp)mp.trigger("performActionOnItem", JSON.stringify({
                                            invId: this.options.invId,
                                            action: 'sell',
                                            amount: amount,
                                            price: price,
                                            target: this.options.target,
                                            item: item
                                        }))
                                        this.destroy()
                                    }
                                }
                            })
                            this.destroy()
                        break

                        case 'transfer':
                            let kv = {
                                "ground-inventory": this.groundInvId,
                                "side-inventory": this.sideInvId,
                                "player-inventory": this.playerInvId,
                            }
                            if(mp)mp.trigger("performActionOnItem", JSON.stringify({
                                invId: this.playerInvId,
                                action: 'transfer',
                                item: item,
                                from: kv[data.from],
                                to: kv[data.to]
                            }))
                        break
                    }
                }
            } 
        }
    }
    ui.createGUI(options)
}

function appendItemsHtml(container, arr){
    if(!arr || !arr.length) return
    arr.forEach((item) => {
        let obj = $(`
        <div class="item" draggable="true" oncontextmenu="showItemMenu(event, this)">
            <div class="amount">${item.amount || '???'}</div>
        </div>`)
        obj.attr('id', `item-${item.name}`)
        obj.css({"background-image": `url('img/items/${item.name || 'not-found'}.png')`})
        pushConsole(item.name + '; ' + item.nameDescription + item.amount + item.weight + item.description)
        obj.data({
            name: item.name,
            nameDescription: item.nameDescription,
            amount: item.amount,
            weight: item.weight,
            description: item.description
        })
        console.log(item)

        /*
        
        name: this.name,
        nameDescription: this.nameDescription,
        description: this.description,
        amount: this.amount,
        uniqueId: this.uniqueId || undefined,
        weight: this.weight,
        actions: this.actions || undefined
        */

        obj.draggable({ revert: "invalid", opacity: 0.7, helper: "clone", 
            start: function(){
                $(this).data('from', this.parentNode.id)
            }});
        
        $(container).append(obj)
    })
}

//item actions and info
function showItemMenu(ev, selector){ //called on item right click in inventory
    ev.preventDefault()

    let caller = $(selector).attr('id')

    if(selector.id == 'transferMoney'){
        let menu = $(`<div>Кому передавать?</div>`)
        let useOn = $(`<ul></ul>`)
        if(window.ClosestPlayers.length){
            window.ClosestPlayers.forEach(plr => {
                if(plr[2] <= 2){ useOn.append(`<li onclick="callGuiFunction('#${caller}', 'moneyTransfer', { target: ${plr[0]}})">${plr[1]}</li>`) }
            })
        }else{
            useOn.append(`<li>Рядом нет игроков</li>`)
        }
        menu.append(useOn).css({top: ev.clientY-5, left: ev.clientX-5}).addClass('item-controller').mouseleave(function(){
            $(this).fadeOut(100, function(){
                 $(this).unbind('click');
                $(this).unbind('mouseleave');
                $(this).remove()
                })}).click(function(){
                    $(this).fadeOut(100, function(){
                        $(this).unbind('click');
                        $(this).unbind('mouseleave');
                        $(this).remove()
                        })})
        $('.wrapper').append(menu)
        return
    }
    //getting item object
    let item = $(selector)
    let itemname = $(selector).data('name')

    //generating item info text
    let menu = $(`<div></div>`)
    menu.append(`<b>Предмет:</b> ${$(selector).data('nameDescription') || '???'}<br>`)
    menu.append(`<b>Количество:</b> ${$(selector).data('amount') || '???'}<br>`)
    menu.append(`<b>Вес:</b> ${$(selector).data('weight') || '???'}<br><br>`)
    menu.append(`<b>Описание:</b> ${$(selector).data('description') || '???'}`)

    //adding controls if item is in player inventory
    if(item.closest('#player-inventory').attr('id') == "player-inventory"){
        let buttons = $(`<ul></ul>`)

        //if item provided limited actions, we use them, otherwise we using all
        let actions = item.data('actions')
        if(!actions) actions = ['use', 'drop', 'give', 'sell']

        //looping through actions
        actions.forEach(function(action){
            switch (action){
                case 'use':
                let use = $(`<li onclick="callGuiFunction('#${caller}', 'itemAction', '${itemname}', {action: 'use', target: 'self'})">Использовать</li>`)
                let useOn = $(`<ul></ul>`)
                if(window.ClosestPlayers.length){
                    window.ClosestPlayers.forEach(plr => {
                        if(plr[2] <= 2){ useOn.append(`<li onclick="callGuiFunction('#${caller}', 'itemAction', '${itemname}', {action: 'use', target: ${plr[0]}}); event.stopPropagation();">${plr[1]}</li>`) }
                    })
                }else{
                    useOn.append(`<li>Рядом нет игроков</li>`)
                }
                use.append(useOn)
                buttons.append(use)
                break

                case 'drop':
                buttons.append(`<li onclick="callGuiFunction('#${caller}', 'itemAction', '${itemname}', {action: 'drop'})">Выбросить</li>`)
                break

                case 'give':
                let give = $(`<li>Передать</li>`)
                let giveTo = $(`<ul></ul>`)
                if(window.ClosestPlayers.length){
                    window.ClosestPlayers.forEach(plr => {
                        if(plr[2] <= 2){ giveTo.append(`<li onclick="callGuiFunction('#${caller}', 'itemAction', '${itemname}', {action: 'give', target: ${plr[0]}}); event.stopPropagation();">${plr[1]}</li>`) }
                    })
                }else{
                    giveTo.append(`<li>Рядом нет игроков</li>`)
                }
                give.append(giveTo)
                buttons.append(give)
                break

                case 'sell':
                let sell = $(`<li>Продать</li>`)
                let sellTo = $(`<ul></ul>`)
                if(window.ClosestPlayers.length){
                    window.ClosestPlayers.forEach(plr => {
                        if(plr[2] <= 2){ sellTo.append(`<li onclick="callGuiFunction('#${caller}', 'itemAction', '${itemname}', {action: 'sell', target: ${plr[0]}}); event.stopPropagation();">${plr[1]}</li>`) }
                    })
                }else{
                    sellTo.append(`<li>Рядом нет игроков</li>`)
                }
                sell.append(sellTo)
                buttons.append(sell)
                break
            }
        })
        menu.append(buttons)
    }
    //positioning and actions binding
    menu.css({top: ev.clientY-5, left: ev.clientX-5}).addClass('item-controller').mouseleave(function(){
        $(this).fadeOut(100, function(){
            $(this).unbind('click');
            $(this).unbind('mouseleave');
            $(this).remove() 
        })
        }).click(function(){
            $(this).fadeOut(100, function(){ 
                $(this).unbind('click');
                $(this).unbind('mouseleave');
                $(this).remove() 
            })
        })
    //finally showing controls
    $('.wrapper').append(menu)
}
