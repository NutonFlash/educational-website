export function setupFooter() {
    // let height = $('.footer').outerHeight(true);
    let height = $('.footer').innerHeight();
    if ($('#paymentModalCenter').length === 0) {
        $('html, body').each( function() {
            $(this).css({
                'height':'',
                'overflow': ''
            });
        });
        $('.encurance').css('height', height);
        $('.footer').css({
            'margin-top': -height,
            'height': height,
        });
    } else {
        $('html, body').each( function() {
            $(this).css({
                'height':'100%',
                'overflow': 'hidden'
            });
        });
        $('.footer').css({
            'position': 'absolute',
            'bottom': '0',
            'left': '0'
        });
    }
    $('body').css('padding-top', $('.navbar').innerHeight());
    $('.blurry-block').css('height', $('body').innerHeight() - 0.06*$('body').innerHeight());
}