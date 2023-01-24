<?php
use FaaPz\PDO\Clause\Conditional;
use Qiwi\Api\BillPayments;
use Qiwi\Api\BillPaymentsException;

include_once ('DB_Manager.php');
require_once '../vendor/autoload.php';

date_default_timezone_set('Europe/Moscow');

$PRIVATE_KEY = 'eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6ImFqbzFqOS0wMCIsInVzZXJfaWQiOiI3OTEyMDUxMzE4OCIsInNlY3JldCI6IjNhMDE1MDNhMTU4YWM3NWI4NWY4Y2Y0Zjc5NTE4OTg1OTA3NDVlZTA4ZTk0NTBiYmMwYjNlNDUzMTEzZGI3MjMifX0=';
$THEME_CODE = 'Aleksandr-MvZ9vZCxXe';
try {
    $crypto = random_bytes(32);
    $billId = bin2hex(random_bytes(32));
} catch (Exception $e){ error_log($e->getMessage());}

$PRICE = 5400;
$discount = 0;
$responseCode = 2;
$payUrl = '';
/*
     * Return codes
     * 0 - success creation of invoice
     * 1 - problem to connect to the DB
     * 2 - problem to connect to the QIWI API
     * 3 - unset properties
     * 4 - wrong reference format
     * 5 - wrong name format
     * 6 - wrong email format
     * 7 - email not found
     * 8 - reference not found
*/
$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['name']) && isset($data['email'])) {
    $reference_code = $data['reference_code'];
    $name = $data['name'];
    $email = $data['email'];
    try {
        if ($reference_code !== null) {
            if (!validateReferenceFormat($reference_code))
                $responseCode = 4;
            else if (!validateReference($reference_code))
                $reference_code = 8;
            else
                $discount = getDiscount($reference_code);
        }

        if (!validateNameFormat($name))
            $responseCode = 5;
        if (!validateEmailFormat($email))
            $responseCode = 6;
        else if (!validateEmail($email))
            $responseCode = 7;
    } catch (PDOException $e) {
        error_log($e->getMessage());
        $responseCode = 1;
    }

    if ($responseCode === 2) {
        $expirationDate = date('Y-m-d\TH:i:s', time() + 60*60*3) . '+03:00';
        $customFields = ['themeCode' => 'Aleksandr-MvZ9vZCxXe'];
        $fields = [
            'amount' => $PRICE - $discount,
            'currency' => 'RUB',
            'comment' => '',
            'expirationDateTime' => '2022-12-17T07:03:00+03:00',
            'email' => $email,
            'account' => $name,
            'customFields' => $customFields
        ];

        try {
            $billPayments = new BillPayments($PRIVATE_KEY);
            $response = $billPayments->createBill($billId, $fields);
            if (isset($response['payUrl'])) {
                $responseCode = 0;
                $payUrl = $response['payUrl'];
                $dbManager = new DB_Manager();
                $db = $dbManager->connectDB();
                $db->insert(['id','email','status','value','creation_date','refer_code','name'])->into('payments')->values($billId,$email,'WAITING',$PRICE-$discount,date('y-m-dTG:i:s', time()), $reference_code, $name)->execute();
            }
        } catch (ErrorException|BillPaymentsException $e) {
            error_log($e->getMessage());
        }
    }
} else $responseCode = 3;

echo '{"responseCode":' .  $responseCode . ',"payUrl":"' . $payUrl . '"}';

function validateReferenceFormat($reference_code) {
    return preg_match('#\d{6}#', $reference_code);
}

function validateNameFormat($name) {
    return preg_match('#([A-Za-zА-Яа-я]+)\s?+#', $name);
}

function validateEmailFormat($email) {
    return preg_match('#^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$#', $email);
}

function validateReference($reference_code) {
    $dbManager = new DB_Manager();
    $db = $dbManager->connectDB();
    $results = $db->select(['discount'])->from('merchants')->where(new Conditional('reference_code', '=', $reference_code))->execute();
    return $results->rowCount() > 0;
}

function validateEmail($email) {
    $dbManager = new DB_Manager();
    $db = $dbManager->connectDB();
    $results = $db->select(['email'])->from('users')->where(new Conditional('email', '=', $email))->execute();
    return $results->rowCount() > 0;
}

function getDiscount($reference_code) {
    $dbManager = new DB_Manager();
    $db = $dbManager->connectDB();
    $discount = 0;
    $results = $db->select(['discount'])->from('merchants')->where(new Conditional('reference_code', '=', $reference_code))->execute();
    if ($results->rowCount() > 0) {
        $discount = $results->fetch(PDO::FETCH_ASSOC)['discount'];
    }
    return $discount;
}