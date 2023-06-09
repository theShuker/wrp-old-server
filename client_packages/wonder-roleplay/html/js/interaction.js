/*
    {
        target: 'name',
        elements: [
            ['Связать', 'tie'],
            ['Выписать штраф', ticket]
        ]
    }

*/


function createInteractionMenu(options) {
    if (!options || !options.elements.length) return false

    window.interactionMenu = {
        object: $(`<div class="interaction-menu"></div>`),
        target: options.target
    }

    options.elements.forEach(function (element) {
        interactionMenu.object.append(`<div class="interaction-menu-element" data-command="${element[1]}">${element[0]}</div>`)
    }, this);

    interactionMenu.object.children().first().addClass('selected')

    $('.wrapper').append(interactionMenu.object)
    interactionMenu.object.attr('tabindex', -1).focus()
    interactionMenu.object.focusout(()=>{
        destroyInteractionMenu()
    })
}

$('body').bind('mousewheel', function (e) {
    if (window.interactionMenu != undefined && interactionMenu.object.is(`:focus`)) {
        let elements = $(`.interaction-menu .interaction-menu-element`),
            selected = elements.filter('.selected'),
            current

        elements.removeClass('selected')

        if (e.originalEvent.wheelDelta / 120 > 0) {
            if (selected.is(`:first-child`)) current = elements.last()
            else current = selected.prev()
        }
        else {
            if (selected.is(`:last-child`)) current = elements.eq(0)
            else current = selected.next()
        }
        current.addClass(`selected`)
    }

});

$('body').keydown(function (e) {
    let key = e.keyCode
    if (window.interactionMenu != undefined && interactionMenu.object.is(`:focus`)) {
        if (key == 13) {
            destroyInteractionMenu(true)
        }else destroyInteractionMenu()
    }
})

$('body').mousedown(function (e) {
    console.log(`mousedown ${e.which}`);
    if (e.which == 1 && window.interactionMenu != undefined && interactionMenu.object.is(`:focus`)) destroyInteractionMenu(true)
        else destroyInteractionMenu()
})

function destroyInteractionMenu(send = false) {
    if (!window.interactionMenu) return false

    window.interactionMenu.object.off()
    
    console.log(send ? `info sent` : `info not sent`);
    
    if (send) {
        let cmd = $('.interaction-menu .selected').data('command')
        if (mp) mp.trigger('interactionMenuCommand', JSON.stringify({
            target: interactionMenu.target,
            command: cmd
        }))
    } else mp.trigger('interactionMenuCommand', false)



    interactionMenu.object.fadeOut(100, function () {
        $(this).remove()
        delete window.interactionMenu
    })
}

