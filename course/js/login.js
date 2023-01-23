import {sha256} from './auth_utilities.js';
import {bindScripts} from "./bind_scripts.js";
import {invokeSuccessAnimation} from "./success_animation.js";

export function setupLoginModal() {

    $('#login-pwd-control').bind('click', function () {
        if ($('#loginPassword').attr('type') === 'password') {
            $(this).addClass('view');
            $('#loginPassword').attr('type', 'text');
        } else {
            $(this).removeClass('view');
            $('#loginPassword').attr('type', 'password');
        }
    });

    $('#btn-form-login').bind('click', function (event) {
        event.preventDefault();
        if (validateInput()) {
            sha256($('#loginPassword').val()).then(password => {
                $.ajax({
                    url: 'php/loginHandler.php',
                    data: JSON.stringify({
                        email: $('#loginEmail').val(),
                        password: password
                    }),
                    type: 'POST'
                }).done(function (data) {
                    let json = JSON.parse(data);
                    if (json.responseCode === 0) {
                        $('#loginModalCenter').modal('hide');
                        $('#loginModalCenter').bind('hidden.bs.modal', function () {
                            let functionExec = ()=> {
                                let path = document.location.hash.replace('#', '');
                                if (path === '')
                                    path = 'module1';
                                $.ajax({
                                    url: 'php/requestHandler.php?' + path,
                                    type: 'GET'
                                }).done(function (data) {
                                    document.body.innerHTML = data;
                                    bindScripts();
                                });
                            }
                            invokeSuccessAnimation('Успешный вход в аккаунт!', functionExec, '18rem');
                        });
                    }
                    if (json.responseCode === 1)
                        connectToDbError();
                    if (json.responseCode === 2)
                        loginError();
                });
            });
        }
    });

    $('#loginModalCenter input').bind('input', function () {
        $(this).removeClass('error');
        if ($(this).attr('id') === 'loginEmail') {
            $('#loginEmailError').html('');
        } else if ($(this).attr('id') === 'loginPassword') {
            $('#loginPasswordError').html('');
        }
        $('#loginDbError').html('');
    });

    function validateInput() {
        return !isEmailEmpty() & !isPwdEmpty();
    }

    function isEmailEmpty() {
        let res = $('#loginEmail').val().length > 0;
        if (!res) emailEmptyError();
        return !res;
    }

    function isPwdEmpty() {
        let res = $('#loginPassword').val().length > 0;
        if (!res) pwdEmptyError();
        return !res;
    }

    function emailEmptyError() {
        $('#loginEmail').addClass('error');
        $('#loginEmailError').html('Ошибка: укажи электронную почту или логин.');

    }

    function pwdEmptyError() {
        $('#loginPassword').addClass('error');
        $('#loginPasswordError').html('Ошибка: укажи пароль.');
    }

    function connectToDbError() {
        $('#loginDbError').html('К сожалению, база данных сейчас не отвечает. Попробуй войти позднее.');
    }

    function loginError() {
        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let res = $('#loginEmail').val().match(mailFormat);
        if (!res)
            $('#loginDbError').html('Ошибка: неверный логин или пароль. Если не получается войти в систему, нажми на ссылку «Забыл пароль».');
        else $('#loginDbError').html('Ошибка: неверный e-mail или пароль. Если не получается войти в систему, нажми на ссылку «Забыл пароль».');
    }
}