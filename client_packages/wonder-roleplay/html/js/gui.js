

class GUIPool {
    constructor(){
        this.pool = []
        this.classes = ['Test', 'housePurchase', 'vehicleShop']
    }

    createGUI(options) {
        if(beforeGuiCreated) beforeGuiCreated()
        let gui = new GUI(options)
        if (gui) {
            mp.invoke("focus", true);
            this.assingId(gui)
            this.pool.push(gui)

            afterGuiCreated()
            return gui
        }
        return false

    }

    assingId(gui){
        gui.windowObject.data('id', Math.floor(Math.random()*9999999))
    }

    exists(type){
        let exists = false
        let onlyOne = undefined
        this.pool.some(gui => {
            if(gui.type == type){
                exists = true
                if(gui.onlyOne){
                    onlyOne = true
                }
                return true
            }
        })
        return [exists, onlyOne]
    }

    getClassInstanceByType(type){
        if(this.classes.indexOf(type) != -1){
            
        }
        return false
    }

    getNewId(){
        return this.length
    }

    destroy(obj){
        this.pool.forEach((inst, i, arr) => {
            if(inst == obj){
                inst.windowObject.fadeOut(250, function() {
                    $( this ).remove()
                    if(afterGuiDestroy) afterGuiDestroy()
                })
                this.pool.splice(i, 1)
                return true
            }
        })
    }

    getById(id){
        let ret = false
        this.pool.some(inst => {
            if(inst.windowObject.data('id') == id){
                ret = inst
                return true
            }
        })
        return ret
    }

    getByJqObject(obj){
        let ret = false
        this.pool.some(inst => {
            if(inst.windowObject.is(obj)){
                ret = inst
                return true
            }
        })
        return ret
    }

    get length(){
        return this.pool.length
    }

    send(data){
        if(typeof(data) != 'string') data = JSON.stringify(data)
        if(mp)mp.trigger('guiResponse', data)
    }
}
window.ui = new GUIPool()

class GUI{
    constructor(options){
        this.options = options //JSON.parse(options)
        
        this.create()
    }

    create(){
        this.createWindow(this.options.title || 'no title', true)
        this.parseContent(this.options.elements)
        this.beforeWindowAppend()
        this.windowObject.css({ position: 'absolute' })
        $('.wrapper').append(this.windowObject)
        this.windowObject.draggable({ handle: ".header", containment: "body", stack: ".ui-object" });
        this.windowObject.position({
            my: "center",
            at: "center",
            of: "body"
        })

        this.afterWindowAppend()
    }

    destroy(){
        if(this.options.onDestroy){
            this.options.onDestroy()
        }
        ui.destroy(this)
    }

    afterWindowAppend(){
        if(mp) mp.invoke("focus", true)
        if(this.options.afterWindowAppend) this.options.afterWindowAppend.bind(this)()
    }

    beforeWindowAppend(){
        if(this.options.beforeWindowAppend) this.options.beforeWindowAppend.bind(this)()
    }

//creating content container
    createWindow(){
        if(this.windowObject) return;
        this.elementCount = 0
        this.windowObject = $(this.getWindowTemplate()) 
        this.windowObject.css({
            "min-width": this.options.width || '',
            "min-height": this.options.height || ''
        })
        return this.windowObject
    }

    getWindowTemplate(){
        if(!this.template){
            return `
            <div class="ui-object">
                <div class="header">
                <span id="title">${this.options.title || '&nbsp;'}</span>
                <div class="header-controls">${this.options.close == false ? '' : this.getCloseButton()}</div>
                </div>
                <div class="container"></div>
            </div>
            `
        }
    }

    getCloseButton(action){
        return `
        <button class="control close" onclick="closeGuiWindow(this)">
            <i class="fa fa-close"></i>
        </button>
        `
    }

//content parse
    parseContent(elemArray){
        let HTML = ``;
        if(!elemArray || !elemArray.length) return false;

        elemArray.forEach(function(row) {
            let ROW_HTML = `<div class="row">`
            if(!row || !row.length) return ''
            
            row.forEach(elem => {
                ROW_HTML += this.parseElement(elem)
            })

            ROW_HTML += `</div>`
            HTML += ROW_HTML
        }, this);

        let content = $(HTML).hide() //converting html string to jq object
        this.windowObject.find('.container').append(content)
        content.fadeIn(250)
    }

    parseElement(elemObject, noBlockWrap){
        
        let elem = elemObject,
            temp, value, width, src, HTML

        width = elem.width || 12
        value = elem.value || 'undefined'

        HTML = noBlockWrap ? '' : `<div class="block s-${width}">`

        switch(elem.type){
            case 'text':
                 HTML += `<div id="${elem.id ? elem.id : 'elem-'+this.elementCount}" data-id="${this.elementCount}">${value}</div>`
            break
            case 'image':
                 HTML += `<img id="${elem.id ? elem.id : 'elem-'+this.elementCount} " data-id="${this.elementCount}" src="img/gui/${elem.src || 'no-src.jpg'}">`
            break
            case 'button':
                 HTML += `<button id="${elem.id ? elem.id : 'elem-'+this.elementCount}" data-id="${this.elementCount}"${elem.color ? ` class="${elem.color}"` : ''}${elem.action ? ` onclick="${elem.action}"` : ''} ${elem.disabled ? 'disabled': ''}>${elem.icon ? `<i class="fa fa-${elem.icon}"></i>` : ''}${value}</button>`
            break
            case 'spacer':
                 HTML += `<hr>`
            break
            case 'dropdown':
                HTML += `<select id="${elem.id ? elem.id : ''}" onchange="${elem.onchange ? elem.onchange : ''}">`

                elem.values.forEach(pair => {
                    if(typeof(pair) == 'object'){
                        HTML += `<option value="${pair[0]}">${pair[1]}</option>`
                    }else if(typeof(pair) == 'string'){
                        HTML += `<option value="${pair}">${pair}</option>`
                    }
                })

                HTML += `</select>`
            break
            case 'listselect':
                HTML += `<select size="${elem.size ? elem.size : 5}" id="${elem.id ? elem.id : ''}" onchange="${elem.onchange ? elem.onchange : ''}">`

                elem.values.forEach(pair => {
                    if(typeof(pair) == 'object'){
                        HTML += `<option value="${pair[0]}">${pair[1]}</option>`
                    }else if(typeof(pair) == 'string'){
                        HTML += `<option value="${pair}">${pair}</option>`
                    }
                    
                })

                HTML += `</select>`
            break
            case 'column':
                elem.elements.forEach(elem => {
                    HTML += this.parseElement(elem, true)
                })
            break

            case 'input-number':
                HTML += `<input ${elem.id ? `id="${elem.id}"` : ''} type="number" ${elem.value ? `value="${elem.value}"` : ''} ${elem.min ? `min="${elem.min}"` : ''} ${elem.max ? `max="${elem.max}"` : ''} ${elem.placeholder ? `placeholder="${elem.placeholder}"` : ''}>`
            break

            case 'input':
                HTML += `<input ${elem.id ? `id="${elem.id}"` : ''} type="text" ${elem.placeholder ? `placeholder="${elem.placeholder}"` : ''} ${elem.value ? `value="${elem.value}"` : ''}>`
            break
        }

        HTML += noBlockWrap ? '' : `</div>`

        this.elementCount++
        return HTML
    }

//communication
    findElementById(id){
        return this.windowObject.find('.container #'+id)
    }

    callFunction(caller, funcname, ...params){
        if(this.options.functions && this.options.functions[funcname]){
            return this.options.functions[funcname].bind(this)(caller, ...params)
        }else{
            console.log(`Function '${funcname}' not found in GUI instance`)
        }
    }
}

window.closeGuiWindow = function(caller){
    ui.getByJqObject($(caller).closest('.ui-object')).destroy()
}

window.callGuiFunction = function (caller, funcname, ...params){
    let gui = ui.getById($(caller).closest('.ui-object').data('id'))
    if (gui) {
        gui.callFunction($(caller), funcname, ...params)
        return true
    }else{
        return false
    }
}


window.createInventoryWindow = function(options){
    if(typeof(options) == 'string') options = JSON.parse(options)
}

window.guiProcess = (options) => {
    if(typeof(options) == 'string') options = JSON.parse(options)

    if(options.type == 'houseForSale'){
        options.title = 'Дом продаётся!',
        options.elements = [
            [
                {type: 'image', src: 'houseforsale.jpg'},
                {type: 'text', value: '<h1>Дом продаётся!</h1>'},
                {type: 'spacer', width: 12},
                {
                    type: 'text', width: 6, 
                    value: `
                    <b>Номер дома:</b> ${options.houseid}<br>
                    <b>Стоимость:</b> ${options.price}$<br>
                    <b>Необходимый уровень:</b> ${options.level}<br>`
                },
                {type: 'text', value: 'Этот дом продаётся, вы можете его осмотреть и купить, если захотите.', width: 6},
                
            ],
            [
                {type: 'button', width: 4, value: 'Посмотреть', icon: 'eye', action: `callGuiFunction(this, 'inspectHouse')`},
                {type: 'button', width: 4, value: 'Купить', color: 'green', icon: 'dollar', action: `callGuiFunction(this, 'buyHouse')`},
                {type: 'button', width: 4, value: 'Отмена', color: 'red', icon: 'cross', action: 'closeGuiWindow(this)'}
            ]
        ]

        options.functions = {
            "inspectHouse": function(){
                return this.findElementById('elem-3').remove()
                ui.send({
                    gui: 'houseForSale',
                    action: 'inspect',
                    houseid: this.options.houseid
                })
                this.destroy()
            },
            "buyHouse": function(){
                ui.createGUI({
                    title: 'Вы уверены?',
                    houseid: this.options.houseid,
                    elements: [
                        [
                            {type:'text',value:`Вы уверены что хотите купить этот дом за ${this.options.price}$?`}
                        ],
                        [
                            {type: 'button', color: 'green', icon:'dollar', value: 'Да', action: `callGuiFunction(this, 'yes')`, width: 6},
                            {type: 'button', color: 'red', icon:'cross', value: 'Нет', action: `closeGuiWindow(this)`, width: 6}
                        ]
                    ],
                    functions: {
                        "yes": function(){
                            ui.send({
                                gui: 'houseForSale',
                                action: 'buy',
                                houseid: this.options.houseid
                            })
                            this.destroy()
                        }
                    }
                })
                
                this.destroy()
            }
        }

    }

    if(options.type == 'vehicleShop'){
        options.width = 600

        options.vehicleList = []
        options.vehicles.forEach(veh => {
            options.vehicleList.push(veh.model)
        })

        options.onDestroy = function(){
            mp.trigger("removeShop")
        }

        options.elements = [
            [
                { type: 'text', value: `<h1>${options.title}</h1>` },
                { type: 'spacer' }
            ],
            [
                {
                    type: 'column',
                    width: 6,
                    elements: [
                        {type: 'text', value: `<p id="vehInfo">Сначала выберите авто из списка</p>`}
                    ]
                },
                {
                    type: 'column',
                    width: 6,
                    elements: [
                        { type: 'listselect', values: options.vehicleList, size: 5, id: 'selectlist', onchange: `callGuiFunction(this, 'vehicleSelect', this.value)` }
                    ]
                }
            ],
            [
                {type: 'button', value: 'Тест-Драйв', icon: 'car', width: 4, action: `callGuiFunction(this, 'vehicleTestDrive')`}
            ]
        ]

        options.functions = {
            "vehicleSelect": function(caller, value) {
                let info = this.findElementById('vehInfo')
                info.html('')

                let veh = false
                this.options.vehicles.some(v => {
                    if(v.model == value){
                        veh = v
                        return true
                    }
                })
                if(!veh) return false

                this.currentVehicle = veh
                mp.trigger("vehicleShopUpdateVehicle", this.options.vehiclesClass, this.currentVehicle.model)

                info.html(`
                <b>Модель: </b>${veh.name || veh.model}<br>
                <b>Стоимость: </b>${veh.price}$<br>
                <b>Доступно с уровня: </b>${veh.level}$<br>
                <b>Только для Premium: </b>${veh.isPremium ? 'да':'нет'}<br>
                ${veh.remaining == false ? '' : '<b>Ограниченное количество! Осталось: '+ veh.remaining}
                `)
                if(mp)mp.trigger('vehicleShopChangeModel', value)
            },
            "vehicleTestDrive": function(){
                if(!this.currentVehicle) this.findElementById('vehInfo').html('<b style="color: red">Сначала выберите ТС из списка!</b>')
                
                ui.createGUI({
                    title: 'Вы уверены?',
                    model: this.currentVehicle.model,
                    shopid: this.options.shopid,
                    onDestroy: function(){
                        mp.trigger("removeShop")
                    },
                    elements: [
                        [
                            {type:'text',value:`Вы уверены что хотите начать тест-драйв '${this.options.model}'?`}
                        ],
                        [
                            {type: 'button', color: 'green', icon:'dollar', value: 'Да', action: `callGuiFunction(this, 'yes')`, width: 6},
                            {type: 'button', color: 'red', icon:'cross', value: 'Нет', action: `closeGuiWindow(this)`, width: 6}
                        ]
                    ],
                    functions: {
                        "yes": function(){
                            ui.send({
                                gui: 'vehicleShop',
                                action: 'testdrive',
                                shopid: this.options.shopid,
                                model: this.options.model
                            })
                            this.destroy()
                        }
                    }
                })
                this.destroy()
            },
            "vehicleBuy": function(){
                if(!this.currentVehicle) this.findElementById('vehInfo').html('<b style="color: red">Сначала выберите ТС из списка!</b>')
                
                ui.createGUI({
                    title: 'Вы уверены?',
                    model: this.currentVehicle.model,
                    shopid: this.options.shopid,
                    onDestroy: function(){
                        mp.trigger("removeShop")
                    },
                    elements: [
                        [
                            {type:'text',value:`Вы уверены что хотите купить '${this.options.model}'?`}
                        ],
                        [
                            {type: 'button', color: 'green', icon:'dollar', value: 'Да', action: `callGuiFunction(this, 'yes')`, width: 6},
                            {type: 'button', color: 'red', icon:'cross', value: 'Нет', action: `closeGuiWindow(this)`, width: 6}
                        ]
                    ],
                    functions: {
                        "yes": function(){
                            ui.send({
                                gui: 'vehicleShop',
                                action: 'buy',
                                model: this.options.model,
                                shopid: this.options.shopid
                            })
                            this.destroy()
                        }
                    }
                })
                this.destroy()
            }
        }
        mp.trigger("initShopByClass", options.vehiclesClass)
    }

    if(options.type == 'confirmation'){
        
        options.elements = [

            [
                {
                    type: 'text',
                    value: options.text
                }
            ],
            [
                {type: 'button', value: 'Принять', icon: 'tick', width: 6, action: `callGuiFunction(this, 'response', true)`},
                {type: 'button', value: 'Отклонить', icon: 'cross', width: 6, action: `callGuiFunction(this, 'response', false)`}
            ]
        ]

        options.functions = {
            "response": function(caller, answer){
                mp.trigger("confirmationResponse", JSON.stringify({
                    id: this.options.id,
                    response: answer
                }))
                this.destroy()
            }
        }
    }
    ui.createGUI(options)
}



function beforeGuiCreated(){
    if (mp) {mp.trigger("guiDisableControls", true)}

    pushConsole(`ui:pool:beforeCreated: ${ui.length}`)
}
function afterGuiCreated(){
    pushConsole(`ui:pool:afterCreated: ${ui.length}`)
}
function afterGuiDestroy(){
    if(!ui.length){
        if(mp)mp.trigger("guiDisableControls", false)
        mp.invoke("focus", false);
        }

    pushConsole(`ui:pool:afterDestroy: ${ui.length}`)
}





/*

    INTERACTION MENU

*/
$('.wrapper').append(`<div class="interacion-menu-possible">Взаимодействие <kbd>E</kbd></div>`)

setInterval(function(){

}, 100)