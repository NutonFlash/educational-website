import {invokeSuccessAnimation} from "./success_animation.js";

export function setupReviewModal() {

    $('#btn-form-review').bind('click', function (event) {
        event.preventDefault();
        if (!isReviewEmpty() && validateReview()) {
            $.ajax({
                type: 'POST',
                url: 'php/sendReview.php',
                data: JSON.stringify({
                    text: $('#review-text').val()
                })
            }).done(function (data) {
                console.log(data);
                let json = JSON.parse(data);
                if (json.responseCode === 0) {
                    $('#reviewModalCenter').modal('hide');
                    invokeSuccessAnimation('Твой отзыв успешно сохранен!', ()=>{}, '18rem');
                }
                if (json.responseCode === 1) {
                    reviewError('К сожалению, база данных сейчас не отвечает. Попробуй войти позднее.');
                }
                if (json.responseCode === 2) {
                    reviewError('Ошибка: напиши отзыв.');
                }
                if (json.responseCode === 3) {
                    reviewError('Ошибка: слишком длинный отзыв.');
                }
            })
        }
    });

    $('#review-text').bind('input', function (event) {
        $('#counter-text').html(event.target.value.length);
        $(this).removeClass('error');
        $('#reviewTextError').html('');
    });

    document.getElementById('reviewModalCenter').addEventListener('shown.bs.modal', () => {
        document.getElementById('review-text').focus();
    });
}

function isReviewEmpty() {
    if (!$('#review-text').val())
        reviewError('Ошибка: напиши отзыв.')
    return $('#review-text').val() === '';
}

function validateReview() {
    if ($('#review-text').val().length > 150) {
        reviewError('Ошибка: слишком длинный отзыв.');
        return false;
    }
    return true;
}

function reviewError(error) {
    $('#review-text').addClass('error');
    $('#reviewTextError').html(error);
}