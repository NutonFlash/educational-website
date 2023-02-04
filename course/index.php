<?php

include_once ('php/AuthUtilities.php');
require_once 'vendor/autoload.php';

AuthUtilities::checkCookie();

include_once('views/first-load-index.html');