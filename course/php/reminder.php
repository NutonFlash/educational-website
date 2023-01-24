<?php

use FaaPz\PDO\Clause\Conditional;

include_once('DB_Manager.php');
require_once '../vendor/autoload.php';

$dbManager = new DB_Manager();
$db = $dbManager->connectDB();
$result = $db->select(['email', 'creation_date'])->from('users')->where(new Conditional('has_access', '=', 0))->execute()->fetchAll(PDO::FETCH_ASSOC);

date_default_timezone_set('Europe/Moscow');

$mail1 = '';
$mail2 = '';

for ($i=0; $i<sizeof($result); $i++) {
    $date = DateTime::createFromFormat('Y-m-d G:i:s', $result[$i]['creation_date']);
    if (date('Y-m-d', strtotime('-10 days')) === date('Y-m-d', $date->getTimestamp())) {
        $mail1 .= $result[$i]['email'] . ',';
    }
    if (date('Y-m-d', strtotime('-25 days')) === date('Y-m-d', $date->getTimestamp())) {
        $mail2 .= $result[$i]['email'] . ',';
    }
}

$mail1 = rtrim($mail1, ',');
$mail2 = rtrim($mail2, ',');

$message1 = file_get_contents('../views/utilities/mails/reminder_mail1.html');
$message2 = file_get_contents('../views/utilities/mails/reminder_mail2.html');
$subject = 'Еще не забыл?';
$preferences = ['input-charset' => 'UTF-8', 'output-charset' => 'UTF-8'];
$encoded_subject = iconv_mime_encode('Subject', $subject, $preferences);
$encoded_subject = substr($encoded_subject, strlen('Subject: '));
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
if (strlen($mail1) > 0)
    mail($mail1, $encoded_subject, $message1, $headers);
if (strlen($mail2) > 0)
    mail($mail2, $encoded_subject, $message2, $headers);