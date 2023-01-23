import {Router} from "./router.js";
import {Route} from "./route.js";
import {adaptNavbar} from "./navbar_adapter.js";

export function initApp() {

    let cookies = document.cookie.split("; ");
    let isAuth;
    for (let i = 0; i < cookies.length; i++) {
        let keyValue = cookies[i].split('=');
        if (keyValue[0] === 'isAuth') {
            isAuth = keyValue[1];
        }
    }
    if (isAuth === 'false') {
        $('#loginModalCenter').modal('show');
    }
    new Router([
        new Route('module1'),
        new Route('module1/part1'),
        new Route('module1/part2'),
        new Route('module1/part3'),
        new Route('module1/part4'),
        new Route('module1/part5'),
        new Route('module1/part6'),
        new Route('module1/part7'),
        new Route('module2/part1'),
        new Route('module3'),
        new Route('module3/part1'),
        new Route('module3/part2'),
        new Route('module3/part3'),
        new Route('module3/part4'),
        new Route('module3/part5'),
        new Route('module3/part6'),
        new Route('module3/part7'),
        new Route('module3/part8'),
        new Route('module3/part9'),
        new Route('module3/part10'),
        new Route('module3/part11'),
        new Route('module4/part1'),
        new Route('module5'),
        new Route('module5/part1'),
        new Route('module5/part2'),
        new Route('module5/part3'),
        new Route('module5/part4'),
        new Route('module5/part5'),
        new Route('module5/part6'),
        new Route('module5/part7'),
        new Route('module5/part8'),
        new Route('module5/part9')
    ]);
    window.onresize = adaptNavbar; 
}