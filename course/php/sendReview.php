<?php

include_once ('DB_Manager.php');
require_once '../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);
$responseCode = 1;
/*
     * Return codes
     * 0 - success creation of invoice
     * 1 - problem to connect to the DB
     * 2 - empty string
     * 3 - too long text
*/

if (isset($_COOKIE['login']) && isset($data['text']) && !empty($_COOKIE['login']) && !empty($data['text'])) {
    $login = $_COOKIE['login'];
    $text = $data['text'];
    if (strlen($text) <= 150) {
        try {
            $dbManager = new DB_Manager();
            $dbManager->setDsn('mysql:host=fansly-intro.ru;dbname=u1876096_intro;charset=UTF8');
            $dbManager->setUsr('u1876096_root');
            $dbManager->setPwd('NutonFlash2002108$');
            $db = $dbManager->connectDB();
            $db->insert(['login', 'text'])->into('reviews')->values($login, $text)->execute();
            $responseCode = 0;
        } catch (Error | PDOException $e) {
            error_log($e->getMessage());
        }
    } else $responseCode = 3;
} else $responseCode = 2;

echo '{"responseCode":' . $responseCode . '}';