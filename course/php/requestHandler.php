<?php

include_once('AuthUtilities.php');
require_once '../vendor/autoload.php';

$relativePath = '../views/';

$isAuth = $_COOKIE['isAuth'];
$hasAccess = AuthUtilities::hasAccess();
$hash = str_replace('.', '', htmlspecialchars($_SERVER['QUERY_STRING'], ENT_QUOTES));
$paths = explode('/', $hash, 2);
$login = null;
$email = null;
$isModule1 = preg_match('#module1#', $hash);
$isModule3 = preg_match('#module3#', $hash);
$isModule5 = preg_match('#module5#', $hash);
$hasHamburger = $isModule1 | $isModule3 | $isModule5;
$modal = null;
$sidebar = null;
$navbar = null;
$content = null;
$module1 = htmlspecialchars($_COOKIE['module1'], ENT_QUOTES);
$module3 = htmlspecialchars($_COOKIE['module3'], ENT_QUOTES);
$module5 = htmlspecialchars($_COOKIE['module5'], ENT_QUOTES);

if ($isAuth === 'true') {
    $login = $_COOKIE['login'];
    $email = $_COOKIE['email'];
}

if (preg_match('#module1/.+|module3/.+|module5/.+#', $hash)) {
    if ($paths[0] === 'module1') {
        setcookie('module1', $module1, time() - 3600, '/');
        setcookie('module1', $paths[1], time() + 60 * 60 * 24 * 14, '/');
    } else if ($paths[0] === 'module3') {
        setcookie('module3', $module3, time() - 3600, '/');
        setcookie('module3', $paths[1], time() + 60 * 60 * 24 * 14, '/');
    } else {
        setcookie('module5', $module5, time() - 3600, '/');
        setcookie('module5', $paths[1], time() + 60 * 60 * 24 * 14, '/');
    }
    include_once ($relativePath . 'utilities/sidebar.html'); // sidebar
    include_once ($relativePath . $hash . '.html'); // content
} else if (preg_match('#module1|module3|module5#', $hash)) {
    include_once ($relativePath . 'utilities/sidebar.html'); // sidebar
    if ($hash === 'module1') {
        include_once ($relativePath . $hash . '/' . $module1 . '.html'); // content
    } else if ($hash === 'module3') {
        include_once $relativePath . $hash . '/' . $module3 . '.html'; // content
    } else {
        include_once $relativePath . $hash . '/' . $module5 . '.html'; // content
    }
} else {
    include_once $relativePath . $hash . '.html'; //content
}
include_once($relativePath . 'utilities/navbar.html'); // navbar
include_once($relativePath . 'utilities/modal.html'); // modal
include_once('../views/utilities/footer.html'); // footer