function showMoney(value){
    if(value) return $('.money').fadeIn(500);
    $('.money').fadeOut(500);
}

function updateMoney(value, noAnim){
    window.money = value
    let counter = $('.money #moneyamount');
    let currentValue = counter.text();

    if(value == currentValue) return;
    if(noAnim) return counter.text(value);
    
    if(value > currentValue){
        counter.text(value);
        $('.wrapper').append(
            $(`<div class="money money-update">+${value-currentValue}</div>`).css({
                position: "fixed",
                top: counter.offset().top,
                left: counter.offset().left,
                "text-align": "left"
            }).animate({
                opacity: 0.0,
                top: "+=50"
            }, 1000, function() {this.remove()})
        );
    }else{
        $('.wrapper').append(
            $(`<div class="money money-update">-${currentValue-value}</div>`).css({
                position: "fixed",
                top: counter.offset().top,
                left: counter.offset().left,
                "text-align": "left",
                "color": "#f44242"
            }).animate({
                opacity: 0.0,
                top: "+=50"
            }, 1000, function() {this.remove()})
        );
        counter.text(value);
    }
}