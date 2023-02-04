import {bindScripts} from "./bind_scripts.js";
import {initApp} from "./app.js";
import {isHashOk} from "./XSS_protection.js";

$(document).ready(function () {
    if ($('#first-load')) {
        let path = window.location.hash.replace('#', '');
        if (path === '')
            path = 'module1';
        if (!isHashOk(path)) {
            alert('XSS alert');
            return;
        }
        $.ajax({
            url: 'php/requestHandler.php?' + path,
            type: 'GET'
        }).done(function (data) {
            console.log(data);
            document.body.innerHTML = DOMPurify.sanitize(data);
            initApp();
            bindScripts();
        });
    }
});