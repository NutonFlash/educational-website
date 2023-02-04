import {sha256} from "./auth_utilities.js";
import {bindScripts} from "./bind_scripts.js";
import {invokeSuccessAnimation} from "./success_animation.js";
import {isHashOk} from "./XSS_protection.js";

export function setupRegisterModal() {

    $('#btn-form-register').bind('click', function (event) {
        event.preventDefault();
        $('#registerBdError').removeClass('error');
        $('#registerBdError').html('');
        if (validateInput()) {
            let login = $('#registerLogin').val();
            let email = $('#registerEmail').val();
            sha256($('#registerPassword').val()).then(password => {
                $.ajax({
                    url: 'php/registerHandler.php',
                    data: JSON.stringify({
                        login: login,
                        email: email,
                        password: password
                    }),
                    type: 'POST'
                }).done(function (data) {
                    let json = JSON.parse(data);
                    if (json.responseCode === 0) {
                        let functionExec = function () {
                            let path = document.location.hash.replace('#', '');
                            if (path === '')
                                path = 'module1';
                            if (!isHashOk(path)) {
                                alert('XSS alert');
                                return;
                            }
                            $.ajax({
                                url: 'php/requestHandler.php?' + path,
                                type: 'GET'
                            }).done(function (data) {
                                document.body.innerHTML = DOMPurify.sanitize(data);
                                bindScripts();
                            });
                        }
                        $('#registerModalCenter').modal('hide');
                        invokeSuccessAnimation('Ты успешно зарегистрировался!', functionExec, '18rem');
                    }
                    if (json.responseCode === 1)
                        connectToDbError();
                    if (json.responseCode === 2)
                        duplicateLoginError();
                    if (json.responseCode === 3)
                        duplicateEmailError();
                });
            });
        }
    });

    $('#registerModalCenter input').bind('input', function () {
        $(this).removeClass('error');
        if ($(this).attr('id') === 'registerLogin') {
            $('#registerLoginError').html('');
        } else if ($(this).attr('id') === 'registerEmail') {
            $('#registerEmailError').html('');
        } else if ($(this).attr('id') === 'registerPassword') {
            $('#registerPasswordError').html('');
        }
        $('#registerDbError').html('');
    });

    $('#register-pwd-control').bind('click', function () {
        if ($('#registerPassword').attr('type') === 'password') {
            $(this).addClass('view');
            $('#registerPassword').attr('type', 'text');
        } else {
            $(this).removeClass('view');
            $('#registerPassword').attr('type', 'password');
        }
    });

    function validateInput() {
        return validateInputOnEmpty() && validateInputOnFormat();
    }

    function validateInputOnEmpty() {
        return !isLogEmpty() & !isEmailEmpty() & !isPwdEmpty();
    }

    function validateInputOnFormat() {
        return validateEmail() & validatePwd();
    }

    function isLogEmpty() {
        let res = $('#registerLogin').val().length > 0;
        if (!res) logEmptyError();
        return !res;
    }

    function isEmailEmpty() {
        let res = $('#registerEmail').val().length > 0;
        if (!res) emailEmptyError();
        return !res;
    }

    function isPwdEmpty() {
        let res = $('#registerPassword').val().length > 0;
        if (!res) pwdEmptyError();
        return !res;
    }

    function validatePwd() {
        let passwordFormat = /[^А-Яа-я]{6,}/;
        let res = $('#registerPassword').val().match(passwordFormat);
        if (!res)
            pwdFormatError();
        else res = true;
        return res;
    }

    function validateEmail() {
        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let res = $('#registerEmail').val().match(mailFormat);
        if (!res)
            emailFromatError();
        else res = true;
        return res;
    }

    function pwdFormatError() {
        $('#registerPassword').addClass('error');
        $('#registerPasswordError').html('Ошибка: пароль должен содережать минимум 6 символов и не включать кириллицы.');
    }

    function emailFromatError() {
        $('#registerEmail').addClass('error');
        $('#registerEmailError').html('Ошибка: указан неверный адрес электронной почты.');
    }

    function duplicateLoginError() {
        $('#registerLogin').addClass('error');
        $('#registerLoginError').html('Ошибка: этот логин уже занят, придумай другой.');
    }

    function duplicateEmailError() {
        $('#registerEmail').addClass('error');
        $('#registerEmailError').html('Ошибка: этой адрес электронный почты уже зарегистрирован.');
    }

    function logEmptyError() {
        $('#registerLogin').addClass('error');
        $('#registerLoginError').html('Ошибка: укажи логин.');
    }

    function emailEmptyError() {
        $('#registerEmail').addClass('error');
        $('#registerEmailError').html('Ошибка: укажи электронную почту.');
    }

    function pwdEmptyError() {
        $('#registerPassword').addClass('error');
        $('#registerPasswordError').html('Ошибка: укажи пароль.');
    }

    function connectToDbError() {
        $('#registerDbError').html('К сожалению, база данных сейчас не отвечает. Попробуй зарегистрироваться позднее.');
    }
}