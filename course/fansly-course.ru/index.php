<?php

include_once ('php/AuthUtilities.php');
require_once 'vendor/autoload.php';

function cors() {
    
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9');
        header('Accept-encoding: gzip, deflate, br');
        header('Accept-language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7');
        header('Cache-control: max-age=0');
        header('User-agent: '.$_SERVER['HTTP_USER_AGENT']);
        header('Referrer-Policy: no-referrer-when-downgrade');
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, HEAD, MATCH, DELETE");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
}

cors();
AuthUtilities::checkCookie();
include_once('views/first-load-index.html');

