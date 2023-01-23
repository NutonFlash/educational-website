<?php

include_once('AuthUtilities.php');
require_once '../vendor/autoload.php';

$response_code = AuthUtilities::loginUser();
if ($response_code === 0) {
    setcookie('isAuth', 'false', time() - 3600, '/');
    setcookie('isAuth', 'true', time() + 60 * 60 * 24 * 14, '/');
}
echo '{"responseCode":' . $response_code . '}';