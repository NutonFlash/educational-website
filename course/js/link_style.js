export function setLinksStyle() {
    let path = document.location.hash.replace('#', '').replace('?', '');
    let reg = /\w+\/\w+/;
    // set class active for sidebar and navbar links
    if (path.match(reg)) {
        let pathSplitted = path.split('/', 2);
        let partNumber = pathSplitted[1].split('part')[1];
        let side_links = document.querySelectorAll('.sidebar-link');
        for (let i = 0; i < side_links.length; i++) {
            if (i === partNumber - 1)
                side_links[i].classList.add('active');
            else
                side_links[i].classList.remove('active');
        }
        let moduleNumber = pathSplitted[0].split('module')[1];
        if ($('.dropdown-links-block').length === 0) {
            let nav_links = document.querySelectorAll('.nav-link');
            let nav_lines = document.querySelectorAll('.link-line');
            for (let i = 0; i < nav_links.length; i++) {
                if (i === moduleNumber - 1) {
                    nav_links[i].classList.add('active');
                    nav_lines[i].classList.add('active');
                } else {
                    nav_links[i].classList.remove('active');
                    nav_lines[i].classList.remove('active');
                }
            }
        } else {
            let nav_links = document.querySelectorAll('.dropdown-links-block .dropdown-item');
            for (let i = 0; i < nav_links.length; i++) {
                if (i === moduleNumber - 1) {
                    nav_links[i].classList.add('active');
                } else {
                    nav_links[i].classList.remove('active');
                }
            }
        }
        // set class active for sidebar and navbar links, if proceed на module 1 или Module 3
        // устанвавливает классы active на navbar, если переход на модуль 2 или модуль 4
    } else {
        if (path.match('module1|module3|module5') || path === '') {
            let part;
            let cookies = document.cookie.split("; ");
            for (let i = 0; i < cookies.length; i++) {
                let keyValue = cookies[i].split('=');
                if (keyValue[0] === path) {
                    part = keyValue[1];
                }
            }
            let partNumber;
            if (path === '')
                partNumber = 1;
            else
                partNumber = part.split('part')[1];
            let side_links = document.querySelectorAll('.sidebar-link');
            for (let i = 0; i < side_links.length; i++) {
                if (i === partNumber - 1)
                    side_links[i].classList.add('active');
                else
                    side_links[i].classList.remove('active');
            }
        }
        let moduleNumber;
        if (path === '')
            moduleNumber = 1;
        else
            moduleNumber = path.split('module')[1];
        if ($('.dropdown-links-block').length === 0) {
            let nav_links = document.querySelectorAll('.nav-link');
            let nav_lines = document.querySelectorAll('.link-line');
            for (let i = 0; i < nav_links.length; i++) {
                if (i === moduleNumber - 1) {
                    nav_links[i].classList.add('active');
                    nav_lines[i].classList.add('active');
                } else {
                    nav_links[i].classList.remove('active');
                    nav_lines[i].classList.remove('active');
                }
            }
        } else {
            let nav_links = document.querySelectorAll('.dropdown-links-block .dropdown-item');
            for (let i = 0; i < nav_links.length; i++) {
                if (i === moduleNumber - 1) {
                    nav_links[i].classList.add('active');
                } else {
                    nav_links[i].classList.remove('active');
                }
            }
        }
    }
}