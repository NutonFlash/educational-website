export function invokeErrorAnimation() {

    new Noty({
        theme: 'sunset',
        type: 'error',
        layout: 'center',
        timeout: 3500,
        closeWith: ['click', 'button'],
        text: 'Для оплаты курса тебе для начала нужно авторизоваться!',
        callbacks: {
            onShow: function () {
                $('#noty_layout__center').css('width', '22rem');
                $('.noty_theme__sunset.noty_bar .noty_body').css('font-size', '1rem');
            }
        }
    }).show();
}