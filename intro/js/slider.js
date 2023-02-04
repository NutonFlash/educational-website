$(document).ready(function () {
    document.getElementsByClassName('onlyfans')[0].addEventListener('animationend', function () {
        init_review_nav();
        let owl = $(".owl-carousel");
        owl.bind('resize.owl.carousel', function () {
            owl.trigger('destroy.owl.carousel');
            init_review_nav();
        });
    });
});

function init_review_nav() {

    //set nav-data
    let windowWidth = $('body').innerWidth();
    let position = 1;
    let items;

    if (windowWidth >= 1200)
        items = 3;
    else
        items = 1;


    // init owl carousel
    let owl = $(".owl-carousel");
    owl.owlCarousel({
        responsiveClass: true,
        mouseDrag: true,
        touchDrag: true,
        dots: false,
        stagePadding: 15,
        responsiveBaseElement: $('body'),
        smartSpeed: 500,
        responsive: {
            0: {
                margin: 10
            },
            1200: {
                margin: 25
            }
        },
        items: items,
        slideBy: items,
        onDrag: dragStart,
        onDragged: dragEnd
    });

    let review_number = Math.ceil($('.review-shell').length / items);
    let nav_data = $('.nav-data');
    nav_data.html(position + ' из ' + review_number);

    let startIndex;

    function dragStart(event) {
        startIndex = event.item.index;
    }

    function dragEnd(event) {
        let lastIndex = event.item.index;
        if (lastIndex > startIndex) {
            position++;
            owl.trigger('to.owl.carousel', [startIndex + items])
        } else if (lastIndex < startIndex) {
            position--;
            owl.trigger('to.owl.carousel', [startIndex - items])
        }
        nav_data.html(position + ' из ' + review_number);
    }

    // Bind prev and next buttons

    function click_next() {
        let cur_index_next = (position-1)*items;
        this.animate(key_frame_next, key_frame_common);
        if (position < review_number) {
            owl.trigger('to.owl.carousel', cur_index_next + items);
            position++;
        } else {
            owl.trigger('to.owl.carousel', [0]);
            position = 1;
        }
        nav_data.html(position + ' из ' + review_number);
    }

    function click_prev() {
        let cur_index_prev = (position-1)*items;
        this.animate(key_frame_prev, key_frame_common);
        if (position > 1) {
            owl.trigger('to.owl.carousel', cur_index_prev - items);
            position--;
        } else {
            owl.trigger('to.owl.carousel', [review_number + 1]);
            position = review_number;
        }
        nav_data.html(position + ' из ' + review_number);
    }

    let prev_btn = document.querySelector('.prev');
    let next_btn = document.querySelector('.next');

    let key_frame_prev = [
        {transform: 'translateX(0)', easing: 'ease-in-out'},
        {transform: 'translateX(-.75rem)', easing: 'ease-in-out'}
    ];
    let key_frame_next = [
        {transform: 'translateX(0)', easing: 'ease-in-out'},
        {transform: 'translateX(.75rem)', easing: 'ease-in-out'}
    ];
    let key_frame_common = {
        duration: 175,
        iterations: 1,
    }
    prev_btn.addEventListener('click', click_prev);
    next_btn.addEventListener('click', click_next);
}