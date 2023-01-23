export function invokeSuccessAnimation(title, functionExec, width) {
    new Noty({
        theme: 'sunset',
        type: 'success',
        layout: 'center',
        timeout: 1500,
        closeWith: ['click', 'button'],
        callbacks: {
            onShow: function () {
                $('#noty_layout__center').css('width', width);
            },
            afterClose: functionExec
        },
        text: title
    }).show();
}