<?php

include_once ('php/DB_Manager.php');
require_once 'vendor/autoload.php';

$rows = null;
try {
    $dbManager = new DB_Manager();
    $db = $dbManager->connectDB();
    $result = $db->select(['login', 'text'])->from('reviews')->orderBy('LENGTH(text)','DESC')->execute();
    $pairs = $result->fetchAll(PDO::FETCH_ASSOC);
} catch (Error | PDOException $e) {
    error_log($e->getMessage());
}

include_once ('index.html');
