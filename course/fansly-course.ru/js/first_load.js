import {bindScripts} from "./bind_scripts.js";
import {initApp} from "./app.js";

$(document).ready(function () {
    if ($('#first-load')) {
        let path = window.location.hash.replace('#', '');
        if (path === '')
            path = 'module1';
        $.ajax({
            url: 'php/requestHandler.php?' + path + '&isFirstLoad',
            type: 'GET'
        }).done(function (data) {
            document.body.innerHTML = data;
            initApp();
            bindScripts();
        });
    }
});