<?php
include_once('AuthUtilities.php');
require_once '../vendor/autoload.php';

$response_code = AuthUtilities::resetPassword();
echo '{"responseCode":' . $response_code . '}';
