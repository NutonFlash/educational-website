$(document).ready(function () {
    document.addEventListener('animationend', (event) => {

        if (event.target.className === 'onlyfans') {
            function onEntry(entry) {
                entry.forEach(change => {
                    if (change.isIntersecting) {
                        change.target.classList.add('show-element');
                    }
                });
            }

            let width = $('body').innerWidth();
            let options = {
                threshold: [0.15]
            };

            let elements = $('.benefits > h2, .benefits > h3, .benefits .col-md, .operator, .for-who, .conditions > h2, .conditions .col-sm, .salary, .program > h2, .program .col-md, #button2, .reviews, .footer, .contact');

            if (width >= 576 && width < 768) {
                elements = $('.benefits > h2, .benefits > h3, .benefits .col-md, .operator, .for-who, .conditions, .salary, .program > h2, .program .col-md, #button2, .reviews, .footer, .contact');
                options = {threshold: [0.15]};
            } else if (width >= 768) {
                elements = $('.benefits > h2, .benefits > h3, .benefits .row, .operator, .for-who, .conditions, .salary, .program, #button2, .reviews, .footer, .contact');
                options = {
                    threshold: [0.05]
                };
            }

            let observer = new IntersectionObserver(onEntry, options);
            for (let elm of elements) {
                observer.observe(elm);
            }
        }
    }); 
});