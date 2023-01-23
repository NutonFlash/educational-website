export function addLinkAnimation() {

    /* Hover animation of links in the navbar */

    function linkHoverOver() {
        let line = $(this)[0].childNodes[3];
        if (!line.classList.contains('active')) {
            $(line).css({
                'opacity': '1',
                'transition': 'transform .65s ease',
                'transform': 'translateX(0)'
            });
        }
    }

    function linkHoverOut() {
        let line = $(this)[0].childNodes[3];
        if (!line.classList.contains('active')) {
            $(line).css({
                'transform': 'translateX(100%)',
                'transition': 'transform .35s ease'
            });
            $(line).addClass('hover-over');
        }
    }

    let links_div = $('.nav-link-block');
    links_div.hover(linkHoverOver, linkHoverOut);

    document.querySelectorAll('.link-line').forEach(function (elem) {
            elem.addEventListener("transitionend", function () {
                    if (elem.classList.contains('hover-over') && !elem.classList.contains('active')) {
                        elem.classList.remove('hover-over');
                        $(elem).css({
                            'opacity': '0',
                            'transform': 'translateX(-100%)'
                        });
                    }
                }
            );
        }
    );

    /* Navbar link listener, rm/add active class */

    let nav_links = $('.nav-link');
    let nav_link_lines = $('.link-line');

    Array.of(nav_links).forEach(function (link) {
        link.bind('click', function () {
            Array.of(nav_links).forEach(function (link_elem) {
                link_elem.removeClass('active');
            });
            $(this).addClass('active');
            Array.of(nav_link_lines).forEach(function (line_elem) {
                line_elem.removeClass('active');
                line_elem.css({
                    'opacity': '0',
                    'transform': 'translateX(-100%)',
                    'transition': '1ms'
                });
            });
            $(this)[0].nextElementSibling.classList.add('active');
            $(this)[0].nextElementSibling.style = {
                'opacity': '1',
                'transform': 'translateX(0)'
            }
        })
    });
}