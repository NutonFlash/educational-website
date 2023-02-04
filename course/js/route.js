export function Route(htmlName) {
    try {
        if (!htmlName) {
            throw 'error: name and htmlName params are mandatories'
        }
        this.constructor(htmlName);
    } catch (e) {
        console.error(e);
    }
}

Route.prototype = {
    htmlName: undefined,
    constructor: function (htmlName) {
        this.htmlName = htmlName;
    },
    isActiveRoute: function (hashedPath) {
        return hashedPath.replace('#', '') === this.htmlName;
    }
}