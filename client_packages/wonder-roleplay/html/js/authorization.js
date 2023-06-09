'use strict';

function authSubmit(form){
	if(form == 'register'){
		let pw1 = $('#register-pw1').val().trim()
		let pw2 = $('#register-pw2').val().trim()
		let email = $('#register-email').val()
		let invite = $('#register-invite').val()
		mp.trigger("authRegister", pw1, pw2, email, invite);
	}
	if(form == 'login'){
		let pw = $('#login-password').val().trim()
		mp.trigger("authLogin", pw);
	}
}

function registerAccount(pw1, pw2, email, invite) {
	pw1 = pw1.trim();
	pw2 = pw2.trim();
	email = email.trim();
	invite = invite.trim();

	if (pw1.length < 5 || pw2.length < 5) return mp.trigger('notify', JSON.stringify({header: `Ошибка`, text: `Длина пароля должна быть не менее 5 символов!`, color: `#f44242`}));
	if (pw1 != pw2) return mp.trigger('notify', JSON.stringify({header: `Ошибка`, text: `Пароли не совпадают`, color: `#f44242`}));
	if (email == '') return mp.trigger('notify', JSON.stringify({header: `Ошибка`, text: `Email не должен быть пустым`, color: `#f44242`}));
	let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	if(!regex.test(email)) return mp.trigger("notify", JSON.stringify({header: 'Ошибка', text: 'Вы указали email в неверном формате. Укажите корректный email!', color: '#f44242'}));
			
	mp.trigger("playerRegister", pw1, pw2, email, invite);
}

function loginAccount(pw) {
	pw = pw.trim();
	mp.trigger("playerLogin", pw);
}

$(document).ready(() => {
    $('#login-password').bind("enterKey",function(e){
        loginAccount($('#login-password').val());
    });

    $('#login-password').keyup(function(e){
        if(e.keyCode == 13)
        {
            $(this).trigger("enterKey");
        }
    });
})
