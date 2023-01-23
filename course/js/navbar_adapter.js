import {setLinksStyle} from "./link_style.js";
import {addLinkAnimation} from "./link_animation.js";

export function adaptNavbar() {
    let links_breakpoint = 1024;
    let profile_btn_breakpoint = 768;
    let windowWidth = window.innerWidth;
    if (windowWidth < links_breakpoint) {
        if ($('.nav-link-item').length !== 0)
            removeLinks();
    } else {
        if ($('.nav-link-item').length === 0)
            addLinks();
    }
    setLinksStyle();
    addLinkAnimation();
    if (windowWidth >= profile_btn_breakpoint) {
        if ($('#profile-btn-p').length === 0 && $('#profile-btn-container').length !== 0)
            $('#profile-btn-avatar').after('<p id="profile-btn-p">Мой профиль</p>');
    } else {
        if ($('#profile-btn-p').length !== 0)
            $('#profile-btn-p').remove();
    }
}

function removeLinks() {
    $('.nav-link-item').each( function () {
        $(this).remove();
    });
    $('#nav-container').children().first().after('' +
        '<div class="dropdown-links-block">' +
        '    <div class="dropdown">' +
        '        <a class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
        '            Модули' +
        '        </a>' +
        '        <ul class="dropdown-menu" id="modules-menu">' +
        '            <li><a class="dropdown-item" href="#module1">Модуль 1</a></li>' +
        '            <li><a class="dropdown-item" href="#module2/part1">Модуль 2</a></li>' +
        '            <li><a class="dropdown-item" href="#module3">Модуль 3</a></li>' +
        '            <li><a class="dropdown-item" href="#module4/part1">Модуль 4</a></li>' +
        '            <li><a class="dropdown-item" href="#module5">Модуль 5</a></li>' +
        '        </ul>' +
        '    </div>' +
        '<div class="link-line active" id="link-line-modules"></div>' +
        '</div>');
}

function addLinks() {
    $('.dropdown-links-block').remove();
    $('#nav-container').children().first().after(''+
        '<div class="nav-link-item">' +
        '            <div class="nav-link-wrapper">' +
        '                <div class="nav-link-block">' +
        '                    <a class="nav-link" href="#module1">Модуль 1</a>' +
        '                    <div class="link-line"></div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="nav-link-item">' +
        '            <div class="nav-link-wrapper">' +
        '                <div class="nav-link-block">' +
        '                    <a class="nav-link" href="#module2/part1">Модуль 2</a>' +
        '                    <div class="link-line"></div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="nav-link-item">' +
        '            <div class="nav-link-wrapper">' +
        '                <div class="nav-link-block">' +
        '                    <a class="nav-link" href="#module3">Модуль 3</a>' +
        '                    <div class="link-line"></div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="nav-link-item">' +
        '            <div class="nav-link-wrapper">' +
        '                <div class="nav-link-block">' +
        '                    <a class="nav-link" href="#module4/part1">Модуль 4</a>' +
        '                    <div class="link-line"></div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '        <div class="nav-link-item">' +
        '            <div class="nav-link-wrapper">' +
        '                <div class="nav-link-block">' +
        '                    <a class="nav-link" href="#module5">Модуль 5</a>' +
        '                    <div class="link-line"></div>' +
        '                </div>' +
        '            </div>' +
        '        </div>');
}