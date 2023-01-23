<?php

use FaaPz\PDO\Clause\Conditional;
use FaaPz\PDO\Clause\Grouping;
include_once('DB_Manager.php');
require_once '../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);
$responseCode = 1;
/*
     * Return codes
     * 0 - success creation of invoice
     * 1 - problem to connect to the DB
     * 2 - unset property
     * 3 - email or login not found
*/
if (isset($data['email'])) {
    try {
        $dbManager = new DB_Manager();
        $db = $dbManager->connectDB();
        $result = $db->select(['email'])->from('users')->where(new Grouping('OR', new Conditional('email', '=', $data['email']), new Conditional('login', '=', $data['email'])))->execute();
        if ($result->rowCount() === 0) {
            $responseCode = 3;
        } else {
            $newPwd = $data['password'];
            $email = $result->fetch(PDO::FETCH_ASSOC)['email'];
            $message = file_get_contents('../views/utilities/mails/change_pwd_mail.html');
            $message = str_replace('$newPwd', $newPwd, strval($message));
            $subject = 'Смена пароля';
            $preferences = ['input-charset' => 'UTF-8', 'output-charset' => 'UTF-8'];
            $encoded_subject = iconv_mime_encode('Subject', $subject, $preferences);
            $encoded_subject = substr($encoded_subject, strlen('Subject: '));
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
            mail($email, $encoded_subject, $message, $headers);
            $db->update(['password' => $newPwd])->table('users')->where(new Grouping('OR', new Conditional('email', '=', $data['email']), new Conditional('login', '=', $data['email'])))->execute();
            $responseCode = 0;
        }
    } catch (PDOException $e) {
        error_log($e->getMessage());
    }
} else $responseCode = 2;

echo '{"responseCode":' . $responseCode . '}';