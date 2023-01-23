import {bindScripts} from "./bind_scripts.js";
import {invokeSuccessAnimation} from "./success_animation.js";

/* SHA256 crypto */
export async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export function setupProfileBtn() {
    setupResetPwdModal();
    addProfileBtnAnimation()
    addDropdownLinkHandlers();
}

function addProfileBtnAnimation() {
    $('#profile-btn').mouseover(function () {
        $('#avatar-svg-path').addClass('active');
        $('#profile-btn').addClass('active');
    });
    $('#profile-btn').mouseout(function () {
        if (!(($('#profile-btn').hasClass('active') && $('#profile-btn').hasClass('show') && $('#avatar-svg-path').hasClass('active')))) {
            $('#profile-btn').removeClass('active');
            $('#avatar-svg-path').removeClass('active');
        }
    });
    $('#profile-btn').bind('click', function () {
        if (!$('#avatar-svg-path').hasClass('active')) $('#avatar-svg-path').addClass('active');
        if (!$('#profile-btn').hasClass('active')) $('#profile-btn').addClass('active');
    })
    $('#profile-btn-avatar').bind('click', function () {
        if (!$('#avatar-svg-path').hasClass('active')) $('#avatar-svg-path').addClass('active');
        if (!$('#profile-btn').hasClass('active')) $('#profile-btn').addClass('active');
    })
    $(document).bind('click', function (event) {
        if (event.target.id !== 'profile-btn' && event.target.id !== 'profile-btn-avatar'
            && event.target.id !== 'avatar-svg-path' && event.target.id !== 'profile-btn-p') {
            $('#profile-btn').removeClass('active');
            $('#avatar-svg-path').removeClass('active');
        }
    });
}

function addDropdownLinkHandlers() {
    $('#exit-link').bind('click', function () {
        $.ajax({
            url: 'php/exitHandler.php',
            type: 'POST',
        }).done(function () {
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
        });

    });

}

function setupResetPwdModal() {
    $('#btn-form-resetPwd').bind('click', function (event) {
        event.preventDefault();
        $('#resetBdError').removeClass('error');
        $('#resetBdError').html('');
        if (validateInput()) {
            sha256($('#resetPassword').val()).then(password => {
                $.ajax({
                    url: 'php/resetHandler.php',
                    data: JSON.stringify({password: password}),
                    type: 'POST'
                }).done(function (data) {
                    let json = JSON.parse(data);
                    if (json.responseCode === 0) {
                        $('#resetModalCenter').modal('hide');
                        invokeSuccessAnimation('Пароль успешно изменен!', ()=>{}, '18rem');
                    }
                    if (json.responseCode === 1)
                        connectToDbError();
                });
            });
        }
    });

    $('#reset-pwd-control').bind('click', function () {
        if ($('#resetPassword').attr('type') === 'password') {
            $(this).addClass('view');
            $('#resetPassword').attr('type', 'text');
        } else {
            $(this).removeClass('view');
            $('#resetPassword').attr('type', 'password');
        }
    });

    $('#resetModalCenter input').bind('input', function () {
        $(this).removeClass('error');
        $('#resetPasswordError').removeClass('error');
        $('#resetPasswordError').html('');
    });

    document.getElementById('resetModalCenter').addEventListener('shown.bs.modal', () => {
        document.getElementById('resetPassword').focus();
    });
}

function validateInput() {
    return !isPwdEmpty() && validatePwd();
}

function isPwdEmpty() {
    let res = $('#resetPassword').val().length > 0;
    if (!res) pwdEmptyError();
    return !res;
}

function validatePwd() {
    let passwordFormat = /[^А-Яа-я]{6,}/;
    let res = $('#resetPassword').val().match(passwordFormat);
    if (!res)
        pwdFormatError();
    else res = true;
    return res;
}

function pwdFormatError() {
    $('#resetPassword').addClass('error');
    $('#resetPasswordError').addClass('error');
    $('#resetPasswordError').html('Ошибка: пароль должен содережать минимум 6 символов и не включать кириллицы.');
}

function pwdEmptyError() {
    $('#resetPassword').addClass('error');
    $('#resetPasswordError').addClass('error');
    $('#resetPasswordError').html('Ошибка: укажи пароль.');
}

function connectToDbError() {
    $('#resetDbError').addClass('error');
    $('#resetDbError').html('К сожалению, база данных сейчас не отвечает. Попробуй поменять пароль позднее.');
}