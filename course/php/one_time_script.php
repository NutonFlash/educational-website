<?php
$message = file_get_contents('../views/utilities/mails/reminder_mail.html');
$subject = 'Еще не забыл?';
$preferences = ['input-charset' => 'UTF-8', 'output-charset' => 'UTF-8'];
$encoded_subject = iconv_mime_encode('Subject', $subject, $preferences);
$encoded_subject = substr($encoded_subject, strlen('Subject: '));
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
mail('my.mr5@mail.ru', $encoded_subject, $message, $headers);