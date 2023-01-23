    import {invokeErrorAnimation} from "./error_animation.js";

    export function setupPaymentBtn() {

        $('#payment-modal-btn').bind('click', function () {
            let cookies = document.cookie.split('; ');
            let isAuth;
            for (let i=0; i<cookies.length; i++) {
                let keyValue = cookies[i].split('=');
                if (keyValue[0] === 'isAuth')
                    isAuth = keyValue[1];
            }
            if (isAuth !== 'true') {
                invokeErrorAnimation();
            } else {
                $('#paymentModalCenter').modal('show');
            }
        });

        $('#buy-course').bind('click', function (event) {
            event.preventDefault();
            let reference_code = null;
            if ($('#check-reference-btn').attr('disabled'))
                reference_code = $('#reference-code').val();
            if (validateInput()) {
                $.ajax({
                    type: 'POST',
                    url: 'php/makeInvoice.php',
                    data: JSON.stringify({
                        reference_code: reference_code,
                        name: $('#name-property').val(),
                        email: $('#email-property').val()
                    })
                }).done(function (data) {
                    let json = JSON.parse(data);
                    if (json.responseCode === 0) {
                        window.location = json.payUrl + encodeURI('&successUrl=https://fansly-course.ru');
                    }
                    if (json.responseCode === 1) {
                        varyError('К сожалению, база данных сейчас не отвечает. Попробуй оплатить курс позднее.');
                    }
                    if (json.responseCode === 2) {
                        varyError('К сожалению, QIWI API сейчас не отвечает. Попробуй оплатить курс позднее.');
                    }
                    if (json.responseCode === 3) {
                        varyError('Ошибка: укажи имя и email.')
                    }
                    if (json.responseCode === 4) {
                        referenceFormatError();
                    }
                    if (json.responseCode === 5) {
                        nameFormatError();
                    }
                    if (json.responseCode === 6) {
                        emailFormatError();
                    }
                    if (json.responseCode === 7) {
                        wrongEmailError();
                    }
                    if (json.responseCode === 8) {
                        wrongReferenceError();
                    }
                });
            }
        });

        $('#check-reference-btn').bind('click', function (event) {
            event.preventDefault();
            if (!isReferenceEmpty() && validateReference()) {
                $.ajax({
                    type: 'POST',
                    url: 'php/checkReference.php',
                    data: JSON.stringify({
                        reference_code: $('#reference-code').val()
                    }),
                }).done(function (data) {
                    let json = JSON.parse(data);
                    if (json.responseCode === 0) {
                        successReference(json.discount);
                    }
                    if (json.responseCode === 1) {
                        varyError('К сожалению, база данных сейчас не отвечает. Попробуйте оплатить курс позднее.');
                    }
                    if (json.responseCode === 2) {
                        wrongReferenceError();
                    }
                });
            }
        });

        $('#paymentModalCenter input').bind('input', function () {
            if ($(this).attr('id') === 'reference-code') {
                $(this).removeClass('error');
                $('#referenceError').html('');
            } else {
                $(this).removeClass('error');
                $(this).next().html('');
                $('#reference-code').removeClass('error');
                $('#referenceError').html('');
            }
            $('#paymentDbError').html('');
        });

        document.getElementById('paymentModalCenter').addEventListener('shown.bs.modal', () => {
            document.getElementById('reference-code').focus();
        });
    }

    function validateInput() {
        return (!isNameEmpty() & !isEmailEmpty()) && (validateName() & validateEmail());
    }

    function validateName() {
        let res = $('#name-property').val().match('([A-Za-zА-яа-я]+\s?){1,3}');
        if (!res)
            nameFormatError();

        else res = true;
        return res;
    }

    function validateEmail() {
        let mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let res = $('#email-property').val().match(mailFormat);
        if (!res)
            emailFormatError();
        else res = true;
        return res;
    }

    function validateReference() {
        let reg = /\d{6}/;
        let res = false;
        if ($('#reference-code').val().match(reg))
            res = $('#reference-code').val().match(reg)[0] === $('#reference-code').val();
        if (!res)
            referenceFormatError();
        else res = true;
        return res;

    }

    function isNameEmpty() {
        let res = $('#name-property').val() === '';
        if (res) {
            nameEmptyError();
        }
        return res;
    }

    function isEmailEmpty() {
        let res = $('#email-property').val() === '';
        if (res)
            emailEmptyError();
        return res;
    }

    function isReferenceEmpty() {
        let res = $('#reference-code').val() === '';
        if (res)
            referenceEmptyError();
        return res;
    }

    function nameEmptyError() {
        $('#name-property').addClass('error');
        $('#namePropertyError').html('Ошибка: укажи свое имя.');
    }

    function emailEmptyError() {
        $('#email-property').addClass('error');
        $('#emailPropertyError').html('Ошибка: укажи электронную почту.');
    }

    function referenceEmptyError() {
        $('#reference-code').addClass('error');
        $('#referenceError').html('Ошибка: укажи промокод.');
    }

    function nameFormatError() {
        $('#name-property').addClass('error');
        $('#namePropertyError').html('Ошибка: укажи свое настоящее имя.');
    }

    function emailFormatError() {
        $('#email-property').addClass('error');
        $('#emailPropertyError').html('Ошибка: укажи свою настоящую электронную почту.');
    }

    function referenceFormatError() {
        $('#reference-code').addClass('error');
        $('#referenceError').html('Ошибка: промокод состоит из 6 цифр.');
    }

    function varyError(text) {
        $('#paymentDbError').html(text);
    }

    function wrongReferenceError() {
        $('#reference-code').addClass('error');
        $('#referenceError').html('Ошибка: промокод не найден.');
    }

    function wrongEmailError() {
        $('#email-property').addClass('error');
        $('#emailPropertyError').html('Ошибка: аккаунт с таким email не зарегистрирован.');
    }

    function successReference(discount) {
        $('#referenceError').html('Промокод применен!');
        $('#referenceError').css({
            'font-size': '1.1rem',
            'color': '#3ede6b'
        });
        $('#reference-code').prop('disabled', 'true');
        $('#check-reference-btn').prop('disabled', 'true');
        $('#discount').html('Скидка: <b>' + discount + '&#8381;</b>');
        let reg = /\d+/g;
        let costHtml = $('#cost').html();
        let totalCost = parseFloat(costHtml.match(reg)[0]) - parseFloat(discount);
        $('#total-cost').html('Итого: <b>' + totalCost + '&#8381;</b>');
    }