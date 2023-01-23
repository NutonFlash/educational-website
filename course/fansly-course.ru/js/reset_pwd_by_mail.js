import {invokeSuccessAnimation} from "./success_animation.js";
import {sha256} from "./auth_utilities.js";

export function setupResetPwdByMailModal() {
    $('#btn-form-resetPwdByMail').bind('click', function (event) {
        event.preventDefault();
        let newPwd = makePwd(20);
        if (!isEmailEmpty()) {
            sha256(newPwd).then(passwordHash => {
                $.ajax({
                    type: 'POST',
                    url: 'php/sendNewPwd.php',
                    data: JSON.stringify({
                        email: $('#loginOrEmailForReset').val(),
                        password: newPwd,
                        password_hash: passwordHash
                    })
                }).done(function (data) {
                    let json = JSON.parse(data);
                    if (json.responseCode === 0) {
                        $('#resetPwdByMailModalCenter').modal('hide');
                        $('#loginModalCenter').modal('show');
                        invokeSuccessAnimation('Новый пароль отправлен на почту!', () => {}, '18rem');
                    }
                    if (json.responseCode === 1)
                        resetPwdByMailError('К сожалению, база данных сейчас не отвечает. Попробуй поменять пароль позднее.');
                    if (json.responseCode === 2){
                        resetPwdByMailError('Ошибка: укажи электронную почту или логин.');
                    }
                    if (json.responseCode === 3){
                        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        let res = $('#loginOrEmailForReset').val().match(mailFormat);
                        if (!res)
                            resetPwdByMailError('Ошибка: аккаунт с таким логином не найден.');
                        else resetPwdByMailError('Ошибка: аккаунт с таким e-mail не найден.');
                    }
                });
            });
        }
    });

    $('#loginOrEmailForReset').bind('input', function (){
        $(this).removeClass('error');
        $('#resetPwdByMailError').html('');
    });
}

function isEmailEmpty() {
    let res;
    if ($('#loginOrEmailForReset').val())
        res = true;
    else resetPwdByMailError('Ошибка: укажи электронную почту или логин.');
    return !res;
 }

 function resetPwdByMailError(error) {
     $('#loginOrEmailForReset').addClass('error');
     $('#resetPwdByMailError').html(error);
 }

function makePwd(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}