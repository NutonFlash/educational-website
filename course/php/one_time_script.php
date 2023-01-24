<?php

use FaaPz\PDO\Clause\Conditional;

include_once('DB_Manager.php');
require_once '../vendor/autoload.php';

$dbManager = new DB_Manager();
$db = $dbManager->connectDB();
$result = $db->select(['email'])->from('users')->where(new Conditional('has_access', '=', 0))->execute()->fetchAll(PDO::FETCH_ASSOC);

$emails = '';
for ($i=0; $i<sizeof($result);$i++) {
    $emails .= $result[$i]['email'];
}

$message = file_get_contents('../views/utilities/mails/reminder_mail1.html');
$subject = 'Еще не забыл?';
$preferences = ['input-charset' => 'UTF-8', 'output-charset' => 'UTF-8'];
$encoded_subject = iconv_mime_encode('Subject', $subject, $preferences);
$encoded_subject = substr($encoded_subject, strlen('Subject: '));
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
mail('my.mr5@mail.ru', $encoded_subject, $message, $headers);