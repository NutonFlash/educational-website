import {bindScripts} from "./bind_scripts.js";

export function Router(routes) {
    try {
        if (!routes) {
            throw 'error: routes param is mandatory';
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);
    }
}

Router.prototype = {
    routes: undefined,
    rootElement: document.body,
    relativePath: 'php/requestHandler.php?',
    constructor: function (routes) {
        this.routes = routes;
    },
    init: function () {
        let r = this.routes;
        (function (scope, r) {
            window.addEventListener('hashchange', function () {
                scope.hasChanged(scope, r);
            });
        })(this, r);
    },
    hasChanged: function (scope, r) {
        if ($('#first-load').length === 0) {
            for (let i = 0, length = r.length; i < length; i++) {
                let route = r[i];
                if (route.isActiveRoute(window.location.hash.substring(1))) {
                    scope.goToRoute(route.htmlName);
                }
            }
        }
    },
    goToRoute: function (htmlName) {
        (function (scope) {
            let path = scope.relativePath + htmlName;
            $.ajax({
                type: 'GET',
                url: path
            }).done(function (data) {
                scope.rootElement.innerHTML = data;
                bindScripts();
            });
        })(this);
    }
}
