<?php

include_once('AuthUtilities.php');
require_once '../vendor/autoload.php';

$relativePath = '../views/';

$isAuth = $_COOKIE['isAuth'];
$hasAccess = AuthUtilities::hasAccess();
$hash = $_SERVER['QUERY_STRING'];
$paths = explode('/', $_SERVER['QUERY_STRING'], 2);
$login = null;
$email = null;
$isFirstLoad = preg_match('#.+&isFirstLoad#', $_SERVER['QUERY_STRING']);
$isModule1 = preg_match('#module1#', $hash);
$isModule3 = preg_match('#module3#', $hash);
$isModule5 = preg_match('#module5#', $hash);
$hasHamburger = $isModule1 | $isModule3 | $isModule5;
$modal = null;
$sidebar = null;
$navbar = null;
$content = null;

if ($isAuth === 'true') {
    $login = $_COOKIE['login'];
    $email = $_COOKIE['email'];
}

if ($isFirstLoad) {
    $hash = explode('&', $_SERVER['QUERY_STRING'])[0];
    $paths = explode('/', $hash, 2);
}

if (preg_match('#module1/.+|module3/.+|module5/.+#', $hash)) {
    if ($paths[0] === 'module1') {
        setcookie('module1', $_COOKIE['module1'], time() - 3600, '/');
        setcookie('module1', $paths[1], time() + 60 * 60 * 24 * 14, '/');
    } else if ($paths[0] === 'module3') {
        setcookie('module3', $_COOKIE['module3'], time() - 3600, '/');
        setcookie('module3', $paths[1], time() + 60 * 60 * 24 * 14, '/');
    } else {
        setcookie('module5', $_COOKIE['module5'], time() - 3600, '/');
        setcookie('module5', $paths[1], time() + 60 * 60 * 24 * 14, '/');
    }
    include_once($relativePath . 'utilities/sidebar.html'); // sidebar
    include($relativePath . $hash . '.html'); // content
} else if (preg_match('#module1|module3|module5#', $hash)) {
    include_once($relativePath . 'utilities/sidebar.html'); // sidebar
    if ($hash === 'module1') {
        include_once($relativePath . $hash . '/' . $_COOKIE['module1'] . '.html'); // content
    } else if ($hash === 'module3'){
        include_once($relativePath . $hash . '/' . $_COOKIE['module3'] . '.html'); // content
    } else {
        include_once($relativePath . $hash . '/' . $_COOKIE['module5'] . '.html'); // content
    }
} else {
    include_once($relativePath . $hash . '.html'); //content
}
include_once($relativePath . 'utilities/navbar.html'); // navbar
include_once($relativePath . 'utilities/modal.html'); // modal
include_once('../views/utilities/footer.html'); // footer